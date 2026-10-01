package com.blossomglow.backend.repository;

import com.blossomglow.backend.entity.Order;
import com.blossomglow.backend.entity.OrderStatus;
import com.blossomglow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByTrackingNumber(String trackingNumber);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByEmailOrderByCreatedAtDesc(String email);
    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT o FROM Order o WHERE o.user = :user OR (o.user IS NULL AND LOWER(o.email) = LOWER(:email)) ORDER BY o.createdAt DESC")
    List<Order> findByUserOrEmailOrderByCreatedAtDesc(@Param("user") User user, @Param("email") String email);
}
