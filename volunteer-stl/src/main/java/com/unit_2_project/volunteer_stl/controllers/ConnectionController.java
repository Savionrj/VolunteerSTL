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
                ConnectionDTO connectionDTO = new ConnectionDTO();

                connectionDTO.setConnectionId(connection.getId());
                connectionDTO.setReceiverUserId(connection.getConnectedUser().getId());
                connectionDTO.setSenderUserId(connection.getCurrentUser().getId());
                connectionDTO.setStatus(connection.getStatus());
                connectionDTO.setCreatedAt(connection.getCreatedAt());

                connectionDTOS.add(connectionDTO);
            }

            return connectionDTOS;
        }
        else{
            return null;
        }


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
