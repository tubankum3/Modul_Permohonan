
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BellIcon, ViewGridIcon, MenuIcon, CheckCircleIcon } from './icons';
import { View, StatusPermohonan, StatusPerkara, StatusPendampingan, StatusPutusan, StatusTelaahan } from '../types';
import { useAdvokasiStore } from '../useAdvokasiStore';
import { checkViewAccess } from './eadvo_Sidebar';

interface HeaderProps {
    onNavigate: (view: View, data?: any) => void;
}

interface HeaderNotificationItem {
    id: string;
    category: 'Permohonan' | 'Perkara' | 'Pendampingan' | 'Putusan' | 'Telaahan' | 'Balasan';
    title: string;
    description: string;
    timeLabel: string;
    targetView: View;
    targetData?: any;
    badgeClass: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifButtonRef = useRef<HTMLButtonElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  const globalRole = useAdvokasiStore((state) => state.globalRole);
  const setGlobalRole = useAdvokasiStore((state) => state.setGlobalRole);
  const teamRole = useAdvokasiStore((state) => state.teamRole);
  const setTeamRole = useAdvokasiStore((state) => state.setTeamRole);
  const userName = useAdvokasiStore((state) => state.userName);
  const toggleMobileSidebar = useAdvokasiStore((state) => state.toggleMobileSidebar);
  const permohonanList = useAdvokasiStore((state) => state.permohonanList);
  const perkaraRecords = useAdvokasiStore((state) => state.perkaraRecords);
  const pendampinganRecords = useAdvokasiStore((state) => state.pendampinganRecords);
  const putusanRecords = useAdvokasiStore((state) => state.putusanRecords);
  const telaahanRecords = useAdvokasiStore((state) => state.telaahanRecords);
  const userAccounts = useAdvokasiStore((state) => state.userAccounts);

  const currentUserId = useMemo(
    () => userAccounts.find((u) => u.nama === userName)?.id,
    [userAccounts, userName]
  );

