package com.focusflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * UserPreferences Entity - Stores user-specific reading preferences
 */
@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreferences {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_reading_mode", length = 50)
    @Builder.Default
    private ReadingMode defaultReadingMode = ReadingMode.NORMAL;

    @Min(0)
    @Max(100)
    @Column(name = "bionic_intensity")
    @Builder.Default
    private Integer bionicIntensity = 50;

    @Min(100)
    @Max(1000)
    @Column(name = "rsvp_speed")
    @Builder.Default
    private Integer rsvpSpeed = 250; // Words per minute

    @Column(name = "background_color", length = 7)
    @Builder.Default
    private String backgroundColor = "#FFFFFF";

    @Column(name = "text_color", length = 7)
    @Builder.Default
    private String textColor = "#000000";

    @Min(10)
    @Max(32)
    @Column(name = "font_size")
    @Builder.Default
    private Integer fontSize = 16;

    @Column(name = "font_family", length = 50)
    @Builder.Default
    private String fontFamily = "Arial";

    @Column(name = "focus_mask_enabled")
    @Builder.Default
    private Boolean focusMaskEnabled = false;

    @Column(name = "auto_mode_switch")
    @Builder.Default
    private Boolean autoModeSwitch = true;

    @Column(name = "eye_tracking_enabled")
    @Builder.Default
    private Boolean eyeTrackingEnabled = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserPreferences that)) return false;
        return userId != null && userId.equals(that.userId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
