
import React from 'react';
import NadineHeader from './NadineHeader';
import NadineSidebar from './NadineSidebar';
// FIX: Import View type from types.ts to avoid circular dependency.
import { View } from '../types';

interface NadineLayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View) => void;
  currentView: View;
}

export const NadineLayout: React.FC<NadineLayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <NadineHeader onNavigate={onNavigate} />
      <div className="flex flex-1 overflow-hidden">
        <NadineSidebar />
        <main className="flex-1 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
