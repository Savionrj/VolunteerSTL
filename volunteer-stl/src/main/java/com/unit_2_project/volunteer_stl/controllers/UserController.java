package com.unit_2_project.volunteer_stl.controllers;

import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.*;
import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserRegistrationDTO;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserRetrievalDTO;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserUpdateLoginDTO;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserUpdateProfileDTO;
import com.unit_2_project.volunteer_stl.repositories.UserRepository;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO userData) {
        if (userRepository.existsByUsername(userData.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken.");
        }

        User user = new User();
        user.setUsername(userData.getUsername());
        user.setPassword(userData.getPassword());
        user.setFirstName(userData.getFirstName());
        user.setLastName(userData.getLastName());
        user.setEmail(userData.getEmail());
        user.setCreatedAt(java.time.LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        return userRepository.findById(id)
                .map(user -> {
                    UserRetrievalDTO userData = new UserRetrievalDTO(
                            user.getId(),
                            user.getUsername(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getEmail(),
                            user.getProfilePictureUrl(),
                            user.getBio()
                    );
                    return ResponseEntity.ok(userData);
                }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<User> userList = userRepository.findAll();
        List<UserRetrievalDTO> userDTOs = new ArrayList<>();

        for (User user : userList){
            userDTOs.add(new UserRetrievalDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getProfilePictureUrl(),
                    user.getBio()
            ));
        }

        return ResponseEntity.ok(userDTOs);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody UserUpdateProfileDTO userUpdateData) {
        return userRepository.findById(id).map(user -> {
            if (userUpdateData.getBio() != null) {
                user.setBio(userUpdateData.getBio());
            }
            if (userUpdateData.getProfilePictureUrl() != null) {
                user.setProfilePictureUrl(userUpdateData.getProfilePictureUrl());
            }
            if (userUpdateData.getPhoneNumber() != null) {
                user.setPhoneNumber(userUpdateData.getPhoneNumber());
            }
            if (userUpdateData.getEmail() != null) {
                user.setEmail(userUpdateData.getEmail());
            }

            userRepository.save(user);
            return ResponseEntity.ok("User updated successfully.");
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

    @PatchMapping("/loginUpdate/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody UserUpdateLoginDTO userUpdateData) {
        return userRepository.findById(id).map(user -> {
            if (userUpdateData.getUsername() != null) {
                user.setUsername(userUpdateData.getUsername());
            }
            if (userUpdateData.getPassword() != null) {
                user.setPassword(userUpdateData.getPassword());
            }

            userRepository.save(user);
            return ResponseEntity.ok("User updated successfully.");
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok("User deleted successfully.");
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }



}
