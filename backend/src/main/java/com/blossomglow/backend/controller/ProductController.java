package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.ProductDTO;
import com.blossomglow.backend.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Products", description = "Product catalog APIs. Public GET operations; ADMIN-only create, update, and delete mutations.")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Public storefront catalog browsing with optional category, fragrance family, and search filters")
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String fragranceFamily,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(productService.getAllProducts(category, fragranceFamily, search));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Public product details view by numeric ID or slug")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Public full-text keyword search across candle titles, fragrances, and descriptions")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create product (Admin only)", description = "Creates a new handcrafted candle creation in MySQL. Requires Bearer JWT with ROLE_ADMIN.")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO created = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product (Admin only)", description = "Updates details, stock, pricing, or scent notes for an existing candle. Requires Bearer JWT with ROLE_ADMIN.")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product (Admin only)", description = "Permanently deletes candle creation from catalog. Requires Bearer JWT with ROLE_ADMIN.")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
