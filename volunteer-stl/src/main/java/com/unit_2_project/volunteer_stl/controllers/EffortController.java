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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/efforts")
@RequiredArgsConstructor
public class EffortController {

    private final EffortRepository effortRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @PostMapping("/{organizerId}")
    public ResponseEntity<Effort> createEffort(@PathVariable int organizerId, @RequestBody EffortCreationDTO effortData) {
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

            effortRepository.save(effort);
            return new ResponseEntity<>(HttpStatus.CREATED);

        }catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);

        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEffortById(@PathVariable int id) {
        Effort effort = effortRepository.findById(id)
                .orElse(null);

        if (effort != null){
            EffortRetrievalDTO effortDTO = new EffortRetrievalDTO();

            effortDTO.setEffortId(effort.getId());

            effortDTO.setEffortName(effort.getTitle());
            effortDTO.setUserId(effort.getOrganizer().getId());

            effortDTO.setStartTime(effort.getStartTime());
            effortDTO.setEndTime(effort.getEndTime());

            effortDTO.setAddress(effort.getAddress());
            effortDTO.setCity(effort.getCity());
            effortDTO.setState(effort.getState());
            effortDTO.setZipCode(effort.getZipCode());

            effortDTO.setTags(effort.getTags());

            effortDTO.setDescription(effort.getDescription());

            effortDTO.setImageUrl(effort.getImageUrl());
            effortDTO.setOrganizerName(effort.getOrganizer().getFirstName());

            effortDTO.setMaxVolunteers(effort.getMaxVolunteers());

            return ResponseEntity.ok(effortDTO);
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Effort not found");
        }
    }

    @GetMapping
    public List<EffortRetrievalDTO> getAllEfforts(){
        List<Effort> efforts = effortRepository.findAll();
        List<EffortRetrievalDTO> effortDTOs = new ArrayList<>();

        for(Effort effort: efforts){
            EffortRetrievalDTO effortDTO = new EffortRetrievalDTO();

            effortDTO.setEffortId(effort.getId());

            effortDTO.setEffortName(effort.getTitle());
            effortDTO.setUserId(effort.getOrganizer().getId());

            effortDTO.setStartTime(effort.getStartTime());
            effortDTO.setEndTime(effort.getEndTime());

            effortDTO.setAddress(effort.getAddress());
            effortDTO.setCity(effort.getCity());
            effortDTO.setState(effort.getState());
            effortDTO.setZipCode(effort.getZipCode());

            effortDTO.setTags(effort.getTags());

            effortDTO.setDescription(effort.getDescription());

            effortDTO.setImageUrl(effort.getImageUrl());
            effortDTO.setOrganizerName(effort.getOrganizer().getFirstName());

            effortDTO.setMaxVolunteers(effort.getMaxVolunteers());

            effortDTOs.add(effortDTO);
        }

        return effortDTOs;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEffortById(@PathVariable int id){
        if (!effortRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Effort not found");
        }

        effortRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
