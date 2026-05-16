package com.aprende.ues.backend.controller;

import com.aprende.ues.backend.dto.CertificateRequestDTO;
import com.aprende.ues.backend.dto.CertificateResponseDTO;
import com.aprende.ues.backend.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificates", description = "Operations for managing course completion certificates")
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    @Operation(summary = "Get all certificates", description = "Returns a list of all issued certificates")
    public ResponseEntity<List<CertificateResponseDTO>> getAll() {
        return ResponseEntity.ok(certificateService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get certificate by ID", description = "Returns a single certificate by its UUID")
    public ResponseEntity<CertificateResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(certificateService.getById(id));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download certificate", description = "Returns a printable HTML certificate document")
    public ResponseEntity<byte[]> download(@PathVariable UUID id) {
        CertificateResponseDTO certificate = certificateService.getById(id);
        byte[] document = certificateService.generateDocument(id);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(certificate.code() + ".html")
                        .build()
                        .toString())
                .body(document);
    }

    @PostMapping
    @Operation(summary = "Issue a certificate", description = "Creates and issues a new certificate for a completed enrollment")
    public ResponseEntity<CertificateResponseDTO> create(
            @Valid @RequestBody CertificateRequestDTO request) {
        CertificateResponseDTO created = certificateService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a certificate", description = "Updates the code or PDF URL of an existing certificate")
    public ResponseEntity<CertificateResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody CertificateRequestDTO request) {
        return ResponseEntity.ok(certificateService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a certificate", description = "Deletes a certificate by its UUID")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        certificateService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
