package com.unit_2_project.volunteer_stl.models.dtos.userDTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateLoginDTO {
    private String username;
    private String password;
}