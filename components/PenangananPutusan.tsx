import React, { useState } from 'react';
import { PerkaraRecord, StatusPutusan, View } from '../types';
import { EyeIcon, PencilIcon, ArrowUpIcon, UserGroupIcon, TrashIcon, CheckIcon } from './icons';

interface PenangananPutusanProps {
  daftarPutusan: PerkaraRecord[];
  onView: (record: PerkaraRecord) => void;
  onEdit: (record: PerkaraRecord) => void;
  onUpdateTindakLanjut: (record: PerkaraRecord) => void;
  onManageTim: (record: PerkaraRecord) => void;
  onDelete: (id: string) => void;
  onSetSelesai: (id: string) => void;
}

const PenangananPutusan: React.FC<PenangananPutusanProps> = ({ 
    daftarPutusan, 
    onView, 
    onEdit, 
    onUpdateTindakLanjut, 
    onManageTim, 
    onDelete, 
    onSetSelesai 
}) => {
  const [activeTab, setActiveTab] = useState<'aktif' | 'selesai'>('aktif');

  const aktifPutusan = daftarPutusan.filter(p => p.statusPutusan === StatusPutusan.AKTIF);
  const selesaiPutusan = daftarPutusan.filter(p => p.statusPutusan === StatusPutusan.SELESAI);

  const renderTable = (data: PerkaraRecord[], isSelesai: boolean) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Perkara</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Masuk</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Perkara</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status BHT</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((p, index) => (
            <tr key={p.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.abstraksiPerkara?.noPerkara || p.Nomor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.abstraksiPerkara?.tahunMasuk}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{p.abstraksiPerkara?.jenisPerkara}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.statusBHT?.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center space-x-1">
                    <button onClick={() => onView(p)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" title="View"><EyeIcon className="h-5 w-5" /></button>
                    {!isSelesai && (
                        <>
                            <button onClick={() => onEdit(p)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" title="Edit"><PencilIcon className="h-5 w-5" /></button>
                            <button onClick={() => onUpdateTindakLanjut(p)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" title="Update Tindak Lanjut"><ArrowUpIcon className="h-5 w-5" /></button>
                            <button onClick={() => onManageTim(p)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" title="Manage Tim"><UserGroupIcon className="h-5 w-5" /></button>
                            <button onClick={() => onDelete(p.id)} className="p-2 rounded-full hover:bg-gray-200 text-red-500" title="Hapus"><TrashIcon className="h-5 w-5" /></button>
                            <button onClick={() => onSetSelesai(p.id)} className="p-2 rounded-full hover:bg-gray-200 text-green-500" title="Set Selesai"><CheckIcon className="h-5 w-5" /></button>
                        </>
                    )}
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">Tidak ada data untuk ditampilkan.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Penanganan Putusan</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('aktif')}
              className={`${activeTab === 'aktif' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm`}
            >
              Aktif
            </button>
            <button
              onClick={() => setActiveTab('selesai')}
              className={`${activeTab === 'selesai' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm`}
            >
              Selesai
            </button>
          </nav>
        </div>
        <div className="pt-2">
            {activeTab === 'aktif' && renderTable(aktifPutusan, false)}
            {activeTab === 'selesai' && renderTable(selesaiPutusan, true)}
        </div>
      </div>
    </div>
  );
};

export default PenangananPutusan;
