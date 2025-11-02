
import React from 'react';

interface HeaderProps {
  title: string;
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      <button
        onClick={onBack}
        className="text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-full p-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
    </div>
  );
};
