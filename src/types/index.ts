export type AttachmentType = 'image' | 'video' | 'audio' | 'document';

export interface MessageAttachment {
  type: AttachmentType;
  url: string;
  name: string;
  size?: string;
  duration?: string;
  thumbnail?: string;
}

export interface Message {
  id: string;
  senderId: string; // 'me' or contactId
  text: string;
  timestamp: string; // e.g. "08.10"
  createdAt: number;
  attachment?: MessageAttachment;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string; // photo URL or single character
  avatarType: 'image' | 'letter';
  avatarBg?: string;
  verified: boolean;
  online: boolean;
  typing?: boolean;
  lastSeen: string;
  category?: 'Personal' | 'Design' | 'Work' | 'Favourites';
  unreadCount?: number;
  bio?: string;
  messages: Message[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  avatarType: 'image' | 'letter';
  avatarBg: string;
  bio: string;
  isLoggedIn: boolean;
}

export type NewsCategory = 'tech' | 'finance' | 'world' | 'sports';

export interface NewsNotification {
  id: string;
  contactId: string;
  contactName: string;
  category: NewsCategory;
  headline: string;
  source: string;
  timestamp: string;
  realMessage: string;
  createdAt: number;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
