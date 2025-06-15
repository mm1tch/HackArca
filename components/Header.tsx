// components/Header.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { usePathname } from "expo-router"; // Importamos el hook para saber la ruta
import { SettingsIcon } from "./icons/MiscIcons";

// Un objeto para mapear las rutas a los títulos que queremos mostrar
const titleMap: { [key: string]: string } = {
  "/": "Inicio",
  "/agenda": "Agenda",
  "/mapa": "Mapa",
  "/reportes": "Reportes",
};

export const Header = () => {
  // Obtenemos la ruta actual (ej: "/agenda")
  const pathname = usePathname();

  // Buscamos el título en nuestro mapa. Si no lo encuentra, usa 'App' como fallback.
  const title = titleMap[pathname] || "ArcaApp";

  return (
    <View style={styles.header}>
      <View style={styles.headerSpacer} />

      <Text style={styles.headerTitle}>{title}</Text>

      {/* Botón de configuración */}
      <Pressable
        style={styles.settingsButton}
        onPress={() => alert("Configuración presionado!")}
      >
        <SettingsIcon width={24} height={24} fill="#4A5568" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    height: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
  },
  settingsButton: {
    padding: 4,
    marginRight: 10,
  },
  headerSpacer: {
    width: 28,
  },
});
