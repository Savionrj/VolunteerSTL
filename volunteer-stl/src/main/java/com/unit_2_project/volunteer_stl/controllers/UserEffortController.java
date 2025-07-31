package com.unit_2_project.volunteer_stl.controllers;

import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.UserEffort;
import com.unit_2_project.volunteer_stl.models.dtos.effortDTOs.*;
import com.unit_2_project.volunteer_stl.models.Effort;
import com.unit_2_project.volunteer_stl.repositories.EffortRepository;
import com.unit_2_project.volunteer_stl.repositories.UserEffortRepository;
import com.unit_2_project.volunteer_stl.repositories.UserRepository;

import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
    public ResponseEntity<?> signupUserEffort(@RequestBody UserEffortCreationDTO userEffortData ){
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

            if(userEffortRepository.existsByUserIdAndEffortId(user.getId(), effort.getId())){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User is already registered for this effort.");
            }

            userEffortRepository.save(userEffort);

            UserEffortRetrievalDTO userEffortRetrievalDTO = new UserEffortRetrievalDTO();

            userEffortRetrievalDTO.setId(userEffort.getId());
            userEffortRetrievalDTO.setStatus(userEffort.getStatus());
            userEffortRetrievalDTO.setRegisteredAt(userEffort.getRegisteredAt());
            userEffortRetrievalDTO.setUserId(userEffort.getUser().getId());
            userEffortRetrievalDTO.setEffortId(userEffort.getEffort().getId());

            return ResponseEntity.ok(userEffortRetrievalDTO);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Effort not found");
        }

    }

    @GetMapping("/get-all-user-efforts")
    public List<UserEffort> getAllUserEfforts(){
        return userEffortRepository.findAll();
    }

    @GetMapping("/get-count-of-user-efforts-by-user/{userId}")
    public int getCountOfUserEffortsByUser(@PathVariable int userId) {
        return userEffortRepository.countByUserId(userId);
    }

    @GetMapping("/get-user-effort-by-user-and-effort")
    public boolean getUserEffortByUserAndEffort(@RequestParam int userId, @RequestParam int effortId)
    {
        Optional<UserEffort> optionalUserEffort = userEffortRepository
                .findByUserIdAndEffortId(userId, effortId);

        return optionalUserEffort.isPresent();
    }
    
    @GetMapping("get-count-of-user-efforts-by-effort/{effortId}")
    public int getCountOfUserEffortsByEffort(@PathVariable int effortId){
        return userEffortRepository.countByEffortId(effortId);
    }

    @GetMapping("/my-efforts/{userId}")
    public List<EffortRetrievalDTO> MyEfforts(@PathVariable int userId){
        List<UserEffort> myUserEfforts = userEffortRepository.findAllByUserId(userId);
        List<EffortRetrievalDTO> myEfforts = new ArrayList<>();

        for(UserEffort myUserEffort : myUserEfforts){
            int effortId = myUserEffort.getEffort().getId();
            Optional<Effort> optionalMyEffort = effortRepository.findById(effortId);

            if(optionalMyEffort.isPresent()){
                EffortRetrievalDTO myEffort = new EffortRetrievalDTO();


                myEffort.setEffortId(optionalMyEffort.get().getId());
                myEffort.setEffortName(optionalMyEffort.get().getTitle());
                myEffort.setUserId(userId);

                myEffort.setStartTime(optionalMyEffort.get().getStartTime());
                myEffort.setEndTime(optionalMyEffort.get().getEndTime());

                myEffort.setAddress(optionalMyEffort.get().getAddress());
                myEffort.setCity(optionalMyEffort.get().getCity());
                myEffort.setState(optionalMyEffort.get().getState());
                myEffort.setZipCode(optionalMyEffort.get().getZipCode());

                myEffort.setTags(optionalMyEffort.get().getTags());
                
                myEffort.setDescription(optionalMyEffort.get().getDescription());
                myEffort.setImageUrl(optionalMyEffort.get().getImageUrl());
                myEffort.setOrganizerName(optionalMyEffort.get().getOrganizer().getFirstName());

                myEffort.setMaxVolunteers(optionalMyEffort.get().getMaxVolunteers());


                myEfforts.add(myEffort);
            }
        }

        return myEfforts;
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

    @DeleteMapping("/unregister")
    public ResponseEntity<?> deleteUserEffortById(@RequestParam int userId, @RequestParam int effortId) {

        Optional<UserEffort> optionalUserEffort = userEffortRepository.findByUserIdAndEffortId(userId, effortId);
        UserEffort userEffort;

        if (optionalUserEffort.isPresent()) {
            userEffort = optionalUserEffort.get();
            userEffortRepository.delete(userEffort);
            return ResponseEntity.ok("User effort deleted");
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Effort does not exist");
        }
    }
}
