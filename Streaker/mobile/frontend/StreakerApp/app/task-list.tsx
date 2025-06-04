import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TaskListScreen } from '../src/screens/TaskList';

export default function TaskListRoute() {
  return <TaskListScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
