package com.blossomglow.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_addresses", indexes = {
    @Index(name = "idx_user_addresses_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 50)
    @Builder.Default
    private String title = "Home";

    @NotBlank(message = "Recipient name cannot be blank")
    @Column(name = "recipient_name", nullable = false, length = 150)
    private String recipientName;

    @NotBlank(message = "Phone number cannot be blank")
    @Column(nullable = false, length = 30)
    private String phone;

    @NotBlank(message = "Street address cannot be blank")
    @Column(name = "street_address", nullable = false, columnDefinition = "TEXT")
    private String streetAddress;

    @NotBlank(message = "City cannot be blank")
    @Column(nullable = false, length = 100)
    private String city;

    @NotBlank(message = "State cannot be blank")
    @Column(nullable = false, length = 100)
    private String state;

    @NotBlank(message = "Pincode cannot be blank")
    @Column(nullable = false, length = 20)
    private String pincode;

    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
