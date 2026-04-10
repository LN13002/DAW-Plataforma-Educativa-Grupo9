package com.aprende.ues.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CommentResponseDTO(
    UUID id,
    UUID userId,
    UUID lessonId,
    UUID parentId,
    String content,
    Integer likes,
    OffsetDateTime createdAt
) {}