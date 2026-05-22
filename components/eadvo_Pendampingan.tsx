import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Permohonan, PendampinganRecord, StatusPendampingan, View, TeamMember } from '../types';
import { PlusIcon, SearchIcon, DotsVerticalIcon, EyeIcon, ArrowUpIcon, CloudIcon, PencilIcon, TrashIcon, DownloadIcon, DocumentTextIcon, UserIcon, CheckCircleIcon, PrintIcon, RotateCcwIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import FormPendampinganModal from './eadvo_EditPendampingan';
import Breadcrumb from './Breadcrumb';
import Pagination from './Pagination';
import { useAdvokasiStore } from '../useAdvokasiStore';

const getPicName = (record: PendampinganRecord): string => {
    if (!record.picId || !record.team || record.team.length === 0) {
        return 'N/A';
    }
    const pic = record.team.find((member: TeamMember) => member.id === record.picId);
    return pic ? pic.nama : 'N/A';
};

interface PendampinganProps {
  pendampinganBaruList: Permohonan[];
  daftarPendampingan: PendampinganRecord[];
  onUpdateStatus: (recordId: string, newStatus: StatusPendampingan) => void;
  onSave: (record: PendampinganRecord) => void;
  onDelete: (recordId: string) => void;
  onView: (record: PendampinganRecord) => void;
  onNavigate: (view: View, record?: PendampinganRecord) => void;
  onManagePosisi: (record: PendampinganRecord) => void;
  showNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Pendampingan: React.FC<PendampinganProps> = ({ pendampinganBaruList, daftarPendampingan, onUpdateStatus, onSave, onDelete, onView, onNavigate, onManagePosisi, showNotification }) => {
    const globalRole = useAdvokasiStore((state) => state.globalRole);
    const teamRole = useAdvokasiStore((state) => state.teamRole);

    const isPegawai = globalRole === 'Pegawai';
    const canCreate = !isPegawai || teamRole === 'PIC';
    const canEdit = !isPegawai || teamRole === 'PIC' || teamRole === 'Editor';
    const canDelete = !isPegawai || teamRole === 'PIC' || teamRole === 'Editor';
    const canComplete = !isPegawai || teamRole === 'PIC';

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'Aktif' | 'Selesai'>('Aktif');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [setStatusModalState, setSetStatusModalState] = useState<{ isOpen: boolean; targetId: string | null }>({ isOpen: false, targetId: null });
    const [selectedRecord, setSelectedRecord] = useState<PendampinganRecord | Permohonan | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredDaftarPendampingan = useMemo(() => {
        return daftarPendampingan
            .filter(p => {
                if (activeTab === 'Aktif') return p.statusPendampingan === StatusPendampingan.AKTIF;
                if (activeTab === 'Selesai') return p.statusPendampingan === StatusPendampingan.SELESAI;
                return false;
            })
            .filter(p => 
                (p.perihal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.Nomor || p.id).toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [daftarPendampingan, activeTab, searchTerm]);

    const paginatedDaftarPendampingan = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredDaftarPendampingan.slice(start, start + itemsPerPage);
    }, [filteredDaftarPendampingan, currentPage, itemsPerPage]);
    
    const handleAction = (action: string, record: PendampinganRecord) => {
        setSelectedRecord(record);
        switch(action) {
            case 'view':
                onView(record);
                break;
            case 'edit':
                setIsFormModalOpen(true);
                break;
            case 'update':
                onManagePosisi(record);
                break;
            case 'dokumen':
                onNavigate('eAdvokasiPendampinganDokumen', record);
                break;
            case 'manage-tim':
                onNavigate('eAdvokasiPendampinganTim', record);
                break;
            case 'selesai':
                setSetStatusModalState({ isOpen: true, targetId: record.id });
                break;
            case 'restore':
                onUpdateStatus(record.id, StatusPendampingan.AKTIF);
                break;
            case 'hapus':
                setIsDeleteModalOpen(true);
                break;
        }
    };
    
    const handleOpenForm = (data?: Permohonan | PendampinganRecord) => {
        setSelectedRecord(data || null);
        setIsFormModalOpen(true);
    };

    const handleSaveForm = (formData: PendampinganRecord) => {
        onSave(formData);
        setIsFormModalOpen(false);
        setSelectedRecord(null);
    };

    const handleConfirmDelete = () => {
        if (selectedRecord) {
            onDelete(selectedRecord.id);
        }
        setIsDeleteModalOpen(false);
        setSelectedRecord(null);
    }

    const handleConfirmSetStatus = () => {
        if (setStatusModalState.targetId) {
            onUpdateStatus(setStatusModalState.targetId, StatusPendampingan.SELESAI);
        }
        setSetStatusModalState({ isOpen: false, targetId: null });
    };

    const handleCancelSetStatus = () => {
        setSetStatusModalState({ isOpen: false, targetId: null });
    };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {isFormModalOpen && (
        <FormPendampinganModal 
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSave={handleSaveForm}
            initialData={selectedRecord}
            showNotification={showNotification}
        />
      )}
      {isDeleteModalOpen && selectedRecord && (
         <ConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Konfirmasi Hapus"
            message={`Apakah Anda yakin ingin menghapus pendampingan "${selectedRecord.perihal}"?`}
            confirmText="Hapus"
         />
      )}
      {setStatusModalState.isOpen && (
         <ConfirmationModal 
            isOpen={setStatusModalState.isOpen}
            onClose={handleCancelSetStatus}
            onConfirm={handleConfirmSetStatus}
            title="Selesaikan Pendampingan"
            message="Apakah kasus hukum ini telah selesai?"
            confirmText="Selesai"
         />
      )}
      <div className="p-8 bg-gray-50 h-full flex flex-col space-y-4 overflow-y-auto">
        <Breadcrumb currentView="eAdvokasiPendampingan" onNavigate={onNavigate} />
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pendampingan</h1>
            <p className="text-gray-600 mt-1">Kelola permohonan bantuan hukum non-litigasi.</p>
            <div className="flex items-center mt-2 space-x-4">
                <div className="border-b-4 border-blue-600 w-16"></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          {canCreate ? (
            <button onClick={() => handleOpenForm()} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Tambah Pendampingan</span>
            </button>
          ) : (
            <div className="text-xs bg-gray-100 border border-gray-200 text-gray-500 px-3 py-2 rounded-lg font-medium">
              Tambah Kasus Baru Terbatas (Hanya PIC)
            </div>
          )}
          <div className="flex items-center space-x-2">
              <div className="relative">
                  <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                      type="text" 
                      placeholder="Cari daftar pendampingan..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 font-semibold">
                  Filter
              </button>
          </div>
        </div>

        {/* Pendampingan Baru */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Pendampingan Baru</h2>
          <p className="text-sm text-gray-500 mb-4">
            Daftar permohonan pendampingan yang telah disetujui dari inbox dan siap untuk direkam menjadi pendampingan aktif.
          </p>
          <div className="overflow-y-auto max-h-64">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Tiket/ND</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perihal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Pemohon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendampinganBaruList.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.Nomor || p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.tanggal}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 max-w-sm truncate" title={p.perihal}>{p.perihal}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={p.unit}>{p.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canCreate ? (
                        <button onClick={() => handleOpenForm(p)} className="text-blue-600 hover:text-blue-800 font-semibold">Record</button>
                      ) : (
                        <span className="text-gray-400 italic cursor-not-allowed" title="Merekam kasus baru dibatasi (Hanya PIC)">Terbatas (Hanya PIC)</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pendampinganBaruList.length === 0 && (
                  <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">Tidak ada permohonan pendampingan baru.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Daftar Pendampingan */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Pendampingan</h2>
          </div>
          <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  <button onClick={() => { setActiveTab('Aktif'); setCurrentPage(1); }} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'Aktif' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                      Aktif
                  </button>
                  <button onClick={() => { setActiveTab('Selesai'); setCurrentPage(1); }} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'Selesai' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                      Selesai
                  </button>
              </nav>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col mt-4">
              <div className="overflow-x-auto flex-1">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Tiket/ND</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Masuk</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Pemanggil</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Pemohon</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pihak yang Dipanggil</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {paginatedDaftarPendampingan.map((p, index) => (
                              <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.abstraksi?.nomorTiket || p.Nomor || p.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.abstraksi?.tahunMasuk || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={p.abstraksi?.unitPemanggil}>{p.abstraksi?.unitPemanggil || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={p.abstraksi?.unitPemohon || p.unit}>{p.abstraksi?.unitPemohon || p.unit}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={p.abstraksi?.pihakDipanggil}>{p.abstraksi?.pihakDipanggil || '-'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-2">
                                            <UserIcon className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-700 font-medium">{getPicName(p)}</span>
                                            <span className="text-[10px] text-gray-400 font-bold leading-tight">Last update:</span>
                                            <span className="text-[10px] text-gray-400 font-medium truncate leading-tight">{new Date().toLocaleString('id-ID', { hour12: false, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, '/')}</span>
                                        </div>
                                    </div>
                                </td>
                                 <td className="px-4 py-4 whitespace-nowrap w-40">
                                     <div className="flex items-center justify-center">
                                         {p.statusPendampingan === StatusPendampingan.AKTIF ? (
                                             <div className="grid grid-cols-4 grid-rows-2 gap-1 w-fit">
                                                 <button onClick={() => handleAction('view', p)} className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View Detail"><EyeIcon className="h-4 w-4"/></button>
                                                 {canEdit ? (
                                                     <button onClick={() => handleAction('edit', p)} className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Edit Data"><PencilIcon className="h-4 w-4"/></button>
                                                 ) : (
                                                     <button disabled className="p-1.5 rounded bg-gray-100 text-gray-300 cursor-not-allowed" title="Akses Edit Terbatas"><PencilIcon className="h-4 w-4"/></button>
                                                 )}
                                                 {canEdit ? (
                                                     <button onClick={() => handleAction('update', p)} className="p-1.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors" title="Update Posisi"><ArrowUpIcon className="h-4 w-4"/></button>
                                                 ) : (
                                                     <button disabled className="p-1.5 rounded bg-gray-100 text-gray-300 cursor-not-allowed" title="Akses Update Terbatas"><ArrowUpIcon className="h-4 w-4"/></button>
                                                 )}
                                                 <button onClick={() => handleAction('dokumen', p)} className="p-1.5 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors" title="Dokumen Dukung"><DocumentTextIcon className="h-4 w-4"/></button>
                                                 {canEdit ? (
                                                     <button onClick={() => handleAction('manage-tim', p)} className="p-1.5 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="Penugasan Tim"><UserIcon className="h-4 w-4"/></button>
                                                 ) : (
                                                     <button disabled className="p-1.5 rounded bg-gray-100 text-gray-300 cursor-not-allowed" title="Akses Tim Terbatas"><UserIcon className="h-4 w-4"/></button>
                                                 )}
                                                 {canComplete ? (
                                                     <button onClick={() => handleAction('selesai', p)} className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Set Selesai"><CheckCircleIcon className="h-4 w-4"/></button>
                                                 ) : (
                                                     <button disabled className="p-1.5 rounded bg-gray-100 text-gray-300 cursor-not-allowed" title="Hanya PIC yang dapat menyelesaikan kasus"><CheckCircleIcon className="h-4 w-4"/></button>
                                                 )}
                                                 <button 
                                                     onClick={() => {
                                                         onView(p);
                                                         setTimeout(() => window.print(), 500);
                                                     }} 
                                                     className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" 
                                                     title="Print/Download Resume"
                                                 >
                                                     <PrintIcon className="h-4 w-4" />
                                                 </button>
                                                 {canDelete ? (
                                                     <button onClick={() => handleAction('hapus', p)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Hapus Data"><TrashIcon className="h-4 w-4"/></button>
                                                 ) : (
                                                     <button disabled className="p-1.5 rounded bg-gray-100 text-gray-300 cursor-not-allowed" title="Hapus Data Terbatas"><TrashIcon className="h-4 w-4"/></button>
                                                 )}
                                             </div>
                                         ) : (
                                             <div className="grid grid-cols-4 grid-rows-2 gap-1 w-fit">
                                                 <button onClick={() => handleAction('view', p)} className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View Detail"><EyeIcon className="h-4 w-4"/></button>
                                                 <button onClick={() => handleAction('dokumen', p)} className="p-1.5 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors" title="Dokumen Dukung"><DocumentTextIcon className="h-4 w-4"/></button>
                                                 <button 
                                                     onClick={() => {
                                                         onView(p);
                                                         setTimeout(() => window.print(), 500);
                                                     }} 
                                                     className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" 
                                                     title="Print/Download Resume"
                                                 >
                                                     <PrintIcon className="h-4 w-4" />
                                                 </button>
                                                 <button onClick={() => handleAction('restore', p)} className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Restore ke Aktif"><RotateCcwIcon className="h-4 w-4" /></button>
                                             </div>
                                         )}
                                     </div>
                                 </td>
                          </tr>
                      ))}
                      {filteredDaftarPendampingan.length === 0 && (
                          <tr>
                              <td colSpan={8} className="text-center py-8 text-gray-500">Tidak ada data untuk ditampilkan.</td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          <Pagination 
              totalItems={filteredDaftarPendampingan.length}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
          />
        </div>
      </div>
    </div>
  </div>
);
};

export default Pendampingan;
