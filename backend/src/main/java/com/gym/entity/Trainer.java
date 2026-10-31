package com.gym.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainers")
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trainer_code", nullable = false, unique = true, length = 50)
    private String trainerCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "profile_photo", length = 500)
    private String profilePhoto;

    @Column(nullable = false, length = 150)
    private String specialization;

    @Column(nullable = false, length = 50)
    private String experience;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "monthly_salary", nullable = false)
    private Double monthlySalary;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Trainer() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTrainerCode() { return trainerCode; }
    public void setTrainerCode(String trainerCode) { this.trainerCode = trainerCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Double getMonthlySalary() { return monthlySalary; }
    public void setMonthlySalary(Double monthlySalary) { this.monthlySalary = monthlySalary; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
