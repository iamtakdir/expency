import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { TransactionProvider } from './src/context/TransactionContext';

// Import screens
import Dashboard from './src/screens/Dashboard';
import Expense from './src/screens/Expense';
import Income from './src/screens/Income';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <TransactionProvider>
          <NavigationContainer>
            <Drawer.Navigator 
              initialRouteName="Dashboard"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#fff',
                },
                headerTintColor: '#000',
              }}
            >
              <Drawer.Screen name="Dashboard" component={Dashboard} />
              <Drawer.Screen name="Income" component={Income} />
              <Drawer.Screen name="Expense" component={Expense} />
            </Drawer.Navigator>
          </NavigationContainer>
        </TransactionProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
} 