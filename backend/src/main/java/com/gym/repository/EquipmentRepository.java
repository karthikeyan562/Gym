package com.gym.repository;

import com.gym.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findByEquipmentCode(String equipmentCode);
    List<Equipment> findByCondition(String condition);
    List<Equipment> findByCategory(String category);
    long countByCondition(String condition);

    @Query("SELECT COALESCE(SUM(e.purchaseCost * e.quantity), 0) FROM Equipment e")
    Double sumTotalEquipmentCost();
}
