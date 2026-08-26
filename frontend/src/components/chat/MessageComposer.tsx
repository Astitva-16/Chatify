import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  Smile,
  SendHorizontal,
  Mic,
  Image as ImageIcon,
  FileText,
  Trash2,
  X,
} from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { EmojiPicker } from '@/components/chat/EmojiPicker';
import { useChatContext } from '@/contexts/ChatContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { MessageAttachment } from '@/types';

// Sample mock images for instant testing without needing real local files
const sampleImages = [
  {
    name: 'team_celebration.jpg',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    size: 1450000,
  },
  {
    name: 'project_architecture.png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    size: 2100000,
  },
  {
    name: 'sunset_view.jpg',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&auto=format&fit=crop&q=80',
    size: 1800000,
  },
];

export function MessageComposer() {
  const [text, setText] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [attachment, setAttachment] = useState<MessageAttachment | null>(null);

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const attachMenuRef = useClickOutside<HTMLDivElement>(() =>
    setIsAttachMenuOpen(false)
  );

  const { sendMessage, activeConversationId } = useChatContext();

  // Reset state when active conversation changes
  useEffect(() => {
    setText('');
    setAttachment(null);
    setIsEmojiOpen(false);
    setIsAttachMenuOpen(false);
    cancelRecording();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [activeConversationId]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleSend = () => {
    if (!text.trim() && !attachment) return;

    if (attachment) {
      sendMessage(
        text.trim(),
        attachment.type === 'image' ? 'image' : 'file',
        [attachment]
      );
      setAttachment(null);
    } else {
      sendMessage(text.trim(), 'text');
    }

    setText('');
    setIsEmojiOpen(false);
    setIsAttachMenuOpen(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  };

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle real file upload from device
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'document'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAttachment({
      id: `att-${Date.now()}`,
      type: type === 'image' ? 'image' : 'document',
      url,
      name: file.name,
      size: file.size,
    });
    setIsAttachMenuOpen(false);
    e.target.value = '';
  };

  const handlePickSampleImage = (sample: (typeof sampleImages)[0]) => {
    setAttachment({
      id: `att-${Date.now()}`,
      type: 'image',
      url: sample.url,
      name: sample.name,
      size: sample.size,
    });
    setIsAttachMenuOpen(false);
  };

  // Voice Note Handlers
  const startRecording = () => {
    setIsRecording(true);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const sendVoiceNote = () => {
    const duration = Math.max(recordingSeconds, 2);
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const audioAttachment: MessageAttachment = {
      id: `audio-${Date.now()}`,
      type: 'audio',
      url: '',
      name: `Voice note (${timeStr})`,
      size: duration * 16000,
      duration,
    };

    sendMessage(`Voice message (${timeStr})`, 'audio', [audioAttachment]);
    cancelRecording();
  };

  // Format recording timer: mm:ss
  const mins = Math.floor(recordingSeconds / 60);
  const secs = recordingSeconds % 60;
  const formattedRecordingTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="relative px-8 py-4 bg-[var(--composer-bg)] border-t border-[var(--border)] shrink-0 z-20">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'image')}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.zip,.csv"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'document')}
      />

      {/* Emoji Picker Popover */}
      <EmojiPicker
        isOpen={isEmojiOpen}
        onClose={() => setIsEmojiOpen(false)}
        onSelectEmoji={handleSelectEmoji}
      />

      {/* Attachment Menu Popover */}
      {isAttachMenuOpen && (
        <div
          ref={attachMenuRef}
          className="absolute bottom-20 left-8 w-72 bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-3xl shadow-2xl p-3 z-50 animate-scale-in select-none"
        >
          <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Add Attachment
            </p>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm font-semibold transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center">
                <ImageIcon size={18} />
              </div>
              <span>Photos & Videos</span>
            </button>

            <button
              onClick={() => docInputRef.current?.click()}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm font-semibold transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span>Document / File</span>
            </button>

            {/* Quick Sample Photos */}
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="px-3 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Quick Sample Images
              </p>
              <div className="grid grid-cols-3 gap-2 px-2 pb-1">
                {sampleImages.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => handlePickSampleImage(sample)}
                    className="group aspect-video rounded-xl overflow-hidden border border-[var(--border)] relative cursor-pointer hover:scale-105 transition-transform"
                    title={sample.name}
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Bar */}
      {attachment && (
        <div className="mb-3 p-3 bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-2xl flex items-center justify-between gap-3 animate-fade-in-up">
          <div className="flex items-center gap-3 min-w-0">
            {attachment.type === 'image' && attachment.url ? (
              <img
                src={attachment.url}
                alt={attachment.name}
                className="w-12 h-12 rounded-xl object-cover border border-[var(--border)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                <FileText size={22} />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                {attachment.name}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {(attachment.size / (1024 * 1024)).toFixed(2)} MB • Ready to send
              </p>
            </div>
          </div>

          <button
            onClick={() => setAttachment(null)}
            className="p-1.5 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--danger)] cursor-pointer transition-colors"
            title="Remove attachment"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Composer Controls */}
      {isRecording ? (
        /* Voice Recording Mode Bar */
        <div className="flex items-center justify-between gap-4 py-1 animate-fade-in">
          {/* Pulsing REC indicator + timer */}
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-sm font-bold text-red-500 tracking-wider uppercase">
              REC {formattedRecordingTime}
            </span>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-1 h-6 flex-1 max-w-xs justify-center">
            {[10, 24, 14, 28, 18, 12, 22, 16, 26, 14, 20, 10, 24, 16].map(
              (h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 rounded-full bg-[var(--accent)] animate-pulse"
                />
              )
            )}
          </div>

          {/* Cancel & Send Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={cancelRecording}
              className="p-2.5 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors cursor-pointer"
              title="Cancel recording"
            >
              <Trash2 size={20} />
            </button>

            <button
              onClick={sendVoiceNote}
              className="w-12 h-12 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white flex items-center justify-center cursor-pointer transition-all shadow-lg shadow-[var(--accent)]/25 hover:scale-105"
              title="Send voice message"
            >
              <SendHorizontal size={21} />
            </button>
          </div>
        </div>
      ) : (
        /* Normal Typing Mode */
        <div className="flex items-center gap-4">
          {/* Attachment & Emoji Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <IconButton
              icon={<Paperclip size={22} />}
              onClick={() => {
                setIsAttachMenuOpen(!isAttachMenuOpen);
                setIsEmojiOpen(false);
              }}
              title="Add attachment (Photos, Documents)"
              size="lg"
              active={isAttachMenuOpen}
            />
            <IconButton
              icon={<Smile size={22} />}
              onClick={() => {
                setIsEmojiOpen(!isEmojiOpen);
                setIsAttachMenuOpen(false);
              }}
              title="Choose emoji"
              size="lg"
              active={isEmojiOpen}
            />
          </div>

          {/* Text Input */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none rounded-2xl bg-[var(--bg-input)] text-[var(--text-primary)] text-[15px] px-5 py-3 border border-transparent focus:border-[var(--accent)] outline-none placeholder:text-[var(--text-placeholder)] max-h-[150px] leading-[22px] shadow-sm transition-all block font-normal"
            />
          </div>

          {/* Send or Mic Button */}
          <div className="shrink-0">
            {text.trim() || attachment ? (
              <button
                onClick={handleSend}
                className="w-12 h-12 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] flex items-center justify-center cursor-pointer transition-all shadow-lg shadow-[var(--accent)]/25 hover:scale-105 active:scale-95 text-white"
                title="Send message (Enter)"
              >
                <SendHorizontal size={21} />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-12 h-12 rounded-2xl bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 border border-[var(--border)]"
                title="Record voice note"
              >
                <Mic size={22} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
