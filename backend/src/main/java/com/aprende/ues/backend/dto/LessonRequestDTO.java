package com.aprende.ues.backend.dto;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LessonRequestDTO(

    @NotNull(message = "Module ID is required")
    UUID moduleId,
    
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    String title,

    String description,
    String videoUrl,

    Integer durationSeconds,

    @NotNull(message = "Position is required")
    @Min(value = 1, message = "Position must be greater than 0")
    Short position
) {}