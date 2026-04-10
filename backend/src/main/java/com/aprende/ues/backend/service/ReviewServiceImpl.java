package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.ReviewRequestDTO;
import com.aprende.ues.backend.dto.ReviewResponseDTO;
import com.aprende.ues.backend.exceptions.ReviewAlreadyExistsException;
import com.aprende.ues.backend.exceptions.ReviewNotFoundException;
import com.aprende.ues.backend.model.Review;
import com.aprende.ues.backend.repository.CourseRepository;
import com.aprende.ues.backend.repository.ReviewRepository;
import com.aprende.ues.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final ReviewRepository reviewRepository;
    private final UserRepository   userRepository;
    private final CourseRepository courseRepository;


    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getAll() {
        return reviewRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponseDTO getById(UUID id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(id.toString()));

        return toResponseDTO(review);
    }

    @Override
    @Transactional
    public ReviewResponseDTO create(ReviewRequestDTO request) {

        // 1. The user must exist
        // TODO: replace RuntimeException with UserNotFoundException when the User module is ready
        var user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + request.userId()));

        // 2. The course must exist
        // TODO: replace RuntimeException with CourseNotFoundException when the Course module is ready
        var course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new RuntimeException(
                        "Course not found with id: " + request.courseId()));

        // 3. The user must not already have a review for this course
        if (reviewRepository.existsByUserIdAndCourseId(request.userId(), request.courseId())) {
            throw new ReviewAlreadyExistsException(
                    request.userId().toString(),
                    request.courseId().toString());
        }

        Review review = new Review();
        review.setUser(user);
        review.setCourse(course);
        review.setRating(request.rating());
        review.setBody(request.body());

        return toResponseDTO(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public ReviewResponseDTO update(UUID id, ReviewRequestDTO request) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(id.toString()));

        review.setRating(request.rating());
        review.setBody(request.body());
        // user, course and createdAt are immutable, do not modify them

        return toResponseDTO(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!reviewRepository.existsById(id)) {
            throw new ReviewNotFoundException(id.toString());
        }
        reviewRepository.deleteById(id);
    }

    // MAPPER

    private ReviewResponseDTO toResponseDTO(Review review) {
        return new ReviewResponseDTO(
                review.getId(),
                review.getUser().getId(),
                review.getCourse().getId(),
                review.getRating(),
                review.getBody(),
                review.getCreatedAt()
        );
    }
}
