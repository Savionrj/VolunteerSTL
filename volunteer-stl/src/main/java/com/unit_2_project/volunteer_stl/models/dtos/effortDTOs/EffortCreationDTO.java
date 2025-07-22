package com.unit_2_project.volunteer_stl.models.dtos.effortDTOs;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EffortCreationDTO {
    private String title;
    private String date;
    private String startTime;
    private String endTime;
    private String location;
    private List<String> tags;
    private String description;
    private String imageUrl;
    private int maxVolunteers;
    private boolean donationsNeeded;
}