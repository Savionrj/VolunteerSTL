package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.UserEffort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserEffortRepository extends JpaRepository<UserEffort, Integer> {
    int countByUserId(int userId);
    int countByEffortId(int effortId);
    int countByStatus(String status);

    boolean existsByUserIdAndEffortId(int userId, int effortId);

    List<UserEffort> findAllByUserId(int userId);

    Optional<UserEffort> findByUserIdAndEffortId(int userId, int effortId);
}
