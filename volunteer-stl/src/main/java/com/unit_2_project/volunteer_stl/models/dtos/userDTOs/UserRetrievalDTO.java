package com.unit_2_project.volunteer_stl.models.dtos.userDTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRetrievalDTO {
    private int id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String profilePictureUrl;
    private String bio;
}
