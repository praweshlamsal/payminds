import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import { Provider as PaperProvider } from "react-native-paper";
import { requestNotificationPermission } from "./src/utils/notifications";
import EditSubscriptionScreen from "./src/screens/EditSubscriptionScreen";
import MainScreen from "./src/screens/MainScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import { onAuthStateChangedListener } from "./src/services/firestore";
import { UserProvider } from "./src/services/UserProvider";
import { auth } from "./firebaseConfig";
import * as Notifications from "expo-notifications";
import NotificationListScreen from "./src/screens/NotificationListScreen";

const Stack = createStackNavigator();

export default function App() {
  const notificationListener = useRef();
  const [userId, setUserId] = useState();
  useEffect(() => {
    requestNotificationPermission();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );
    if(!auth) return;
      const unsubscribe = onAuthStateChangedListener((user) => {
        if (user) {
          setUserId(user.uid); // User is logged in
        } else {
          setUserId(null); // User is logged out
        }
      });
      return () => {
        unsubscribe ? unsubscribe : () => {};
        Notifications.removeNotificationSubscription(notificationListener.current);

      }; // Prevent undefined function error
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <UserProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {!userId ? (
                <>
                  <Stack.Screen
                    name="Login"
                    options={{ headerShown: false }}
                    component={LoginScreen}
                  />
                  <Stack.Screen
                    name="Signup"
                    options={{ headerShown: false }}
                    component={SignupScreen}
                  />
                </>
              ) : (
                <>
                <Stack.Screen
                  name="Home"
                  options={{ headerShown: false }}
                  component={MainScreen}
                />
                <Stack.Screen
                name="EditSubscription"
                options={{ headerShown: false }}
                component={EditSubscriptionScreen}
                />
                <Stack.Screen  options={{ headerShown: false }} name="NotificationList" component={NotificationListScreen} />

              </>
              )}

              {/* <Stack.Screen
                name="AddSubscription"
                options={{ headerShown: false }}
                component={AddSubscriptionScreen}
              />
              <Stack.Screen name="EditSubscription" component={EditSubscriptionScreen} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </UserProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
