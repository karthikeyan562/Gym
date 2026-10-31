package com.gym.dto;

import com.gym.entity.Member;
import com.gym.entity.Payment;
import com.gym.entity.Subscription;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long totalMembers;
    private long activeMembers;
    private long expiredSubscriptions;
    private long expiringSoonSubscriptions;
    private long totalTrainers;
    private long activeSessions;
    private long totalEquipment;
    private long equipmentNeedingMaintenance;
    private double monthlyRevenue;
    private double totalRevenue;
    private double totalEquipmentInvestment;
    private double totalMaintenanceCost;

    private List<Member> recentMembers;
    private List<Payment> recentPayments;
    private List<Subscription> expiringSoonList;
    private Map<String, Double> monthlyRevenueTrend;
    private Map<String, Long> memberStatusDistribution;
    private Map<String, Long> equipmentCategoryDistribution;

    public DashboardStatsDTO() {}

    public long getTotalMembers() { return totalMembers; }
    public void setTotalMembers(long totalMembers) { this.totalMembers = totalMembers; }

    public long getActiveMembers() { return activeMembers; }
    public void setActiveMembers(long activeMembers) { this.activeMembers = activeMembers; }

    public long getExpiredSubscriptions() { return expiredSubscriptions; }
    public void setExpiredSubscriptions(long expiredSubscriptions) { this.expiredSubscriptions = expiredSubscriptions; }

    public long getExpiringSoonSubscriptions() { return expiringSoonSubscriptions; }
    public void setExpiringSoonSubscriptions(long expiringSoonSubscriptions) { this.expiringSoonSubscriptions = expiringSoonSubscriptions; }

    public long getTotalTrainers() { return totalTrainers; }
    public void setTotalTrainers(long totalTrainers) { this.totalTrainers = totalTrainers; }

    public long getActiveSessions() { return activeSessions; }
    public void setActiveSessions(long activeSessions) { this.activeSessions = activeSessions; }

    public long getTotalEquipment() { return totalEquipment; }
    public void setTotalEquipment(long totalEquipment) { this.totalEquipment = totalEquipment; }

    public long getEquipmentNeedingMaintenance() { return equipmentNeedingMaintenance; }
    public void setEquipmentNeedingMaintenance(long equipmentNeedingMaintenance) { this.equipmentNeedingMaintenance = equipmentNeedingMaintenance; }

    public double getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(double monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getTotalEquipmentInvestment() { return totalEquipmentInvestment; }
    public void setTotalEquipmentInvestment(double totalEquipmentInvestment) { this.totalEquipmentInvestment = totalEquipmentInvestment; }

    public double getTotalMaintenanceCost() { return totalMaintenanceCost; }
    public void setTotalMaintenanceCost(double totalMaintenanceCost) { this.totalMaintenanceCost = totalMaintenanceCost; }

    public List<Member> getRecentMembers() { return recentMembers; }
    public void setRecentMembers(List<Member> recentMembers) { this.recentMembers = recentMembers; }

    public List<Payment> getRecentPayments() { return recentPayments; }
    public void setRecentPayments(List<Payment> recentPayments) { this.recentPayments = recentPayments; }

    public List<Subscription> getExpiringSoonList() { return expiringSoonList; }
    public void setExpiringSoonList(List<Subscription> expiringSoonList) { this.expiringSoonList = expiringSoonList; }

    public Map<String, Double> getMonthlyRevenueTrend() { return monthlyRevenueTrend; }
    public void setMonthlyRevenueTrend(Map<String, Double> monthlyRevenueTrend) { this.monthlyRevenueTrend = monthlyRevenueTrend; }

    public Map<String, Long> getMemberStatusDistribution() { return memberStatusDistribution; }
    public void setMemberStatusDistribution(Map<String, Long> memberStatusDistribution) { this.memberStatusDistribution = memberStatusDistribution; }

    public Map<String, Long> getEquipmentCategoryDistribution() { return equipmentCategoryDistribution; }
    public void setEquipmentCategoryDistribution(Map<String, Long> equipmentCategoryDistribution) { this.equipmentCategoryDistribution = equipmentCategoryDistribution; }
}
