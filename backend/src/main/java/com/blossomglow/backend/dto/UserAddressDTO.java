package com.blossomglow.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddressDTO {
    private Long id;
    private String title;

    @NotBlank(message = "Recipient name cannot be blank")
    @JsonProperty("recipient_name")
    private String recipientName;

    @NotBlank(message = "Phone number cannot be blank")
    private String phone;

    @NotBlank(message = "Street address cannot be blank")
    @JsonProperty("street_address")
    private String streetAddress;

    @NotBlank(message = "City cannot be blank")
    private String city;

    @NotBlank(message = "State cannot be blank")
    private String state;

    @NotBlank(message = "Pincode cannot be blank")
    private String pincode;

    @JsonProperty("is_default")
    private Boolean isDefault;
}
