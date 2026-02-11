import { Stack } from "expo-router";
import { AuthProvider } from "../context/auth";
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
      </Stack>
    </AuthProvider>
  );
}
