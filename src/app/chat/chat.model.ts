export interface ChatMessage {
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  source_name: string;
}
