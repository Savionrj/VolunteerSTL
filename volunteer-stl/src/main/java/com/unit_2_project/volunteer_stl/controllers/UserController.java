package com.unit_2_project.volunteer_stl.controllers;

import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserRegistrationDTO;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserRetrievalDTO;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserLoginDTO;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserUpdateProfileDTO;
import com.unit_2_project.volunteer_stl.repositories.UserRepository;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

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
        user.setProfilePictureUrl("/images/stlFlagLogo.png");

        userRepository.save(user);

        UserRetrievalDTO userRetrievalData = new UserRetrievalDTO(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getProfilePictureUrl(),
                user.getBio()
        );

        return ResponseEntity.ok(userRetrievalData);
    }

    @PostMapping("/login")
    public ResponseEntity<?> getUserByUsernameAndPassword(@RequestBody UserLoginDTO userLoginDTO){

        Optional<User> optionalUser = userRepository.findByUsername(userLoginDTO.getUsername());

        if(optionalUser.isPresent()){
            User user = optionalUser.get();

            if(!Objects.equals(user.getPassword(), userLoginDTO.getPassword())){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }
            else{
                UserRetrievalDTO userRetrievalData = new UserRetrievalDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getProfilePictureUrl(),
                        user.getBio()
                );

                return ResponseEntity.ok(userRetrievalData);
            }
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
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
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody UserLoginDTO userUpdateData) {
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

    @PutMapping(value = "/{id}/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @PathVariable int id,
            @RequestPart("user") UserUpdateProfileDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        return userRepository.findById(id).map(user -> {
            user.setFirstName(dto.getFirstName());
            user.setLastName(dto.getLastName());
            user.setEmail(dto.getEmail());
            user.setPhoneNumber(dto.getPhoneNumber());
            user.setBio(dto.getBio());

            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    String fileName = UUID.randomUUID() + "-" + imageFile.getOriginalFilename();
                    Path path = Paths.get("uploads/profile-pictures", fileName);
                    Files.createDirectories(path.getParent());
                    Files.write(path, imageFile.getBytes());
                    user.setProfilePictureUrl("/uploads/profile-pictures/" + fileName);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed.");
                }
            }else{
                user.setProfilePictureUrl("/images/stlFlagLogo.png");
            }

            userRepository.save(user);
            UserRetrievalDTO userRetrievalDTO = new UserRetrievalDTO(
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getBio(),
                    user.getProfilePictureUrl(),
                    user.getUsername()
            );

            return ResponseEntity.ok(userRetrievalDTO);
        }).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok("User deleted successfully.");
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }



}
