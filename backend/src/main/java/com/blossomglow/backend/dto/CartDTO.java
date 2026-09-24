package com.blossomglow.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {
    private Long id;
    private String sessionToken;
    private List<CartItemDTO> items;
    private BigDecimal subtotal;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartItemDTO {
        private Long id;
        @NotNull(message = "Product ID is required")
        private Long productId;
        private String productName;
        private String imageUrl;
        @NotNull(message = "Quantity is required")
        private Integer quantity;
        private BigDecimal unitPrice;
        private String selectedVessel;
        private String selectedWick;
        private String selectedSize;
    }
}
