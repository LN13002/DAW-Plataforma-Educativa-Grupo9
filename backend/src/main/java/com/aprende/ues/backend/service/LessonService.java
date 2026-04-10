package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.LessonRequestDTO;
import com.aprende.ues.backend.dto.LessonResponseDTO;

import java.util.List;
import java.util.UUID;

public interface LessonService {

    List<LessonResponseDTO> getAll();

    LessonResponseDTO getById(UUID id);

    List<LessonResponseDTO> getAllByModule(UUID moduleId);

    LessonResponseDTO create(LessonRequestDTO request);

    LessonResponseDTO update(UUID id, LessonRequestDTO request);

    void delete(UUID id);
}
