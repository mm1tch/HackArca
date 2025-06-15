import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Slot } from "expo-router"; // ¡Importante para que se vea el contenido!
import { BottomNavigationBar } from "../components/BottomNavigationBar";
import { SettingsIcon } from "../components/icons/MiscIcons";

export default function AppLayout() {
  return (
    // SafeAreaView para evitar el notch y la barra de estado
    <SafeAreaView style={styles.safeArea}>
      {/* View principal que se comporta como el <body> */}
      <View style={styles.appContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Ver como cambiar por pag</Text>
          <Pressable
            style={styles.settingsButton}
            onPress={() => alert("Configuración presionado!")}
          >
            <SettingsIcon width={24} height={24} fill="#4A5568" />
          </Pressable>
        </View>

        {/* El contenido de la página actual (index.tsx) se renderizará aquí */}
        <Slot />

        {}
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
  header: {
    backgroundColor: "#fff",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
  },
  settingsButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 28,
  },
});
