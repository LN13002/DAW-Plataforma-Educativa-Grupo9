package com.aprende.ues.backend.dto;

import com.aprende.ues.backend.model.enums.LessonType;

import java.util.UUID;

public record LessonResponseDTO(
    UUID id,
    UUID moduleId,
    String title,
    String description,
    String videoUrl,
    Integer durationSeconds,
    Short position,
    LessonType type,
    Boolean preview,
    Boolean published
) {}