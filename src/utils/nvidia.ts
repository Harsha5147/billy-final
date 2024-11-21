import { getChatbotResponse as getGeminiResponse } from './gemini';

const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;
const NVIDIA_API_ENDPOINT = 'https://api.nvidia.com/v1/chat/completions';

interface NvidiaResponse {
  response: string;
  error?: string;
}

export async function getNvidiaResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(NVIDIA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{
          role: 'system',
          content: 'You are Billy, a friendly and empathetic AI assistant specialized in helping people deal with cyberbullying.'
        }, {
          role: 'user',
          content: prompt
        }],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from NVIDIA API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('NVIDIA API Error:', error);
    return getGeminiResponse(prompt); // Fallback to Gemini if NVIDIA fails
  }
}