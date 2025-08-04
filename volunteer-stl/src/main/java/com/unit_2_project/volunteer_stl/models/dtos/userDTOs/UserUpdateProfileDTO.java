package com.unit_2_project.volunteer_stl.models.dtos.userDTOs;

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
    private String firstName;
    private String lastName;
}