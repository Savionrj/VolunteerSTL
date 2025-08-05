package com.unit_2_project.volunteer_stl.models.dtos.effortDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EffortUpdateDTO {

    private String title;
    private String description;
    private String date;
    private String startTime;
    private String endTime;
    private String location;
    private String tags;
    private int maxVolunteers;
    private int organizerId;
}
