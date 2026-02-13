
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Permohonan, PendampinganRecord, StatusPendampingan, View } from '../types';
import { PlusIcon, SearchIcon, DotsVerticalIcon, EyeIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import FormPendampinganModal from './FormPendampinganModal';

interface PendampinganProps {
  pendampinganBaruList: Permohonan[];
  daftarPendampingan: PendampinganRecord[];
  onUpdateStatus: (recordId: string, newStatus: StatusPendampingan) => void;
  onSave: (record: PendampinganRecord) => void;
  onDelete: (recordId: string) => void;
  onView: (record: PendampinganRecord) => void;
  onNavigate: (view: View, record?: PendampinganRecord) => void;
  onManagePosisi: (record: PendampinganRecord) => void;
}

const ActionsDropdown: React.FC<{ record: PendampinganRecord, onAction: (action: string, record: PendampinganRecord) => void }> = ({ record, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);
    
    const handleSelect = (action: string) => {
        onAction(action, record);
        setIsOpen(false);
    }

    return (
        <div className="relative inline-block text-left" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500">
                <DotsVerticalIcon className="h-5 w-5" />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('view') }} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">View</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('edit') }} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Edit</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('update') }} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Update Posisi</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('manage-tim') }} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Manage Tim</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('selesai') }} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Set Selesai</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('hapus') }} className="text-red-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Hapus</a>
                    </div>
                </div>
            )}
        </div>
    );
};

const Pendampingan: React.FC<PendampinganProps> = ({ pendampinganBaruList, daftarPendampingan, onUpdateStatus, onSave, onDelete, onView, onNavigate, onManagePosisi }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'Aktif' | 'Selesai'>('Aktif');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<PendampinganRecord | Permohonan | null>(null);

    const filteredDaftarPendampingan = useMemo(() => {
        return daftarPendampingan
            .filter(p => {
                if (activeTab === 'Aktif') return p.statusPendampingan === StatusPendampingan.AKTIF;
                if (activeTab === 'Selesai') return p.statusPendampingan === StatusPendampingan.SELESAI;
                return false;
            })
            .filter(p => 
                p.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.Nomor || p.id).toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [daftarPendampingan, activeTab, searchTerm]);
    
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
            case 'manage-tim':
                onNavigate('eAdvokasiPendampinganTim', record);
                break;
            case 'selesai':
                onUpdateStatus(record.id, StatusPendampingan.SELESAI);
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

  return (
    <>
      {isFormModalOpen && (
        <FormPendampinganModal 
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSave={handleSaveForm}
            initialData={selectedRecord}
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
      <div className="p-8 bg-gray-50 h-full flex flex-col space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pendampingan</h1>
          <p className="text-gray-600 mt-1">Kelola permohonan bantuan hukum non-litigasi.</p>
          <div className="border-b-4 border-blue-600 w-16 mt-4"></div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button onClick={() => handleOpenForm()} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Pendampingan</span>
          </button>
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
                      <button onClick={() => handleOpenForm(p)} className="text-blue-600 hover:text-blue-800 font-semibold">Record</button>
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
          <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  <button onClick={() => setActiveTab('Aktif')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'Aktif' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                      Aktif
                  </button>
                  <button onClick={() => setActiveTab('Selesai')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'Selesai' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                      Selesai
                  </button>
              </nav>
          </div>
          <div className="flex-1 overflow-y-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Tiket/ND</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perihal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Pemohon</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tim Advokasi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDaftarPendampingan.map((p, index) => (
                          <tr key={p.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.Nomor || p.id}</td>
                              <td className="px-6 py-4 text-sm text-gray-800 max-w-sm truncate" title={p.perihal}>{p.perihal}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={p.unit}>{p.unit}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.team && p.team.length > 0 ? p.team.map(m => m.nama).join(', ') : 'Belum Ditugaskan'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.statusPendampingan === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {p.statusPendampingan}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                  {p.statusPendampingan === StatusPendampingan.AKTIF ? (
                                      <ActionsDropdown record={p} onAction={handleAction} />
                                  ) : (
                                       <button onClick={() => onView(p)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500">
                                            <EyeIcon className="h-5 w-5" />
                                       </button>
                                  )}
                              </td>
                          </tr>
                      ))}
                      {filteredDaftarPendampingan.length === 0 && (
                          <tr>
                              <td colSpan={7} className="text-center py-8 text-gray-500">Tidak ada data untuk ditampilkan.</td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pendampingan;
