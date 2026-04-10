package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.LessonRequestDTO;
import com.aprende.ues.backend.dto.LessonResponseDTO;
import com.aprende.ues.backend.model.Lesson;
import com.aprende.ues.backend.model.Module;
import com.aprende.ues.backend.repository.LessonRepository;
import com.aprende.ues.backend.repository.ModuleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<LessonResponseDTO> getAll() {
        return lessonRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LessonResponseDTO getById(UUID id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found with id: " + id));
        return toResponse(lesson);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonResponseDTO> getAllByModule(UUID moduleId) {
        if (!moduleRepository.existsById(moduleId)) {
            throw new EntityNotFoundException("Module not found with id: " + moduleId);
        }
        return lessonRepository.findByModuleIdOrderByPosition(moduleId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public LessonResponseDTO create(LessonRequestDTO request) {
        Module module = moduleRepository.findById(request.moduleId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Module not found with id: " + request.moduleId()));

        Lesson lesson = new Lesson();
        lesson.setModule(module);
        lesson.setTitle(request.title());
        lesson.setDescription(request.description());
        lesson.setVideoUrl(request.videoUrl());
        lesson.setDurationSeconds(request.durationSeconds() != null ? request.durationSeconds() : 0);
        lesson.setPosition(request.position());

        return toResponse(lessonRepository.save(lesson));
    }

    @Override
    @Transactional
    public LessonResponseDTO update(UUID id, LessonRequestDTO request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found with id: " + id));

        if (!lesson.getModule().getId().equals(request.moduleId())) {
            Module module = moduleRepository.findById(request.moduleId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Module not found with id: " + request.moduleId()));
            lesson.setModule(module);
        }

        lesson.setTitle(request.title());
        lesson.setDescription(request.description());
        lesson.setVideoUrl(request.videoUrl());
        lesson.setDurationSeconds(request.durationSeconds() != null ? request.durationSeconds() : 0);
        lesson.setPosition(request.position());

        return toResponse(lessonRepository.save(lesson));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!lessonRepository.existsById(id)) {
            throw new EntityNotFoundException("Lesson not found with id: " + id);
        }
        lessonRepository.deleteById(id);
    }

    private LessonResponseDTO toResponse(Lesson lesson) {
        return new LessonResponseDTO(
                lesson.getId(),
                lesson.getModule().getId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getVideoUrl(),
                lesson.getDurationSeconds(),
                lesson.getPosition(),
                lesson.getType(),
                lesson.getPreview(),
                lesson.getPublished()
        );
    }
}
