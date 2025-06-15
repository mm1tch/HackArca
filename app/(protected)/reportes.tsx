// app/reportes.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RecommendationCard } from "../../components/RecommendationCard";
import { SentimentStatCard } from "../../components/SentimentCard";
import { FeedbackStatCard } from "../../components/FeedbackStatCard";
import { analyzeReports } from "../../api/gemini";

export default function ReportesScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReportData(null);

    // Aseguramos que la hora de endDate sea el final del día
    endDate.setHours(23, 59, 59, 999);

    try {
      // 1. Obtener todas las encuestas
      const surveysResponse = await fetch("http://10.22.204.147:5050/api/surveys");
      const allSurveysData = await surveysResponse.json();

      // 2. Filtrar encuestas por el rango de fechas seleccionado
      const filteredSurveys = allSurveysData.filter((s: any) => {
        const surveyDate = new Date(s.fecha);
        return surveyDate >= startDate && surveyDate <= endDate;
      });

      if (filteredSurveys.length === 0) {
        alert("No se encontraron datos en el rango de fechas seleccionado.");
        setIsLoading(false);
        return;
      }
      
      console.log(`Se encontraron ${filteredSurveys.length} encuestas en el rango.`);

      // 3. Para cada encuesta filtrada, obtener los comentarios internos correspondientes
      const dataToAnalyze = await Promise.all(
        filteredSurveys.map(async (survey: any) => {
          try {
            const commentsResponse = await fetch(
              `http://10.22.204.147:5050/api/comentarios?nombreSucursal=${encodeURIComponent(
                survey.sucursal
              )}`
            );
            const commentsData = await commentsResponse.json().catch(() => []); // Si hay error en el JSON, devolver array vacío
            return {
              survey: {
                id: survey.id,
                sucursal: survey.sucursal,
                fecha: survey.fecha,
                scores: {
                    entrega: survey.survey.entrega,
                    disponibilidad: survey.survey.disponibilidad,
                    promocional: survey.survey.promocional,
                    atencion: survey.survey.atencion,
                    respuesta: survey.survey.respuesta,
                },
                comentarios: survey.survey.comentarios,
              },
              comentarios_internos: commentsData || [],
            };
          } catch (e) {
            console.error(`Error al obtener comentarios para ${survey.sucursal}:`, e);
            // Devolver solo la encuesta si los comentarios fallan
            return { survey, comentarios_internos: [] };
          }
        })
      );
      
      // 4. Enviar los datos combinados y filtrados a Gemini para análisis
      const geminiResponse = await analyzeReports(startDate, endDate, dataToAnalyze);

      if (!geminiResponse) {
          throw new Error("La respuesta de Gemini fue nula o inválida.");
      }

      setReportData(geminiResponse);
    } catch (error) {
      console.error("Error detallado al generar el reporte:", error);
      alert("Error al generar el reporte. Revisa la consola para más detalles.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentRecommendations = reportData?.recommendations ?? [];
  const currentSentiment = reportData?.sentimentAnalysis?.stats ?? [];
  const currentFeedbackStats = reportData?.feedbackAnalysis?.stats ?? [];
  const currentFeedbackIntro =
    reportData?.feedbackAnalysis?.intro ?? "Selecciona un rango de fechas y genera un reporte para ver el análisis.";
  const currentFeedbackInsight =
    reportData?.feedbackAnalysis?.insight ?? "No hay insights disponibles hasta que se genere un reporte.";

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Visualización de Reportes</Text>
      </View>

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
        {isLoading && (
            <View style={styles.placeholderContainer}>
                <ActivityIndicator size="large" color="#C31F39" />
                <Text style={styles.placeholderText}>Generando análisis con IA... Esto puede tardar un momento.</Text>
            </View>
        )}
        {!isLoading && !reportData && (
             <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>
                    Selecciona un rango de fechas y presiona "Generar Reportes" para que la IA analice los datos.
                </Text>
            </View>
        )}
        {reportData && (
          <>
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
                {currentRecommendations.length > 0 ? (
                  currentRecommendations.map((rec: any, index: number) => (
                    <RecommendationCard key={index} {...rec} />
                  ))
                ) : <Text>No se generaron recomendaciones.</Text>}
              </View>
            </View>

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
                {currentSentiment.length > 0 ? (
                  currentSentiment.map((stat: any, index: number) => (
                    <SentimentStatCard key={index} {...stat} />
                  ))
                ) : <Text>No se pudo analizar el sentimiento.</Text>}
              </View>
            </View>

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
                {currentFeedbackStats.length > 0 ? (
                  currentFeedbackStats.map((stat: any, index: number) => (
                    <FeedbackStatCard key={index} {...stat} />
                  ))
                ) : <Text>No hay estadísticas disponibles.</Text>}
              </View>
            </View>
          </>
        )}
      </ScrollView>

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
    padding: 16,
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
  title: { fontSize: 20, fontWeight: "bold", color: "#111827" },

  iaStatusBadge: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    maxHeight: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  iaStatusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  introText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 20,
  },

  recommendationsList: {},

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    gap: 12,
    rowGap: 16,
    marginTop: 4,
  },

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
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
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

