package com.unit_2_project.volunteer_stl.models.dtos.effortDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEffortRetrievalDTO {
    private int id;

    private String status;
    private LocalDateTime registeredAt;
    private LocalDateTime completedAt;
    private int userId;
    private int effortId;
}
