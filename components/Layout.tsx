
import React from 'react';
import Header from './Header';
import Sidebar from './satkem_Sidebar';
import EAdvokasiSidebar from './eadvo_Sidebar';
// FIX: Import View type from types.ts to avoid circular dependency.
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View) => void;
  currentView: View;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView }) => {
  const isEAdvokasiView = currentView.startsWith('eAdvokasi');

  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <Header onNavigate={onNavigate} />
      <div className="flex flex-1 overflow-hidden">
        {isEAdvokasiView ? (
          <EAdvokasiSidebar onNavigate={onNavigate} currentView={currentView} />
        ) : (
          <Sidebar onNavigate={onNavigate} currentView={currentView} />
        )}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};