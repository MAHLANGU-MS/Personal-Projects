package com.focusflow.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * ReadingSession Entity - Tracks individual reading sessions
 * Contains focus metrics, eye-tracking data, and ML analysis results
 */
@Entity
@Table(name = "reading_sessions", indexes = {
    @Index(name = "idx_reading_sessions_user_id", columnList = "user_id"),
    @Index(name = "idx_reading_sessions_start_time", columnList = "start_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "document_name")
    private String documentName;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "words_read")
    @Builder.Default
    private Integer wordsRead = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "reading_mode", length = 50)
    private ReadingMode readingMode;

    @Column(name = "focus_score", precision = 5, scale = 2)
    private BigDecimal focusScore;

    @Column(name = "regression_count")
    @Builder.Default
    private Integer regressionCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<GazeData> gazeDataPoints = new HashSet<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<FocusEvent> focusEvents = new HashSet<>();

    // Helper methods
    public void calculateDuration() {
        if (startTime != null && endTime != null) {
            this.durationSeconds = (int) java.time.Duration.between(startTime, endTime).getSeconds();
        }
    }

    public void addGazeData(GazeData gazeData) {
        gazeDataPoints.add(gazeData);
        gazeData.setSession(this);
    }

    public void addFocusEvent(FocusEvent focusEvent) {
        focusEvents.add(focusEvent);
        focusEvent.setSession(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReadingSession that)) return false;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
