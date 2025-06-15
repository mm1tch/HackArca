// app/index.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router"; // Importamos Link para navegar

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Inicio</Text>
      <Text style={styles.subtitle}>Bienvenido a ArcaApp.</Text>

      {/* Este botón nos llevará a la pantalla de Agenda */}
      <Link href="/agenda" style={styles.linkButton}>
        <Text style={styles.linkText}>Ir a la Agenda</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  linkButton: {
    backgroundColor: "#8B5CF6", // Mismo color que el botón de 'Agendar'
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
