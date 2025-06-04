const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get notification settings for a task
router.get('/settings/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    // Verify task exists
    const [tasks] = await pool.query(
      'SELECT * FROM Tasks WHERE task_id = ?',
      [taskId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Get notification settings
    const [settings] = await pool.query(
      'SELECT * FROM NotificationSettings WHERE task_id = ?',
      [taskId]
    );
    
    if (settings.length === 0) {
      return res.status(404).json({ message: 'Notification settings not found' });
    }
    
    res.status(200).json(settings[0]);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ message: 'Server error while fetching notification settings' });
  }
});

// Update notification settings for a task
router.put('/settings/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { 
      notificationFrequencyMinutes,
      startTime,
      endTime,
      enabled
    } = req.body;
    
    // Verify task exists
    const [tasks] = await pool.query(
      'SELECT * FROM Tasks WHERE task_id = ?',
      [taskId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update notification settings
    const [result] = await pool.query(
      `UPDATE NotificationSettings 
       SET notification_frequency_minutes = ?, start_time = ?, end_time = ?, enabled = ?
       WHERE task_id = ?`,
      [notificationFrequencyMinutes, startTime, endTime, enabled, taskId]
    );
    
    if (result.affectedRows === 0) {
      // Insert new notification settings if not found
      const [insertResult] = await pool.query(
        'INSERT INTO NotificationSettings (task_id, notification_frequency_minutes, start_time, end_time, enabled) VALUES (?, ?, ?, ?, ?)',
        [taskId, notificationFrequencyMinutes, startTime, endTime, enabled]
      );
      res.status(201).json({ message: 'Notification settings created successfully' });
    } else {
      res.status(200).json({ message: 'Notification settings updated successfully' });
    }
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Server error while updating notification settings' });
  }
});

module.exports = router;
