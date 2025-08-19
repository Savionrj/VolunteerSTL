package com.unit_2_project.volunteer_stl.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unit_2_project.volunteer_stl.models.Tag;
import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.dtos.effortDTOs.*;
import com.unit_2_project.volunteer_stl.models.Effort;
import com.unit_2_project.volunteer_stl.models.dtos.userDTOs.UserUpdateProfileDTO;
import com.unit_2_project.volunteer_stl.repositories.EffortRepository;
import com.unit_2_project.volunteer_stl.repositories.UserRepository;
import com.unit_2_project.volunteer_stl.repositories.TagRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/efforts")
@RequiredArgsConstructor
public class EffortController {

    private final EffortRepository effortRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @PostMapping(path = "/new-effort/{organizerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Effort> createEffort(@PathVariable int organizerId,
                                               @RequestParam("title") String title,
                                               @RequestParam("description") String description,
                                               @RequestParam("date") String date,
                                               @RequestParam("startTime") String startTime,
                                               @RequestParam("endTime") String endTime,
                                               @RequestParam("location") String location,
                                               @RequestParam("tags") String tagsJson,
                                               @RequestParam("maxVolunteers") int maxVolunteers,
                                               @RequestParam("donationsNeeded") boolean donationsNeeded,
                                               @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try{
            User organizer = userRepository.findById(organizerId)
                    .orElseThrow(() -> new RuntimeException("Organizer not found"));

            Effort effort = new Effort();
            effort.setTitle(title);
            effort.setDescription(description);

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

            LocalDate parsedDate = LocalDate.parse(date, dateFormatter);
            LocalTime start = LocalTime.parse(startTime, timeFormatter);
            LocalTime end = LocalTime.parse(endTime, timeFormatter);

            effort.setStartTime(LocalDateTime.of(parsedDate, start));
            effort.setEndTime(LocalDateTime.of(parsedDate, end));


            String[] parts = location.split(",");
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


            ObjectMapper mapper = new ObjectMapper();
            List<String> tagList = mapper.readValue(tagsJson, new TypeReference<List<String>>() {});
            List<Tag> tags = tagList.stream()
                    .map(String::trim)
                    .filter(name -> !name.isEmpty())
                            .map(name -> tagRepository.findByNameIgnoreCase(name.trim())
                            .orElseGet(() -> tagRepository.save(new Tag(name.trim()))))
                    .toList();

            effort.setTags(tags);

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/images");
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                effort.setImageUrl("/uploads/images/" + fileName);
            }else {
                effort.setImageUrl("/images/stLouis-default.jpg");
            }

            effort.setMaxVolunteers(maxVolunteers);
            effort.setDonationsNeeded(donationsNeeded);
            effort.setEffortCompleted(false);
            effort.setCreatedAt(java.time.LocalDateTime.now());

            effort.setOrganizer(organizer);

            effortRepository.save(effort);
            return ResponseEntity.status(HttpStatus.CREATED).body(effort);


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
        List<Effort> efforts = effortRepository.findAllByEndTimeAfterOrderByStartTimeAsc(LocalDateTime.now());
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

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping(value = "/{effortId}/update-effort", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateEffort(@PathVariable int effortId,
                                               @RequestPart("effort") EffortUpdateDTO dto,
                                               @RequestPart(value = "image", required = false) MultipartFile imageFile) {


        try{
            User organizer = userRepository.findById(dto.getOrganizerId())
                    .orElseThrow(() -> new RuntimeException("Organizer not found"));
            Effort existingEffort = effortRepository.findById(effortId)
                    .orElseThrow(()-> new RuntimeException("Effort not found"));

            existingEffort.setTitle(dto.getTitle());
            existingEffort.setDescription(dto.getDescription());

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

            LocalDate parsedDate = LocalDate.parse(dto.getDate(), dateFormatter);
            LocalTime start = LocalTime.parse(dto.getStartTime(), timeFormatter);
            LocalTime end = LocalTime.parse(dto.getEndTime(), timeFormatter);

            existingEffort.setStartTime(LocalDateTime.of(parsedDate, start));
            existingEffort.setEndTime(LocalDateTime.of(parsedDate, end));


            String[] parts = dto.getLocation().split(",");
            if (parts.length < 3) {
                return ResponseEntity.badRequest().body(null);
            }
            String street = parts[0].trim();
            String city = parts[1].trim();
            String stateZip = parts[2].trim();
            String[] stateZipParts = stateZip.split(" ");
            String state = stateZipParts[0];
            String zip = stateZipParts[1];

            existingEffort.setAddress(street);
            existingEffort.setCity(city);
            existingEffort.setState(state);
            existingEffort.setZipCode(zip);


            ObjectMapper mapper = new ObjectMapper();
            List<String> tagList = mapper.readValue(dto.getTags(), new TypeReference<List<String>>() {});
            List<Tag> tags = tagList.stream()
                    .map(String::trim)
                    .filter(name -> !name.isEmpty())
                    .map(name -> tagRepository.findByNameIgnoreCase(name.trim())
                            .orElseGet(() -> tagRepository.save(new Tag(name.trim()))))
                    .toList();

            existingEffort.getTags().clear();
            existingEffort.getTags().addAll(tags);

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/images");
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                existingEffort.setImageUrl("/uploads/images/" + fileName);
            }else {
                existingEffort.setImageUrl("/images/stLouis-default.jpg");
            }

            existingEffort.setMaxVolunteers(dto.getMaxVolunteers());
            existingEffort.setDonationsNeeded(false);
            existingEffort.setEffortCompleted(false);
            existingEffort.setCreatedAt(existingEffort.getCreatedAt());

            existingEffort.setOrganizer(organizer);

            effortRepository.save(existingEffort);

            EffortRetrievalDTO effortDTO = new EffortRetrievalDTO();

            effortDTO.setEffortId(existingEffort.getId());
            effortDTO.setEffortName(existingEffort.getTitle());
            effortDTO.setUserId(existingEffort.getOrganizer().getId());

            effortDTO.setStartTime(existingEffort.getStartTime());
            effortDTO.setEndTime(existingEffort.getEndTime());

            effortDTO.setAddress(existingEffort.getAddress());
            effortDTO.setCity(existingEffort.getCity());
            effortDTO.setState(existingEffort.getState());
            effortDTO.setZipCode(existingEffort.getZipCode());

            effortDTO.setTags(existingEffort.getTags());

            effortDTO.setDescription(existingEffort.getDescription());

            effortDTO.setImageUrl(existingEffort.getImageUrl());
            effortDTO.setOrganizerName(existingEffort.getOrganizer().getFirstName());

            effortDTO.setMaxVolunteers(existingEffort.getMaxVolunteers());

            return ResponseEntity.status(HttpStatus.CREATED).body(effortDTO);


        }catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);

        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEffortById(@PathVariable int id){
        if (!effortRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Effort not found");
        }

        effortRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
