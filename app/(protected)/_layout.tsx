// app/(protected)/_layout.tsx
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import { Header } from "../../components/Header";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedLayout() {
  const { userToken, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !userToken) {
      router.replace("/login");
    }
  }, [isLoading, userToken]);

  if (isLoading || !userToken) {
    return null; // o un <Loading /> si quieres
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        <Header />

        <View style={styles.content}>
          <Slot />
        </View>

        <BottomNavigationBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  content: {
    flex: 1,
  },
});
