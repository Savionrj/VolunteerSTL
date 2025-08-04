package com.unit_2_project.volunteer_stl.controllers;

import com.unit_2_project.volunteer_stl.models.Message;
import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.dtos.featureDTOs.MessageDTO;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserRetrievalDTO;
import com.unit_2_project.volunteer_stl.repositories.MessageRepository;
import com.unit_2_project.volunteer_stl.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody MessageDTO messageDTO){
        Message message = new Message();

        Optional<User> optionalSender = userRepository.findById(messageDTO.getSenderId());
        Optional<User> optionalRecipient = userRepository.findById(messageDTO.getReceiverId());
        message.setContent(messageDTO.getContent());

        if( optionalSender.isPresent() && optionalRecipient.isPresent()){
            User sender = optionalSender.get();
            User recipient = optionalRecipient.get();

            message.setSender(sender);
            message.setRecipient(recipient);
            message.setSentAt(java.time.LocalDateTime.now());
            message.setEdited(false);

            messageRepository.save(message);

            MessageDTO messageDTOreturn = new MessageDTO();

            messageDTOreturn.setId(message.getId());

            messageDTOreturn.setSenderId(message.getSender().getId());
            messageDTOreturn.setReceiverId(message.getRecipient().getId());

            messageDTOreturn.setSentAt(java.time.LocalDateTime.now());
            messageDTOreturn.setEdited(false);
            messageDTOreturn.setContent(message.getContent());

            return ResponseEntity.status(HttpStatus.CREATED).body(messageDTOreturn);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @GetMapping("/history")
    public List<MessageDTO> getMessagesBetweenUsers(@RequestParam int senderId, @RequestParam int receiverId){

        Optional<User> optionalSender = userRepository.findById(senderId);
        Optional<User> optionalRecipient = userRepository.findById(receiverId);
        if(optionalSender.isPresent() && optionalRecipient.isPresent()){
            User sender = optionalSender.get();
            User recipient = optionalRecipient.get();

            List<Message> messagesRaw = messageRepository.findBySenderAndRecipientOrSenderAndRecipientOrderBySentAtAsc(sender,recipient, recipient, sender);
            List<MessageDTO> messages = new ArrayList<>();

            for(Message message:messagesRaw){
                MessageDTO messageDTO = new MessageDTO();

                messageDTO.setId(message.getId());
                messageDTO.setReceiverId(message.getRecipient().getId());
                messageDTO.setSenderId(message.getSender().getId());
                messageDTO.setContent(message.getContent());
                messageDTO.setSentAt(message.getSentAt());

                messages.add(messageDTO);
            }

            return messages;
        }

        return null;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<UserRetrievalDTO>> getConversations(@RequestParam int userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        User currentUser = optionalUser.get();

        Set<User> conversationPartners = new HashSet<>();

        List<Message> sentMessages = messageRepository.findAllBySender(currentUser);
        List<Message> receivedMessages = messageRepository.findAllByRecipient(currentUser);

        if (sentMessages != null) {
            for (Message message : sentMessages) {
                if (message.getRecipient() != null) {
                    conversationPartners.add(message.getRecipient());
                }
            }
        }

        if (receivedMessages != null) {
            for (Message message : receivedMessages) {
                if (message.getSender() != null) {
                    conversationPartners.add(message.getSender());
                }
            }
        }

        List<UserRetrievalDTO> result = new ArrayList<>();

        for (User user : conversationPartners) {
            UserRetrievalDTO dto = new UserRetrievalDTO();

            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setBio(user.getBio());
            dto.setProfilePictureUrl(user.getProfilePictureUrl());
            result.add(dto);
        }

        return ResponseEntity.ok(Collections.unmodifiableList(result));
    }


}
