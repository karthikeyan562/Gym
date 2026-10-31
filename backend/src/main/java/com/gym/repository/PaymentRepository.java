package com.gym.repository;

import com.gym.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByMemberId(Long memberId);
    List<Payment> findTop10ByOrderByPaymentDateDesc();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PAID'")
    Double sumTotalPayments();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PAID' AND p.paymentDate BETWEEN :startDate AND :endDate")
    Double sumPaymentsBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Payment> findByPaymentDateBetweenOrderByPaymentDateDesc(LocalDate startDate, LocalDate endDate);
}
