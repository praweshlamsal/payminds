import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Card } from "react-native-paper";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getNotifications } from "../services/firestore";

const NotificationListScreen = ({ route }) => {
     const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("kjhfaklsjdhf")
    const fetchData = async () => {

            const subs = await getNotifications();

            // Sort subscriptions by updatedAt in descending order (latest first)
            const sortedSubscriptions = subs.sort((a, b) => {
              if (a.updatedAt && b.updatedAt) {
                return b.updatedAt.seconds - a.updatedAt.seconds;
              }
              return 0;
            });

            setNotifications(sortedSubscriptions);
          };

          fetchData().finally(() => {
            setLoading(false);
          }).catch((error) => {
            console.error("Error fetching notifications:", error);
            setLoading(false);
          }
          );
        }, [route?.params?.refresh]);



  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.body}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.header}>Notifications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications found.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default NotificationListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
});
