import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig"; 
import dayjs from "dayjs"; // Import dayjs for date handling
import { scheduleSubscriptionReminder } from "../utils/notifications";
import { onAuthStateChanged } from "firebase/auth";

const getSubscriptions = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const subscriptionsRef = collection(db, "users", userId, "subscriptions");
  const querySnapshot = await getDocs(subscriptionsRef);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const addSubscription = async (name, amount, billingDate, billingCycle, billingType, status="active") => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  // Calculate next billing date
  const nextBillingDate = dayjs(billingDate).add(billingCycle, "month").format("YYYY-MM-DD");

  const subscriptionsRef = collection(db, "users", userId, "subscriptions");
  const docRef = await addDoc(subscriptionsRef, { name, amount, billingDate, billingCycle, nextBillingDate , billingType, status, updatedAt: serverTimestamp()});

  if (status === "active") {
    await scheduleSubscriptionReminder({ name, nextBillingDate });
  }
  // Schedule a notification 1 day before the next billing date
};

const deleteSubscription = async (subscriptionId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const subscriptionDoc = doc(db, "users", userId, "subscriptions", subscriptionId);
  await deleteDoc(subscriptionDoc);
};


const updateSubscription = async (subscriptionId, name, amount, billingDate, billingCycle) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  // Calculate new next billing date
  const nextBillingDate = dayjs(billingDate).add(billingCycle, "month").format("YYYY-MM-DD");

  const subscriptionRef = doc(db, "users", userId, "subscriptions", subscriptionId);
  
  await updateDoc(subscriptionRef, { name, amount, billingDate, billingCycle, nextBillingDate,updatedAt: serverTimestamp() });

  // Schedule a new notification
  await scheduleSubscriptionReminder({ name, nextBillingDate });
};


const getNotifications = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const notificationsRef = collection(db, "notifications", userId, "userNotifications");
    const querySnapshot = await getDocs(notificationsRef);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert ISO string to Date object
        scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : null,
        // Keep timestamp conversion if using serverTimestamp()
        timestamp: data.timestamp?.toDate?.() || null
      };
    });
    
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};;


  const onAuthStateChangedListener = (callback) => {
    onAuthStateChanged(auth, callback);
  };

export { getSubscriptions, addSubscription, deleteSubscription, updateSubscription, onAuthStateChangedListener, getNotifications };
