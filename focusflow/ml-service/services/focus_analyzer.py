import numpy as np
from sklearn.preprocessing import StandardScaler
import tensorflow as tf


class FocusAnalyzer:
    def __init__(self):
        self.model = self._build_model()
        self.scaler = StandardScaler()
        
    def _build_model(self):
        """
        Simple LSTM model for focus detection
        Input: Sequence of gaze coordinates
        Output: Focus probability
        """
        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(64, return_sequences=True, input_shape=(None, 2)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.LSTM(32),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model
    
    def analyze(self, gaze_data):
        """
        Analyze gaze patterns
        Returns: {is_focused, confidence, regression_count, recommended_mode}
        """
        # Extract features
        regression_count = self._count_regressions(gaze_data)
        fixation_duration = self._calculate_fixation_duration(gaze_data)
        saccade_length = self._calculate_saccade_length(gaze_data)
        
        # Prepare for model
        coords = gaze_data[:, :2]
        coords_normalized = self.scaler.fit_transform(coords)
        coords_reshaped = coords_normalized.reshape(1, -1, 2)
        
        # Predict focus
        focus_prob = float(self.model.predict(coords_reshaped, verbose=0)[0][0])
        
        # Determine recommended mode
        if regression_count > 5:
            recommended_mode = "RSVP"
        elif focus_prob < 0.5:
            recommended_mode = "BIONIC"
        else:
            recommended_mode = "NORMAL"
        
        return {
            'is_focused': focus_prob > 0.5,
            'confidence': focus_prob,
            'regression_count': int(regression_count),
            'recommended_mode': recommended_mode
        }
    
    def _count_regressions(self, gaze_data):
        """Count backward eye movements (regressions)"""
        if len(gaze_data) < 2:
            return 0
        
        y_coords = gaze_data[:, 1]
        regressions = 0
        
        for i in range(1, len(y_coords)):
            if y_coords[i] < y_coords[i-1] - 50:  # Threshold for regression
                regressions += 1
        
        return regressions
    
    def _calculate_fixation_duration(self, gaze_data):
        """Calculate average fixation duration"""
        # Simplified: group nearby points
        return 250  # milliseconds (placeholder)
    
    def _calculate_saccade_length(self, gaze_data):
        """Calculate average saccade length"""
        if len(gaze_data) < 2:
            return 0
        
        coords = gaze_data[:, :2]
        distances = np.sqrt(np.sum(np.diff(coords, axis=0)**2, axis=1))
        return np.mean(distances)
