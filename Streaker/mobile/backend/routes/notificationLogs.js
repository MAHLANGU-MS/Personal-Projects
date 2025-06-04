const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Log a notification for a task
router.post('/log/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { deliveryStatus } = req.body;

    // Verify task exists
    const [tasks] = await pool.query(
      'SELECT * FROM Tasks WHERE task_id = ?',
      [taskId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    // Insert notification log
    const [result] = await pool.query(
      `INSERT INTO NotificationLogs (task_id, delivery_status) 
       VALUES (?, ?)`,
      [taskId, deliveryStatus || 'SENT']
    );

    res.status(201).json({ message: 'Notification log created successfully', logId: result.insertId });
  } catch (error) {
    console.error('Error logging notification:', error);
    res.status(500).json({ message: 'Server error while logging notification' });
  }
});

// Fetch notification logs for a task
router.get('/logs/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Verify task exists
    const [tasks] = await pool.query(
      'SELECT * FROM Tasks WHERE task_id = ?',
      [taskId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    // Fetch notification logs
    const [logs] = await pool.query(
      `SELECT log_id, sent_at, delivery_status 
       FROM NotificationLogs 
       WHERE task_id = ? 
       ORDER BY sent_at DESC`,
      [taskId]
    );

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    res.status(500).json({ message: 'Server error while fetching notification logs' });
  }
});

module.exports = router;