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

@CrossOrigin(origins = "*", maxAge = 3600)
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

    @GetMapping("get-count-of-user-efforts-by-user/{userId}")
    public int getCountOfUserEffortsByUser(@PathVariable int userId) {
        return userEffortRepository.countByUserId(userId);
    }


    @GetMapping("get-count-of-user-efforts-by-effort/{effortId}")
    public int getCountOfUserEffortsByEffort(@PathVariable int effortId){
        return userEffortRepository.countByEffortId(effortId);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> updateUserEffortStatusComplete(@PathVariable int id){

        Optional<UserEffort> optionalUserEffort = userEffortRepository.findById(id);
        if (optionalUserEffort.isPresent()) {
            UserEffort userEffort = optionalUserEffort.get();
            userEffort.setStatus("completed");
            userEffort.setCompletedAt(LocalDateTime.now());
            userEffortRepository.save(userEffort);
            return ResponseEntity.ok(userEffort);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User effort not found");

        }
    }

    @PatchMapping("/{id}/canceled")
    public ResponseEntity<?> updateUserEffortStatusCanceled(@PathVariable int id){

        Optional<UserEffort> optionalUserEffort = userEffortRepository.findById(id);
        if (optionalUserEffort.isPresent()) {
            UserEffort userEffort = optionalUserEffort.get();
            userEffort.setStatus("canceled");
            userEffortRepository.save(userEffort);
            return ResponseEntity.ok(userEffort);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User effort not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserEffortById(@PathVariable int id){
        userEffortRepository.deleteById(id);
        return ResponseEntity.ok("User effort deleted");
    }
}
