package com.blossomglow.backend.repository;

import com.blossomglow.backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findBySessionToken(String sessionToken);
    Optional<Cart> findByUserId(Long userId);
}
