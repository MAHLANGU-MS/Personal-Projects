// backend/server.js
// Import the Express module
const express = require('express');
// Import Firebase Admin SDK
const admin = require('firebase-admin');

// Import the service account key
// IMPORTANT: Make sure the path to the service account key is correct
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Firestore database
const db = admin.firestore();
console.log('Firestore connected successfully!');

// Create an Express application
const app = express();

// Define the port the server will run on
// Use the environment variable PORT if available, otherwise default to 3001
const port = process.env.PORT || 3001;

// Define a simple route for the root URL ('/')
app.get('/', (req, res) => {
  // Send a simple text response
  res.send('Hello World from the backend!');
});

// Start the server and listen for connections on the specified port
app.listen(port, () => {
  // Log a message to the console once the server is running
  console.log(`Server listening at http://localhost:${port}`);
}); 