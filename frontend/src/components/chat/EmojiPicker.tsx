import { useState, useMemo } from 'react';
import { Smile, Heart, ThumbsUp, Sparkles, Search, X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

const emojiCategories = [
  {
    id: 'smileys',
    name: 'Smileys',
    icon: Smile,
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹',
      '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
      '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐',
      '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟',
      '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭',
      '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
      '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭', '🫢', '🫡', '🤫',
    ],
  },
  {
    id: 'gestures',
    name: 'Gestures',
    icon: ThumbsUp,
    emojis: [
      '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲',
      '🤝', '🙏', '✍️', '💅', '🤳', '💪', '✌️', '🤞', '🫰', '🤟',
      '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚',
      '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '👂', '👃', '👀', '👁️',
    ],
  },
  {
    id: 'hearts',
    name: 'Hearts & Symbols',
    icon: Heart,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
      '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
      '⭐', '🌟', '✨', '⚡', '💫', '💥', '🔥', '💯', '💢', '💤',
    ],
  },
  {
    id: 'fun',
    name: 'Fun & Objects',
    icon: Sparkles,
    emojis: [
      '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⚽', '🏀',
      '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🏸', '🥊', '🎯', '🚀',
      '🛸', '🚗', '✈️', '📱', '💻', '💡', '🔔', '🎵', '🎶', '📷',
      '🍕', '🍔', '🍟', '🌮', '🍿', '🍩', '☕', '🍻', '🍹', '🍦',
    ],
  },
];

export function EmojiPicker({ isOpen, onClose, onSelectEmoji }: EmojiPickerProps) {
  const [activeTab, setActiveTab] = useState('smileys');
  const [search, setSearch] = useState('');
  const popoverRef = useClickOutside<HTMLDivElement>(onClose);

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return null;
    const all = emojiCategories.flatMap((c) => c.emojis);
    return all;
  }, [search]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-20 left-8 w-80 sm:w-96 bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-3xl shadow-2xl p-4 z-50 animate-scale-in select-none"
    >
      {/* Header with Search */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--border)]">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emoji..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-xl bg-[var(--bg-input)] text-[var(--text-primary)] border border-transparent focus:border-[var(--accent)] outline-none"
            autoFocus
          />
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Category Tabs */}
      {!search && (
        <div className="flex items-center gap-1 mb-3">
          {emojiCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                title={category.name}
                className={`flex-1 py-1.5 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent-light)] text-[var(--accent)] font-bold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <Icon size={17} />
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="h-56 overflow-y-auto pr-1">
        {search ? (
          <div>
            <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Search Results
            </p>
            <div className="grid grid-cols-8 gap-1">
              {filteredEmojis?.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => onSelectEmoji(emoji)}
                  className="w-9 h-9 rounded-xl hover:bg-[var(--bg-hover)] flex items-center justify-center text-xl cursor-pointer transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {emojiCategories
              .filter((cat) => cat.id === activeTab)
              .map((category) => (
                <div key={category.id}>
                  <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    {category.name}
                  </p>
                  <div className="grid grid-cols-8 gap-1.5">
                    {category.emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => onSelectEmoji(emoji)}
                        className="w-9 h-9 rounded-xl hover:bg-[var(--bg-hover)] flex items-center justify-center text-xl cursor-pointer transition-transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

