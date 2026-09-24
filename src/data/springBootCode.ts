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
    filename: 'OrderController.java',
    language: 'java',
    description: 'Checkout, Order Creation and Payment Gateway Webhook Endpoint',
    code: `package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.OrderRequestDTO;
import com.blossomglow.backend.dto.OrderResponseDTO;
import com.blossomglow.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://*.run.app"})
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO request) {
        OrderResponseDTO createdOrder = orderService.processOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<OrderResponseDTO> trackOrder(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(orderService.trackOrderByNumber(trackingNumber));
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