  const userNotifications = useMemo<HeaderNotificationItem[]>(() => {
    const items: HeaderNotificationItem[] = [];
    const isTeamMember = (team?: { id: string; nama: string }[], picId?: string) =>
      Boolean(
        (currentUserId && picId === currentUserId) ||
        team?.some((m) => m.nama === userName || (currentUserId && m.id === currentUserId))
      );

    // 1. Permohonan masuk & balasan diskusi
    permohonanList.forEach((p) => {
      if (p.deletedAt) return;
      if (globalRole !== 'Pegawai' && (p.status === StatusPermohonan.BARU || p.status === StatusPermohonan.TERKIRIM)) {
        items.push({
          id: `perm-in-${p.id}`,
          category: 'Permohonan',
          title: `Permohonan Baru (${p.Nomor || p.id})`,
          description: `${p.perihal} — ${p.unit}`,
          timeLabel: p.tanggal,
          targetView: 'eAdvokasiInbox',
          badgeClass: 'bg-blue-100 text-blue-700',
        });
      }

      const lastReply = p.history?.[p.history.length - 1];
      if (lastReply && ((globalRole === 'Pegawai' && lastReply.author === 'Administrator') || (globalRole !== 'Pegawai' && lastReply.author === 'Pegawai'))) {
        items.push({
          id: `perm-rep-${p.id}-${lastReply.id}`,
          category: 'Balasan',
          title: `Balasan ${lastReply.author} (${p.Nomor || p.id})`,
          description: lastReply.message,
          timeLabel: new Date(lastReply.timestamp).toLocaleDateString('id-ID'),
          targetView: globalRole === 'Pegawai' ? 'detail' : 'eAdvokasiInbox',
          targetData: globalRole === 'Pegawai' ? p : undefined,
          badgeClass: 'bg-indigo-100 text-indigo-700',
        });
      }
    });

    // 2. Perkara aktif & agenda sidang berikutnya
    if (checkViewAccess(globalRole, 'eAdvokasiPerkaraDetail')) {
      perkaraRecords.forEach((pk) => {
        if (pk.deletedAt || pk.statusPerkara !== StatusPerkara.AKTIF) return;
        const assigned = isTeamMember(pk.team, pk.picId);
        if (globalRole === 'Pegawai' && !assigned) return;
        const allSidang = [
          ...(pk.posisiSidang?.tkPertama || []),
          ...(pk.posisiSidang?.tkBanding || []),
          ...(pk.posisiSidang?.tkKasasi || []),
          ...(pk.posisiSidang?.tkPK || []),
        ];
        const latestSidang = allSidang[allSidang.length - 1];
        items.push({
          id: `perkara-${pk.id}`,
          category: 'Perkara',
          title: assigned ? `Penugasan Tim Perkara (${pk.abstraksiPerkara?.noPerkara || pk.Nomor || pk.id})` : `Perkara Aktif (${pk.abstraksiPerkara?.noPerkara || pk.Nomor || pk.id})`,
          description: latestSidang?.agendaBerikutnya
            ? `Agenda berikutnya: ${latestSidang.agendaBerikutnya} (${latestSidang.tanggalSidangBerikutnya || '-'})`
            : pk.perihal,
          timeLabel: latestSidang?.tanggalSidangBerikutnya || pk.tanggal,
          targetView: 'eAdvokasiPerkaraDetail',
          targetData: pk,
          badgeClass: 'bg-amber-100 text-amber-800',
        });
      });
    }

    // 3. Pendampingan aktif & agenda pemanggilan
    if (checkViewAccess(globalRole, 'eAdvokasiPendampinganDetail')) {
      pendampinganRecords.forEach((pd) => {
        if (pd.deletedAt || pd.statusPendampingan !== StatusPendampingan.AKTIF) return;
        const assigned = isTeamMember(pd.team, pd.picId);
        if (globalRole === 'Pegawai' && !assigned) return;
        const latestPos = pd.posisi?.[pd.posisi.length - 1];
        items.push({
          id: `pendampingan-${pd.id}`,
          category: 'Pendampingan',
          title: assigned ? `Penugasan Pendampingan (${pd.Nomor || pd.id})` : `Pendampingan Aktif (${pd.Nomor || pd.id})`,
          description: latestPos ? `${latestPos.agenda} — ${latestPos.lokasi || pd.unit}` : pd.perihal,
          timeLabel: latestPos?.tanggalAgenda || pd.tanggal,
          targetView: 'eAdvokasiPendampinganDetail',
          targetData: pd,
          badgeClass: 'bg-emerald-100 text-emerald-800',
        });
      });
    }

    // 4. Putusan aktif (tindak lanjut)
    if (checkViewAccess(globalRole, 'eAdvokasiPutusanDetail')) {
      putusanRecords.forEach((pt) => {
        if (pt.deletedAt || pt.statusPutusan !== StatusPutusan.AKTIF) return;
        const assigned = isTeamMember(pt.team, pt.picId);
        if (globalRole === 'Pegawai' && !assigned) return;
        items.push({
          id: `putusan-${pt.id}`,
          category: 'Putusan',
          title: `Tindak Lanjut Putusan (${pt.abstraksiPerkara?.noPerkara || pt.Nomor || pt.id})`,
          description: pt.perihal,
          timeLabel: pt.putusan?.[pt.putusan.length - 1]?.tanggal || pt.tanggal,
          targetView: 'eAdvokasiPutusanDetail',
          targetData: pt,
          badgeClass: 'bg-purple-100 text-purple-800',
        });
      });
    }

    // 5. Telaahan Kasus Hukum aktif
    if (checkViewAccess(globalRole, 'eAdvokasiTelaahanDetail')) {
      telaahanRecords.forEach((tl) => {
        if (tl.deletedAt || tl.statusTelaahan !== StatusTelaahan.AKTIF) return;
        const assigned = isTeamMember(tl.team, tl.picId);
        if (globalRole === 'Pegawai' && !assigned) return;
        items.push({
          id: `telaahan-${tl.id}`,
          category: 'Telaahan',
          title: `Telaahan Aktif (${tl.nomorTelaahan || tl.Nomor || tl.id})`,
          description: tl.perihal,
          timeLabel: tl.tanggal,
          targetView: 'eAdvokasiTelaahanDetail',
          targetData: tl,
          badgeClass: 'bg-cyan-100 text-cyan-800',
        });
      });
    }

    return items.slice(0, 12);
  }, [
    globalRole,
    userName,
    currentUserId,
    permohonanList,
    perkaraRecords,
    pendampinganRecords,
    putusanRecords,
    telaahanRecords,
  ]);

