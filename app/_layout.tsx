// app/_layout.tsx

import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Slot } from "expo-router";
import { BottomNavigationBar } from "../components/BottomNavigationBar";
import { Header } from "../components/Header";

export default function AppLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        {/* 2. USAMOS EL NUEVO COMPONENTE HEADER */}
        <Header />

        {/* El contenido de la página actual se renderizará aquí */}
        <View style={styles.content}>
          <Slot />
        </View>

        {/* La barra de navegación se queda igual */}
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
