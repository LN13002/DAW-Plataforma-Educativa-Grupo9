package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.UserRequestDTO;
import com.aprende.ues.backend.dto.UserResponseDTO;
import com.aprende.ues.backend.model.User;
import com.aprende.ues.backend.model.enums.UserRole;
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
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponseDTO findById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toResponse(user);
    }

    @Transactional
    public UserResponseDTO create(UserRequestDTO request) {
      
        String emailToCheck = request.email();
        
        if (userRepository.existsByEmail(emailToCheck)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }
        
        User user = toEntity(request, new User());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO update(UUID id, UserRequestDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toResponse(userRepository.save(toEntity(request, user)));
    }

    @Transactional
    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponseDTO toResponse(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getActive()
        );
    }

    private User toEntity(UserRequestDTO request, User user) {
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setAvatarUrl(request.avatarUrl());
        
        
        user.setRole(request.role() != null ? request.role() : UserRole.student);

        
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(request.password());
        }
        
        return user;
    }
}