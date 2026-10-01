package com.blossomglow.backend.service;

import com.blossomglow.backend.entity.Product;
import com.blossomglow.backend.entity.User;
import com.blossomglow.backend.entity.WishlistItem;
import com.blossomglow.backend.exception.ResourceNotFoundException;
import com.blossomglow.backend.repository.ProductRepository;
import com.blossomglow.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    /**
     * Resolves a product by numeric ID, exact slug, or slug with/without "bg-" prefix.
     */
    public Product resolveProduct(Object productIdObj) {
        if (productIdObj == null) {
            throw new ResourceNotFoundException("Product identifier cannot be null");
        }
        if (productIdObj instanceof Number) {
            return productRepository.findById(((Number) productIdObj).longValue())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productIdObj));
        }
        String str = productIdObj.toString().trim();
        try {
            Long id = Long.parseLong(str);
            Optional<Product> byId = productRepository.findById(id);
            if (byId.isPresent()) return byId.get();
        } catch (NumberFormatException ignored) {}

        return productRepository.findBySlug(str)
                .or(() -> !str.startsWith("bg-") ? productRepository.findBySlug("bg-" + str) : Optional.empty())
                .or(() -> str.startsWith("bg-") ? productRepository.findBySlug(str.substring(3)) : Optional.empty())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productIdObj));
    }

    /**
     * Retrieves wishlist product identifiers (slugs) for an authenticated user or guest session token.
     */
    @Transactional(readOnly = true)
    public List<String> getWishlistProductIds(User user, String sessionToken) {
        List<WishlistItem> items;
        if (user != null) {
            items = wishlistRepository.findByUserOrderByCreatedAtDesc(user);
        } else if (sessionToken != null && !sessionToken.trim().isEmpty()) {
            items = wishlistRepository.findBySessionTokenOrderByCreatedAtDesc(sessionToken.trim());
        } else {
            return Collections.emptyList();
        }

        return items.stream()
                .map(item -> item.getProduct().getSlug() != null ? item.getProduct().getSlug() : String.valueOf(item.getProduct().getId()))
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * Adds a product to the user's or guest's wishlist (idempotent).
     */
    @Transactional
    public List<String> addProduct(User user, String sessionToken, Object productId) {
        Product product = resolveProduct(productId);

        if (user != null) {
            if (!wishlistRepository.existsByUserAndProduct(user, product)) {
                wishlistRepository.save(WishlistItem.builder()
                        .user(user)
                        .product(product)
                        .build());
            }
        } else if (sessionToken != null && !sessionToken.trim().isEmpty()) {
            String token = sessionToken.trim();
            if (!wishlistRepository.existsBySessionTokenAndProduct(token, product)) {
                wishlistRepository.save(WishlistItem.builder()
                        .sessionToken(token)
                        .product(product)
                        .build());
            }
        }

        return getWishlistProductIds(user, sessionToken);
    }

    /**
     * Removes a product from the user's or guest's wishlist.
     */
    @Transactional
    public List<String> removeProduct(User user, String sessionToken, Object productId) {
        Product product = resolveProduct(productId);

        if (user != null) {
            wishlistRepository.deleteByUserAndProduct(user, product);
        } else if (sessionToken != null && !sessionToken.trim().isEmpty()) {
            wishlistRepository.deleteBySessionTokenAndProduct(sessionToken.trim(), product);
        }

        return getWishlistProductIds(user, sessionToken);
    }

    /**
     * Toggles a product in the user's or guest's wishlist.
     */
    @Transactional
    public List<String> toggleProduct(User user, String sessionToken, Object productId) {
        Product product = resolveProduct(productId);

        if (user != null) {
            boolean exists = wishlistRepository.existsByUserAndProduct(user, product);
            if (exists) {
                wishlistRepository.deleteByUserAndProduct(user, product);
            } else {
                wishlistRepository.save(WishlistItem.builder()
                        .user(user)
                        .product(product)
                        .build());
            }
        } else if (sessionToken != null && !sessionToken.trim().isEmpty()) {
            String token = sessionToken.trim();
            boolean exists = wishlistRepository.existsBySessionTokenAndProduct(token, product);
            if (exists) {
                wishlistRepository.deleteBySessionTokenAndProduct(token, product);
            } else {
                wishlistRepository.save(WishlistItem.builder()
                        .sessionToken(token)
                        .product(product)
                        .build());
            }
        }

        return getWishlistProductIds(user, sessionToken);
    }

    /**
     * Clears the entire wishlist for the user or guest session token.
     */
    @Transactional
    public List<String> clearWishlist(User user, String sessionToken) {
        if (user != null) {
            wishlistRepository.deleteByUser(user);
        } else if (sessionToken != null && !sessionToken.trim().isEmpty()) {
            wishlistRepository.deleteBySessionToken(sessionToken.trim());
        }
        return Collections.emptyList();
    }

    /**
     * Merges client wishlist product IDs into the user's or guest's persistent wishlist.
     */
    @Transactional
    public List<String> mergeWishlist(User user, String sessionToken, List<String> clientProductIds) {
        // If user is authenticated and sessionToken is also present, migrate guest items to user
        if (user != null && sessionToken != null && !sessionToken.trim().isEmpty()) {
            List<WishlistItem> guestItems = wishlistRepository.findBySessionTokenOrderByCreatedAtDesc(sessionToken.trim());
            for (WishlistItem gi : guestItems) {
                if (!wishlistRepository.existsByUserAndProduct(user, gi.getProduct())) {
                    wishlistRepository.save(WishlistItem.builder()
                            .user(user)
                            .product(gi.getProduct())
                            .build());
                }
            }
            wishlistRepository.deleteBySessionToken(sessionToken.trim());
        }

        if (clientProductIds != null) {
            for (String pid : clientProductIds) {
                try {
                    Product product = resolveProduct(pid);
                    if (user != null) {
                        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
                            wishlistRepository.save(WishlistItem.builder()
                                    .user(user)
                                    .product(product)
                                    .build());
                        }
                    } else if (sessionToken != null && !sessionToken.trim().isEmpty()) {
                        String token = sessionToken.trim();
                        if (!wishlistRepository.existsBySessionTokenAndProduct(token, product)) {
                            wishlistRepository.save(WishlistItem.builder()
                                    .sessionToken(token)
                                    .product(product)
                                    .build());
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to merge wishlist product {}: {}", pid, e.getMessage());
                }
            }
        }

        return getWishlistProductIds(user, sessionToken);
    }
}
