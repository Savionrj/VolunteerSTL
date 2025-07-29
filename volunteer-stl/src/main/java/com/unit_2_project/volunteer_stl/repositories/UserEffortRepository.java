package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.UserEffort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEffortRepository extends JpaRepository<UserEffort, Integer> {
    int countByUserId(int userId);
    int countByEffortId(int effortId);

    boolean existsByUserIdAndEffortId(int userId, int effortId);
}
