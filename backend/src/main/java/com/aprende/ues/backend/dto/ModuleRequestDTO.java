package com.aprende.ues.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ModuleRequestDTO(
    @NotNull(message = "Course ID is required")
    UUID courseId,

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    String title,

    String description,

    @NotNull(message = "Position is required")
    @Min(value = 1, message = "Position must be greater than 0")
    Short position,

    Boolean published
) {}