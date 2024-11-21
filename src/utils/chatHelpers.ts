import { ChatMessage, ChatContext, ChatResponse } from '../types/chatbot';
import { chatbotConfig } from '../config/chatbot';

export function createChatMessage(content: string, type: 'user' | 'bot'): ChatMessage {
  return {
    id: crypto.randomUUID(),
    type,
    content,
    timestamp: new Date()
  };
}

export function shouldCreateReport(message: string): boolean {
  const words = message.toLowerCase().split(' ');
  const triggerWords = chatbotConfig.triggerWords;
  const matches = words.filter(word => triggerWords.includes(word));
  return matches.length / words.length >= chatbotConfig.autoReportThreshold;
}

export function analyzeMessageSeverity(message: string): 'low' | 'medium' | 'high' {
  const triggerWordCount = chatbotConfig.triggerWords.filter(word => 
    message.toLowerCase().includes(word)
  ).length;

  if (triggerWordCount >= 3) return 'high';
  if (triggerWordCount >= 1) return 'medium';
  return 'low';
}

export function formatBotResponse(response: string): string {
  return response
    .trim()
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .replace(/^["\s]+|["\s]+$/g, ''); // Remove quotes and extra spaces
}

export function validateMessage(message: string): boolean {
  return message.length > 0 && message.length <= chatbotConfig.maxMessageLength;
}

export function getEmergencyResources(): string {
  return `
    If you need immediate help:
    - Emergency: ${chatbotConfig.supportResources.emergency}
    - Support Hotline: ${chatbotConfig.supportResources.hotline}
    - Visit: ${chatbotConfig.supportResources.website}
  `.trim();
}