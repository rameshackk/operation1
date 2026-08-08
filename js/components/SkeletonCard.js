import React from 'https://esm.sh/react@18.2.0';

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-3 space-y-3">
      <div className="skeleton aspect-video w-full rounded-xl" />
      <div className="space-y-2">
        <div className="skeleton h-3 w-1/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-3 w-1/4 rounded" />
      </div>
    </div>
  );
}
