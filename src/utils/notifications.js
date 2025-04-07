import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import dayjs from "dayjs";
import { auth, db } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      console.log("Notification permission denied");
      return false;
    }
  }
  console.log("Notification permission granted");
  return true;
}

// Schedule a notification
export const scheduleSubscriptionReminder = async (subscription) => {
  const { name, nextBillingDate } = subscription;
  

  // Calculate 1 day before the next billing date
  const reminderDate = dayjs(nextBillingDate).subtract(1, "day").toDate();
  const notificationData = {
    title: "Subscription Reminder",
    body: `Your ${name} subscription is due tomorrow!`,
    timestamp: new Date().toISOString(),
    userId:  auth.currentUser?.uid , // Replace with actual user ID from auth
    scheduledTime: reminderDate.toISOString(),
  };

  try {
    // Store notification in Firebase
    await addDoc(collection(db, "notifications",  auth.currentUser?.uid , "userNotifications"), notificationData);
    console.log("Scheduled notification stored in Firestore!");
  } catch (error) {
    console.error("Error storing scheduled notification:", error);
  }
  // Schedule the notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notificationData.title,
      body: notificationData.body,
      sound: true,
    },
    trigger: reminderDate,
  });
};


//testing if my local expo notification is working
export async function triggerTestNotification() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  console.log("Scheduling notification...");
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚀 Test Notification",
      body: "This is a test notification!",
      sound: true,
    },
    trigger: { seconds: 5 }, // Trigger in 5 seconds
  });


}