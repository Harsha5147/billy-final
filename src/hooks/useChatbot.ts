import { useState, useCallback } from 'react';
import { ChatMessage, ChatContext } from '../types/chatbot';
import { createChatMessage, shouldCreateReport, validateMessage } from '../utils/chatHelpers';
import { getChatbotResponse } from '../utils/gemini';
import { addReport } from '../utils/db';

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!validateMessage(content)) {
      setError('Message is too long or empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message
      const userMessage = createChatMessage(content, 'user');
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const response = await getChatbotResponse(content);
      const botMessage = createChatMessage(response, 'bot');
      setMessages(prev => [...prev, botMessage]);

      // Check if we should create a report
      if (shouldCreateReport(content)) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          await addReport({
            userId: parseInt(userId),
            incidentType: 'Cyberbullying',
            description: content,
            evidence: 'Reported via chatbot',
            date: new Date().toISOString(),
            status: 'Pending',
            reporterName: localStorage.getItem('fullName') || 'Anonymous'
          });
        }
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError: () => setError(null)
  };
}

export default useChatbot;