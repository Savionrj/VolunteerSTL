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
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String content;
    private LocalDateTime sentAt;
    private boolean edited;

    @ManyToOne
    @JoinColumn(name = "sender_user_id", nullable = false)
    @JsonBackReference("user-message-sent")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_user_id", nullable = false)
    @JsonBackReference("user-message-received")
    private User recipient;
}
