import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RecommendationCard } from "../components/RecommendationCard"; //llamamos al componente de tarjeta de recomendación
import { SentimentStatCard } from "../components/SentimentCard"; // Importamos el componente sentiment analisis
import { FeedbackStatCard } from "../components/FeedbackStatCard";

// Datos de ejemplo para las recomendaciones
const recommendationsData = [
  {
    title: "Capacitación en Atención:",
    description:
      "23 sucursales requieren entrenamiento inmediato en servicio al cliente (impacto potencial: +0.8 puntos)",
    color: "#34D399",
  },
  {
    title: "Optimización de Inventario:",
    description:
      "Implementar sistema de reposición automática en 15 ubicaciones críticas",
    color: "#FBBF24",
  },
  {
    title: "Programa de Incentivos:",
    description: "Reconocer 8 sucursales top performers como casos de éxito",
    color: "#60A5FA",
  },
];

const sentimentData = [
  {
    emoji: "😊",
    percentage: 67,
    label: "POSITIVO",
    color: "rgba(52, 211, 153, 0.2)",
  },
  {
    emoji: "😐",
    percentage: 21,
    label: "NEUTRAL",
    color: "rgba(251, 191, 36, 0.2)",
  },
  {
    emoji: "😞",
    percentage: 12,
    label: "NEGATIVO",
    color: "rgba(239, 68, 68, 0.2)",
  },
];

const feedbackStatsData = [
  { value: "4.2", label: "SATISFACCIÓN" },
  { value: "78%", label: "COMENTARIOS POSITIVOS" },
  { value: "2.1k", label: "COMENTARIOS ANALIZADOS" },
];

export default function ReportesScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Estado para controlar la visibilidad de los selectores de fecha
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // Funciones para manejar la selección de fechas
  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      {/* 1. Barra de Título (Roja) */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Visualización de Reportes</Text>
      </View>

      {/* 2. Barra de Filtros (Gris Claro) */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setStartDatePickerVisibility(true)}
        >
          <Text style={styles.datePickerText}>
            {startDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setEndDatePickerVisibility(true)}
        >
          <Text style={styles.datePickerText}>
            {endDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generar Reportes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.mainContent}>
        <View style={styles.cardContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Recomendaciones IA</Text>
            <View style={styles.iaStatusBadge}>
              <Text style={styles.iaStatusText}>IA GENERADO</Text>
            </View>
          </View>
          <Text style={styles.introText}>
            Basado en el análisis de 142 sucursales y patrones de satisfacción,
            la IA ha identificado oportunidades de mejora prioritarias:
          </Text>
          <View style={styles.recommendationsList}>
            {recommendationsData.map((rec, index) => (
              <RecommendationCard
                key={index}
                title={rec.title}
                description={rec.description}
                color={rec.color}
              />
            ))}
          </View>
        </View>

        {/* SEGUNDA TARJETA: Análisis de Sentimiento */}
        <View style={styles.cardContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Análisis - Sentimiento</Text>
            <View style={styles.iaStatusBadge}>
              <Text style={styles.iaStatusText}>IA GENERADO</Text>
            </View>
          </View>
          <Text style={styles.introText}>
            Evaluación automática del tono y sentimiento en comentarios de
            colaboradores y feedback de clientes:
          </Text>
          <View style={styles.statsRow}>
            {sentimentData.map((stat, index) => (
              <SentimentStatCard
                key={index}
                emoji={stat.emoji}
                percentage={stat.percentage}
                label={stat.label}
                color={stat.color}
              />
            ))}
          </View>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              💡 La IA detectó que sucursales con sentimiento negativo superior
              al 20% requieren intervención inmediata. Se identificaron 8 casos
              críticos.
            </Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {/* Encabezado */}
          <View style={styles.header}>
            <Text style={styles.title}>Análisis de Feedback</Text>
            <View style={styles.iaStatusBadge}>
              <Text style={styles.iaStatusText}>IA GENERADO</Text>
            </View>
          </View>

          {/* Párrafo de introducción */}
          <Text style={styles.introText}>
            El análisis de sentimiento de 847 comentarios de colaboradores y
            1,234 respuestas de clientes revela una correlación del 89% entre
            observaciones internas y satisfacción del cliente.
          </Text>

          {/* Caja de insight clave */}
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              🎯 Insight Clave: Las sucursales con comentarios positivos de
              colaboradores sobre "organización del inventario" muestran 23%
              mayor satisfacción del cliente.
            </Text>
          </View>

          {/* Fila de tarjetas de estadísticas */}
          <View style={styles.feedbackStatsRow}>
            {feedbackStatsData.map((stat, index) => (
              <FeedbackStatCard
                key={index}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Selectores de Fecha (Modales) */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmStartDate}
        onCancel={() => setStartDatePickerVisibility(false)}
        date={startDate}
        display="spinner"
        textColor="black"
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmEndDate}
        onCancel={() => setEndDatePickerVisibility(false)}
        date={endDate}
        display="spinner"
        textColor="black"
      />
    </View>
  );
}

const BRAND_RED = "#C31F39";
const BRAND_GREEN = "#4CAF50";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fondo blanco para el contenido
  },
  // Estilos para la barra de título
  titleBar: {
    backgroundColor: BRAND_RED,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  // Estilos para la nueva barra de filtros
  filterBar: {
    backgroundColor: "#F2F2F2", // Un gris claro
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    paddingVertical: 10,
  },
  datePickerText: {
    color: "#333",
    marginRight: 4,
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,

    justifyContent: "center",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Contenido principal de la página
  mainContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20, // Espacio entre las tarjetas grandes
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  iaStatusBadge: {
    backgroundColor: "#8B5CF6",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  iaStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  introText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 20,
  },
  // Nuevos estilos para esta sección
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  insightBox: {
    backgroundColor: "rgba(139, 92, 246, 0.1)", // Fondo morado muy claro
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6", // Borde morado
  },
  insightText: {
    fontSize: 15,
    color: "#4C1D95", // Texto morado oscuro
    lineHeight: 22,
  },
  recommendationsList: {},
  feedbackStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -6,
  },
});
