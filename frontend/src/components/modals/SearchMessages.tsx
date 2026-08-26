import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

export function SearchMessages() {
  const { activeMessages, isSearchOpen, toggleSearch } = useChatContext();
  const [query, setQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
      setQuery('');
      setCurrentIndex(0);
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return activeMessages
      .filter((m) => m.content.toLowerCase().includes(q))
      .map((m, i) => ({
        messageId: m.id,
        conversationId: m.conversationId,
        content: m.content,
        senderName: m.senderId,
        timestamp: m.createdAt,
        matchIndex: i,
      }));
  }, [query, activeMessages]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      toggleSearch();
    }
    if (e.key === 'Enter' && results.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % results.length);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="flex items-center gap-3 px-6 py-2.5 bg-[var(--header-bg)] border-b border-[var(--border)] shrink-0 animate-fade-in-down select-none z-10">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search in this conversation..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-placeholder)] border border-transparent focus:border-[var(--accent)] outline-none transition-colors"
        />
      </div>

      {query && (
        <span className="text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">
          {results.length > 0
            ? `${currentIndex + 1} of ${results.length}`
            : 'No results'}
        </span>
      )}

      {results.length > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev > 0 ? prev - 1 : results.length - 1
              )
            }
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
            title="Previous match"
          >
            <ChevronUp size={18} />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % results.length)
            }
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
            title="Next match"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      )}

      <button
        onClick={toggleSearch}
        className="p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
        title="Close search"
      >
        <X size={18} />
      </button>
    </div>
  );
}
