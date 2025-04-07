import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import AddSubscriptionScreen from "../screens/AddSubscriptionScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SearchScreen from "../screens/SearchScreen";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

const CURVE_WIDTH = 75;
const TAB_WIDTH = width / 5;

// Curved Tab Bar Component
const CurvedTabBar = ({ state, descriptors, navigation }) => {
  const animatedValue = useRef(new Animated.Value(state.index)).current;
  const scaleValue = useRef(new Animated.Value(1)).current; // Scale animation for floating button

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: state.index,
      damping: 10,
      stiffness: 100,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [0, TAB_WIDTH, TAB_WIDTH * 2, TAB_WIDTH * 3, TAB_WIDTH * 4],
  });

  // Floating Button Animations
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.2, // Scale up slightly
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1, // Return to normal size
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Search":
              iconName = "search";
              break;
            case "Add":
              iconName = "add";
              break;
            case "Favorites":
              iconName = "heart";
              break;
            case "Profile":
              iconName = "person";
              break;
          }

          // Floating button for center tab
          if (route.name === "Add") {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.centerButton}
                onPress={() => navigation.navigate(route.name)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Animated.View style={[styles.floatingButton, { transform: [{ scale: scaleValue }] }]}>
                  <Ionicons name={iconName} size={32} color="white" />
                </Animated.View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => navigation.navigate(route.name)}
            >
              {isFocused && (
                <View style={styles.circularIcon}>
                  <Ionicons name={iconName} size={24} color="#6A1B9A" />
                </View>
              )}
              {!isFocused && <Ionicons name={iconName} size={24} color="#757575" />}
             
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CurvedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "transparent", position: "absolute" },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add" component={AddSubscriptionScreen} />
      <Tab.Screen name="Favorites" component={() => <FavoritesScreen />} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: 70,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  animatedIndicator: {
    position: "absolute",
    top: -20,
    width: CURVE_WIDTH,
    height: 61,
    zIndex: 0,
  },
  tabsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    color: "#757575",
    fontSize: 12,
    marginTop: 4,
  },
  activeLabel: {
    color: "#6A1B9A",
    fontWeight: "bold",
  },
  centerButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: 75,
    marginBottom: 30,
    borderWidth: 5,
    borderRadius: 50,
    borderColor: "#f2f2f2",
    top: -10,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6A1B9A",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  circularIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default BottomTabNavigator;
