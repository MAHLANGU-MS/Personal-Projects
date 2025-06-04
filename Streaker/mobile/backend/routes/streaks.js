const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get streak info for all tasks
router.get('/', async (req, res) => {
  try {
    const [streaks] = await pool.query(
      `SELECT ts.*, t.task_name, t.is_active
       FROM TaskStreaks ts
       JOIN Tasks t ON ts.task_id = t.task_id
       ORDER BY ts.current_streak DESC`,
      []
    );
    
    res.status(200).json(streaks);
  } catch (error) {
    console.error('Error fetching streaks:', error);
    res.status(500).json({ message: 'Server error while fetching streaks' });
  }
});

// Get streak info for a specific task
router.get('/:taskId', async (req, res) => {
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
    
    // Get streak info
    const [streaks] = await pool.query(
      'SELECT * FROM TaskStreaks WHERE task_id = ?',
      [taskId]
    );
    
    if (streaks.length === 0) {
      return res.status(404).json({ message: 'Streak information not found' });
    }
    
    res.status(200).json(streaks[0]);
  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({ message: 'Server error while fetching streak' });
  }
});

// Reset a streak
router.post('/reset/:taskId', async (req, res) => {
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
    
    // Reset streak
    await pool.query(
      'UPDATE TaskStreaks SET current_streak = 0 WHERE task_id = ?',
      [taskId]
    );
    
    // Get updated streak info
    const [updatedStreak] = await pool.query(
      'SELECT * FROM TaskStreaks WHERE task_id = ?',
      [taskId]
    );
    
    res.status(200).json({
      message: 'Streak reset successfully',
      streak: updatedStreak[0]
    });
  } catch (error) {
    console.error('Error resetting streak:', error);
    res.status(500).json({ message: 'Server error while resetting streak' });
  }
});

module.exports = router;
