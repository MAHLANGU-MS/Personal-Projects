import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.3:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Task API
export const getTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const getTask = async (taskId: string) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

// Utility to format a Date object or string to YYYY-MM-DD
export function toYYYYMMDD(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const createTask = async (taskData: any) => {
  try {
    // Ensure date fields are in YYYY-MM-DD format
    const formattedData = {
      ...taskData,
      startDate: toYYYYMMDD(taskData.startDate),
      lastCompletedDate: toYYYYMMDD(taskData.lastCompletedDate),
    };
    const response = await api.post('/tasks', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export interface TaskUpdateData {
  taskName?: string;
  taskDescription?: string;
  startDate?: string;
  isActive?: boolean;
  currentStreak?: number;
  longestStreak?: number;
  lastCompletedDate?: string | null;
}

export const updateTask = async (taskId: string, taskData: TaskUpdateData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// New function for dedicated task completion endpoint
export const markTaskAsCompletedOnServer = async (taskId: string) => {
  try {
    // Corrected: POST to /completions/complete with { taskId }
    const response = await api.post('/completions/complete', { taskId });
    return response.data; // Expecting the updated streak info from the backend
  } catch (error) {
    console.error(`Error marking task ${taskId} as complete on server:`, error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
