package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.EnrollmentRequestDTO;
import com.aprende.ues.backend.dto.EnrollmentResponseDTO;
import com.aprende.ues.backend.dto.EnrollmentStatusRequestDTO;
import com.aprende.ues.backend.model.Course;
import com.aprende.ues.backend.model.Enrollment;
import com.aprende.ues.backend.model.User;
import com.aprende.ues.backend.model.enums.EnrollmentStatus;
import com.aprende.ues.backend.repository.CourseRepository;
import com.aprende.ues.backend.repository.EnrollmentRepository;
import com.aprende.ues.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private EnrollmentService enrollmentService;

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private User buildUser(UUID id, String firstName, String lastName) {
        User user = new User();
        user.setId(id);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(firstName.toLowerCase() + "@test.com");
        user.setPasswordHash("hash");
        return user;
    }

    private Course buildCourse(UUID id, String title) {
        Course course = new Course();
        course.setId(id);
        course.setTitle(title);
        return course;
    }

    private Enrollment buildEnrollment(UUID id, User user, Course course) {
        Enrollment enrollment = new Enrollment();
        enrollment.setId(id);
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus(EnrollmentStatus.active);
        enrollment.setProgress(BigDecimal.ZERO);
        enrollment.setEnrolledAt(OffsetDateTime.now());
        return enrollment;
    }

    // ─── findAll ─────────────────────────────────────────────────────────────────

    @Test
    void findAll_withEnrollments_returnsMappedList() {
        // Arrange
        User user = buildUser(UUID.randomUUID(), "Carlos", "Lopez");
        Course course = buildCourse(UUID.randomUUID(), "Spring Boot Avanzado");
        Enrollment enrollment = buildEnrollment(UUID.randomUUID(), user, course);
        when(enrollmentRepository.findAll()).thenReturn(List.of(enrollment));

        // Act
        List<EnrollmentResponseDTO> result = enrollmentService.findAll();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).studentName()).isEqualTo("Carlos Lopez");
        assertThat(result.get(0).courseTitle()).isEqualTo("Spring Boot Avanzado");
        assertThat(result.get(0).status()).isEqualTo(EnrollmentStatus.active);
    }

    @Test
    void findAll_withNoEnrollments_returnsEmptyList() {
        // Arrange
        when(enrollmentRepository.findAll()).thenReturn(List.of());

        // Act
        List<EnrollmentResponseDTO> result = enrollmentService.findAll();

        // Assert
        assertThat(result).isEmpty();
    }

    // ─── findById ────────────────────────────────────────────────────────────────

    @Test
    void findById_existingId_returnsDTO() {
        // Arrange
        UUID id = UUID.randomUUID();
        User user = buildUser(UUID.randomUUID(), "Andrea", "Torres");
        Course course = buildCourse(UUID.randomUUID(), "React desde cero");
        Enrollment enrollment = buildEnrollment(id, user, course);
        when(enrollmentRepository.findById(id)).thenReturn(Optional.of(enrollment));

        // Act
        EnrollmentResponseDTO result = enrollmentService.findById(id);

        // Assert
        assertThat(result.id()).isEqualTo(id);
        assertThat(result.studentName()).isEqualTo("Andrea Torres");
        assertThat(result.courseTitle()).isEqualTo("React desde cero");
    }

    @Test
    void findById_nonExistingId_throws404() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(enrollmentRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> enrollmentService.findById(id))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    // ─── findByUser ──────────────────────────────────────────────────────────────

    @Test
    void findByUser_existingUser_returnsEnrollmentList() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User user = buildUser(userId, "Miguel", "Hernandez");
        Course course = buildCourse(UUID.randomUUID(), "Java 21");
        Enrollment enrollment = buildEnrollment(UUID.randomUUID(), user, course);
        when(userRepository.existsById(userId)).thenReturn(true);
        when(enrollmentRepository.findByUserId(userId)).thenReturn(List.of(enrollment));

        // Act
        List<EnrollmentResponseDTO> result = enrollmentService.findByUser(userId);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).userId()).isEqualTo(userId);
    }

    @Test
    void findByUser_nonExistingUser_throws404() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userRepository.existsById(userId)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> enrollmentService.findByUser(userId))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    // ─── findByCourse ────────────────────────────────────────────────────────────

    @Test
    void findByCourse_existingCourse_returnsEnrollmentList() {
        // Arrange
        UUID courseId = UUID.randomUUID();
        User user = buildUser(UUID.randomUUID(), "Laura", "Sanchez");
        Course course = buildCourse(courseId, "Docker y Kubernetes");
        Enrollment enrollment = buildEnrollment(UUID.randomUUID(), user, course);
        when(courseRepository.existsById(courseId)).thenReturn(true);
        when(enrollmentRepository.findByCourseId(courseId)).thenReturn(List.of(enrollment));

        // Act
        List<EnrollmentResponseDTO> result = enrollmentService.findByCourse(courseId);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).courseId()).isEqualTo(courseId);
    }

    @Test
    void findByCourse_nonExistingCourse_throws404() {
        // Arrange
        UUID courseId = UUID.randomUUID();
        when(courseRepository.existsById(courseId)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> enrollmentService.findByCourse(courseId))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    // ─── create ──────────────────────────────────────────────────────────────────

    @Test
    void create_validRequest_returnsCreatedEnrollment() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID courseId = UUID.randomUUID();
        User user = buildUser(userId, "Roberto", "Cruz");
        Course course = buildCourse(courseId, "PostgreSQL Avanzado");
        Enrollment saved = buildEnrollment(UUID.randomUUID(), user, course);

        when(enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)).thenReturn(false);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(saved);

        EnrollmentRequestDTO request = new EnrollmentRequestDTO(userId, courseId);

        // Act
        EnrollmentResponseDTO result = enrollmentService.create(request);

        // Assert
        assertThat(result.userId()).isEqualTo(userId);
        assertThat(result.courseId()).isEqualTo(courseId);
        assertThat(result.status()).isEqualTo(EnrollmentStatus.active);
        assertThat(result.progress()).isEqualByComparingTo(BigDecimal.ZERO);
        verify(enrollmentRepository).save(any(Enrollment.class));
    }

    @Test
    void create_duplicateEnrollment_throws409() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID courseId = UUID.randomUUID();
        when(enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)).thenReturn(true);

        EnrollmentRequestDTO request = new EnrollmentRequestDTO(userId, courseId);

        // Act & Assert
        assertThatThrownBy(() -> enrollmentService.create(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.CONFLICT));

        verify(enrollmentRepository, never()).save(any());
    }

    @Test
    void create_nonExistingUser_throws404() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID courseId = UUID.randomUUID();
        when(enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)).thenReturn(false);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        EnrollmentRequestDTO request = new EnrollmentRequestDTO(userId, courseId);

        // Act & Assert
        assertThatThrownBy(() -> enrollmentService.create(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));

        verify(enrollmentRepository, never()).save(any());
    }

    @Test
    void create_nonExistingCourse_throws404() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID courseId = UUID.randomUUID();
        User user = buildUser(userId, "Carlos", "Lopez");
        when(enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)).thenReturn(false);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        EnrollmentRequestDTO request = new EnrollmentRequestDTO(userId, courseId);

        // Act & Assert
        assertThatThrownBy(() -> enrollmentService.create(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));

        verify(enrollmentRepository, never()).save(any());
    }

    // ─── updateStatus ────────────────────────────────────────────────────────────

    @Test
    void updateStatus_existingEnrollment_returnsUpdatedDTO() {
        // Arrange
        UUID id = UUID.randomUUID();
        User user = buildUser(UUID.randomUUID(), "Ana", "Gutierrez");
        Course course = buildCourse(UUID.randomUUID(), "Machine Learning");
        Enrollment enrollment = buildEnrollment(id, user, course);

        Enrollment updated = buildEnrollment(id, user, course);
        updated.setStatus(EnrollmentStatus.completed);

        when(enrollmentRepository.findById(id)).thenReturn(Optional.of(enrollment));
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(updated);

        EnrollmentStatusRequestDTO request = new EnrollmentStatusRequestDTO(EnrollmentStatus.completed);

        // Act
        EnrollmentResponseDTO result = enrollmentService.updateStatus(id, request);

        // Assert
        assertThat(result.status()).isEqualTo(EnrollmentStatus.completed);
        verify(enrollmentRepository).save(enrollment);
    }

    @Test
    void updateStatus_nonExistingEnrollment_throws404() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(enrollmentRepository.findById(id)).thenReturn(Optional.empty());

        EnrollmentStatusRequestDTO request = new EnrollmentStatusRequestDTO(EnrollmentStatus.cancelled);

        // Act & Assert
        assertThatThrownBy(() -> enrollmentService.updateStatus(id, request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));

        verify(enrollmentRepository, never()).save(any());
    }

    // ─── delete ──────────────────────────────────────────────────────────────────

    @Test
    void delete_existingEnrollment_deletesSuccessfully() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(enrollmentRepository.existsById(id)).thenReturn(true);

        // Act
        enrollmentService.delete(id);

        // Assert
        verify(enrollmentRepository).deleteById(id);
    }

    @Test
    void delete_nonExistingEnrollment_throws404() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(enrollmentRepository.existsById(id)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> enrollmentService.delete(id))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));

        verify(enrollmentRepository, never()).deleteById(any());
    }
}
