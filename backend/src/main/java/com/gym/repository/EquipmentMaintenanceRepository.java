package com.gym.repository;

import com.gym.entity.EquipmentMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentMaintenanceRepository extends JpaRepository<EquipmentMaintenance, Long> {

    List<EquipmentMaintenance> findByEquipmentId(Long equipmentId);
    List<EquipmentMaintenance> findByStatus(String status);

    @Query("SELECT COALESCE(SUM(m.maintenanceCost), 0) FROM EquipmentMaintenance m")
    Double sumTotalMaintenanceCost();

    List<EquipmentMaintenance> findTop10ByOrderByMaintenanceDateDesc();
}
