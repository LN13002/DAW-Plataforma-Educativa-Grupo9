package com.aprende.ues.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ReviewResponseDTO(
        UUID id,
        UUID userId,
        UUID courseId,
        Short rating,
        String body,
        OffsetDateTime createdAt
) {
}