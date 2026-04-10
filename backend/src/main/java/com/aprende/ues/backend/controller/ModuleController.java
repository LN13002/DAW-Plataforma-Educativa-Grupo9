package com.aprende.ues.backend.controller;
import com.aprende.ues.backend.dto.ModuleRequestDTO;
import com.aprende.ues.backend.dto.ModuleResponseDTO;
import com.aprende.ues.backend.service.ModuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Modules", description = "CRUD operations for course modules")
@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ModuleController {

    private final ModuleService moduleService;

    @Operation(summary = "Get all modules")
    @GetMapping
    public ResponseEntity<List<ModuleResponseDTO>> getAll() {
        return ResponseEntity.ok(moduleService.findAll());
    }

    @Operation(summary = "Get module by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ModuleResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(moduleService.findById(id));
    }

    @Operation(summary = "Create a new module")
    @PostMapping
    public ResponseEntity<ModuleResponseDTO> create(@Valid @RequestBody ModuleRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(moduleService.create(request));
    }

    @Operation(summary = "Update an existing module")
    @PutMapping("/{id}")
    public ResponseEntity<ModuleResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody ModuleRequestDTO request) {
        return ResponseEntity.ok(moduleService.update(id, request));
    }

    @Operation(summary = "Delete a module")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        moduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}