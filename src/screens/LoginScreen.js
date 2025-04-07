import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUserToStorage } from "../utils/auth";
import { scheduleSubscriptionReminder, triggerTestNotification } from "../utils/notifications";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("prawesh1@gmail.com");
  const [password, setPassword] = useState("1234567");
  const [errorMessage, setErrorMessage] = useState("");

  // Set status bar style when the screen is focused
  useEffect(() => {
    StatusBar.setBarStyle("light-content"); // Set status bar to light-content (white icons/text)
    return () => {
      StatusBar.setBarStyle("dark-content"); // Reset to dark-content when the screen is unmounted
    };
  }, []);

  const handleLogin = async () => {
   
    try {
        await signInWithEmailAndPassword(auth, email, password);
        await saveUserToStorage()
        // navigation.navigate("Home");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          setErrorMessage("No user found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setErrorMessage("Too many attempts. Please try again later.");
          break;
        default:
          setErrorMessage("An error occurred. Please try again.");
          break;
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground source={require("../../assets/bg.jpg")} style={styles.background}>
        <View style={styles.container}>
          <View style={styles.blurContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back!</Text>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupText}>
                  Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    width: "80%",
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    overflow: "hidden",
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "rgba(0, 123, 255, 0.8)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },
  signupLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default LoginScreen;