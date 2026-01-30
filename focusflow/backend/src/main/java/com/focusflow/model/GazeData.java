package com.focusflow.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * GazeData Entity - Stores eye-tracking coordinates from WebGazer.js
 * Used for ML analysis of reading patterns
 */
@Entity
@Table(name = "gaze_data", indexes = {
    @Index(name = "idx_gaze_data_session_id", columnList = "session_id"),
    @Index(name = "idx_gaze_data_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GazeData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ReadingSession session;

    @Column(nullable = false)
    private Long timestamp; // Milliseconds since epoch

    @Column(name = "x_coordinate", precision = 10, scale = 4)
    private BigDecimal xCoordinate;

    @Column(name = "y_coordinate", precision = 10, scale = 4)
    private BigDecimal yCoordinate;

    @Column(name = "is_regression")
    @Builder.Default
    private Boolean isRegression = false;

    @Column(name = "word_index")
    private Integer wordIndex;

    @Column(name = "line_number")
    private Integer lineNumber;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GazeData gazeData)) return false;
        return id != null && id.equals(gazeData.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
