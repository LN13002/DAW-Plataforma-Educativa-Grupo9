package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.LessonProgressRequestDTO;
import com.aprende.ues.backend.dto.LessonProgressResponseDTO;
import com.aprende.ues.backend.model.Enrollment;
import com.aprende.ues.backend.model.Lesson;
import com.aprende.ues.backend.model.LessonProgress;
import com.aprende.ues.backend.repository.EnrollmentRepository;
import com.aprende.ues.backend.repository.LessonProgressRepository;
import com.aprende.ues.backend.repository.LessonRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LessonProgressServiceImpl implements LessonProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<LessonProgressResponseDTO> getAll() {
        return lessonProgressRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Si no existe el registro de progreso para la combinación de enrollment y lesson, se crea uno nuevo.
    @Override
    @Transactional
    public LessonProgressResponseDTO upsert(LessonProgressRequestDTO request) {
        Enrollment enrollment = enrollmentRepository.findById(request.enrollmentId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Enrollment not found with id: " + request.enrollmentId()));

        Lesson lesson = lessonRepository.findById(request.lessonId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Lesson not found with id: " + request.lessonId()));

        LessonProgress progress = lessonProgressRepository
                .findByEnrollmentIdAndLessonId(request.enrollmentId(), request.lessonId())
                .orElseGet(LessonProgress::new);

        progress.setEnrollment(enrollment);
        progress.setLesson(lesson);
        int watched = request.secondsWatched() != null ? request.secondsWatched() : 0;
        int duration = lesson.getDurationSeconds() != null ? lesson.getDurationSeconds() : 0;

        boolean autoCompleted = duration > 0 && watched >= duration;
        progress.setSecondsWatched(watched);
        progress.setCompleted(Boolean.TRUE.equals(request.completed()) || autoCompleted);
        progress.setLastWatchedAt(OffsetDateTime.now());

        return toResponse(lessonProgressRepository.save(progress));
    }

    @Override
    @Transactional(readOnly = true)
    public LessonProgressResponseDTO getById(UUID id) {
        LessonProgress progress = lessonProgressRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "LessonProgress not found with id: " + id));
        return toResponse(progress);
    }

    @Override
    @Transactional(readOnly = true)
    public LessonProgressResponseDTO getByEnrollmentAndLesson(UUID enrollmentId, UUID lessonId) {
        LessonProgress progress = lessonProgressRepository
                .findByEnrollmentIdAndLessonId(enrollmentId, lessonId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Progress not found for enrollment " + enrollmentId +
                        " and lesson " + lessonId));
        return toResponse(progress);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonProgressResponseDTO> getAllByEnrollment(UUID enrollmentId) {
        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new EntityNotFoundException("Enrollment not found with id: " + enrollmentId);
        }
        return lessonProgressRepository.findByEnrollmentId(enrollmentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonProgressResponseDTO> getAllByLesson(UUID lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new EntityNotFoundException("Lesson not found with id: " + lessonId);
        }
        return lessonProgressRepository.findByLessonId(lessonId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!lessonProgressRepository.existsById(id)) {
            throw new EntityNotFoundException("LessonProgress not found with id: " + id);
        }
        lessonProgressRepository.deleteById(id);
    }

    private LessonProgressResponseDTO toResponse(LessonProgress progress) {
        return new LessonProgressResponseDTO(
                progress.getId(),
                progress.getEnrollment().getId(),
                progress.getLesson().getId(),
                progress.getCompleted(),
                progress.getSecondsWatched(),
                progress.getLastWatchedAt()
        );
    }
}