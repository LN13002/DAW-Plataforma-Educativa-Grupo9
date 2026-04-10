package com.aprende.ues.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record EnrollmentRequestDTO(

        @NotNull(message = "El ID del usuario es obligatorio")
        UUID userId,

        @NotNull(message = "El ID del curso es obligatorio")
        UUID courseId
) {}
