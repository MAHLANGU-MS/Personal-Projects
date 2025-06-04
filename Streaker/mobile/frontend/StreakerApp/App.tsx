import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './src/navigation';
import { TaskProvider } from './src/contexts/TaskContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}
