package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.*;
import com.blossomglow.backend.entity.User;
import com.blossomglow.backend.entity.UserAddress;
import com.blossomglow.backend.exception.ResourceNotFoundException;
import com.blossomglow.backend.repository.UserAddressRepository;
import com.blossomglow.backend.repository.UserRepository;
import com.blossomglow.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Customer Account Controller
 * Manages customer profile, order history, shipping addresses, and security credentials.
 * Endpoints:
 * - GET    /api/user/profile
 * - PUT    /api/user/profile
 * - POST   /api/user/change-password
 * - GET    /api/user/orders
 * - GET    /api/user/addresses
 * - POST   /api/user/addresses
 * - DELETE /api/user/addresses/{id}
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "Customer Account", description = "My Account endpoints: Profile, Orders, Addresses, and Password management")
public class UserController {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final OrderService orderService;
    private final PasswordEncoder passwordEncoder;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResourceNotFoundException("Unauthenticated access - please sign in");
        }
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("Customer account not found for: " + username));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get authenticated customer profile from database")
    public ResponseEntity<UserProfileDTO> getProfile() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone() != null ? user.getPhone() : "")
                .role(user.getRole())
                .memberSince(user.getCreatedAt())
                .build());
    }

    @PutMapping("/profile")
    @Operation(summary = "Update customer profile in MySQL database")
    public ResponseEntity<UserProfileDTO> updateProfile(@Valid @RequestBody UserProfileUpdateRequest request) {
        User user = getAuthenticatedUser();
        user.setFullName(request.getFullName().trim());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        User updated = userRepository.save(user);

        return ResponseEntity.ok(UserProfileDTO.builder()
                .id(updated.getId())
                .username(updated.getUsername())
                .email(updated.getEmail())
                .fullName(updated.getFullName())
                .phone(updated.getPhone() != null ? updated.getPhone() : "")
                .role(updated.getRole())
                .memberSince(updated.getCreatedAt())
                .build());
    }

    @PostMapping("/change-password")
    @Operation(summary = "Update customer password with BCrypt verification")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User user = getAuthenticatedUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Current password is incorrect."));
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password updated successfully. Please use your new password next time you log in."
        ));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get order history for authenticated customer")
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        User user = getAuthenticatedUser();
        List<OrderDTO> orders = orderService.getOrdersByEmail(user.getEmail());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/addresses")
    @Operation(summary = "Get saved shipping addresses for customer")
    public ResponseEntity<List<UserAddressDTO>> getAddresses() {
        User user = getAuthenticatedUser();
        List<UserAddressDTO> addresses = userAddressRepository
                .findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                .stream()
                .map(this::toAddressDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/addresses")
    @Operation(summary = "Add a new shipping address")
    public ResponseEntity<UserAddressDTO> addAddress(@Valid @RequestBody UserAddressDTO dto) {
        User user = getAuthenticatedUser();

        // If marked default, unset other defaults
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            List<UserAddress> existing = userAddressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId());
            for (UserAddress a : existing) {
                if (Boolean.TRUE.equals(a.getIsDefault())) {
                    a.setIsDefault(false);
                    userAddressRepository.save(a);
                }
            }
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .title(dto.getTitle() != null && !dto.getTitle().isBlank() ? dto.getTitle() : "Home")
                .recipientName(dto.getRecipientName())
                .phone(dto.getPhone())
                .streetAddress(dto.getStreetAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .isDefault(Boolean.TRUE.equals(dto.getIsDefault()))
                .build();

        UserAddress saved = userAddressRepository.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(toAddressDTO(saved));
    }

    @DeleteMapping("/addresses/{id}")
    @Operation(summary = "Delete a saved shipping address")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        UserAddress address = userAddressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));

        userAddressRepository.delete(address);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Shipping address deleted."
        ));
    }

    private UserAddressDTO toAddressDTO(UserAddress a) {
        return UserAddressDTO.builder()
                .id(a.getId())
                .title(a.getTitle())
                .recipientName(a.getRecipientName())
                .phone(a.getPhone())
                .streetAddress(a.getStreetAddress())
                .city(a.getCity())
                .state(a.getState())
                .pincode(a.getPincode())
                .isDefault(a.getIsDefault())
                .build();
    }
}
