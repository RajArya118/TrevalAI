import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-100 shadow-sm animate-bounce">
          <Compass className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-7xl font-black text-navy-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800 mt-2">You've Wandered Off The Map</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The page you're searching for doesn't exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
          <Link
            to="/destinations"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Search className="w-4 h-4" />
            Explore Destinations
          </Link>
        </div>
      </div>
    </div>
  );
};
