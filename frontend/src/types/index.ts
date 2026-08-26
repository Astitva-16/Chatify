// ============================================================
// Connect — Data Model Types
// Structured for Supabase integration
// ============================================================

export type Theme = 'light' | 'dark' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type MessageType =
  | 'text'
  | 'image'
  | 'file'
  | 'link'
  | 'reply'
  | 'emoji'
  | 'audio';
export type ConversationType = 'direct' | 'group';
export type UserStatus = 'online' | 'offline' | 'away';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  about: string;
  phone?: string;
  lastSeen: Date;
  isOnline: boolean;
  status: UserStatus;
}

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
  isTyping: boolean;
  typingInConversation?: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  name: string;
  size: number;
  previewUrl?: string;
  mimeType?: string;
  duration?: number; // For audio messages (in seconds)
}

export interface LinkPreviewData {
  url: string;
  domain: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  replyTo?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
  };
  attachments?: MessageAttachment[];
  linkPreview?: LinkPreviewData;
  createdAt: Date;
  editedAt?: Date;
  isDeleted?: boolean;
}

export interface ConversationMember {
  conversationId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  lastReadAt?: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar: string;
  description?: string;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName?: string;
    createdAt: Date;
    type: MessageType;
  };
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  members: string[];
  memberDetails?: User[];
  typingUsers?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatFilter {
  type: 'all' | 'unread' | 'groups' | 'favorites';
}

export interface SearchResult {
  messageId: string;
  conversationId: string;
  content: string;
  senderName: string;
  timestamp: Date;
  matchIndex: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}
