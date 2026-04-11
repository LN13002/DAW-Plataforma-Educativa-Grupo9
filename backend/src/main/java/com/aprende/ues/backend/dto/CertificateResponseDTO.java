package com.aprende.ues.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CertificateResponseDTO(

        UUID id,
        UUID enrollmentId,
        String code,
        String pdfUrl,
        OffsetDateTime issuedAt
) {}
