package com.aprende.ues.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CommentRequestDTO(
    @NotNull(message = "User ID is required")
    UUID userId,

    @NotNull(message = "Lesson ID is required")
    UUID lessonId,

    UUID parentId,

    @NotBlank(message = "Content is required")
    String content
) {}