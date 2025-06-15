import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Appointment } from "../types";

export const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{appointment.title}</Text>
      <Text style={styles.date}>
        {appointment.date.toLocaleDateString("es-MX", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  date: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
});
