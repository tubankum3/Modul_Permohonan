
import React, { useState, useMemo } from 'react';
import { 
    TrashIcon, 
    RotateCcwIcon, 
    EyeIcon, 
    SearchIcon, 
    CheckIcon,
    ArrowLeftIcon,
    FileTextIcon,
    BriefcaseIcon,
    ClockIcon,
    PrintIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from './icons';
import { 
    PendampinganRecord, 
    PerkaraRecord, 
    View 
} from '../types';
import Breadcrumb from './Breadcrumb';
import Pagination from './Pagination';

interface RecycleBinProps {
    pendampinganDeleted: PendampinganRecord[];
    perkaraDeleted: PerkaraRecord[];
    putusanDeleted: PerkaraRecord[];
    onRestore: (ids: string[], type: 'pendampingan' | 'perkara' | 'putusan') => void;
    onDeletePermanent: (ids: string[], type: 'pendampingan' | 'perkara' | 'putusan') => void;
    onView: (record: any, type: 'pendampingan' | 'perkara' | 'putusan') => void;
    onNavigate: (view: View) => void;
}

const RecycleBin: React.FC<RecycleBinProps> = ({ 
    pendampinganDeleted, 
    perkaraDeleted, 
    putusanDeleted,
    onRestore,
    onDeletePermanent,
    onView,
    onNavigate
}) => {
    const [activeTab, setActiveTab] = useState<'perkara' | 'putusan' | 'pendampingan'>('perkara');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const currentList = useMemo(() => {
        return activeTab === 'perkara' ? perkaraDeleted : 
               activeTab === 'putusan' ? putusanDeleted : 
               pendampinganDeleted;
    }, [activeTab, perkaraDeleted, putusanDeleted, pendampinganDeleted]);

    const filteredList = useMemo(() => {
        return currentList.filter(item => {
            const searchStr = searchTerm.toLowerCase();
            const perihal = item.perihal?.toLowerCase() || '';
            const nomor = (item as any).Nomor?.toLowerCase() || (item as any).abstraksiPerkara?.noPerkara?.toLowerCase() || '';
            return perihal.includes(searchStr) || nomor.includes(searchStr);
        });
    }, [currentList, searchTerm]);

    const paginatedList = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredList.slice(start, start + itemsPerPage);
    }, [filteredList, currentPage, itemsPerPage]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredList.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleTabChange = (tab: 'perkara' | 'putusan' | 'pendampingan') => {
        setActiveTab(tab);
        setSelectedIds([]);
        setSearchTerm('');
        setCurrentPage(1);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col space-y-4 p-8">
            <Breadcrumb currentView="eAdvokasiRecycleBin" onNavigate={onNavigate} />
            
            <header className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <TrashIcon className="h-7 w-7 mr-3 text-red-500" />
                            Recycle Bin (Tempat Sampah)
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola data yang telah dihapus sementara.</p>
                    </div>

                    <div className="flex items-center space-x-3">
                    </div>
                </div>

                <div className="mt-6 flex items-center bg-gray-100 p-1 rounded-lg w-fit border border-gray-200">
                    <button 
                        onClick={() => handleTabChange('perkara')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'perkara' 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Penanganan Perkara
                    </button>
                    <button 
                        onClick={() => handleTabChange('putusan')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'putusan' 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Penanganan Putusan
                    </button>
                    <button 
                        onClick={() => handleTabChange('pendampingan')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'pendampingan' 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Pendampingan
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col min-h-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                    <div className="p-6 border-b border-gray-200 bg-[#fcfcfc] space-y-4">
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder={`Cari data ${activeTab === 'perkara' ? 'perkara' : activeTab === 'putusan' ? 'putusan' : 'pendampingan'}...`}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-inner"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                            <button 
                                disabled={selectedIds.length === 0}
                                onClick={() => onRestore(selectedIds, activeTab)}
                                className={`flex items-center px-4 py-2 rounded text-sm font-bold transition-all shadow-sm ${
                                    selectedIds.length > 0 
                                    ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                }`}
                            >
                                <RotateCcwIcon className="h-4 w-4 mr-2" />
                                Restore Terpilih ({selectedIds.length})
                            </button>
                            <button 
                                disabled={selectedIds.length === 0}
                                onClick={() => {
                                    if(confirm('Apakah Anda yakin ingin menghapus data ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) {
                                        onDeletePermanent(selectedIds, activeTab);
                                        setSelectedIds([]);
                                    }
                                }}
                                className={`flex items-center px-4 py-2 rounded text-sm font-bold transition-all shadow-sm ${
                                    selectedIds.length > 0 
                                    ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                }`}
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Hapus Permanen ({selectedIds.length})
                            </button>
                            {selectedIds.length > 0 && (
                                <button 
                                    onClick={() => setSelectedIds([])}
                                    className="text-xs text-blue-600 hover:underline font-medium"
                                >
                                    Batalkan Pilihan
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto min-h-0 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.length === paginatedList.length && paginatedList.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Informasi Data</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Dihapus Pada</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">PIC / Tim</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList.length > 0 ? paginatedList.map(item => (
                                    <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50/30' : ''}`}>
                                        <td className="p-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => handleSelectRow(item.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">
                                                    {(item as any).Nomor || (item as any).abstraksiPerkara?.noPerkara || '-'}
                                                </span>
                                                <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.perihal}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {item.deletedAt || '-'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {(item as any).team?.find((m: any) => m.id === (item as any).picId)?.nama || (item as any).picId || 'Belum ada PIC'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {(item as any).team?.length || 0} Anggota Tim
                                                </span>
                                            </div>
                                        </td>
                                         <td className="p-4">
                                             <div className="grid grid-cols-4 gap-1 w-fit mx-auto">
                                                 <button 
                                                     onClick={() => onView(item, activeTab)}
                                                     className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                     title="View Detail"
                                                 >
                                                     <EyeIcon className="h-5 w-5" />
                                                 </button>
                                                 <button 
                                                     onClick={() => {
                                                         onView(item, activeTab);
                                                         setTimeout(() => window.print(), 500);
                                                     }}
                                                     className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                     title="Print/Download Resume"
                                                 >
                                                     <PrintIcon className="h-5 w-5" />
                                                 </button>
                                                 <button 
                                                     onClick={() => onRestore([item.id], activeTab)}
                                                     className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                     title="Restore"
                                                 >
                                                     <RotateCcwIcon className="h-5 w-5" />
                                                 </button>
                                                 <button 
                                                     onClick={() => {
                                                         if(confirm('Hapus permanen record ini?')) {
                                                             onDeletePermanent([item.id], activeTab);
                                                         }
                                                     }}
                                                     className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                     title="Delete Permanently"
                                                 >
                                                     <TrashIcon className="h-5 w-5" />
                                                 </button>
                                             </div>
                                         </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <TrashIcon className="h-16 w-16 text-gray-200 mb-4" />
                                                <p className="text-gray-500 font-medium">Recycle bin kosong.</p>
                                                <p className="text-xs text-gray-400 mt-1">Data yang dihapus dari modul utama akan muncul di sini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-gray-200 bg-white">
                        <Pagination 
                            totalItems={filteredList.length}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RecycleBin;
