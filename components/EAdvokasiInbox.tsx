import React, { useState } from 'react';
import { Permohonan, StatusPermohonan, SuratMasukNadine, JenisPermohonan } from '../types';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, CloudDownloadIcon } from './icons';
import TarikDataNadineModal from './TarikDataNadineModal';

interface EAdvokasiInboxProps {
  permohonanList: Permohonan[];
  onProses: (permohonan: Permohonan) => void;
  onTarikData: (suratList: SuratMasukNadine[], jenis: JenisPermohonan) => void;
}

const EAdvokasiInbox: React.FC<EAdvokasiInboxProps> = ({ permohonanList, onProses, onTarikData }) => {
  const [isTarikDataModalOpen, setIsTarikDataModalOpen] = useState(false);
  
  const getStatusBadgeClass = (status: StatusPermohonan) => {
    switch (status) {
      case StatusPermohonan.BARU:
        return 'bg-yellow-100 text-yellow-800';
      case StatusPermohonan.TERKIRIM:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <TarikDataNadineModal 
        isOpen={isTarikDataModalOpen}
        onClose={() => setIsTarikDataModalOpen(false)}
        onTarikData={onTarikData}
      />
      <div className="p-8 bg-gray-50 h-full flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Inbox Permohonan</h1>
        <p className="text-gray-600 mt-1">Daftar permohonan bantuan hukum baru yang perlu diproses.</p>
        <div className="border-b-4 border-blue-600 w-16 my-4"></div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Cari berdasarkan perihal atau ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button onClick={() => setIsTarikDataModalOpen(true)} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition">
                <CloudDownloadIcon className="h-5 w-5"/>
                <span>Tarik Data Nadine</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                {permohonanList.map((p) => (
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
                      <button onClick={() => onProses(p)} className="text-blue-600 hover:text-blue-900 font-semibold">
                        Proses
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {permohonanList.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                      <p>Tidak ada permohonan baru di inbox.</p>
                  </div>
              )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{permohonanList.length}</span> dari <span className="font-medium">{permohonanList.length}</span> hasil
              </p>
              <div className="flex items-center">
                  <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronLeftIcon className="h-5 w-5"/></button>
                  <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronRightIcon className="h-5 w-5"/></button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EAdvokasiInbox;