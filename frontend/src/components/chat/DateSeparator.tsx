interface DateSeparatorProps {
  label: string;
}

export function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-8">
      <span className="px-5 py-2 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[12.5px] font-bold shadow-sm border border-[var(--border)] tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}
