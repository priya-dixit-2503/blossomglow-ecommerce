package com.blossomglow.backend.repository;

import com.blossomglow.backend.entity.Order;
import com.blossomglow.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
