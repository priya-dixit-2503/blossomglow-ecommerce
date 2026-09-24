package com.blossomglow.backend.controller;

import com.blossomglow.backend.entity.Product;
import com.blossomglow.backend.entity.Review;
import com.blossomglow.backend.repository.ProductRepository;
import com.blossomglow.backend.repository.ReviewRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product customer reviews, ratings, and feedback submission")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get reviews for a product", description = "Retrieves all verified customer reviews for a given product ID")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductIdOrderByCreatedAtDesc(productId));
    }

    @PostMapping
    @Operation(summary = "Submit a product review", description = "Allows verified buyers to post star ratings and qualitative reviews")
    public ResponseEntity<Review> createReview(@Valid @RequestBody Review review) {
        Review saved = reviewRepository.save(review);

        // Update product aggregate rating & review count if product exists
        productRepository.findById(review.getProductId()).ifPresent(product -> {
            List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(review.getProductId());
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
            product.setRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP));
            product.setReviewsCount(reviews.size());
            productRepository.save(product);
        });

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
