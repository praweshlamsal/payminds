import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Switch, Button } from "react-native-paper"; // For consistent design
import DateTimePicker from "@react-native-community/datetimepicker"; // For date picker
import { Picker } from "@react-native-picker/picker"; // For billing cycle picker
import { useNavigation } from "@react-navigation/native";
import { addSubscription } from "../services/firestore";
import CustomInput from "../components/CustomInput"; // Reusable input component
import CustomButton from "../components/CustomButton"; // Reusable button component
import { scheduleNotificationAsync } from "expo-notifications";

const AddSubscriptionScreen = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingDate, setBillingDate] = useState(new Date()); // Default to today's date
  const [billingCycle, setBillingCycle] = useState(1); // Default 1 month
  const [billingType, setBillingType] = useState("free");
  const [showDatePicker, setShowDatePicker] = useState(false); // Control date picker visibility
  const [disable,setDisable] = useState(true)
  const navigation = useNavigation();

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // Hide the picker on Android after selection
    if (selectedDate) {
      setBillingDate(selectedDate); // Update the billing date
    }
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleAddSubscription = async () => {
    // Validate all fields
    if (!name || !amount || !billingCycle) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    // Validate amount is a number
    if (isNaN(parseFloat(amount))) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    // Validate billing cycle is a number
    if (isNaN(parseInt(billingCycle))) {
      Alert.alert("Error", "Please enter a valid billing cycle.");
      return;
    }

    try {
      await addSubscription(
        name,
        parseFloat(amount),
        formatDate(billingDate),
        billingCycle,
        billingType
      ).then(() => {
        setName("");
        setAmount("");
        setBillingDate(new Date());
        setBillingCycle(1);
        setBillingType("free");
        setShowDatePicker(false);
        setDisable(true)
      })

      Alert.alert("Success", "Subscription added successfully!");
      // navigation.goBack(); // Go back to HomeScreen
      navigation.navigate("Home", { refresh: true });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add subscription.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Subscription</Text>

      <CustomInput
        label="Subscription Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter subscription name"
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Billing Type</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={billingType}
            onValueChange={(value) => {
              value == "paid" ? setDisable(false):setDisable(true);
              setAmount("")
              setBillingType(value)
            }}
            style={styles.pickerInput}
          >
            <Picker.Item label="Free Trial" value={"free"} />
            <Picker.Item label="Paid Trial" value={"paid"} />
          </Picker>
        </View>
      </View>

      <CustomInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        disable={disable}
      />

      {/* Date Input Field */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInputContainer}
      >
        <Text style={styles.dateInputLabel}>Billing Date</Text>
        <View style={styles.dateInput}>
          <Text style={styles.dateInputText}>{formatDate(billingDate)}</Text>
        </View>
      </TouchableOpacity>

      {/* Show Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={billingDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Billing Cycle Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Billing Cycle</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={billingCycle}
            onValueChange={(value) => setBillingCycle(value)}
            style={styles.pickerInput}
          >
            <Picker.Item label="1 Month" value={1} />
            <Picker.Item label="2 Months" value={2} />
            <Picker.Item label="3 Months (Quarterly)" value={3} />
            <Picker.Item label="12 Months (Yearly)" value={12} />
          </Picker>
        </View>
      </View>

      <CustomButton
        title="Add Subscription"
        onPress={handleAddSubscription}
        style={styles.addButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  dateInputContainer: {
    marginBottom: 20,
  },
  dateInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  dateInput: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    height: 50,
  },
  dateInputText: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden", // Ensure rounded corners
  },
  pickerInput: {
    height: 50,
  },
  addButton: {
    marginTop: 10,
  },
});

export default AddSubscriptionScreen;
