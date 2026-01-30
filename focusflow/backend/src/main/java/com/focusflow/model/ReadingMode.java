package com.focusflow.model;

/**
 * ReadingMode Enum - Different reading assistance modes
 * Based on ADHD reading research
 */
public enum ReadingMode {
    /**
     * Normal reading mode - no assistance
     */
    NORMAL,
    
    /**
     * Bionic Reading - Enhanced fixation points
     * Research: Helps ADHD readers process text faster
     */
    BIONIC,
    
    /**
     * Rapid Serial Visual Presentation
     * Research: Reduces saccadic eye movements
     */
    RSVP,
    
    /**
     * Focus Mask - Highlights current reading area
     * Research: Reduces visual clutter for ADHD readers
     */
    FOCUS_MASK,
    
    /**
     * Combination of Bionic + Focus Mask
     */
    HYBRID;

    public String getDisplayName() {
        return switch (this) {
            case NORMAL -> "Normal Reading";
            case BIONIC -> "Bionic Reading";
            case RSVP -> "RSVP Mode";
            case FOCUS_MASK -> "Focus Mask";
            case HYBRID -> "Hybrid Mode";
        };
    }

    public String getDescription() {
        return switch (this) {
            case NORMAL -> "Standard reading experience without assistance";
            case BIONIC -> "Enhanced word fixation points for faster processing";
            case RSVP -> "One word at a time to reduce eye movement";
            case FOCUS_MASK -> "Highlights current paragraph, dims surrounding text";
            case HYBRID -> "Combines Bionic Reading with Focus Mask";
        };
    }
}
