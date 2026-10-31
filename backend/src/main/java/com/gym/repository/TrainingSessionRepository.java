package com.gym.repository;

import com.gym.entity.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {

    List<TrainingSession> findByTrainerId(Long trainerId);
    List<TrainingSession> findByMemberId(Long memberId);
    List<TrainingSession> findByTrainingDate(LocalDate date);
    long countBySessionStatus(String sessionStatus);

    @Query("SELECT s FROM TrainingSession s WHERE s.trainer.id = :trainerId " +
           "AND s.trainingDate = :date " +
           "AND s.sessionStatus != 'CANCELLED' " +
           "AND (s.startTime < :endTime AND s.endTime > :startTime) " +
           "AND (:sessionId IS NULL OR s.id != :sessionId)")
    List<TrainingSession> findConflictingSessions(@Param("trainerId") Long trainerId,
                                                @Param("date") LocalDate date,
                                                @Param("startTime") LocalTime startTime,
                                                @Param("endTime") LocalTime endTime,
                                                @Param("sessionId") Long sessionId);

    List<TrainingSession> findByTrainingDateBetweenOrderByTrainingDateDescStartTimeAsc(LocalDate start, LocalDate end);
}
