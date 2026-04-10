package com.aprende.ues.backend.dto;

import com.aprende.ues.backend.model.enums.EnrollmentStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record EnrollmentResponseDTO(
        UUID id,
        UUID userId,
        String studentName,
        UUID courseId,
        String courseTitle,
        EnrollmentStatus status,
        BigDecimal progress,
        OffsetDateTime enrolledAt,
        OffsetDateTime completedAt
) {}
