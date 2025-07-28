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

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String address;
    private String city;
    private String state;
    private String zipCode;

    @ManyToOne
    @JoinColumn(name = "organizer", referencedColumnName = "id")
    @JsonManagedReference
    private User organizer;

    @OneToMany(mappedBy = "effort", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("effort-userEfforts")
    private List<UserEffort> userEfforts;
    @OneToMany(mappedBy = "effort", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<EffortPageComment> effortComments;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "efforts_tags",
            joinColumns = @JoinColumn(name = "effort_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @JsonManagedReference
    private List<Tag> tags;


    private int maxVolunteers;
    private boolean donationsNeeded;

    private boolean effortCompleted = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imageUrl;
}
