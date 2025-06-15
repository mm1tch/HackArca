// app.config.js
import "dotenv/config";

export default {
  expo: {
    name: "ArcaApp",
    slug: "ArcaApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "arcaapp",
    newArchEnabled: true,
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true,
    },
    extra: {
      geminiApiKey: process.env.GEMINI_API_KEY,
    },
  },
};
