import { SquarePen } from 'lucide-react';
import { ChatSearch } from '@/components/sidebar/ChatSearch';
import { ChatFilters } from '@/components/sidebar/ChatFilters';
import { ConversationList } from '@/components/sidebar/ConversationList';
import { IconButton } from '@/components/ui/IconButton';
import { useChatContext } from '@/contexts/ChatContext';

export function ChatSidebar() {
  const { toggleNewChatModal, searchQuery, setSearchQuery } = useChatContext();

  return (
    <div className="flex flex-col h-full w-[380px] md:w-[400px] lg:w-[420px] bg-[var(--bg-primary)] border-r border-[var(--border)] shrink-0 max-md:w-full max-md:border-r-0 select-none">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Chats
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            icon={<SquarePen size={20} />}
            onClick={toggleNewChatModal}
            title="Start new conversation"
            size="md"
          />
        </div>
      </div>

      {/* Search */}
      <div className="px-6 pb-3.5 shrink-0">
        <ChatSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Filters */}
      <div className="px-6 pb-4 shrink-0">
        <ChatFilters />
      </div>

      {/* Conversation List */}
      <ConversationList />
    </div>
  );
}
