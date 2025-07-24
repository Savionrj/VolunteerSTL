package com.unit_2_project.volunteer_stl.controllers;

import com.unit_2_project.volunteer_stl.models.Tag;
import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.UserEffort;
import com.unit_2_project.volunteer_stl.models.dtos.effortDTOs.*;
import com.unit_2_project.volunteer_stl.models.Effort;
import com.unit_2_project.volunteer_stl.repositories.EffortRepository;
import com.unit_2_project.volunteer_stl.repositories.UserEffortRepository;
import com.unit_2_project.volunteer_stl.repositories.UserRepository;
import com.unit_2_project.volunteer_stl.repositories.TagRepository;

import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user-efforts")
@RequiredArgsConstructor
public class UserEffortController {

    private final EffortRepository effortRepository;
    private final UserRepository userRepository;
    private final UserEffortRepository userEffortRepository;

    @PostMapping("/register-for-effort")
    public ResponseEntity<?> signupUserEffort(@RequestBody UserEffortDTO userEffortData ){
        User user = userRepository.findById(userEffortData.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Effort effort = effortRepository.findById(userEffortData.getEffortId())
                .orElseThrow(() -> new RuntimeException("Effort not found"));

        if(user != null && effort != null){
            UserEffort userEffort = new UserEffort();

            userEffort.setStatus("registered");
            userEffort.setRegisteredAt(LocalDateTime.now());
            userEffort.setUser(user);
            userEffort.setEffort(effort);
            return ResponseEntity.ok(userEffortRepository.save(userEffort));
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Effort not found");
        }

    }

    @GetMapping("/get-all-user-efforts")
    public List<UserEffort> getAllUserEfforts(){
        return userEffortRepository.findAll();
    }
}
