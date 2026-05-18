
import React, { useState } from 'react';
import { PerkaraRecord, View, DokumenLitigasi, FileData, TindakLanjut, Putusan } from '../types';
import { ArrowLeftIcon, DownloadIcon, EyeIcon, SearchIcon, CloudArrowDownIcon, PencilSquareIcon, DocumentTextIcon, UploadIcon } from './icons';
import TarikDataNadineModal from './eadvo_TarikDataNadineModal';

interface DokumenPutusanProps {
  record: PerkaraRecord;
  onNavigate: (view: View, record?: PerkaraRecord) => void;
}

const DokumenPutusan: React.FC<DokumenPutusanProps> = ({ record, onNavigate }) => {
  const [isNadineModalOpen, setIsNadineModalOpen] = useState(false);
  
  const renderTable = (
    title: string, 
    columns: string[], 
    data: any[], 
    renderRow: (item: any, index: number) => React.ReactNode,
    action?: React.ReactNode
  ) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{data.length} Berkas</span>
        </div>
        {action}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
              {columns.map(col => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? data.map((item, index) => renderRow(item, index)) : (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-8 text-center text-gray-500 italic">Belum ada dokumen.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 1. Dokumen Tindak Lanjut
  const tindakLanjutDocs = record.tindakLanjut || [];

  // 2. Dokumen Laporan (Get Data from Nadine, Tulis Naskah)
  const laporanDocs = (record.putusan || []).map(p => ({
    id: `lp-${p.id}`,
    name: `Laporan Putusan - ${p.nomor}`,
    type: 'Laporan Putusan',
    date: p.tanggal,
    source: 'Nadine (Auto-generated)'
  }));

  // 3. Dokumen Putusan
  const putusanDocs = (record.putusan || []).filter(p => (p as any).dokumen).map(p => ({
    id: `p-${p.id}`,
    name: (p as any).dokumen,
    nomor: p.nomor,
    tanggal: p.tanggal,
    status: p.status
  }));

  return (
    <div className="p-8 bg-gray-50 h-full overflow-y-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={() => onNavigate('eAdvokasiPenangananPutusan')}
          className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Dokumen Penanganan Putusan</h1>
          <p className="text-gray-600 mt-1">
            {record.abstraksiPerkara?.noPerkara || record.Nomor || record.id} - {record.perihal}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* 1. Dokumen Tindak Lanjut */}
        {renderTable(
          "1. Dokumen Tindak Lanjut",
          ["Tanggal", "Tindak Lanjut", "File"],
          tindakLanjutDocs,
          (t: TindakLanjut, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.tanggal}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.tindakLanjut}</td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {t.file ? (
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                    <span>{t.file.name}</span>
                  </div>
                ) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                {t.file && (
                  <>
                    <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5" /></button>
                    <button className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-5 w-5" /></button>
                  </>
                )}
              </td>
            </tr>
          ),
          <div className="flex items-center space-x-2">
            <button 
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
            >
              <UploadIcon className="h-4 w-4" />
              <span>UNGGAH DOKUMEN</span>
            </button>
            <button 
              onClick={() => setIsNadineModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
            >
              <CloudArrowDownIcon className="h-4 w-4" />
              <span>TARIK DARI NADINE</span>
            </button>
            <button 
              onClick={() => onNavigate('pilihTemplate')}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow-md"
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span>TULIS NASKAH</span>
            </button>
          </div>
        )}

        {/* 2. Dokumen Laporan */}
        {renderTable(
          "2. Dokumen Laporan (Laporan Putusan)",
          ["Nama Laporan", "Tanggal", "Sumber"],
          laporanDocs,
          (doc, index) => (
            <tr key={doc.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic text-xs">{doc.source}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-5 w-5" /></button>
              </td>
            </tr>
          ),
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsNadineModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
            >
              <CloudArrowDownIcon className="h-4 w-4" />
              <span>TARIK DARI NADINE</span>
            </button>
            <button 
              onClick={() => onNavigate('pilihTemplate')}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow-md"
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span>TULIS NASKAH</span>
            </button>
          </div>
        )}

        {/* 3. Dokumen Putusan */}
        {renderTable(
          "3. Dokumen Putusan",
          ["Nomor Putusan", "Nama Berkas", "Tanggal", "Status"],
          putusanDocs,
          (doc, index) => (
            <tr key={doc.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.nomor}</td>
              <td className="px-6 py-4 text-sm text-gray-800">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5 text-red-500" />
                  <span>{doc.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.tanggal}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${doc.status === 'Menang' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {doc.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-5 w-5" /></button>
              </td>
            </tr>
          ),
          <button 
            className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
          >
            <UploadIcon className="h-4 w-4" />
            <span>UNGGAH DOKUMEN</span>
          </button>
        )}

      </div>
      <TarikDataNadineModal 
          isOpen={isNadineModalOpen} 
          onClose={() => setIsNadineModalOpen(false)}
          onTarikData={(surat, jenis) => {
              console.log('Tarik data dari nadine:', surat, jenis);
              setIsNadineModalOpen(false);
          }} 
      />
    </div>
  );
};

export default DokumenPutusan;
