package com.focusflow.model;

/**
 * FocusEventType Enum - Types of focus state changes detected by ML
 */
public enum FocusEventType {
    /**
     * User has lost focus - detected by regression patterns
     */
    DISTRACTED,
    
    /**
     * User is in focused reading state
     */
    FOCUSED,
    
    /**
     * User re-reading same content (regression)
     */
    REGRESSED,
    
    /**
     * System automatically switched reading mode
     */
    MODE_SWITCHED,
    
    /**
     * User paused reading
     */
    PAUSED,
    
    /**
     * User resumed reading
     */
    RESUMED;

    public String getDisplayName() {
        return switch (this) {
            case DISTRACTED -> "Distracted";
            case FOCUSED -> "Focused";
            case REGRESSED -> "Re-reading";
            case MODE_SWITCHED -> "Mode Changed";
            case PAUSED -> "Paused";
            case RESUMED -> "Resumed";
        };
    }

    public String getRecommendedAction() {
        return switch (this) {
            case DISTRACTED -> "Switch to RSVP mode to reset focus";
            case FOCUSED -> "Maintain current reading mode";
            case REGRESSED -> "Enable Bionic Reading to improve comprehension";
            case MODE_SWITCHED -> "Mode automatically adjusted";
            case PAUSED -> "Session paused by user";
            case RESUMED -> "Session resumed";
        };
    }
}
