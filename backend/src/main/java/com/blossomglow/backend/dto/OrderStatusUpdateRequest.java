package com.blossomglow.backend.dto;

import com.blossomglow.backend.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequest {
    @NotNull(message = "Status cannot be null")
    private OrderStatus status;
    private String trackingNumber;
}
