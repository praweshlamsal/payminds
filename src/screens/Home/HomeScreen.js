import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import ItemCard from "../../components/ItemCard";
import TopCard from "./TopCard";
import { getSubscriptions } from "../../services/firestore";
import { auth } from "../../../firebaseConfig";
import { triggerTestNotification } from "../../utils/notifications";

const HomeScreen = ({ navigation, route }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const scrollY = useSharedValue(0); // Track scroll position


  useEffect(() => {
    const fetchData = async () => {
      StatusBar.setBarStyle("dark-content");

      const subs = await getSubscriptions();

      // Sort subscriptions by updatedAt in descending order (latest first)
      const sortedSubscriptions = subs.sort((a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return b.updatedAt.seconds - a.updatedAt.seconds;
        }
        return 0;
      });

      setSubscriptions(sortedSubscriptions);
    };

    fetchData();
  }, [route?.params?.refresh]);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Animated style for the sticky header
  const stickyHeaderStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, 0], // Move the header up as the user scrolls
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>
        <TopCard scrollY={scrollY} />
      </Animated.View>

      <Animated.FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Smooth scrolling
        contentContainerStyle={{ paddingTop: 200 }} 
        ListFooterComponent={<View style={{ marginBottom: 90 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#f5f5f5",
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure the header is above the FlatList
  },
});

export default HomeScreen;