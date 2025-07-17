package com.unit_2_project.volunteer_stl.models.dtos.userDTOS;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateProfileDTO {
    private String email;
    private String phoneNumber;
    private String profilePictureUrl;
    private String bio;
}