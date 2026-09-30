package com.blossomglow.backend.service;

import com.blossomglow.backend.dto.CategoryDTO;
import com.blossomglow.backend.entity.Category;
import com.blossomglow.backend.exception.ResourceNotFoundException;
import com.blossomglow.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return convertToDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        String slug = dto.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("^-+|-+$", "");
        }

        // Check if slug or name already exists
        if (categoryRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Category category = Category.builder()
                .name(dto.getName().trim())
                .slug(slug)
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                .build();

        Category saved = categoryRepository.save(category);
        return convertToDTO(saved);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        existing.setName(dto.getName().trim());
        if (dto.getSlug() != null && !dto.getSlug().trim().isEmpty()) {
            existing.setSlug(dto.getSlug().trim());
        }
        if (dto.getDescription() != null) {
            existing.setDescription(dto.getDescription());
        }
        if (dto.getImageUrl() != null) {
            existing.setImageUrl(dto.getImageUrl());
        }
        if (dto.getDisplayOrder() != null) {
            existing.setDisplayOrder(dto.getDisplayOrder());
        }

        Category updated = categoryRepository.save(existing);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot delete: category not found with id: " + id));

        // Disassociate products from this category to prevent foreign key constraint violations
        if (existing.getProducts() != null) {
            existing.getProducts().forEach(p -> p.setCategory(null));
        }

        categoryRepository.delete(existing);
    }

    public CategoryDTO convertToDTO(Category c) {
        return CategoryDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .imageUrl(c.getImageUrl())
                .displayOrder(c.getDisplayOrder())
                .productsCount(c.getProducts() != null ? c.getProducts().size() : 0)
                .build();
    }
}
