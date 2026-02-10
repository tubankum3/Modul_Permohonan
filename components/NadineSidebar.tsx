
import React from 'react';
import { MailIcon, ArchiveIcon, ClockIcon, PaperAirplaneIcon, BeakerIcon, FlagIcon, QuestionMarkCircleIcon, DocumentTextIcon, ChevronDownIcon } from './icons';

const NadineSidebar: React.FC = () => {

    const menuItems = [
        { name: 'Mejaku', icon: <MailIcon className="h-5 w-5"/>, count: 5 },
        { name: 'Arsip', icon: <ArchiveIcon className="h-5 w-5"/> },
        { name: 'Riwayat Arsip Jabatan', icon: <ClockIcon className="h-5 w-5"/> },
        { name: 'Proses TTE', icon: <PaperAirplaneIcon className="h-5 w-5"/> },
        { name: 'Grap & Tkg ND', icon: <BeakerIcon className="h-5 w-5"/> },
        { name: 'TTE Eksternal', icon: <FlagIcon className="h-5 w-5"/>, count: 3 },
        { name: 'Alur Fleksibel', icon: <DocumentTextIcon className="h-5 w-5"/> },
    ];
    
    const helpItems = [
        { name: 'FAQ', icon: <QuestionMarkCircleIcon className="h-5 w-5"/> },
        { name: 'Legend', icon: <ChevronDownIcon className="h-5 w-5"/> },
    ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
        <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Penelaah Teknis Kebijakan Tk.II</h2>
            <p className="text-xs text-gray-500">di 'Seksi Pembinaan Proses Bisnis dan'...</p>
        </div>
        <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition mb-4">
            + Tulis Naskah
        </button>
      
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MENU NADINE</h3>
        <nav className="flex-1 space-y-1">
            {menuItems.map(item => (
                <a href="#" key={item.name} className="flex items-center justify-between py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-100">
                    <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.name}</span>
                    </div>
                    {item.count && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{item.count}</span>
                    )}
                </a>
            ))}
        </nav>
        
        <div className="mt-auto">
            <nav className="space-y-1">
                {helpItems.map(item => (
                    <a href="#" key={item.name} className="flex items-center justify-between py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                    </a>
                ))}
            </nav>
            <p className="text-xs text-gray-400 mt-4">&copy; 2024 Powered By Kemenkeu</p>
        </div>
    </aside>
  );
};

export default NadineSidebar;
