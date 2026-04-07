package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.CourseRequestDTO;
import com.aprende.ues.backend.dto.CourseResponseDTO;
import com.aprende.ues.backend.model.Category;
import com.aprende.ues.backend.model.Course;
import com.aprende.ues.backend.model.User;
import com.aprende.ues.backend.repository.CategoryRepository;
import com.aprende.ues.backend.repository.CourseRepository;
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
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public List<CourseResponseDTO> findAll() {
        return courseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CourseResponseDTO findById(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course not found with id: " + id));
        return toResponse(course);
    }

    @Transactional
    public CourseResponseDTO create(CourseRequestDTO request) {
        Course course = toEntity(request, new Course());
        return toResponse(courseRepository.save(course));
    }

    @Transactional
    public CourseResponseDTO update(UUID id, CourseRequestDTO request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course not found with id: " + id));
        return toResponse(courseRepository.save(toEntity(request, course)));
    }

    @Transactional
    public void delete(UUID id) {
        if (!courseRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    // ----------------------------------------------------------------
    // Mapping: Entity → ResponseDTO
    // ----------------------------------------------------------------
    private CourseResponseDTO toResponse(Course course) {
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setThumbnailUrl(course.getThumbnailUrl());
        dto.setLevel(course.getLevel());
        dto.setStatus(course.getStatus());
        dto.setCreatedAt(course.getCreatedAt());

        if (course.getInstructor() != null) {
            dto.setInstructorId(course.getInstructor().getId());
            dto.setInstructorName(
                    course.getInstructor().getFirstName() + " " + course.getInstructor().getLastName());
        }

        if (course.getCategory() != null) {
            dto.setCategoryId(course.getCategory().getId());
            dto.setCategoryName(course.getCategory().getName());
        }

        return dto;
    }

    // ----------------------------------------------------------------
    // Mapping: RequestDTO → Entity
    // ----------------------------------------------------------------
    private Course toEntity(CourseRequestDTO request, Course course) {
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());

        if (request.getLevel() != null) {
            course.setLevel(request.getLevel());
        }

        User instructor = userRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Instructor not found with id: " + request.getInstructorId()));
        course.setInstructor(instructor);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Category not found with id: " + request.getCategoryId()));
            course.setCategory(category);
        }

        return course;
    }
}
