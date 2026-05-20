
import React, { useState, useMemo } from 'react';
import { Permohonan, Riwayat, StatusPermohonan, View } from '../types';
import DetailPermohonan from './satkem_DetailPermohonan';
import AssignTeam from './AssignTeam';
import ConfirmationModal from './ConfirmationModal';
import Breadcrumb from './Breadcrumb';
import Pagination from './Pagination';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, PrintIcon, EyeIcon, UserIcon, DocumentTextIcon, CheckCircleIcon, RotateCcwIcon } from './icons';

interface PengelolaanPermohonanProps {
    permohonanList: Permohonan[];
    selectedPermohonan: Permohonan | null;
    onSelectPermohonan: (permohonan: Permohonan | null) => void;
    onAddReply: (permohonanId: string, reply: Riwayat) => void;
    onUpdateReply: (permohonanId: string, historyId: number, newMessage: string) => void;
    onDeleteReply: (permohonanId: string, historyId: number) => void;
    onUpdateStatus: (permohonanId: string, newStatus: StatusPermohonan) => void;
    onUpdateTeam: (permohonanId: string, team: any[]) => void;
    onSetPic: (permohonanId: string, picId: string | null) => void;
    onNavigate: (view: View) => void;
}

const PengelolaanPermohonan: React.FC<PengelolaanPermohonanProps> = ({
    permohonanList,
    selectedPermohonan,
    onSelectPermohonan,
    onAddReply,
    onUpdateReply,
    onDeleteReply,
    onUpdateStatus,
    onUpdateTeam,
    onSetPic,
    onNavigate,
}) => {
    const [managementView, setManagementView] = useState<'list' | 'detail' | 'team'>('list');
    const [activeFilter, setActiveFilter] = useState<'Total' | 'Diproses' | 'Selesai'>('Total');
    const [setStatusModalState, setSetStatusModalState] = useState<{ isOpen: boolean; targetId: string | null }>({ isOpen: false, targetId: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredPermohonanList = useMemo(() => {
        return permohonanList.filter(p => {
            const matchesFilter = 
                activeFilter === 'Total' ||
                (activeFilter === 'Diproses' && p.status === StatusPermohonan.DIPROSES) ||
                (activeFilter === 'Selesai' && p.status === StatusPermohonan.SELESAI);
                
            const matchesSearch = 
                (p.perihal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.Nomor || '').toLowerCase().includes(searchTerm.toLowerCase());
                
            return matchesFilter && matchesSearch;
        });
    }, [permohonanList, activeFilter, searchTerm]);

    const paginatedPermohonanList = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPermohonanList.slice(start, start + itemsPerPage);
    }, [filteredPermohonanList, currentPage, itemsPerPage]);

    const handleViewDetails = (permohonan: Permohonan) => {
        onSelectPermohonan(permohonan);
        setManagementView('detail');
    };

    const handleAssignTeam = (permohonan: Permohonan) => {
        onSelectPermohonan(permohonan);
        setManagementView('team');
    };

    const handleBackToList = () => {
        onSelectPermohonan(null);
        setManagementView('list');
    };

    const getStatusBadgeClass = (status: StatusPermohonan) => {
        switch (status) {
            case StatusPermohonan.DIPROSES:
                return 'bg-orange-100 text-orange-800';
            case StatusPermohonan.SELESAI:
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    const requestSetStatus = (id: string) => {
        setSetStatusModalState({ isOpen: true, targetId: id });
    };

    const handleConfirmSetStatus = () => {
        if (setStatusModalState.targetId) {
            onUpdateStatus(setStatusModalState.targetId, StatusPermohonan.SELESAI);
        }
        setSetStatusModalState({ isOpen: false, targetId: null });
    };

    const handleCancelSetStatus = () => {
        setSetStatusModalState({ isOpen: false, targetId: null });
    };

    if (managementView === 'detail' && selectedPermohonan) {
        return (
            <div className="h-full flex flex-col bg-gray-50">
                <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start">
                    <button onClick={handleBackToList} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div className="ml-3">
                        <h2 className="text-lg font-bold text-gray-800">Rincian Permohonan</h2>
                        <p className="text-base font-semibold text-gray-700 mt-1">
                            {selectedPermohonan?.Nomor || selectedPermohonan?.id || 'N/A'}
                        </p>
                        {selectedPermohonan?.perihal && (
                            <p className="text-sm text-gray-600 mt-1">{selectedPermohonan.perihal}</p>
                        )}
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto">
                    <DetailPermohonan
                        permohonan={selectedPermohonan}
                        onAddReply={onAddReply}
                        onUpdateReply={onUpdateReply}
                        onDeleteReply={onDeleteReply}
                        currentUserRole='Administrator'
                    />
                </div>
            </div>
        );
    }
    
    if (managementView === 'team' && selectedPermohonan) {
         return (
            <div className="h-full flex flex-col bg-gray-50">
                <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start">
                    <button onClick={handleBackToList} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div className="ml-3">
                        <h2 className="text-lg font-bold text-gray-800">Pengelolaan Tim Advokasi</h2>
                        <p className="text-base font-semibold text-gray-700 mt-1">{selectedPermohonan.Nomor}</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedPermohonan.perihal}</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto">
                    <AssignTeam
                        team={selectedPermohonan.team || []}
                        picId={selectedPermohonan.picId || null}
                        onUpdateTeam={(team) => onUpdateTeam(selectedPermohonan.id, team)}
                        onSetPic={(picId) => onSetPic(selectedPermohonan.id, picId)}
                    />
                </div>
            </div>
        );
    }
    
    const diprosesCount = permohonanList.filter(p => p.status === StatusPermohonan.DIPROSES).length;
    const selesaiCount = permohonanList.filter(p => p.status === StatusPermohonan.SELESAI).length;
    const totalCount = permohonanList.length;

    const StatCard = ({ title, count, filter, color }: { title: string; count: number; filter: 'Total' | 'Diproses' | 'Selesai'; color: { bg: string; border: string; text: string; }}) => {
        const isActive = activeFilter === filter;
        return (
            <div 
                onClick={() => setActiveFilter(filter)}
                className={`p-4 rounded-lg cursor-pointer transition flex-1 ${isActive ? `${color.bg} ${color.border} border-2 shadow-sm` : 'bg-white border hover:bg-gray-50'}`}
            >
                <p className={`text-sm font-medium ${isActive ? color.text : 'text-gray-500'}`}>{title}</p>
                <p className={`text-3xl font-bold ${isActive ? color.text : 'text-gray-800'}`}>{count}</p>
            </div>
        );
    };

    return (
       <div className="p-8 bg-gray-50 h-full flex flex-col space-y-4">
            <ConfirmationModal
                isOpen={setStatusModalState.isOpen}
                onClose={handleCancelSetStatus}
                onConfirm={handleConfirmSetStatus}
                title="Ubah Status Permohonan"
                message="Apakah kasus hukum ini telah selesai?"
                confirmText="Ubah Status"
            />

            <Breadcrumb currentView="eAdvokasiPengelolaan" onNavigate={onNavigate} />

            <h1 className="text-3xl font-bold text-gray-800">Pengelolaan Permohonan</h1>
            <p className="text-gray-600 mt-1">Kelola permohonan yang sedang diproses atau telah selesai.</p>
            <div className="border-b-4 border-blue-600 w-16 my-2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <StatCard title="Aktif" count={diprosesCount} filter="Diproses" color={{ bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800' }} />
                <StatCard title="Selesai" count={selesaiCount} filter="Selesai" color={{ bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800' }} />
                <StatCard title="Total" count={totalCount} filter="Total" color={{ bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800' }} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="relative w-full max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Cari berdasarkan perihal, Nomor, atau ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Tiket/ND</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perihal</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedPermohonanList.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.Nomor || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.tanggal}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={p.perihal}>{p.perihal}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.jenis}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(p.status)}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-1.5">
                                                {p.status === StatusPermohonan.DIPROSES ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleViewDetails(p)} 
                                                            className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition" 
                                                            title="View Detail"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAssignTeam(p)} 
                                                            className="p-1.5 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition" 
                                                            title="Penugasan Tim"
                                                        >
                                                            <UserIcon className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                onSelectPermohonan(p);
                                                                onNavigate('pilihTemplate');
                                                            }} 
                                                            className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition" 
                                                            title="SKU/Dokumen"
                                                        >
                                                            <DocumentTextIcon className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                handleViewDetails(p);
                                                                setTimeout(() => window.print(), 500);
                                                            }}
                                                            className="p-1.5 rounded bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700 transition" 
                                                            title="Print/Download Resume"
                                                        >
                                                            <PrintIcon className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => requestSetStatus(p.id)} 
                                                            className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition" 
                                                            title="Set Selesai"
                                                        >
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => handleViewDetails(p)} 
                                                            className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition" 
                                                            title="View Detail"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                onSelectPermohonan(p);
                                                                onNavigate('pilihTemplate');
                                                            }} 
                                                            className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition" 
                                                            title="SKU/Dokumen"
                                                        >
                                                            <DocumentTextIcon className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                handleViewDetails(p);
                                                                setTimeout(() => window.print(), 500);
                                                            }}
                                                            className="p-1.5 rounded bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700 transition" 
                                                            title="Print/Download Resume"
                                                        >
                                                            <PrintIcon className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => onUpdateStatus(p.id, StatusPermohonan.DIPROSES)} 
                                                            className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition" 
                                                            title="Restore ke Aktif"
                                                        >
                                                            <RotateCcwIcon className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredPermohonanList.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            <p>Tidak ada permohonan yang sesuai dengan filter.</p>
                        </div>
                    )}
                    <Pagination 
                        totalItems={filteredPermohonanList.length}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PengelolaanPermohonan;
