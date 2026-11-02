import React from 'react';
import { 
    MailIcon, BriefcaseIcon, HomeIcon, UserGroupIcon, ShieldCheckIcon, 
    DocumentTextIcon, CalendarIcon, DesktopComputerIcon, ArchiveIcon, TrashIcon, 
    TagIcon, InformationCircleIcon, QuestionMarkCircleIcon, UserAddIcon, SearchIcon, ClockIcon, TrendingUpIcon,
    XIcon, ScaleIcon, SparklesIcon
} from './icons';
import { View } from '../types';
import { useAdvokasiStore } from '../useAdvokasiStore';

interface EAdvokasiSidebarProps {
    onNavigate: (view: View) => void;
    currentView: View;
    onCloseMobile?: () => void;
}

// Export access check helper so it can be used for route guards
export const checkViewAccess = (role: string, view?: string, isExternal?: boolean): boolean => {
    if (isExternal) return true;
    if (!view) return true;
    switch (view) {
        case 'eAdvokasiBeranda':
            return true;

        case 'eAdvokasiInbox':
            return true;

        case 'eAdvokasiPengelolaan':
            // Pengelolaan Permohonan -> Super Admin, Manajer, Operator (Not Pegawai)
            return role !== 'Pegawai';

        case 'eAdvokasiPendampingan':
        case 'eAdvokasiPendampinganDetail':
        case 'eAdvokasiPendampinganTim':
        case 'eAdvokasiPendampinganPosisi':
        case 'eAdvokasiPendampinganDokumen':
            // Pendampingan -> Super Admin, Manajer, Pegawai (Not Operator)
            return role !== 'Operator';

        case 'eAdvokasiPenangananPerkara':
        case 'eAdvokasiPerkaraDetail':
        case 'eAdvokasiPerkaraEdit':
        case 'eAdvokasiPerkaraUpdatePosisi':
        case 'eAdvokasiPerkaraDokumen':
        case 'eAdvokasiPerkaraTim':
            // Penanganan Perkara -> Super Admin, Manajer, Pegawai (Not Operator)
            return role !== 'Operator';

        case 'eAdvokasiPenangananPutusan':
        case 'eAdvokasiPutusanDetail':
        case 'eAdvokasiPutusanEdit':
        case 'eAdvokasiPutusanUpdateTindakLanjut':
        case 'eAdvokasiPutusanTim':
        case 'eAdvokasiPutusanDokumen':
            // Penanganan Putusan -> Super Admin, Manajer, Pegawai (Not Operator)
            return role !== 'Operator';

        case 'eAdvokasiTelaahanKasusHukum':
        case 'eAdvokasiTelaahanDetail':
        case 'eAdvokasiTelaahanDokumen':
        case 'eAdvokasiTelaahanTim':
            // Telaahan Kasus Hukum -> Super Admin, Manajer, Pegawai (Not Operator)
            return role !== 'Operator';

        case 'eAdvokasiKalender':
        case 'eAdvokasiAgendaBerikutnya':
            return true;

        case 'eAdvokasiDashboard':
        case 'eAdvokasiPencarianPerkara':
        case 'eAdvokasiPencarianPendampingan':
        case 'eAdvokasiPencarianPutusan':
        case 'eAdvokasiPencarianDokumen':
        case 'eAdvokasiMonitoringPersidangan':
        case 'eAdvokasiMonitoringPutusan':
        case 'eAdvokasiMonitoringPendampingan':
        case 'eAdvokasiMonitoringPerkara':
        case 'eAdvokasiMonitoringTelaahan':
        case 'eAdvokasiMonitoringKelengkapanData':
        case 'eAdvokasiMonitoringRisikoHukum':
        case 'eAdvokasiAuditTrail':
            return true;

        case 'eAdvokasiLaporan':
            return true;

        case 'eAdvokasiTim':
            // Pengelolaan Tim -> Super Admin, Manajer, Operator (Not Pegawai)
            return role !== 'Pegawai';

        case 'eAdvokasiArsip':
            return true;

        case 'eAdvokasiRecycleBin':
            // Recycle Bin -> Super Admin, Operator (Not Manajer, Pegawai)
            return role === 'Super Admin' || role === 'Operator';

        case 'eAdvokasiReferensi':
            // Referensi -> Super Admin, Operator (Not Manajer, Pegawai)
            return role === 'Super Admin' || role === 'Operator';

        case 'eAdvokasiInfo':
            // Pengelolaan Informasi -> Super Admin only
            return role === 'Super Admin';

        case 'eAdvokasiFaq':
            // Pengelolaan FAQ -> Super Admin only
            return role === 'Super Admin';

        case 'eAdvokasiUser':
            // Manajemen User Role (User) -> Super Admin only
            return role === 'Super Admin';

        case 'none': // For expandable headers
            return true;

        default:
            return true;
    }
};

