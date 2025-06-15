// api/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.geminiApiKey;

if (!API_KEY || typeof API_KEY !== "string") {
  console.error("API Key de Gemini no encontrada o no es válida.");
}

const genAI = new GoogleGenerativeAI(API_KEY as string);

/**
 * Analiza datos de encuestas y comentarios para generar un reporte de inteligencia de negocio.
 * @param startDate - La fecha de inicio del periodo a analizar.
 * @param endDate - La fecha de fin del periodo a analizar.
 * @param dataToAnalyze - Un objeto con los datos de encuestas y comentarios.
 * @returns Un objeto JSON con el reporte analizado.
 */
export async function analyzeReports(
  startDate: Date,
  endDate: Date,
  dataToAnalyze: any
) {
  try {
    console.log("Generando reporte con Gemini...");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const dataString = JSON.stringify(dataToAnalyze, null, 2);

    const prompt = `
      Eres un analista de datos experto para una empresa de retail y distribución.
      Tu tarea es analizar un conjunto de datos que contiene resultados de encuestas de satisfacción y comentarios de evaluaciones internas para diferentes sucursales.

      El periodo de análisis es del ${startDate.toLocaleDateString()} al ${endDate.toLocaleDateString()}.

      A continuación, te proporciono los datos en formato JSON. La clave "survey" contiene datos de encuestas de clientes y "comentarios" contiene evaluaciones internas de la empresa sobre la sucursal.

      DATOS A ANALIZAR:
      \`\`\`json
      ${dataString}
      \`\`\`

      Basado en los datos proporcionados, genera un reporte conciso. Tu respuesta DEBE SER ÚNICAMENTE un objeto JSON válido con la siguiente estructura, sin texto adicional, explicaciones, ni la palabra "json":
      {
        "recommendations": [
          {
            "title": "string",
            "description": "string",
            "color": "#XXXXXX"
          }
        ],
        "sentimentAnalysis": {
          "stats": [
            { "emoji": "😊", "percentage": 0, "label": "POSITIVO", "color": "rgba(52, 211, 153, 0.2)" },
            { "emoji": "😐", "percentage": 0, "label": "NEUTRAL", "color": "rgba(251, 191, 36, 0.2)" },
            { "emoji": "😞", "percentage": 0, "label": "NEGATIVO", "color": "rgba(239, 68, 68, 0.2)" }
          ]
        },
        "feedbackAnalysis": {
          "intro": "string",
          "insight": "string",
          "stats": [
            { "value": "string", "label": "SATISFACCIÓN PROMEDIO" },
            { "value": "string", "label": "COMENTARIOS POSITIVOS" },
            { "value": "string", "label": "COMENTARIOS ANALIZADOS" }
          ]
        }
      }

      INSTRUCCIONES DETALLADAS PARA EL ANÁLISIS:
      1.  **Recommendations**: Identifica los 2 o 3 problemas más críticos o las oportunidades de mejora más significativas. Basa tus recomendaciones en las calificaciones más bajas de las encuestas (valores de 1 o 2 en 'entrega', 'disponibilidad', 'atencion', 'respuesta') y en los temas negativos recurrentes en los comentarios. Cuantifica el problema (ej: "X sucursales", "Y% de los comentarios"). Asigna un color hexadecimal relevante.
      2.  **Sentiment Analysis**: Analiza TODOS los textos en los campos 'comentarios' (tanto de las encuestas como de los comentarios internos). Clasifícalos como POSITIVO, NEUTRAL o NEGATIVO y calcula el porcentaje de cada uno sobre el total de comentarios. La suma de los porcentajes debe ser 100.
      3.  **Feedback Analysis**:
          - **intro**: Resume la cantidad de datos analizados (total de encuestas y total de comentarios internos).
          - **insight**: Busca una correlación interesante. Por ejemplo, relaciona las 'Estrellas' de los comentarios internos con los promedios de las encuestas de clientes para las mismas sucursales.
          - **stats**:
            - 'SATISFACCIÓN PROMEDIO': Calcula el promedio general considerando las calificaciones de las encuestas (1-5) y las 'Estrellas' (1-5) de los comentarios internos. Formatea el resultado a un decimal.
            - 'COMENTARIOS POSITIVOS': Usa el porcentaje que calculaste para el análisis de sentimiento.
            - 'COMENTARIOS ANALIZADOS': Suma el total de comentarios de las encuestas y el total de comentarios internos. Formatea como un número con 'k' si es mayor a 1000.

      Genera el objeto JSON directamente.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Respuesta CRUDA de Gemini:", text);

    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");

    if (startIndex !== -1 && endIndex !== -1) {
      const jsonString = text.substring(startIndex, endIndex + 1);
      console.log("JSON extraído y limpio:", jsonString);
      return JSON.parse(jsonString);
    } else {
      throw new Error(
        "La respuesta de la IA no contenía un objeto JSON válido."
      );
    }
  } catch (error) {
    console.error("Error al analizar los reportes con Gemini:", error);
    return null;
  }
}

