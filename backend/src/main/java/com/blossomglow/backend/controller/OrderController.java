package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.OrderDTO;
import com.blossomglow.backend.dto.OrderStatusUpdateRequest;
import com.blossomglow.backend.entity.User;
import com.blossomglow.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Orders", description = "Order placement, tracking, customer history, and atelier administration")
public class OrderController {

    private final OrderService orderService;

    private boolean isAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equalsIgnoreCase(ga.getAuthority()) || "ADMIN".equalsIgnoreCase(ga.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    @PostMapping
    @Operation(summary = "Place a new order (automatically associated with logged-in user from JWT)")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        OrderDTO created = orderService.createOrder(orderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get authenticated customer's own orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        User user = orderService.getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(orderService.getOrdersForUser(user));
    }

    @GetMapping
    @Operation(summary = "Get orders (Admin views all, Customer views only their own)")
    public ResponseEntity<List<OrderDTO>> getOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = orderService.getAuthenticatedUser();

        if (isAdmin(auth)) {
            return ResponseEntity.ok(orderService.getAllOrders());
        }

        if (user != null) {
            // Customer only sees their own orders
            return ResponseEntity.ok(orderService.getOrdersForUser(user));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID (Customers can only view their own order; Admins can view any)")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User caller = orderService.getAuthenticatedUser();
        boolean admin = isAdmin(auth);

        return ResponseEntity.ok(orderService.getOrderByIdForUser(id, caller, admin));
    }

    @GetMapping("/track/{orderNumber}")
    @Operation(summary = "Track order status by order number")
    public ResponseEntity<OrderDTO> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status and tracking number (Admin only)")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus(), request.getTrackingNumber()));
    }
}
