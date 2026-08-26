import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type {
  User,
  Conversation,
  Message,
  MessageType,
  MessageAttachment,
  Toast,
} from '@/types';
import {
  currentUser as mockCurrentUser,
  mockConversations,
  mockMessages,
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================
// Types
// ============================================================
type ActiveFilter = 'all' | 'unread' | 'groups' | 'favorites';

interface ChatContextValue {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  currentUser: User;
  searchQuery: string;
  activeFilter: ActiveFilter;
  isInfoPanelOpen: boolean;
  isNewChatModalOpen: boolean;
  isSearchOpen: boolean;
  isMobileShowingChat: boolean;
  toasts: Toast[];
  typingUsers: Record<string, string[]>;

  // Computed
  filteredConversations: Conversation[];
  activeConversation: Conversation | undefined;
  activeMessages: Message[];

  // Actions
  selectConversation: (id: string) => void;
  sendMessage: (
    content: string,
    type?: MessageType,
    attachments?: MessageAttachment[]
  ) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: ActiveFilter) => void;
  toggleInfoPanel: () => void;
  toggleNewChatModal: () => void;
  toggleSearch: () => void;
  goBackToList: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// ============================================================
// Context
// ============================================================
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// ============================================================
// Provider
// ============================================================
export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const currentUser: User = user || mockCurrentUser;

  // ---- Core state ----
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(mockConversations[0]?.id ?? null);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);

  // ---- UI state ----
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileShowingChat, setIsMobileShowingChat] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [typingUsers] = useState<Record<string, string[]>>({});

  // Toast auto-remove timers
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // ---- Actions ----

  const selectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);

      // Clear unread count for the selected conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id ? { ...conv, unreadCount: 0 } : conv,
        ),
      );

      // On mobile, show the chat panel
      setIsMobileShowingChat(true);

      // Close search & info panel when switching conversations
      setIsSearchOpen(false);
      setIsInfoPanelOpen(false);
    },
    [],
  );

  const sendMessage = useCallback(
    (
      content: string,
      type: MessageType = 'text',
      attachments?: MessageAttachment[]
    ) => {
      if (!activeConversationId) return;
      if (!content.trim() && (!attachments || attachments.length === 0)) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        conversationId: activeConversationId,
        senderId: currentUser.id,
        content: content.trim(),
        type,
        attachments,
        status: 'sent',
        createdAt: new Date(),
      };

      // Add message to the message list
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [
          ...(prev[activeConversationId] ?? []),
          newMessage,
        ],
      }));

      // Preview content
      let previewText = newMessage.content;
      if (type === 'image') previewText = '📷 Photo';
      if (type === 'file') previewText = '📎 Document';
      if (type === 'audio') previewText = '🎤 Voice message';

      // Update conversation's lastMessage and move it to top
      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                lastMessage: {
                  content: previewText,
                  senderId: currentUser.id,
                  senderName: currentUser.name || 'You',
                  createdAt: newMessage.createdAt,
                  type: newMessage.type,
                },
                updatedAt: newMessage.createdAt,
              }
            : conv,
        );

        // Move the active conversation to the top
        const activeIndex = updated.findIndex(
          (c) => c.id === activeConversationId,
        );
        if (activeIndex > 0) {
          const [active] = updated.splice(activeIndex, 1);
          updated.unshift(active);
        }

        return updated;
      });
    },
    [activeConversationId, currentUser.id, currentUser.name],
  );

  const toggleInfoPanel = useCallback(() => {
    setIsInfoPanelOpen((prev) => !prev);
  }, []);

  const toggleNewChatModal = useCallback(() => {
    setIsNewChatModalOpen((prev) => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const goBackToList = useCallback(() => {
    setIsMobileShowingChat(false);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration or 3 seconds
    const duration = toast.duration ?? 3000;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimers.current.delete(id);
    }, duration);

    toastTimers.current.set(id, timer);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));

    // Clear the auto-remove timer if it exists
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  // ---- Computed values ----

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Apply active filter
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter((c) => c.unreadCount > 0);
        break;
      case 'groups':
        filtered = filtered.filter((c) => c.type === 'group');
        break;
      case 'favorites':
        filtered = filtered.filter((c) => c.isFavorite);
        break;
      case 'all':
      default:
        break;
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.lastMessage?.content.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [conversations, activeFilter, searchQuery]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId],
  );

  const activeMessages = useMemo(
    () =>
      activeConversationId ? (messages[activeConversationId] ?? []) : [],
    [messages, activeConversationId],
  );

  // ---- Context value ----

  const value = useMemo<ChatContextValue>(
    () => ({
      conversations,
      activeConversationId,
      messages,
      currentUser,
      searchQuery,
      activeFilter,
      isInfoPanelOpen,
      isNewChatModalOpen,
      isSearchOpen,
      isMobileShowingChat,
      toasts,
      typingUsers,
      filteredConversations,
      activeConversation,
      activeMessages,
      selectConversation,
      sendMessage,
      setSearchQuery,
      setActiveFilter,
      toggleInfoPanel,
      toggleNewChatModal,
      toggleSearch,
      goBackToList,
      addToast,
      removeToast,
    }),
    [
      conversations,
      activeConversationId,
      messages,
      currentUser,
      searchQuery,
      activeFilter,
      isInfoPanelOpen,
      isNewChatModalOpen,
      isSearchOpen,
      isMobileShowingChat,
      toasts,
      typingUsers,
      filteredConversations,
      activeConversation,
      activeMessages,
      selectConversation,
      sendMessage,
      toggleInfoPanel,
      toggleNewChatModal,
      toggleSearch,
      goBackToList,
      addToast,
      removeToast,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// ============================================================
// Hook
// ============================================================
export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
