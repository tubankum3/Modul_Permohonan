
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import DaftarPermohonan from './components/DaftarPermohonan';
import DetailPermohonan from './components/DetailPermohonan';
import BuatPermohonan from './components/BuatPermohonan';
import Notification from './components/Notification';
import { Permohonan, StatusPermohonan, Riwayat, NotificationType, Notification as NotificationProps } from './types';

const initialPermohonan: Permohonan[] = [
    {
    id: '1-2026-788df5',
    pemohon: 'Pegawai001',
    unit: 'Seksi Pembinaan Proses Bisnis dan Hukum II, Subdirektorat Pembinaan Proses Bisnis dan Hukum, Direktorat Sistem Perbendaharaan, Direktorat Jenderal Perbendaharaan',
    tanggal: '12/01/2026',
    jenis: 'Penanganan Perkara',
    perihal: 'Gugatan Perdata, Kemenkeu cq Kanwil DJPb Jawa Tengah cq KPPN Surakarta sebagai Turut Tergugat IV',
    uraian: 'Terdapat gugatan perdata kepada Kemenkeu cq Kanwil DJPb Jawa Tengah cq KPPN Surakarta sebagai Turut Tergugat IV dalam relaas yang disampaikan Pengadilan Negeri Surakarta. Kemenkeu diharapkan hadir dalam sidang pada tanggal 21 Januari 2026',
    files: [{ name: 'Relaas 6.pdf', size: 123456, type: 'application/pdf' }],
    status: StatusPermohonan.TERKIRIM,
    history: [],
  },
  {
    id: '20260115-1abn',
    pemohon: 'Pegawai001',
    jenis: 'Pendampingan',
    perihal: 'Permohonan bantuan pendampingan saksi OTT',
    uraian: 'Sehubungan dengan adanya OTT, kami memohon pendampingan untuk pemeriksaan di kejaksaan.',
    files: [{ name: 'panggilan.pdf', size: 123456, type: 'application/pdf' }],
    status: StatusPermohonan.TERKIRIM,
    tanggal: '15/01/2026',
    unit: 'Seksi Pembinaan Proses Bisnis dan Hukum II, Subdirektorat Pembinaan Proses Bisnis dan Hukum, Direktorat Sistem Perbendaharaan, Direktorat Jenderal Perbendaharaan',
    history: [
      { id: 1, author: 'Pegawai', message: 'Mohon agar segera ditindaklanjuti.', files: [], timestamp: new Date('2026-01-15T09:00:00') },
      { id: 2, author: 'Administrator', message: 'Permohonan diterima dan sedang diproses.', files: [], timestamp: new Date('2026-01-16T11:30:00') }
    ],
  },
  {
    id: '20251023-1abc',
    pemohon: 'Pegawai001',
    jenis: 'Pendampingan',
    perihal: 'Permohonan pendampingan ahli hukum keuangan negara di PN Jakarta Pusat',
    uraian: 'Mohon pendampingan hukum terkait penyusunan dan review dokumen penganggaran TA 2025.',
    files: [],
    status: StatusPermohonan.DIPROSES,
    tanggal: '23/10/2025',
    unit: 'Seksi Pembinaan Proses Bisnis dan Hukum II, Subdirektorat Pembinaan Proses Bisnis dan Hukum, Direktorat Sistem Perbendaharaan, Direktorat Jenderal Perbendaharaan',
    history: [
      { id: 1, author: 'Pegawai', message: 'Mohon didampingi untuk pemberian keterangan ahli.', files: [], timestamp: new Date('2025-10-23T14:00:00') },
      { id: 2, author: 'Administrator', message: 'Permohonan diterima dan sedang diproses.', files: [], timestamp: new Date('2025-10-24T11:30:00') },
      { id: 3, author: 'Administrator', message: 'Pendampingan akan dilakukan oleh Sdr. X.', files: [], timestamp: new Date('2026-01-16T11:30:00') }
    ],
  },
    {
    id: 'DRAFT-001',
    pemohon: 'Pegawai001',
    jenis: 'Pendampingan',
    perihal: 'Draft Permohonan Bantuan Cuti Tahunan',
    uraian: 'Ini adalah draft permohonan untuk bantuan hukum terkait masalah cuti tahunan yang belum terselesaikan.',
    files: [],
    status: StatusPermohonan.DRAFT,
    tanggal: '15/07/2024',
    unit: 'Seksi Pembinaan Proses Bisnis dan Hukum II, Subdirektorat Pembinaan Proses Bisnis dan Hukum, Direktorat Sistem Perbendaharaan, Direktorat Jenderal Perbendaharaan',
    history: [],
  },
];


