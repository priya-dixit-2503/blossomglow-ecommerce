package com.blossomglow.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String slug;

    @NotBlank(message = "Product name cannot be blank")
    private String name;

    @NotBlank(message = "Product tagline cannot be blank")
    private String tagline;

    @NotBlank(message = "Category is required")
    private String categoryName;

    @JsonProperty("category")
    public String getCategory() {
        return categoryName;
    }

    @NotBlank(message = "Fragrance family is required")
    private String fragranceFamily;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private BigDecimal originalPrice;
    private BigDecimal rating;
    private Integer reviewsCount;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @JsonProperty("image")
    public String getImage() {
        return imageUrl;
    }

    private List<String> galleryImages;

    private Integer burnTimeHours;
    private Integer weightGrams;
    private Integer scentIntensity;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    private String artisanStory;
    private String waxType;
    private String dimensions;
    private Boolean inStock;
    private Integer stockQuantity;
    private Boolean isBestSeller;
    private Boolean isNewArrival;
    private String seasonRelease;
}
