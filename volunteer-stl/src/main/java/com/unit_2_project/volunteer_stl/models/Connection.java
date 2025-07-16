package com.unit_2_project.volunteer_stl.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "connections")
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "current_user_id", nullable = false)
    @JsonBackReference("user-connections-sent")
    private User currentUser;

    @ManyToOne
    @JoinColumn(name = "connected_user_id", nullable = false)
    @JsonBackReference("user-connections-received")
    private User connectedUser;

    private String status; // (pending, accepted, rejected)
    private LocalDateTime createdAt;
}
