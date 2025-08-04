package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.EffortPageComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EffortPageCommentRepository extends JpaRepository<EffortPageComment, Integer> {
    List<EffortPageComment> findAllByEffortIdOrderByPostedAtDesc(int effortId);
}

