export interface CodeFile {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const SPRING_BOOT_BACKEND_CODE: CodeFile[] = [
  {
    filename: 'CandleProductController.java',
    language: 'java',
    description: 'REST Controller with Java 21 Virtual Threads & Spring Boot 3.3',
    code: `package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.ProductResponseDTO;
import com.blossomglow.backend.model.Product;
import com.blossomglow.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://*.run.app"})
public class CandleProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String fragranceFamily,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(productService.findFilteredProducts(category, fragranceFamily, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetails(id));
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<List<ProductResponseDTO>> getBestSellers() {
        return ResponseEntity.ok(productService.getFeaturedBestSellers());
    }
}`
  },
  {
    filename: 'CartController.java',
    language: 'java',
    description: 'Spring Boot REST Controller for Shopping Bag, Session Sync & Redis/MySQL Persistence',
    code: `package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.CartItemRequestDTO;
import com.blossomglow.backend.dto.CartResponseDTO;
import com.blossomglow.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/cart", "/api/v1/cart"})
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://*.run.app"})
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(cartService.getCartDTO(sessionToken));
    }

    @PostMapping({"", "/items"})
    public ResponseEntity<CartDTO> addToCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(
                sessionToken,
                request.getProductId(),
                request.getQuantity(),
                request.getSelectedVessel(),
                request.getSelectedWick(),
                request.getSelectedSize()
        ));
    }

    @PutMapping({"/{id}", "/items/{id}"})
    public ResponseEntity<CartDTO> updateCartItem(
            @PathVariable Long id,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @RequestBody UpdateQuantityRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(sessionToken, id, request.getQuantity()));
    }

    @DeleteMapping({"/{id}", "/items/{id}"})
    public ResponseEntity<CartDTO> removeCartItem(
            @PathVariable Long id,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(cartService.removeCartItem(sessionToken, id));
    }

    @DeleteMapping
    public ResponseEntity<CartDTO> clearCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(cartService.clearCart(sessionToken));
    }

    @PostMapping("/sync")
    public ResponseEntity<CartResponseDTO> syncCart(
            @RequestBody CartResponseDTO clientCart,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails != null ? userDetails.getUsername() : sessionToken;
        return ResponseEntity.ok(cartService.mergeCart(identifier, clientCart));
    }
}`
  },
  {
    filename: 'WishlistController.java',
    language: 'java',
    description: 'Spring Boot REST Controller for Saved Fragrance Wishlist & Customer Sync',
    code: `package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.WishlistResponseDTO;
import com.blossomglow.backend.dto.WishlistSyncRequestDTO;
import com.blossomglow.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/wishlist", "/api/v1/wishlist"})
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://*.run.app"})
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<String>> getWishlist(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails != null ? userDetails.getUsername() : sessionToken;
        return ResponseEntity.ok(wishlistService.getWishlistProductIds(identifier));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<List<String>> addToWishlist(
            @PathVariable String productId,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails != null ? userDetails.getUsername() : sessionToken;
        return ResponseEntity.ok(wishlistService.addProduct(identifier, productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<List<String>> removeFromWishlist(
            @PathVariable String productId,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails != null ? userDetails.getUsername() : sessionToken;
        return ResponseEntity.ok(wishlistService.removeProduct(identifier, productId));
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<List<String>> toggleWishlist(
            @PathVariable String productId,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails != null ? userDetails.getUsername() : sessionToken;
        return ResponseEntity.ok(wishlistService.toggleProduct(identifier, productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearWishlist(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails != null ? userDetails.getUsername() : sessionToken;
        wishlistService.clearWishlist(identifier);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sync")
    public ResponseEntity<List<String>> syncWishlist(
            @RequestBody WishlistSyncRequestDTO syncRequest,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails != null ? userDetails.getUsername() : sessionToken;
        return ResponseEntity.ok(wishlistService.mergeWishlist(identifier, syncRequest.getProductIds()));
    }
}`
  },
  {
    filename: 'Product.java',
    language: 'java',
    description: 'JPA Entity mapped to MySQL InnoDB tables with indexes',
    code: `package com.blossomglow.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_fragrance_family", columnList = "fragrance_family")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 255)
    private String tagline;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(name = "fragrance_family", nullable = false, length = 60)
    private String fragranceFamily;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "burn_time_hours", nullable = false)
    private Integer burnTimeHours;

    @Column(name = "weight_grams", nullable = false)
    private Integer weightGrams;

    @Column(name = "scent_intensity", nullable = false)
    private Integer scentIntensity;

    @Column(name = "top_notes", length = 300)
    private String topNotes;

    @Column(name = "heart_notes", length = 300)
    private String heartNotes;

    @Column(name = "base_notes", length = 300)
    private String baseNotes;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "in_stock", nullable = false)
    private Boolean inStock = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`
  },
  {
    filename: 'SecurityConfig.java',
    language: 'java',
    description: 'Spring Security 6 & Spring Boot 3.3 Production RBAC Security Configuration',
    code: `package com.blossomglow.backend.config;

import com.blossomglow.backend.security.JwtAuthenticationEntryPoint;
import com.blossomglow.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disabled for stateless JWT REST API
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // =========================================================================
                // 1. PUBLIC ENDPOINTS (No authentication required)
                // =========================================================================
                .requestMatchers(HttpMethod.GET,
                    "/api/v1/orders/track/**", "/api/orders/track/**" // Tracking shipment by tracking number
                ).permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/v1/products/**", "/api/products/**",
                    "/api/reviews/**"
                ).permitAll()
                .requestMatchers(HttpMethod.POST,
                    "/api/v1/auth/**", "/api/auth/**",
                    "/api/contact/**"
                ).permitAll()
                .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()

                // =========================================================================
                // 2. CUSTOMER ENDPOINTS (Requires authenticated ROLE_CUSTOMER or ROLE_ADMIN)
                // =========================================================================
                // Order Placement: Only authenticated customers can place orders
                .requestMatchers(HttpMethod.POST,
                    "/api/v1/orders", "/api/orders",
                    "/api/v1/orders/checkout", "/api/orders/checkout"
                ).hasAnyRole("CUSTOMER", "ADMIN")

                // Customer Order History: Customers can ONLY see their own orders
                .requestMatchers(HttpMethod.GET,
                    "/api/v1/orders/my-orders", "/api/orders/my-orders"
                ).hasAnyRole("CUSTOMER", "ADMIN")

                // Specific Order View: Customer can ONLY access their own order (verified via @orderSecurity)
                .requestMatchers(HttpMethod.GET,
                    "/api/v1/orders/{id}", "/api/orders/{id}"
                ).authenticated()

                // Shopping Cart & Wishlist
                .requestMatchers("/api/v1/cart/**", "/api/cart/**").permitAll() // session fallback / authenticated sync
                .requestMatchers("/api/v1/wishlist/**", "/api/wishlist/**").permitAll()

                // =========================================================================
                // 3. ADMIN ENDPOINTS (Requires ROLE_ADMIN)
                // =========================================================================
                // List all customer orders across the platform
                .requestMatchers(HttpMethod.GET,
                    "/api/v1/orders", "/api/orders"
                ).hasRole("ADMIN")

                // Update order fulfillment/shipping status
                .requestMatchers(HttpMethod.PUT,
                    "/api/v1/orders/*/status", "/api/orders/*/status"
                ).hasRole("ADMIN")

                // Order deletion/cancellation by admin
                .requestMatchers(HttpMethod.DELETE,
                    "/api/v1/orders/*", "/api/orders/*"
                ).hasRole("ADMIN")

                // Product catalog management
                .requestMatchers(HttpMethod.POST, "/api/v1/products/**", "/api/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/products/**", "/api/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**", "/api/products/**").hasRole("ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:3000", "https://*.run.app"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Session-Token", "X-Requested-With"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`
  },
  {
    filename: 'OrderController.java',
    language: 'java',
    description: 'Spring Boot REST Controller with Strict PUBLIC, CUSTOMER, and ADMIN RBAC',
    code: `package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.OrderRequestDTO;
import com.blossomglow.backend.dto.OrderResponseDTO;
import com.blossomglow.backend.dto.OrderStatusUpdateDTO;
import com.blossomglow.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/orders", "/api/orders"})
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://*.run.app"})
public class OrderController {

    private final OrderService orderService;

    // =========================================================================
    // 1. CUSTOMER: Place Order (Authenticated customer only)
    // =========================================================================
    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<OrderResponseDTO> createOrder(
            @Valid @RequestBody OrderRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Automatically tie order to the authenticated customer principal
        OrderResponseDTO created = orderService.processCustomerOrder(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // =========================================================================
    // 2. CUSTOMER: View Own Orders (Customers only see their own orders)
    // =========================================================================
    @GetMapping("/my-orders")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        // Queries exclusively orders belonging to the authenticated customer
        return ResponseEntity.ok(orderService.findOrdersByCustomerEmail(userDetails.getUsername()));
    }

    // =========================================================================
    // 3. CUSTOMER / ADMIN: View Specific Order by ID (Owner verification)
    // =========================================================================
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @orderSecurity.isOrderOwner(#id, authentication)")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @PathVariable Long id) {
        // Method security verifies: either ADMIN or order owner matching authentication.getName()
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // =========================================================================
    // 4. PUBLIC: Track Order by Tracking Number (No authentication required)
    // =========================================================================
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<OrderResponseDTO> trackOrder(
            @PathVariable String trackingNumber) {
        // Public tracking: returns shipment milestones while masking sensitive billing details
        return ResponseEntity.ok(orderService.trackOrderByNumber(trackingNumber));
    }

    // =========================================================================
    // 5. ADMIN ONLY: Retrieve All Orders Across the Platform
    // =========================================================================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    // =========================================================================
    // 6. ADMIN ONLY: Update Order Status (Fulfillment / Dispatch / Delivery)
    // =========================================================================
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDTO statusUpdate) {
        return ResponseEntity.ok(orderService.updateStatus(id, statusUpdate.getStatus()));
    }
}`
  },
  {
    filename: 'OrderSecurityService.java',
    language: 'java',
    description: 'Spring Security Bean enforcing Customer Data Isolation & Ownership Checks',
    code: `package com.blossomglow.backend.security;

import com.blossomglow.backend.model.Order;
import com.blossomglow.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("orderSecurity")
@RequiredArgsConstructor
public class OrderSecurityService {

    private final OrderRepository orderRepository;

    /**
     * Verifies that the order exists and strictly belongs to the authenticated customer principal.
     * Prevents Insecure Direct Object Reference (IDOR) attacks across customer accounts.
     */
    public boolean isOrderOwner(Long orderId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String principalUsername = authentication.getName();
        Optional<Order> orderOpt = orderRepository.findById(orderId);

        if (orderOpt.isEmpty()) {
            return false;
        }

        Order order = orderOpt.get();
        // Match customer email against the authenticated principal username
        return order.getCustomerEmail() != null &&
               order.getCustomerEmail().equalsIgnoreCase(principalUsername);
    }
}`
  },
  {
    filename: 'OrderRequestDTO.java',
    language: 'java',
    description: 'Authoritative Order Request DTO: Client never provides prices, discounts, shipping, or totals',
    code: `package com.blossomglow.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

/**
 * PRODUCTION SECURITY PATTERN:
 * Stop Trusting Frontend Prices.
 * 
 * Notice: This DTO deliberately omits price, subtotal, discount, shippingFee, and total.
 * The server is the SOLE authority for product pricing, inventory validation,
 * discount coupon verification, shipping fees, and grand totals.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDTO {

    @NotEmpty(message = "Order items list cannot be empty")
    @Valid
    private List<OrderItemRequestDTO> items;

    // Optional coupon code - validated strictly on the backend against promotion database
    private String couponCode;

    @NotNull(message = "Customer details are required")
    @Valid
    private CustomerInfoDTO customerInfo;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemRequestDTO {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        @Max(value = 50, message = "Exceeded purchase limit of 50 units per order")
        private Integer quantity;

        private String selectedVessel;
        private String selectedWick;
        private String selectedSize;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CustomerInfoDTO {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Phone number is required")
        private String phone;

        @NotBlank(message = "Shipping address is required")
        private String shippingAddress;

        @NotBlank(message = "City is required")
        private String city;

        @NotBlank(message = "State is required")
        private String state;

        @NotBlank(message = "Pincode is required")
        private String pincode;

        private String specialInstructions;
    }
}`
  },
  {
    filename: 'OrderServiceImpl.java',
    language: 'java',
    description: 'Authoritative Pricing Engine, Stock Locking, Coupon Validation & Total Recalculation Service',
    code: `package com.blossomglow.backend.service.impl;

import com.blossomglow.backend.dto.OrderRequestDTO;
import com.blossomglow.backend.dto.OrderResponseDTO;
import com.blossomglow.backend.exception.InsufficientStockException;
import com.blossomglow.backend.exception.ResourceNotFoundException;
import com.blossomglow.backend.model.Order;
import com.blossomglow.backend.model.OrderItem;
import com.blossomglow.backend.model.Product;
import com.blossomglow.backend.repository.OrderRepository;
import com.blossomglow.backend.repository.ProductRepository;
import com.blossomglow.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    /**
     * AUTHORITATIVE ORDER CREATION:
     * Never trust the browser for:
     * 1. Product price: read directly from database (Product entity)
     * 2. Quantity: validated >= 1 and <= 50
     * 3. Stock: atomically validated with pessimistic write locks and decremented
     * 4. Discount: evaluated against authoritative promotion rules
     * 5. Shipping: computed based on authoritative subtotal
     * 6. Total: strictly derived as (subtotal - discount + shipping)
     */
    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public OrderResponseDTO processCustomerOrder(OrderRequestDTO request, String authenticatedEmail) {
        log.info("Processing authoritative order for customer: {}", authenticatedEmail);

        BigDecimal authoritativeSubtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // 1. Process each item: validate existence, lock stock, retrieve DB price
        for (OrderRequestDTO.OrderItemRequestDTO itemReq : request.getItems()) {
            // Find product with pessimistic write lock to prevent race conditions during checkout
            Product product = productRepository.findByIdWithPessimisticLock(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + itemReq.getProductId()));

            // =================================================================
            // BUSINESS RULE: Reject if Requested quantity > available stock
            // =================================================================
            int availableStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            if (!Boolean.TRUE.equals(product.getInStock()) || availableStock <= 0) {
                throw new InsufficientStockException(String.format(
                        "Product '%s' is currently out of stock (Available: 0). Order rejected.",
                        product.getName()
                ));
            }
            if (itemReq.getQuantity() > availableStock) {
                throw new InsufficientStockException(String.format(
                        "Requested quantity (%d) exceeds available stock (%d) for product '%s'. Order rejected.",
                        itemReq.getQuantity(), availableStock, product.getName()
                ));
            }

            // =================================================================
            // BUSINESS RULE: Stock = Stock - Ordered Quantity
            // =================================================================
            int updatedStock = availableStock - itemReq.getQuantity();
            product.setStockQuantity(updatedStock);
            product.setInStock(updatedStock > 0);
            productRepository.save(product);

            // Server-Determined Price (IGNORING ANY CLIENT VALUES)
            BigDecimal unitPrice = product.getPrice();
            if ("Grande (450g)".equalsIgnoreCase(itemReq.getSelectedSize())) {
                unitPrice = unitPrice.multiply(BigDecimal.valueOf(1.6)).setScale(2, RoundingMode.HALF_UP);
            } else if ("Petite Votive (90g)".equalsIgnoreCase(itemReq.getSelectedSize())) {
                unitPrice = unitPrice.multiply(BigDecimal.valueOf(0.6)).setScale(2, RoundingMode.HALF_UP);
            }

            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            authoritativeSubtotal = authoritativeSubtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .vesselColor(itemReq.getSelectedVessel() != null ? itemReq.getSelectedVessel() : "Fluted Ivory")
                    .wickType(itemReq.getSelectedWick() != null ? itemReq.getSelectedWick() : "Organic Cotton")
                    .candleSize(itemReq.getSelectedSize() != null ? itemReq.getSelectedSize() : "Standard (240g)")
                    .build();

            orderItems.add(orderItem);
        }

        // 2. Authoritative Server-Side Discount Calculation
        BigDecimal authoritativeDiscount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            String code = request.getCouponCode().trim().toUpperCase();
            if ("GLOW10".equals(code) || "AURAGLOW".equals(code)) {
                authoritativeDiscount = authoritativeSubtotal.multiply(BigDecimal.valueOf(0.10)).setScale(2, RoundingMode.HALF_UP);
            } else if ("AUTUMN20".equals(code)) {
                if (authoritativeSubtotal.compareTo(BigDecimal.valueOf(1499)) >= 0) {
                    authoritativeDiscount = authoritativeSubtotal.multiply(BigDecimal.valueOf(0.20)).setScale(2, RoundingMode.HALF_UP);
                } else {
                    log.warn("Coupon AUTUMN20 rejected: subtotal {} below minimum 1499", authoritativeSubtotal);
                }
            }
        }

        // 3. Authoritative Server-Side Shipping Calculation
        // Free shipping on orders >= Rs. 999; otherwise flat Rs. 99 courier fee
        BigDecimal authoritativeShippingFee = authoritativeSubtotal.compareTo(BigDecimal.valueOf(999)) >= 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(99.00);

        // 4. Authoritative Total Calculation
        BigDecimal authoritativeTotal = authoritativeSubtotal
                .subtract(authoritativeDiscount)
                .add(authoritativeShippingFee)
                .max(BigDecimal.ZERO);

        // 5. Generate secure order & tracking numbers
        String orderNumber = "BG-" + java.time.Year.now().getValue() + "-" + (100000 + (int)(Math.random() * 900000));
        String trackingNumber = "BD-" + (100000000 + (long)(Math.random() * 900000000L));

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .trackingNumber(trackingNumber)
                .customerName(request.getCustomerInfo().getFullName())
                .customerEmail(authenticatedEmail) // Bound strictly to authenticated JWT user principal
                .customerPhone(request.getCustomerInfo().getPhone())
                .shippingAddress(request.getCustomerInfo().getShippingAddress())
                .city(request.getCustomerInfo().getCity())
                .state(request.getCustomerInfo().getState())
                .pincode(request.getCustomerInfo().getPincode())
                .subtotal(authoritativeSubtotal)
                .discount(authoritativeDiscount)
                .shippingFee(authoritativeShippingFee)
                .totalAmount(authoritativeTotal)
                .paymentMethod(request.getPaymentMethod())
                .orderStatus("CONFIRMED")
                .items(orderItems)
                .build();

        orderItems.forEach(i -> i.setOrder(order));
        Order savedOrder = orderRepository.save(order);

        return mapToDTO(savedOrder);
    }
}`
  },
  {
    filename: 'schema.sql',
    language: 'sql',
    description: 'Production MySQL DDL Schema for BlossomGlow Database',
    code: `-- BlossomGlow Candle Creations Database Schema
-- Target: MySQL 8.0+ / InnoDB / utf8mb4

CREATE DATABASE IF NOT EXISTS blossomglow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blossomglow_db;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    category VARCHAR(60) NOT NULL,
    fragrance_family VARCHAR(60) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    burn_time_hours INT NOT NULL,
    weight_grams INT NOT NULL,
    scent_intensity TINYINT NOT NULL DEFAULT 4,
    top_notes VARCHAR(300),
    heart_notes VARCHAR(300),
    base_notes VARCHAR(300),
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cat (category),
    INDEX idx_family (fragrance_family)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(32) NOT NULL UNIQUE,
    tracking_number VARCHAR(40) NOT NULL UNIQUE,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(25) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    pincode VARCHAR(15) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    shipping_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('UPI', 'CARD', 'NETBANKING', 'COD') NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PAID',
    order_status ENUM('CONFIRMED', 'HANDCRAFTING', 'DISPATCHED', 'DELIVERED') DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tracking (tracking_number),
    INDEX idx_cust_email (customer_email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    vessel_color VARCHAR(50) NOT NULL,
    wick_type VARCHAR(50) NOT NULL,
    candle_size VARCHAR(50) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;`
  },
  {
    filename: 'application.properties',
    language: 'properties',
    description: 'Spring Boot 3 + MySQL 8 Hikari Connection Pool & JPA Settings',
    code: `spring.application.name=blossomglow-candle-service
server.port=8080

# Java 21 Virtual Threads enabled
spring.threads.virtual.enabled=true

# MySQL Database DataSource configuration
spring.datasource.url=jdbc:mysql://localhost:3306/blossomglow_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=blossomglow_user
spring.datasource.password=\${MYSQL_PASSWORD:secret_glow_key}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# HikariCP Pool settings
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000

# Hibernate JPA Settings
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true`
  }
];
