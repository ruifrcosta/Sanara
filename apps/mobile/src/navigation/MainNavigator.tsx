import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dashboard } from '../screens/Dashboard';
import { Appointments } from '../screens/Appointments';
import { HealthProfile } from '../screens/HealthProfile';
import { Medications } from '../screens/Medications';
import { Records } from '../screens/Records';
import { theme } from '../theme';

export type MainTabParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  HealthProfile: undefined;
  Medications: undefined;
  Records: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: 18,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          title: 'Início',
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={Appointments}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
          title: 'Consultas',
        }}
      />
      <Tab.Screen
        name="HealthProfile"
        component={HealthProfile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
          title: 'Perfil',
        }}
      />
      <Tab.Screen
        name="Medications"
        component={Medications}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="pill" color={color} size={size} />
          ),
          title: 'Medicamentos',
        }}
      />
      <Tab.Screen
        name="Records"
        component={Records}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-document" color={color} size={size} />
          ),
          title: 'Prontuário',
        }}
      />
    </Tab.Navigator>
  );
}; 