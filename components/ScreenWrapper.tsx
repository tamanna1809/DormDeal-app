import React from "react";
import { View, StyleSheet, ViewProps, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  bg?: string;
}

export const ScreenWrapper = ({ children, bg, style, ...props }: ScreenWrapperProps) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg || Colors.light.background }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.content, style]} {...props}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
