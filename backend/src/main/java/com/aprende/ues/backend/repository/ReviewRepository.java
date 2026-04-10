package com.aprende.ues.backend.repository;

import com.aprende.ues.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    // Prevents a user from submitting more than one review for the same course
    boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);
}
