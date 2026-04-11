package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.ReviewRequestDTO;
import com.aprende.ues.backend.dto.ReviewResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ReviewService {

    // Actions that reviews are able to perform
    List<ReviewResponseDTO> getAll();
    ReviewResponseDTO getById(UUID id);
    ReviewResponseDTO create(ReviewRequestDTO request);
    ReviewResponseDTO update(UUID id, ReviewRequestDTO request);
    void delete(UUID id);
}