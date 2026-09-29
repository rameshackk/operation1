import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 space-y-3.5 shadow-sm">
      <div className="skeleton aspect-video w-full rounded-2xl" />
      <div className="space-y-2">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-5 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}



export default SkeletonCard;
export { SkeletonCard };

