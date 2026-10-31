package com.gym.service;

import com.gym.dto.TrainingSessionDTO;
import com.gym.entity.Member;
import com.gym.entity.Trainer;
import com.gym.entity.TrainingSession;
import com.gym.repository.MemberRepository;
import com.gym.repository.TrainerRepository;
import com.gym.repository.TrainingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TrainingSessionService {

    @Autowired
    private TrainingSessionRepository sessionRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    public List<TrainingSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    public List<TrainingSession> getSessionsByTrainer(Long trainerId) {
        return sessionRepository.findByTrainerId(trainerId);
    }

    public List<TrainingSession> getSessionsByMember(Long memberId) {
        return sessionRepository.findByMemberId(memberId);
    }

    public List<TrainingSession> getSessionsByDate(LocalDate date) {
        return sessionRepository.findByTrainingDate(date);
    }

    @Transactional
    public TrainingSession scheduleSession(TrainingSessionDTO dto) {
        if (dto.getStartTime().isAfter(dto.getEndTime()) || dto.getStartTime().equals(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + dto.getMemberId()));

        Trainer trainer = trainerRepository.findById(dto.getTrainerId())
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found with id: " + dto.getTrainerId()));

        // Conflict check
        List<TrainingSession> conflicts = sessionRepository.findConflictingSessions(
                trainer.getId(),
                dto.getTrainingDate(),
                dto.getStartTime(),
                dto.getEndTime(),
                null
        );

        if (!conflicts.isEmpty()) {
            TrainingSession conflict = conflicts.get(0);
            throw new IllegalStateException(String.format(
                    "Conflict: Trainer %s already has an active session from %s to %s on %s",
                    trainer.getName(), conflict.getStartTime(), conflict.getEndTime(), conflict.getTrainingDate()
            ));
        }

        TrainingSession session = new TrainingSession();
        session.setMember(member);
        session.setTrainer(trainer);
        session.setTrainingDate(dto.getTrainingDate());
        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setSessionStatus(dto.getSessionStatus() != null ? dto.getSessionStatus() : "SCHEDULED");
        session.setNotes(dto.getNotes());

        return sessionRepository.save(session);
    }

    @Transactional
    public TrainingSession updateSession(Long id, TrainingSessionDTO dto) {
        TrainingSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + id));

        if (dto.getStartTime() != null && dto.getEndTime() != null) {
            if (dto.getStartTime().isAfter(dto.getEndTime()) || dto.getStartTime().equals(dto.getEndTime())) {
                throw new IllegalArgumentException("Start time must be before end time");
            }
        }

        if (dto.getTrainerId() != null) {
            Trainer trainer = trainerRepository.findById(dto.getTrainerId())
                    .orElseThrow(() -> new IllegalArgumentException("Trainer not found with id: " + dto.getTrainerId()));
            session.setTrainer(trainer);
        }

        if (dto.getMemberId() != null) {
            Member member = memberRepository.findById(dto.getMemberId())
                    .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + dto.getMemberId()));
            session.setMember(member);
        }

        if (dto.getTrainingDate() != null) session.setTrainingDate(dto.getTrainingDate());
        if (dto.getStartTime() != null) session.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) session.setEndTime(dto.getEndTime());
        if (dto.getSessionStatus() != null) session.setSessionStatus(dto.getSessionStatus());
        if (dto.getNotes() != null) session.setNotes(dto.getNotes());

        // Check conflicts excluding this session
        List<TrainingSession> conflicts = sessionRepository.findConflictingSessions(
                session.getTrainer().getId(),
                session.getTrainingDate(),
                session.getStartTime(),
                session.getEndTime(),
                session.getId()
        );

        if (!conflicts.isEmpty()) {
            TrainingSession conflict = conflicts.get(0);
            throw new IllegalStateException(String.format(
                    "Conflict: Trainer %s already has an active session from %s to %s on %s",
                    session.getTrainer().getName(), conflict.getStartTime(), conflict.getEndTime(), conflict.getTrainingDate()
            ));
        }

        return sessionRepository.save(session);
    }

    @Transactional
    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }
}
