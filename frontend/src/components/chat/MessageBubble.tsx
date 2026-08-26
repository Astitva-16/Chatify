import React, { useState } from 'react';
import {
  Check,
  CheckCheck,
  Play,
  Pause,
  FileText,
  Download,
  Mic,
} from 'lucide-react';
import { ReplyMessage } from '@/components/chat/ReplyMessage';
import { LinkPreview } from '@/components/chat/LinkPreview';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showTail: boolean;
  isConsecutive: boolean;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function isEmojiOnly(content: string): boolean {
  const emojiRegex = /^[\p{Emoji}\s]+$/u;
  return emojiRegex.test(content) && content.trim().length <= 12;
}

function ReadReceipt({ status }: { status: Message['status'] }) {
  if (status === 'sending') {
    return <Check size={14} className="text-white/70 opacity-60 shrink-0" />;
  }
  if (status === 'sent') {
    return <Check size={14} className="text-white/80 shrink-0" />;
  }
  if (status === 'delivered') {
    return <CheckCheck size={14} className="text-white/80 shrink-0" />;
  }
  if (status === 'read') {
    return <CheckCheck size={14} className="text-sky-200 shrink-0" />;
  }
  return null;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  isSent,
  isConsecutive,
}: MessageBubbleProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const emojiOnly =
    message.type === 'text' && isEmojiOnly(message.content);

  // 1. Voice Note / Audio Message
  if (message.type === 'audio') {
    const duration = message.attachments?.[0]?.duration || 8;
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    return (
      <div
        className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} ${
          isConsecutive ? 'my-1' : 'my-3'
        } animate-fade-in-up`}
      >
        <div
          className={`relative max-w-[340px] sm:max-w-[380px] rounded-2xl p-4 shadow-md border ${
            isSent
              ? 'bg-[var(--bg-sent)] text-white border-pink-400/30'
              : 'bg-[var(--bg-received)] text-white border-cyan-400/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Play / Pause button */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer transition-all shrink-0 hover:scale-105"
            >
              {isPlayingAudio ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white ml-0.5" />
              )}
            </button>

            {/* Audio Waveform Bars */}
            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1 h-7">
                {[14, 22, 16, 28, 20, 10, 24, 18, 26, 12, 20, 16, 28, 14, 22, 18, 12, 24].map(
                  (h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className={`w-1 rounded-full transition-all ${
                        isPlayingAudio
                          ? 'bg-white animate-pulse'
                          : 'bg-white/60'
                      }`}
                    />
                  )
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/80 font-medium">
                <span className="flex items-center gap-1">
                  <Mic size={11} /> {formattedDuration}
                </span>
                <div className="flex items-center gap-1">
                  <span>{formatTime(new Date(message.createdAt))}</span>
                  {isSent && <ReadReceipt status={message.status} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Document / File Attachment Message
  if (message.type === 'file' && message.attachments?.length) {
    const attachment = message.attachments[0];
    const sizeMB = (attachment.size / (1024 * 1024)).toFixed(1);

    return (
      <div
        className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} ${
          isConsecutive ? 'my-1' : 'my-3'
        } animate-fade-in-up`}
      >
        <div
          className={`relative max-w-[340px] sm:max-w-[380px] rounded-2xl p-4 shadow-md border ${
            isSent
              ? 'bg-[var(--bg-sent)] text-white border-pink-400/30'
              : 'bg-[var(--bg-received)] text-white border-cyan-400/30'
          }`}
        >
          <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <FileText size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {attachment.name || 'Document'}
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                {sizeMB} MB • File
              </p>
            </div>
            <button
              onClick={() => window.open(attachment.url, '_blank')}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
              title="Download file"
            >
              <Download size={16} />
            </button>
          </div>

          {message.content && (
            <p className="text-[14.5px] leading-relaxed text-white mb-2 break-words">
              {message.content}
            </p>
          )}

          <div className="flex items-center justify-end gap-1.5 pt-1">
            <span className="text-[11px] text-white/80 font-medium">
              {formatTime(new Date(message.createdAt))}
            </span>
            {isSent && <ReadReceipt status={message.status} />}
          </div>
        </div>
      </div>
    );
  }

  // 3. Image Attachment Message
  if (message.type === 'image' && message.attachments?.length) {
    const attachment = message.attachments[0];
    return (
      <div
        className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} ${
          isConsecutive ? 'my-1' : 'my-3'
        } animate-fade-in-up`}
      >
        <div
          className={`relative max-w-[340px] sm:max-w-[380px] rounded-2xl overflow-hidden shadow-md border ${
            isSent
              ? 'bg-[var(--bg-sent)] text-white border-pink-400/30'
              : 'bg-[var(--bg-received)] text-white border-cyan-400/30'
          }`}
        >
          {attachment.url ? (
            <img
              src={attachment.url}
              alt={attachment.name || 'Image'}
              className="w-full max-h-72 object-cover bg-black/20 block cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(attachment.url, '_blank')}
            />
          ) : (
            <div className="w-full h-52 bg-black/20 flex items-center justify-center">
              <span className="text-white/90 text-sm font-semibold">
                📷 {attachment.name || 'Photo'}
              </span>
            </div>
          )}

          {message.content && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-[14.5px] leading-relaxed break-words whitespace-pre-wrap text-white font-normal">
                {message.content}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-1.5 px-4 pb-2.5 pt-1">
            <span className="text-[11px] text-white/80 font-medium">
              {formatTime(new Date(message.createdAt))}
            </span>
            {isSent && <ReadReceipt status={message.status} />}
          </div>
        </div>
      </div>
    );
  }

  // 4. Emoji-only Message
  if (emojiOnly) {
    return (
      <div
        className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} ${
          isConsecutive ? 'my-1' : 'my-3'
        } animate-fade-in-up`}
      >
        <div className="relative max-w-xs px-2 py-1 flex flex-col items-end gap-1">
          <span className="text-5xl leading-tight block select-none">
            {message.content}
          </span>
          <div className="flex items-center justify-end gap-1.5 bg-black/40 px-2.5 py-0.5 rounded-lg shadow-sm">
            <span className="text-[11px] text-white/90 font-medium">
              {formatTime(new Date(message.createdAt))}
            </span>
            {isSent && <ReadReceipt status={message.status} />}
          </div>
        </div>
      </div>
    );
  }

  // 5. Standard Text Message (Square with rounded corners)
  return (
    <div
      className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} ${
        isConsecutive ? 'my-1' : 'my-3'
      } animate-fade-in-up`}
    >
      <div
        className={`relative max-w-[76%] sm:max-w-[65%] md:max-w-[56%] min-w-[130px] rounded-2xl px-4 py-3 shadow-md border ${
          isSent
            ? 'bg-[var(--bg-sent)] text-white border-pink-400/30'
            : 'bg-[var(--bg-received)] text-white border-cyan-400/30'
        }`}
      >
        {/* Reply/Quoted message */}
        {message.replyTo && (
          <div className="mb-2">
            <ReplyMessage
              senderName={message.replyTo.senderName}
              content={message.replyTo.content}
              isSent={isSent}
            />
          </div>
        )}

        {/* Link Preview */}
        {message.linkPreview && (
          <div className="mb-2">
            <LinkPreview preview={message.linkPreview} isSent={isSent} />
          </div>
        )}

        {/* Message Content */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[15px] leading-[22px] break-words whitespace-pre-wrap text-white font-normal">
            {renderContent(message.content)}
          </p>

          {/* Dedicated Bottom Date & Read Receipt Row (Guaranteed Inside) */}
          <div className="flex items-center justify-end gap-1.5 pt-0.5 select-none self-end">
            <span className="text-[11px] text-white/80 whitespace-nowrap font-medium">
              {formatTime(new Date(message.createdAt))}
            </span>
            {isSent && <ReadReceipt status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
});

function renderContent(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  if (parts.length === 1) return content;

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-bold underline underline-offset-2 hover:opacity-90 transition-opacity"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
