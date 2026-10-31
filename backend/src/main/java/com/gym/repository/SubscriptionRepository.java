package com.gym.repository;

import com.gym.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByMemberId(Long memberId);
    List<Subscription> findByStatus(String status);
    List<Subscription> findByPaymentStatus(String paymentStatus);
    
    // Subscriptions expiring within a date range (e.g. next 7 days)
    @Query("SELECT s FROM Subscription s WHERE s.expiryDate >= :today AND s.expiryDate <= :targetDate AND s.status != 'EXPIRED'")
    List<Subscription> findExpiringSoon(@Param("today") LocalDate today, @Param("targetDate") LocalDate targetDate);

    // Subscriptions that have passed their expiry date but status is still marked ACTIVE
    @Query("SELECT s FROM Subscription s WHERE s.expiryDate < :today AND s.status != 'EXPIRED'")
    List<Subscription> findExpiredNeedingUpdate(@Param("today") LocalDate today);

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Subscription s WHERE s.paymentStatus = 'PAID'")
    Double sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Subscription s WHERE s.paymentStatus = 'PAID' AND s.paymentDate BETWEEN :startDate AND :endDate")
    Double sumRevenueBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
