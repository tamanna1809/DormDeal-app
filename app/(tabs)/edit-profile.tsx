import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Colors } from "../../constants/Colors";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const initial = useMemo(
    () => ({
      phoneNumber: user?.phoneNumber ?? "",
      roomNumber: user?.roomNumber ?? "",
      year: user?.year ?? "",
    }),
    [user]
  );

  const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
  const [roomNumber, setRoomNumber] = useState(initial.roomNumber);
  const [year, setYear] = useState(initial.year);
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    if (!user) {
      Alert.alert("Not logged in", "Please login first.");
      router.replace("/(auth)/login" as any);
      return;
    }

    const payload = {
      phoneNumber: phoneNumber.trim(),
      roomNumber: roomNumber.trim(),
      year: year.trim(),
    };

    if (!payload.phoneNumber || !payload.roomNumber || !payload.year) {
      Alert.alert("Missing info", "Please fill phone number, room number, and year.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.put("/users/me", payload);
      const updated = res?.data?.user;

      if (!updated?._id) {
        throw new Error("Invalid server response");
      }

      updateUser(updated);
      Alert.alert("Saved", "Your profile has been updated.");
      router.back();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to update profile";
      Alert.alert("Error", msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <Input label="Room Number" value={roomNumber} onChangeText={setRoomNumber} />
        <Input label="Year" value={year} onChangeText={setYear} />

        <Button title="Save Changes" onPress={onSave} isLoading={isSaving} />
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={{ marginTop: 12 }}
          disabled={isSaving}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },
});

