package com.focusflow.repository;


import com.focusflow.model.GazeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;


@Repository
public interface GazeDataRepository extends JpaRepository<GazeData, Long> {
    List<GazeData> findBySessionId(UUID sessionId);
    
    @Query("SELECT COUNT(g) FROM GazeData g WHERE g.session.id = :sessionId AND g.isRegression = true")
    Long countRegressionsBySessionId(UUID sessionId);
}
