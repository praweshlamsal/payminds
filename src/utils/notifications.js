import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import dayjs from "dayjs";

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

// Schedule a notification
export const scheduleSubscriptionReminder = async (subscription) => {
  const { name, nextBillingDate } = subscription;

  // Calculate 1 day before the next billing date
  const reminderDate = dayjs(nextBillingDate).subtract(1, "day").toDate();

  // Schedule the notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Subscription Reminder",
      body: `Your ${name} subscription is due tomorrow!`,
    },
    trigger: reminderDate,
  });
};
