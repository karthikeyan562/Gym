package com.gym.controller;

import com.gym.dto.MaintenanceDTO;
import com.gym.entity.EquipmentMaintenance;
import com.gym.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<EquipmentMaintenance>> getAllMaintenance(@RequestParam(required = false) Long equipmentId) {
        if (equipmentId != null) {
            return ResponseEntity.ok(maintenanceService.getMaintenanceByEquipment(equipmentId));
        }
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    @PostMapping
    public ResponseEntity<?> addMaintenanceRecord(@Valid @RequestBody MaintenanceDTO dto) {
        try {
            EquipmentMaintenance created = maintenanceService.addMaintenanceRecord(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.ok(Map.of("message", "Maintenance record deleted successfully"));
    }
}
