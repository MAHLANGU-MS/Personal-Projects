import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface StreakCalendarProps {
  completedDates: string[]; // Array of YYYY-MM-DD strings
  theme?: any;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ completedDates, theme }) => {
  // Mark completed dates
  const markedDates = completedDates.reduce((acc, date) => {
    acc[date] = {
      customStyles: {
        container: {
          backgroundColor: '#2196F3',
          borderRadius: 8,
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    };
    return acc;
  }, {} as any);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Streak Calendar</Text>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        hideExtraDays
        theme={theme}
        style={styles.calendar}
      />
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
  calendar: {
    borderRadius: 12,
    width: 320,
    elevation: 2,
  },
}); 