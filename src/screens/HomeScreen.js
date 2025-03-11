import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper"; // Import React Native Paper components
import { getSubscriptions } from "../services/firestore";
import ItemCard from "../components/ItemCard";

const HomeScreen = ({ navigation, route }) => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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

  return (
    <View style={styles.container}>
      {/* Add Subscription Button */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddSubscription")}
        style={styles.addButton}
      >
        Add Subscription
      </Button>

      {/* Subscription List */}
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard item={item}/>
        )}
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
  addButton: {
    marginBottom: 16,
  },
});

export default HomeScreen;