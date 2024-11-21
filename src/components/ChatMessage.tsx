import React from 'react';
import { MessageCircle, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isLoading }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500 ml-2' : 'bg-purple-500 mr-2'
        }`}>
          {isUser ? <User size={20} className="text-white" /> : <MessageCircle size={20} className="text-white" />}
        </div>
        <div 
          className={`rounded-lg px-4 py-2 ${
            isUser ? 'bg-blue-500 text-white' : 'bg-purple-50 text-gray-800'
          } shadow-sm ${isLoading ? 'animate-pulse' : ''}`}
        >
          {content}
          {isLoading && (
            <div className="flex space-x-1 mt-2">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;