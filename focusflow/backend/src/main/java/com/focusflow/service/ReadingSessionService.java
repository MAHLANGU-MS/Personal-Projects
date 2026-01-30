package com.focusflow.service;


import com.focusflow.dto.CreateSessionRequest;
import com.focusflow.dto.SessionAnalyticsResponse;
import com.focusflow.model.*;
import com.focusflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ReadingSessionService {
    private final ReadingSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final GazeDataRepository gazeDataRepository;
    private final FocusEventRepository focusEventRepository;


    @Transactional
    public ReadingSession startSession(UUID userId, CreateSessionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        ReadingSession session = ReadingSession.builder()
                .user(user)
                .documentName(request.getDocumentName())
                .startTime(LocalDateTime.now())
                .readingMode(request.getReadingMode())
                .wordsRead(0)
                .regressionCount(0)
                .build();


        return sessionRepository.save(session);
    }


    @Transactional
    public ReadingSession endSession(UUID sessionId, BigDecimal focusScore) {
        ReadingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));


        session.setEndTime(LocalDateTime.now());
        session.calculateDuration();
        session.setFocusScore(focusScore);


        return sessionRepository.save(session);
    }


    @Transactional
    public void saveGazeData(UUID sessionId, List<GazeData> gazeDataList) {
        ReadingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));


        gazeDataList.forEach(gazeData -> {
            gazeData.setSession(session);
            gazeDataRepository.save(gazeData);
        });


        // Update regression count
        Long regressionCount = gazeDataRepository.countRegressionsBySessionId(sessionId);
        session.setRegressionCount(regressionCount.intValue());
        sessionRepository.save(session);
    }


    public SessionAnalyticsResponse getSessionAnalytics(UUID userId) {
        List<ReadingSession> sessions = sessionRepository.findByUserIdOrderByStartTimeDesc(userId);
        Double avgFocusScore = sessionRepository.getAverageFocusScoreByUserId(userId);


        return SessionAnalyticsResponse.builder()
                .totalSessions(sessions.size())
                .averageFocusScore(avgFocusScore != null ? BigDecimal.valueOf(avgFocusScore) : BigDecimal.ZERO)
                .sessions(sessions)
                .build();
    }
}
