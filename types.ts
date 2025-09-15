export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'user' | 'admin';
  about?: string;
  notes?: string[];
  music?: { artist: string; song: string; albumArt: string; } | null;
  likes?: number;
  status: 'online' | 'offline';
  lastSeen?: number;
}

export interface PollData {
  question: string;
  options: {
    id: string;
    text: string;
    votes: string[]; // Array of user IDs
  }[];
}

export interface Attachment {
    type: 'image' | 'file' | 'gif';
    url: string; 
    name?: string;
    size?: number; // in bytes
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
  isDeleted?: boolean;
  isForwarded?: boolean;
  poll?: PollData;
  attachment?: Attachment;
}

export interface Chat {
  id: string;
  type: 'group' | 'direct';
  name?: string; // For groups
  description?: string; // For groups
  participants: string[]; // Array of user IDs
  adminIds?: string[]; // For groups
  messages: Message[];
  avatar?: string; // For groups
  isPinned?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;
  pinnedMessageId?: string;
  isPrivate?: boolean;
}

export interface Reaction {
  userId: string;
  emoji: string;
}

export interface Status {
  id: string;
  userId: string;
  type: 'text' | 'image';
  content: string; // URL for image, text content for text
  timestamp: number;
  viewers: string[]; // Array of user IDs who have viewed the status
  reactions: Reaction[];
}