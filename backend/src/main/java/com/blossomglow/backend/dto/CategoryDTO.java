package com.blossomglow.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * CategoryDTO
 * Data transfer object for Category management.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {

    private Long id;

    @NotBlank(message = "Category name cannot be blank")
    private String name;

    private String slug;

    private String description;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("display_order")
    private Integer displayOrder;

    @JsonProperty("products_count")
    private Integer productsCount;
}
