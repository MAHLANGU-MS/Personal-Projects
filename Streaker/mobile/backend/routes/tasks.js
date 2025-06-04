const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const [tasks] = await pool.query(
      `SELECT t.*, 
        ts.current_streak, ts.longest_streak, ts.last_completed_date,
        (SELECT COUNT(*) FROM TaskCompletions tc WHERE tc.task_id = t.task_id) as total_completions
      FROM Tasks t
      LEFT JOIN TaskStreaks ts ON t.task_id = ts.task_id
      ORDER BY t.is_active DESC, t.task_name ASC`
    );
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

// Get a single task
router.get('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const [tasks] = await pool.query(
      `SELECT t.*, 
        ts.current_streak, ts.longest_streak, ts.last_completed_date,
        ns.notification_frequency_minutes, ns.start_time, ns.end_time, ns.is_enabled
      FROM Tasks t
      LEFT JOIN TaskStreaks ts ON t.task_id = ts.task_id
      LEFT JOIN NotificationSettings ns ON t.task_id = ns.task_id
      WHERE t.task_id = ?`,
      [taskId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(tasks[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error while fetching task' });
  }
});

// Utility to format a date string to YYYY-MM-DD
function toYYYYMMDD(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Create a new task
router.post('/', async (req, res) => {
  try {
    let { taskName, taskDescription, startDate, lastCompletedDate } = req.body;
    // Validate input
    if (!taskName || !startDate || !lastCompletedDate) {
      return res.status(400).json({ message: 'Task name, start date, and last completion date are required' });
    }
    // Ensure dates are in YYYY-MM-DD format
    startDate = toYYYYMMDD(startDate);
    lastCompletedDate = toYYYYMMDD(lastCompletedDate);
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create the task
      const [taskResult] = await connection.query(
        'INSERT INTO Tasks (task_name, task_description, start_date) VALUES (?, ?, ?)',
        [taskName, taskDescription || null, startDate]
      );
      
      const taskId = taskResult.insertId;
      
      // Create initial streak record with last_completed_date
      await connection.query(
        'INSERT INTO TaskStreaks (task_id, current_streak, longest_streak, last_completed_date) VALUES (?, 0, 0, ?)',
        [taskId, lastCompletedDate]
      );
      
      // Create default notification settings
      await connection.query(
        `INSERT INTO NotificationSettings 
          (task_id, notification_frequency_minutes, start_time, end_time, max_daily_notifications) 
        VALUES (?, 60, '08:00:00', '23:59:59', 10)`,
        [taskId]
      );
      
      // Commit transaction
      await connection.commit();
      
      // Get the newly created task with all related data
      const [newTask] = await pool.query(
        `SELECT t.*, 
          ts.current_streak, ts.longest_streak, ts.last_completed_date,
          ns.notification_frequency_minutes, ns.start_time, ns.end_time, ns.is_enabled
        FROM Tasks t
        LEFT JOIN TaskStreaks ts ON t.task_id = ts.task_id
        LEFT JOIN NotificationSettings ns ON t.task_id = ns.task_id
        WHERE t.task_id = ?`,
        [taskId]
      );
      
      res.status(201).json(newTask[0]);
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

// Update a task
router.put('/:taskId', async (req, res) => {
  try {
    console.log('Update task request received:', req.body);
    const taskId = req.params.taskId;
    let { taskName, taskDescription, startDate, isActive, currentStreak, lastCompletedDate } = req.body;
    // Validate input
    if (!taskName || !startDate) {
      return res.status(400).json({ message: 'Task name and start date are required' });
    }
    // Ensure dates are in YYYY-MM-DD format
    startDate = toYYYYMMDD(startDate);
    lastCompletedDate = toYYYYMMDD(lastCompletedDate);
    
    // Update the task
    const [result] = await pool.query(
      'UPDATE Tasks SET task_name = ?, task_description = ?, start_date = ?, is_active = ? WHERE task_id = ?',
      [taskName, taskDescription || null, startDate, isActive !== undefined ? isActive : true, taskId]
    );
    
    console.log('Task updated. Rows affected:', result.affectedRows);
    console.log('Current streak value:', currentStreak);
    console.log('Last completed date:', lastCompletedDate);
    
    // Update streak information if provided
    if (currentStreak !== undefined || lastCompletedDate !== undefined) {
      // First check if a streak record exists
      const [streakExists] = await pool.query(
        'SELECT * FROM TaskStreaks WHERE task_id = ?',
        [taskId]
      );
      
      console.log('Existing streak record:', streakExists[0] || 'None');
      
      // Format the last completed date for MySQL
      let formattedLastCompletedDate = null;
      if (lastCompletedDate) {
        formattedLastCompletedDate = lastCompletedDate.includes('T') 
          ? lastCompletedDate.split('T')[0] 
          : lastCompletedDate;
      }
      
      // Calculate longest streak if current streak is provided
      let longestStreak = streakExists.length > 0 ? streakExists[0].longest_streak : 0;
      if (currentStreak !== undefined && currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
      
      if (streakExists.length > 0) {
        // Update existing streak record
        const updateFields = [];
        const updateValues = [];
        
        if (currentStreak !== undefined) {
          updateFields.push('current_streak = ?');
          updateValues.push(currentStreak);
          
          // Update longest streak if current streak is higher
          updateFields.push('longest_streak = GREATEST(longest_streak, ?)');
          updateValues.push(currentStreak);
        }
        
        if (lastCompletedDate !== undefined) {
          updateFields.push('last_completed_date = ?');
          updateValues.push(formattedLastCompletedDate);
        }
        
        if (updateFields.length > 0) {
          updateValues.push(taskId);
          const updateQuery = `UPDATE TaskStreaks SET ${updateFields.join(', ')} WHERE task_id = ?`;
          console.log('Updating streak with query:', updateQuery);
          console.log('Update values:', updateValues);
          
          const [updateResult] = await pool.query(updateQuery, updateValues);
          console.log('Streak update result:', updateResult.affectedRows, 'rows affected');
        }
      } else {
        // Create new streak record
        const insertQuery = 'INSERT INTO TaskStreaks (task_id, current_streak, longest_streak, last_completed_date) VALUES (?, ?, ?, ?)';
        const insertValues = [taskId, currentStreak || 0, longestStreak, formattedLastCompletedDate];
        
        console.log('Creating new streak record with query:', insertQuery);
        console.log('Insert values:', insertValues);
        
        const [insertResult] = await pool.query(insertQuery, insertValues);
        console.log('New streak record created, ID:', insertResult.insertId);
      }
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Get the updated task with all related data
    const [updatedTask] = await pool.query(
      `SELECT t.*, 
        ts.current_streak, ts.longest_streak, ts.last_completed_date,
        ns.notification_frequency_minutes, ns.start_time, ns.end_time, ns.is_enabled
      FROM Tasks t
      LEFT JOIN TaskStreaks ts ON t.task_id = ts.task_id
      LEFT JOIN NotificationSettings ns ON t.task_id = ns.task_id
      WHERE t.task_id = ?`,
      [taskId]
    );
    
    console.log('Returning updated task:', updatedTask[0]);
    res.status(200).json(updatedTask[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    console.error('Request body:', req.body);
    console.error('Task ID:', req.params.taskId);
    res.status(500).json({ 
      message: 'Server error while updating task', 
      error: error.message,
      details: error.stack 
    });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Delete the task and all related data (streaks, completions, notifications)
    const [result] = await pool.query(
      'DELETE FROM Tasks WHERE task_id = ?',
      [taskId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

module.exports = router;
