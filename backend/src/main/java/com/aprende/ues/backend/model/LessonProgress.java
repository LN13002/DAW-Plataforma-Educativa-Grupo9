package com.aprende.ues.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "lesson_progress",
    uniqueConstraints = @UniqueConstraint(columnNames = {"enrollment_id", "lesson_id"})
)
@Getter @Setter @NoArgsConstructor
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "is_completed", nullable = false)
    private Boolean completed = false;

    @Column(name = "seconds_watched", nullable = false)
    private Integer secondsWatched = 0;

    @Column(name = "last_watched_at", nullable = false)
    private OffsetDateTime lastWatchedAt = OffsetDateTime.now();
}
