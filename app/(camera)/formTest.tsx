import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import axios from "axios";

const ContactUsScreen = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (name: any, value: any) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.phone || !form.message) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://172.20.10.4:5000/contact",
        form
      );
      Alert.alert("Success", response.data.message);
      setForm({ username: "", email: "", phone: "", message: "" });
    } catch (error) {
      Alert.alert("Error", "Failed to submit form");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={form.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange("email", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={form.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange("phone", text)}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Message"
        value={form.message}
        multiline
        onChangeText={(text) => handleChange("message", text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ContactUsScreen;
