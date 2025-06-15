// app.config.js
import "dotenv/config";

export default {
  expo: {
    // ...todas tus otras configuraciones de app.json...
    extra: {
      geminiApiKey: process.env.GEMINI_API_KEY,
    },
  },
};
