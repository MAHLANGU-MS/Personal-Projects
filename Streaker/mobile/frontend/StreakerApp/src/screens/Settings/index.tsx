import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme, Theme } from '../../contexts/ThemeContext';

export const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={getStyles(theme).container}>
      <Text style={getStyles(theme).title}>Settings</Text>

      <View style={getStyles(theme).section}>
        <Text style={getStyles(theme).sectionTitle}>Appearance</Text>
        <View style={getStyles(theme).settingItem}>
          <Text style={getStyles(theme).settingLabel}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#ccc', true: '#2196F3' }}
            thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={getStyles(theme).section}>
        <Text style={getStyles(theme).sectionTitle}>About</Text>
        <TouchableOpacity style={getStyles(theme).aboutItem}>
          <Text style={getStyles(theme).aboutText}>Version 1.0.0</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Theme-aware styles
const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: theme === 'dark' ? '#e0e0e0' : '#1a1a1a',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme === 'dark' ? '#bbbbbb' : '#4a4a4a',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    color: theme === 'dark' ? '#e0e0e0' : '#1a1a1a',
  },
  aboutItem: {
    paddingVertical: 15,
    backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aboutText: {
    fontSize: 16,
    color: theme === 'dark' ? '#bbbbbb' : '#4a4a4a',
    textAlign: 'center',
  },
});
