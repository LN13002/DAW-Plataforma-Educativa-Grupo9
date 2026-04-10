package com.aprende.ues.backend.dto;

import com.aprende.ues.backend.model.enums.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;

public record EnrollmentStatusRequestDTO(

        @NotNull(message = "El estado es obligatorio")
        EnrollmentStatus status
) {}
