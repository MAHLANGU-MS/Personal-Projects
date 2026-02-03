import os
import pickle
import numpy as np
import librosa
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import traceback
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],  # Vite's default port
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configuration
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'flac', 'm4a'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load the saved assets with error handling
try:
    model = tf.keras.models.load_model('music_genre_model.keras')
    print("✓ Model loaded successfully")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None

try:
    scaler = pickle.load(open('scaler.pkl', 'rb'))
    print("✓ Scaler loaded successfully")
except Exception as e:
    print(f"✗ Error loading scaler: {e}")
    scaler = None

try:
    encoder = pickle.load(open('label_encoder.pkl', 'rb'))
    print("✓ Label encoder loaded successfully")
except Exception as e:
    print(f"✗ Error loading encoder: {e}")
    encoder = None

def extract_features(audio_path):
    """
    Extracts features from 3 seconds of audio to match GTZAN CSV format.
    Returns numpy array of shape (1, 58)
    """
    try:
        # Load audio file with 3-second duration
        y, sr = librosa.load(audio_path, duration=3, sr=22050)
        
        # Extract features
        chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)
        rms = librosa.feature.rms(y=y)
        spec_cent = librosa.feature.spectral_centroid(y=y, sr=sr)
        spec_bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        zcr = librosa.feature.zero_crossing_rate(y)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        
        # Combine features (means and variances)
        features = [
            np.mean(chroma_stft), np.var(chroma_stft),
            np.mean(rms), np.var(rms),
            np.mean(spec_cent), np.var(spec_cent),
            np.mean(spec_bw), np.var(spec_bw),
            np.mean(rolloff), np.var(rolloff),
            np.mean(zcr), np.var(zcr),
        ]
        
        # Add MFCC means and variances
        for m in mfcc:
            features.extend([np.mean(m), np.var(m)])
        
        # Pad to 58 features if needed
        while len(features) < 58:
            features.append(0)
        
        # Ensure exactly 58 features
        features = features[:58]
        
        return np.array(features).reshape(1, -1)
    
    except Exception as e:
        print(f"Error extracting features: {e}")
        raise

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint."""
    return jsonify({
        'status': 'running',
        'message': 'Music Genre Classifier API',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None,
        'encoder_loaded': encoder is not None
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Predict music genre from uploaded audio file."""
    
    # Handle preflight CORS request
    if request.method == 'OPTIONS':
        return '', 204
    
    # Validate models are loaded
    if not all([model, scaler, encoder]):
        return jsonify({
            'error': 'Server not ready',
            'details': 'Model, scaler, or encoder not loaded properly'
        }), 500
    
    # Check if file is present
    if 'file' not in request.files:
        return jsonify({
            'error': 'No file provided',
            'details': 'Please upload an audio file'
        }), 400
    
    file = request.files['file']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({
            'error': 'No file selected',
            'details': 'Please select an audio file'
        }), 400
    
    # Validate file extension
    if not allowed_file(file.filename):
        return jsonify({
            'error': 'Invalid file type',
            'details': f'Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'
        }), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({
            'error': 'File too large',
            'details': f'Maximum file size is {MAX_FILE_SIZE // (1024*1024)}MB'
        }), 400
    
    temp_path = None
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        suffix = os.path.splitext(filename)[1]
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            temp_path = tmp_file.name
            file.save(temp_path)
        
        print(f"Processing file: {filename} ({file_size} bytes)")
        
        # Extract features
        features = extract_features(temp_path)
        print(f"Features extracted: shape {features.shape}")
        
        # Scale features
        scaled_features = scaler.transform(features)
        print(f"Features scaled: shape {scaled_features.shape}")
        
        # Make prediction
        prediction = model.predict(scaled_features, verbose=0)
        genre_idx = np.argmax(prediction)
        confidence = float(prediction[0][genre_idx])
        genre_name = encoder.inverse_transform([genre_idx])[0]
        
        print(f"Prediction: {genre_name} (confidence: {confidence:.2%})")
        
        return jsonify({
            'genre': genre_name,
            'confidence': confidence
        })
    
    except Exception as e:
        print(f"Error during prediction: {e}")
        traceback.print_exc()
        return jsonify({
            'error': 'Prediction failed',
            'details': str(e)
        }), 500
    
    finally:
        # Clean up temporary file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

@app.route('/feedback', methods=['POST', 'OPTIONS'])
def feedback():
    """Store user feedback for model improvement."""
    
    # Handle preflight CORS request
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.json
        
        # Validate required fields
        if not all(key in data for key in ['predicted', 'is_correct', 'actual']):
            return jsonify({
                'error': 'Missing required fields',
                'details': 'Required: predicted, is_correct, actual'
            }), 400
        
        # Ensure feedback directory exists
        os.makedirs('feedback', exist_ok=True)
        
        # Save feedback to CSV
        feedback_file = 'feedback/user_feedback.csv'
        
        # Create file with header if it doesn't exist
        if not os.path.exists(feedback_file):
            with open(feedback_file, 'w') as f:
                f.write('predicted,is_correct,actual,timestamp\n')
        
        # Append feedback
        from datetime import datetime
        timestamp = datetime.now().isoformat()
        
        with open(feedback_file, 'a') as f:
            f.write(f"{data['predicted']},{data['is_correct']},{data['actual']},{timestamp}\n")
        
        print(f"Feedback saved: {data['predicted']} -> {data['actual']} (correct: {data['is_correct']})")
        
        return jsonify({'status': 'success'})
    
    except Exception as e:
        print(f"Error saving feedback: {e}")
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to save feedback',
            'details': str(e)
        }), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error."""
    return jsonify({
        'error': 'File too large',
        'details': f'Maximum file size is {MAX_FILE_SIZE // (1024*1024)}MB'
    }), 413

@app.errorhandler(500)
def internal_server_error(error):
    """Handle internal server errors."""
    return jsonify({
        'error': 'Internal server error',
        'details': 'Something went wrong on the server'
    }), 500

if __name__ == '__main__':
    print("=" * 50)
    print("🎵 Music Genre Classifier API")
    print("=" * 50)
    print(f"Server starting on http://localhost:5000")
    print(f"Model loaded: {'✓' if model else '✗'}")
    print(f"Scaler loaded: {'✓' if scaler else '✗'}")
    print(f"Encoder loaded: {'✓' if encoder else '✗'}")
    print("=" * 50)
    
    app.run(
        host='0.0.0.0',  # Allow external connections
        port=5000,
        debug=True,
        threaded=True
    )