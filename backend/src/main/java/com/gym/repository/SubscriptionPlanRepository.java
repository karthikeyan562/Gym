package com.gym.repository;

import com.gym.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    List<SubscriptionPlan> findByIsActiveTrue();
    Optional<SubscriptionPlan> findByPlanName(String planName);
    boolean existsByPlanName(String planName);
}
