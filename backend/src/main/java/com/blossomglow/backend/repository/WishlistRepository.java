package com.blossomglow.backend.repository;

import com.blossomglow.backend.entity.Product;
import com.blossomglow.backend.entity.User;
import com.blossomglow.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByUserOrderByCreatedAtDesc(User user);

    List<WishlistItem> findBySessionTokenOrderByCreatedAtDesc(String sessionToken);

    Optional<WishlistItem> findByUserAndProduct(User user, Product product);

    Optional<WishlistItem> findBySessionTokenAndProduct(String sessionToken, Product product);

    boolean existsByUserAndProduct(User user, Product product);

    boolean existsBySessionTokenAndProduct(String sessionToken, Product product);

    void deleteByUserAndProduct(User user, Product product);

    void deleteBySessionTokenAndProduct(String sessionToken, Product product);

    void deleteByUser(User user);

    void deleteBySessionToken(String sessionToken);
}
