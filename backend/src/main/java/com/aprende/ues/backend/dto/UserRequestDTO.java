package com.aprende.ues.backend.dto;

import com.aprende.ues.backend.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequestDTO(
    @NotBlank(message = "First name is required")
    @Size(max = 100)
    String firstName,

    @NotBlank(message = "Last name is required")
    @Size(max = 100) 
    String lastName,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255)
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    String password,

    String avatarUrl,

    UserRole role
) {}