
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Permohonan, PerkaraRecord, StatusPerkara, View, JenisPermohonan, PosisiSidangEntry } from '../types';
import { PlusIcon, SearchIcon, DotsVerticalIcon, EyeIcon, ArrowUpIcon, ReplyIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';

const generateRandomId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const getPicName = (record: PerkaraRecord): string => {
    if (!record.picId || !record.team || record.team.length === 0) {
        return 'N/A';
    }
    const pic = record.team.find(member => member.id === record.picId);
    return pic ? pic.nama : 'N/A';
};

const getStatusPosisi = (record: PerkaraRecord): string => {
    if (!record.posisiSidang) return 'Belum ada';
    
    const allEntries: PosisiSidangEntry[] = [
        ...(record.posisiSidang.tkPK || []),
        ...(record.posisiSidang.tkKasasi || []),
        ...(record.posisiSidang.tkBanding || []),
        ...(record.posisiSidang.tkPertama || []),
    ];

    if (allEntries.length === 0) return 'Belum ada sidang';

    const sortedEntries = allEntries.sort((a, b) => {
        try {
            const dateA = new Date(a.tanggalSidang.split('/').reverse().join('-'));
            const dateB = new Date(b.tanggalSidang.split('/').reverse().join('-'));
            return dateB.getTime() - dateA.getTime();
        } catch (e) {
            return 0;
        }
    });

    return sortedEntries[0]?.agendaSidang || 'Tidak ada agenda';
};

interface PenangananPerkaraProps {
  perkaraBaruList: Permohonan[];
  daftarPerkara: PerkaraRecord[];
  onUpdateStatus: (recordId: string, newStatus: StatusPerkara) => void;
  onSave: (record: PerkaraRecord) => void;
  onDelete: (recordId: string) => void;
  onView: (record: PerkaraRecord) => void;
  onNavigate: (view: View, record?: PerkaraRecord | Partial<PerkaraRecord> | Permohonan) => void;
  onForward: (recordId: string) => void;
}

const ActionsDropdown: React.FC<{ record: PerkaraRecord, onAction: (action: string, record: PerkaraRecord) => void }> = ({ record, onAction }) => {
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
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('dokumen') }} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Dokumen</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('manage-tim') }} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Manage Tim</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelect('hapus') }} className="text-red-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Hapus</a>
                    </div>
                </div>
            )}
        </div>
    );
};

const PenangananPerkara: React.FC<PenangananPerkaraProps> = ({ perkaraBaruList, daftarPerkara, onUpdateStatus, onSave, onDelete, onView, onNavigate, onForward }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'Aktif' | 'Selesai'>('Aktif');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<PerkaraRecord | null>(null);

    const filteredDaftarPerkara = useMemo(() => {
        return daftarPerkara
            .filter(p => {
                if (activeTab === 'Aktif') return p.statusPerkara === StatusPerkara.AKTIF;
                if (activeTab === 'Selesai') return p.statusPerkara === StatusPerkara.SELESAI;
                return false;
            })
            .filter(p => 
                (p.perihal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.Nomor || p.id).toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [daftarPerkara, activeTab, searchTerm]);
    
    const handleAction = (action: string, record: PerkaraRecord) => {
        switch(action) {
            case 'view':
                onView(record);
                break;
            case 'edit':
                onNavigate('eAdvokasiPerkaraEdit', record);
                break;
            case 'update':
                onNavigate('eAdvokasiPerkaraUpdatePosisi', record);
                break;
            case 'dokumen':
                onNavigate('eAdvokasiPerkaraDokumen', record);
                break;
            case 'manage-tim':
                onNavigate('eAdvokasiPerkaraTim', record);
                break;
            case 'hapus':
                setRecordToDelete(record);
                setIsDeleteModalOpen(true);
                break;
            case 'restore':
                 onUpdateStatus(record.id, StatusPerkara.AKTIF);
                 break;
            case 'forward':
                onForward(record.id);
                break;
        }
    };

    const handleConfirmDelete = () => {
        if (recordToDelete) {
            onDelete(recordToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setRecordToDelete(null);
    }

  return (
    <>
      {isDeleteModalOpen && recordToDelete && (
         <ConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Konfirmasi Hapus"
            message={`Apakah Anda yakin ingin menghapus perkara "${recordToDelete.perihal}"?`}
            confirmText="Hapus"
         />
      )}
      <div className="p-8 bg-gray-50 h-full flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Penanganan Perkara</h1>
          <p className="text-gray-600 mt-1">Kelola permohonan bantuan hukum litigasi.</p>
          <div className="border-b-4 border-blue-600 w-16 mt-4"></div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={() => onNavigate('eAdvokasiPerkaraEdit', { id: `new-${Date.now()}` })} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Perkara</span>
          </button>
          <div className="flex items-center space-x-2">
              <div className="relative">
                  <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                      type="text" 
                      placeholder="Cari daftar perkara..." 
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

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Perkara Baru</h2>
          <p className="text-sm text-gray-500 mb-4">
            Daftar permohonan penanganan perkara yang telah disetujui dari inbox dan siap untuk direkam menjadi perkara aktif.
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
                {perkaraBaruList.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.Nomor || p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.tanggal}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 max-w-sm truncate" title={p.perihal}>{p.perihal}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={p.unit}>{p.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => onNavigate('eAdvokasiPerkaraEdit', p)} className="text-blue-600 hover:text-blue-800 font-semibold">Record</button>
                    </td>
                  </tr>
                ))}
                {perkaraBaruList.length === 0 && (
                  <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">Tidak ada permohonan perkara baru.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Perkara</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Masuk</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Perkara</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pokok Perkara</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Posisi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDaftarPerkara.map((p, index) => (
                          <tr key={p.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.abstraksiPerkara?.noPerkara || p.Nomor || p.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.abstraksiPerkara?.tahunMasuk || '-'}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={p.abstraksiPerkara?.jenisPerkara}>{p.abstraksiPerkara?.jenisPerkara || '-'}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={p.abstraksiPerkara?.jenisPokokPerkara}>{p.abstraksiPerkara?.jenisPokokPerkara || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusPosisi(p)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPicName(p)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                  {p.statusPerkara === StatusPerkara.AKTIF ? (
                                      <ActionsDropdown record={p} onAction={handleAction} />
                                  ) : (
                                       <div className="flex items-center justify-center space-x-1">
                                            <button onClick={() => handleAction('view', p)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" title="View"><EyeIcon className="h-5 w-5" /></button>
                                            <button onClick={() => handleAction('restore', p)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" title="Restore"><ArrowUpIcon className="h-5 w-5" /></button>
                                            <button onClick={() => handleAction('forward', p)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" title="Forward"><ReplyIcon className="h-5 w-5 transform -scale-x-100"/></button>
                                       </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                      {filteredDaftarPerkara.length === 0 && (
                          <tr>
                              <td colSpan={8} className="text-center py-8 text-gray-500">Tidak ada data untuk ditampilkan.</td>
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

export default PenangananPerkara;
