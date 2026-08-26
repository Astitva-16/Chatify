import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { DateSeparator } from '@/components/chat/DateSeparator';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import type { Message } from '@/types';

function getDateLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return 'Today';
  if (msgDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function shouldShowDateSeparator(
  current: Message,
  previous: Message | undefined
): boolean {
  if (!previous) return true;
  const currDate = new Date(current.createdAt);
  const prevDate = new Date(previous.createdAt);
  return (
    currDate.getDate() !== prevDate.getDate() ||
    currDate.getMonth() !== prevDate.getMonth() ||
    currDate.getFullYear() !== prevDate.getFullYear()
  );
}

function isConsecutive(
  current: Message,
  previous: Message | undefined
): boolean {
  if (!previous) return false;
  if (previous.senderId !== current.senderId) return false;
  const diff =
    new Date(current.createdAt).getTime() -
    new Date(previous.createdAt).getTime();
  return diff < 60000;
}

export function MessageList() {
  const { activeMessages, activeConversation, typingUsers } = useChatContext();
  const { user } = useAuth();
  const currentUserId = user?.id || 'user-me';

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const typingInChat = typingUsers[activeConversation?.id || ''] || [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages.length, isNearBottom]);

  // Scroll to bottom immediately on conversation switch
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    setShowScrollDown(false);
    setIsNearBottom(true);
  }, [activeConversation?.id]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 100;
    setIsNearBottom(nearBottom);
    setShowScrollDown(!nearBottom);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative flex-1 min-h-0 w-full overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto chat-wallpaper px-6 md:px-16 lg:px-24 py-8"
      >
        <div className="flex flex-col w-full space-y-2">
          {activeMessages.map((message, index) => {
            const prevMessage = index > 0 ? activeMessages[index - 1] : undefined;
            const showDate = shouldShowDateSeparator(message, prevMessage);
            const consecutive = isConsecutive(message, prevMessage);
            const isSent =
              message.senderId === currentUserId ||
              message.senderId === 'user-me';
            const showTail = !consecutive;

            return (
              <div key={message.id} className="w-full">
                {showDate && (
                  <DateSeparator label={getDateLabel(new Date(message.createdAt))} />
                )}
                <MessageBubble
                  message={message}
                  isSent={isSent}
                  showTail={showTail}
                  isConsecutive={consecutive}
                />
              </div>
            );
          })}
        </div>

        {/* Typing Indicator */}
        {typingInChat.length > 0 && (
          <div className="pt-3">
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} className="h-6" />
      </div>

      {/* Scroll to bottom button */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-8 right-10 w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl flex items-center justify-center cursor-pointer hover:bg-[var(--bg-hover)] transition-all animate-fade-in hover:scale-105 z-20"
          title="Scroll to latest messages"
        >
          <ChevronDown size={24} className="text-[var(--text-primary)]" />
        </button>
      )}
    </div>
  );
}
