import { useChatContext } from '@/contexts/ChatContext';
import type { ChatFilter } from '@/types';

const filters: { type: ChatFilter['type']; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'unread', label: 'Unread' },
  { type: 'groups', label: 'Groups' },
  { type: 'favorites', label: 'Favorites' },
];

export function ChatFilters() {
  const { activeFilter, setActiveFilter } = useChatContext();

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
      {filters.map((filter) => (
        <button
          key={filter.type}
          onClick={() => setActiveFilter(filter.type)}
          className={`
            px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer
            transition-all duration-150 whitespace-nowrap
            ${
              activeFilter === filter.type
                ? 'bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20'
                : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
