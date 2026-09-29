import React from 'react';

export default function RouteLoadingSpinner() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">ஏற்றுகிறது... (Loading...)</p>
      </div>
    </div>
  );
}
