package com.gym.service;

import com.gym.entity.Trainer;
import com.gym.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    public Optional<Trainer> getTrainerById(Long id) {
        return trainerRepository.findById(id);
    }

    @Transactional
    public Trainer createTrainer(Trainer trainer) {
        if (trainer.getTrainerCode() == null || trainer.getTrainerCode().isBlank()) {
            long count = trainerRepository.count() + 1;
            trainer.setTrainerCode(String.format("TRN-%03d", count));
        }

        if (trainer.getProfilePhoto() == null || trainer.getProfilePhoto().isBlank()) {
            trainer.setProfilePhoto("https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80");
        }

        return trainerRepository.save(trainer);
    }

    @Transactional
    public Trainer updateTrainer(Long id, Trainer updated) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found with id: " + id));

        if (updated.getName() != null) trainer.setName(updated.getName().trim());
        if (updated.getSpecialization() != null) trainer.setSpecialization(updated.getSpecialization());
        if (updated.getExperience() != null) trainer.setExperience(updated.getExperience());
        if (updated.getContactNumber() != null) trainer.setContactNumber(updated.getContactNumber());
        if (updated.getEmail() != null) trainer.setEmail(updated.getEmail());
        if (updated.getMonthlySalary() != null) trainer.setMonthlySalary(updated.getMonthlySalary());
        if (updated.getBio() != null) trainer.setBio(updated.getBio());
        if (updated.getIsActive() != null) trainer.setIsActive(updated.getIsActive());
        if (updated.getProfilePhoto() != null && !updated.getProfilePhoto().isBlank()) {
            trainer.setProfilePhoto(updated.getProfilePhoto());
        }

        return trainerRepository.save(trainer);
    }

    @Transactional
    public void deleteTrainer(Long id) {
        trainerRepository.deleteById(id);
    }
}
