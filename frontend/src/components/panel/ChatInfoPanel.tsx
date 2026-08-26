import {
  X,
  Bell,
  BellOff,
  Search,
  Image,
  Trash2,
  Ban,
  Flag,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { useChatContext } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/useMediaQuery';

export function ChatInfoPanel() {
  const { activeConversation, toggleInfoPanel, addToast } = useChatContext();
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

  const handleAction = (action: string) => {
    addToast({
      type: 'info',
      title: action,
      description: 'This feature will be available soon',
    });
  };

  return (
    <div
      className={`${
        isMobile
          ? 'fixed inset-0 z-40 bg-[var(--bg-primary)]'
          : 'w-[400px] border-l border-[var(--border)]'
      } flex flex-col h-full bg-[var(--bg-primary)] animate-slide-in-right shrink-0 select-none`}
    >
      {/* Header */}
      <div className="flex items-center gap-5 h-20 px-8 py-4 bg-[var(--header-bg)] border-b border-[var(--border)] shrink-0">
        <IconButton
          icon={<X size={22} />}
          onClick={toggleInfoPanel}
          title="Close details"
          size="md"
        />
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          Contact Details
        </h2>
      </div>

      {/* Scrollable Content with Generous Spacing */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-10 px-8 border-b border-[var(--border)] gap-2">
          <Avatar
            src={activeConversation.avatar}
            name={activeConversation.name}
            size="xl"
            isOnline={isOnline}
            showOnlineIndicator={activeConversation.type === 'direct'}
          />
          <h3 className="mt-4 text-2xl font-bold text-[var(--text-primary)] text-center tracking-tight">
            {activeConversation.name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            {activeConversation.type === 'direct'
              ? isOnline
                ? 'Active now'
                : 'Last seen recently'
              : `${activeConversation.members.length} members`}
          </p>
        </div>

        {/* About Section */}
        {activeConversation.type === 'direct' && otherMember?.about && (
          <div className="px-8 py-5 border-b border-[var(--border)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              About
            </p>
            <p className="text-[14.5px] text-[var(--text-primary)] leading-relaxed font-normal">
              {otherMember.about}
            </p>
          </div>
        )}

        {activeConversation.type === 'group' && activeConversation.description && (
          <div className="px-8 py-5 border-b border-[var(--border)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Group Description
            </p>
            <p className="text-[14.5px] text-[var(--text-primary)] leading-relaxed font-normal">
              {activeConversation.description}
            </p>
          </div>
        )}

        {/* Media, Links, Docs */}
        <button
          onClick={() => handleAction('Media, Links & Docs')}
          className="w-full flex items-center justify-between px-8 py-4 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer border-b border-[var(--border)]"
        >
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">
            Media, Links & Docs
          </span>
          <ChevronRight size={20} className="text-[var(--text-secondary)]" />
        </button>

        {/* Media Grid Preview with Spacing */}
        <div className="px-8 py-5 border-b border-[var(--border)]">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-[var(--bg-input)] flex items-center justify-center border border-[var(--border)] hover:opacity-80 cursor-pointer transition-all hover:scale-105 shadow-sm"
              >
                <Image
                  size={22}
                  className="text-[var(--text-secondary)] opacity-50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Group Members */}
        {activeConversation.type === 'group' &&
          activeConversation.memberDetails && (
            <div className="border-b border-[var(--border)]">
              <div className="px-8 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {activeConversation.members.length} Members
                </p>
              </div>
              <div className="space-y-2 px-4 pb-4">
                {activeConversation.memberDetails.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--bg-hover)] rounded-2xl transition-colors"
                  >
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="md"
                      isOnline={member.isOnline}
                      showOnlineIndicator
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {member.id === currentUserId ? 'You' : member.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                        {member.about || 'Available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Actions */}
        <div className="py-3">
          <InfoAction
            icon={<Star size={20} />}
            label={activeConversation.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => handleAction('Favorites')}
          />
          <InfoAction
            icon={activeConversation.isMuted ? <Bell size={20} /> : <BellOff size={20} />}
            label={activeConversation.isMuted ? 'Unmute notifications' : 'Mute notifications'}
            onClick={() => handleAction('Mute')}
          />
          <InfoAction
            icon={<Search size={20} />}
            label="Search in conversation"
            onClick={() => handleAction('Search')}
          />
        </div>

        <div className="border-t border-[var(--border)] py-3">
          <InfoAction
            icon={<Trash2 size={20} />}
            label="Clear chat"
            onClick={() => handleAction('Clear chat')}
            danger
          />
          <InfoAction
            icon={<Ban size={20} />}
            label="Block contact"
            onClick={() => handleAction('Block')}
            danger
          />
          <InfoAction
            icon={<Flag size={20} />}
            label="Report contact"
            onClick={() => handleAction('Report')}
            danger
          />
        </div>
      </div>
    </div>
  );
}

function InfoAction({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-8 py-3.5 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer text-sm font-semibold ${
        danger ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
