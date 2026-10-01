package com.blossomglow.backend.service;

import com.blossomglow.backend.dto.CartDTO;
import com.blossomglow.backend.entity.Cart;
import com.blossomglow.backend.entity.CartItem;
import com.blossomglow.backend.entity.Product;
import com.blossomglow.backend.exception.ResourceNotFoundException;
import com.blossomglow.backend.repository.CartRepository;
import com.blossomglow.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Cart getOrCreateCart(String sessionToken) {
        if (sessionToken == null || sessionToken.trim().isEmpty()) {
            sessionToken = "session-" + UUID.randomUUID().toString();
        }
        final String token = sessionToken;
        return cartRepository.findBySessionToken(token)
                .orElseGet(() -> cartRepository.save(Cart.builder().sessionToken(token).build()));
    }

    @Transactional(readOnly = true)
    public CartDTO getCartDTO(String sessionToken) {
        Cart cart = getOrCreateCart(sessionToken);
        return toDTO(cart);
    }

    @Transactional
    public CartDTO addItemToCart(String sessionToken, Long productId, int quantity, String vessel, String wick, String size) {
        return addItemToCart(sessionToken, (Object) productId, quantity, vessel, wick, size);
    }

    @Transactional
    public CartDTO addItemToCart(String sessionToken, Object productIdObj, int quantity, String vessel, String wick, String size) {
        Cart cart = getOrCreateCart(sessionToken);
        Product product = null;

        if (productIdObj instanceof Number) {
            product = productRepository.findById(((Number) productIdObj).longValue()).orElse(null);
        } else if (productIdObj != null) {
            String str = productIdObj.toString().trim();
            try {
                Long id = Long.parseLong(str);
                product = productRepository.findById(id).orElse(null);
            } catch (NumberFormatException ignored) {}

            if (product == null) {
                product = productRepository.findBySlug(str).orElse(null);
                if (product == null && !str.startsWith("bg-")) {
                    product = productRepository.findBySlug("bg-" + str).orElse(null);
                }
            }
        }

        if (product == null) {
            throw new ResourceNotFoundException("Product not found: " + productIdObj);
        }

        final Long resolvedProductId = product.getId();
        // Check if item already exists in cart with same variant
        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(resolvedProductId) &&
                             safeEquals(i.getSelectedVessel(), vessel) &&
                             safeEquals(i.getSelectedWick(), wick) &&
                             safeEquals(i.getSelectedSize(), size))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .selectedVessel(vessel != null ? vessel : "Fluted Ivory")
                    .selectedWick(wick != null ? wick : "Organic Cotton Wick")
                    .selectedSize(size != null ? size : "280g (Double Wick)")
                    .unitPrice(product.getPrice())
                    .build();
            cart.getItems().add(newItem);
        }

        Cart saved = cartRepository.save(cart);
        return toDTO(saved);
    }

    @Transactional
    public CartDTO updateCartItem(Long itemId, int quantity) {
        return updateCartItem(null, itemId, quantity);
    }

    @Transactional
    public CartDTO updateCartItem(String sessionToken, Long itemId, int quantity) {
        Cart targetCart = null;
        if (sessionToken != null && !sessionToken.trim().isEmpty()) {
            targetCart = cartRepository.findBySessionToken(sessionToken).orElse(null);
            if (targetCart != null) {
                CartItem found = null;
                for (CartItem item : targetCart.getItems()) {
                    if (item.getId().equals(itemId)) {
                        found = item;
                        break;
                    }
                }
                if (found != null) {
                    if (quantity <= 0) {
                        targetCart.getItems().remove(found);
                    } else {
                        found.setQuantity(quantity);
                    }
                    Cart saved = cartRepository.save(targetCart);
                    return toDTO(saved);
                }
            }
        }

        // Search across all carts if session token not provided or item not in specified cart
        for (Cart c : cartRepository.findAll()) {
            for (CartItem item : c.getItems()) {
                if (item.getId().equals(itemId)) {
                    if (quantity <= 0) {
                        c.getItems().remove(item);
                    } else {
                        item.setQuantity(quantity);
                    }
                    targetCart = cartRepository.save(c);
                    break;
                }
            }
            if (targetCart != null) break;
        }

        if (targetCart == null) {
            throw new ResourceNotFoundException("Cart item not found: " + itemId);
        }
        return toDTO(targetCart);
    }

    @Transactional
    public CartDTO removeCartItem(Long itemId) {
        return updateCartItem(itemId, 0);
    }

    @Transactional
    public CartDTO removeCartItem(String sessionToken, Long itemId) {
        return updateCartItem(sessionToken, itemId, 0);
    }

    @Transactional
    public CartDTO clearCart(String sessionToken) {
        Cart cart = getOrCreateCart(sessionToken);
        cart.getItems().clear();
        Cart saved = cartRepository.save(cart);
        return toDTO(saved);
    }

    private boolean safeEquals(String a, String b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.equals(b);
    }

    public CartDTO toDTO(Cart cart) {
        BigDecimal subtotal = cart.getItems().stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDTO.builder()
                .id(cart.getId())
                .sessionToken(cart.getSessionToken())
                .subtotal(subtotal)
                .items(cart.getItems().stream().map(i -> CartDTO.CartItemDTO.builder()
                        .id(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .imageUrl(i.getProduct().getImageUrl())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .selectedVessel(i.getSelectedVessel())
                        .selectedWick(i.getSelectedWick())
                        .selectedSize(i.getSelectedSize())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
