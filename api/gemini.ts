import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.geminiApiKey;

if (!API_KEY || typeof API_KEY !== "string") {
  console.error("API Key de Gemini no encontrada o no es válida.");
}

const genAI = new GoogleGenerativeAI(API_KEY as string);

// ✅ NUEVA FUNCIÓN PARA LOS REPORTES
export async function analyzeReports(startDate: Date, endDate: Date) {
  try {
    console.log("Generando reporte con Gemini...");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    // Este es el "prompt" o la instrucción para la IA. Es la parte más importante.
    // Lo hacemos muy específico para que nos devuelva un JSON con la estructura exacta que queremos.
    const prompt = `
      Eres un analista de datos experto para una empresa.
      Analiza los datos de feedback de clientes y colaboradores entre las fechas ${startDate.toLocaleDateString()} y ${endDate.toLocaleDateString()}.

      Genera un reporte conciso y devuelve la respuesta ÚNICAMENTE como un objeto JSON válido con la siguiente estructura:
      {
        "recommendations": [
          {
            "title": "Capacitación en Atención:",
            "description": "23 sucursales requieren entrenamiento inmediato en servicio al cliente (impacto potencial: +0.8 puntos)",
            "color": "#34D399"
          },
          {
            "title": "Optimización de Inventario:",
            "description": "Implementar sistema de reposición automática en 15 ubicaciones críticas",
            "color": "#FBBF24"
          }
        ],
        "sentimentAnalysis": [
          { "emoji": "😊", "percentage": 67, "label": "POSITIVO", "color": "rgba(52, 211, 153, 0.2)" },
          { "emoji": "😐", "percentage": 21, "label": "NEUTRAL", "color": "rgba(251, 191, 36, 0.2)" },
          { "emoji": "😞", "percentage": 12, "label": "NEGATIVO", "color": "rgba(239, 68, 68, 0.2)" }
        ],
        "feedbackAnalysis": {
          "intro": "El análisis de sentimiento de 847 comentarios de colaboradores y 1,234 respuestas de clientes revela una correlación del 89% entre observaciones internas y satisfacción del cliente.",
          "insight": "🎯 Insight Clave: Las sucursales con comentarios positivos de colaboradores sobre \\"organización del inventario\\" muestran 23% mayor satisfacción del cliente.",
          "stats": [
            { "value": "4.2", "label": "SATISFACCIÓN PROMEDIO" },
            { "value": "78%", "label": "COMENTARIOS POSITIVOS" },
            { "value": "2.1k", "label": "COMENTARIOS ANALIZADOS" }
          ]
        }
      }
      Por favor, asegúrate de que los datos sean realistas pero inventados para esta demostración.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Respuesta CRUDA de Gemini:", text);

    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");

    if (startIndex !== -1 && endIndex !== -1) {
      // Extraemos solo la cadena que parece ser el JSON
      const jsonString = text.substring(startIndex, endIndex + 1);
      console.log("JSON extraído y limpio:", jsonString); // ✅ AÑADE ESTO
      return JSON.parse(jsonString);
    } else {
      // Si no encontramos un JSON, lanzamos un error claro
      throw new Error(
        "La respuesta de la IA no contenía un objeto JSON válido."
      );
    }
  } catch (error) {
    // ...
  }
}
