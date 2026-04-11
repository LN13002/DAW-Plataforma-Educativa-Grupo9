package com.aprende.ues.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ReviewRequestDTO(

        @NotNull(message = "User id is mandatory")
        UUID userId,

        @NotNull(message = "Course id is mandatory")
        UUID courseId,

        @NotNull(message = "Rating is mandatory")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        Short rating,

        String body
) {
}