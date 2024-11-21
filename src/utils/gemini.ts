import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SAFETY_PROMPT = `You are Billy, a friendly and empathetic AI assistant specialized in helping people deal with cyberbullying. 
Your responses should be:
1. Supportive and understanding
2. Clear and actionable
3. Age-appropriate
4. Focused on safety and well-being

If someone appears to be in immediate danger, always recommend:
1. Speaking with a trusted adult
2. Contacting relevant authorities
3. Using available support services

Key guidelines:
- Never share personal information
- Encourage documenting incidents
- Suggest blocking and reporting abusers
- Promote positive online behavior
- Emphasize the importance of seeking help

Keep responses concise (2-3 paragraphs max) and focused on helping the user with their specific situation.`;

export async function getChatbotResponse(prompt: string): Promise<string> {
  if (!API_KEY) {
    return "I'm sorry, but I'm not properly configured at the moment. Please contact the administrator.";
  }

  try {
    const result = await model.generateContent([SAFETY_PROMPT, prompt]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm having trouble responding right now. If you need immediate help, please contact a trusted adult or support service.";
  }
}