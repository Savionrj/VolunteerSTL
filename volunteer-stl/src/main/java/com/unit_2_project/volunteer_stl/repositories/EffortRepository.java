package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.User;
import com.unit_2_project.volunteer_stl.models.UserEffort;
import org.springframework.data.jpa.repository.JpaRepository;
import com.unit_2_project.volunteer_stl.models.Effort;

import java.util.List;

public interface EffortRepository extends JpaRepository<Effort, Integer> {
    int countByOrganizer(User user);
    List<Effort> findAllByOrganizer(User organizer);
}
