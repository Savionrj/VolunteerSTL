package com.unit_2_project.volunteer_stl.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "effort_locations")
public class EffortLocation {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;

    private String address;
    private String city;
    private String zipCode;

    @OneToMany(mappedBy = "location")
    @JsonBackReference
    private List<Effort> efforts;
}
