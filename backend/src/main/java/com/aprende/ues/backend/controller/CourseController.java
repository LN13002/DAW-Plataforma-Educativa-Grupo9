package com.aprende.ues.backend.controller;

import com.aprende.ues.backend.dto.CourseRequestDTO;
import com.aprende.ues.backend.dto.CourseResponseDTO;
import com.aprende.ues.backend.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "CRUD operations for courses")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Get all courses", description = "Returns a list of all available courses")
    public ResponseEntity<List<CourseResponseDTO>> getAll() {
        return ResponseEntity.ok(courseService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID", description = "Returns a single course by its UUID")
    public ResponseEntity<CourseResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create a course", description = "Creates a new course and returns it with status 201")
    public ResponseEntity<CourseResponseDTO> create(@RequestBody CourseRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a course", description = "Updates an existing course by its UUID")
    public ResponseEntity<CourseResponseDTO> update(@PathVariable UUID id,
                                                    @RequestBody CourseRequestDTO request) {
        return ResponseEntity.ok(courseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a course", description = "Deletes a course by its UUID")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
