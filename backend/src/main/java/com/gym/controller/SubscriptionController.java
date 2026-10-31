package com.gym.controller;

import com.gym.dto.SubscriptionDTO;
import com.gym.entity.Subscription;
import com.gym.entity.SubscriptionPlan;
import com.gym.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long memberId) {
        if (memberId != null) {
            return ResponseEntity.ok(subscriptionService.getSubscriptionsByMember(memberId));
        }
        if (status != null && !status.trim().isEmpty()) {
            return ResponseEntity.ok(subscriptionService.getSubscriptionsByStatus(status.toUpperCase()));
        }
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(@Valid @RequestBody SubscriptionPlan plan) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.createPlan(plan));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<List<Subscription>> getExpiringSoon(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsExpiringSoon(days));
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignSubscription(@Valid @RequestBody SubscriptionDTO dto) {
        try {
            Subscription subscription = subscriptionService.assignSubscription(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/renew")
    public ResponseEntity<?> renewSubscription(@PathVariable Long id, @RequestBody SubscriptionDTO dto) {
        try {
            Subscription renewed = subscriptionService.renewSubscription(id, dto);
            return ResponseEntity.ok(renewed);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.ok(Map.of("message", "Subscription deleted successfully"));
    }
}
