
import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askAssistant = async (query: string, data: PortfolioData): Promise<string> => {
  try {
    const context = `
      You are an AI assistant for a portfolio website. 
      You are representing ${data.profile.name}, a ${data.profile.role}.
      
      PORTFOLIO DATA:
      Profile: ${JSON.stringify(data.profile)}
      Projects: ${JSON.stringify(data.projects)}
      Skills: ${JSON.stringify(data.skills)}
      Experience: ${JSON.stringify(data.experience)}
      
      RULES:
      1. Answer questions concisely like a professional assistant.
      2. If a recruiter asks why they should hire the candidate, give a compelling 2-3 sentence pitch based on their skills and projects.
      3. Use a friendly but professional tone.
      4. Keep the answer under 100 words.
      5. If the question is unrelated to the portfolio, politely redirect them.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: ${context}\n\nQuestion: ${query}`,
    });

    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Assistant offline. Please check the console.";
  }
};
