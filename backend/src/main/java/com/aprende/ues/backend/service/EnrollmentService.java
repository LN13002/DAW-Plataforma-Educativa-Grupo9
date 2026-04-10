package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.EnrollmentRequestDTO;
import com.aprende.ues.backend.dto.EnrollmentResponseDTO;
import com.aprende.ues.backend.dto.EnrollmentStatusRequestDTO;
import com.aprende.ues.backend.model.Course;
import com.aprende.ues.backend.model.Enrollment;
import com.aprende.ues.backend.model.User;
import com.aprende.ues.backend.repository.CourseRepository;
import com.aprende.ues.backend.repository.EnrollmentRepository;
import com.aprende.ues.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public List<EnrollmentResponseDTO> findAll() {
        return enrollmentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public EnrollmentResponseDTO findById(UUID id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment not found"));
        return toResponse(enrollment);
    }

    public List<EnrollmentResponseDTO> findByUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return enrollmentRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<EnrollmentResponseDTO> findByCourse(UUID courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EnrollmentResponseDTO create(EnrollmentRequestDTO request) {
        if (enrollmentRepository.existsByUserIdAndCourseId(request.userId(), request.courseId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already enrolled in this course");
        }

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);

        return toResponse(enrollmentRepository.save(enrollment));
    }

    @Transactional
    public EnrollmentResponseDTO updateStatus(UUID id, EnrollmentStatusRequestDTO request) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment not found"));

        enrollment.setStatus(request.status());
        return toResponse(enrollmentRepository.save(enrollment));
    }

    @Transactional
    public void delete(UUID id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment not found");
        }
        enrollmentRepository.deleteById(id);
    }

    private EnrollmentResponseDTO toResponse(Enrollment enrollment) {
        String studentName = enrollment.getUser().getFirstName() + " " + enrollment.getUser().getLastName();
        return new EnrollmentResponseDTO(
                enrollment.getId(),
                enrollment.getUser().getId(),
                studentName,
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                enrollment.getStatus(),
                enrollment.getProgress(),
                enrollment.getEnrolledAt(),
                enrollment.getCompletedAt()
        );
    }
}
