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
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { updateSubscription } from "../services/firestore";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import TitleComponent from "../components/TitleComponent";

const EditSubscriptionScreen = ({ route }) => {
  const { subscription } = route.params;
  const navigation = useNavigation();

  const [name, setName] = useState(subscription.name);
  const [amount, setAmount] = useState(subscription.amount.toString());
  const [billingDate, setBillingDate] = useState(new Date(subscription.billingDate));
  const [billingCycle, setBillingCycle] = useState(subscription.billingCycle);
  const [billingType, setBillingType] = useState(subscription.amount > 0 ? "paid" : "free");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [disable, setDisable] = useState(subscription.amount <= 0);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBillingDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleUpdate = async () => {
    if (!name || (billingType === "paid" && !amount) || !billingCycle) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    if (billingType === "paid" && isNaN(parseFloat(amount))) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    try {
      await updateSubscription(
        subscription.id,
        name,
        billingType === "paid" ? parseFloat(amount) : 0,
        formatDate(billingDate),
        billingCycle
      );

      Alert.alert("Success", "Subscription updated successfully!");
      navigation.navigate("Home", { refresh: true });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update subscription.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <TitleComponent showIcon={true}  title="Edit Subscription" />

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
              setBillingType(value);
              setDisable(value === "free");
              if (value === "free") setAmount("0");
              else setAmount("");
            }}
            style={styles.pickerInput}
          >
            <Picker.Item label="Free Trial" value="free" />
            <Picker.Item label="Paid Trial" value="paid" />
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

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInputContainer}
      >
        <Text style={styles.dateInputLabel}>Billing Date</Text>
        <View style={styles.dateInput}>
          <Text style={styles.dateInputText}>{formatDate(billingDate)}</Text>
        </View>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={billingDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

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
        title="Update Subscription"
        onPress={handleUpdate}
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
    padding: 10,
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
    overflow: "hidden",
  },
  pickerInput: {
    height: 50,
  },
  addButton: {
    marginTop: 10,
  },
});

export default EditSubscriptionScreen;
