// app/_layout.tsx
import { Slot } from "expo-router";
import React from "react";
import { AuthProvider } from "../context/AuthContext"; // ✅ Importa tu context

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
