import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Definimos las props que recibirá cada tarjeta de recomendación
interface RecommendationCardProps {
  title: string;
  description: string;
  color: string; // Color para la barra lateral
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  color,
}) => {
  return (
    // Contenedor principal de la tarjeta
    <View style={styles.card}>
      {/* Barra de color lateral */}
      <View style={[styles.sideBar, { backgroundColor: color }]} />

      {/* Contenido de texto */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB", // Un gris muy claro
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden", // Asegura que la barra lateral no se salga de los bordes redondeados
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  sideBar: {
    width: 6, // Ancho de la barra de color
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20, // Mejora la legibilidad
  },
});
