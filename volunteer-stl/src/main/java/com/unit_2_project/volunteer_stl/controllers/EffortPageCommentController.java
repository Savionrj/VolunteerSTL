package com.unit_2_project.volunteer_stl.controllers;

import com.unit_2_project.volunteer_stl.models.EffortPageComment;
import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.Effort;
import com.unit_2_project.volunteer_stl.models.dtos.featureDTOs.CommentDTO;
import com.unit_2_project.volunteer_stl.models.dtos.featureDTOs.SimpleCommentDTO;
import com.unit_2_project.volunteer_stl.repositories.EffortPageCommentRepository;
import com.unit_2_project.volunteer_stl.repositories.EffortRepository;
import com.unit_2_project.volunteer_stl.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/effort-comments")
@RequiredArgsConstructor
public class EffortPageCommentController {

    private final EffortPageCommentRepository commentRepository;
    private final EffortRepository effortRepository;
    private final UserRepository userRepository;

    @GetMapping("/{effortId}")
    public ResponseEntity<List<CommentDTO>> getCommentsForEffort(@PathVariable int effortId) {

        List<EffortPageComment> comments = commentRepository.findAllByEffortIdOrderByPostedAtDesc(effortId);

        List<CommentDTO> commentDTOS = comments.stream()
                .map(c -> new CommentDTO(
                        c.getId(),
                        c.getComment(),
                        c.getPostedAt().toString(),
                        c.getUser().getUsername()
                ))
                .toList();
        return ResponseEntity.ok(commentDTOS);
    }


    @PostMapping
    public ResponseEntity<?> postComment(@RequestParam int effortId,
                                         @RequestParam int userId,
                                         @RequestBody SimpleCommentDTO comment) {
        Optional<Effort> optionalEffort = effortRepository.findById(effortId);
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalEffort.isEmpty() || optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Effort or user not found");
        }

        EffortPageComment newComment = new EffortPageComment();
        newComment.setComment(comment.getComment());

        newComment.setEffort(optionalEffort.get());
        newComment.setUser(optionalUser.get());
        newComment.setPostedAt(LocalDateTime.now());
        newComment.setEdited(false);

        commentRepository.save(newComment);
        return ResponseEntity.ok(newComment);
    }
}
