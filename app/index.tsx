// app/index.tsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, Text, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const { userToken, isLoading } = useAuth();

  useEffect(() => {
    console.log("⏳ isLoading:", isLoading);
    console.log("🔐 userToken:", userToken);

    if (!isLoading) {
      if (userToken) {
        console.log("✅ Token encontrado. Redirigiendo a /home");
        router.replace("/home");
      } else {
        console.log("🚫 No hay token. Redirigiendo a /login");
        router.replace("/login");
      }
    }

    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text>Cargando...</Text>
        </View>
      );
    }

  }, [userToken, isLoading]);

  return null;
}



