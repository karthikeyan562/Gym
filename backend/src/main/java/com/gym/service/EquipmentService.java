package com.gym.service;

import com.gym.entity.Equipment;
import com.gym.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }

    public List<Equipment> getEquipmentByCondition(String condition) {
        return equipmentRepository.findByCondition(condition);
    }

    public List<Equipment> getEquipmentNeedingRepair() {
        List<Equipment> list = equipmentRepository.findByCondition("NEEDS_REPAIR");
        list.addAll(equipmentRepository.findByCondition("UNDER_MAINTENANCE"));
        return list;
    }

    @Transactional
    public Equipment createEquipment(Equipment equipment) {
        if (equipment.getEquipmentCode() == null || equipment.getEquipmentCode().isBlank()) {
            long count = equipmentRepository.count() + 1;
            equipment.setEquipmentCode(String.format("EQ-%03d", count));
        }

        if (equipment.getPurchaseDate() == null) {
            equipment.setPurchaseDate(LocalDate.now());
        }

        if (equipment.getEquipmentImage() == null || equipment.getEquipmentImage().isBlank()) {
            equipment.setEquipmentImage(getDefaultImageForCategory(equipment.getCategory(), equipment.getEquipmentName()));
        }

        return equipmentRepository.save(equipment);
    }

    @Transactional
    public Equipment updateEquipment(Long id, Equipment updated) {
        Equipment existing = equipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Equipment not found with id: " + id));

        if (updated.getEquipmentName() != null) existing.setEquipmentName(updated.getEquipmentName());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getQuantity() != null) existing.setQuantity(updated.getQuantity());
        if (updated.getPurchaseDate() != null) existing.setPurchaseDate(updated.getPurchaseDate());
        if (updated.getPurchaseCost() != null) existing.setPurchaseCost(updated.getPurchaseCost());
        if (updated.getCondition() != null) existing.setCondition(updated.getCondition());
        if (updated.getLastMaintenanceDate() != null) existing.setLastMaintenanceDate(updated.getLastMaintenanceDate());
        if (updated.getNextMaintenanceDate() != null) existing.setNextMaintenanceDate(updated.getNextMaintenanceDate());
        if (updated.getEquipmentImage() != null && !updated.getEquipmentImage().isBlank()) {
            existing.setEquipmentImage(updated.getEquipmentImage());
        }

        return equipmentRepository.save(existing);
    }

    @Transactional
    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    private String getDefaultImageForCategory(String category, String name) {
        String lower = (name + " " + (category != null ? category : "")).toLowerCase();
        if (lower.contains("treadmill")) {
            return "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&auto=format&fit=crop&q=80";
        } else if (lower.contains("dumbbell")) {
            return "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80";
        } else if (lower.contains("barbell")) {
            return "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80";
        } else if (lower.contains("bench")) {
            return "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80";
        } else if (lower.contains("bike")) {
            return "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&auto=format&fit=crop&q=80";
        } else if (lower.contains("cable") || lower.contains("press")) {
            return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80";
        }
        return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80";
    }
}
