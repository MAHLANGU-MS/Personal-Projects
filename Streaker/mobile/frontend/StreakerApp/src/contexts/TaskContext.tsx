import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getTasks, updateTask as apiUpdateTask, createTask as apiCreateTask, deleteTask as apiDeleteTask, getTask as apiGetTask, TaskUpdateData, markTaskAsCompletedOnServer, getTaskCompletionHistory } from '../services/api';

// Define the Task interface based on your existing structure
export interface Task {
  task_id: number;
  user_id: number;
  task_name: string;
  task_description: string;
  start_date: string;
  is_active: boolean;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
  total_completions: number;
  created_at?: string;
  updated_at?: string;
  completion_history?: { date: string }[];
}

// Define the context type
interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  getTaskById: (taskId: string) => Promise<Task | null>;
  addTask: (taskData: Omit<Task, 'task_id' | 'created_at' | 'updated_at'>) => Promise<Task | null>;
  updateTask: (taskId: string, taskData: TaskUpdateData) => Promise<Task | null>;
  completeTaskById: (taskId: string) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
  calculateCurrentStreak: (taskData: { start_date: string, last_completed_date?: string | null, completion_history?: { date: string }[] }) => number;
  calculateLongestStreak: (taskData: { start_date: string, last_completed_date?: string | null, longest_streak?: number }) => number;
  calculateDaysSinceCompletion: (taskData: { last_completed_date?: string | null }) => number;
  isDateTodayUTC: (dateString: string | null | undefined) => boolean;
}

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create the provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      // Fetch completion history for each task
      const tasksWithHistory = await Promise.all(
        (data || []).map(async (task: Task) => {
          try {
            const history = await getTaskCompletionHistory(task.task_id.toString());
            return { ...task, completion_history: history.map((c: any) => ({ date: c.completed_at?.split('T')[0] })) };
          } catch (e) {
            return { ...task, completion_history: [] };
          }
        })
      );
      setTasks(tasksWithHistory);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  // Get a single task by ID
  const getTaskById = async (taskId: string): Promise<Task | null> => {
    setLoading(true);
    try {
      const task = await apiGetTask(taskId);
      setError(null);
      return task;
    } catch (err) {
      console.error(`Error fetching task ${taskId}:`, err);
      setError(`Failed to fetch task ${taskId}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (taskData: Omit<Task, 'task_id' | 'created_at' | 'updated_at'>): Promise<Task | null> => {
    setLoading(true);
    try {
      // Explicitly build backend task data with expected fields and mapping
      const backendTaskData = {
        user_id: taskData.user_id, // Keep dummy user_id for context type
        taskName: taskData.task_name,
        taskDescription: taskData.task_description,
        startDate: taskData.start_date,
        isActive: taskData.is_active,
        currentStreak: taskData.current_streak,
        longestStreak: taskData.longest_streak,
        lastCompletedDate: taskData.last_completed_date, // Map snake_case to camelCase for backend
        totalCompletions: taskData.total_completions, // Assuming backend accepts totalCompletions
      };
      console.log('Creating task with refined backend data:', backendTaskData);
      const newTask = await apiCreateTask(backendTaskData);
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        setError(null);
        return newTask;
      }
      return null;
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (taskId: string, taskData: TaskUpdateData): Promise<Task | null> => {
    setLoading(true);
    try {
      const updatedTask = await apiUpdateTask(taskId, taskData);
      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.task_id.toString() === taskId ? updatedTask : task
          )
        );
        setError(null);
        return updatedTask;
      }
      return null;
    } catch (err) {
      console.error(`Error updating task ${taskId}:`, err);
      setError(`Failed to update task ${taskId}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // New function to mark a task as complete using the dedicated endpoint
  const completeTaskById = async (taskId: string): Promise<Task | null> => {
    setLoading(true);
    try {
      const updatedTaskFromServer = await markTaskAsCompletedOnServer(taskId);
      if (updatedTaskFromServer) {
        // Update the tasks list
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.task_id.toString() === taskId ? updatedTaskFromServer : task
          )
        );
        // Update a single task if it's being viewed directly (e.g., in TaskDetailsScreen)
        // This part is tricky as TaskContext doesn't hold a 'currentSingleTask' state.
        // The TaskDetailsScreen will need to re-fetch or use the returned value.
        setError(null);
        return updatedTaskFromServer;
      }
      return null;
    } catch (err) {
      console.error(`Error completing task ${taskId} in context:`, err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to complete task ${taskId}: ${errorMessage}`);
      throw err; // Re-throw to be caught in the component
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string): Promise<boolean> => {
    setLoading(true);
    try {
      await apiDeleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.task_id.toString() !== taskId));
      setError(null);
      return true;
    } catch (err) {
      console.error(`Error deleting task ${taskId}:`, err);
      setError(`Failed to delete task ${taskId}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate current streak based on start date and last completed date
  const calculateCurrentStreak = (taskData: { start_date: string, last_completed_date?: string | null, completion_history?: { date: string }[] }) => {
    console.log('TaskContext calculateCurrentStreak called with (start_date, last_completed_date):', taskData.start_date, taskData.last_completed_date);
    
    if (!taskData.start_date || !taskData.last_completed_date) {
      console.log('No start_date or no last_completed_date, returning 0');
      return 0;
    }
    
    // Get today's date and normalize to start of day (UTC for comparison consistency)
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    
    try {
      // Normalize start_date to a Date object at UTC midnight
      const startDateParts = taskData.start_date.split('T')[0].split('-').map(Number);
      const startDateUTC = new Date(Date.UTC(startDateParts[0], startDateParts[1] - 1, startDateParts[2]));

      // Normalize last_completed_date to a Date object at UTC midnight
      const lastCompletedDateParts = taskData.last_completed_date.split('T')[0].split('-').map(Number);
      const lastCompletedDateUTC = new Date(Date.UTC(lastCompletedDateParts[0], lastCompletedDateParts[1] - 1, lastCompletedDateParts[2]));
      
      if (isNaN(startDateUTC.getTime()) || isNaN(lastCompletedDateUTC.getTime())) {
        console.log('Invalid date format for start_date or last_completed_date, returning 0');
        return 0;
      }

      // Ensure last_completed_date is not before start_date
      if (lastCompletedDateUTC.getTime() < startDateUTC.getTime()) {
        console.log('Last completed date is before start date, streak is 0');
        return 0;
      }
      
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      // Calculate days since last completion (relative to today UTC midnight)
      const daysSinceLastCompletion = Math.floor((todayUTC.getTime() - lastCompletedDateUTC.getTime()) / oneDayMs);
      
      console.log('Days since last completion (UTC based):', daysSinceLastCompletion);
      
      if (daysSinceLastCompletion < 0) {
        console.log('Last completed date is in the future (UTC based), returning 0');
        return 0; // Last completed date is in the future
      }
      
      if (daysSinceLastCompletion <= 1) {
        // Streak is active if completed today or yesterday.
        // Calculate streak length as days from start_date to last_completed_date (inclusive).
        const streakLength = Math.floor((lastCompletedDateUTC.getTime() - startDateUTC.getTime()) / oneDayMs) + 1;
        const result = Math.max(1, streakLength); // Streak is at least 1 if completed on start_date.
        console.log('Streak is active. Calculated streak length:', result);
        return result;
      }
      
      // Streak is broken if more than 1 day has passed since last completion.
      console.log('Streak is broken, returning 0');
      return 0;
    } catch (error) {
      console.error('Error in streak calculation:', error);
      return 0;
    }
  };
  
  // Calculate longest streak based on current dates
  const calculateLongestStreak = (taskData: { start_date: string, last_completed_date?: string | null, longest_streak?: number }) => {
    console.log('Calculating longest streak for:', JSON.stringify(taskData));
    
    // Get current streak based on the dates
    const currentStreak = calculateCurrentStreak(taskData);
    
    // Longest streak is either the current streak (if active) or the previous longest streak
    const previousLongest = taskData.longest_streak || 0;
    const newLongest = Math.max(currentStreak, previousLongest);
    
    console.log(`Longest streak calculation: current=${currentStreak}, previous=${previousLongest}, new=${newLongest}`);
    return newLongest;
  };

  // Calculate days since last completion when streak is broken (UTC based)
  const calculateDaysSinceCompletion = (taskData: { last_completed_date?: string | null }): number => {
    if (!taskData.last_completed_date) {
      console.log('TaskContext.calculateDaysSinceCompletion: No last_completed_date, returning 0');
      return 0;
    }

    try {
      // Get today's date and normalize to start of day (UTC)
      const today = new Date();
      const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

      // Normalize last_completed_date to a Date object at UTC midnight
      const lastCompletedDateParts = taskData.last_completed_date.split('T')[0].split('-');
      const lastCompletedDateUTC = new Date(Date.UTC(Number(lastCompletedDateParts[0]), Number(lastCompletedDateParts[1]) - 1, Number(lastCompletedDateParts[2])));

      if (isNaN(lastCompletedDateUTC.getTime())) {
        console.error('TaskContext.calculateDaysSinceCompletion: Invalid last_completed_date format');
        return 0;
      }

      // Calculate days difference
      const diffTime = todayUTC.getTime() - lastCompletedDateUTC.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('TaskContext.calculateDaysSinceCompletion: Calculated diffDays:', diffDays);
      return diffDays > 0 ? diffDays : 0; // Return 0 if last completion is today or in the future
    } catch (error) {
      console.error('Error in TaskContext.calculateDaysSinceCompletion:', error);
      return 0;
    }
  };

  const isDateTodayUTC = (dateString: string | null | undefined): boolean => {
    if (!dateString) return false;
    try {
      const taskDate = new Date(dateString);
      const taskYearUTC = taskDate.getUTCFullYear();
      const taskMonthUTC = taskDate.getUTCMonth();
      const taskDayUTC = taskDate.getUTCDate();

      const today = new Date();
      const todayYearUTC = today.getUTCFullYear();
      const todayMonthUTC = today.getUTCMonth();
      const todayDayUTC = today.getUTCDate();

      return taskYearUTC === todayYearUTC && taskMonthUTC === todayMonthUTC && taskDayUTC === todayDayUTC;
    } catch (error) {
      console.error('Error in isDateTodayUTC:', error);
      return false;
    }
  };

  // Provide the context value
  const contextValue: TaskContextType = {
    tasks,
    loading,
    error,
    fetchTasks,
    getTaskById,
    addTask,
    updateTask,
    completeTaskById,
    deleteTask,
    calculateCurrentStreak,
    calculateLongestStreak,
    calculateDaysSinceCompletion,
    isDateTodayUTC,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
