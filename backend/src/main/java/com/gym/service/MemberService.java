package com.gym.service;

import com.gym.dto.MemberDTO;
import com.gym.entity.Member;
import com.gym.entity.Payment;
import com.gym.entity.Subscription;
import com.gym.entity.SubscriptionPlan;
import com.gym.repository.MemberRepository;
import com.gym.repository.PaymentRepository;
import com.gym.repository.SubscriptionPlanRepository;
import com.gym.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public List<Member> searchMembers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return memberRepository.findAll();
        }
        return memberRepository.searchMembers(query.trim());
    }

    @Transactional
    public Member createMember(MemberDTO dto) {
        if (dto.getEmail() != null && memberRepository.existsByEmail(dto.getEmail().trim())) {
            throw new IllegalArgumentException("A member with this email already exists: " + dto.getEmail());
        }

        Member member = new Member();
        member.setFullName(dto.getFullName().trim());
        member.setAge(dto.getAge());
        member.setGender(dto.getGender());
        member.setPhoneNumber(dto.getPhoneNumber().trim());
        member.setEmail(dto.getEmail().trim());
        member.setAddress(dto.getAddress());
        member.setJoiningDate(dto.getJoiningDate() != null ? dto.getJoiningDate() : LocalDate.now());
        member.setMembershipStatus(dto.getMembershipStatus() != null ? dto.getMembershipStatus() : "ACTIVE");
        member.setEmergencyContact(dto.getEmergencyContact());
        member.setProfilePhoto(dto.getProfilePhoto() != null && !dto.getProfilePhoto().isBlank() 
                ? dto.getProfilePhoto() 
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80");

        // Generate unique member code
        long count = memberRepository.count() + 1;
        String generatedCode = String.format("GYM-%04d", count);
        while (memberRepository.existsByMemberCode(generatedCode)) {
            count++;
            generatedCode = String.format("GYM-%04d", count);
        }
        member.setMemberCode(generatedCode);

        Member savedMember = memberRepository.save(member);

        // Optionally create initial subscription if plan was provided
        if (dto.getInitialPlanId() != null) {
            Optional<SubscriptionPlan> planOpt = planRepository.findById(dto.getInitialPlanId());
            if (planOpt.isPresent()) {
                SubscriptionPlan plan = planOpt.get();
                Subscription sub = new Subscription();
                sub.setMember(savedMember);
                sub.setPlan(plan);
                sub.setPlanName(plan.getPlanName());
                sub.setStartDate(savedMember.getJoiningDate());
                sub.setExpiryDate(savedMember.getJoiningDate().plusMonths(plan.getDurationMonths()));
                sub.setAmount(plan.getAmount());
                sub.setPaymentStatus("PAID");
                sub.setStatus("ACTIVE");
                sub.setPaymentDate(LocalDate.now());
                sub.setNotes("Initial subscription on enrollment");
                Subscription savedSub = subscriptionRepository.save(sub);

                // Record payment
                Payment payment = new Payment();
                payment.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
                payment.setMember(savedMember);
                payment.setSubscription(savedSub);
                payment.setAmount(plan.getAmount());
                payment.setPaymentDate(LocalDate.now());
                payment.setPaymentMethod(dto.getInitialPaymentMethod() != null ? dto.getInitialPaymentMethod() : "CARD");
                payment.setPaymentStatus("PAID");
                payment.setRemarks("Initial enrollment payment for " + plan.getPlanName());
                paymentRepository.save(payment);
            }
        }

        return savedMember;
    }

    @Transactional
    public Member updateMember(Long id, MemberDTO dto) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + id));

        if (dto.getEmail() != null && !dto.getEmail().equalsIgnoreCase(member.getEmail())) {
            if (memberRepository.existsByEmail(dto.getEmail().trim())) {
                throw new IllegalArgumentException("Another member already has this email: " + dto.getEmail());
            }
            member.setEmail(dto.getEmail().trim());
        }

        if (dto.getFullName() != null) member.setFullName(dto.getFullName().trim());
        if (dto.getAge() != null) member.setAge(dto.getAge());
        if (dto.getGender() != null) member.setGender(dto.getGender());
        if (dto.getPhoneNumber() != null) member.setPhoneNumber(dto.getPhoneNumber().trim());
        if (dto.getAddress() != null) member.setAddress(dto.getAddress());
        if (dto.getJoiningDate() != null) member.setJoiningDate(dto.getJoiningDate());
        if (dto.getMembershipStatus() != null) member.setMembershipStatus(dto.getMembershipStatus());
        if (dto.getEmergencyContact() != null) member.setEmergencyContact(dto.getEmergencyContact());
        if (dto.getProfilePhoto() != null && !dto.getProfilePhoto().isBlank()) {
            member.setProfilePhoto(dto.getProfilePhoto());
        }

        return memberRepository.save(member);
    }

    @Transactional
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new IllegalArgumentException("Member not found with id: " + id);
        }
        memberRepository.deleteById(id);
    }
}
