
import React from 'react';
import { HomeIcon, ArchiveIcon, QuestionMarkCircleIcon } from './icons';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <HomeIcon className="h-5 w-5" />, name: 'Beranda' },
    { icon: <ArchiveIcon className="h-5 w-5" />, name: 'Permohonan', active: true },
    { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, name: 'FAQ' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 space-y-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Penelaah Teknis Kebijakan Tk.II</h2>
        <p className="text-xs text-gray-500">di Subbagian Advokasi I...</p>
      </div>
      <nav className="flex-1">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center justify-between py-2 px-3 rounded-md text-sm transition ${
                  item.active ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
