import {
  ArrowLeft,
  Video,
  Phone,
  Search,
  MoreVertical,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { useChatContext } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/useMediaQuery';

export function ChatHeader() {
  const {
    activeConversation,
    toggleInfoPanel,
    toggleSearch,
    goBackToList,
    typingUsers,
  } = useChatContext();
  const { user } = useAuth();
  const currentUserId = user?.id || 'user-me';
  const isMobile = useIsMobile();

  if (!activeConversation) return null;

  const otherMember = activeConversation.memberDetails?.find(
    (m) => m.id !== currentUserId
  );
  const isOnline =
    activeConversation.type === 'direct'
      ? otherMember?.isOnline ?? false
      : false;

  const typingInChat = typingUsers[activeConversation.id] || [];
  const isTyping = typingInChat.length > 0;

  const getStatusText = () => {
    if (isTyping) {
      if (activeConversation.type === 'group') {
        const typingName = activeConversation.memberDetails?.find(
          (m) => typingInChat.includes(m.id)
        )?.name?.split(' ')[0];
        return `${typingName || 'Someone'} is typing...`;
      }
      return 'typing...';
    }
    if (activeConversation.type === 'group') {
      const memberCount = activeConversation.members.length;
      return `${memberCount} members`;
    }
    if (isOnline) return 'Active now';
    if (otherMember?.lastSeen) {
      const lastSeen = new Date(otherMember.lastSeen);
      const now = new Date();
      const diffMs = now.getTime() - lastSeen.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 60) return `last seen ${diffMins}m ago`;
      if (diffMins < 1440) return `last seen ${Math.floor(diffMins / 60)}h ago`;
      return `last seen ${lastSeen.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return 'last seen recently';
  };

  return (
    <div className="flex items-center justify-between gap-6 h-20 px-8 py-4 bg-[var(--header-bg)] border-b border-[var(--border)] shrink-0 z-10 select-none">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Back button - mobile only */}
        {isMobile && (
          <IconButton
            icon={<ArrowLeft size={22} />}
            onClick={goBackToList}
            title="Back to conversations"
            size="md"
          />
        )}

        {/* Avatar & Info with Generous Gaps */}
        <button
          onClick={toggleInfoPanel}
          className="flex items-center gap-4 min-w-0 cursor-pointer text-left group"
        >
          <Avatar
            src={activeConversation.avatar}
            name={activeConversation.name}
            size="lg"
            isOnline={isOnline}
            showOnlineIndicator={activeConversation.type === 'direct'}
          />
          <div className="flex flex-col min-w-0 gap-0.5">
            <span className="text-[17px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate leading-snug">
              {activeConversation.name}
            </span>
            <div className="flex items-center gap-2">
              {isOnline && activeConversation.type === 'direct' && (
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--online)] shadow-sm" />
              )}
              <span
                className={`text-[13px] truncate font-medium ${
                  isTyping
                    ? 'text-[var(--accent)] animate-pulse'
                    : isOnline
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {getStatusText()}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Action Buttons with Generous Gaps (gap-3) */}
      <div className="flex items-center gap-3 shrink-0">
        {!isMobile && (
          <>
            <IconButton
              icon={<Video size={20} />}
              title="Video call"
              size="md"
            />
            <IconButton
              icon={<Phone size={19} />}
              title="Voice call"
              size="md"
            />
          </>
        )}
        <IconButton
          icon={<Search size={19} />}
          onClick={toggleSearch}
          title="Search messages"
          size="md"
        />
        <IconButton
          icon={<MoreVertical size={19} />}
          onClick={toggleInfoPanel}
          title="Contact details & media"
          size="md"
        />
      </div>
    </div>
  );
}
