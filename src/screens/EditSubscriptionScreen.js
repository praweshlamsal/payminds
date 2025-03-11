import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { updateSubscription } from "../services/firestore";

const EditSubscriptionScreen = ({ route, navigation }) => {
  const { subscription } = route.params; // Get subscription details from navigation

  const [name, setName] = useState(subscription.name);
  const [amount, setAmount] = useState(subscription.amount.toString());
  const [billingDate, setBillingDate] = useState(subscription.billingDate);
  const [billingCycle, setBillingCycle] = useState(subscription.billingCycle.toString());

  const handleUpdate = async () => {
    if (!name || !amount || !billingDate || !billingCycle) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      await updateSubscription(subscription.id, name, parseFloat(amount), billingDate, parseInt(billingCycle));
      Alert.alert("Success", "Subscription updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update subscription.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Edit Subscription</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Subscription Name" />
      <TextInput value={amount} onChangeText={setAmount} placeholder="Amount" keyboardType="numeric" />
      <TextInput value={billingDate} onChangeText={setBillingDate} placeholder="Billing Date (YYYY-MM-DD)" />
      <TextInput value={billingCycle} onChangeText={setBillingCycle} placeholder="Billing Cycle (Months)" keyboardType="numeric" />

      <Button title="Update Subscription" onPress={handleUpdate} />
    </View>
  );
};

export default EditSubscriptionScreen;
