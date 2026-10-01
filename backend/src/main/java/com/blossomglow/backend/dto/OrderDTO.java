package com.blossomglow.backend.dto;

import com.blossomglow.backend.entity.OrderStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long userId;

    private String fullName;
    private String email;
    private String phone;
    private String shippingAddress;
    private String city;
    private String state;
    private String pincode;

    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;

    private String paymentMethod;
    private OrderStatus status;
    private String trackingNumber;
    private String estimatedDeliveryDate;
    private String specialInstructions;
    private LocalDateTime createdAt;

    private List<OrderItemDTO> items;

    private CustomerInfoDTO customerInfo;

    @JsonProperty("customerInfo")
    public void setCustomerInfo(CustomerInfoDTO customerInfo) {
        this.customerInfo = customerInfo;
        if (customerInfo != null) {
            if (this.fullName == null && customerInfo.getFullName() != null) {
                this.fullName = customerInfo.getFullName();
            }
            if (this.email == null && customerInfo.getEmail() != null) {
                this.email = customerInfo.getEmail();
            }
            if (this.phone == null && customerInfo.getPhone() != null) {
                this.phone = customerInfo.getPhone();
            }
            if (this.shippingAddress == null) {
                this.shippingAddress = customerInfo.getShippingAddress() != null 
                        ? customerInfo.getShippingAddress() 
                        : customerInfo.getAddress();
            }
            if (this.city == null && customerInfo.getCity() != null) {
                this.city = customerInfo.getCity();
            }
            if (this.state == null && customerInfo.getState() != null) {
                this.state = customerInfo.getState();
            }
            if (this.pincode == null && customerInfo.getPincode() != null) {
                this.pincode = customerInfo.getPincode();
            }
            if (this.specialInstructions == null && customerInfo.getSpecialInstructions() != null) {
                this.specialInstructions = customerInfo.getSpecialInstructions();
            }
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CustomerInfoDTO {
        private String fullName;
        private String email;
        private String phone;
        private String address;
        private String shippingAddress;
        private String city;
        private String state;
        private String pincode;
        private String specialInstructions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OrderItemDTO {
        private Object productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private String selectedVessel;
        private String selectedWick;
        private String selectedSize;
    }
}
