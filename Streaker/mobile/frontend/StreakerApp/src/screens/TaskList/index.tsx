import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Modal, Button, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { Task, useTasks } from '../../contexts/TaskContext';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, Theme } from '../../contexts/ThemeContext';

export type SortCriteria = 'currentStreak' | 'longestStreak';
export type SortDirection = 'asc' | 'desc';
export interface AppliedSort {
  criteria: SortCriteria;
  direction: SortDirection;
}

export const TaskListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    calculateCurrentStreak, 
    calculateDaysSinceCompletion, 
    isDateTodayUTC,
    calculateLongestStreak,
    addTask
  } = useTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'broken' | 'completedToday' | 'notCompletedToday'>('all');
  
  // State for sorting
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [selectedSortCriteriaInModal, setSelectedSortCriteriaInModal] = useState<SortCriteria | null>(null);
  const [selectedSortDirectionInModal, setSelectedSortDirectionInModal] = useState<SortDirection>('desc');
  const [appliedSort, setAppliedSort] = useState<AppliedSort | null>(null);

  // Add state for filter modal
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilterInModal, setSelectedFilterInModal] = useState(selectedFilter);

  // Count active filters (not 'all')
  const filterCount = selectedFilter !== 'all' ? 1 : 0;

  // Add state for add modal
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStartDate, setNewTaskStartDate] = useState('');
  const [newTaskLastCompletedDate, setNewTaskLastCompletedDate] = useState('');
  const [showAddDatePicker, setShowAddDatePicker] = useState(false);
  const [showAddLastCompletedDatePicker, setShowAddLastCompletedDatePicker] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Use the useTheme hook to access the current theme
  const { theme } = useTheme();

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('TaskList screen focused, refreshing data');
      // When the screen focuses, if a sort is applied, we want to ensure tasks are fetched
      // and then the existing appliedSort will re-process them.
      // If filters change, processedTasks also re-evaluates.
      fetchTasks(); 
      return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // fetchTasks can be added if it's stable, but often causes loops if not memoized itself.
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTasks();
    } finally {
      setRefreshing(false);
    }
  }, [fetchTasks]);

  const handleApplySort = () => {
    if (selectedSortCriteriaInModal) {
      setAppliedSort({
        criteria: selectedSortCriteriaInModal,
        direction: selectedSortDirectionInModal,
      });
    }
    setIsSortModalVisible(false);
  };

  const handleClearSort = () => {
    setAppliedSort(null);
    setSelectedSortCriteriaInModal(null); // Reset modal state too
    setSelectedSortDirectionInModal('desc');
    setIsSortModalVisible(false);
  };

  const handleApplyFilter = () => {
    setSelectedFilter(selectedFilterInModal);
    setIsFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedFilter('all');
    setSelectedFilterInModal('all');
    setIsFilterModalVisible(false);
  };

  const handleOpenAddModal = () => {
    setNewTaskName('');
    setNewTaskDescription('');
    setNewTaskStartDate('');
    setNewTaskLastCompletedDate('');
    setAddError(null);
    setIsAddModalVisible(true);
  };

  const handleAddTask = async () => {
    if (!newTaskName || !newTaskStartDate || !newTaskLastCompletedDate) {
      setAddError('Task name, start date, and last completion date are required');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      const created = await addTask({
        user_id: 1, // Dummy value to satisfy type checker
        task_name: newTaskName,
        task_description: newTaskDescription,
        start_date: newTaskStartDate,
        is_active: true,
        current_streak: 0,
        longest_streak: 0,
        last_completed_date: newTaskLastCompletedDate,
        total_completions: 0,
      });
      if (created) {
        setIsAddModalVisible(false);
      } else {
        setAddError('Failed to create task');
      }
    } catch (err) {
      setAddError('Failed to create task');
    } finally {
      setAddLoading(false);
    }
  };

  const processedTasks = useMemo(() => {
    // 1. Filtering (as before)
    let filtered = tasks;
    if (selectedFilter !== 'all') {
      filtered = tasks.filter(task => {
        const currentStreak = calculateCurrentStreak(task);
        if (selectedFilter === 'active') {
          return currentStreak > 0;
        }
        if (selectedFilter === 'broken') {
          return currentStreak === 0;
        }
        if (selectedFilter === 'completedToday') {
          return isDateTodayUTC(task.last_completed_date);
        }
        if (selectedFilter === 'notCompletedToday') {
          return !isDateTodayUTC(task.last_completed_date);
        }
        return true; 
      });
    }

    // 2. Sorting (to be implemented based on appliedSort)
    if (appliedSort) {
      const { criteria, direction } = appliedSort;
      // Create a mutable copy for sorting
      const sortableTasks = [...filtered]; 
      sortableTasks.sort((a, b) => {
        let valA: number, valB: number;
        if (criteria === 'currentStreak') {
          valA = calculateCurrentStreak(a);
          valB = calculateCurrentStreak(b);
        } else { // longestStreak
          // Assuming task object has longest_streak, otherwise use calculateLongestStreak
          valA = a.longest_streak ?? calculateLongestStreak(a); 
          valB = b.longest_streak ?? calculateLongestStreak(b);
        }

        return direction === 'asc' ? valA - valB : valB - valA;
      });
      return sortableTasks;
    }

    return filtered; // Return filtered (but not sorted) if no sort is applied
  }, [tasks, selectedFilter, appliedSort, calculateCurrentStreak, isDateTodayUTC, calculateLongestStreak]);

  const renderTaskItem = ({ item }: { item: Task }) => {
    const currentStreak = calculateCurrentStreak(item);
    let streakDisplayContent;
    let textStyle = getStyles(theme).streakText;

    if (currentStreak > 0) {
      streakDisplayContent = (
        <>
          <Text style={getStyles(theme).streakCount}>{currentStreak}</Text>
          <Text>{` ${currentStreak === 1 ? 'day' : 'days'} streak`}</Text>
        </>
      );
    } else {
      const daysSince = calculateDaysSinceCompletion(item);
      textStyle = getStyles(theme).brokenStreakText;
      streakDisplayContent = (
        <>
          <Text style={getStyles(theme).streakCountRed}>{daysSince}</Text>
          <Text>{` ${daysSince === 1 ? 'day' : 'days'} since last completion`}</Text>
        </>
      );
    }

    return (
      <TouchableOpacity
        style={getStyles(theme).taskItem}
        onPress={() => navigation.navigate('TaskDetails', { taskId: item.task_id.toString() })}
      >
        <View style={getStyles(theme).taskInfo}>
          <Text style={getStyles(theme).taskName}>{item.task_name}</Text>
          <Text style={textStyle}>
            {streakDisplayContent}
          </Text>
          <Text style={getStyles(theme).lastCompleted}>
            Last completed: {item.last_completed_date
            ? new Date(item.last_completed_date).toLocaleDateString()
            : 'Never'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
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
        <TouchableOpacity style={getStyles(theme).refreshButton} onPress={onRefresh}>
          <Text style={getStyles(theme).refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={getStyles(theme).container}>
      <Text style={getStyles(theme).title}>Your Streaks</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <TouchableOpacity
          style={getStyles(theme).actionButton}
          onPress={() => setIsSortModalVisible(true)}
        >
          <Text style={getStyles(theme).actionButtonText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getStyles(theme).actionButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Text style={getStyles(theme).actionButtonText}>Filter{filterCount ? ` (${filterCount})` : ''}</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={processedTasks}
        keyExtractor={(item) => item.task_id.toString()}
        renderItem={renderTaskItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={getStyles(theme).list}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={getStyles(theme).fab}
        onPress={handleOpenAddModal}
        activeOpacity={0.8}
      >
        <View style={getStyles(theme).fabBubble}>
          <FontAwesome name="plus" size={28} color="#fff" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={getStyles(theme).modalOverlay}>
          <View style={[getStyles(theme).modalContent, { alignSelf: 'flex-start' }]}> {/* Slide from left */}
            <TouchableOpacity
              style={getStyles(theme).modalCloseButton}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <FontAwesome name="times" size={20} color="#555" />
            </TouchableOpacity>
            <Text style={getStyles(theme).modalTitle}>Filter Tasks</Text>
            <View style={getStyles(theme).radioGroup}>
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'broken', label: 'Broken' },
                { key: 'completedToday', label: 'Done Today' },
                { key: 'notCompletedToday', label: 'Not Done' },
              ].map(option => (
                <View key={option.key}>
                  <TouchableOpacity
                    style={getStyles(theme).radioOption}
                    onPress={() => setSelectedFilterInModal(option.key as typeof selectedFilterInModal)}
                    activeOpacity={0.7}
                  >
                    <View style={getStyles(theme).radioCircleOuter}>
                      {selectedFilterInModal === option.key && <View style={getStyles(theme).radioCircleInner} />}
                    </View>
                    <Text style={getStyles(theme).radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                  <View style={getStyles(theme).radioSeparator} />
                </View>
              ))}
            </View>
            <View style={getStyles(theme).modalActionsContainer}>
              <Button title="Clear Filter" onPress={handleClearFilter} color="gray" />
              <Button title="Apply Filter" onPress={handleApplyFilter} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={() => {
          setIsSortModalVisible(false);
        }}
      >
        <View style={getStyles(theme).modalOverlay}>
          <View style={getStyles(theme).modalContent}>
            <TouchableOpacity
              style={getStyles(theme).modalCloseButton}
              onPress={() => setIsSortModalVisible(false)}
            >
              <FontAwesome name="times" size={22} color="#555" />
            </TouchableOpacity>
            <Text style={getStyles(theme).modalTitle}>Sort Tasks</Text>
            <Text style={getStyles(theme).modalSectionTitle}>Sort By:</Text>
            <View style={getStyles(theme).radioGroup}>
              {[
                { key: 'currentStreak', label: 'Current Streak' },
                { key: 'longestStreak', label: 'Longest Streak' },
              ].map(option => (
                <View key={option.key}>
                  <TouchableOpacity
                    style={getStyles(theme).radioOption}
                    onPress={() => setSelectedSortCriteriaInModal(option.key as SortCriteria)}
                    activeOpacity={0.7}
                  >
                    <View style={getStyles(theme).radioCircleOuter}>
                      {selectedSortCriteriaInModal === option.key && <View style={getStyles(theme).radioCircleInner} />}
                    </View>
                    <Text style={getStyles(theme).radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                  <View style={getStyles(theme).radioSeparator} />
                </View>
              ))}
            </View>

            <Text style={getStyles(theme).modalSectionTitle}>Direction:</Text>
            <View style={getStyles(theme).radioGroup}>
              {[
                { key: 'desc', label: 'High to Low' },
                { key: 'asc', label: 'Low to High' },
              ].map(option => (
                <View key={option.key}>
                  <TouchableOpacity
                    style={getStyles(theme).radioOption}
                    onPress={() => setSelectedSortDirectionInModal(option.key as SortDirection)}
                    activeOpacity={0.7}
                  >
                    <View style={getStyles(theme).radioCircleOuter}>
                      {selectedSortDirectionInModal === option.key && <View style={getStyles(theme).radioCircleInner} />}
                    </View>
                    <Text style={getStyles(theme).radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                  <View style={getStyles(theme).radioSeparator} />
                </View>
              ))}
            </View>

            <View style={getStyles(theme).modalActionsContainer}>
              <Button title="Clear Sort" onPress={handleClearSort} color="gray" />
              <Button title="Apply Sort" onPress={handleApplySort} disabled={!selectedSortCriteriaInModal} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={getStyles(theme).modalOverlay}>
          <View style={getStyles(theme).modalContent}>
            <TouchableOpacity
              style={getStyles(theme).modalCloseButton}
              onPress={() => setIsAddModalVisible(false)}
            >
              <FontAwesome name="times" size={22} color="#555" />
            </TouchableOpacity>
            <Text style={getStyles(theme).modalTitle}>Add New Task</Text>
            {addError && <Text style={getStyles(theme).errorText}>{addError}</Text>}
            <TextInput
              style={getStyles(theme).input}
              placeholder="Task Name"
              placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <TextInput
              style={[getStyles(theme).input, { minHeight: 60 }]}
              placeholder="Task Description (optional)"
              placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
            />
            <TouchableOpacity
              style={getStyles(theme).input}
              onPress={() => setShowAddDatePicker(true)}
            >
              <Text style={{ color: newTaskStartDate ? (theme === 'dark' ? '#e0e0e0' : '#333') : (theme === 'dark' ? '#888' : '#aaa') }}>
                {newTaskStartDate ? new Date(newTaskStartDate).toLocaleDateString() : 'Select Start Date'}
              </Text>
            </TouchableOpacity>
            {/* Show calculated streaks as non-editable */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <View>
                <Text style={{ color: '#888', fontSize: 14 }}>Current Streak</Text>
                <Text style={{ color: '#2196F3', fontWeight: 'bold', fontSize: 16 }}>0</Text>
              </View>
              <View>
                <Text style={{ color: '#888', fontSize: 14 }}>Longest Streak</Text>
                <Text style={{ color: '#2196F3', fontWeight: 'bold', fontSize: 16 }}>0</Text>
              </View>
            </View>
            {/* Date Picker */}
            {showAddDatePicker && (
              <DateTimePicker
                value={newTaskStartDate ? new Date(newTaskStartDate) : new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowAddDatePicker(false);
                  if (event.type === 'set' && date) {
                    // Format as YYYY-MM-DD
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    setNewTaskStartDate(`${year}-${month}-${day}`);
                  }
                }}
              />
            )}
            {/* In the Add Task Modal UI, add a date picker for last completion date */}
            <TouchableOpacity
              style={getStyles(theme).input}
              onPress={() => setShowAddLastCompletedDatePicker(true)}
            >
              <Text style={{ color: newTaskLastCompletedDate ? (theme === 'dark' ? '#e0e0e0' : '#333') : (theme === 'dark' ? '#888' : '#aaa') }}>
                {newTaskLastCompletedDate ? new Date(newTaskLastCompletedDate).toLocaleDateString() : 'Select Last Completion Date'}
              </Text>
            </TouchableOpacity>
            {showAddLastCompletedDatePicker && (
              <DateTimePicker
                value={newTaskLastCompletedDate ? new Date(newTaskLastCompletedDate) : new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowAddLastCompletedDatePicker(false);
                  if (event.type === 'set' && date) {
                    // Format as YYYY-MM-DD
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    setNewTaskLastCompletedDate(`${year}-${month}-${day}`);
                  }
                }}
              />
            )}
            {/* Modal Actions */}
            <View style={getStyles(theme).modalActionsContainer}>
              <Button title="Cancel" color="#888" onPress={() => setIsAddModalVisible(false)} />
              <Button title={addLoading ? 'Adding...' : 'Confirm'} color="#2196F3" onPress={handleAddTask} disabled={addLoading} />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

// Refactor styles into a function that takes the theme
const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    padding: 20,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
    textAlign: 'center',
  },
  list: {
    padding: 10,
    width: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    // Adjust background and border color based on theme
    backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0',
    minWidth: 70,
    alignItems: 'center',
    borderColor: theme === 'dark' ? '#555' : 'transparent',
    borderWidth: theme === 'dark' ? 1 : 0,
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskItem: {
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme === 'dark' ? 0.5 : 0.25, // Adjust shadow opacity
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    borderColor: theme === 'dark' ? '#333' : 'transparent', // Add subtle border
    borderWidth: theme === 'dark' ? 1 : 0,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
    marginBottom: 5,
  },
  streakText: {
    color: '#2196F3',
    fontSize: 14,
    marginBottom: 5,
  },
  brokenStreakText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  streakCount: {
    fontWeight: 'bold',
    fontSize: 16,
    // Adjust text color for streak count based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  },
  streakCountRed: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'red',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  lastCompleted: {
    // Adjust text color based on theme
    color: theme === 'dark' ? '#bbbbbb' : '#666',
    fontSize: 14,
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sortButton: {
    padding: 10,
  },
  sortButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalContent: {
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
    width: '80%',
    height: '100%',
    padding: 20,
    paddingTop: 40,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 10,
    zIndex: 1,
  },
  modalCloseButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    // Adjust text color based on theme
    color: theme === 'dark' ? '#bbb' : '#555',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  },
  modalOptionGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  modalOptionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    // Adjust background and border color based on theme
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#555' : '#ddd',
  },
  modalOptionButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#007bff',
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: '500',
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#000',
  },
  modalActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0',
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme === 'dark' ? '#555' : 'transparent', // Add subtle border
    borderWidth: theme === 'dark' ? 1 : 0,
  },
  actionButtonText: {
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  radioGroup: {
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
  radioCircleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    // Adjust border color based on theme
    borderColor: theme === 'dark' ? '#bbb' : '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  radioLabel: {
    fontSize: 16,
    // Adjust text color based on theme
    color: theme === 'dark' ? '#e0e0e0' : '#333',
    fontWeight: '500',
  },
  radioSeparator: {
    height: 1,
    // Adjust background color based on theme
    backgroundColor: theme === 'dark' ? '#333' : '#eee',
    marginLeft: 0,
    marginRight: 0,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 10,
  },
  fabBubble: {
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.5 : 0.3, // Adjust shadow opacity
    shadowRadius: 4,
    elevation: 8,
  },
  input: {
    // Adjust background and text color based on theme
    backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
    color: theme === 'dark' ? '#e0e0e0' : '#333',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#555' : '#ddd',
  },
});
