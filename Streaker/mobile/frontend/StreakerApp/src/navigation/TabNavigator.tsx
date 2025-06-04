import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/Home';
import { TaskListScreen } from '../screens/TaskList';
import { IconName } from './types';
import { SettingsScreen } from '../screens/Settings';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconNames: Record<string, IconName> = {
            Home: focused ? 'home' : 'home-outline',
            Tasks: focused ? 'list' : 'list-outline',
            Settings: focused ? 'settings' : 'settings-outline',
            Profile: focused ? 'person' : 'person-outline',
          };

          const iconName = iconNames[route.name as keyof typeof iconNames];

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TaskListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
