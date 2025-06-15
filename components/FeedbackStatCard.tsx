// components/FeedbackStatCard.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Props que recibirá la tarjeta
interface FeedbackStatCardProps {
  value: string;
  label: string;
}

export const FeedbackStatCard: React.FC<FeedbackStatCardProps> = ({
  value,
  label,
}) => {
  return (
    // Contenedor principal de la tarjeta de estadística
    <View style={styles.card}>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1, // Para que las 3 tarjetas ocupen el espacio disponible
    backgroundColor: "#EFEFEF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6, // Espacio entre las tarjetas
  },
  valueText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#DC2626", // Rojo
    marginBottom: 8,
  },
  labelText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 14,
  },
});
