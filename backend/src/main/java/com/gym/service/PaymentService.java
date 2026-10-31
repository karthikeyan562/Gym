package com.gym.service;

import com.gym.entity.Member;
import com.gym.entity.Payment;
import com.gym.repository.MemberRepository;
import com.gym.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MemberRepository memberRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByMember(Long memberId) {
        return paymentRepository.findByMemberId(memberId);
    }

    public List<Payment> getRecentPayments() {
        return paymentRepository.findTop10ByOrderByPaymentDateDesc();
    }

    @Transactional
    public Payment recordPayment(Long memberId, Double amount, String method, String remarks) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + memberId));

        Payment payment = new Payment();
        payment.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
        payment.setMember(member);
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentMethod(method != null ? method : "CARD");
        payment.setPaymentStatus("PAID");
        payment.setRemarks(remarks);

        return paymentRepository.save(payment);
    }
}
