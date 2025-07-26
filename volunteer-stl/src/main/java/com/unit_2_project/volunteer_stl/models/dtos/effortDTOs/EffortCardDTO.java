package com.unit_2_project.volunteer_stl.models.dtos.effortDTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EffortCardDTO {
    private int effortId;

    private String imageUrl;
    private String effortName;
    private LocalDateTime startTime;
    private String organizerName;

    private int userId;
}
