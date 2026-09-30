package com.blossomglow.backend.service;

import com.blossomglow.backend.dto.ProductDTO;
import com.blossomglow.backend.dto.ProductImageDTO;
import com.blossomglow.backend.entity.Product;
import com.blossomglow.backend.entity.ProductImage;
import com.blossomglow.backend.exception.ResourceNotFoundException;
import com.blossomglow.backend.repository.ProductImageRepository;
import com.blossomglow.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts(String category, String fragranceFamily, String search) {
        List<Product> list;
        if (search != null && !search.trim().isEmpty()) {
            list = productRepository.searchByKeyword(search.trim());
        } else if (category != null && !category.equalsIgnoreCase("All") && !category.equalsIgnoreCase("All Creations")) {
            list = productRepository.findByCategoryName(category);
        } else if (fragranceFamily != null && !fragranceFamily.equalsIgnoreCase("All")) {
            list = productRepository.findByFragranceFamily(fragranceFamily);
        } else {
            list = productRepository.findAll();
        }
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        String slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + System.currentTimeMillis();
        Product product = Product.builder()
                .slug(slug)
                .name(dto.getName())
                .tagline(dto.getTagline())
                .categoryName(dto.getCategoryName())
                .fragranceFamily(dto.getFragranceFamily())
                .price(dto.getPrice())
                .originalPrice(dto.getOriginalPrice())
                .rating(dto.getRating() != null ? dto.getRating() : java.math.BigDecimal.valueOf(5.0))
                .reviewsCount(dto.getReviewsCount() != null ? dto.getReviewsCount() : 0)
                .imageUrl(dto.getImageUrl())
                .burnTimeHours(dto.getBurnTimeHours() != null ? dto.getBurnTimeHours() : 40)
                .weightGrams(dto.getWeightGrams() != null ? dto.getWeightGrams() : 250)
                .scentIntensity(dto.getScentIntensity() != null ? dto.getScentIntensity() : 4)
                .description(dto.getDescription())
                .artisanStory(dto.getArtisanStory())
                .waxType(dto.getWaxType() != null ? dto.getWaxType() : "100% Organic Soy Wax")
                .dimensions(dto.getDimensions())
                .inStock(dto.getInStock() != null ? dto.getInStock() : true)
                .stockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 50)
                .isBestSeller(dto.getIsBestSeller() != null ? dto.getIsBestSeller() : false)
                .isNewArrival(dto.getIsNewArrival() != null ? dto.getIsNewArrival() : true)
                .seasonRelease(dto.getSeasonRelease())
                .build();

        // Populate Product -> Product Images
        int displayOrder = 1;
        if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
            product.addImage(ProductImage.builder()
                    .imageUrl(dto.getImageUrl())
                    .altText(dto.getName() + " - Main View")
                    .displayOrder(displayOrder++)
                    .isPrimary(true)
                    .build());
        }

        if (dto.getGalleryImages() != null) {
            for (String imgUrl : dto.getGalleryImages()) {
                if (imgUrl != null && !imgUrl.isBlank() && !imgUrl.equals(dto.getImageUrl())) {
                    product.addImage(ProductImage.builder()
                            .imageUrl(imgUrl)
                            .altText(dto.getName() + " - Angle View " + displayOrder)
                            .displayOrder(displayOrder++)
                            .isPrimary(false)
                            .build());
                }
            }
        }

        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        existing.setName(dto.getName());
        existing.setTagline(dto.getTagline());
        existing.setCategoryName(dto.getCategoryName());
        existing.setFragranceFamily(dto.getFragranceFamily());
        existing.setPrice(dto.getPrice());
        existing.setOriginalPrice(dto.getOriginalPrice());
        existing.setImageUrl(dto.getImageUrl());
        existing.setDescription(dto.getDescription());
        if (dto.getArtisanStory() != null) existing.setArtisanStory(dto.getArtisanStory());
        if (dto.getInStock() != null) existing.setInStock(dto.getInStock());
        if (dto.getStockQuantity() != null) existing.setStockQuantity(dto.getStockQuantity());
        if (dto.getIsBestSeller() != null) existing.setIsBestSeller(dto.getIsBestSeller());
        if (dto.getIsNewArrival() != null) existing.setIsNewArrival(dto.getIsNewArrival());

        // Update gallery images if supplied
        if (dto.getGalleryImages() != null && !dto.getGalleryImages().isEmpty()) {
            existing.getImages().clear();
            int displayOrder = 1;
            if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
                existing.addImage(ProductImage.builder()
                        .imageUrl(dto.getImageUrl())
                        .altText(dto.getName() + " - Main View")
                        .displayOrder(displayOrder++)
                        .isPrimary(true)
                        .build());
            }
            for (String imgUrl : dto.getGalleryImages()) {
                if (imgUrl != null && !imgUrl.isBlank() && !imgUrl.equals(dto.getImageUrl())) {
                    existing.addImage(ProductImage.builder()
                            .imageUrl(imgUrl)
                            .altText(dto.getName() + " - Gallery View " + displayOrder)
                            .displayOrder(displayOrder++)
                            .isPrimary(false)
                            .build());
                }
            }
        }

        Product updated = productRepository.save(existing);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductDTO convertToDTO(Product p) {
        List<String> gallery = new ArrayList<>();
        List<ProductImageDTO> imageDTOs = new ArrayList<>();

        // Architecture: Product -> Product Images -> Gallery
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            for (ProductImage img : p.getImages()) {
                if (img.getImageUrl() != null && !img.getImageUrl().isBlank()) {
                    gallery.add(img.getImageUrl());
                    imageDTOs.add(ProductImageDTO.builder()
                            .id(img.getId())
                            .imageUrl(img.getImageUrl())
                            .altText(img.getAltText())
                            .displayOrder(img.getDisplayOrder())
                            .isPrimary(img.getIsPrimary())
                            .build());
                }
            }
        }

        // Fallback: If product has no entries in product_images, use product.imageUrl
        if (gallery.isEmpty() && p.getImageUrl() != null && !p.getImageUrl().isBlank()) {
            gallery.add(p.getImageUrl());
            imageDTOs.add(ProductImageDTO.builder()
                    .imageUrl(p.getImageUrl())
                    .altText(p.getName())
                    .displayOrder(1)
                    .isPrimary(true)
                    .build());
        }

        return ProductDTO.builder()
                .id(p.getId())
                .slug(p.getSlug())
                .name(p.getName())
                .tagline(p.getTagline())
                .categoryName(p.getCategoryName())
                .fragranceFamily(p.getFragranceFamily())
                .price(p.getPrice())
                .originalPrice(p.getOriginalPrice())
                .rating(p.getRating())
                .reviewsCount(p.getReviewsCount())
                .imageUrl(p.getImageUrl())
                .galleryImages(gallery)
                .productImages(imageDTOs)
                .burnTimeHours(p.getBurnTimeHours())
                .weightGrams(p.getWeightGrams())
                .scentIntensity(p.getScentIntensity())
                .description(p.getDescription())
                .artisanStory(p.getArtisanStory())
                .waxType(p.getWaxType())
                .dimensions(p.getDimensions())
                .inStock(p.getInStock())
                .stockQuantity(p.getStockQuantity())
                .isBestSeller(p.getIsBestSeller())
                .isNewArrival(p.getIsNewArrival())
                .seasonRelease(p.getSeasonRelease())
                .build();
    }
}
