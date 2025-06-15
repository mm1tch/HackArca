import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Props que recibirá la tarjeta
interface SentimentStatCardProps {
  emoji: string;
  percentage: number;
  label: string;
  color: string; // Color de fondo para el badge del porcentaje
}

export const SentimentStatCard: React.FC<SentimentStatCardProps> = ({
  emoji,
  percentage,
  label,
  color,
}) => {
  return (
    // Contenedor principal de la tarjeta de estadística
    <View style={styles.card}>
      <View style={[styles.percentageBadge, { backgroundColor: color }]}>
        <Text style={styles.emojiText}>{emoji}</Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1, // Para que las 3 tarjetas ocupen el espacio disponible
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    alignItems: "center", // Centra el contenido horizontalmente
    marginHorizontal: 6, // Espacio entre las tarjetas
  },
  percentageBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  emojiText: {
    fontSize: 16,
    marginRight: 6,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    textTransform: "uppercase", // Convierte el texto a mayúsculas
  },
});
