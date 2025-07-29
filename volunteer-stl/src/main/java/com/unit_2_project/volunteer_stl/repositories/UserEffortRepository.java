package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.UserEffort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserEffortRepository extends JpaRepository<UserEffort, Integer> {
    int countByUserId(int userId);
    int countByEffortId(int effortId);

    boolean existsByUserIdAndEffortId(int userId, int effortId);

    Optional<UserEffort> findByUserIdAndEffortId(int userId, int effortId);
}
