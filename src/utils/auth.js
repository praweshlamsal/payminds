import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";



const saveUserToStorage = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await AsyncStorage.setItem("userId", user.uid);
      }
    } catch (error) {
      console.error("Error saving user ID:", error);
    }
  };

const getUserId = async () => {
    try {
      return await AsyncStorage.getItem("userId");
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      return null;
    }
  };
  


const logout = async () => {
    try {
      await signOut(auth);  // This will log out the current user
      AsyncStorage.clear();
      console.log('User has been logged out successfully');
    } catch (error) {
      console.error('Error logging out: ', error.message);
    }
  };
  
  
  export {saveUserToStorage,getUserId,logout}