package com.aprende.ues.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CertificateRequestDTO(

        @NotNull(message = "Enrollment id is mandatory")
        UUID enrollmentId,

        @Size(max = 64, message = "Code Id cannot be longer than 64 characters")
        String code,

        String pdfUrl

        ) {
}
