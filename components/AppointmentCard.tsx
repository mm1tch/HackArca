import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Appointment, AppointmentStatus } from "../types"; // Importa tus tipos

// Definimos las props que espera este componente
interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  // Función para obtener un color basado en el estado
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Future:
        return styles.statusFuture;
      case AppointmentStatus.Past:
        return styles.statusPast;
      case AppointmentStatus.Cancelled:
        return styles.statusCancelled;
      default:
        return {};
    }
  };

  return (
    // View es el equivalente a <div>
    <View style={styles.card}>
      <View>
        {/* Text es para CUALQUIER texto */}
        <Text style={styles.title}>{appointment.title}</Text>
        <Text style={styles.description}>{appointment.description}</Text>
        <Text style={styles.date}>
          {/* Formateamos el objeto Date para que sea legible */}
          {new Date(appointment.date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
      <View style={[styles.statusBadge, getStatusColor(appointment.status)]}>
        <Text style={styles.statusText}>{appointment.status}</Text>
      </View>
    </View>
  );
};

// StyleSheet es la forma correcta de definir estilos en React Native
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row", // Acomoda los elementos en una fila
    justifyContent: "space-between", // Espacio entre los elementos de la fila
    alignItems: "center", // Centra verticalmente
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  statusFuture: {
    backgroundColor: "#2e7d32", // Verde
  },
  statusPast: {
    backgroundColor: "#666", // Gris
  },
  statusCancelled: {
    backgroundColor: "#d32f2f", // Rojo
  },
});

export { AppointmentCard }; // Exportamos el componente
