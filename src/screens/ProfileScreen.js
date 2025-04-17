import React, { useContext, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import {
  Appbar,
  Button,
  Card,
  Text,
  Title,
  Subheading,
  useTheme,
  List,
} from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { logout } from "../utils/auth";
import { UserContext } from "../services/UserProvider";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const theme = useTheme();
  const scrollY = useSharedValue(0);
   const { username,email } = useContext(UserContext);

  // Animated header height
  const headerHeight = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value, [0, 400], [200, 100], Extrapolate.CLAMP),
    };
  });

  // Animated profile picture size
  const profilePictureSize = useAnimatedStyle(() => {
    const size = interpolate(scrollY.value, [0, 400], [120, 60], Extrapolate.CLAMP);
    return {
      width: size,
      height: size,
      borderRadius: size / 2, // Ensure the Avatar remains circular
    };
  });

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={styles.container}>
      {/* Appbar */}
      

      {/* Header */}
      <Animated.View style={[styles.header, headerHeight, { backgroundColor: theme.colors.primary }]}>
        <Image
          source={{ uri: "https://www.perfocal.com/blog/content/images/2020/07/Perfocal_Male_Dating_Profile.jpg" }} // Replace with your cover photo URL
          style={styles.coverPhoto}
        />
        <Animated.View style={[styles.profilePictureContainer, profilePictureSize]}>
          <Animated.Image
            source={{ uri: "https://www.perfocal.com/blog/content/images/2020/07/Perfocal_Male_Dating_Profile.jpg" }} // Replace with your profile picture URL
            style={[styles.profilePicture, profilePictureSize]}
          />
        </Animated.View>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Title style={styles.name}>{username}</Title>
        <Subheading style={styles.bio}>{email}</Subheading>

        {/* Subscription Details */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Subscriptions</Title>
            <List.Item
              title="Netflix"
              description="Renews on 25th October 2023"
              left={() => <List.Icon icon="netflix" color={theme.colors.primary} />}
            />
            <List.Item
              title="Spotify"
              description="Renews on 30th October 2023"
              left={() => <List.Icon icon="spotify" color={theme.colors.primary} />}
            />
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Settings</Title>
            <List.Item
              title="Edit Profile"
              left={() => <List.Icon icon="account-edit" />}
              onPress={() => {}}
            />
            <List.Item
              title="Change Password"
              left={() => <List.Icon icon="lock-reset" />}
              onPress={() => {}}
            />
            <List.Item
              title="Notification Settings"
              left={() => <List.Icon icon="bell" />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="contained"
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonText}
          onPress={logout}
        >
          Log Out
        </Button>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    alignItems: "center",
    zIndex:99
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profilePictureContainer: {
    position: "absolute",
    bottom: -60,
    borderWidth: 0,
    borderColor: "#fff",
    left:0,
    zIndex:99
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderWidth:4,
    borderColor:"white",
    borderRadius: 60, // Ensure the image is circular
  },
  content: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionCard: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  logoutButton: {
    width: "100%",
    marginBottom: 120,
    backgroundColor: "#ff4444",
  },
  logoutButtonText: {
    color: "#fff",
  },
});

export default ProfileScreen;