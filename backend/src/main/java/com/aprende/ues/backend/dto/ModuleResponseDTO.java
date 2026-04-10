package com.aprende.ues.backend.dto;

import java.util.UUID;

public record ModuleResponseDTO(
    UUID id,
    UUID courseId,
    String courseTitle,
    String title,
    String description,
    Short position,
    Boolean published
) {}