package com.gym.service;

import com.gym.dto.SubscriptionDTO;
import com.gym.entity.Member;
import com.gym.entity.Payment;
import com.gym.entity.Subscription;
import com.gym.entity.SubscriptionPlan;
import com.gym.repository.MemberRepository;
import com.gym.repository.PaymentRepository;
import com.gym.repository.SubscriptionPlanRepository;
import com.gym.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public List<SubscriptionPlan> getAllPlans() {
        return planRepository.findAll();
    }

    public SubscriptionPlan createPlan(SubscriptionPlan plan) {
        if (planRepository.existsByPlanName(plan.getPlanName())) {
            throw new IllegalArgumentException("Plan already exists: " + plan.getPlanName());
        }
        return planRepository.save(plan);
    }

    public List<Subscription> getAllSubscriptions() {
        checkAndUpdateStatuses();
        return subscriptionRepository.findAll();
    }

    public List<Subscription> getSubscriptionsByMember(Long memberId) {
        checkAndUpdateStatuses();
        return subscriptionRepository.findByMemberId(memberId);
    }

    public List<Subscription> getSubscriptionsByStatus(String status) {
        checkAndUpdateStatuses();
        return subscriptionRepository.findByStatus(status);
    }

    public List<Subscription> getSubscriptionsExpiringSoon(int days) {
        checkAndUpdateStatuses();
        LocalDate today = LocalDate.now();
        LocalDate target = today.plusDays(days);
        return subscriptionRepository.findExpiringSoon(today, target);
    }

    @Transactional
    public Subscription assignSubscription(SubscriptionDTO dto) {
        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + dto.getMemberId()));

        SubscriptionPlan plan = planRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new IllegalArgumentException("Plan not found with id: " + dto.getPlanId()));

        LocalDate startDate = dto.getStartDate() != null ? dto.getStartDate() : LocalDate.now();
        LocalDate expiryDate = startDate.plusMonths(plan.getDurationMonths());
        Double amount = dto.getAmount() != null ? dto.getAmount() : plan.getAmount();

        Subscription subscription = new Subscription();
        subscription.setMember(member);
        subscription.setPlan(plan);
        subscription.setPlanName(plan.getPlanName());
        subscription.setStartDate(startDate);
        subscription.setExpiryDate(expiryDate);
        subscription.setAmount(amount);
        subscription.setPaymentStatus(dto.getPaymentStatus() != null ? dto.getPaymentStatus() : "PAID");
        subscription.setPaymentDate(LocalDate.now());
        subscription.setStatus(expiryDate.isBefore(LocalDate.now()) ? "EXPIRED" : "ACTIVE");
        subscription.setNotes(dto.getNotes());

        Subscription saved = subscriptionRepository.save(subscription);

        // Update member's status to ACTIVE if subscription is active
        if ("ACTIVE".equals(saved.getStatus())) {
            member.setMembershipStatus("ACTIVE");
            memberRepository.save(member);
        }

        // Record payment record
        if ("PAID".equalsIgnoreCase(dto.getPaymentStatus())) {
            Payment payment = new Payment();
            payment.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
            payment.setMember(member);
            payment.setSubscription(saved);
            payment.setAmount(amount);
            payment.setPaymentDate(LocalDate.now());
            payment.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "CARD");
            payment.setPaymentStatus("PAID");
            payment.setRemarks("Payment for " + plan.getPlanName());
            paymentRepository.save(payment);
        }

        return saved;
    }

    @Transactional
    public Subscription renewSubscription(Long subscriptionId, SubscriptionDTO dto) {
        Subscription existing = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Subscription not found with id: " + subscriptionId));

        SubscriptionPlan plan = dto.getPlanId() != null 
                ? planRepository.findById(dto.getPlanId()).orElse(existing.getPlan())
                : existing.getPlan();

        LocalDate today = LocalDate.now();
        // If current subscription is still active and expires in future, renewal starts from expiry date; else from today
        LocalDate newStartDate = existing.getExpiryDate().isAfter(today) ? existing.getExpiryDate() : today;
        LocalDate newExpiryDate = newStartDate.plusMonths(plan.getDurationMonths());
        Double amount = dto.getAmount() != null ? dto.getAmount() : plan.getAmount();

        existing.setPlan(plan);
        existing.setPlanName(plan.getPlanName());
        existing.setStartDate(newStartDate);
        existing.setExpiryDate(newExpiryDate);
        existing.setAmount(amount);
        existing.setPaymentStatus("PAID");
        existing.setStatus("ACTIVE");
        existing.setPaymentDate(today);
        if (dto.getNotes() != null) {
            existing.setNotes(dto.getNotes());
        }

        Subscription updated = subscriptionRepository.save(existing);

        // Ensure member is marked ACTIVE
        Member member = existing.getMember();
        member.setMembershipStatus("ACTIVE");
        memberRepository.save(member);

        // Record renewal payment
        Payment payment = new Payment();
        payment.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
        payment.setMember(member);
        payment.setSubscription(updated);
        payment.setAmount(amount);
        payment.setPaymentDate(today);
        payment.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "CARD");
        payment.setPaymentStatus("PAID");
        payment.setRemarks("Subscription renewal for " + plan.getPlanName());
        paymentRepository.save(payment);

        return updated;
    }

    @Transactional
    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
    }

    // Automatically update subscription status based on current date
    @Transactional
    public void checkAndUpdateStatuses() {
        LocalDate today = LocalDate.now();
        List<Subscription> expired = subscriptionRepository.findExpiredNeedingUpdate(today);
        for (Subscription sub : expired) {
            sub.setStatus("EXPIRED");
            subscriptionRepository.save(sub);
        }
    }
}
