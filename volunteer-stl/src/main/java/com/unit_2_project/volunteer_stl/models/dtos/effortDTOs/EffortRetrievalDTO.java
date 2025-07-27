package com.unit_2_project.volunteer_stl.models.dtos.effortDTOs;

import com.unit_2_project.volunteer_stl.models.Tag;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EffortRetrievalDTO {
    private int effortId;

    private String effortName;
    private int userId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String address;
    private String city;
    private String state;
    private String zipCode;

    private List<Tag> tags;

    private String description;

    private String imageUrl;
    private String organizerName;
}
