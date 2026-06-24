
import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, ViewGridIcon } from './icons';
import { View } from '../types';
import { useAdvokasiStore } from '../useAdvokasiStore';

interface HeaderProps {
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const globalRole = useAdvokasiStore((state) => state.globalRole);
  const setGlobalRole = useAdvokasiStore((state) => state.setGlobalRole);
  const teamRole = useAdvokasiStore((state) => state.teamRole);
  const setTeamRole = useAdvokasiStore((state) => state.setTeamRole);
  const userName = useAdvokasiStore((state) => state.userName);

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
    <header className="bg-[#0055A5] text-white flex items-center justify-between p-3 shadow-md z-20">
      <div className="flex items-center">
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 mr-2 rounded-full hover:bg-white/20" aria-label="Application Menu">
                <ViewGridIcon className="h-6 w-6" />
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
        <h1 className="text-xl font-bold">satu kemenkeu</h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* Role Switcher Widget */}
        <div className="flex items-center space-x-2 bg-white/15 px-3 py-1.5 rounded-full border border-white/25 shadow-inner">
          <span className="text-xs text-blue-100 font-medium whitespace-nowrap">Role:</span>
          <select 
            value={globalRole} 
            onChange={(e) => {
              const val = e.target.value as any;
              setGlobalRole(val);
              useAdvokasiStore.getState().showNotification(`Peran berganti: ${val}`, 'info');
            }}
            className="bg-transparent text-sm text-white font-semibold focus:outline-none cursor-pointer hover:text-blue-100 transition [&>option]:text-gray-900 border-none outline-none py-0 pr-6"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Manajer">Manajer</option>
            <option value="Operator">Operator</option>
            <option value="Pegawai">Pegawai</option>
          </select>

          {globalRole === 'Pegawai' && (
            <>
              <span className="text-white/40 font-light mx-1">|</span>
              <select 
                value={teamRole} 
                onChange={(e) => {
                  const val = e.target.value as any;
                  setTeamRole(val);
                  useAdvokasiStore.getState().showNotification(`Peran Tim (Pegawai) berganti: ${val}`, 'info');
                }}
                className="bg-transparent text-sm text-white font-semibold focus:outline-none cursor-pointer hover:text-blue-100 transition [&>option]:text-gray-900 border-none outline-none py-0 pr-6"
              >
                <option value="PIC">PIC</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </>
          )}
        </div>

        <button className="p-2 rounded-full hover:bg-white/20">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
           <img src="https://i.pravatar.cc/40?img=1" alt="User" className="h-8 w-8 rounded-full" />
           <div className="text-left leading-tight hidden md:block">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-[10px] text-blue-100 font-medium">{globalRole === 'Pegawai' ? `${globalRole} (${teamRole})` : globalRole}</p>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
