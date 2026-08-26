import React from 'react';

/* ------------------------------------------------------------------ */
/*  Shared skeleton block                                             */
/* ------------------------------------------------------------------ */

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-shimmer rounded ${className}`} />;
}

/* ------------------------------------------------------------------ */
/*  Conversation Skeleton                                             */
/* ------------------------------------------------------------------ */

export function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Avatar circle */}
      <SkeletonBlock className="w-12 h-12 rounded-full shrink-0" />

      {/* Text lines */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <SkeletonBlock className="h-3.5 w-3/5 rounded-md" />
        <SkeletonBlock className="h-3 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

export function ConversationListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }, (_, i) => (
        <ConversationSkeleton key={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Message Skeleton                                                  */
/* ------------------------------------------------------------------ */

export function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-16 py-4">
      {/* Received (left) */}
      <div className="flex justify-start">
        <SkeletonBlock className="h-10 w-48 rounded-xl" />
      </div>

      {/* Sent (right) */}
      <div className="flex justify-end">
        <SkeletonBlock className="h-10 w-56 rounded-xl" />
      </div>

      {/* Received (left) longer */}
      <div className="flex justify-start">
        <SkeletonBlock className="h-16 w-64 rounded-xl" />
      </div>

      {/* Sent (right) short */}
      <div className="flex justify-end">
        <SkeletonBlock className="h-10 w-36 rounded-xl" />
      </div>

      {/* Received (left) */}
      <div className="flex justify-start">
        <SkeletonBlock className="h-10 w-52 rounded-xl" />
      </div>

      {/* Sent (right) */}
      <div className="flex justify-end">
        <SkeletonBlock className="h-14 w-60 rounded-xl" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile Skeleton                                                  */
/* ------------------------------------------------------------------ */

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      {/* Large avatar */}
      <SkeletonBlock className="w-20 h-20 rounded-full" />

      {/* Name */}
      <SkeletonBlock className="h-4 w-40 rounded-md" />

      {/* Status / about */}
      <SkeletonBlock className="h-3 w-56 rounded-md" />

      {/* Detail lines */}
      <div className="w-full flex flex-col gap-3 mt-4">
        <SkeletonBlock className="h-3 w-full rounded-md" />
        <SkeletonBlock className="h-3 w-3/4 rounded-md" />
        <SkeletonBlock className="h-3 w-5/6 rounded-md" />
      </div>
    </div>
  );
}