const App: React.FC = () => {
  const [permohonanList, setPermohonanList] = useState<Permohonan[]>(initialPermohonan);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedPermohonan, setSelectedPermohonan] = useState<Permohonan | null>(null);
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  const handleSelectPermohonan = (permohonan: Permohonan) => {
    setSelectedPermohonan(permohonan);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedPermohonan(null);
    setCurrentView('list');
  };

  const handleCreateNew = () => {
    setCurrentView('create');
  };

  const handleSaveDraft = (permohonan: Omit<Permohonan, 'id' | 'status' | 'tanggal' | 'unit' | 'history' | 'pemohon'>) => {
    const newPermohonan: Permohonan = {
      ...permohonan,
      id: `DRAFT-${Date.now()}`,
      pemohon: 'User Pegawai',
      status: StatusPermohonan.DRAFT,
      tanggal: new Date().toLocaleDateString('id-ID'),
      unit: 'Subbagian Advokasi Pribadi',
      history: [],
    };
    setPermohonanList(prev => [newPermohonan, ...prev]);
    setCurrentView('list');
    showNotification('Draft permohonan berhasil disimpan.', 'success');
  };

  const handleDeletePermohonan = (id: string) => {
    setPermohonanList(prev => prev.filter(p => p.id !== id));
    showNotification(`Draft permohonan ${id} berhasil dihapus.`, 'success');
  };
  
  const handleSendPermohonan = (id: string) => {
    setPermohonanList(prev => prev.map(p => p.id === id ? { ...p, status: StatusPermohonan.TERKIRIM } : p));
    showNotification(`Permohonan ${id} berhasil dikirim.`, 'success');
  };

  const handleAddReply = (permohonanId: string, reply: Riwayat) => {
    const updatedList = permohonanList.map(p => {
      if (p.id === permohonanId) {
        const newHistory = [...p.history, reply];
        let newStatus = p.status;
        if (p.status === StatusPermohonan.TERKIRIM) {
          newStatus = StatusPermohonan.DIPROSES;
          showNotification(`Status permohonan ${p.id} diupdate menjadi "Diproses".`, 'info');
          
          setTimeout(() => {
             showNotification(`Anda menerima jawaban baru untuk permohonan ${p.id}.`, 'info');
          }, 1000);

          newHistory.push({
            id: Date.now() + 1,
            author: 'Administrator',
            message: 'Tanggapan Anda telah kami terima. Kami akan segera menindaklanjuti.',
            files: [],
            timestamp: new Date()
          });
        }
        
        return { ...p, history: newHistory, status: newStatus };
      }
      return p;
    });
    setPermohonanList(updatedList);
    setSelectedPermohonan(updatedList.find(p => p.id === permohonanId) || null);
    showNotification('Tanggapan berhasil dikirim.', 'success');
  };


  const renderContent = () => {
    const listProps = {
        permohonanList: permohonanList,
        onSelect: handleSelectPermohonan,
        onCreateNew: handleCreateNew,
        onDelete: handleDeletePermohonan,
        onSend: handleSendPermohonan
    };

    switch (currentView) {
      case 'create':
        return <BuatPermohonan onSaveDraft={handleSaveDraft} onCancel={handleBackToList} />;
      case 'detail':
        return selectedPermohonan ? (
            <div className="flex h-full">
                <DaftarPermohonan {...listProps} selectedId={selectedPermohonan.id} />
                <div className="flex-1 overflow-y-auto">
                    <DetailPermohonan permohonan={selectedPermohonan} onBack={handleBackToList} onAddReply={handleAddReply} />
                </div>
            </div>
        ) : <DaftarPermohonan {...listProps} />;
      case 'list':
      default:
        return <DaftarPermohonan {...listProps} />;
    }
  };

  return (
    <>
      {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
      <Layout>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
