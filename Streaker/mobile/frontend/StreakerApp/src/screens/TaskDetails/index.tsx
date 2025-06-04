import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Platform, Modal, Pressable, Button, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Task, useTasks } from '../../contexts/TaskContext';
import { RootStackParamList } from '../../navigation';
// Direct API functions to bypass context issues
import { updateTask as apiUpdateTask, TaskUpdateData } from '../../services/api';
// Import useTheme hook and Theme type
import { useTheme, Theme } from '../../contexts/ThemeContext';

// Using Task interface from TaskContext

interface EditState {
  task_name: string;
  task_description: string;
  last_completed_date: string | null;
  start_date: string;
  is_active: boolean;
}

export default function TaskDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'TaskDetails'>>();
  const { taskId } = route.params;
  const { fetchTasks } = useTasks();
  
  // Use the useTheme hook to access the current theme
  const { theme } = useTheme();
  
  // States
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState<'start_date' | 'last_completed_date'>('start_date');
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [forceUpdate, setForceUpdate] = useState<number>(0); // For recalculation
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  // Get task context at component level - only call hooks at the top level
  const { getTaskById, updateTask, calculateCurrentStreak, calculateLongestStreak, calculateDaysSinceCompletion, completeTaskById, deleteTask } = useTasks();

  // Using calculateCurrentStreak from TaskContext

  // Use useMemo to calculate the streak whenever dependencies change
  const currentStreak = useMemo(() => {
    console.log('Recalculating streak with useMemo');
    const data = isEditing && editState ? editState : task;
    
    if (data) {
      console.log('Data for streak calculation:', JSON.stringify({
        start_date: data.start_date,
        last_completed_date: data.last_completed_date
      }));
      const result = calculateCurrentStreak(data);
      console.log('Calculated streak result:', result);
      return result;
    }
    return 0;
  }, [isEditing, editState, task, calculateCurrentStreak, forceUpdate]);
  
  // Calculate days since last completion when streak is broken
  const daysSinceCompletion = useMemo(() => {
    if (currentStreak > 0) return 0; // Only calculate when streak is broken
    
    const data = isEditing && editState ? editState : task;
    if (!data || !data.last_completed_date) return 0;
    
    // Use the context function
    return calculateDaysSinceCompletion(data);
  }, [currentStreak, isEditing, editState, task, calculateDaysSinceCompletion]);
  
  // Calculate longest streak based on current data
  const longestStreak = useMemo(() => {
    const data = isEditing && editState ? editState : task;
    if (!data) return 0;
    
    // Calculate longest streak using context method
    return calculateLongestStreak(data);
  }, [isEditing, editState, task, calculateLongestStreak, forceUpdate]);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        if (taskId) {
          const data = await getTaskById(taskId);
          if (!data) {
            throw new Error('Task data is invalid');
          }
          
          console.log('Fetched fresh task data:', JSON.stringify(data));
          
          // Update task data
          setTask(data);
          
          // Update edit state
          setEditState({
            task_name: data.task_name,
            task_description: data.task_description,
            last_completed_date: data.last_completed_date,
            start_date: data.start_date,
            is_active: data.is_active || true
          });
          
          setError(null);
        } else {
          setError('Task not found');
        }
      } catch (err) {
        console.error('Error loading task details:', err);
        setError('Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId, forceUpdate]); // Re-fetch when forceUpdate changes

  if (loading) {
    return (
      <View style={getStyles(theme).loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={getStyles(theme).container}>
        <Text style={getStyles(theme).errorText}>{error}</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={getStyles(theme).container}>
        <Text style={getStyles(theme).errorText}>Task not found</Text>
      </View>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (editState && task) {
        // Validate required fields
        if (!editState.task_name || !editState.start_date) {
          setError('Task name and start date are required');
          return;
        }
        
        const calculatedStreak = calculateCurrentStreak(editState);
        console.log('Calculated streak before saving:', calculatedStreak);
        
        // Format dates to YYYY-MM-DD without time component, if they exist and are strings
        let formattedStartDate = editState.start_date;
        if (formattedStartDate && typeof formattedStartDate === 'string' && formattedStartDate.includes('T')) {
          formattedStartDate = formattedStartDate.split('T')[0];
        }
        
        let formattedLastCompletedDate = editState.last_completed_date;
        if (formattedLastCompletedDate && typeof formattedLastCompletedDate === 'string' && formattedLastCompletedDate.includes('T')) {
          formattedLastCompletedDate = formattedLastCompletedDate.split('T')[0];
        }

        // Prepare update payload matching the backend requirements exactly
        const updateData: TaskUpdateData = {
          taskName: editState.task_name,
          startDate: formattedStartDate,
          taskDescription: editState.task_description || '',
          isActive: editState.is_active === undefined ? true : editState.is_active,
          currentStreak: calculatedStreak,
          lastCompletedDate: formattedLastCompletedDate
        };

        console.log('Sending update data to API:', JSON.stringify(updateData));
        
        // Make the API call
        const updatedTask = await updateTask(task.task_id.toString(), updateData);
        
        if (updatedTask) {
          console.log('Received updated task from API:', JSON.stringify(updatedTask));
          setTask(updatedTask);
          setIsEditing(false);
          // Refresh task context
          fetchTasks();
        } else {
          throw new Error('Failed to update task');
        }
      }
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save changes');
      console.error('Error saving changes:', err);
    }
  };

  const handleCancel = () => {
    setEditState({
      task_name: task.task_name,
      task_description: task.task_description,
      last_completed_date: task.last_completed_date,
      start_date: task.start_date,
      is_active: task.is_active || true
    });
    setIsEditing(false);
  };

  // Handler for completing the task - purely client-side approach to avoid server errors
  const handleCompleteTask = async () => {
    if (!task || !taskId) { 
      Alert.alert('Error', 'No task data available to complete.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log(`Attempting to complete task ${taskId} via dedicated endpoint.`);
      // API Call: Use the new completeTaskById function from useTasks context
      const updatedTaskFromServer = await completeTaskById(taskId);
      
      if (updatedTaskFromServer) {
        // If API call is successful, then update local state with the fresh task from server
        setTask(updatedTaskFromServer);
        
        setForceUpdate(prev => prev + 1); // Triggers re-calculation of streaks in useMemo if needed
        fetchTasks(); // Refresh task list on the parent screen to reflect changes

        Alert.alert('Success', 'Task completed and saved!');
      } else {
        // This case might occur if completeTaskById returns null without throwing an error
        throw new Error('Completion call returned no data.');
      }
      
    } catch (apiError) {
      console.error('Error completing task via API:', apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : 'An unknown error occurred.';
      setError(`Could not save task completion: ${errorMessage}`);
      Alert.alert('Error', `Failed to save completion: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
      setShowCompleteConfirm(false);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    // const currentPickerShown = showDatePicker; // Capture state before async update
    if (Platform.OS === 'android') {
      setShowDatePicker(false); // For Android, hide picker on any interaction
    }

    if (event.type === 'set' && date) {
      // Revert to using UTC methods to derive the date string
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth is 0-indexed
      const day = String(date.getUTCDate()).padStart(2, '0');
      const utcDateString = `${year}-${month}-${day}`;

      setEditState(prev => prev && { ...prev, [datePickerField]: utcDateString });
      // For iOS, if picker is not modal (e.g., 'inline'), it might not hide automatically.
      if (Platform.OS === 'ios' && showDatePicker) { // Check showDatePicker to avoid issues if already hidden
        // setShowDatePicker(false); // Only if it's a modal that needs explicit dismissal via state
      }
    } else if (event.type === 'dismissed') {
      // Picker was dismissed (e.g., user tapped outside on Android)
      // setShowDatePicker(false) already called for Android
    }
    // If it's iOS and not 'set', it could be intermediate changes in 'inline' mode, so don't hide.
  };

  const showDatePickerFor = (field: 'start_date' | 'last_completed_date') => {
    setDatePickerField(field);
    let initialPickerDate: Date;
    const currentDateInState = editState?.[field];

    if (currentDateInState && typeof currentDateInState === 'string' && currentDateInState.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = currentDateInState.split('-').map(Number);
      // Create a Date object representing midnight UTC for the given YYYY-MM-DD
      initialPickerDate = new Date(Date.UTC(year, month - 1, day));
    } else {
      // Default to current local day, but set as UTC midnight for the picker
      const today = new Date();
      initialPickerDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    }

    setDatePickerDate(initialPickerDate);
    setShowDatePicker(true);
  };

  const handleDeleteTask = async () => {
    if (!task || !taskId) return;
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const success = await deleteTask(taskId.toString());
              if (success) {
                Alert.alert('Deleted', 'Task deleted successfully.');
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to delete task.');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to delete task.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={getStyles(theme).container}>
      <View style={getStyles(theme).taskInfo}> {/* Now theme-aware */}
        <View style={getStyles(theme).header}>
          <Text style={getStyles(theme).taskName}>{isEditing ? (
            <TextInput
              style={getStyles(theme).editInput}
              value={editState?.task_name || ''}
              onChangeText={(text) => setEditState(prev => prev && {
                ...prev,
                task_name: text
              })}
            />
          ) : task.task_name}</Text>
          {isEditing ? (
            <View style={getStyles(theme).editControls}>
              <TouchableOpacity onPress={handleSave}>
                <FontAwesome name="check" size={20} color={theme === 'dark' ? '#90caf9' : '#2196F3'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel}>
                <FontAwesome name="times" size={20} color={theme === 'dark' ? '#bbb' : '#666'} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={handleEdit} style={{ marginRight: 16 }}>
                <FontAwesome name="edit" size={20} color={theme === 'dark' ? '#bbb' : '#666'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteTask}>
                <FontAwesome name="trash" size={20} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TextInput
          style={[getStyles(theme).taskDescription, isEditing ? getStyles(theme).editInput : {}]}
          value={editState?.task_description || task.task_description}
          onChangeText={(text) => setEditState(prev => prev && {
            ...prev,
            task_description: text
          })}
          multiline={true}
          editable={isEditing}
        />
        <View style={getStyles(theme).streakContainer}>
          <View style={getStyles(theme).streakField}>
            <Text style={getStyles(theme).streakLabel}>Start Date:</Text>
            {isEditing ? (
              <TouchableOpacity onPress={() => showDatePickerFor('start_date')}>
                <Text style={[
                  getStyles(theme).streakValue,
                  getStyles(theme).editInput,
                  { color: theme === 'dark' ? '#e0e0e0' : '#333' }
                ]}>
                  {(() => {
                    const d = editState?.start_date;
                    if (!d) return 'Select date';
                    const dateString = d.split('T')[0];
                    const parsed = new Date(dateString + 'T00:00:00Z');
                    return isNaN(parsed.getTime()) ? 'Select date' : parsed.toLocaleDateString();
                  })()}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={getStyles(theme).streakValue}>
                {task.start_date ? new Date(task.start_date.split('T')[0] + 'T00:00:00Z').toLocaleDateString() : 'Not set'}
              </Text>
            )}
          </View>
          <View style={getStyles(theme).streakField}>
            <Text style={getStyles(theme).streakLabel}>Last Completed:</Text>
            {isEditing ? (
              <TouchableOpacity onPress={() => showDatePickerFor('last_completed_date')}>
                <Text style={[
                  getStyles(theme).streakValue,
                  getStyles(theme).editInput,
                  { color: theme === 'dark' ? '#e0e0e0' : '#2196F3' }
                ]}>
                  {(() => {
                    const d = editState?.last_completed_date || task.last_completed_date;
                    if (!d) return 'Tap to select';
                    if (d.includes('T')) {
                      const parsed = new Date(d);
                      return isNaN(parsed.getTime()) ? 'Tap to select' : parsed.toLocaleDateString();
                    }
                    const parsed = new Date(d + 'T00:00:00');
                    return isNaN(parsed.getTime()) ? 'Tap to select' : parsed.toLocaleDateString();
                  })()}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={getStyles(theme).streakValue}>
                {task.last_completed_date 
                  ? new Date(task.last_completed_date).toLocaleDateString()
                  : 'None'}
              </Text>
            )}
          </View>
        </View>
        <View style={getStyles(theme).streakContainer}>
          <View style={getStyles(theme).streakField}>
            <Text style={getStyles(theme).streakLabel}>Current Streak:</Text>
            <Text style={[getStyles(theme).streakValue, {color: '#2196F3', fontWeight: 'bold'}]}>
              {currentStreak} days
            </Text>
          </View>
          
          {/* Show days since completion when streak is broken */}
          {currentStreak === 0 && daysSinceCompletion > 0 && (
            <View style={[getStyles(theme).streakField, {marginTop: 8}]}>
              <Text style={getStyles(theme).streakLabel}>Days Since Completion:</Text>
              <Text style={[getStyles(theme).streakValue, {color: '#FF5722', fontWeight: 'bold'}]}>
                {daysSinceCompletion} days
              </Text>
            </View>
          )}
        </View>
        <Text style={getStyles(theme).streak}>Longest Streak: {longestStreak} days</Text>
        {/* <Text style={styles.streak}>Total Completions: {task.total_completions}</Text> */}
      </View>
      <TouchableOpacity 
        style={getStyles(theme).button} 
        disabled={isEditing}
        onPress={() => setShowCompleteConfirm(true)}
      >
        <Text style={[getStyles(theme).buttonText, isEditing && getStyles(theme).disabledText]}>Complete Task</Text>
      </TouchableOpacity>
      
      {/* Completion Confirmation Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCompleteConfirm}
        onRequestClose={() => setShowCompleteConfirm(false)}
      >
        <View style={getStyles(theme).modalOverlay}>
          <View style={getStyles(theme).confirmationModal}>
            <TouchableOpacity 
              style={getStyles(theme).closeButton} 
              onPress={() => setShowCompleteConfirm(false)}
            >
              <FontAwesome name="times" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={getStyles(theme).confirmationText}>Confirm this task was completed</Text>
            
            <Text style={getStyles(theme).confirmationSubtext}>
              This will set completion date to: {new Date().toLocaleDateString()}
            </Text>
            
            <TouchableOpacity 
              style={getStyles(theme).confirmButton}
              onPress={handleCompleteTask}
            >
              <Text style={getStyles(theme).confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {showDatePicker && (
        <DateTimePicker
          value={datePickerDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

// Refactor styles into a function that takes the theme
const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  taskDetailsContainer: {
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.5 : 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: theme === 'dark' ? '#333' : 'transparent', // Add subtle border
    borderWidth: theme === 'dark' ? 1 : 0,
  },
  taskName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  },
  taskDescription: {
    fontSize: 16,
    marginBottom: 15,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#bbbbbb' : '#666',
  },
  streakContainer: {
    marginBottom: 15,
  },
  streakField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  },
  streakValue: {
    fontSize: 18,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#90caf9' : '#2196F3', // Lighter blue for dark mode
  },
  streak: {
    fontSize: 18,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#90caf9' : '#2196F3',
    marginBottom: 12,
  },
  lastCompleted: {
    fontSize: 16,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#bbbbbb' : '#666',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#ccc',
  },
  editInput: {
    borderWidth: 1,
    // Adjust border and text color based on theme
    borderColor: theme === 'dark' ? '#555' : '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
  },
  editControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  datePicker: {
    width: '100%',
    marginTop: 20,
  },
  toggleButton: {
    padding: 5,
    borderRadius: 5,
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
  },
  // Confirmation Modal Styles
  modalOverlay: {
    flex: 1,
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationModal: {
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.5 : 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
    borderColor: theme === 'dark' ? '#333' : 'transparent', // Add subtle border
    borderWidth: theme === 'dark' ? 1 : 0,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  },
  confirmationSubtext: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    // Adjust text color based on theme
    color: theme === 'dark' ? '#bbbbbb' : '#666',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskInfo: {
    backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderColor: theme === 'dark' ? '#333' : 'transparent',
    borderWidth: theme === 'dark' ? 1 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
