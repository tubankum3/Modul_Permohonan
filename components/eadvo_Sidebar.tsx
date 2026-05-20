
import React from 'react';
import { 
    MailIcon, BriefcaseIcon, HomeIcon, UserGroupIcon, ShieldCheckIcon, 
    DocumentTextIcon, CalendarIcon, DesktopComputerIcon, ArchiveIcon, TrashIcon, 
    TagIcon, InformationCircleIcon, QuestionMarkCircleIcon, UserAddIcon, SearchIcon, ClockIcon
} from './icons';
import { View } from '../types';

interface EAdvokasiSidebarProps {
    onNavigate: (view: View) => void;
    currentView: View;
}

const menuGroups = [
    {
        title: 'HOME',
        items: [
            { icon: <HomeIcon className="h-5 w-5" />, name: 'Beranda', view: 'eAdvokasiBeranda' as View },
        ]
    },
    {
        title: 'PERMOHONAN',
        items: [
            { icon: <MailIcon className="h-5 w-5" />, name: 'Inbox Permohonan', view: 'eAdvokasiInbox' as View },
            { icon: <BriefcaseIcon className="h-5 w-5" />, name: 'Pengelolaan Permohonan', view: 'eAdvokasiPengelolaan' as View },
        ]
    },
    {
        title: 'PENANGANAN',
        items: [
            { icon: <UserGroupIcon className="h-5 w-5" />, name: 'Pendampingan', view: 'eAdvokasiPendampingan' as View },
            { icon: <ShieldCheckIcon className="h-5 w-5" />, name: 'Penanganan Perkara', view: 'eAdvokasiPenangananPerkara' as View },
            { icon: <DocumentTextIcon className="h-5 w-5" />, name: 'Penanganan Putusan', view: 'eAdvokasiPenangananPutusan' as View },
        ]
    },
    {
        title: 'PEMANTAUAN & PELAPORAN',
        items: [
            { icon: <DesktopComputerIcon className="h-5 w-5" />, name: 'Monitoring', view: 'eAdvokasiDashboard' as View },
            { icon: <CalendarIcon className="h-5 w-5" />, name: 'Kalender Sidang', view: 'eAdvokasiKalender' as View },
            { icon: <DocumentTextIcon className="h-5 w-5" />, name: 'Laporan', view: 'eAdvokasiLaporan' as View },
        ]
    },
    {
        title: 'MANAJEMEN',
        items: [
            { icon: <UserAddIcon className="h-5 w-5" />, name: 'User', view: 'eAdvokasiUser' as View },
            { icon: <ArchiveIcon className="h-5 w-5" />, name: 'Arsip', view: 'eAdvokasiArsip' as View },
            { icon: <TrashIcon className="h-5 w-5" />, name: 'Recycle Bin', view: 'eAdvokasiRecycleBin' as View },
            { icon: <TagIcon className="h-5 w-5" />, name: 'Referensi', view: 'eAdvokasiReferensi' as View },
            { icon: <UserGroupIcon className="h-5 w-5" />, name: 'Pengelolaan Tim', view: 'eAdvokasiTim' as View },
            { icon: <InformationCircleIcon className="h-5 w-5" />, name: 'Pengelolaan Informasi', view: 'eAdvokasiInfo' as View },
            { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, name: 'Pengelolaan FAQ', view: 'eAdvokasiFaq' as View },
        ]
    }
];

const EAdvokasiSidebar: React.FC<EAdvokasiSidebarProps> = ({ onNavigate, currentView }) => {
  
    const isActive = (view: View) => {
        if (view === 'eAdvokasiPendampingan') {
            return currentView.startsWith('eAdvokasiPendampingan');
        }
        if (view === 'eAdvokasiPenangananPerkara') {
            return currentView.startsWith('eAdvokasiPerkara');
        }
        if (view === 'eAdvokasiPenangananPutusan') {
            return currentView.startsWith('eAdvokasiPutusan') || currentView === 'eAdvokasiPenangananPutusan';
        }
        return currentView === view;
    };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">E-Advokasi</h2>
        <p className="text-xs text-gray-500">Back Office</p>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {menuGroups.map((group, groupIndex) => (
          <div key={group.title} className={groupIndex > 0 ? "mt-4" : ""}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{group.title}</h3>
            <ul>
              {group.items.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate(item.view)}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-sm transition text-left ${
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
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default EAdvokasiSidebar;
