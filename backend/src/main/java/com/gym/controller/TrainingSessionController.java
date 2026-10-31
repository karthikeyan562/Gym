package com.gym.controller;

import com.gym.dto.TrainingSessionDTO;
import com.gym.entity.TrainingSession;
import com.gym.service.TrainingSessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class TrainingSessionController {

    @Autowired
    private TrainingSessionService sessionService;

    @GetMapping
    public ResponseEntity<List<TrainingSession>> getAllSessions(
            @RequestParam(required = false) Long trainerId,
            @RequestParam(required = false) Long memberId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (trainerId != null) {
            return ResponseEntity.ok(sessionService.getSessionsByTrainer(trainerId));
        }
        if (memberId != null) {
            return ResponseEntity.ok(sessionService.getSessionsByMember(memberId));
        }
        if (date != null) {
            return ResponseEntity.ok(sessionService.getSessionsByDate(date));
        }
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @PostMapping
    public ResponseEntity<?> scheduleSession(@Valid @RequestBody TrainingSessionDTO dto) {
        try {
            TrainingSession session = sessionService.scheduleSession(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(session);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id, @RequestBody TrainingSessionDTO dto) {
        try {
            TrainingSession updated = sessionService.updateSession(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.ok(Map.of("message", "Training session deleted successfully"));
    }
}
