package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.ModuleRequestDTO;
import com.aprende.ues.backend.dto.ModuleResponseDTO;
import com.aprende.ues.backend.model.Course;
import com.aprende.ues.backend.model.Module;
import com.aprende.ues.backend.repository.CourseRepository;
import com.aprende.ues.backend.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    public List<ModuleResponseDTO> findAll() {
        return moduleRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ModuleResponseDTO findById(UUID id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public ModuleResponseDTO create(ModuleRequestDTO request) {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        Module module = new Module();
        module.setCourse(course);
        module.setTitle(request.title());
        module.setDescription(request.description());
        module.setPosition(request.position());
        module.setPublished(request.published() != null ? request.published() : false);

        return toResponse(moduleRepository.save(module));
    }

    @Transactional
    public ModuleResponseDTO update(UUID id, ModuleRequestDTO request) {
        Module module = findOrThrow(id);

        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        module.setCourse(course);
        module.setTitle(request.title());
        module.setDescription(request.description());
        module.setPosition(request.position());
        module.setPublished(request.published() != null ? request.published() : module.getPublished());

        return toResponse(moduleRepository.save(module));
    }

    @Transactional
    public void delete(UUID id) {
        if (!moduleRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found");
        }
        moduleRepository.deleteById(id);
    }

    // Entity → DTO
    private ModuleResponseDTO toResponse(Module module) {
        return new ModuleResponseDTO(
                module.getId(),
                module.getCourse().getId(),
                module.getCourse().getTitle(),
                module.getTitle(),
                module.getDescription(),
                module.getPosition(),
                module.getPublished()
        );
    }

    private Module findOrThrow(UUID id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));
    }
}