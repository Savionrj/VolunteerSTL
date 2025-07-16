package com.unit_2_project.volunteer_stl.models;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private LocalDateTime toDelete;
    private String profilePictureUrl;
    @Column(columnDefinition = "TEXT")
    private String bio;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-userEfforts")
    private List<UserEffort> userEfforts;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-effortComments")
    private List<EffortPageComment> effortComments;

    @OneToMany(mappedBy = "currentUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-connections-sent")
    private List<Connection> connectionsSent;
    @OneToMany(mappedBy = "connectedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-connections-received")
    private List<Connection> connectionsReceived;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-message-sent")
    private List<Message> messageSent;
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-message-received")
    private List<Message> messageReceived;

    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Effort> effortOrganized;
}
