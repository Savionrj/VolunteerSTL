package com.unit_2_project.volunteer_stl.repositories;

import com.unit_2_project.volunteer_stl.models.Connection;
import com.unit_2_project.volunteer_stl.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConnectionRepository extends JpaRepository<Connection,Integer> {
    List<Connection> findAllByConnectedUser(User connectedUser);
}
