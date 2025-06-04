const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Utility to format a date string or Date object to YYYY-MM-DD (local time)
function toYYYYMMDD(date) {
  if (!date) return null;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = new Date(date);
  if (isNaN(d)) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Mark a task as completed
router.post('/complete', async (req, res) => {
  try {
    const { taskId, notes } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
    
    // Verify task exists
    const [tasks] = await pool.query(
      'SELECT * FROM Tasks WHERE task_id = ?',
      [taskId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const task = tasks[0];
    // Use local date for today
    const now = new Date();
    const today = toYYYYMMDD(now);
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Check if task was already completed today
      const [completions] = await connection.query(
        'SELECT * FROM TaskCompletions WHERE task_id = ? AND DATE(completed_at) = CURDATE()',
        [taskId]
      );
      
      if (completions.length > 0) {
        await connection.rollback();
        return res.status(400).json({ message: 'Task already completed today' });
      }
      
      // Record completion
      const [completionResult] = await connection.query(
        'INSERT INTO TaskCompletions (task_id, completed_at, notes) VALUES (?, NOW(), ?)',
        [taskId, notes || null]
      );
      
      // Get current streak info
      const [streaks] = await connection.query(
        'SELECT * FROM TaskStreaks WHERE task_id = ?',
        [taskId]
      );
      
      let streak = streaks[0];
      let newStreak = streak.current_streak;
      let longestStreak = streak.longest_streak;
      
      // If last completed date is yesterday, increment streak
      // If last completed date is null or before yesterday, reset streak to 1
      if (streak.last_completed_date) {
        const lastCompletedDate = toYYYYMMDD(streak.last_completed_date);
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = toYYYYMMDD(yesterdayDate);
        
        if (lastCompletedDate === yesterday) {
          // Completed yesterday, increment streak
          newStreak += 1;
        } else if (lastCompletedDate !== today) {
          // Not completed yesterday and not already completed today, reset streak
          newStreak = 1;
        }
      } else {
        // First completion ever
        newStreak = 1;
      }
      
      // Update longest streak if needed
      if (newStreak > longestStreak) {
        longestStreak = newStreak;
      }
      
      // Update streak record
      await connection.query(
        'UPDATE TaskStreaks SET current_streak = ?, longest_streak = ?, last_completed_date = CURDATE() WHERE task_id = ?',
        [newStreak, longestStreak, taskId]
      );
      
      // Commit transaction
      await connection.commit();
      
      // Get updated streak info
      const [updatedStreak] = await pool.query(
        'SELECT * FROM TaskStreaks WHERE task_id = ?',
        [taskId]
      );
      
      res.status(200).json({
        message: 'Task completed successfully',
        completion: {
          id: completionResult.insertId,
          taskId,
          completedAt: new Date(),
          notes
        },
        streak: updatedStreak[0]
      });
      
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ message: 'Server error while completing task' });
  }
});

// Get completions history for a task
router.get('/history/:taskId', async (req, res) => {
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
    
    // Get completions
    const [completions] = await pool.query(
      'SELECT * FROM TaskCompletions WHERE task_id = ? ORDER BY completed_at DESC',
      [taskId]
    );
    
    res.status(200).json(completions);
  } catch (error) {
    console.error('Error fetching completions:', error);
    res.status(500).json({ message: 'Server error while fetching completions' });
  }
});

module.exports = router;
