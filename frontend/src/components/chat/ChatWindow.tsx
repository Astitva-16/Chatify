import { useChatContext } from '@/contexts/ChatContext';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { MessageComposer } from '@/components/chat/MessageComposer';
import { SearchMessages } from '@/components/modals/SearchMessages';
import { MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMediaQuery';

export function ChatWindow() {
  const { activeConversationId, activeConversation } = useChatContext();
  const isMobile = useIsMobile();

  if (!activeConversationId || !activeConversation) {
    if (isMobile) return null;
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-chat)] chat-wallpaper h-full">
        <div className="text-center animate-fade-in p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[var(--accent)]/15 flex items-center justify-center shadow-lg shadow-[var(--accent)]/10">
            <MessageSquare size={48} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
            Connect Messenger
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            Send and receive messages in real time. Select a conversation from the sidebar to start chatting.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--online)]" />
            End-to-end encrypted
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[var(--bg-chat)]">
      {/* Sticky Top Header */}
      <ChatHeader />

      {/* In-Chat Search Bar (when opened) */}
      <SearchMessages />

      {/* Independently Scrollable Message Area */}
      <MessageList />

      {/* Fixed Bottom Message Composer */}
      <MessageComposer />
    </div>
  );
}
