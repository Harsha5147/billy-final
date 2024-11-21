export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  message: string;
  type: 'general' | 'emergency' | 'support' | 'advice';
  shouldReport: boolean;
}

export interface ChatContext {
  sessionId: string;
  messageHistory: ChatMessage[];
  userInfo?: {
    name?: string;
    isLoggedIn: boolean;
  };
}