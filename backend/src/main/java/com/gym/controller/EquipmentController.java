package com.gym.controller;

import com.gym.entity.Equipment;
import com.gym.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<List<Equipment>> getAllEquipment(@RequestParam(required = false) String condition) {
        if (condition != null && !condition.isBlank()) {
            return ResponseEntity.ok(equipmentService.getEquipmentByCondition(condition.toUpperCase()));
        }
        return ResponseEntity.ok(equipmentService.getAllEquipment());
    }

    @GetMapping("/needing-repair")
    public ResponseEntity<List<Equipment>> getEquipmentNeedingRepair() {
        return ResponseEntity.ok(equipmentService.getEquipmentNeedingRepair());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEquipmentById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createEquipment(@Valid @RequestBody Equipment equipment) {
        try {
            Equipment created = equipmentService.createEquipment(equipment);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEquipment(@PathVariable Long id, @RequestBody Equipment equipment) {
        try {
            Equipment updated = equipmentService.updateEquipment(id, equipment);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok(Map.of("message", "Equipment deleted successfully"));
    }
}
