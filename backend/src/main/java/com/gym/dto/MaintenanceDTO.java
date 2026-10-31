package com.gym.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MaintenanceDTO {
    private Long id;

    @NotNull(message = "Equipment ID is required")
    private Long equipmentId;

    @NotNull(message = "Maintenance date is required")
    private LocalDate maintenanceDate;

    @NotNull(message = "Maintenance cost is required")
    private Double maintenanceCost;

    @NotBlank(message = "Technician name is required")
    private String technicianName;

    @NotBlank(message = "Description is required")
    private String description;

    private String status = "COMPLETED";
    private String resolutionNotes;
    private LocalDate nextMaintenanceDate;

    public MaintenanceDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEquipmentId() { return equipmentId; }
    public void setEquipmentId(Long equipmentId) { this.equipmentId = equipmentId; }

    public LocalDate getMaintenanceDate() { return maintenanceDate; }
    public void setMaintenanceDate(LocalDate maintenanceDate) { this.maintenanceDate = maintenanceDate; }

    public Double getMaintenanceCost() { return maintenanceCost; }
    public void setMaintenanceCost(Double maintenanceCost) { this.maintenanceCost = maintenanceCost; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public LocalDate getNextMaintenanceDate() { return nextMaintenanceDate; }
    public void setNextMaintenanceDate(LocalDate nextMaintenanceDate) { this.nextMaintenanceDate = nextMaintenanceDate; }
}
