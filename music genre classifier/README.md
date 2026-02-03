# Music Genre Classification System[[3](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEQJw_jiai1oZdqM7RCZ8gSIHEQ0iMbU7Hm05a4MKrndXMcNGrppddRi0Rlqd19CgvKgETpCBZi-k4xQ41cLsCXkhUrKPnG_KJZ4O9CaIazV-vJZbZ9M7HBB9I-jHj-DtjhJ2lqFg%3D%3D)][[4](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHi1TIIF82uwYHigdR9rDqvuyY_yGulsLmolXh63P2p4rYNIq6UWAsHWKVlo-ye8s7NPIvBKyQ9IHISGcLok62dWxKzuz30PrbtcE_6-s2LwepMOo1w78b60Y9jc3M9hF38LLv3fxuCIR8o_Fy12Ccfb_tqIcvAxKOXC5p30hIO-DJA-L0lei1GhBid)][[5](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHSrfvZl8rUxnvAUdzcwSoMrcTJAjKuv6d_j0MrV_vsKfk94_59TstXsJpX63oZo8ktgI0ZUrvfT-EXd0733hZ9RxjBe0QlO4uvioFX5kXIh3sRY1zL6QGPyKDM9YSi31wt936DdBwLSVntIkKOkWMIjzCKTez6Hf0EbZuNieac2y6E2LE7l2t2P5rk3nkl8lcmfaJ8S8WV)]

An end-to-end Machine Learning application that identifies music genres using a Deep Neural Network trained on the GTZAN dataset.[[3](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEQJw_jiai1oZdqM7RCZ8gSIHEQ0iMbU7Hm05a4MKrndXMcNGrppddRi0Rlqd19CgvKgETpCBZi-k4xQ41cLsCXkhUrKPnG_KJZ4O9CaIazV-vJZbZ9M7HBB9I-jHj-DtjhJ2lqFg%3D%3D)][[5](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHSrfvZl8rUxnvAUdzcwSoMrcTJAjKuv6d_j0MrV_vsKfk94_59TstXsJpX63oZo8ktgI0ZUrvfT-EXd0733hZ9RxjBe0QlO4uvioFX5kXIh3sRY1zL6QGPyKDM9YSi31wt936DdBwLSVntIkKOkWMIjzCKTez6Hf0EbZuNieac2y6E2LE7l2t2P5rk3nkl8lcmfaJ8S8WV)]

## 🛠 Tech Stack
- **Model:** TensorFlow/Keras (Sequential MLP)
- **Backend:** Flask (Python)
- **Frontend:** React (JavaScript/Axios)
- **Data:** GTZAN Dataset (Kaggle)[[6](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHFAXmkRs3NtRaUZiK0x78nxhy0CRwoQlhgZucilPEYv_B9MzkEi4rArhs-hjWcdSCMdJlELoQvfMUu4ETNSXz7LOvFMOQw41Jwfqbq8U_IqwzE9jHnPZAbr1WPsSoPCx_hw6ngjg%3D%3D)]

## 🚀 Workflow
1. **Training:** 
   - Trained a 5-layer Neural Network in Jupyter/Google Colab.
   - Used the `features_3_sec.csv` provided in the GTZAN dataset.
   - Saved the model (`.keras`), the scaler (`.pkl`), and label encoder (`.pkl`).
2. **Backend API:** 
   - A Flask server loads the model on startup.
   - The `predict` endpoint uses `Librosa` to extract MFCC and spectral features from live user uploads.
   - Features are normalized using the saved `StandardScaler` to ensure consistency.
3. **Frontend:**
   - A simple React UI allows users to upload `.wav` or `.mp3` files.
   - Users can provide feedback (True/False) which is logged in a CSV file on the server for future model improvement.

## 📦 Installation
1. **Backend:**
   ```bash
   pip install flask flask-cors tensorflow librosa scikit-learn
   python app.py