package com.blossomglow.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * ProductImageDTO
 * Data transfer object for multi-angle product photography.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {
    private Long id;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("alt_text")
    private String altText;

    @JsonProperty("display_order")
    private Integer displayOrder;

    @JsonProperty("is_primary")
    private Boolean isPrimary;
}
