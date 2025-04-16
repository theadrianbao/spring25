export interface ChatMessage {
    content: string;
    username: string;
    timestamp: Date;
    is_read: boolean;
    client_offset: string;
  }
  