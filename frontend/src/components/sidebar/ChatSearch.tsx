import { Search, X } from 'lucide-react';
import { useRef } from 'react';

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChatSearch({ value, onChange }: ChatSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center w-full">
      <Search
        size={18}
        className="absolute left-4 text-[var(--text-secondary)] pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search chats or messages..."
        className="w-full h-11 pl-11 pr-10 rounded-2xl bg-[var(--bg-input)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-placeholder)] border border-transparent focus:border-[var(--accent)] outline-none transition-all shadow-sm"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-3.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer p-1 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
