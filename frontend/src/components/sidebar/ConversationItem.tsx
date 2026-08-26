import React from 'react';
import { BellOff, Check, CheckCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useChatContext } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Conversation } from '@/types';

interface ConversationItemProps {
  conversation: Conversation;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  if (msgDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export const ConversationItem = React.memo(function ConversationItem({
  conversation,
}: ConversationItemProps) {
  const { activeConversationId, selectConversation, typingUsers } =
    useChatContext();
  const { user } = useAuth();
  const currentUserId = user?.id || 'user-me';

  const isActive = activeConversationId === conversation.id;
  const isTyping = (typingUsers[conversation.id] || []).length > 0;

  // Find the other member for direct chats
  const otherMember = conversation.memberDetails?.find(
    (m) => m.id !== currentUserId
  );
  const isOnline =
    conversation.type === 'direct' ? otherMember?.isOnline ?? false : false;

  const lastMessagePreview = () => {
    if (isTyping) {
      return (
        <span className="text-[var(--accent)] font-medium animate-pulse">
          typing...
        </span>
      );
    }
    if (!conversation.lastMessage) return 'No messages yet';

    const isMine =
      conversation.lastMessage.senderId === currentUserId ||
      conversation.lastMessage.senderId === 'user-me';

    const prefix = isMine ? (
      <span className="inline-flex items-center mr-1">
        {conversation.lastMessage.type === 'text' ? (
          <CheckCheck size={15} className="text-[var(--read-receipt)]" />
        ) : (
          <Check size={15} className="text-[var(--unread-receipt)]" />
        )}
      </span>
    ) : conversation.type === 'group' && conversation.lastMessage.senderName ? (
      <span className="text-[var(--text-secondary)] font-medium">
        ~{conversation.lastMessage.senderName.split(' ')[0]}:{' '}
      </span>
    ) : null;

    let content = conversation.lastMessage.content;
    if (conversation.lastMessage.type === 'image') content = '📷 Photo';
    if (conversation.lastMessage.type === 'file') content = '📎 Document';

    return (
      <span className="flex items-center truncate">
        {prefix}
        <span className="truncate">{content}</span>
      </span>
    );
  };

  return (
    <button
      onClick={() => selectConversation(conversation.id)}
      className={`
        w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer
        transition-all duration-150 text-left border border-transparent
        ${
          isActive
            ? 'bg-[var(--bg-active)] shadow-md border-[var(--border-strong)]'
            : 'hover:bg-[var(--bg-hover)]'
        }
      `}
    >
      {/* Avatar with breathing room */}
      <div className="shrink-0">
        <Avatar
          src={conversation.avatar}
          name={conversation.name}
          size="lg"
          isOnline={isOnline}
          showOnlineIndicator={conversation.type === 'direct'}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        {/* Name & Timestamp Row */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15.5px] font-bold text-[var(--text-primary)] truncate">
            {conversation.name}
          </span>
          {conversation.lastMessage && (
            <span
              className={`text-[12px] shrink-0 font-medium ${
                conversation.unreadCount > 0
                  ? 'text-[var(--accent)] font-bold'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {formatTimestamp(new Date(conversation.lastMessage.createdAt))}
            </span>
          )}
        </div>

        {/* Message preview & Unread badge row */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-[13.5px] text-[var(--text-secondary)] truncate leading-normal flex-1 min-w-0 font-normal">
            {lastMessagePreview()}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {conversation.isMuted && (
              <BellOff
                size={15}
                className="text-[var(--text-secondary)] opacity-60"
              />
            )}
            {conversation.unreadCount > 0 && (
              <Badge count={conversation.unreadCount} />
            )}
          </div>
        </div>
      </div>
    </button>
  );
});
