import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

interface ProgressBarSectionProps {
  completedToday: number;
  totalToday: number;
  completedWeek: number;
  totalWeek: number;
}

export const ProgressBarSection: React.FC<ProgressBarSectionProps> = ({ completedToday, totalToday, completedWeek, totalWeek }) => {
  const todayProgress = totalToday > 0 ? completedToday / totalToday : 0;
  const weekProgress = totalWeek > 0 ? completedWeek / totalWeek : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Progress</Text>
      <Progress.Bar progress={todayProgress} width={280} color="#2196F3" borderRadius={8} height={14} />
      <Text style={styles.label}>{completedToday} / {totalToday} completed</Text>
      <Text style={[styles.title, { marginTop: 16 }]}>This Week's Progress</Text>
      <Progress.Bar progress={weekProgress} width={280} color="#4CAF50" borderRadius={8} height={14} />
      <Text style={styles.label}>{completedWeek} / {totalWeek} completed</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2196F3',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
}); 