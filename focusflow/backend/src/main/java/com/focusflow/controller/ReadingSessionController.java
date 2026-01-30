package com.focusflow.controller;


import com.focusflow.dto.*;
import com.focusflow.model.*;
import com.focusflow.service.ReadingSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class ReadingSessionController {
    private final ReadingSessionService sessionService;


    @PostMapping("/{userId}/start")
    public ResponseEntity<ReadingSession> startSession(
            @PathVariable UUID userId,
            @RequestBody CreateSessionRequest request) {
        return ResponseEntity.ok(sessionService.startSession(userId, request));
    }


    @PutMapping("/{sessionId}/end")
    public ResponseEntity<ReadingSession> endSession(
            @PathVariable UUID sessionId,
            @RequestParam BigDecimal focusScore) {
        return ResponseEntity.ok(sessionService.endSession(sessionId, focusScore));
    }


    @PostMapping("/{sessionId}/gaze-data")
    public ResponseEntity<Void> saveGazeData(
            @PathVariable UUID sessionId,
            @RequestBody List<GazeData> gazeDataList) {
        sessionService.saveGazeData(sessionId, gazeDataList);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/{userId}/analytics")
    public ResponseEntity<SessionAnalyticsResponse> getAnalytics(@PathVariable UUID userId) {
        return ResponseEntity.ok(sessionService.getSessionAnalytics(userId));
    }
}
