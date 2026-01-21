import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import api from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      
      const data = res.data;
      // console.log("Login response:", data);

      if (data.token && data.user) {
        await login(data.token, data.user);
        // Router will auto-redirect in _layout.js based on auth state
      } else {
        Alert.alert("Login Failed", "Invalid response from server");
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Could not connect to server";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <KeyboardAvoidingView 
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   style={{ flex: 1 }}
    // >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push("/signup")} style={{ marginTop: 20 }}>
              <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    // </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#4F46E5" },
  input: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#4F46E5" },
});
