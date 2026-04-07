package com.aprende.ues.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
    name = "modules",
    uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "position"})
)
@Getter @Setter @NoArgsConstructor
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, length = 255)
    private String title;

    @Column
    private String description;

    @Column(nullable = false)
    private Short position;

    @Column(name = "is_published", nullable = false)
    private Boolean published = false;
}
