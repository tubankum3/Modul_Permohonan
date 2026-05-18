import React, { useState, useMemo } from 'react';
import { PerkaraRecord, StatusPutusan, View, TeamMember } from '../types';
import { EyeIcon, PencilIcon, ArrowUpIcon, UserGroupIcon, TrashIcon, CheckIcon, DocumentTextIcon, UserIcon, CloudIcon, PrintIcon, RotateCcwIcon, SearchIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import Breadcrumb from './Breadcrumb';
import Pagination from './Pagination';

const getPicName = (record: PerkaraRecord): string => {
    if (!record.picId || !record.team || record.team.length === 0) {
        return 'N/A';
    }
    const pic = record.team.find((member: TeamMember) => member.id === record.picId);
    return pic ? pic.nama : 'N/A';
};

interface PenangananPutusanProps {
  daftarPutusan: PerkaraRecord[];
  onView: (record: PerkaraRecord) => void;
  onEdit: (record: PerkaraRecord) => void;
  onUpdateTindakLanjut: (record: PerkaraRecord) => void;
  onManageTim: (record: PerkaraRecord) => void;
  onManageDokumen: (record: PerkaraRecord) => void;
  onDelete: (id: string) => void;
  onSetSelesai: (id: string) => void;
  onRestore: (id: string) => void;
  onNavigate: (view: View) => void;
}

const PenangananPutusan: React.FC<PenangananPutusanProps> = ({ 
    daftarPutusan, 
    onView, 
    onEdit, 
    onUpdateTindakLanjut, 
    onManageTim, 
    onManageDokumen,
    onDelete, 
    onSetSelesai,
    onRestore,
    onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'aktif' | 'selesai'>('aktif');
  const [setStatusModalState, setSetStatusModalState] = useState<{ isOpen: boolean; targetId: string | null }>({ isOpen: false, targetId: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const requestSetSelesai = (id: string) => {
    setSetStatusModalState({ isOpen: true, targetId: id });
  };

  const handleConfirmSelesai = () => {
    if (setStatusModalState.targetId) {
        onSetSelesai(setStatusModalState.targetId);
    }
    setSetStatusModalState({ isOpen: false, targetId: null });
  };

  const handleCancelSelesai = () => {
    setSetStatusModalState({ isOpen: false, targetId: null });
  };

  const filteredData = useMemo(() => {
    return daftarPutusan.filter(p => {
        const matchesSearch = 
            (p.abstraksiPerkara?.noPerkara || p.Nomor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.perihal || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTab = activeTab === 'aktif' 
            ? p.statusPutusan === StatusPutusan.AKTIF 
            : p.statusPutusan === StatusPutusan.SELESAI;
            
        return matchesSearch && matchesTab;
    });
  }, [daftarPutusan, searchTerm, activeTab]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const renderTable = (data: PerkaraRecord[], isSelesai: boolean) => (
    <div className="overflow-x-auto flex-1">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Perkara</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Masuk</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Perkara</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status BHT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((p, index) => (
            <tr key={p.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.abstraksiPerkara?.noPerkara || p.Nomor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.abstraksiPerkara?.tahunMasuk}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{p.abstraksiPerkara?.jenisPerkara}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.statusBHT?.status}</td>
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
                    {!isSelesai ? (
                        <div className="grid grid-cols-4 grid-rows-2 gap-1 w-fit">
                            <button onClick={() => onView(p)} className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View Detail"><EyeIcon className="h-4 w-4" /></button>
                            <button onClick={() => onEdit(p)} className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Edit Data"><PencilIcon className="h-4 w-4" /></button>
                            <button onClick={() => onUpdateTindakLanjut(p)} className="p-1.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors" title="Update Tindak Lanjut"><ArrowUpIcon className="h-4 w-4" /></button>
                            <button onClick={() => onManageDokumen(p)} className="p-1.5 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors" title="Dokumen Dukung"><DocumentTextIcon className="h-4 w-4" /></button>
                            <button onClick={() => onManageTim(p)} className="p-1.5 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="Penugasan Tim"><UserIcon className="h-4 w-4" /></button>
                            <button onClick={() => requestSetSelesai(p.id)} className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Set Selesai"><CheckIcon className="h-4 w-4" /></button>
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
                            <button onClick={() => onDelete(p.id)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Hapus Data"><TrashIcon className="h-4 w-4" /></button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 grid-rows-2 gap-1 w-fit">
                            <button onClick={() => onView(p)} className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View Detail"><EyeIcon className="h-4 w-4" /></button>
                            <button onClick={() => onManageDokumen(p)} className="p-1.5 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors" title="Dokumen Dukung"><DocumentTextIcon className="h-4 w-4" /></button>
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
                            <button onClick={() => onRestore(p.id)} className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Restore ke Aktif"><RotateCcwIcon className="h-4 w-4" /></button>
                        </div>
                    )}
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500">Tidak ada data untuk ditampilkan.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col space-y-4">
      {setStatusModalState.isOpen && (
        <ConfirmationModal 
            isOpen={setStatusModalState.isOpen}
            onClose={handleCancelSelesai}
            onConfirm={handleConfirmSelesai}
            title="Selesaikan Putusan"
            message="Apakah kasus hukum ini telah selesai?"
            confirmText="Selesai"
        />
      )}
      
      <Breadcrumb currentView="eAdvokasiPenangananPutusan" onNavigate={onNavigate} />

      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Penanganan Putusan</h1>
        <p className="text-gray-600 mt-1">Kelola tindak lanjut atas putusan perkara hukum.</p>
        <div className="border-b-4 border-blue-600 w-16 mt-4"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Putusan</h2>
          <div className="relative">
            <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nomor perkara atau perihal..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-80 text-sm"
            />
          </div>
        </div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => { setActiveTab('aktif'); setCurrentPage(1); }}
              className={`${activeTab === 'aktif' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors`}
            >
              Aktif
            </button>
            <button
              onClick={() => { setActiveTab('selesai'); setCurrentPage(1); }}
              className={`${activeTab === 'selesai' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors`}
            >
              Selesai
            </button>
          </nav>
        </div>
        <div className="mt-4 flex-1 overflow-hidden flex flex-col">
            {renderTable(paginatedData, activeTab === 'selesai')}
            <Pagination 
              totalItems={filteredData.length} 
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
              onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            />
        </div>
      </div>
    </div>
  );
};

export default PenangananPutusan;
