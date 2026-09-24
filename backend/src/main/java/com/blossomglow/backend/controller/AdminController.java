package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.OrderDTO;
import com.blossomglow.backend.dto.ProductDTO;
import com.blossomglow.backend.entity.ContactMessage;
import com.blossomglow.backend.service.ContactService;
import com.blossomglow.backend.service.OrderService;
import com.blossomglow.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://*.run.app"})
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final ContactService contactService;

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getAdminMetrics() {
        List<OrderDTO> orders = orderService.getAllOrders();
        List<ProductDTO> products = productService.getAllProducts(null, null, null);
        List<ContactMessage> messages = contactService.getAllMessages();

        java.math.BigDecimal totalRevenue = orders.stream()
                .map(OrderDTO::getTotalAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalProducts", products.size());
        metrics.put("totalOrders", orders.size());
        metrics.put("totalRevenue", totalRevenue);
        metrics.put("unreadMessages", messages.size());
        metrics.put("lowStockCount", products.stream().filter(p -> p.getStockQuantity() != null && p.getStockQuantity() < 20).count());

        return ResponseEntity.ok(metrics);
    }
}
