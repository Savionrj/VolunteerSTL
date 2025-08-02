package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.unit_2_project.volunteer_stl.models.Effort;

public interface EffortRepository extends JpaRepository<Effort, Integer> {
    int countByOrganizer(User user);
}
