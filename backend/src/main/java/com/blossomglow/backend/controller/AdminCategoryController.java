package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.CategoryDTO;
import com.blossomglow.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin Category Management Controller
 * Centralizes administrative CRUD for candle collections & categories.
 * Secured strictly with ROLE_ADMIN via JWT authentication.
 * Routes:
 * - GET    /api/admin/categories
 * - GET    /api/admin/categories/{id}
 * - POST   /api/admin/categories
 * - PUT    /api/admin/categories/{id}
 * - DELETE /api/admin/categories/{id}
 */
@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Categories", description = "Administrative category management APIs (Requires Bearer JWT with ROLE_ADMIN)")
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories (Admin)", description = "Retrieves all categories for atelier management")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID (Admin)", description = "Retrieves single category by ID for editing")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    @Operation(summary = "Create category (Admin only)", description = "Creates a new category/collection in the catalog. Requires ROLE_ADMIN.")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO created = categoryService.createCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update category (Admin only)", description = "Updates category details, description, image or ordering. Requires ROLE_ADMIN.")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO updated = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category (Admin only)", description = "Permanently deletes a category from the database. Requires ROLE_ADMIN.")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Category with id " + id + " was successfully deleted."
        ));
    }
}
