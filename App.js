import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { COLORS, FONTS } from './src/constants/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TransactionProvider } from './src/context/TransactionContext';

// Import screens
import Dashboard from './src/screens/Dashboard';
import Expense from './src/screens/Expense';
import Income from './src/screens/Income';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainApp({ navigation }) {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentScreen}</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              // Still attempt to navigate to login screen even if signOut fails
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }}
        >
          <MaterialCommunityIcons name="logout" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
      
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#64748B',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Dashboard':
                iconName = 'home';
                break;
              case 'Income':
                iconName = 'chart-timeline-variant';
                break;
              case 'Expense':
                iconName = 'wallet';
                break;
            }

            return (
              <View style={styles.tabItemContainer}>
                <MaterialCommunityIcons 
                  name={iconName} 
                  size={24} 
                  color={focused ? COLORS.primary : '#64748B'} 
                />
              </View>
            );
          },
        })}
        screenListeners={{
          state: (e) => {
            const currentRouteName = e.data.state.routes[e.data.state.index].name;
            setCurrentScreen(currentRouteName);
          },
        }}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Income" component={Income} />
        <Tab.Screen name="Expense" component={Expense} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

// Loading screen while checking authentication
function AuthLoadingScreen() {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  
  return null;
}

// App with Auth Provider
function AppWithAuth() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <AuthLoadingScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "MainApp" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <TransactionProvider>
            <AppWithAuth />
          </TransactionProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  logoutButton: {
    padding: 8,
  },
  tabBar: {
    height: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
  },
  tabItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});