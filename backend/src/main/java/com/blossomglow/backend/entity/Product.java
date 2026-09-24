package com.blossomglow.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_category", columnList = "category_name"),
    @Index(name = "idx_products_fragrance", columnList = "fragrance_family"),
    @Index(name = "idx_products_price", columnList = "price")
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

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @NotBlank(message = "Product name cannot be empty")
    @Column(nullable = false, length = 200)
    private String name;

    @NotBlank(message = "Tagline cannot be empty")
    @Column(nullable = false, length = 255)
    private String tagline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;

    @Column(name = "fragrance_family", nullable = false, length = 80)
    private String fragranceFamily;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(precision = 2, scale = 1)
    private BigDecimal rating = BigDecimal.valueOf(5.0);

    @Column(name = "reviews_count")
    private Integer reviewsCount = 0;

    @NotBlank(message = "Image URL is required")
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "burn_time_hours", nullable = false)
    private Integer burnTimeHours = 40;

    @Column(name = "weight_grams", nullable = false)
    private Integer weightGrams = 250;

    @Column(name = "scent_intensity", nullable = false)
    private Integer scentIntensity = 4;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(name = "artisan_story", columnDefinition = "TEXT")
    private String artisanStory;

    @Column(name = "wax_type", length = 100)
    private String waxType = "100% Organic Soy Wax";

    @Column(length = 100)
    private String dimensions;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 50;

    @Column(name = "is_best_seller")
    private Boolean isBestSeller = false;

    @Column(name = "is_new_arrival")
    private Boolean isNewArrival = false;

    @Column(name = "season_release", length = 100)
    private String seasonRelease;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
