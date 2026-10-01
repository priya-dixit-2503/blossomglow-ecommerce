package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.CartDTO;
import com.blossomglow.backend.service.CartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(cartService.getCartDTO(sessionToken));
    }

    @PostMapping({"", "/items"})
    public ResponseEntity<CartDTO> addToCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(
                sessionToken,
                request.getProductId(),
                request.getQuantity(),
                request.getSelectedVessel(),
                request.getSelectedWick(),
                request.getSelectedSize()
        ));
    }

    @PutMapping({"/{id}", "/items/{id}"})
    public ResponseEntity<CartDTO> updateCartItem(
            @PathVariable Long id,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @RequestBody UpdateQuantityRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(sessionToken, id, request.getQuantity()));
    }

    @DeleteMapping({"/{id}", "/items/{id}"})
    public ResponseEntity<CartDTO> removeCartItem(
            @PathVariable Long id,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(cartService.removeCartItem(sessionToken, id));
    }

    @DeleteMapping
    public ResponseEntity<CartDTO> clearCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(cartService.clearCart(sessionToken));
    }

    @Data
    public static class AddToCartRequest {
        private Object productId;
        private int quantity = 1;
        private String selectedVessel;
        private String selectedWick;
        private String selectedSize;
    }

    @Data
    public static class UpdateQuantityRequest {
        private int quantity;
    }
}
