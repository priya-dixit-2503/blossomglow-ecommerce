package com.blossomglow.backend.service;

import com.blossomglow.backend.dto.OrderDTO;
import com.blossomglow.backend.entity.*;
import com.blossomglow.backend.exception.ResourceNotFoundException;
import com.blossomglow.backend.repository.OrderRepository;
import com.blossomglow.backend.repository.ProductRepository;
import com.blossomglow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Resolves the currently authenticated User entity from JWT via SecurityContextHolder.
     */
    public User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal()) || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElse(null);
    }

    /**
     * Resolves a product by numeric ID, slug, or slug with/without "bg-" prefix.
     */
    public Product resolveProduct(Object productIdObj) {
        if (productIdObj == null) {
            return null;
        }
        if (productIdObj instanceof Number) {
            return productRepository.findById(((Number) productIdObj).longValue()).orElse(null);
        }
        String str = productIdObj.toString().trim();
        try {
            Long id = Long.parseLong(str);
            Optional<Product> byId = productRepository.findById(id);
            if (byId.isPresent()) return byId.get();
        } catch (NumberFormatException ignored) {}

        return productRepository.findBySlug(str)
                .or(() -> !str.startsWith("bg-") ? productRepository.findBySlug("bg-" + str) : Optional.empty())
                .or(() -> str.startsWith("bg-") ? productRepository.findBySlug(str.substring(3)) : Optional.empty())
                .orElse(null);
    }

    @Transactional
    public OrderDTO createOrder(OrderDTO dto) {
        String orderNumber = (dto.getOrderNumber() != null && !dto.getOrderNumber().isBlank())
                ? dto.getOrderNumber()
                : "BG-" + (1000 + new Random().nextInt(9000));
        String trackingNumber = (dto.getTrackingNumber() != null && !dto.getTrackingNumber().isBlank())
                ? dto.getTrackingNumber()
                : "BLUEDART-BG" + (System.currentTimeMillis() % 1000000);
        String estimatedDelivery = LocalDate.now().plusDays(3).format(DateTimeFormatter.ofPattern("EEEE, MMM d"));

        // Automatically associate order with the logged-in user from JWT authentication
        User user = getAuthenticatedUser();
        if (user == null && dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId()).orElse(null);
        }
        if (user == null && dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user = userRepository.findByEmail(dto.getEmail().trim().toLowerCase()).orElse(null);
        }

        if (user != null) {
            log.info("Associating order {} with authenticated user ID: {}, email: {}", orderNumber, user.getId(), user.getEmail());
        }

        BigDecimal calculatedSubtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        String customerFullName = dto.getFullName();
        if (customerFullName == null || customerFullName.isBlank()) {
            customerFullName = user != null ? user.getFullName() : "Valued Customer";
        }

        String customerEmail = user != null ? user.getEmail() : dto.getEmail();
        if (customerEmail == null || customerEmail.isBlank()) {
            customerEmail = "guest@blossomglow.com";
        }

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .fullName(customerFullName)
                .email(customerEmail)
                .phone(dto.getPhone() != null ? dto.getPhone() : (user != null && user.getPhone() != null ? user.getPhone() : ""))
                .shippingAddress(dto.getShippingAddress() != null ? dto.getShippingAddress() : "")
                .city(dto.getCity() != null ? dto.getCity() : "")
                .state(dto.getState() != null ? dto.getState() : "")
                .pincode(dto.getPincode() != null ? dto.getPincode() : "")
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "Cash on Delivery")
                .status(dto.getStatus() != null ? dto.getStatus() : OrderStatus.Confirmed)
                .trackingNumber(trackingNumber)
                .estimatedDeliveryDate(estimatedDelivery)
                .specialInstructions(dto.getSpecialInstructions())
                .build();

        if (dto.getItems() != null) {
            for (OrderDTO.OrderItemDTO itemDto : dto.getItems()) {
                Product product = resolveProduct(itemDto.getProductId());
                String prodName = product != null ? product.getName() : itemDto.getProductName();
                if (prodName == null || prodName.isBlank()) prodName = "BlossomGlow Artisanal Candle";

                BigDecimal unitPrice = product != null ? product.getPrice() : (itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : BigDecimal.valueOf(499));
                int quantity = (itemDto.getQuantity() != null && itemDto.getQuantity() > 0) ? itemDto.getQuantity() : 1;
                BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
                calculatedSubtotal = calculatedSubtotal.add(totalPrice);

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .productName(prodName)
                        .quantity(quantity)
                        .unitPrice(unitPrice)
                        .totalPrice(totalPrice)
                        .selectedVessel(itemDto.getSelectedVessel() != null ? itemDto.getSelectedVessel() : "Fluted Ivory")
                        .selectedWick(itemDto.getSelectedWick() != null ? itemDto.getSelectedWick() : "Organic Cotton Wick")
                        .selectedSize(itemDto.getSelectedSize() != null ? itemDto.getSelectedSize() : "280g (Double Wick)")
                        .build();
                items.add(orderItem);
            }
        }

        BigDecimal discount = dto.getDiscount() != null ? dto.getDiscount() : BigDecimal.ZERO;
        BigDecimal shippingFee = calculatedSubtotal.compareTo(BigDecimal.valueOf(999)) >= 0 || items.isEmpty()
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(99);
        BigDecimal totalAmount = calculatedSubtotal.subtract(discount).add(shippingFee);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) totalAmount = BigDecimal.ZERO;

        order.setSubtotal(calculatedSubtotal);
        order.setDiscount(discount);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setItems(items);

        Order saved = orderRepository.save(order);
        return toDTO(saved);
    }

    /**
     * Retrieves an order by ID ensuring customers can ONLY view their own orders.
     */
    @Transactional(readOnly = true)
    public OrderDTO getOrderByIdForUser(Long id, User caller, boolean isAdmin) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!isAdmin) {
            if (caller == null) {
                throw new AccessDeniedException("Authentication required to view order details.");
            }
            boolean isOwner = (order.getUser() != null && order.getUser().getId().equals(caller.getId()))
                    || (order.getEmail() != null && order.getEmail().equalsIgnoreCase(caller.getEmail()));
            if (!isOwner) {
                throw new AccessDeniedException("403 Forbidden: Access Denied. Customers can only view their own orders.");
            }
        }

        return toDTO(order);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return toDTO(order);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
        return toDTO(order);
    }

    /**
     * Admin view of all orders across the atelier
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Customer view of strictly their own orders
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersForUser(User user) {
        if (user == null) return List.of();
        return orderRepository.findByUserOrEmailOrderByCreatedAtDesc(user, user.getEmail()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status, String trackingNumber) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        order.setStatus(status);
        if (trackingNumber != null && !trackingNumber.trim().isEmpty()) {
            order.setTrackingNumber(trackingNumber);
        }
        Order updated = orderRepository.save(order);
        return toDTO(updated);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByEmail(String email) {
        if (email == null || email.isBlank()) return List.of();
        return orderRepository.findByEmailOrderByCreatedAtDesc(email).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO toDTO(Order o) {
        OrderDTO.CustomerInfoDTO custInfo = OrderDTO.CustomerInfoDTO.builder()
                .fullName(o.getFullName())
                .email(o.getEmail())
                .phone(o.getPhone())
                .address(o.getShippingAddress())
                .shippingAddress(o.getShippingAddress())
                .city(o.getCity())
                .state(o.getState())
                .pincode(o.getPincode())
                .specialInstructions(o.getSpecialInstructions())
                .build();

        return OrderDTO.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .userId(o.getUser() != null ? o.getUser().getId() : null)
                .fullName(o.getFullName())
                .email(o.getEmail())
                .phone(o.getPhone())
                .shippingAddress(o.getShippingAddress())
                .city(o.getCity())
                .state(o.getState())
                .pincode(o.getPincode())
                .subtotal(o.getSubtotal())
                .discount(o.getDiscount())
                .shippingFee(o.getShippingFee())
                .totalAmount(o.getTotalAmount())
                .paymentMethod(o.getPaymentMethod())
                .status(o.getStatus())
                .trackingNumber(o.getTrackingNumber())
                .estimatedDeliveryDate(o.getEstimatedDeliveryDate())
                .specialInstructions(o.getSpecialInstructions())
                .createdAt(o.getCreatedAt())
                .customerInfo(custInfo)
                .items(o.getItems() != null ? o.getItems().stream().map(i -> OrderDTO.OrderItemDTO.builder()
                        .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                        .productName(i.getProductName())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getTotalPrice())
                        .selectedVessel(i.getSelectedVessel())
                        .selectedWick(i.getSelectedWick())
                        .selectedSize(i.getSelectedSize())
                        .build()).collect(Collectors.toList()) : List.of())
                .build();
    }
}
