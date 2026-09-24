package com.blossomglow.backend.dto;

import com.blossomglow.backend.entity.OrderStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private String orderNumber;

    @NotBlank(message = "Customer name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private OrderStatus status;
    private String trackingNumber;
    private String estimatedDeliveryDate;
    private String specialInstructions;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemDTO> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemDTO {
        @NotNull(message = "Product ID is required")
        private Long productId;
        private String productName;
        @NotNull(message = "Quantity is required")
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private String selectedVessel;
        private String selectedWick;
        private String selectedSize;
    }
}
