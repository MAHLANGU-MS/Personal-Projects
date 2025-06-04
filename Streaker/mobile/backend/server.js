const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const tasksRoutes = require('./routes/tasks');
const streaksRoutes = require('./routes/streaks');
const completionsRoutes = require('./routes/completions');
const notificationsRoutes = require('./routes/notifications');
const notificationLogsRoutes = require('./routes/notificationLogs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', tasksRoutes);
app.use('/api/streaks', streaksRoutes);
app.use('/api/completions', completionsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/notification-logs', notificationLogsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Streaker API' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Access the API at http://192.168.0.2:3000/api');
});
