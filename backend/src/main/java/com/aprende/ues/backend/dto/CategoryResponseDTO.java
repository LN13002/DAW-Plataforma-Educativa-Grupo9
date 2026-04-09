package com.aprende.ues.backend.dto;

import java.util.UUID;

public record CategoryResponseDTO(
    UUID id,
    String name,
    String slug,
    String description,
    ParentCategoryDTO parent
) {
   
    public record ParentCategoryDTO(
        UUID id,
        String name,
        String slug
    ) {}
}