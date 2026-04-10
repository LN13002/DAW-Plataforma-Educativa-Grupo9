package com.aprende.ues.backend.controller;

import com.aprende.ues.backend.dto.LessonProgressRequestDTO;
import com.aprende.ues.backend.dto.LessonProgressResponseDTO;
import com.aprende.ues.backend.service.LessonProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lesson-progress")
@RequiredArgsConstructor
@Tag(name = "Lesson Progress", description = "Endpoints for managing lesson progress of enrollments")
public class LessonProgressController {

    private final LessonProgressService lessonProgressService;

    @Operation(summary = "Get all lesson progress records", description = "Returns a list of all lesson progress records for all enrollments and lessons")
    @GetMapping
    public ResponseEntity<List<LessonProgressResponseDTO>> getAll() {
        return ResponseEntity.ok(lessonProgressService.getAll());
    }

    @Operation(summary = "Get lesson progress by ID", description = "Returns the lesson progress record with the specified ID")
    @GetMapping("/{id}")
    public ResponseEntity<LessonProgressResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(lessonProgressService.getById(id));
    }

    @Operation(summary = "Get lesson progress by enrollment and lesson", description = "Returns the lesson progress record for the specified enrollment and lesson")
    @GetMapping("/enrollment/{enrollmentId}/lesson/{lessonId}")
    public ResponseEntity<LessonProgressResponseDTO> getByEnrollmentAndLesson(
            @PathVariable UUID enrollmentId,
            @PathVariable UUID lessonId) {
        return ResponseEntity.ok(lessonProgressService.getByEnrollmentAndLesson(enrollmentId, lessonId));
    }

    @Operation(summary = "Get all lesson progress records for an enrollment", description = "Returns a list of all lesson progress records for the specified enrollment")
    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<LessonProgressResponseDTO>> getAllByEnrollment(
            @PathVariable UUID enrollmentId) {
        return ResponseEntity.ok(lessonProgressService.getAllByEnrollment(enrollmentId));
    }

    @Operation(summary = "Get lesson progress for all enrollments in a lesson", description = "Returns a list of all lesson progress records for the specified lesson")
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<LessonProgressResponseDTO>> getAllByLesson(
            @PathVariable UUID lessonId) {
        return ResponseEntity.ok(lessonProgressService.getAllByLesson(lessonId));
    }

    @Operation(summary = "Create or update lesson progress (upsert)", description = "Creates a new lesson progress record or updates an existing one")
    @PutMapping
    public ResponseEntity<LessonProgressResponseDTO> upsert(
            @Valid @RequestBody LessonProgressRequestDTO request) {
        return ResponseEntity.ok(lessonProgressService.upsert(request));
    }

    @Operation(summary = "Delete a lesson progress record", description = "Deletes the lesson progress record with the specified ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        lessonProgressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
