package com.aprende.ues.backend.controller;

import com.aprende.ues.backend.dto.LessonRequestDTO;
import com.aprende.ues.backend.dto.LessonResponseDTO;
import com.aprende.ues.backend.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@Tag(name = "Lessons", description = "CRUD operations for lessons")
public class LessonController {

    private final LessonService lessonService;

    @Operation(summary = "Get all lessons", description = "Returns a list of all lessons")
    @GetMapping
    public ResponseEntity<List<LessonResponseDTO>> getAll() {
        return ResponseEntity.ok(lessonService.getAll());
    }

    @Operation(summary = "Get a lesson by ID", description = "Returns a lesson with the specified ID")
    @GetMapping("/{id}")
    public ResponseEntity<LessonResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(lessonService.getById(id));
    }

    @Operation(summary = "Get all lessons by module", description = "Returns a list of all lessons for the specified module")
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<LessonResponseDTO>> getAllByModule(@PathVariable UUID moduleId) {
        return ResponseEntity.ok(lessonService.getAllByModule(moduleId));
    }

    @Operation(summary = "Create a lesson", description = "Creates a new lesson")
    @PostMapping
    public ResponseEntity<LessonResponseDTO> create(@Valid @RequestBody LessonRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lessonService.create(request));
    }

    @Operation(summary = "Update a lesson", description = "Updates an existing lesson")
    @PutMapping("/{id}")
    public ResponseEntity<LessonResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody LessonRequestDTO request) {
        return ResponseEntity.ok(lessonService.update(id, request));
    }

    @Operation(summary = "Delete a lesson", description = "Deletes a lesson with the specified ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        lessonService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
