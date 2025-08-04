package com.unit_2_project.volunteer_stl.models.dtos.featureDTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {

    private int id;

    private String comment;
    private String postedAt;
    private String username;

}
