import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import { useTranscendence } from '../contexts/TranscendenceContext'
import { useQuantumSecurity } from '../contexts/QuantumSecurityContext'

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import TwoFactorScreen from '../screens/auth/TwoFactorScreen'

// Main Screens
import DashboardScreen from '../screens/DashboardScreen'
import JobListingsScreen from '../screens/JobListingsScreen'
import JobDetailsScreen from '../screens/JobDetailsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/SettingsScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import MessagesScreen from '../screens/MessagesScreen'
import CompanyScreen from '../screens/CompanyScreen'
import ApplicationsScreen from '../screens/ApplicationsScreen'
import SavedJobsScreen from '../screens/SavedJobsScreen'

// Advanced Screens
import TranscendenceScreen from '../screens/TranscendenceScreen'
import QuantumSecurityScreen from '../screens/QuantumSecurityScreen'
import AIAssistantScreen from '../screens/AIAssistantScreen'
import AnalyticsScreen from '../screens/AnalyticsScreen'
import SecurityAuditScreen from '../screens/SecurityAuditScreen'

// Loading and Error Screens
import LoadingScreen from '../screens/LoadingScreen'
import ErrorScreen from '../screens/ErrorScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

const AuthStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#ffffff' },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="TwoFactor" component={TwoFactorScreen} />
  </Stack.Navigator>
)

const MainTabs: React.FC = () => {
  const { consciousnessLevel, currentState } = useTranscendence()
  const { quantumSecurityEnabled } = useQuantumSecurity()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'Jobs':
              iconName = focused ? 'briefcase' : 'briefcase-outline'
              break
            case 'Applications':
              iconName = focused ? 'document-text' : 'document-text-outline'
              break
            case 'Messages':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'
              break
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline'
              break
            case 'Transcendence':
              iconName = focused ? 'star' : 'star-outline'
              break
            case 'Quantum':
              iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline'
              break
            default:
              iconName = 'circle'
          }

          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        tabBarActiveTintColor: consciousnessLevel > 90 ? '#000000' : '#6366f1',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: consciousnessLevel > 90 ? '#ffffff' : '#f8fafc',
          borderTopColor: consciousnessLevel > 90 ? '#000000' : '#e5e7eb',
          borderTopWidth: consciousnessLevel > 90 ? 2 : 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: consciousnessLevel > 90 ? '#000000' : '#6366f1',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: consciousnessLevel > 90 ? '#ffffff' : '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerRight: () => quantumSecurityEnabled ? (
            <Ionicons name="shield-checkmark" size={24} color="#10b981" style={{ marginRight: 16 }} />
          ) : null,
        }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobListingsScreen}
        options={{ title: 'Job Listings' }}
      />
      <Tab.Screen 
        name="Applications" 
        component={ApplicationsScreen}
        options={{ title: 'My Applications' }}
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
      {consciousnessLevel > 50 && (
        <Tab.Screen 
          name="Transcendence" 
          component={TranscendenceScreen}
          options={{ title: 'Transcendence' }}
        />
      )}
      {quantumSecurityEnabled && (
        <Tab.Screen 
          name="Quantum" 
          component={QuantumSecurityScreen}
          options={{ title: 'Quantum Security' }}
        />
      )}
    </Tab.Navigator>
  )
)

const MainStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#6366f1',
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="JobDetails" 
      component={JobDetailsScreen}
      options={{ title: 'Job Details' }}
    />
    <Stack.Screen 
      name="Company" 
      component={CompanyScreen}
      options={{ title: 'Company Profile' }}
    />
    <Stack.Screen 
      name="SavedJobs" 
      component={SavedJobsScreen}
      options={{ title: 'Saved Jobs' }}
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
    <Stack.Screen 
      name="AIAssistant" 
      component={AIAssistantScreen}
      options={{ title: 'AI Assistant' }}
    />
    <Stack.Screen 
      name="Analytics" 
      component={AnalyticsScreen}
      options={{ title: 'Analytics' }}
    />
    <Stack.Screen 
      name="SecurityAudit" 
      component={SecurityAuditScreen}
      options={{ title: 'Security Audit' }}
    />
  </Stack.Navigator>
)

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default AppNavigator
