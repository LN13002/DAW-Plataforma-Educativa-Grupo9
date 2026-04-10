package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.CommentRequestDTO;
import com.aprende.ues.backend.dto.CommentResponseDTO;
import com.aprende.ues.backend.model.Comment;
import com.aprende.ues.backend.model.Lesson;
import com.aprende.ues.backend.model.User;
import com.aprende.ues.backend.repository.CommentRepository;
import com.aprende.ues.backend.repository.LessonRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    public List<CommentResponseDTO> findAll() {
        return commentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CommentResponseDTO findById(UUID id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public CommentResponseDTO create(CommentRequestDTO request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Lesson lesson = lessonRepository.findById(request.lessonId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setLesson(lesson);
        comment.setContent(request.content());
        comment.setLikes(0);

        if (request.parentId() != null) {
            Comment parent = findOrThrow(request.parentId());
            comment.setParent(parent);
        }

        return toResponse(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponseDTO update(UUID id, CommentRequestDTO request) {
        Comment comment = findOrThrow(id);
        comment.setContent(request.content());
        return toResponse(commentRepository.save(comment));
    }

    @Transactional
    public void delete(UUID id) {
        if (!commentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }
        commentRepository.deleteById(id);
    }

    
private CommentResponseDTO toResponse(Comment comment) {
    UUID parentId = comment.getParent() != null ? comment.getParent().getId() : null;

    return new CommentResponseDTO(
            comment.getId(),
            comment.getUser().getId(),
            comment.getLesson().getId(),
            parentId,
            comment.getContent(),
            comment.getLikes(),
            comment.getCreatedAt()
    );
}
    private Comment findOrThrow(UUID id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
    }
}