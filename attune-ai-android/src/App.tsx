import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  useColorScheme,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppStore } from '@stores/appStore';
import { authService } from '@services/firebase';
import { Colors } from '@constants/colors';

// Screens
import SplashScreen from '@screens/SplashScreen';
import LoginScreen from '@screens/LoginScreen';
import SignUpScreen from '@screens/SignUpScreen';
import HomeScreen from '@screens/HomeScreen';
import SkillsScreen from '@screens/SkillsScreen';
import SparringScreen from '@screens/SparringScreen';
import ProgressScreen from '@screens/ProgressScreen';
import SettingsScreen from '@screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.ink,
        },
        headerTintColor: Colors.secondary,
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.text,
        },
        cardStyle: {
          backgroundColor: Colors.ink,
        },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Sparring"
        component={SparringScreen}
        options={{
          title: 'AI Sparring',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

const SkillsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.ink,
        },
        headerTintColor: Colors.secondary,
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.text,
        },
        cardStyle: {
          backgroundColor: Colors.ink,
        },
      }}
    >
      <Stack.Screen
        name="SkillsMain"
        component={SkillsScreen}
        options={{
          title: 'Skills',
        }}
      />
    </Stack.Navigator>
  );
};

const ProgressStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.ink,
        },
        headerTintColor: Colors.secondary,
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.text,
        },
        cardStyle: {
          backgroundColor: Colors.ink,
        },
      }}
    >
      <Stack.Screen
        name="ProgressMain"
        component={ProgressScreen}
        options={{
          title: 'Progress',
        }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.ink,
        },
        headerTintColor: Colors.secondary,
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.text,
        },
        cardStyle: {
          backgroundColor: Colors.ink,
        },
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'SkillsTab') {
            iconName = 'lightning-bolt';
          } else if (route.name === 'ProgressTab') {
            iconName = 'chart-line';
          } else if (route.name === 'SettingsTab') {
            iconName = 'cog';
          }

          return <MaterialCommunityIcons name={iconName || 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="SkillsTab"
        component={SkillsStack}
        options={{
          title: 'Skills',
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressStack}
        options={{
          title: 'Progress',
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const { isAuthenticated, user, loadUserProfile } = useAppStore();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const subscriber = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await loadUserProfile(firebaseUser.uid);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
      setInitializing(false);
    });

    return subscriber;
  }, [loadUserProfile]);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated && user ? (
        <AppTabs />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{
              animationEnabled: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Colors.ink} />
      <RootNavigator />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
