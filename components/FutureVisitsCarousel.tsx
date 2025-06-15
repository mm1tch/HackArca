import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";

export default function FutureVisitsCarousel() {
  const [visitas, setVisitas] = useState([]);

  const fetchVisitas = async () => {
    try {
      const response = await axios.get("http://10.22.198.197:5050/api/future-visits");
      setVisitas(response.data);
    } catch (error) {
      console.error("Error al obtener visitas futuras", error);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, []);

  const cancelarVisita = async (id) => {
    try {
      await axios.put(`http://10.22.198.197:5050/api/future-visits/${id}/cancelar`);
      Alert.alert("✅ Visita cancelada", "La visita fue cancelada exitosamente.");
      fetchVisitas(); // Recargar visitas
    } catch (error) {
      console.error("Error al cancelar visita:", error);
      Alert.alert("❌ Error", "No se pudo cancelar la visita.");
    }
  };

  return (
    <ScrollView horizontal style={styles.carousel}>
      {visitas.length === 0 ? (
        <Text style={styles.noVisitsText}>No hay visitas futuras.</Text>
      ) : (
        visitas.map((visita) => (
          <View key={visita.id} style={styles.card}>
            <Text style={styles.cardTitle}>Cliente: {visita.cliente}</Text>
            <Text>Fecha: {visita.fecha}</Text>
            <Text>Hora: {visita.hora}</Text>
            <Text>Motivo: {visita.motivo}</Text>

            <Pressable
              style={styles.cancelButton}
              onPress={() =>
                Alert.alert(
                  "Cancelar visita",
                  "¿Estás seguro que deseas cancelar esta visita?",
                  [
                    { text: "No", style: "cancel" },
                    { text: "Sí", onPress: () => cancelarVisita(visita.id) },
                  ]
                )
              }
            >
              <Text style={styles.cancelButtonText}>Cancelar visita</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carousel: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 10,
    width: 250,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  noVisitsText: {
    fontStyle: "italic",
    color: "#999",
    marginLeft: 10,
    padding: 10,
  },
});
