package com.blossomglow.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;

    @JsonProperty("full_name")
    private String fullName;

    private String phone;
    private String role;

    @JsonProperty("member_since")
    private LocalDateTime memberSince;
}
