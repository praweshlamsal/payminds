import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddSubscriptionScreen from "./src/screens/AddSubscriptionScreen";
import { Provider as PaperProvider } from "react-native-paper";
import { requestNotificationPermission } from "./src/utils/notifications";
import EditSubscriptionScreen from "./src/screens/EditSubscriptionScreen";


const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen  name="Login" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="Signup" options={{ headerShown: false }} component={SignupScreen} />
        <Stack.Screen name="Home" options={{ headerShown: false }}  component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="AddSubscription" component={AddSubscriptionScreen} />
        <Stack.Screen name="EditSubscription" component={EditSubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}


