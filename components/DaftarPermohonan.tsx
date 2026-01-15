
import React, { useState } from 'react';
import { Permohonan, StatusPermohonan } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, DotsVerticalIcon, MailOpenIcon, SearchIcon, TrashIcon, PencilIcon, PaperAirplaneIcon as SendIcon, InformationCircleIcon } from './icons';

interface DaftarPermohonanProps {
  permohonanList: Permohonan[];
  selectedId?: string | null;
  onSelect: (permohonan: Permohonan) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
}

const getStatusClass = (status: StatusPermohonan) => {
  switch (status) {
    case StatusPermohonan.DRAFT:
      return 'bg-gray-200 text-gray-800';
    case StatusPermohonan.TERKIRIM:
      return 'bg-blue-200 text-blue-800';
    case StatusPermohonan.DIPROSES:
      return 'bg-yellow-200 text-yellow-800';
    case StatusPermohonan.SELESAI:
      return 'bg-green-200 text-green-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const PermohonanItem: React.FC<{ permohonan: Permohonan; isSelected: boolean; onSelect: () => void; onDelete: () => void; onSend: () => void; }> = ({ permohonan, isSelected, onSelect, onDelete, onSend }) => {
    const isDraft = permohonan.status === StatusPermohonan.DRAFT;

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };
    
    const displayDate = new Date(permohonan.tanggal.split('/').reverse().join('-')).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});

    return (
        <div onClick={isDraft ? undefined : onSelect} className={`p-4 border-l-4 ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-transparent bg-white'} hover:shadow-md cursor-pointer transition`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2">
                        <p className="font-bold text-gray-800">{permohonan.id}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusClass(permohonan.status)}`}>{permohonan.status}</span>
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 mt-1">{permohonan.perihal}</h3>
                    <p className="text-sm text-gray-600">{permohonan.unit}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-500">{displayDate}</p>
                    <div className="flex space-x-1 mt-2 justify-end">
                        {isDraft ? (
                            <>
                                <button title="Edit" onClick={(e) => handleAction(e, () => alert('Edit action triggered for ' + permohonan.id))} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"><PencilIcon className="h-5 w-5"/></button>
                                <button title="Delete" onClick={(e) => handleAction(e, onDelete)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"><TrashIcon className="h-5 w-5"/></button>
                                <button title="Send" onClick={(e) => handleAction(e, onSend)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-full"><SendIcon className="h-5 w-5"/></button>
                            </>
                        ) : (
                             <button title="View Details" onClick={(e) => handleAction(e, onSelect)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"><InformationCircleIcon className="h-5 w-5"/></button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

type TabName = 'Konsep Permohonan' | 'Permohonan Aktif' | 'Permohonan Selesai';

const DaftarPermohonan: React.FC<DaftarPermohonanProps> = ({ permohonanList, selectedId, onSelect, onCreateNew, onDelete, onSend }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Permohonan Aktif');

  const filteredList = permohonanList.filter(p => {
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
  });

  const TabButton: React.FC<{ name: TabName }> = ({ name }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`px-3 py-2 text-sm ${
        activeTab === name
          ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
          : 'text-gray-500'
      }`}
    >
      {name}
    </button>
  );

  const content = (
    <div className="w-[420px] border-r border-gray-200 bg-white flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Daftar Permohonan</h2>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 hover:text-gray-800"><SearchIcon className="h-5 w-5"/></button>
              <button className="text-gray-500 hover:text-gray-800"><DotsVerticalIcon className="h-5 w-5"/></button>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <TabButton name="Konsep Permohonan" />
            <TabButton name="Permohonan Aktif" />
            <TabButton name="Permohonan Selesai" />
          </div>
        </div>
        <div className="p-2 flex items-center justify-between text-sm border-b border-gray-200">
            <input type="checkbox" className="mr-2" />
            <span>1 - {filteredList.length} dari {filteredList.length}</span>
            <div className="flex">
                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronLeftIcon className="h-5 w-5"/></button>
                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronRightIcon className="h-5 w-5"/></button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            <div className="p-2">
                 <button onClick={onCreateNew} className="w-full text-center bg-blue-50 text-blue-700 font-semibold py-3 rounded-lg hover:bg-blue-100 transition mb-2">
                    + Buat Permohonan Baru
                </button>
            </div>
          <div className="space-y-1">
             {filteredList.map((p) => (
                <PermohonanItem key={p.id} permohonan={p} isSelected={p.id === selectedId} onSelect={() => onSelect(p)} onDelete={() => onDelete(p.id)} onSend={() => onSend(p.id)} />
             ))}
          </div>
        </div>
      </div>
  );

  // If no item is selected, show the list and the placeholder
  if (!selectedId) {
      return (
         <div className="flex h-full">
            {content}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 p-8 text-center">
                <MailOpenIcon className="h-24 w-24 text-gray-300" />
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
