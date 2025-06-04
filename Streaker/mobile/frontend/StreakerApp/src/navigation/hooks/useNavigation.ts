import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, TaskDetailsRouteProp, NavigationProps } from '../types';

export const useAppNavigation = () => {
  return useNavigation<NavigationProps>();
};

export const useTaskDetailsRoute = () => {
  return useRoute<TaskDetailsRouteProp>();
};
