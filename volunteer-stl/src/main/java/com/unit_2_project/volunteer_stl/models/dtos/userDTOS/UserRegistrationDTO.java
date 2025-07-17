package com.unit_2_project.volunteer_stl.models.dtos.userDTOS;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
}