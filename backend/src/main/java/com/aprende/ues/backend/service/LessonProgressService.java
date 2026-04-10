package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.LessonProgressRequestDTO;
import com.aprende.ues.backend.dto.LessonProgressResponseDTO;

import java.util.List;
import java.util.UUID;

public interface LessonProgressService {

    List<LessonProgressResponseDTO> getAll();

    LessonProgressResponseDTO upsert(LessonProgressRequestDTO request);

    LessonProgressResponseDTO getById(UUID id);

    LessonProgressResponseDTO getByEnrollmentAndLesson(UUID enrollmentId, UUID lessonId);

    List<LessonProgressResponseDTO> getAllByEnrollment(UUID enrollmentId);

    List<LessonProgressResponseDTO> getAllByLesson(UUID lessonId);

    void delete(UUID id);
}
