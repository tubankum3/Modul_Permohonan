
import React from 'react';
import { HomeIcon, ArchiveIcon, QuestionMarkCircleIcon, XIcon } from './icons';
import { View } from '../types';

interface SidebarProps {
    onNavigate: (view: View) => void;
    currentView: View;
    onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, onCloseMobile }) => {
  const menuItems = [
    { icon: <HomeIcon className="h-5 w-5" />, name: 'Beranda', view: 'beranda' as View },
    { icon: <ArchiveIcon className="h-5 w-5" />, name: 'Permohonan', view: 'list' as View },
    { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, name: 'FAQ', view: 'faq' as View },
  ];

  const isActive = (view: View) => {
    if (view === 'list') {
        return ['list', 'detail', 'create', 'edit'].includes(currentView);
    }
    return currentView === view;
  };

  return (
    <aside className="w-64 max-w-[80vw] h-full bg-white border-r border-gray-200 flex flex-col p-4 space-y-4 select-none">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Penelaah Teknis Kebijakan Tk.II</h2>
          <p className="text-xs text-gray-500">di Subbagian Advokasi I...</p>
        </div>
        {onCloseMobile && (
          <button 
            type="button" 
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
            aria-label="Tutup Menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
             <li key={index}>
              <button
                onClick={() => {
                  onNavigate(item.view);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-md text-sm transition text-left ${
                  isActive(item.view) ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
