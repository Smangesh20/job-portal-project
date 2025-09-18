import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Text, SafeAreaView, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeIn, FadeOut, SlideInUp, SlideInDown } from 'react-native-reanimated'

import { store } from './src/store/store'
import { AuthProvider } from './src/contexts/AuthContext'
import { NotificationProvider } from './src/contexts/NotificationContext'
import { ThemeProvider } from './src/contexts/ThemeContext'
import { QuantumSecurityProvider } from './src/contexts/QuantumSecurityContext'
import { TranscendenceProvider } from './src/contexts/TranscendenceContext'

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen'
import DashboardScreen from './src/screens/DashboardScreen'
import JobSearchScreen from './src/screens/JobSearchScreen'
import JobDetailsScreen from './src/screens/JobDetailsScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import NotificationsScreen from './src/screens/NotificationsScreen'
import MessagesScreen from './src/screens/MessagesScreen'
import ApplicationsScreen from './src/screens/ApplicationsScreen'
import SavedJobsScreen from './src/screens/SavedJobsScreen'
import CompanyProfileScreen from './src/screens/CompanyProfileScreen'
import AIInsightsScreen from './src/screens/AIInsightsScreen'
import TranscendenceScreen from './src/screens/TranscendenceScreen'
import QuantumSecurityScreen from './src/screens/QuantumSecurityScreen'
import OfflineScreen from './src/screens/OfflineScreen'

// Components
import LoadingSpinner from './src/components/LoadingSpinner'
import NetworkStatus from './src/components/NetworkStatus'
import QuantumSecurityIndicator from './src/components/QuantumSecurityIndicator'
import TranscendenceIndicator from './src/components/TranscendenceIndicator'

// Types
import { RootStackParamList, TabParamList, DrawerParamList } from './src/types/navigation'
import { Theme } from './src/types/theme'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()
const Drawer = createDrawerNavigator<DrawerParamList>()

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

// Tab Navigator Component
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'JobSearch') {
            iconName = focused ? 'search' : 'search-outline'
          } else if (route.name === 'Applications') {
            iconName = focused ? 'briefcase' : 'briefcase-outline'
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          } else {
            iconName = 'circle'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="JobSearch" 
        component={JobSearchScreen}
        options={{ title: 'Find Jobs' }}
      />
      <Tab.Screen 
        name="Applications" 
        component={ApplicationsScreen}
        options={{ title: 'Applications' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  )
}

// Drawer Navigator Component
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: 'white',
        },
        drawerActiveTintColor: '#6366f1',
        drawerInactiveTintColor: 'gray',
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ title: 'Ask Ya Cham', headerShown: false }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="SavedJobs" 
        component={SavedJobsScreen}
        options={{ 
          title: 'Saved Jobs',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="AIInsights" 
        component={AIInsightsScreen}
        options={{ 
          title: 'AI Insights',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Transcendence" 
        component={TranscendenceScreen}
        options={{ 
          title: 'Transcendence',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="QuantumSecurity" 
        component={QuantumSecurityScreen}
        options={{ 
          title: 'Quantum Security',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        })

        // Initialize app
        await initializeApp()
      } catch (error) {
        console.warn('Error preparing app:', error)
      } finally {
        setIsLoading(false)
        await SplashScreen.hideAsync()
      }
    }

    prepare()
  }, [])

  const initializeApp = async () => {
    // Initialize quantum security
    // Initialize transcendence system
    // Check authentication status
    // Load user preferences
    // Initialize notifications
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#d946ef']}
          style={styles.gradient}
        >
          <Animated.View 
            entering={FadeIn.duration(1000)}
            style={styles.loadingContent}
          >
            <Text style={styles.appName}>Ask Ya Cham</Text>
            <Text style={styles.tagline}>Revolutionary AI Job Matching</Text>
            <LoadingSpinner size="large" color="white" />
          </Animated.View>
        </LinearGradient>
      </View>
    )
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <QuantumSecurityProvider>
                <TranscendenceProvider>
                  <NavigationContainer>
                    <SafeAreaView style={styles.container}>
                      <StatusBar style="light" backgroundColor="#6366f1" />
                      
                      {/* Network Status Indicator */}
                      <NetworkStatus />
                      
                      {/* Quantum Security Indicator */}
                      <QuantumSecurityIndicator />
                      
                      {/* Transcendence Indicator */}
                      <TranscendenceIndicator />
                      
                      <Stack.Navigator
                        screenOptions={{
                          headerStyle: {
                            backgroundColor: '#6366f1',
                          },
                          headerTintColor: 'white',
                          headerTitleStyle: {
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        {!isAuthenticated ? (
                          // Authentication Stack
                          <>
                            <Stack.Screen 
                              name="Welcome" 
                              component={WelcomeScreen}
                              options={{ headerShown: false }}
                            />
                            <Stack.Screen 
                              name="Login" 
                              component={LoginScreen}
                              options={{ title: 'Sign In' }}
                            />
                            <Stack.Screen 
                              name="Register" 
                              component={RegisterScreen}
                              options={{ title: 'Create Account' }}
                            />
                            <Stack.Screen 
                              name="ForgotPassword" 
                              component={ForgotPasswordScreen}
                              options={{ title: 'Reset Password' }}
                            />
                          </>
                        ) : (
                          // Main App Stack
                          <>
                            <Stack.Screen 
                              name="MainDrawer" 
                              component={DrawerNavigator}
                              options={{ headerShown: false }}
                            />
                            <Stack.Screen 
                              name="JobDetails" 
                              component={JobDetailsScreen}
                              options={{ title: 'Job Details' }}
                            />
                            <Stack.Screen 
                              name="CompanyProfile" 
                              component={CompanyProfileScreen}
                              options={{ title: 'Company Profile' }}
                            />
                            <Stack.Screen 
                              name="Offline" 
                              component={OfflineScreen}
                              options={{ headerShown: false }}
                            />
                          </>
                        )}
                      </Stack.Navigator>
                    </SafeAreaView>
                  </NavigationContainer>
                </TranscendenceProvider>
              </QuantumSecurityProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 40,
    textAlign: 'center',
  },
})
