package com.aprende.ues.backend.controller;

import com.aprende.ues.backend.dto.ReviewRequestDTO;
import com.aprende.ues.backend.dto.ReviewResponseDTO;
import com.aprende.ues.backend.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Operations for managing course reviews and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Get all reviews", description = "Returns a list of all course reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getAll() {
        return ResponseEntity.ok(reviewService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get review by ID", description = "Returns a single review by its UUID")
    public ResponseEntity<ReviewResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create a review", description = "Submits a new rating and review for a course by a user")
    public ResponseEntity<ReviewResponseDTO> create(
            @Valid @RequestBody ReviewRequestDTO request) {
        ReviewResponseDTO created = reviewService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a review", description = "Updates the rating or body of an existing review")
    public ResponseEntity<ReviewResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewRequestDTO request) {
        return ResponseEntity.ok(reviewService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review", description = "Deletes a review by its UUID")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
}