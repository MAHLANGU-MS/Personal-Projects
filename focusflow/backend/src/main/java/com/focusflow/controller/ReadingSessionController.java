package com.focusflow.controller;


import com.focusflow.dto.*;
import com.focusflow.model.*;
import com.focusflow.service.ReadingSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class ReadingSessionController {
    private final ReadingSessionService sessionService;


    @PostMapping("/start")
    public ResponseEntity<ReadingSession> startSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateSessionRequest request) {
        // Get user ID from userDetails (implement getUserId method)
        UUID userId = UUID.randomUUID(); // Replace with actual user ID extraction
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


    @GetMapping("/analytics")
    public ResponseEntity<SessionAnalyticsResponse> getAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.randomUUID(); // Replace with actual user ID extraction
        return ResponseEntity.ok(sessionService.getSessionAnalytics(userId));
    }
}
