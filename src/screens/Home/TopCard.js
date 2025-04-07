import React, { useContext } from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { Card, Avatar, Badge } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  Extrapolation,
} from "react-native-reanimated";
import { auth } from "../../../firebaseConfig";
import { UserContext } from "../../services/UserProvider";
import { useNavigation } from "@react-navigation/native";
import { scheduleSubscriptionReminder } from "../../utils/notifications";
const { width } = Dimensions.get("window");

const TopCard = ({ scrollY }) => {
  const { username } = useContext(UserContext);
  const navigation = useNavigation();

  const cardHeight = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value, [0, 200], [200, 80], Extrapolate.CLAMP), // Shrink from 250 to 80
    };
  });

  const welcomeTextOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 100], [1, 0], Extrapolate.CLAMP), // Fade out welcome text
    };
  });

  const nameScale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [0, 200], [1, 1.4], Extrapolation.CLAMP), // Slightly shrink the name
        },
        {
          translateY: interpolate(scrollY.value, [0, 200], [0, -20], Extrapolation.CLAMP),
        },
        {
          translateX: interpolate(scrollY.value, [0, 200], [0, 40], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const amountScale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [0, 200], [1, 0.8], Extrapolate.CLAMP), // Slightly shrink the amount
        },
      ],
    };
  });

  const notificationPosition = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [0, 200], [1,1.2], Extrapolate.CLAMP), // Move the icon up slightly
        },
        {
          translateY: interpolate(scrollY.value, [0, 200], [0,10], Extrapolate.CLAMP), // Move the icon up slightly
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.card, cardHeight]}>
      <ImageBackground
        source={require("../../../assets/cardbg.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle} // Apply styles to the image itself
      >
        <View style={styles.overlay} />
        <Animated.View style={[styles.notificationContainer, notificationPosition]}>
          <Avatar.Icon size={28} icon="bell" color="#ffffff" style={styles.bellIcon} />
          <Badge onPress={()=>{
            //  scheduleSubscriptionReminder({
            //   name: "Netflix", // Name of the subscription
            //   nextBillingDate: "2025-04-08T10:00:00.000Z", // ISO string or date that represents the next billing date
            // })
            navigation.navigate("NotificationList")
            }} style={styles.badge}>2</Badge>
        </Animated.View>
        <Animated.Text style={[styles.welcomeText, welcomeTextOpacity]}>
          Welcome back,
        </Animated.Text>
        <Animated.Text style={[styles.nameText, nameScale]}>{username}</Animated.Text>
        <Animated.Text style={[styles.balanceLabel]}>Remaining Payments</Animated.Text>
        <Animated.Text style={[styles.balance, amountScale]}>$ 24,980.00</Animated.Text>
      </ImageBackground>
    </Animated.View>
  );
};

export default TopCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
    padding: 0,
    overflow: "hidden",
    elevation: 5,
  },
  backgroundImage: {
    flex: 1, // Ensure the ImageBackground fills the entire height
    padding: 20,
    borderRadius: 0,
    position: "relative",
    backgroundColor: "blue",
  },
  backgroundImageStyle: {
    borderRadius: 16,
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 0,
  },
  notificationContainer: {
    top:25,
    width:30,
    right: 20,
    position:"absolute"
  },
  bellIcon: {
    backgroundColor: "transparent",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4D4D",
    color: "white",
    fontSize: 12,
  },
  welcomeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "400",
    marginTop: 20,
  },
  nameText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceLabel: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
  },
  balance: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
});