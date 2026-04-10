package com.aprende.ues.backend.controller;

import com.aprende.ues.backend.dto.CertificateRequestDTO;
import com.aprende.ues.backend.dto.CertificateResponseDTO;
import com.aprende.ues.backend.service.CertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    // ── GET ALL ──────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<CertificateResponseDTO>> getAll() {
        return ResponseEntity.ok(certificateService.getAll());
    }

    // ── GET BY ID ────────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(certificateService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CertificateResponseDTO> create(
            @Valid @RequestBody CertificateRequestDTO request) {

        CertificateResponseDTO created = certificateService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificateResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody CertificateRequestDTO request) {

        return ResponseEntity.ok(certificateService.update(id, request));
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        certificateService.delete(id);
        return ResponseEntity.noContent().build();
    }
}