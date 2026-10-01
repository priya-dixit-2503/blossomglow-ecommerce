package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.CategoryDTO;
import com.blossomglow.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public Storefront Category Controller
 * Handles read-only browsing of candle collections and categories.
 * Administrative operations (create, update, delete) are exclusively handled by AdminCategoryController.
 * Routes:
 * - GET /api/categories
 * - GET /api/categories/{id}
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Categories", description = "Public storefront category browsing APIs")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all candle collections & categories", description = "Public storefront endpoint for viewing category catalog")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Public storefront endpoint for retrieving category details")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }
}
