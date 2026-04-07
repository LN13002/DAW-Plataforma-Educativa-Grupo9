package com.aprende.ues.backend.dto;

import com.aprende.ues.backend.model.enums.CourseLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter @Setter @NoArgsConstructor
public class CourseRequestDTO {

    private String title;
    private String description;
    private String thumbnailUrl;
    private CourseLevel level;
    private UUID instructorId;
    private UUID categoryId;
}
