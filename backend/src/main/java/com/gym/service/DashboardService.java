package com.gym.service;

import com.gym.dto.DashboardStatsDTO;
import com.gym.entity.Equipment;
import com.gym.entity.Member;
import com.gym.entity.Payment;
import com.gym.entity.Subscription;
import com.gym.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private TrainingSessionRepository sessionRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private EquipmentMaintenanceRepository maintenanceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SubscriptionService subscriptionService;

    public DashboardStatsDTO getDashboardStats() {
        // Run expiry checks first so numbers reflect reality
        subscriptionService.checkAndUpdateStatuses();

        DashboardStatsDTO dto = new DashboardStatsDTO();

        long totalMembers = memberRepository.count();
        long activeMembers = memberRepository.countByMembershipStatus("ACTIVE");
        long expiredSubs = subscriptionRepository.countByStatus("EXPIRED");

        LocalDate today = LocalDate.now();
        List<Subscription> expiringSoon = subscriptionRepository.findExpiringSoon(today, today.plusDays(7));
        long expiringSoonCount = expiringSoon.size();

        long totalTrainers = trainerRepository.count();
        long activeSessions = sessionRepository.countBySessionStatus("SCHEDULED");
        long totalEquipment = equipmentRepository.count();
        long needingMaintenance = equipmentRepository.countByCondition("NEEDS_REPAIR") 
                                 + equipmentRepository.countByCondition("UNDER_MAINTENANCE");

        // Monthly revenue (current month)
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        Double currentMonthRevenue = paymentRepository.sumPaymentsBetween(startOfMonth, endOfMonth);
        Double totalRevenue = paymentRepository.sumTotalPayments();
        Double totalEquipmentCost = equipmentRepository.sumTotalEquipmentCost();
        Double totalMaintCost = maintenanceRepository.sumTotalMaintenanceCost();

        dto.setTotalMembers(totalMembers);
        dto.setActiveMembers(activeMembers);
        dto.setExpiredSubscriptions(expiredSubs);
        dto.setExpiringSoonSubscriptions(expiringSoonCount);
        dto.setTotalTrainers(totalTrainers);
        dto.setActiveSessions(activeSessions);
        dto.setTotalEquipment(totalEquipment);
        dto.setEquipmentNeedingMaintenance(needingMaintenance);
        dto.setMonthlyRevenue(currentMonthRevenue != null ? currentMonthRevenue : 0.0);
        dto.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        dto.setTotalEquipmentInvestment(totalEquipmentCost != null ? totalEquipmentCost : 0.0);
        dto.setTotalMaintenanceCost(totalMaintCost != null ? totalMaintCost : 0.0);

        dto.setRecentMembers(memberRepository.findTop10ByOrderByCreatedAtDesc());
        dto.setRecentPayments(paymentRepository.findTop10ByOrderByPaymentDateDesc());
        dto.setExpiringSoonList(expiringSoon);

        // Calculate 6-month monthly revenue trend
        Map<String, Double> monthlyTrend = new LinkedHashMap<>();
        DateTimeFormatter monthYearFmt = DateTimeFormatter.ofPattern("MMM yyyy");
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = today.minusMonths(i);
            LocalDate mStart = monthDate.withDayOfMonth(1);
            LocalDate mEnd = monthDate.withDayOfMonth(monthDate.lengthOfMonth());
            Double rev = paymentRepository.sumPaymentsBetween(mStart, mEnd);
            monthlyTrend.put(mStart.format(monthYearFmt), rev != null ? rev : 0.0);
        }
        dto.setMonthlyRevenueTrend(monthlyTrend);

        // Membership status distribution
        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("Active", activeMembers);
        statusMap.put("Expired", expiredSubs);
        statusMap.put("Pending/Other", Math.max(0, totalMembers - activeMembers - expiredSubs));
        dto.setMemberStatusDistribution(statusMap);

        // Equipment category distribution
        List<Equipment> allEquipment = equipmentRepository.findAll();
        Map<String, Long> catMap = allEquipment.stream()
                .collect(Collectors.groupingBy(Equipment::getCategory, Collectors.counting()));
        dto.setEquipmentCategoryDistribution(catMap);

        return dto;
    }
}
