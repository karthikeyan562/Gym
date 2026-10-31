package com.gym.repository;

import com.gym.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Optional<Trainer> findByTrainerCode(String trainerCode);
    List<Trainer> findByIsActiveTrue();
    boolean existsByTrainerCode(String trainerCode);
}
