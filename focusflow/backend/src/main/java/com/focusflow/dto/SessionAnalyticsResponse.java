package com.focusflow.dto;
import com.focusflow.model.ReadingSession;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionAnalyticsResponse {
    private Integer totalSessions;
    private BigDecimal averageFocusScore;
    private List<ReadingSession> sessions;
}
