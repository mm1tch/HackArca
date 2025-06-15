// app/reportes.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator, // Importamos el indicador de carga
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RecommendationCard } from "../components/RecommendationCard";
import { SentimentStatCard } from "../components/SentimentCard"; // Asegúrate que el nombre del archivo es correcto
import { FeedbackStatCard } from "../components/FeedbackStatCard";
import { analyzeReports } from "../api/gemini"; // Importamos la función de la API

// --- DATOS DE EJEMPLO (Se mantienen para fallback y desarrollo) ---
const recommendationsData = [
  {
    title: "Capacitación en Atención:",
    description: "23 sucursales requieren entrenamiento inmediato...",
    color: "#34D399",
  },
  {
    title: "Optimización de Inventario:",
    description: "Implementar sistema de reposición automática...",
    color: "#FBBF24",
  },
  {
    title: "Programa de Incentivos:",
    description: "Reconocer 8 sucursales top performers...",
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
  // --- ESTADOS ---
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // ✅ Estados para la API
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null); // Empezamos sin datos de la API

  // --- FUNCIONES ---
  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
  };
  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
  };

  // ✅ Función para llamar a Gemini
  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReportData(null); // Limpiamos datos anteriores
    try {
      const analysisResult = await analyzeReports(startDate, endDate);
      setReportData(analysisResult);
    } catch (error) {
      console.error(error);
      alert("Error al generar el reporte. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Variables para mostrar datos (de la API si existen, si no, los de ejemplo)
  const currentRecommendations =
    reportData?.recommendations ?? recommendationsData;
  const currentSentiment =
    reportData?.sentimentAnalysis?.stats ?? sentimentData;
  const currentFeedbackStats =
    reportData?.feedbackAnalysis?.stats ?? feedbackStatsData;
  const currentFeedbackIntro =
    reportData?.feedbackAnalysis?.intro ??
    "El análisis de sentimiento de 847 comentarios...";
  const currentFeedbackInsight =
    reportData?.feedbackAnalysis?.insight ??
    "🎯 Insight Clave: Las sucursales con comentarios...";

  return (
    <View style={styles.container}>
      {/* Barra de Título */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Visualización de Reportes</Text>
      </View>

      {/* Barra de Filtros */}
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
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateReport}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.generateButtonText}>Generar Reportes</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Tarjeta 1: Recomendaciones */}
        <View style={styles.cardContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Recomendaciones IA</Text>
            <View style={styles.iaStatusBadge}>
              <Text style={styles.iaStatusText}>IA GENERADO</Text>
            </View>
          </View>
          <Text style={styles.introText}>
            Basado en el análisis de datos, la IA ha identificado oportunidades
            de mejora prioritarias:
          </Text>
          <View style={styles.recommendationsList}>
            {currentRecommendations.map((rec: any, index: number) => (
              <RecommendationCard key={index} {...rec} />
            ))}
          </View>
        </View>

        {/* Tarjeta 2: Análisis de Sentimiento */}
        <View style={styles.cardContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Análisis de Sentimiento</Text>
            <View style={styles.iaStatusBadge}>
              <Text style={styles.iaStatusText}>IA GENERADO</Text>
            </View>
          </View>
          <Text style={styles.introText}>
            Evaluación automática del tono en comentarios de colaboradores y
            clientes:
          </Text>
          <View style={styles.statsRow}>
            {currentSentiment.map((stat: any, index: number) => (
              <SentimentStatCard key={index} {...stat} />
            ))}
          </View>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              💡 La IA detectó que sucursales con sentimiento negativo superior
              al 20% requieren intervención.
            </Text>
          </View>
        </View>

        {/* Tarjeta 3: Análisis de Feedback */}
        <View style={styles.cardContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Análisis de Feedback</Text>
            <View style={styles.iaStatusBadge}>
              <Text style={styles.iaStatusText}>IA GENERADO</Text>
            </View>
          </View>
          <Text style={styles.introText}>{currentFeedbackIntro}</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>{currentFeedbackInsight}</Text>
          </View>
          <View style={styles.feedbackStatsRow}>
            {currentFeedbackStats.map((stat: any, index: number) => (
              <FeedbackStatCard key={index} {...stat} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Selectores de Fecha */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        onConfirm={handleConfirmStartDate}
        onCancel={() => setStartDatePickerVisibility(false)}
        date={startDate}
        display="spinner"
        textColor="black"
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        onConfirm={handleConfirmEndDate}
        onCancel={() => setEndDatePickerVisibility(false)}
        date={endDate}
        display="spinner"
        textColor="black"
      />
    </View>
  );
}

// ✅ ESTILOS COMPLETOS Y CORRECTOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  titleBar: {
    backgroundColor: "#C31F39",
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  filterBar: {
    backgroundColor: "#F2F2F2",
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
  datePickerText: { color: "#333", marginRight: 4, fontSize: 16 },
  generateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
  },
  generateButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  mainContent: { padding: 20, paddingBottom: 40 },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  iaStatusBadge: {
    backgroundColor: "#8B5CF6",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  iaStatusText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  introText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 20,
  },
  recommendationsList: {},
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  insightBox: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
    marginBottom: 20,
  },
  insightText: { fontSize: 15, color: "#4C1D95", lineHeight: 22 },
  feedbackStatsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: -4,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  placeholderText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
});
