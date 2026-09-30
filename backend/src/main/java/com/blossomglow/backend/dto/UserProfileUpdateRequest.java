package com.blossomglow.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileUpdateRequest {

    @NotBlank(message = "Full name cannot be blank")
    @JsonProperty("full_name")
    private String fullName;

    private String phone;
}
