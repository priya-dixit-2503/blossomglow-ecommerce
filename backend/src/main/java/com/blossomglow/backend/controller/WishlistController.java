package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.WishlistSyncRequest;
import com.blossomglow.backend.entity.User;
import com.blossomglow.backend.repository.UserRepository;
import com.blossomglow.backend.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Customer Wishlist", description = "Endpoints for managing saved artisanal fragrances and gift favorites")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal()) || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElse(null);
    }

    @GetMapping
    @Operation(summary = "Get user's or session's saved fragrance product IDs")
    public ResponseEntity<List<String>> getWishlist(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(wishlistService.getWishlistProductIds(user, sessionToken));
    }

    @PostMapping("/{productId}")
    @Operation(summary = "Save a product to the customer or session wishlist")
    public ResponseEntity<List<String>> addToWishlist(
            @PathVariable String productId,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(wishlistService.addProduct(user, sessionToken, productId));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove a product from the customer or session wishlist")
    public ResponseEntity<List<String>> removeFromWishlist(
            @PathVariable String productId,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(wishlistService.removeProduct(user, sessionToken, productId));
    }

    @PostMapping("/toggle/{productId}")
    @Operation(summary = "Toggle product in customer or session wishlist")
    public ResponseEntity<List<String>> toggleWishlist(
            @PathVariable String productId,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(wishlistService.toggleProduct(user, sessionToken, productId));
    }

    @DeleteMapping
    @Operation(summary = "Clear all saved products from customer or session wishlist")
    public ResponseEntity<List<String>> clearWishlist(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(wishlistService.clearWishlist(user, sessionToken));
    }

    @PostMapping("/sync")
    @Operation(summary = "Sync client wishlist items with server upon login or app launch")
    public ResponseEntity<List<String>> syncWishlist(
            @RequestBody WishlistSyncRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        User user = getAuthenticatedUser();
        List<String> productIds = request != null ? request.getProductIds() : null;
        return ResponseEntity.ok(wishlistService.mergeWishlist(user, sessionToken, productIds));
    }
}
