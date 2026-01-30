package com.focusflow.repository;


import com.focusflow.model.ReadingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Repository
public interface ReadingSessionRepository extends JpaRepository<ReadingSession, UUID> {
    List<ReadingSession> findByUserIdOrderByStartTimeDesc(UUID userId);
    
    @Query("SELECT rs FROM ReadingSession rs WHERE rs.user.id = :userId " +
           "AND rs.startTime BETWEEN :startDate AND :endDate")
    List<ReadingSession> findByUserIdAndDateRange(UUID userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT AVG(rs.focusScore) FROM ReadingSession rs WHERE rs.user.id = :userId")
    Double getAverageFocusScoreByUserId(UUID userId);
}
