import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export function useNotificationListener(userId) {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        console.log("Notification received:", notification);

        // Store the received notification in Firebase
        const notificationData = {
          title: notification.request.content.title,
          body: notification.request.content.body,
          timestamp: new Date().toISOString(),
          userId: userId, // Save notification per user
        };

        try {
          await addDoc(collection(db, "notifications"), notificationData);
          console.log("Triggered notification stored in Firestore!");
        } catch (error) {
          console.error("Error storing triggered notification:", error);
        }
      }
    );

    return () => subscription.remove();
  }, [userId]); // Run effect when userId changes
}