type MenuItem = {
    icon: React.ReactNode;
    name: string;
    view?: View;
    url?: string;
    isExternal?: boolean;
    badge?: string;
};

type MenuGroup = {
    title: string;
    items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
    {
        title: 'HOME',
        items: [
            { icon: <HomeIcon className="h-5 w-5" />, name: 'Beranda', view: 'eAdvokasiBeranda' as View },
            { icon: <MailIcon className="h-5 w-5" />, name: 'Permohonan Bantuan Hukum', view: 'list' as View },
            { 
                icon: <SparklesIcon className="h-5 w-5 text-indigo-500" />, 
                name: 'Law Analyzer', 
                url: 'https://law-analyzer.kemenkeu.go.id/',
                isExternal: true,
                badge: 'AI'
            },
            { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, name: 'FAQ & Bantuan', view: 'faq' as View },
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
            { icon: <ScaleIcon className="h-5 w-5" />, name: 'Telaahan Kasus Hukum', view: 'eAdvokasiTelaahanKasusHukum' as View },
        ]
    },
    {
        title: 'PEMANTAUAN & PELAPORAN',
        items: [
            { icon: <SearchIcon className="h-5 w-5" />, name: 'Pencarian', view: 'eAdvokasiPencarianPerkara' as View },
            { icon: <CalendarIcon className="h-5 w-5" />, name: 'Kalender Sidang', view: 'eAdvokasiKalender' as View },
            { icon: <DesktopComputerIcon className="h-5 w-5" />, name: 'Monitoring', view: 'eAdvokasiDashboard' as View },
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

const EAdvokasiSidebar: React.FC<EAdvokasiSidebarProps> = ({ onNavigate, currentView, onCloseMobile }) => {
    const globalRole = useAdvokasiStore((state) => state.globalRole);
  
    const isActive = (view?: View) => {
        if (!view || (view as any) === 'none') return false;
        if (view === 'eAdvokasiPendampingan') {
            return currentView.startsWith('eAdvokasiPendampingan');
        }
        if (view === 'eAdvokasiPenangananPerkara') {
            return currentView.startsWith('eAdvokasiPerkara');
        }
        if (view === 'eAdvokasiPenangananPutusan') {
            return currentView.startsWith('eAdvokasiPutusan') || currentView === 'eAdvokasiPenangananPutusan';
        }
        if (view === 'eAdvokasiTelaahanKasusHukum') {
            return currentView.startsWith('eAdvokasiTelaahan');
        }
        if (view === 'eAdvokasiPencarianPerkara') {
            return currentView.startsWith('eAdvokasiPencarian');
        }
        if (view === 'eAdvokasiDashboard') {
            return currentView === 'eAdvokasiDashboard' || currentView.startsWith('eAdvokasiMonitoring') || currentView === 'eAdvokasiAuditTrail';
        }
        return currentView === view;
    };

    // Filter menu groups and items according to role access
    const filteredGroups = menuGroups.map(group => ({
        ...group,
        items: group.items.filter(item => checkViewAccess(globalRole, item.view, item.isExternal))
    })).filter(group => group.items.length > 0);

  return (
    <aside className="w-64 max-w-[80vw] h-full bg-white border-r border-gray-200 flex flex-col p-4 space-y-4 select-none">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-800">E-Advokasi</h2>
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
        {filteredGroups.map((group, groupIndex) => (
          <div key={group.title} className={groupIndex > 0 ? "mt-4" : ""}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{group.title}</h3>
            <ul className="space-y-1">
              {group.items.map((item, index) => (
                  <li key={index}>
                    {item.isExternal && item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-md text-sm transition text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 group"
                        title="Buka Law Analyzer Kemenkeu (Tab Baru)"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {item.icon}
                          <span className="truncate font-medium">{item.name}</span>
                        </div>
                        {item.badge && (
                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200 leading-none">
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          if (item.view) onNavigate(item.view);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-sm transition text-left ${
                          isActive(item.view) ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                      </button>
                    )}
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

