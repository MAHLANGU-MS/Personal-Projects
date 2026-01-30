package com.focusflow.repository;


import com.focusflow.model.FocusEvent;
import com.focusflow.model.FocusEventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;


@Repository
public interface FocusEventRepository extends JpaRepository<FocusEvent, Long> {
    List<FocusEvent> findBySessionIdOrderByTimestampDesc(UUID sessionId);
    List<FocusEvent> findBySessionIdAndEventType(UUID sessionId, FocusEventType eventType);
}