  const unreadCount = userNotifications.filter((n) => !readIds.includes(n.id)).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (
        notifPanelRef.current &&
        !notifPanelRef.current.contains(target) &&
        notifButtonRef.current &&
        !notifButtonRef.current.contains(target)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (item: HeaderNotificationItem) => {
    setReadIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    setIsNotifOpen(false);
    onNavigate(item.targetView, item.targetData);
  };

  const handleMarkAllRead = () => {
    setReadIds(userNotifications.map((n) => n.id));
  };

  return (
    <header className="bg-[#0055A5] text-white flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 shadow-md z-30 shrink-0 select-none">
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Mobile Hamburger Menu Toggle */}
        <button 
          type="button" 
          onClick={toggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-95 transition-all text-white"
          aria-label="Toggle Sidebar Navigasi"
          title="Buka / Tutup Menu Navigasi"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Application Menu" title="Pilihan Modul">
                <ViewGridIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-md shadow-xl py-1 text-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('beranda'); setIsMenuOpen(false); }}
                        className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                        Modul Permohonan Bantuan Hukum
                    </a>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('pilihTemplate'); setIsMenuOpen(false); }}
                        className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                        Modul Nadine
                    </a>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('eAdvokasiInbox'); setIsMenuOpen(false); }}
                        className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                        Modul E-Advokasi
                    </a>
                </div>
            )}
        </div>
        <h1 className="text-base sm:text-xl font-bold tracking-tight whitespace-nowrap">satu kemenkeu</h1>
      </div>

      <div className="relative flex items-center space-x-2 sm:space-x-3">
        {/* Role Switcher Widget */}
        <div className="flex items-center bg-white/15 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/25 shadow-inner">
          <span className="hidden sm:inline text-xs text-blue-100 font-medium mr-1.5 whitespace-nowrap">Role:</span>
          <select 
            value={globalRole} 
            onChange={(e) => {
              const val = e.target.value as any;
              setGlobalRole(val);
              useAdvokasiStore.getState().showNotification(`Peran berganti: ${val}`, 'info');
            }}
            className="bg-transparent text-xs sm:text-sm text-white font-semibold focus:outline-none cursor-pointer hover:text-blue-100 transition [&>option]:text-gray-900 border-none outline-none py-0 pr-4"
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
                className="bg-transparent text-xs sm:text-sm text-white font-semibold focus:outline-none cursor-pointer hover:text-blue-100 transition [&>option]:text-gray-900 border-none outline-none py-0 pr-4"
              >
                <option value="PIC">PIC</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </>
          )}
        </div>

        <button
          ref={notifButtonRef}
          type="button"
          onClick={() => setIsNotifOpen((prev) => !prev)}
          className="relative p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition text-white"
          title="Notifikasi"
          aria-label="Notifikasi Pengguna"
          aria-expanded={isNotifOpen}
        >
          <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none ring-2 ring-[#0055A5]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isNotifOpen && (
          <div
            ref={notifPanelRef}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 text-gray-800 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Notifikasi Pengguna</h2>
                <p className="text-[11px] text-gray-500">
                  {userName} · {globalRole}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {userNotifications.length > 0 ? (
                userNotifications.map((item) => {
                  const isRead = readIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item)}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50/70 transition flex items-start space-x-3 ${
                        isRead ? 'bg-white opacity-75' : 'bg-blue-50/30'
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                          isRead ? 'bg-gray-300' : 'bg-blue-600'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.badgeClass}`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {item.timeLabel}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-10 text-center text-gray-500">
                  <CheckCircleIcon className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-700">Belum ada notifikasi baru</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Pembaruan permohonan dan penugasan Anda akan muncul di sini.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
           <img src="https://i.pravatar.cc/40?img=1" alt="User" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-1 ring-white/40" />
           <div className="text-left leading-tight hidden lg:block">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-[10px] text-blue-100 font-medium">{globalRole === 'Pegawai' ? `${globalRole} (${teamRole})` : globalRole}</p>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
