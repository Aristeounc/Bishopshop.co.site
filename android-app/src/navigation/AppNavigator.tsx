import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography } from '@/theme';

import { SplashScreen } from '@/screens/SplashScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { SkillsScreen } from '@/screens/SkillsScreen';
import { SparringScreen } from '@/screens/SparringScreen';
import { ProgressScreen } from '@/screens/ProgressScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { DailyProgramScreen } from '@/screens/DailyProgramScreen';
import { SpotInfluenceScreen } from '@/screens/SpotInfluenceScreen';
import { ConversationAutopsyScreen } from '@/screens/ConversationAutopsyScreen';
import { SubtextTranslatorScreen } from '@/screens/SubtextTranslatorScreen';
import { EscalationGauntletScreen } from '@/screens/EscalationGauntletScreen';
import { TacticForecastScreen } from '@/screens/TacticForecastScreen';
import { ParentDashboardScreen } from '@/screens/ParentDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Skills"
        component={SkillsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Program"
        component={DailyProgramScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Daily',
        }}
      />
      <Tab.Screen
        name="Sparring"
        component={SparringScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="sword-cross" size={size} color={color} />
          ),
          tabBarLabel: 'Spar',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="SpotInfluence"
          component={SpotInfluenceScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ConversationAutopsy"
          component={ConversationAutopsyScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="SubtextTranslator"
          component={SubtextTranslatorScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="EscalationGauntlet"
          component={EscalationGauntletScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="TacticForecast"
          component={TacticForecastScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ParentDashboard"
          component={ParentDashboardScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
