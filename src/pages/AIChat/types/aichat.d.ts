interface IConversation {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
