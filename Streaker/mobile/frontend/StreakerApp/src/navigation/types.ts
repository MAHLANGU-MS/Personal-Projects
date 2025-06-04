import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  TabNavigator: undefined;
  TaskDetails: { taskId: string };
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Settings: undefined;
};

export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
export type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type TaskDetailsRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

export type IconName = 'home' | 'home-outline' | 'list' | 'list-outline' | 'person' | 'person-outline' | 'settings' | 'settings-outline';

export type NavigationProps = NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;
