package com.gym.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class SubscriptionDTO {
    private Long id;

    @NotNull(message = "Member ID is required")
    private Long memberId;

    @NotNull(message = "Plan ID is required")
    private Long planId;

    private LocalDate startDate;
    private Double amount;
    private String paymentStatus = "PAID";
    private String paymentMethod = "CARD";
    private String notes;

    public SubscriptionDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
