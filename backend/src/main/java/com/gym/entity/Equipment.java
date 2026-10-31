package com.gym.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "equipment_code", nullable = false, unique = true, length = 50)
    private String equipmentCode;

    @Column(name = "equipment_name", nullable = false, length = 150)
    private String equipmentName;

    @Column(name = "equipment_image", length = 500)
    private String equipmentImage;

    @Column(nullable = false, length = 100)
    private String category; // Cardio, Free Weights, Strength Machines, Cable Machines, Functional

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "purchase_cost", nullable = false)
    private Double purchaseCost;

    @Column(name = "condition_status", length = 50)
    private String condition = "GOOD"; // GOOD, NEEDS_REPAIR, UNDER_MAINTENANCE

    @Column(name = "last_maintenance_date")
    private LocalDate lastMaintenanceDate;

    @Column(name = "next_maintenance_date")
    private LocalDate nextMaintenanceDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Equipment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEquipmentCode() { return equipmentCode; }
    public void setEquipmentCode(String equipmentCode) { this.equipmentCode = equipmentCode; }

    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }

    public String getEquipmentImage() { return equipmentImage; }
    public void setEquipmentImage(String equipmentImage) { this.equipmentImage = equipmentImage; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public Double getPurchaseCost() { return purchaseCost; }
    public void setPurchaseCost(Double purchaseCost) { this.purchaseCost = purchaseCost; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public LocalDate getLastMaintenanceDate() { return lastMaintenanceDate; }
    public void setLastMaintenanceDate(LocalDate lastMaintenanceDate) { this.lastMaintenanceDate = lastMaintenanceDate; }

    public LocalDate getNextMaintenanceDate() { return nextMaintenanceDate; }
    public void setNextMaintenanceDate(LocalDate nextMaintenanceDate) { this.nextMaintenanceDate = nextMaintenanceDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
