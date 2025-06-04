import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useTasks, Task } from '../../contexts/TaskContext';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../contexts/ThemeContext';
import { StreakCalendar } from '../../components/StreakCalendar';
import { ProgressBarSection } from '../../components/ProgressBarSection';
import { CompletionRateChart } from '../../components/CompletionRateChart';

// Using Task interface from TaskContext



export const HomeScreen = () => {
  const navigation = useNavigation<CompositeNavigationProp<
    BottomTabNavigationProp<{
      Home: undefined;
      Tasks: undefined;
      Settings: undefined;
    }>,
    StackNavigationProp<RootStackParamList>
  >>();
  const { tasks, loading, error, fetchTasks } = useTasks();
  const { theme } = useTheme();

  useEffect(() => {
    // Fetch tasks from context when component mounts
    fetchTasks();
  }, []);
  
  // Find the task with the longest streak
  const longestStreakTask: Task | null = tasks.length > 0 
    ? tasks.reduce((prev, current) => 
        (prev.longest_streak > current.longest_streak ? prev : current), tasks[0])
    : null;

  // Helper: Get all completed dates for the longest streak task
  const completedDates: string[] = longestStreakTask?.completion_history?.map(h => h.date) || [];

  // Helper: Calculate daily/weekly progress
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday as start
  const weekStartStr = weekStart.toISOString().split('T')[0];

  let completedToday = 0, totalToday = 0, completedWeek = 0, totalWeek = 0, totalCompletions = 0;
  tasks.forEach(task => {
    const history = task.completion_history || [];
    totalToday++;
    totalWeek++;
    if (history.some(h => h.date === todayStr)) completedToday++;
    if (history.some(h => h.date >= weekStartStr && h.date <= todayStr)) completedWeek++;
    totalCompletions += history.length;
  });
  // Completion rate: total completions / (total tasks * days since first task)
  const firstTaskDate = tasks.length > 0 ? tasks.reduce((min, t) => t.start_date < min ? t.start_date : min, tasks[0].start_date) : todayStr;
  const daysSinceFirst = Math.max(1, Math.ceil((today.getTime() - new Date(firstTaskDate).getTime()) / (1000 * 60 * 60 * 24)));
  const completionRate = tasks.length > 0 ? totalCompletions / (tasks.length * daysSinceFirst) : 0;

  if (loading) {
    return (
      <View style={getStyles(theme).container}>
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

  if (!longestStreakTask) {
    return (
      <View style={getStyles(theme).container}>
        <Text style={getStyles(theme).title}>No tasks found</Text>
        <TouchableOpacity
          style={getStyles(theme).button}
          onPress={() => navigation.navigate('Tasks')}
        >
          <Text style={getStyles(theme).buttonText}>View Your Streaks</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
        backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={getStyles(theme).title}>🔥 Longest Streak</Text>
      <TouchableOpacity
        onPress={() => {
          if (longestStreakTask) {
            navigation.navigate('TaskDetails', { taskId: longestStreakTask.task_id.toString() });
          }
        }}
        activeOpacity={0.8}
      >
        <View style={getStyles(theme).streakContainer}>
          <Text style={getStyles(theme).streakTitle}>{longestStreakTask.task_name}</Text>
          <Text style={getStyles(theme).streakDays}>{longestStreakTask.longest_streak} days</Text>
          <Text style={getStyles(theme).lastCompleted}>
            Last completed: {longestStreakTask.last_completed_date ? 'Today' : 'Never'}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <StreakCalendar completedDates={completedDates} />
        <ProgressBarSection completedToday={completedToday} totalToday={totalToday} completedWeek={completedWeek} totalWeek={totalWeek} />
        <CompletionRateChart completionRate={completionRate} />
      </View>
      <TouchableOpacity
        style={getStyles(theme).button}
        onPress={() => navigation.navigate('Tasks')}
      >
        <Text style={getStyles(theme).buttonText}>View Your Streaks</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Refactor styles into a function that takes the theme
const getStyles = (theme: Theme) => StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  },
  streakContainer: {
    backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme === 'dark' ? 0.5 : 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: theme === 'dark' ? '#333' : 'transparent',
    borderWidth: theme === 'dark' ? 1 : 0,
  },
  streakTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  },
  streakDays: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  lastCompleted: {
    fontSize: 14,
    color: theme === 'dark' ? '#bbbbbb' : '#666',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
