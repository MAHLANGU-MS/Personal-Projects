#!/bin/bash
# Streaker App Setup Script

# ------------- BACKEND SETUP -------------
echo "Setting up backend..."

# Navigate to backend directory
cd backend

# Initialize package.json
npm init -y

# Install backend dependencies
npm install express mysql2 cors dotenv bcrypt jsonwebtoken nodemon body-parser

# Create necessary files (these will be created separately)
echo "Backend dependencies installed."

# ------------- FRONTEND SETUP -------------
echo "Setting up React Native frontend..."

# Navigate back to project root
cd ..

# Initialize React Native project in the mobile directory
npx react-native init StreakerApp --directory mobile

# Navigate to mobile directory
cd mobile

# Install frontend dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-vector-icons
npm install @react-native-async-storage/async-storage
npm install axios
npm install react-native-push-notification
npm install react-native-countdown-component
npm install react-native-gesture-handler
npm install react-native-reanimated
npm install date-fns

# Install dev dependencies
npm install --save-dev @babel/core @babel/runtime @react-native-community/eslint-config

echo "Frontend dependencies installed."
echo "Setup complete! You can now start developing your Streaker app."
