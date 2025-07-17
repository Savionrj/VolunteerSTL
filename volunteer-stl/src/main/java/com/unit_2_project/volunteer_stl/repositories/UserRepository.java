package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Integer>{
    boolean existsByUsername(String username);
}
