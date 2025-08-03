package com.unit_2_project.volunteer_stl.controllers;

import com.unit_2_project.volunteer_stl.models.Connection;
import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.dtos.connectionDTOs.ConnectionDTO;
import com.unit_2_project.volunteer_stl.repositories.ConnectionRepository;
import com.unit_2_project.volunteer_stl.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/connections")
@RequiredArgsConstructor
public class ConnectionController {
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Connection> sendConnection(@RequestParam int senderId, @RequestParam int receiverId){

        Optional<User> optionalSender = userRepository.findById(senderId);
        Optional<User> optionalReceiver = userRepository.findById(receiverId);

        if(optionalSender.isPresent() && optionalReceiver.isPresent()){
            User sender = optionalSender.get();
            User receiver = optionalReceiver.get();

            Connection connection = new Connection();

            connection.setCurrentUser(sender);
            connection.setConnectedUser(receiver);
            connection.setStatus("pending");
            connection.setCreatedAt(java.time.LocalDateTime.now());

            connectionRepository.save(connection);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/by-receiver")
    public List<ConnectionDTO> getAllConnectionsByReceiverId(@RequestParam int receiverId){

        Optional<User> optionalReceiver = userRepository.findById(receiverId);


        if(optionalReceiver.isPresent()){
            User receiver = optionalReceiver.get();

            List<Connection> connections = connectionRepository.findAllByConnectedUser(receiver);
            List<ConnectionDTO> connectionDTOS = new ArrayList<>();

            for(Connection connection: connections){
                if (!"ACCEPTED".equalsIgnoreCase(connection.getStatus())) continue;
                ConnectionDTO connectionDTO = new ConnectionDTO();

                connectionDTO.setConnectionId(connection.getId());

                connectionDTO.setStatus(connection.getStatus());
                connectionDTO.setCreatedAt(connection.getCreatedAt());

                connectionDTO.setSenderUserId(connection.getCurrentUser().getId());
                connectionDTO.setSenderFirstName(connection.getCurrentUser().getFirstName());
                connectionDTO.setSenderLastName(connection.getCurrentUser().getLastName());
                connectionDTO.setSenderProfilePicURL(connection.getCurrentUser().getProfilePictureUrl());

                connectionDTO.setReceiverUserId(connection.getConnectedUser().getId());
                connectionDTO.setReceiverFirstName(connection.getConnectedUser().getFirstName());
                connectionDTO.setReceiverLastName(connection.getConnectedUser().getLastName());
                connectionDTO.setReceiverProfilePicURL(connection.getConnectedUser().getProfilePictureUrl());

                connectionDTOS.add(connectionDTO);
            }

            return connectionDTOS;
        }
        else{
            return null;
        }
    }

    @GetMapping("/by-receiver-pending")
    public List<ConnectionDTO> getAllConnectionsByReceiverIdPending(@RequestParam int receiverId){

        Optional<User> optionalReceiver = userRepository.findById(receiverId);


        if(optionalReceiver.isPresent()){
            User receiver = optionalReceiver.get();

            List<Connection> connections = connectionRepository.findAllByConnectedUser(receiver);
            List<ConnectionDTO> connectionDTOS = new ArrayList<>();

            for(Connection connection: connections){
                if (!"PENDING".equalsIgnoreCase(connection.getStatus())) continue;
                ConnectionDTO connectionDTO = new ConnectionDTO();

                connectionDTO.setConnectionId(connection.getId());

                connectionDTO.setStatus(connection.getStatus());
                connectionDTO.setCreatedAt(connection.getCreatedAt());

                connectionDTO.setSenderUserId(connection.getCurrentUser().getId());
                connectionDTO.setSenderFirstName(connection.getCurrentUser().getFirstName());
                connectionDTO.setSenderLastName(connection.getCurrentUser().getLastName());
                connectionDTO.setSenderProfilePicURL(connection.getCurrentUser().getProfilePictureUrl());

                connectionDTO.setReceiverUserId(connection.getConnectedUser().getId());
                connectionDTO.setReceiverFirstName(connection.getConnectedUser().getFirstName());
                connectionDTO.setReceiverLastName(connection.getConnectedUser().getLastName());
                connectionDTO.setReceiverProfilePicURL(connection.getConnectedUser().getProfilePictureUrl());

                connectionDTOS.add(connectionDTO);
            }

            return connectionDTOS;
        }
        else{
            return null;
        }
    }

    @GetMapping("/already-connected")
    public String checkAlreadyConnected(@RequestParam int currUserId, @RequestParam int viewedUserId){

        Optional<User> sender = userRepository.findById(currUserId);
        Optional<User> receiver = userRepository.findById(viewedUserId);

        if(sender.isPresent() && receiver.isPresent()){
            User a = sender.get();
            User b = receiver.get();
            Optional<Connection> previousRequest = connectionRepository.findByCurrentUserAndConnectedUser(a,b);
            Optional<Connection> previousRequestReverse = connectionRepository.findByCurrentUserAndConnectedUser(b,a);

            if(previousRequest.isPresent()){
                Connection connection = previousRequest.get();

                return connection.getStatus();

            }else if(previousRequestReverse.isPresent()){
                Connection connection = previousRequestReverse.get();

                return connection.getStatus();
            }

            return "Connection Doesn't Exist";
        }
        return "A User Doesn't Exist";
    }

    @PatchMapping("/connection-response")
    public ResponseEntity<ConnectionDTO> respondToConnection(@RequestParam String response, @RequestParam int connectionId){

        Optional<Connection> optionalConnection = connectionRepository.findById(connectionId);

        if(optionalConnection.isPresent()){
            Connection connection = optionalConnection.get();

            connection.setStatus(response);
            connectionRepository.save(connection);
            ConnectionDTO connectionDTO = new ConnectionDTO();
            connectionDTO.setConnectionId(connection.getId());
            connectionDTO.setSenderUserId(connection.getCurrentUser().getId());
            connectionDTO.setReceiverUserId(connection.getConnectedUser().getId());
            connectionDTO.setStatus(connection.getStatus());
            connectionDTO.setCreatedAt(connection.getCreatedAt());

            return ResponseEntity.ok(connectionDTO);
        }else{
            return null;
        }

    }
}
