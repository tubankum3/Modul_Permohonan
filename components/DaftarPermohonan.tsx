import React, { useState, useEffect } from 'react';
import { Permohonan, StatusPermohonan, View } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, DotsVerticalIcon, SearchIcon, TrashIcon, PencilIcon, SendIcon, PlaceholderIcon } from './icons';

interface DaftarPermohonanProps {
  permohonanList: Permohonan[];
  selectedId?: string | null;
  onSelect: (permohonan: Permohonan) => void;
  onCreateNew: () => void;
  onEdit: (permohonan: Permohonan) => void;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
  currentView: View;
  viewMode: 'user' | 'admin';
}

const PermohonanItem: React.FC<{ 
    permohonan: Permohonan; 
    isSelected: boolean;
    onSelect: () => void; 
    onEdit: () => void; 
    onDelete: () => void; 
    onSend: () => void; 
    viewMode: 'user' | 'admin';
}> = ({ permohonan, isSelected, onSelect, onEdit, onDelete, onSend, viewMode }) => {
    const isDraft = permohonan.status === StatusPermohonan.DRAFT;

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };
    
    const displayDate = new Date(permohonan.tanggal.split('/').reverse().join('-')).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});

    const itemClassName = `p-4 border-b border-gray-200 transition-colors cursor-pointer ${
        isSelected
        ? 'bg-gray-100'
        : `bg-white hover:bg-gray-50`
    }`;
    
    const getStatusBadgeClass = (status: StatusPermohonan) => {
        switch (status) {
            case StatusPermohonan.DRAFT:
                return 'bg-gray-200 text-gray-800';
            case StatusPermohonan.TERKIRIM:
                return 'bg-blue-200 text-blue-800';
            case StatusPermohonan.DIPROSES:
                return 'bg-orange-200 text-orange-800';
            case StatusPermohonan.SELESAI:
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div onClick={isDraft && viewMode === 'user' ? undefined : onSelect} className={itemClassName}>
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2">
                        <p className="font-bold text-gray-600 text-sm">{permohonan.Nomor || `Draft-${permohonan.id}`}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(permohonan.status)}`}>{permohonan.status}</span>
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 mt-1">{permohonan.perihal}</h3>
                    <p className="text-sm text-gray-600 mt-1 break-words">{permohonan.unit}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-gray-500 mb-2">{displayDate}</p>
                    {isDraft && viewMode === 'user' && (
                        <div className="flex space-x-3 text-gray-500 justify-end">
                            <button onClick={(e) => handleAction(e, onEdit)} className="hover:text-blue-600" title="Edit"><PencilIcon className="h-5 w-5"/></button>
                            <button onClick={(e) => handleAction(e, onDelete)} className="hover:text-red-600" title="Hapus"><TrashIcon className="h-5 w-5"/></button>
                            <button onClick={(e) => handleAction(e, onSend)} className="hover:text-green-600" title="Kirim"><SendIcon className="h-5 w-5"/></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

type UserTabName = 'Konsep Permohonan' | 'Permohonan Aktif' | 'Permohonan Selesai';
type AdminTabName = 'Permohonan Aktif' | 'Permohonan Selesai';

const DaftarPermohonan: React.FC<DaftarPermohonanProps> = ({ permohonanList, selectedId, onSelect, onCreateNew, onEdit, onDelete, onSend, currentView, viewMode }) => {
  const [activeTab, setActiveTab] = useState<UserTabName | AdminTabName>(viewMode === 'user' ? 'Konsep Permohonan' : 'Permohonan Aktif');
  const [searchTerm, setSearchTerm] = useState('');

  const userTabs: UserTabName[] = ['Konsep Permohonan', 'Permohonan Aktif', 'Permohonan Selesai'];
  const adminTabs: AdminTabName[] = ['Permohonan Aktif', 'Permohonan Selesai'];
  const tabs = viewMode === 'user' ? userTabs : adminTabs;

  useEffect(() => {
    setActiveTab(viewMode === 'user' ? 'Konsep Permohonan' : 'Permohonan Aktif');
  }, [viewMode]);

  const filteredList = permohonanList
    .filter(p => {
        if (activeTab === 'Konsep Permohonan') {
        return p.status === StatusPermohonan.DRAFT;
        }
        if (activeTab === 'Permohonan Aktif') {
        return p.status === StatusPermohonan.TERKIRIM || p.status === StatusPermohonan.DIPROSES;
        }
        if (activeTab === 'Permohonan Selesai') {
        return p.status === StatusPermohonan.SELESAI;
        }
        return false;
    })
    .filter(p => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const displayId = p.Nomor || p.id;
        return (
            p.perihal.toLowerCase().includes(lowerCaseSearch) ||
            displayId.toLowerCase().includes(lowerCaseSearch)
        );
    });

  const TabButton: React.FC<{ name: UserTabName | AdminTabName }> = ({ name }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`px-1 pb-2 text-sm ${
        activeTab === name
          ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
          : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      {name}
    </button>
  );

  const content = (
    <div className="w-[480px] bg-white flex flex-col h-full border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
                {viewMode === 'user' ? 'Daftar Permohonan' : 'Pengelolaan Permohonan'}
            </h2>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 hover:text-gray-800 p-1"><DotsVerticalIcon className="h-5 w-5"/></button>
            </div>
          </div>
           <div className="relative mt-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
                type="text"
                placeholder="Cari berdasarkan perihal atau Nomor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-4 mt-4">
            {tabs.map(tab => <TabButton key={tab} name={tab} />)}
          </div>
        </div>
        <div className="px-4 py-2 flex items-center justify-between text-sm border-b border-gray-200">
            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <div className="flex items-center">
                <span>{filteredList.length > 0 ? '1' : '0'} - {filteredList.length} dari {filteredList.length}</span>
                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded ml-4"><ChevronLeftIcon className="h-5 w-5"/></button>
                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronRightIcon className="h-5 w-5"/></button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-white">
            {viewMode === 'user' && (
                <div className="p-2">
                     <button onClick={onCreateNew} className="w-full text-center bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition">
                        + Buat Permohonan Baru
                    </button>
                </div>
            )}
          <div>
             {filteredList.map((p) => (
                <PermohonanItem 
                    key={p.id} 
                    permohonan={p} 
                    isSelected={p.id === selectedId}
                    onSelect={() => onSelect(p)} 
                    onEdit={() => onEdit(p)} 
                    onDelete={() => onDelete(p.id)} 
                    onSend={() => onSend(p.id)}
                    viewMode={viewMode}
                />
             ))}
          </div>
        </div>
      </div>
  );

  // If no item is selected, show the list and the placeholder
  if (!selectedId && !['edit', 'create', 'beranda', 'faq', 'eAdvokasiInbox'].includes(currentView)) {
      return (
         <div className="flex h-full w-full">
            {content}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 p-8 text-center">
                <PlaceholderIcon className="h-24 w-24 text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">Pilih Permohonan Untuk Dilihat</h3>
                <p className="mt-1 text-sm text-gray-500">Pilih salah satu permohonan dari daftar di sebelah kiri untuk melihat rinciannya.</p>
            </div>
         </div>
      );
  }

  // If an item is selected, just return the list content (the detail view will be rendered next to it in App.tsx)
  return content;
};

export default DaftarPermohonan;