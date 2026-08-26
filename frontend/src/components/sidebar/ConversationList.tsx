import { useChatContext } from '@/contexts/ChatContext';
import { ConversationItem } from '@/components/sidebar/ConversationItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquare, Search } from 'lucide-react';

export function ConversationList() {
  const { filteredConversations, searchQuery } = useChatContext();

  if (filteredConversations.length === 0) {
    if (searchQuery) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <EmptyState
            icon={<Search size={48} />}
            title="No chats found"
            description={`We couldn't find any results matching "${searchQuery}"`}
          />
        </div>
      );
    }
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={<MessageSquare size={48} />}
          title="No conversations yet"
          description="Start a new chat to begin messaging with your contacts"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
      {filteredConversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}
