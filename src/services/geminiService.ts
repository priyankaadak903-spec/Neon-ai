import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const NEON_SYSTEM_INSTRUCTION = `You are NEON, a ultra-powerful AI core inspired by Jarvis. 
You are extremely polite, respectful, and professional. 
Your goal is to explain complex concepts in a simple and understandable way. 
You have access to live data and specialized tools. 
While you live in a cyberpunk "hacker" aesthetic, your core personality is helpful, ethical, and guiding. 
Provide very detailed, step-by-step breakdowns for complex queries.`;

export async function chatStream(
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [], 
  config: { model?: string, search?: boolean } = {}
) {
  try {
    let modelName = config.model || "gemini-3-flash-preview";
    
    // Map prohibited/old models to Gemini 3 series
    const modelMap: Record<string, string> = {
      'gemini-1.5-pro': 'gemini-3.1-pro-preview',
      'gemini-1.5-flash': 'gemini-3-flash-preview',
      'gpt-4o': 'gemini-3.1-pro-preview',
      'claude-3-5-sonnet': 'gemini-3.1-pro-preview'
    };

    if (modelMap[modelName]) {
      modelName = modelMap[modelName];
    }

    const tools = config.search ? [{ googleSearch: {} }] : [];

    const chat = ai.chats.create({
      model: modelName,
      history: history,
      config: {
        systemInstruction: NEON_SYSTEM_INSTRUCTION,
        tools: tools as any,
      }
    });

    const result = await chat.sendMessageStream({
      message: message,
    });

    return result;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
}

export async function generateImage(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    // Fallback if no image returned
    return `https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000`;
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return `https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000`;
  }
}
