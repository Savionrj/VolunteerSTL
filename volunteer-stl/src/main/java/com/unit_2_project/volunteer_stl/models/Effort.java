package com.unit_2_project.volunteer_stl.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "efforts")
public class Effort {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "time_id", referencedColumnName = "id")
    @JsonManagedReference
    private EffortTime time;
    @ManyToOne
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    @JsonManagedReference
    private EffortLocation location;
    @ManyToOne
    @JoinColumn(name = "organizer", referencedColumnName = "id")
    @JsonManagedReference
    private User organizer;

    @OneToMany(mappedBy = "effort", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<EffortTag> effortTags;
    @OneToMany(mappedBy = "effort", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("effort-userEfforts")
    private List<UserEffort> userEfforts;
    @OneToMany(mappedBy = "effort", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<EffortPageComment> effortComments;


    private int maxVolunteers;
    private boolean donationNeeded;
    private boolean effortCompleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imageUrl;
}
