package com.aprende.ues.backend.controller;

import com.aprende.ues.backend.dto.CommentRequestDTO;
import com.aprende.ues.backend.dto.CommentResponseDTO;
import com.aprende.ues.backend.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Comments", description = "CRUD operations for lesson comments")
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "Get all comments")
    @GetMapping
    public ResponseEntity<List<CommentResponseDTO>> getAll() {
        return ResponseEntity.ok(commentService.findAll());
    }

    @Operation(summary = "Get comment by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(commentService.findById(id));
    }

    @Operation(summary = "Create a new comment")
    @PostMapping
    public ResponseEntity<CommentResponseDTO> create(@Valid @RequestBody CommentRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.create(request));
    }

    @Operation(summary = "Update a comment")
    @PutMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody CommentRequestDTO request) {
        return ResponseEntity.ok(commentService.update(id, request));
    }

    @Operation(summary = "Delete a comment")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}