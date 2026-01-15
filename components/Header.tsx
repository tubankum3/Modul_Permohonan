
import React from 'react';
import { BellIcon, UserCircleIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-[#0055A5] text-white flex items-center justify-between p-3 shadow-md z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">satu kemenkeu</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-white/20">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
           <img src="https://i.pravatar.cc/40?img=1" alt="User" className="h-8 w-8 rounded-full" />
           <span className="hidden md:block">User Name</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
