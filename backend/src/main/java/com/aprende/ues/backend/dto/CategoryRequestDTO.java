package com.aprende.ues.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CategoryRequestDTO(
    @NotBlank(message = "Name is required")
    @Size(max = 100)
    String name,

    @NotBlank(message = "Slug is required")
    @Size(max = 100)
    String slug,

    @Size(max = 500)
    String description,

    UUID parentId 
) {}