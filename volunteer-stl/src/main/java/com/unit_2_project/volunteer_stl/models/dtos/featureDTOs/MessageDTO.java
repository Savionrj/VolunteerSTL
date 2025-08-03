package com.unit_2_project.volunteer_stl.models.dtos.featureDTOs;

import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserRetrievalDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private int id;

    private String content;
    private LocalDateTime sentAt;
    private boolean edited;

    private int senderId;
    private int receiverId;
}
