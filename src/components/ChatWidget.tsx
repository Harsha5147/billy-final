import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { getChatbotResponse } from '../utils/gemini';
import { addReport } from '../utils/db';

interface Message {
  type: 'user' | 'bot';
  text: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: "Hi! I'm Billy, your friendly buddy against cyberbullying. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createReport = async (content: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      await addReport({
        userId: parseInt(userId),
        incidentType: 'Cyberbullying',
        description: content,
        evidence: 'Reported via chat widget',
        date: new Date().toISOString(),
        status: 'Pending',
        reporterName: localStorage.getItem('fullName') || 'Anonymous'
      });

      setMessages(prev => [...prev, {
        type: 'bot',
        text: "I've created a report based on your message. Our team will review it soon."
      }]);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(userMessage);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);

      // Automatically create report if message indicates bullying
      if (
        userMessage.toLowerCase().includes('bully') ||
        userMessage.toLowerCase().includes('harass') ||
        userMessage.toLowerCase().includes('threat') ||
        userMessage.toLowerCase().includes('scared')
      ) {
        await createReport(userMessage);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: "I'm having trouble responding right now. If you need immediate help, please use the Report button above."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle size={24} />
      </button>

      <div
        className={`fixed bottom-4 right-4 w-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl transition-all duration-300 transform ${
          isOpen ? 'scale-100' : 'scale-0'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-white" />
            <h3 className="text-white font-semibold">Chat with Billy</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 p-3 rounded-lg flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatWidget;