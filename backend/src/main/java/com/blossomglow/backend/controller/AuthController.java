package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.AuthRequest;
import com.blossomglow.backend.dto.AuthResponse;
import com.blossomglow.backend.dto.RegisterRequest;
import com.blossomglow.backend.entity.User;
import com.blossomglow.backend.repository.UserRepository;
import com.blossomglow.backend.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Customer and Admin login, registration, and JWT token verification")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${blossomglow.admin.username:admin}")
    private String adminUsername;

    @Value("${blossomglow.admin.password:blossomglow2026!}")
    private String adminPassword;

    @Value("${blossomglow.admin.email:admin@blossomglow.com}")
    private String adminEmail;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT token", description = "Supports both Customer accounts and Admin master credentials")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        // 1. Check if Admin credentials match configuration
        if (adminUsername.equalsIgnoreCase(request.getUsername()) && adminPassword.equals(request.getPassword())) {
            String token = jwtUtil.generateToken(adminUsername, "ROLE_ADMIN", "Atelier Administrator");
            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .id(0L)
                    .username(adminUsername)
                    .email(adminEmail)
                    .fullName("Atelier Administrator")
                    .role("ROLE_ADMIN")
                    .build());
        }

        // 2. Check Database users (customer or admin)
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()));

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username/email or password"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username/email or password"));
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getFullName());
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build());
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account", description = "Creates customer in MySQL with BCrypt hashed password and issues JWT")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken"));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is already registered"));
        }

        User newUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role("ROLE_CUSTOMER")
                .build();

        User savedUser = userRepository.save(newUser);
        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getRole(), savedUser.getFullName());

        return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .build());
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        String username = authentication.getName();
        if (adminUsername.equalsIgnoreCase(username)) {
            return ResponseEntity.ok(Map.of(
                    "username", adminUsername,
                    "email", adminEmail,
                    "fullName", "Atelier Administrator",
                    "role", "ROLE_ADMIN"
            ));
        }

        return userRepository.findByUsername(username)
                .map(u -> ResponseEntity.ok((Object) Map.of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "email", u.getEmail(),
                        "fullName", u.getFullName(),
                        "phone", u.getPhone() != null ? u.getPhone() : "",
                        "role", u.getRole()
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User record not found")));
    }
}
