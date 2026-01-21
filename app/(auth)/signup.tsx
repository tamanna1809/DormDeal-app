import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import api from "../services/api";
import { Colors } from "../../constants/Colors";

export default function Signup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    roomNumber: "",
    year: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = async () => {
    // Basic validation
    if (Object.values(formData).some((val) => !val)) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/signup", formData);
      Alert.alert("Success", "Account created! Please login.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the DormDeal community</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <Input
            label="College Email"
            placeholder="name@sst.scaler.com"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />
          <Input
            label="Phone Number"
            placeholder="9876543210"
            value={formData.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
            keyboardType="phone-pad"
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Room No"
                placeholder="A-101"
                value={formData.roomNumber}
                onChangeText={(text) => handleChange("roomNumber", text)}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Year"
                placeholder="1st, 2nd..."
                value={formData.year}
                onChangeText={(text) => handleChange("year", text)}
              />
            </View>
          </View>

          <Button
            title="Sign Up"
            onPress={handleSignup}
            isLoading={isLoading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  form: {
    marginBottom: 40,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  button: {
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  footerText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  link: {
    color: Colors.light.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});
