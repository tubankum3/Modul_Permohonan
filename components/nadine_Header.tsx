
import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, ViewGridIcon } from './icons';
import { View } from '../types';

interface NadineHeaderProps {
    onNavigate: (view: View) => void;
}

const NadineHeader: React.FC<NadineHeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white text-gray-800 flex items-center justify-between p-3 border-b border-gray-200 z-20">
      <div className="flex items-center">
         <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 mr-2 rounded-full hover:bg-gray-100" aria-label="Application Menu">
                <ViewGridIcon className="h-6 w-6 text-gray-600" />
            </button>
            {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 text-gray-800 ring-1 ring-black ring-opacity-5">
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('beranda'); setIsMenuOpen(false); }}
                        className="block px-4 py-3 text-sm font-medium hover:bg-gray-100"
                    >
                        Modul Permohonan Bantuan Hukum
                    </a>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('pilihTemplate'); setIsMenuOpen(false); }}
                        className="block px-4 py-3 text-sm font-medium hover:bg-gray-100"
                    >
                        Modul Nadine
                    </a>
                     <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('eAdvokasiInbox'); setIsMenuOpen(false); }}
                        className="block px-4 py-3 text-sm font-medium hover:bg-gray-100"
                    >
                        Modul E-Advokasi
                    </a>
                </div>
            )}
        </div>
        <h1 className="text-xl font-bold text-[#0055A5]">satu kemenkeu</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <BellIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
           <img src="https://i.pravatar.cc/40?img=1" alt="User" className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default NadineHeader;
