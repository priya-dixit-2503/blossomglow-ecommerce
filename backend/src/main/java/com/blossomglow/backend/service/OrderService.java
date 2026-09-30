package com.blossomglow.backend.service;

import com.blossomglow.backend.dto.OrderDTO;
import com.blossomglow.backend.entity.Order;
import com.blossomglow.backend.entity.OrderItem;
import com.blossomglow.backend.entity.OrderStatus;
import com.blossomglow.backend.entity.Product;
import com.blossomglow.backend.exception.ResourceNotFoundException;
import com.blossomglow.backend.repository.OrderRepository;
import com.blossomglow.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderDTO createOrder(OrderDTO dto) {
        String orderNumber = "BG-" + (1000 + new Random().nextInt(9000));
        String trackingNumber = "BLUEDART-BG" + System.currentTimeMillis() % 1000000;
        String estimatedDelivery = LocalDate.now().plusDays(3).format(DateTimeFormatter.ofPattern("EEEE, MMM d"));

        BigDecimal calculatedSubtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .shippingAddress(dto.getShippingAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .paymentMethod(dto.getPaymentMethod())
                .status(OrderStatus.Confirmed)
                .trackingNumber(trackingNumber)
                .estimatedDeliveryDate(estimatedDelivery)
                .specialInstructions(dto.getSpecialInstructions())
                .build();

        for (OrderDTO.OrderItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElse(null);
            String prodName = product != null ? product.getName() : itemDto.getProductName();
            BigDecimal unitPrice = product != null ? product.getPrice() : itemDto.getUnitPrice();
            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            calculatedSubtotal = calculatedSubtotal.add(totalPrice);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(prodName)
                    .quantity(itemDto.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .selectedVessel(itemDto.getSelectedVessel())
                    .selectedWick(itemDto.getSelectedWick())
                    .selectedSize(itemDto.getSelectedSize())
                    .build();
            items.add(orderItem);
        }

        BigDecimal discount = dto.getDiscount() != null ? dto.getDiscount() : BigDecimal.ZERO;
        BigDecimal shippingFee = calculatedSubtotal.compareTo(BigDecimal.valueOf(1199)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(99);
        BigDecimal totalAmount = calculatedSubtotal.subtract(discount).add(shippingFee);

        order.setSubtotal(calculatedSubtotal);
        order.setDiscount(discount);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setItems(items);

        Order saved = orderRepository.save(order);
        return toDTO(saved);
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

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
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
        return OrderDTO.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
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
                .items(o.getItems().stream().map(i -> OrderDTO.OrderItemDTO.builder()
                        .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                        .productName(i.getProductName())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getTotalPrice())
                        .selectedVessel(i.getSelectedVessel())
                        .selectedWick(i.getSelectedWick())
                        .selectedSize(i.getSelectedSize())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
