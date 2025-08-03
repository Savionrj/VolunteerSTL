package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.Message;
import com.unit_2_project.volunteer_stl.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findAllBySenderAndRecipient(User sender, User recipient);

    List<Message> findBySenderAndRecipientOrSenderAndRecipientOrderBySentAtAsc(
            User sender1, User recipient1,
            User sender2, User recipient2
    );
}
