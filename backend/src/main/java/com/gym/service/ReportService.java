package com.gym.service;

import com.gym.entity.*;
import com.gym.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TrainingSessionRepository sessionRepository;

    @Autowired
    private EquipmentMaintenanceRepository maintenanceRepository;

    public Map<String, Object> generateComprehensiveReport(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(6);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        Map<String, Object> report = new HashMap<>();
        report.put("startDate", startDate);
        report.put("endDate", endDate);

        // Members
        long totalMembers = memberRepository.count();
        long activeMembers = memberRepository.countByMembershipStatus("ACTIVE");
        long expiredMembers = memberRepository.countByMembershipStatus("EXPIRED");
        report.put("totalMembers", totalMembers);
        report.put("activeMembers", activeMembers);
        report.put("expiredMembers", expiredMembers);

        // Payments in range
        List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startDate, endDate);
        double rangeRevenue = payments.stream().mapToDouble(Payment::getAmount).sum();
        report.put("rangeRevenue", rangeRevenue);
        report.put("paymentsList", payments);

        // Subscriptions
        List<Subscription> allSubs = subscriptionRepository.findAll();
        report.put("totalSubscriptions", allSubs.size());
        report.put("subscriptionList", allSubs);

        // Training sessions in range
        List<TrainingSession> sessions = sessionRepository.findByTrainingDateBetweenOrderByTrainingDateDescStartTimeAsc(startDate, endDate);
        report.put("totalSessionsInRange", sessions.size());
        report.put("sessionsList", sessions);

        // Maintenance in range
        List<EquipmentMaintenance> maintenanceList = maintenanceRepository.findAll();
        double totalMaintenanceCost = maintenanceList.stream().mapToDouble(EquipmentMaintenance::getMaintenanceCost).sum();
        report.put("totalMaintenanceCost", totalMaintenanceCost);
        report.put("maintenanceList", maintenanceList);

        return report;
    }
}
