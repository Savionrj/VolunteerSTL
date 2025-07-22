package com.unit_2_project.volunteer_stl.controllers;

import com.unit_2_project.volunteer_stl.models.Tag;
import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.dtos.effortDTOs.*;
import com.unit_2_project.volunteer_stl.models.Effort;
import com.unit_2_project.volunteer_stl.repositories.EffortRepository;
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

@RestController
@RequestMapping("/efforts")
@RequiredArgsConstructor
public class EffortController {

    private final EffortRepository effortRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @PostMapping
    public ResponseEntity<Effort> createEffort(@RequestBody EffortCreationDTO effortData, @RequestParam int organizerId) {
        try{
            User organizer = userRepository.findById(organizerId)
                    .orElseThrow(() -> new RuntimeException("Organizer not found"));

            Effort effort = new Effort();
            effort.setTitle(effortData.getTitle());
            effort.setDescription(effortData.getDescription());

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            LocalDate date = LocalDate.parse(effortData.getDate(), dateFormatter);
            LocalTime start = LocalTime.parse(effortData.getStartTime(), timeFormatter);
            LocalTime end = LocalTime.parse(effortData.getEndTime(), timeFormatter);
            effort.setStartTime(LocalDateTime.of(date, start));
            effort.setEndTime(LocalDateTime.of(date, end));

            String[] parts = effortData.getLocation().split(",");
            if (parts.length < 3) {
                return ResponseEntity.badRequest().body(null);
            }
            String street = parts[0].trim();
            String city = parts[1].trim();
            String stateZip = parts[2].trim();
            String[] stateZipParts = stateZip.split(" ");
            String state = stateZipParts[0];
            String zip = stateZipParts[1];

            effort.setAddress(street);
            effort.setCity(city);
            effort.setState(state);
            effort.setZipCode(zip);


            List<Tag> tags = effortData.getTags().stream()
                    .map(name -> {
                        return tagRepository.findByNameIgnoreCase(name.trim())
                                .orElseGet(() -> tagRepository.save(new Tag(name.trim())));
                    })
                    .toList();

            effort.setTags(tags);

            effort.setMaxVolunteers(effortData.getMaxVolunteers());
            effort.setDonationsNeeded(effortData.isDonationsNeeded());
            effort.setEffortCompleted(false);
            effort.setCreatedAt(java.time.LocalDateTime.now());
            effort.setDescription(effortData.getDescription());
            effort.setImageUrl(effortData.getImageUrl());

            effort.setOrganizer(organizer);

            Effort saved = effortRepository.save(effort);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);

        }catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);

        }
    }

    @GetMapping
    public List<Effort> getAllEfforts() {
        return effortRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEffortById(@PathVariable int id) {
        Effort effort = effortRepository.findById(id)
                .orElse(null);
        return effort != null ? ResponseEntity.ok(effort)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Effort not found");
    }
}
