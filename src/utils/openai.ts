import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
  console.error('Missing OpenAI API key. Please add VITE_OPENAI_API_KEY to your .env file');
}

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
});

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

Never share personal information or encourage unsafe behavior.

Keep responses concise and focused on helping the user with their specific situation.`;

export async function getOpenAIResponse(prompt: string): Promise<string> {
  if (!API_KEY) {
    return "I'm sorry, but I'm not properly configured at the moment. Please contact the administrator.";
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: SAFETY_PROMPT },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm sorry, I'm having trouble responding right now. If you need immediate help, please contact a trusted adult or support service.";
  }
}