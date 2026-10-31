package com.gym.controller;

import com.gym.entity.Payment;
import com.gym.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments(@RequestParam(required = false) Long memberId) {
        if (memberId != null) {
            return ResponseEntity.ok(paymentService.getPaymentsByMember(memberId));
        }
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Payment>> getRecentPayments() {
        return ResponseEntity.ok(paymentService.getRecentPayments());
    }

    @PostMapping
    public ResponseEntity<?> recordPayment(@RequestBody Map<String, Object> body) {
        try {
            Long memberId = Long.valueOf(body.get("memberId").toString());
            Double amount = Double.valueOf(body.get("amount").toString());
            String method = body.getOrDefault("paymentMethod", "CARD").toString();
            String remarks = body.getOrDefault("remarks", "").toString();

            Payment payment = paymentService.recordPayment(memberId, amount, method, remarks);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
