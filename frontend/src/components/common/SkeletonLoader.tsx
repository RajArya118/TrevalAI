import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-56 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-12" />
        </div>
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-4/5" />
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-8 bg-slate-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};
