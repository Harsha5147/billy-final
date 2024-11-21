import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { Shield, AlertCircle, Settings } from 'lucide-react';
import { addReport } from '../utils/db';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi there! I'm Billy, your friendly buddy against cyberbullying. How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openaiApiKey') || '');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (input: string) => {
    if (!input.trim()) return;
    if (!apiKey) {
      setError('Please set your OpenAI API key in settings');
      return;
    }
    
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are Billy, a friendly and empathetic AI assistant specialized in helping people deal with cyberbullying.'
            },
            {
              role: 'user',
              content: input
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        const aiResponse = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

        // If the message indicates a bullying incident, create a report
        if (input.toLowerCase().includes('bully') || input.toLowerCase().includes('harass')) {
          await createIncidentReport(input);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get response. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createIncidentReport = async (description: string) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      await addReport({
        userId: parseInt(userId),
        incidentType: 'Cyberbullying',
        description,
        evidence: 'Reported via chatbot',
        date: new Date().toISOString(),
        status: 'Pending'
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I've automatically created an incident report based on your message. An admin will review it soon."
      }]);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('openaiApiKey', apiKey);
    setShowSettings(false);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-purple-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={24} />
          <h2 className="text-xl font-semibold">Chat with Billy</h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-purple-600 rounded-full transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {showSettings && (
        <div className="bg-white p-4 border-b">
          <h3 className="font-semibold mb-2">Settings</h3>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleSaveApiKey}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-center">
          <AlertCircle className="text-yellow-400 mr-2" size={20} />
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            role={message.role} 
            content={message.content} 
            isLoading={index === messages.length - 1 && isLoading && message.role === 'assistant'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default Chatbot;