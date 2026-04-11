package com.aprende.ues.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record LessonProgressResponseDTO(
    UUID id,
    UUID enrollmentId,
    UUID lessonId,
    Boolean completed,
    Integer secondsWatched,
    OffsetDateTime lastWatchedAt
) {}