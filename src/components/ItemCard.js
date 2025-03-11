import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const ItemCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {/* Edit Icon in Top-Right Corner */}
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() =>
            navigation.navigate("EditSubscription", { subscription: item })
          }
        >
          <MaterialIcons name="edit" size={20} color="#007bff" />
        </TouchableOpacity>

        {/* Subscription Name */}
        <Title style={styles.title}>{item.name}</Title>

        {/* Amount */}
        <View style={styles.row}>
          <MaterialIcons name="attach-money" size={16} color="#666" />
          <Paragraph style={styles.paragraph}>{item.amount}</Paragraph>
        </View>

        {/* Next Billing Date */}
        <View style={styles.row}>
          <MaterialIcons name="event" size={16} color="#666" />
          <Paragraph style={styles.paragraph}>
            Next Billing: <Text style={{color:"black"}}>{item.nextBillingDate}</Text>
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal:16
  },
  cardContent: {
    padding: 16,
  },
  editIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1, // Ensure it's above other content
  },
  title: {
    fontSize: 18,
    fontWeight: "700", // Semi-bold
    marginBottom: 12,
    color: "#333",
    fontFamily: "Roboto", // Use a modern font (ensure it's loaded)
    letterSpacing: 0.2, // Slightly spaced letters
    lineHeight: 24, // Better line height
    textTransform: "capitalize"
  },
  paragraph: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontFamily: "Roboto", // Use a modern font (ensure it's loaded)
    letterSpacing: 0.1, // Slightly spaced letters
    lineHeight: 20, // Better line height
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});
