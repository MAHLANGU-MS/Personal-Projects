import type { ChangeEvent } from 'react';
import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';

// Constants
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];

// Types
interface PredictionResponse {
  genre: string;
  confidence?: number;
}

interface FeedbackRequest {
  predicted: string;
  is_correct: boolean;
  actual: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

type FeedbackStatus = 'pending' | 'success' | 'error';

const App: React.FC = () => {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('pending');
  const [error, setError] = useState<string>('');
  const [actualGenre, setActualGenre] = useState<string>('');

  // Validate file
  const validateFile = (selectedFile: File): string | null => {
    if (!ACCEPTED_AUDIO_TYPES.includes(selectedFile.type)) {
      return 'Please select a valid audio file (MP3, WAV, or OGG)';
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  // Handle file selection with validation
  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const validationError = validateFile(selectedFile);
      
      if (validationError) {
        setError(validationError);
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setPrediction('');
      setConfidence(null);
      setFeedbackStatus('pending');
      setActualGenre('');
    }
  }, []);

  // Upload and predict with better error handling
  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setError('Please select an audio file first!');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post<PredictionResponse>(
        `${API_BASE_URL}/predict`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );
      
      setPrediction(res.data.genre);
      setConfidence(res.data.confidence ?? null);
      setFeedbackStatus('pending');
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      
      if (axiosError.response) {
        // Server responded with error
        setError(axiosError.response.data.error || 'Failed to predict genre');
      } else if (axiosError.request) {
        // Request made but no response
        setError('Cannot connect to server. Please ensure the Flask server is running.');
      } else {
        // Something else happened
        setError('An unexpected error occurred');
      }
      
      console.error('Prediction error:', axiosError);
    } finally {
      setLoading(false);
    }
  };

  // Submit feedback with improved UX
  const sendFeedback = async (isCorrect: boolean): Promise<void> => {
    if (!isCorrect && !actualGenre.trim()) {
      setError('Please specify the actual genre');
      return;
    }

    const feedbackData: FeedbackRequest = {
      predicted: prediction,
      is_correct: isCorrect,
      actual: isCorrect ? prediction : actualGenre.trim(),
    };

    try {
      await axios.post(`${API_BASE_URL}/feedback`, feedbackData, {
        timeout: 10000,
      });
      setFeedbackStatus('success');
      setError('');
    } catch (err) {
      setFeedbackStatus('error');
      setError('Failed to submit feedback. Please try again.');
      console.error('Feedback error:', err);
    }
  };

  // Reset application state
  const handleReset = useCallback(() => {
    setFile(null);
    setPrediction('');
    setConfidence(null);
    setFeedbackStatus('pending');
    setError('');
    setActualGenre('');
    setLoading(false);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎵 Music Genre Classifier</h1>
        <p style={styles.subtitle}>Upload a 30-second audio clip to identify its genre using AI</p>
      </header>

      <main style={styles.card}>
        {/* File Upload Section */}
        <div style={styles.uploadSection}>
          <label htmlFor="audio-upload" style={styles.label}>
            Choose Audio File
          </label>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={styles.input}
            disabled={loading}
            aria-label="Audio file upload"
          />
          {file && (
            <p style={styles.fileName}>
              📁 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div style={styles.errorBox} role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={!file || loading ? styles.buttonDisabled : styles.button}
            aria-busy={loading}
          >
            {loading ? '⏳ Analyzing...' : '🎯 Identify Genre'}
          </button>
          
          {(file || prediction) && (
            <button
              onClick={handleReset}
              style={styles.resetButton}
              disabled={loading}
            >
              🔄 Reset
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={styles.loadingIndicator}>
            <div style={styles.spinner}></div>
            <p>Processing your audio file...</p>
          </div>
        )}

        {/* Results Section */}
        {prediction && !loading && (
          <div style={styles.resultArea}>
            <h2 style={styles.predictionTitle}>
              Predicted Genre: <span style={styles.genreText}>{prediction}</span>
            </h2>
            
            {confidence !== null && (
              <p style={styles.confidence}>
                Confidence: {(confidence * 100).toFixed(1)}%
              </p>
            )}

            {/* Feedback Section */}
            {feedbackStatus === 'pending' && (
              <div style={styles.feedbackBox}>
                <p style={styles.feedbackQuestion}>Was this prediction correct?</p>
                
                <div style={styles.feedbackButtons}>
                  <button
                    onClick={() => sendFeedback(true)}
                    style={styles.yesBtn}
                    aria-label="Prediction is correct"
                  >
                    ✅ Yes, Correct
                  </button>
                  <button
                    onClick={() => setFeedbackStatus('error')}
                    style={styles.noBtn}
                    aria-label="Prediction is incorrect"
                  >
                    ❌ No, Incorrect
                  </button>
                </div>
              </div>
            )}

            {/* Incorrect Feedback Form */}
            {feedbackStatus === 'error' && (
              <div style={styles.feedbackBox}>
                <label htmlFor="actual-genre" style={styles.label}>
                  What is the actual genre?
                </label>
                <input
                  id="actual-genre"
                  type="text"
                  value={actualGenre}
                  onChange={(e) => setActualGenre(e.target.value)}
                  placeholder="e.g., Rock, Jazz, Classical..."
                  style={styles.textInput}
                />
                <button
                  onClick={() => sendFeedback(false)}
                  style={styles.submitBtn}
                  disabled={!actualGenre.trim()}
                >
                  Submit Correction
                </button>
              </div>
            )}

            {/* Success Message */}
            {feedbackStatus === 'success' && (
              <div style={styles.successBox}>
                ✓ Thank you for your feedback! This helps improve our model.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Powered by Machine Learning | Supports MP3, WAV, and OGG formats</p>
      </footer>
    </div>
  );
};

// Comprehensive styling
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    maxWidth: '600px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.5',
  },
  card: {
    backgroundColor: 'white',
    maxWidth: '600px',
    width: '100%',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  uploadSection: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  fileName: {
    marginTop: '8px',
    fontSize: '0.9rem',
    color: '#666',
    fontStyle: 'italic',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  button: {
    flex: 1,
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
  },
  buttonDisabled: {
    flex: 1,
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
  },
  resetButton: {
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginTop: '16px',
    fontSize: '0.9rem',
  },
  loadingIndicator: {
    textAlign: 'center',
    marginTop: '32px',
    color: '#666',
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 16px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  resultArea: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '2px solid #e5e7eb',
  },
  predictionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  genreText: {
    color: '#007bff',
    textTransform: 'capitalize',
  },
  confidence: {
    fontSize: '0.95rem',
    color: '#666',
    marginTop: '8px',
  },
  feedbackBox: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  feedbackQuestion: {
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  feedbackButtons: {
    display: 'flex',
    gap: '12px',
  },
  yesBtn: {
    flex: 1,
    padding: '10px 20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '2px solid #22c55e',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  noBtn: {
    flex: 1,
    padding: '10px 20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  textInput: {
    width: '100%',
    padding: '12px',
    fontSize: '0.95rem',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  successBox: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '8px',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.85rem',
  },
};

export default App;
