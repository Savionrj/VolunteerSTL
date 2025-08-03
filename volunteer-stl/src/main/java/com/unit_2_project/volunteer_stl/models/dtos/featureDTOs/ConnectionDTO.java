package com.unit_2_project.volunteer_stl.models.dtos.featureDTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionDTO {
    private int connectionId;

    private int senderUserId;
    private String senderFirstName;
    private String senderLastName;
    private String senderProfilePicURL;

    private int receiverUserId;
    private String ReceiverFirstName;
    private String ReceiverLastName;
    private String receiverProfilePicURL;

    private String status;
    private LocalDateTime createdAt;
}
