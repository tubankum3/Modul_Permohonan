import React, { useEffect, useCallback, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/queryClient';
import { useAdvokasiStore } from './useAdvokasiStore';
import { Layout } from './components/Layout';
import { checkViewAccess } from './components/eadvo_Sidebar';
import { NadineLayout } from './components/nadine_Layout';
import Notification from './components/Notification';
import { ArrowLeftIcon } from './components/icons';
import Breadcrumb from './components/Breadcrumb';
import { 
  Permohonan, View, JenisPermohonan, StatusPermohonan, 
  PendampinganRecord, PerkaraRecord, StatusPerkara, StatusPutusan, Riwayat, TeamMember 
} from './types';

// Lazy loading large components to satisfy the domain code-splitting request
const BerandaPage = React.lazy(() => import('./components/BerandaPage'));
const FaqPage = React.lazy(() => import('./components/FaqPage'));
const PilihTemplateNaskah = React.lazy(() => import('./components/nadine_PilihTemplateNaskah'));
const FormNaskahDinas = React.lazy(() => import('./components/nadine_FormNaskahDinas'));

// Satuan Kerja (Permohonan)
const DaftarPermohonan = React.lazy(() => import('./components/satkem_DaftarPermohonan'));
const DetailPermohonan = React.lazy(() => import('./components/satkem_DetailPermohonan'));
const BuatPermohonan = React.lazy(() => import('./components/satkem_BuatPermohonan'));
const PengelolaanPermohonan = React.lazy(() => import('./components/eadvo_PengelolaanPermohonan'));
const ProsesPermohonan = React.lazy(() => import('./components/satkem_ProsesPermohonan'));

// E-Advokasi
const EAdvokasiInbox = React.lazy(() => import('./components/eadvo_Inbox'));
const PengelolaanInformasi = React.lazy(() => import('./components/eadvo_PengelolaanInformasi'));
const PengelolaanFaq = React.lazy(() => import('./components/eadvo_PengelolaanFaq'));
const Pendampingan = React.lazy(() => import('./components/eadvo_Pendampingan'));
const DetailPendampingan = React.lazy(() => import('./components/eadvo_DetailPendampingan'));
const AssignTeam = React.lazy(() => import('./components/AssignTeam'));
const PosisiPendampingan = React.lazy(() => import('./components/eadvo_PosisiPendampingan'));
const PenangananPerkara = React.lazy(() => import('./components/eadvo_PenangananPerkara'));
const DetailPerkara = React.lazy(() => import('./components/eadvo_DetailPerkara'));
const EditPerkara = React.lazy(() => import('./components/eadvo_EditPerkara'));
const UpdatePosisiPerkara = React.lazy(() => import('./components/eadvo_UpdatePosisiPerkara'));
const EAdvokasiKalender = React.lazy(() => import('./components/eadvo_Kalender'));
const DaftarAgendaBerikutnya = React.lazy(() => import('./components/eadvo_DaftarAgendaBerikutnya'));
const PenangananPutusan = React.lazy(() => import('./components/eadvo_PenangananPutusan'));
const DetailPutusan = React.lazy(() => import('./components/eadvo_DetailPutusan'));
const UpdateTindakLanjut = React.lazy(() => import('./components/eadvo_UpdateTindakLanjut'));
const EditPutusan = React.lazy(() => import('./components/eadvo_EditPutusan'));
const DokumenPerkara = React.lazy(() => import('./components/eadvo_DokumenPerkara'));
const DokumenPutusan = React.lazy(() => import('./components/eadvo_DokumenPutusan'));
const DokumenPendampingan = React.lazy(() => import('./components/eadvo_DokumenPendampingan'));
const Arsip = React.lazy(() => import('./components/eadvo_Arsip'));
const RecycleBin = React.lazy(() => import('./components/eadvo_RecycleBin'));
const Monitoring = React.lazy(() => import('./components/eadvo_Monitoring'));


const viewToPath = (view: View, id?: string): string => {
  switch (view) {
    case 'beranda': return '/';
    case 'eAdvokasiBeranda': return '/eadvokasi';
    case 'list': return '/satkem/permohonan';
    case 'create': return '/satkem/permohonan/create';
    case 'detail': return id ? `/satkem/permohonan/detail/${id}` : '/satkem/permohonan';
    case 'edit': return id ? `/satkem/permohonan/edit/${id}` : '/satkem/permohonan';
    case 'pilihTemplate': return '/nadine/pilih-template';
    case 'formNaskah': return '/nadine/form-naskah';
    case 'faq': return '/faq';
    case 'eAdvokasiInbox': return '/eadvokasi/inbox';
    case 'eAdvokasiPengelolaan': return '/eadvokasi/pengelolaan';
    case 'eAdvokasiProses': return id ? `/eadvokasi/proses/${id}` : '/eadvokasi/inbox';
    case 'eAdvokasiInfo': return '/eadvokasi/info';
    case 'eAdvokasiFaq': return '/eadvokasi/faq';
    case 'eAdvokasiPendampingan': return '/eadvokasi/pendampingan';
    case 'eAdvokasiPendampinganDetail': return id ? `/eadvokasi/pendampingan/detail/${id}` : '/eadvokasi/pendampingan';
    case 'eAdvokasiPendampinganTim': return id ? `/eadvokasi/pendampingan/tim/${id}` : '/eadvokasi/pendampingan';
    case 'eAdvokasiPendampinganPosisi': return id ? `/eadvokasi/pendampingan/posisi/${id}` : '/eadvokasi/pendampingan';
    case 'eAdvokasiPendampinganDokumen': return id ? `/eadvokasi/pendampingan/dokumen/${id}` : '/eadvokasi/pendampingan';
    case 'eAdvokasiPenangananPerkara': return '/eadvokasi/perkara';
    case 'eAdvokasiPerkaraDetail': return id ? `/eadvokasi/perkara/detail/${id}` : '/eadvokasi/perkara';
    case 'eAdvokasiPerkaraEdit': return id ? `/eadvokasi/perkara/edit/${id}` : '/eadvokasi/perkara/create';
    case 'eAdvokasiPerkaraUpdatePosisi': return id ? `/eadvokasi/perkara/posisi/${id}` : '/eadvokasi/perkara';
    case 'eAdvokasiPerkaraDokumen': return id ? `/eadvokasi/perkara/dokumen/${id}` : '/eadvokasi/perkara';
    case 'eAdvokasiPerkaraTim': return id ? `/eadvokasi/perkara/tim/${id}` : '/eadvokasi/perkara';
    case 'eAdvokasiKalender': return '/eadvokasi/kalender';
    case 'eAdvokasiAgendaBerikutnya': return '/eadvokasi/agenda';
    case 'eAdvokasiPenangananPutusan': return '/eadvokasi/putusan';
    case 'eAdvokasiPutusanDetail': return id ? `/eadvokasi/putusan/detail/${id}` : '/eadvokasi/putusan';
    case 'eAdvokasiPutusanEdit': return id ? `/eadvokasi/putusan/edit/${id}` : '/eadvokasi/putusan';
    case 'eAdvokasiPutusanUpdateTindakLanjut': return id ? `/eadvokasi/putusan/tindak-lanjut/${id}` : '/eadvokasi/putusan';
    case 'eAdvokasiPutusanTim': return id ? `/eadvokasi/putusan/tim/${id}` : '/eadvokasi/putusan';
    case 'eAdvokasiPutusanDokumen': return id ? `/eadvokasi/putusan/dokumen/${id}` : '/eadvokasi/putusan';
    case 'eAdvokasiDashboard': return '/eadvokasi/monitoring/dashboard';
    case 'eAdvokasiPencarianPerkara': return '/eadvokasi/monitoring/cari-perkara';
    case 'eAdvokasiPencarianPendampingan': return '/eadvokasi/monitoring/cari-pendampingan';
    case 'eAdvokasiPencarianPutusan': return '/eadvokasi/monitoring/cari-putusan';
    case 'eAdvokasiPencarianDokumen': return '/eadvokasi/monitoring/cari-dokumen';
    case 'eAdvokasiPencarianBankDalil': return '/eadvokasi/monitoring/bank-dalil';
    case 'eAdvokasiMonitoringPersidangan': return '/eadvokasi/monitoring/persidangan';
    case 'eAdvokasiMonitoringPutusan': return '/eadvokasi/monitoring/putusan';
    case 'eAdvokasiMonitoringPendampingan': return '/eadvokasi/monitoring/pendampingan';
    case 'eAdvokasiMonitoringPerkara': return '/eadvokasi/monitoring/perkara';
    case 'eAdvokasiMonitoringRisikoHukum': return '/eadvokasi/monitoring/risiko-hukum';
    case 'eAdvokasiAuditTrail': return '/eadvokasi/monitoring/audit-trail';
    case 'eAdvokasiArsip': return '/eadvokasi/arsip';
    case 'eAdvokasiRecycleBin': return '/eadvokasi/recycle-bin';
    case 'eAdvokasiLaporan': return '/eadvokasi/laporan';
    case 'eAdvokasiUser': return '/eadvokasi/user';
    case 'eAdvokasiReferensi': return '/eadvokasi/referensi';
    case 'eAdvokasiTim': return '/eadvokasi/tim';
    default: return '/';
  }
};


const pathToView = (pathname: string): { view: View; id?: string } => {
  if (pathname === '/' || pathname === '/beranda') return { view: 'beranda' };
  if (pathname === '/eadvokasi') return { view: 'eAdvokasiBeranda' };
  if (pathname === '/satkem/permohonan') return { view: 'list' };
  if (pathname === '/satkem/permohonan/create') return { view: 'create' };
  if (pathname.startsWith('/satkem/permohonan/detail/')) return { view: 'detail', id: pathname.replace('/satkem/permohonan/detail/', '') };
  if (pathname.startsWith('/satkem/permohonan/edit/')) return { view: 'edit', id: pathname.replace('/satkem/permohonan/edit/', '') };
  if (pathname === '/nadine/pilih-template') return { view: 'pilihTemplate' };
  if (pathname === '/nadine/form-naskah') return { view: 'formNaskah' };
  if (pathname === '/faq') return { view: 'faq' };
  if (pathname === '/eadvokasi/inbox') return { view: 'eAdvokasiInbox' };
  if (pathname === '/eadvokasi/pengelolaan') return { view: 'eAdvokasiPengelolaan' };
  if (pathname.startsWith('/eadvokasi/proses/')) return { view: 'eAdvokasiProses', id: pathname.replace('/eadvokasi/proses/', '') };
  if (pathname === '/eadvokasi/info') return { view: 'eAdvokasiInfo' };
  if (pathname === '/eadvokasi/faq') return { view: 'eAdvokasiFaq' };
  if (pathname === '/eadvokasi/pendampingan') return { view: 'eAdvokasiPendampingan' };
  if (pathname.startsWith('/eadvokasi/pendampingan/detail/')) return { view: 'eAdvokasiPendampinganDetail', id: pathname.replace('/eadvokasi/pendampingan/detail/', '') };
  if (pathname.startsWith('/eadvokasi/pendampingan/tim/')) return { view: 'eAdvokasiPendampinganTim', id: pathname.replace('/eadvokasi/pendampingan/tim/', '') };
  if (pathname.startsWith('/eadvokasi/pendampingan/posisi/')) return { view: 'eAdvokasiPendampinganPosisi', id: pathname.replace('/eadvokasi/pendampingan/posisi/', '') };
  if (pathname.startsWith('/eadvokasi/pendampingan/dokumen/')) return { view: 'eAdvokasiPendampinganDokumen', id: pathname.replace('/eadvokasi/pendampingan/dokumen/', '') };
  if (pathname === '/eadvokasi/perkara') return { view: 'eAdvokasiPenangananPerkara' };
  if (pathname === '/eadvokasi/perkara/create') return { view: 'eAdvokasiPerkaraEdit' };
  if (pathname.startsWith('/eadvokasi/perkara/detail/')) return { view: 'eAdvokasiPerkaraDetail', id: pathname.replace('/eadvokasi/perkara/detail/', '') };
  if (pathname.startsWith('/eadvokasi/perkara/edit/')) return { view: 'eAdvokasiPerkaraEdit', id: pathname.replace('/eadvokasi/perkara/edit/', '') };
  if (pathname.startsWith('/eadvokasi/perkara/posisi/')) return { view: 'eAdvokasiPerkaraUpdatePosisi', id: pathname.replace('/eadvokasi/perkara/posisi/', '') };
  if (pathname.startsWith('/eadvokasi/perkara/dokumen/')) return { view: 'eAdvokasiPerkaraDokumen', id: pathname.replace('/eadvokasi/perkara/dokumen/', '') };
  if (pathname.startsWith('/eadvokasi/perkara/tim/')) return { view: 'eAdvokasiPerkaraTim', id: pathname.replace('/eadvokasi/perkara/tim/', '') };
  if (pathname === '/eadvokasi/kalender') return { view: 'eAdvokasiKalender' };
  if (pathname === '/eadvokasi/agenda') return { view: 'eAdvokasiAgendaBerikutnya' };
  if (pathname === '/eadvokasi/putusan') return { view: 'eAdvokasiPenangananPutusan' };
  if (pathname.startsWith('/eadvokasi/putusan/detail/')) return { view: 'eAdvokasiPutusanDetail', id: pathname.replace('/eadvokasi/putusan/detail/', '') };
  if (pathname.startsWith('/eadvokasi/putusan/edit/')) return { view: 'eAdvokasiPutusanEdit', id: pathname.replace('/eadvokasi/putusan/edit/', '') };
  if (pathname.startsWith('/eadvokasi/putusan/tindak-lanjut/')) return { view: 'eAdvokasiPutusanUpdateTindakLanjut', id: pathname.replace('/eadvokasi/putusan/tindak-lanjut/', '') };
  if (pathname.startsWith('/eadvokasi/putusan/tim/')) return { view: 'eAdvokasiPutusanTim', id: pathname.replace('/eadvokasi/putusan/tim/', '') };
  if (pathname.startsWith('/eadvokasi/putusan/dokumen/')) return { view: 'eAdvokasiPutusanDokumen', id: pathname.replace('/eadvokasi/putusan/dokumen/', '') };
  if (pathname === '/eadvokasi/monitoring/dashboard') return { view: 'eAdvokasiDashboard' };
  if (pathname === '/eadvokasi/monitoring/cari-perkara') return { view: 'eAdvokasiPencarianPerkara' };
  if (pathname === '/eadvokasi/monitoring/cari-pendampingan') return { view: 'eAdvokasiPencarianPendampingan' };
  if (pathname === '/eadvokasi/monitoring/cari-putusan') return { view: 'eAdvokasiPencarianPutusan' };
  if (pathname === '/eadvokasi/monitoring/cari-dokumen') return { view: 'eAdvokasiPencarianDokumen' };
  if (pathname === '/eadvokasi/monitoring/bank-dalil') return { view: 'eAdvokasiPencarianBankDalil' };
  if (pathname === '/eadvokasi/monitoring/persidangan') return { view: 'eAdvokasiMonitoringPersidangan' };
  if (pathname === '/eadvokasi/monitoring/putusan') return { view: 'eAdvokasiMonitoringPutusan' };
  if (pathname === '/eadvokasi/monitoring/pendampingan') return { view: 'eAdvokasiMonitoringPendampingan' };
  if (pathname === '/eadvokasi/monitoring/perkara') return { view: 'eAdvokasiMonitoringPerkara' };
  if (pathname === '/eadvokasi/monitoring/risiko-hukum') return { view: 'eAdvokasiMonitoringRisikoHukum' };
  if (pathname === '/eadvokasi/monitoring/audit-trail') return { view: 'eAdvokasiAuditTrail' };
  if (pathname === '/eadvokasi/arsip') return { view: 'eAdvokasiArsip' };
  if (pathname === '/eadvokasi/recycle-bin') return { view: 'eAdvokasiRecycleBin' };
  if (pathname === '/eadvokasi/laporan') return { view: 'eAdvokasiLaporan' };
  if (pathname === '/eadvokasi/user') return { view: 'eAdvokasiUser' };
  if (pathname === '/eadvokasi/referensi') return { view: 'eAdvokasiReferensi' };
  if (pathname === '/eadvokasi/tim') return { view: 'eAdvokasiTim' };
  return { view: 'beranda' };
};

const AppContent: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Load state and actions directly from Zustand store
  const {
    permohonanList,
    selectedPermohonan,
    notification,
    currentPermohonanToProses,
    berandaContent,
    faqData,
    pendampinganRecords,
    selectedPendampingan,
    perkaraRecords,
    selectedPerkara,
    putusanRecords,
    selectedPutusan,
    setNotification,
    setPutusanRecords,
    setSelectedPermohonan,
    setSelectedPendampingan,
    setSelectedPerkara,
    setSelectedPutusan,
    handleSaveDraft,
    handleUpdateDraft,
    handleDelete,
    handleSend,
    handleAddReply,
    handleUpdateReply,
    handleDeleteReply,
    handleProses,
    handleAcceptPermohonan,
    handleUpdateStatus,
    handleTarikDataNadine,
    handleSaveBerandaContent,
    handleSaveFaq,
    handleSavePendampingan,
    handleDeletePendampingan,
    handleAddPosisiUpdate,
    handleUpdatePosisiUpdate,
    handleDeletePosisiUpdate,
    handleUpdatePendampinganTeam,
    handleSetPendampinganPic,
    handleSavePerkara,
    handleDeletePerkara,
    handleUpdatePerkaraStatus,
    handleForwardPerkara,
    handleUpdatePerkaraTeam,
    handleSetPerkaraPic,
    handleSavePutusan,
    handleDeletePutusan,
    handleSetPutusanSelesai,
    handleRestorePutusan,
    handleAssignToExisting,
    handleSetPermohonanPic,
    handleUpdatePermohonanTeam,
    globalRole,
    teamRole,
  } = useAdvokasiStore();

  const currentView = pathToView(pathname).view;

  // React Router-based navigation helper passed down to older components
  const handleNavigate = useCallback((view: View, data?: any) => {
    let id: string | undefined = undefined;
    if (data) {
      if (typeof data === 'string') id = data;
      else if (data.id) id = data.id;
    }

    if (view === 'list' || view === 'eAdvokasiPengelolaan') {
      setSelectedPermohonan(null);
    }
    if (!['eAdvokasiPendampinganDetail', 'eAdvokasiPendampinganPosisi', 'eAdvokasiPendampinganTim', 'eAdvokasiPendampinganDokumen'].includes(view)) {
        setSelectedPendampingan(null);
    }
    if (!view.startsWith('eAdvokasiPerkara') || (view === 'eAdvokasiPerkaraEdit' && !data)) {
        setSelectedPerkara(null);
    }
    if (!view.startsWith('eAdvokasiPutusan')) {
        setSelectedPutusan(null);
    }

    if (data && typeof data !== 'string') {
        if (view.startsWith('eAdvokasiPendampingan')) setSelectedPendampingan(data);
        if (view.startsWith('eAdvokasiPerkara')) setSelectedPerkara(data);
        if (view.startsWith('eAdvokasiPutusan')) setSelectedPutusan(data);
    }

    const path = viewToPath(view, id);
    navigate(path);
  }, [navigate, setSelectedPermohonan, setSelectedPendampingan, setSelectedPerkara, setSelectedPutusan]);

  // Synchronize state lookup automatically on URL/pathname changes to enable URL sharing
  useEffect(() => {
    const { view, id } = pathToView(pathname);
    if (id) {
       if (view.startsWith('eAdvokasiPendampingan')) {
         const record = pendampinganRecords.find(r => r.id === id);
         if (record && selectedPendampingan?.id !== id) {
           setSelectedPendampingan(record);
         }
       } else if (view.startsWith('eAdvokasiPerkara')) {
         const record = perkaraRecords.find(r => r.id === id);
         if (record && (selectedPerkara as PerkaraRecord)?.id !== id) {
           setSelectedPerkara(record);
         }
       } else if (view.startsWith('eAdvokasiPutusan')) {
         const record = putusanRecords.find(r => r.id === id);
         if (record && selectedPutusan?.id !== id) {
           setSelectedPutusan(record);
         }
       } else if (view === 'detail' || view === 'edit') {
         const record = permohonanList.find(r => r.id === id);
         if (record && selectedPermohonan?.id !== id) {
           setSelectedPermohonan(record);
         }
       } else if (view === 'eAdvokasiProses') {
         const record = permohonanList.find(r => r.id === id);
         if (record && currentPermohonanToProses?.id !== id) {
            useAdvokasiStore.setState({ currentPermohonanToProses: record });
         }
       }
    }
  }, [pathname, permohonanList, pendampinganRecords, perkaraRecords, putusanRecords, selectedPendampingan, selectedPerkara, selectedPutusan, selectedPermohonan, currentPermohonanToProses, setSelectedPendampingan, setSelectedPerkara, setSelectedPutusan, setSelectedPermohonan]);

  // Reactive logic that moves active matters with Kalah judgments into Penanganan Putusan
  useEffect(() => {
    const recordsToMove = perkaraRecords.filter(p => 
        p.statusPerkara === StatusPerkara.AKTIF && 
        p.statusBHT?.status === 'Inkracht' && 
        p.putusan?.some(put => put.status === 'Kalah')
    );

    if (recordsToMove.length > 0) {
        const newPutusanRecords = recordsToMove.map(p => ({ ...p, statusPutusan: StatusPutusan.AKTIF }));
        const existingIds = new Set(putusanRecords.map(r => r.id));
        const uniqueNewRecords = newPutusanRecords.filter(r => !existingIds.has(r.id));
        if (uniqueNewRecords.length > 0) {
            setPutusanRecords([...putusanRecords, ...uniqueNewRecords]);
        }
    }
  }, [perkaraRecords, putusanRecords, setPutusanRecords]);

  const showNotification = useCallback((message: string, type: any = 'success') => {
    setNotification({ message, type });
  }, [setNotification]);

  // Redirect to eAdvokasiBeranda if user role changes and they lose access to current active view
  useEffect(() => {
    if (pathname.startsWith('/eadvokasi') && !checkViewAccess(globalRole, currentView)) {
      navigate('/eadvokasi');
      showNotification('Akses terbatas untuk peran Anda saat ini.', 'info');
    }
  }, [globalRole, currentView, pathname, navigate, showNotification]);

  const handleSelectPermohonan = (permohonan: Permohonan) => {
    setSelectedPermohonan(permohonan);
    if(currentView !== 'eAdvokasiPengelolaan') {
        handleNavigate('detail', permohonan);
    }
  };

  const renderMainContent = () => {
    const isAuthorized = checkViewAccess(globalRole, currentView);
    if (!isAuthorized && pathname.startsWith('/eadvokasi')) {
      return (
        <div id="restricted-access-panel" className="p-12 max-w-2xl mx-auto mt-16 text-center bg-white rounded-xl shadow-lg border border-red-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-650 mb-6 border border-red-200">
            {/* Padlock Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-650" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0H9m1.414-4.586a1.5 1.5 0 002.172 0l3-3a1.5 1.5 0 00-2.172-2.172l-3 3a1.5 1.5 0 000 2.172zM12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Terbatas</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Halaman ini membutuhkan kewenangan khusus. Peran Anda saat ini (<strong>{globalRole}</strong>) tidak memiliki izin untuk melihat modul ini.
          </p>
          <button 
            onClick={() => handleNavigate('eAdvokasiBeranda')} 
            className="px-5 py-2.5 bg-[#0055A5] text-white font-semibold rounded-lg hover:bg-blue-700 hover:shadow-md transition text-sm flex items-center justify-center mx-auto"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Kembali ke Beranda E-Advokasi
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'beranda': 
        return <BerandaPage content={berandaContent} onNavigate={handleNavigate} />;
      case 'eAdvokasiBeranda': 
        return <BerandaPage isDashboard permohonanList={permohonanList} pendampinganRecords={pendampinganRecords} perkaraRecords={perkaraRecords} putusanRecords={putusanRecords} onNavigate={handleNavigate} />;
      case 'list':
      case 'detail':
      case 'create':
      case 'edit':
        return (
          <div className="flex h-full w-full">
            <DaftarPermohonan permohonanList={permohonanList} selectedId={selectedPermohonan?.id} onSelect={handleSelectPermohonan} onCreateNew={() => handleNavigate('create')} onEdit={(p) => { setSelectedPermohonan(p); handleNavigate('edit', p); }} onDelete={handleDelete} onSend={handleSend} currentView={currentView} viewMode="user"/>
            {currentView === 'detail' && selectedPermohonan && <DetailPermohonan permohonan={selectedPermohonan} onAddReply={handleAddReply} onUpdateReply={handleUpdateReply} onDeleteReply={handleDeleteReply} currentUserRole="Pegawai" />}
            {currentView === 'create' && <BuatPermohonan onSaveDraft={handleSaveDraft} onCancel={() => handleNavigate('list')} onNavigateToNadine={() => handleNavigate('pilihTemplate')} />}
            {currentView === 'edit' && selectedPermohonan && <BuatPermohonan initialData={selectedPermohonan} onUpdateDraft={handleUpdateDraft} onCancel={() => handleNavigate('list')} onNavigateToNadine={() => handleNavigate('pilihTemplate')} />}
          </div>
        );
      case 'pilihTemplate': 
        return <PilihTemplateNaskah onBack={() => handleNavigate('beranda')} onNext={() => handleNavigate('formNaskah')} />;
      case 'formNaskah': 
        return <FormNaskahDinas onBack={() => handleNavigate('pilihTemplate')} onNext={() => showNotification("Fitur ini belum diimplementasikan", "info")} />;
      case 'faq': 
        return <FaqPage faqData={faqData} />;
      case 'eAdvokasiInbox': 
        return <EAdvokasiInbox permohonanList={permohonanList.filter(p => (p.status === StatusPermohonan.TERKIRIM || p.status === StatusPermohonan.BARU) && !p.deletedAt)} onProses={(p) => { handleProses(p); handleNavigate('eAdvokasiProses', p); }} onTarikData={handleTarikDataNadine} onNavigate={handleNavigate} />;
      case 'eAdvokasiPengelolaan': 
        return <PengelolaanPermohonan permohonanList={permohonanList.filter(p => p.status === StatusPermohonan.DIPROSES || p.status === StatusPermohonan.SELESAI)} selectedPermohonan={selectedPermohonan} onSelectPermohonan={setSelectedPermohonan} onAddReply={handleAddReply} onUpdateReply={handleUpdateReply} onDeleteReply={handleDeleteReply} onUpdateStatus={handleUpdateStatus} onUpdateTeam={handleUpdatePermohonanTeam} onSetPic={handleSetPermohonanPic} onNavigate={handleNavigate} />;
      case 'eAdvokasiProses': 
        return currentPermohonanToProses ? (
          <ProsesPermohonan 
              permohonan={currentPermohonanToProses} 
              pendampinganRecords={pendampinganRecords}
              perkaraRecords={perkaraRecords}
              putusanRecords={putusanRecords}
              onBack={() => handleNavigate('eAdvokasiInbox')} 
              onAccept={handleAcceptPermohonan} 
              onAssignToExisting={handleAssignToExisting}
              onAddReply={handleAddReply} 
              onUpdateReply={handleUpdateReply} 
              onDeleteReply={handleDeleteReply}
              onUpdateTeam={handleUpdatePermohonanTeam}
              onSetPic={handleSetPermohonanPic}
              onNavigate={handleNavigate}
          />
        ) : <div className="p-8">Permohonan tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiInbox')} className="text-blue-600 underline">Inbox</button>.</div>;
      case 'eAdvokasiInfo': 
        return <PengelolaanInformasi content={berandaContent} onSave={handleSaveBerandaContent} onNavigate={handleNavigate} />;
      case 'eAdvokasiFaq': 
        return <PengelolaanFaq faqData={faqData} onSave={handleSaveFaq} onNavigate={handleNavigate} />;
      case 'eAdvokasiPendampingan':
        const pendampinganBaruList = permohonanList.filter(p => p.status === StatusPermohonan.DIPROSES && p.jenis === JenisPermohonan.PENDAMPINGAN && !pendampinganRecords.some(r => r.id === p.id) && !p.assignedTo);
        return <Pendampingan pendampinganBaruList={pendampinganBaruList} daftarPendampingan={pendampinganRecords.filter(r => !r.deletedAt)} onUpdateStatus={(id, status) => handleUpdateStatus(id, status)} onSave={handleSavePendampingan} onDelete={handleDeletePendampingan} onView={(record) => { setSelectedPendampingan(record); handleNavigate('eAdvokasiPendampinganDetail', record); }} onNavigate={handleNavigate} onManagePosisi={(record) => { setSelectedPendampingan(record); handleNavigate('eAdvokasiPendampinganPosisi', record); }} showNotification={showNotification} />;
      case 'eAdvokasiPendampinganDetail': 
        return selectedPendampingan ? <DetailPendampingan record={selectedPendampingan} onBack={() => handleNavigate(selectedPendampingan.deletedAt ? 'eAdvokasiRecycleBin' : 'eAdvokasiPendampingan')} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="text-blue-600 underline">Daftar Pendampingan</button>.</div>;
      case 'eAdvokasiPendampinganTim': 
        return selectedPendampingan ? (<div className="h-full flex flex-col bg-gray-50"><div className="px-6 pt-4 bg-white flex-shrink-0"><Breadcrumb currentView="eAdvokasiPendampinganTim" onNavigate={handleNavigate} /></div><header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start"><button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1"><ArrowLeftIcon className="h-5 w-5" /></button><div className="ml-3"><h2 className="text-lg font-bold text-gray-800">Pengelolaan Tim Advokasi</h2><p className="text-sm text-gray-500 mt-1">{selectedPendampingan.Nomor} - {selectedPendampingan.perihal}</p></div></header><div className="flex-1 overflow-y-auto"><AssignTeam team={selectedPendampingan.team || []} picId={selectedPendampingan.picId || null} onUpdateTeam={(team) => handleUpdatePendampinganTeam(selectedPendampingan.id, team)} onSetPic={(picId) => handleSetPendampinganPic(selectedPendampingan.id, picId)}/></div></div>) : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="text-blue-600 underline">Daftar Pendampingan</button>.</div>;
      case 'eAdvokasiPendampinganPosisi': 
        return selectedPendampingan ? (<PosisiPendampingan record={selectedPendampingan} onBack={() => handleNavigate('eAdvokasiPendampingan')} onAddPosisi={(posisi) => handleAddPosisiUpdate(selectedPendampingan.id, posisi)} onUpdatePosisi={(posisiId, posisi) => handleUpdatePosisiUpdate(selectedPendampingan.id, posisiId, posisi)} onDeletePosisi={(posisiId) => handleDeletePosisiUpdate(selectedPendampingan.id, posisiId)} onNavigate={handleNavigate}/>) : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="text-blue-600 underline">Daftar Pendampingan</button>.</div>;
      case 'eAdvokasiPendampinganDokumen': 
        return selectedPendampingan ? <DokumenPendampingan record={selectedPendampingan} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="text-blue-600 underline">Daftar Pendampingan</button>.</div>;
      case 'eAdvokasiPenangananPerkara':
        const perkaraBaruList = permohonanList.filter(p => p.status === StatusPermohonan.DIPROSES && p.jenis === JenisPermohonan.PENANGANAN_PERKARA && !perkaraRecords.some(r => r.id === p.id) && !p.assignedTo);
        return <PenangananPerkara perkaraBaruList={perkaraBaruList} daftarPerkara={perkaraRecords.filter(r => !r.deletedAt)} onUpdateStatus={handleUpdatePerkaraStatus} onSave={handleSavePerkara} onDelete={handleDeletePerkara} onView={(record) => { setSelectedPerkara(record); handleNavigate('eAdvokasiPerkaraDetail', record); }} onNavigate={handleNavigate} onForward={handleForwardPerkara} />;
      case 'eAdvokasiPerkaraDetail': 
        return selectedPerkara && 'statusPerkara' in selectedPerkara ? <DetailPerkara record={selectedPerkara as PerkaraRecord} onBack={() => handleNavigate((selectedPerkara as PerkaraRecord).deletedAt ? 'eAdvokasiRecycleBin' : 'eAdvokasiPenangananPerkara')} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="text-blue-600 underline">Daftar Perkara</button>.</div>;
      case 'eAdvokasiPerkaraEdit': 
        return <EditPerkara initialData={selectedPerkara} onSave={handleSavePerkara} onBack={() => handleNavigate('eAdvokasiPenangananPerkara')} showNotification={showNotification} onNavigate={handleNavigate} />;
      case 'eAdvokasiPerkaraUpdatePosisi': 
        return selectedPerkara && 'statusPerkara' in selectedPerkara ? <UpdatePosisiPerkara record={selectedPerkara as PerkaraRecord} onSave={handleSavePerkara} onBack={() => handleNavigate('eAdvokasiPenangananPerkara')} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="text-blue-600 underline">Daftar Perkara</button>.</div>;
      case 'eAdvokasiPerkaraDokumen': 
        return selectedPerkara && 'statusPerkara' in selectedPerkara ? <DokumenPerkara record={selectedPerkara as PerkaraRecord} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="text-blue-600 underline">Daftar Perkara</button>.</div>;
      case 'eAdvokasiPerkaraTim': 
        return selectedPerkara && 'statusPerkara' in selectedPerkara ? (<div className="h-full flex flex-col bg-gray-50"><div className="px-6 pt-4 bg-white flex-shrink-0"><Breadcrumb currentView="eAdvokasiPerkaraTim" onNavigate={handleNavigate} /></div><header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start"><button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1"><ArrowLeftIcon className="h-5 w-5" /></button><div className="ml-3"><h2 className="text-lg font-bold text-gray-800">Pengelolaan Tim Advokasi</h2><p className="text-sm text-gray-500 mt-1">{(selectedPerkara as PerkaraRecord).abstraksiPerkara?.noPerkara || (selectedPerkara as PerkaraRecord).Nomor} - {(selectedPerkara as PerkaraRecord).perihal}</p></div></header><div className="flex-1 overflow-y-auto"><AssignTeam team={(selectedPerkara as PerkaraRecord).team || []} picId={(selectedPerkara as PerkaraRecord).picId || null} onUpdateTeam={(team) => handleUpdatePerkaraTeam((selectedPerkara as PerkaraRecord).id, team)} onSetPic={(picId) => handleSetPerkaraPic((selectedPerkara as PerkaraRecord).id, picId)}/></div></div>) : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="text-blue-600 underline">Daftar Perkara</button>.</div>;
      case 'eAdvokasiKalender': 
        return <EAdvokasiKalender daftarPerkara={perkaraRecords} onNavigate={handleNavigate} />;
      case 'eAdvokasiAgendaBerikutnya': 
        return <DaftarAgendaBerikutnya daftarPerkara={perkaraRecords} onBack={() => handleNavigate('eAdvokasiKalender')} onNavigate={handleNavigate} />;
      case 'eAdvokasiPenangananPutusan': 
        return <PenangananPutusan daftarPutusan={putusanRecords.filter(r => !r.deletedAt)} onView={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanDetail', record); }} onEdit={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanEdit', record); }} onUpdateTindakLanjut={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanUpdateTindakLanjut', record); }} onManageTim={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanTim', record); }} onManageDokumen={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanDokumen', record); }} onDelete={handleDeletePutusan} onSetSelesai={handleSetPutusanSelesai} onRestore={handleRestorePutusan} onNavigate={handleNavigate} />;
      case 'eAdvokasiPutusanDetail': 
        return selectedPutusan ? <DetailPutusan record={selectedPutusan} onBack={() => handleNavigate(selectedPutusan.deletedAt ? 'eAdvokasiRecycleBin' : 'eAdvokasiPenangananPutusan')} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="text-blue-600 underline">Penanganan Putusan</button>.</div>;
      case 'eAdvokasiPutusanEdit': 
        return <EditPutusan initialData={selectedPutusan} onSave={handleSavePutusan} onBack={() => handleNavigate('eAdvokasiPenangananPutusan')} onNavigate={handleNavigate} />;
      case 'eAdvokasiPutusanUpdateTindakLanjut': 
        return selectedPutusan ? <UpdateTindakLanjut record={selectedPutusan} onSave={handleSavePutusan} onBack={() => handleNavigate('eAdvokasiPenangananPutusan')} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="text-blue-600 underline">Penanganan Putusan</button>.</div>;
      case 'eAdvokasiPutusanTim': 
        return selectedPutusan ? (<div className="h-full flex flex-col bg-gray-50"><div className="px-6 pt-4 bg-white flex-shrink-0"><Breadcrumb currentView="eAdvokasiPutusanTim" onNavigate={handleNavigate} /></div><header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start"><button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1"><ArrowLeftIcon className="h-5 w-5" /></button><div className="ml-3"><h2 className="text-lg font-bold text-gray-800">Pengelolaan Tim Advokasi Putusan</h2><p className="text-sm text-gray-500 mt-1">{selectedPutusan.abstraksiPerkara?.noPerkara || selectedPutusan.Nomor} - {selectedPutusan.perihal}</p></div></header><div className="flex-1 overflow-y-auto"><AssignTeam team={selectedPutusan.team || []} picId={selectedPutusan.picId || null} onUpdateTeam={(team) => { const updatedRecord = { ...selectedPutusan, team }; handleSavePutusan(updatedRecord); }} onSetPic={(picId) => { const updatedRecord = { ...selectedPutusan, picId: picId || undefined }; handleSavePutusan(updatedRecord); }}/></div></div>) : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="text-blue-600 underline">Penanganan Putusan</button>.</div>;
      case 'eAdvokasiPutusanDokumen': 
        return selectedPutusan ? <DokumenPutusan record={selectedPutusan} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="text-blue-600 underline">Penanganan Putusan</button>.</div>;
      case 'eAdvokasiMonitoring':
      case 'eAdvokasiDashboard':
      case 'eAdvokasiPencarianPerkara':
      case 'eAdvokasiPencarianPendampingan':
      case 'eAdvokasiPencarianPutusan':
      case 'eAdvokasiPencarianDokumen':
      case 'eAdvokasiPencarianBankDalil':
      case 'eAdvokasiMonitoringPersidangan':
      case 'eAdvokasiMonitoringPutusan':
      case 'eAdvokasiMonitoringPendampingan':
      case 'eAdvokasiMonitoringPerkara':
      case 'eAdvokasiMonitoringRisikoHukum':
      case 'eAdvokasiAuditTrail':
        return <Monitoring currentView={currentView} onNavigate={handleNavigate} />;
      case 'eAdvokasiLaporan': 
        return <div className="p-8"><h1 className="text-2xl font-bold">Laporan</h1><p className="mt-4">Fitur pelaporan statistik advokasi sedang dalam pengembangan.</p><button onClick={() => handleNavigate('beranda')} className="mt-4 text-blue-600 hover:underline flex items-center"><ArrowLeftIcon className="h-4 w-4 mr-2"/>Kembali ke Beranda</button></div>;
      case 'eAdvokasiUser': 
        return <div className="p-8"><h1 className="text-2xl font-bold">Manajemen User</h1><p className="mt-4">Fitur manajemen akses dan peran sedang dalam pengembangan.</p><button onClick={() => handleNavigate('beranda')} className="mt-4 text-blue-600 hover:underline flex items-center"><ArrowLeftIcon className="h-4 w-4 mr-2"/>Kembali ke Beranda</button></div>;
      case 'eAdvokasiReferensi': 
        return <div className="p-8"><h1 className="text-2xl font-bold">Referensi</h1><p className="mt-4">Fitur pengelolaan data referensi (unit, wilayah, pengadilan) sedang dalam pengembangan.</p><button onClick={() => handleNavigate('beranda')} className="mt-4 text-blue-600 hover:underline flex items-center"><ArrowLeftIcon className="h-4 w-4 mr-2"/>Kembali ke Beranda</button></div>;
      case 'eAdvokasiTim': 
        return <div className="p-8"><h1 className="text-2xl font-bold">Pengelolaan Tim</h1><p className="mt-4">Fitur master data tim advokasi sedang dalam pengembangan.</p><button onClick={() => handleNavigate('beranda')} className="mt-4 text-blue-600 hover:underline flex items-center"><ArrowLeftIcon className="h-4 w-4 mr-2"/>Kembali ke Beranda</button></div>;
      case 'eAdvokasiArsip': 
        return <Arsip onNavigate={handleNavigate} />;
      case 'eAdvokasiRecycleBin':
        return (
            <RecycleBin 
                pendampinganDeleted={pendampinganRecords.filter(r => !!r.deletedAt)}
                perkaraDeleted={perkaraRecords.filter(r => !!r.deletedAt)}
                putusanDeleted={putusanRecords.filter(r => !!r.deletedAt)}
                onRestore={(ids, type) => {
                    if (type === 'pendampingan') {
                        useAdvokasiStore.setState(prev => ({ pendampinganRecords: prev.pendampinganRecords.map(r => ids.includes(r.id) ? { ...r, deletedAt: undefined } : r) }));
                    } else if (type === 'perkara') {
                        useAdvokasiStore.setState(prev => ({ perkaraRecords: prev.perkaraRecords.map(r => ids.includes(r.id) ? { ...r, deletedAt: undefined } : r) }));
                    } else if (type === 'putusan') {
                        useAdvokasiStore.setState(prev => ({ putusanRecords: prev.putusanRecords.map(r => ids.includes(r.id) ? { ...r, deletedAt: undefined } : r) }));
                    }
                    showNotification(`${ids.length} record berhasil di-restore.`);
                }}
                onDeletePermanent={(ids, type) => {
                    if (type === 'pendampingan') {
                        useAdvokasiStore.setState(prev => ({ pendampinganRecords: prev.pendampinganRecords.filter(r => !ids.includes(r.id)) }));
                    } else if (type === 'perkara') {
                        useAdvokasiStore.setState(prev => ({ perkaraRecords: prev.perkaraRecords.filter(r => !ids.includes(r.id)) }));
                    } else if (type === 'putusan') {
                        useAdvokasiStore.setState(prev => ({ putusanRecords: prev.putusanRecords.filter(r => !ids.includes(r.id)) }));
                    }
                    showNotification(`${ids.length} record berhasil dihapus permanen.`);
                }}
                onView={(record, type) => {
                    if (type === 'pendampingan') {
                        setSelectedPendampingan(record);
                        handleNavigate('eAdvokasiPendampinganDetail', record);
                    } else if (type === 'perkara') {
                        setSelectedPerkara(record);
                        handleNavigate('eAdvokasiPerkaraDetail', record);
                    } else if (type === 'putusan') {
                        setSelectedPutusan(record);
                        handleNavigate('eAdvokasiPutusanDetail', record);
                    }
                }}
                onNavigate={handleNavigate}
            />
        );
      default: return <div className="p-8">Tampilan <span className="font-semibold">{currentView}</span> belum diimplementasikan.</div>;
    }
  };

  const isNadineView = ['pilihTemplate', 'formNaskah'].includes(currentView);

  return (
    <>
      {notification && <Notification {...notification} onDismiss={() => setNotification(null)} />}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center space-y-3">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span className="text-gray-500 font-medium text-sm">Memuat aplikasi...</span>
          </div>
        </div>
      }>
        {isNadineView ? (
          <NadineLayout onNavigate={handleNavigate} currentView={currentView}>
            {renderMainContent()}
          </NadineLayout>
        ) : (
          <Layout onNavigate={handleNavigate} currentView={currentView}>
            {renderMainContent()}
          </Layout>
        )}
      </Suspense>
    </>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
