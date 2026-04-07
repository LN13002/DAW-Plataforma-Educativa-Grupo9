package com.aprende.ues.backend.model;

import com.aprende.ues.backend.model.enums.LessonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
    name = "lessons",
    uniqueConstraints = @UniqueConstraint(columnNames = {"module_id", "position"})
)
@Getter @Setter @NoArgsConstructor
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Column(nullable = false, length = 255)
    private String title;

    @Column
    private String description;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "duration_sec", nullable = false)
    private Integer durationSeconds = 0;

    @Column(nullable = false)
    private Short position;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "lesson_type")
    private LessonType type = LessonType.video;

    @Column(name = "is_preview", nullable = false)
    private Boolean preview = false;

    @Column(name = "is_published", nullable = false)
    private Boolean published = false;
}
