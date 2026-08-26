interface ReplyMessageProps {
  senderName: string;
  content: string;
  isSent: boolean;
}

export function ReplyMessage({ senderName, content, isSent }: ReplyMessageProps) {
  return (
    <div
      className={`mb-2 rounded-xl px-3.5 py-2 border-l-[3.5px] cursor-pointer transition-opacity hover:opacity-90 ${
        isSent
          ? 'bg-black/20 border-l-white text-white'
          : 'bg-black/20 border-l-white text-white'
      }`}
    >
      <p className="text-[12px] font-bold text-white/95 truncate">
        {senderName}
      </p>
      <p className="text-[12.5px] text-white/90 truncate leading-snug mt-0.5 font-normal">
        {content}
      </p>
    </div>
  );
}
