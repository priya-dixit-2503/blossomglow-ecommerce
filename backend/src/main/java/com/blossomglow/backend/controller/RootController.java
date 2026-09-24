package com.blossomglow.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "Root API", description = "Atelier Service Status and Endpoints Index")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "Root API Discovery", description = "Returns API health status, active version, and documentation links")
    public ResponseEntity<Map<String, Object>> getRoot() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", "BlossomGlow Candle Creations REST API");
        info.put("status", "ACTIVE");
        info.put("version", "1.0.0");
        info.put("swaggerUI", "/swagger-ui.html");
        info.put("openApiSpec", "/v3/api-docs");
        info.put("productsEndpoint", "/api/products");
        info.put("categoriesEndpoint", "/api/categories");
        info.put("cartEndpoint", "/api/cart");
        info.put("ordersEndpoint", "/api/orders");
        info.put("message", "Welcome to the BlossomGlow Candle Creations Backend! Visit /swagger-ui.html for interactive documentation.");
        return ResponseEntity.ok(info);
    }

    @GetMapping("/api")
    @Operation(summary = "API Base Discovery", description = "Base API directory")
    public ResponseEntity<Map<String, Object>> getApiBase() {
        return getRoot();
    }
}
