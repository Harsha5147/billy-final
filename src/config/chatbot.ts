export const chatbotConfig = {
  initialMessage: "Hi! I'm Billy, your friendly buddy against cyberbullying. How can I help you today?",
  triggerWords: [
    'bully',
    'harass',
    'threat',
    'scared',
    'hurt',
    'mean',
    'abuse',
    'attack',
    'insult'
  ],
  supportResources: {
    emergency: '911',
    hotline: '1-800-273-8255',
    website: 'https://www.stopbullying.gov'
  },
  responseTypes: {
    GENERAL: 'general',
    EMERGENCY: 'emergency',
    SUPPORT: 'support',
    ADVICE: 'advice'
  },
  maxMessageLength: 500,
  typingDelay: 500,
  autoReportThreshold: 0.7
};