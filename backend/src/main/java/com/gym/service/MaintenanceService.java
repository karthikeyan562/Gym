package com.gym.service;

import com.gym.dto.MaintenanceDTO;
import com.gym.entity.Equipment;
import com.gym.entity.EquipmentMaintenance;
import com.gym.repository.EquipmentMaintenanceRepository;
import com.gym.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceService {

    @Autowired
    private EquipmentMaintenanceRepository maintenanceRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    public List<EquipmentMaintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public List<EquipmentMaintenance> getMaintenanceByEquipment(Long equipmentId) {
        return maintenanceRepository.findByEquipmentId(equipmentId);
    }

    @Transactional
    public EquipmentMaintenance addMaintenanceRecord(MaintenanceDTO dto) {
        Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
                .orElseThrow(() -> new IllegalArgumentException("Equipment not found with id: " + dto.getEquipmentId()));

        EquipmentMaintenance record = new EquipmentMaintenance();
        record.setEquipment(equipment);
        record.setMaintenanceDate(dto.getMaintenanceDate() != null ? dto.getMaintenanceDate() : LocalDate.now());
        record.setMaintenanceCost(dto.getMaintenanceCost());
        record.setTechnicianName(dto.getTechnicianName().trim());
        record.setDescription(dto.getDescription());
        record.setStatus(dto.getStatus() != null ? dto.getStatus() : "COMPLETED");
        record.setResolutionNotes(dto.getResolutionNotes());

        EquipmentMaintenance saved = maintenanceRepository.save(record);

        // Update equipment status
        equipment.setLastMaintenanceDate(record.getMaintenanceDate());
        if (dto.getNextMaintenanceDate() != null) {
            equipment.setNextMaintenanceDate(dto.getNextMaintenanceDate());
        } else {
            // Default next maintenance in 3 months
            equipment.setNextMaintenanceDate(record.getMaintenanceDate().plusMonths(3));
        }

        if ("COMPLETED".equalsIgnoreCase(record.getStatus())) {
            equipment.setCondition("GOOD");
        } else if ("IN_PROGRESS".equalsIgnoreCase(record.getStatus())) {
            equipment.setCondition("UNDER_MAINTENANCE");
        }

        equipmentRepository.save(equipment);

        return saved;
    }

    @Transactional
    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }
}
