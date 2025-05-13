import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, Divider, PaperProvider, Text } from 'react-native-paper';
import { COLORS, FONTS, SPACING } from './src/constants/theme';
import { TransactionProvider } from './src/context/TransactionContext';

// Import screens
import Dashboard from './src/screens/Dashboard';
import Expense from './src/screens/Expense';
import Income from './src/screens/Income';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

function CustomDrawerContent({ navigation }) {
  const drawerItems = [
    { name: 'Dashboard', icon: 'view-dashboard' },
    { name: 'Income', icon: 'cash-plus' },
    { name: 'Expense', icon: 'cash-minus' },
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Expancy</Text>
      </View>
      <View style={styles.drawerContent}>
        {drawerItems.map((item) => (
          <Button
            key={item.name}
            mode="text"
            icon={item.icon}
            onPress={() => navigation.navigate(item.name)}
            style={styles.drawerItem}
            labelStyle={styles.drawerItemLabel}
            textColor={COLORS.text}
          >
            {item.name}
          </Button>
        ))}
      </View>
      <Divider />
      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          icon="logout"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
          style={styles.logoutButton}
          textColor={COLORS.danger}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

function MainApp() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.text,
        drawerStyle: {
          width: Math.min(width * 0.7, 300),
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{
          headerTitle: 'Dashboard',
        }}
      />
      <Drawer.Screen 
        name="Income" 
        component={Income}
        options={{
          headerTitle: 'Add Income',
        }}
      />
      <Drawer.Screen 
        name="Expense" 
        component={Expense}
        options={{
          headerTitle: 'Add Expense',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  drawerHeader: {
    padding: SPACING.l,
    backgroundColor: COLORS.primary,
  },
  drawerTitle: {
    ...FONTS.h1,
    color: COLORS.white,
  },
  drawerContent: {
    flex: 1,
    paddingTop: SPACING.m,
  },
  drawerItem: {
    marginHorizontal: SPACING.s,
    marginVertical: SPACING.xs,
    borderRadius: 8,
  },
  drawerItemLabel: {
    ...FONTS.body,
  },
  logoutContainer: {
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  logoutButton: {
    borderColor: COLORS.danger,
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <TransactionProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="MainApp" component={MainApp} />
            </Stack.Navigator>
          </NavigationContainer>
        </TransactionProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
} 