export function TypingIndicator() {
  return (
    <div className="flex justify-start mt-2 animate-fade-in">
      <div
        className="bg-[var(--bg-received)] rounded-lg px-3 py-2.5 message-tail-received rounded-tl-none"
        style={{ boxShadow: 'var(--message-shadow)' }}
      >
        <div className="flex items-center gap-1">
          <span className="typing-dot w-[7px] h-[7px] rounded-full bg-[var(--text-secondary)]" />
          <span className="typing-dot w-[7px] h-[7px] rounded-full bg-[var(--text-secondary)]" />
          <span className="typing-dot w-[7px] h-[7px] rounded-full bg-[var(--text-secondary)]" />
        </div>
      </div>
    </div>
  );
}

