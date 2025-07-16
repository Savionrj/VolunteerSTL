package com.unit_2_project.volunteer_stl.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.jmx.export.annotation.ManagedAttribute;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "efforts_tags")
public class EffortTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "effort_id", nullable = false)
    @JsonBackReference
    private Effort effort;
    @ManyToOne
    @JoinColumn(name = "tag_id", nullable = false)
    @JsonBackReference
    private Tag tag;
}
