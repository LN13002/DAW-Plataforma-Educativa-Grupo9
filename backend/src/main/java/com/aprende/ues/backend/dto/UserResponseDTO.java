package com.aprende.ues.backend.dto;

import com.aprende.ues.backend.model.enums.UserRole;
import java.util.UUID;

public record UserResponseDTO(
    UUID id,
    String firstName,
    String lastName,
    String email,
    String avatarUrl,
    UserRole role,
    Boolean active
) {}