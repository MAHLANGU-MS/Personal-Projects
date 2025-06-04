import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SettingsScreen } from '../src/screens/Settings/index';

export default function SettingsRoute() {
  return <SettingsScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
