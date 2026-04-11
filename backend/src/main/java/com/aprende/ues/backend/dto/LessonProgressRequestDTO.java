package com.aprende.ues.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record LessonProgressRequestDTO(

    @NotNull(message = "Enrollment ID is required")
    UUID enrollmentId,

    @NotNull(message = "Lesson ID is required")
    UUID lessonId,

    @Min(value = 0, message = "Seconds watched must be 0 or greater")
    Integer secondsWatched,

    Boolean completed
) {}