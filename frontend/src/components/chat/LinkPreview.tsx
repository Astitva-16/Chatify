import type { LinkPreviewData } from '@/types';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  preview: LinkPreviewData;
  isSent: boolean;
}

export function LinkPreview({ preview, isSent }: LinkPreviewProps) {
  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block mb-2 rounded-xl overflow-hidden cursor-pointer bg-black/20 hover:bg-black/30 transition-all border border-white/20`}
    >
      {/* Preview Image */}
      {preview.imageUrl && (
        <div className="w-full h-32 bg-black/20 flex items-center justify-center">
          <ExternalLink size={24} className="text-white opacity-60" />
        </div>
      )}

      {/* Preview Text */}
      <div className="px-3.5 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80 truncate mb-0.5">
          {preview.domain}
        </p>
        <p className="text-[13.5px] font-bold text-white truncate leading-snug">
          {preview.title}
        </p>
        {preview.description && (
          <p className="text-[12px] text-white/85 truncate mt-0.5 leading-relaxed font-normal">
            {preview.description}
          </p>
        )}
      </div>
    </a>
  );
}
