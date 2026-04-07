package com.aprende.ues.backend.dto;

import com.aprende.ues.backend.model.enums.CourseLevel;
import com.aprende.ues.backend.model.enums.CourseStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor
public class CourseResponseDTO {

    private UUID id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private CourseLevel level;
    private CourseStatus status;
    private UUID instructorId;
    private String instructorName;
    private UUID categoryId;
    private String categoryName;
    private OffsetDateTime createdAt;
}
