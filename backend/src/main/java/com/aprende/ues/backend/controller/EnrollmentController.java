package com.aprende.ues.backend.controller;

import com.aprende.ues.backend.dto.EnrollmentRequestDTO;
import com.aprende.ues.backend.dto.EnrollmentResponseDTO;
import com.aprende.ues.backend.dto.EnrollmentStatusRequestDTO;
import com.aprende.ues.backend.service.EnrollmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Enrollments", description = "CRUD operations for enrollments")
@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDTO>> getAll() {
        return ResponseEntity.ok(enrollmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(enrollmentService.findById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EnrollmentResponseDTO>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(enrollmentService.findByUser(userId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrollmentResponseDTO>> getByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(enrollmentService.findByCourse(courseId));
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> create(@Valid @RequestBody EnrollmentRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentService.create(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EnrollmentResponseDTO> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody EnrollmentStatusRequestDTO request) {
        return ResponseEntity.ok(enrollmentService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        enrollmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
