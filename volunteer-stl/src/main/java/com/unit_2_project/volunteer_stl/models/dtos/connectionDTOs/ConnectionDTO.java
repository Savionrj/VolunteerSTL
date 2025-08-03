package com.unit_2_project.volunteer_stl.models.dtos.connectionDTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionDTO {
    private int connectionId;
    private int senderUserId;
    private int receiverUserId;
    private String status;
    private LocalDateTime createdAt;
}
