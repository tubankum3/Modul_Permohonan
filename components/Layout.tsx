
import React from 'react';
import Header from './Header';
import Sidebar from './satkem_Sidebar';
import EAdvokasiSidebar from './eadvo_Sidebar';
import { View } from '../types';
import { useAdvokasiStore } from '../useAdvokasiStore';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View, data?: any) => void;
  currentView: View;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView }) => {
  const isEAdvokasiView = currentView.startsWith('eAdvokasi');
  const isMobileSidebarOpen = useAdvokasiStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useAdvokasiStore((state) => state.setMobileSidebarOpen);

  const handleNavigateWithMobileClose = (view: View, data?: any) => {
    onNavigate(view, data);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans overflow-hidden bg-gray-50">
      <Header onNavigate={onNavigate} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Responsive Sidebar Drawer:
            - Mobile: fixed drawer positioned over content with smooth translate transition
            - Desktop: relative inline column (md:relative md:translate-x-0)
        */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 md:relative md:z-auto md:translate-x-0 transition-transform duration-300 ease-in-out h-full shadow-2xl md:shadow-none ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {isEAdvokasiView ? (
            <EAdvokasiSidebar 
              onNavigate={handleNavigateWithMobileClose} 
              currentView={currentView} 
              onCloseMobile={() => setMobileSidebarOpen(false)} 
            />
          ) : (
            <Sidebar 
              onNavigate={handleNavigateWithMobileClose} 
              currentView={currentView} 
              onCloseMobile={() => setMobileSidebarOpen(false)} 
            />
          )}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 overflow-y-auto w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};