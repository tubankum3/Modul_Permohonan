
import React, { useState } from 'react';
import { PerkaraRecord, View, DokumenLitigasi, FileData, PosisiSidangEntry, Putusan } from '../types';
import { ArrowLeftIcon, DownloadIcon, EyeIcon, SearchIcon, CloudArrowDownIcon, PencilSquareIcon, DocumentTextIcon, UploadIcon, XIcon, CheckIcon } from './icons';
import TarikDataNadineModal from './eadvo_TarikDataNadineModal';
import Breadcrumb from './Breadcrumb';

interface DokumenPerkaraProps {
  record: PerkaraRecord;
  onNavigate: (view: View, record?: PerkaraRecord) => void;
}

const DokumenPerkara: React.FC<DokumenPerkaraProps> = ({ record, onNavigate }) => {
  const [isNadineModalOpen, setIsNadineModalOpen] = useState(false);
  
  // Local states for keeping track of documents
  const [permohonanDocs, setPermohonanDocs] = useState<any[]>(record.files || []);
  const [litigasiDocs, setLitigasiDocs] = useState<any[]>(record.dokumenLitigasi || []);
  
  const [laporanDocs, setLaporanDocs] = useState<any[]>(() => {
    const laporanSidangDocs = (record.posisiSidang?.tkPertama || []).concat(
      record.posisiSidang?.tkBanding || [],
      record.posisiSidang?.tkKasasi || [],
      record.posisiSidang?.tkPK || []
    ).map(s => ({
      id: `ls-${s.id}`,
      name: `Laporan Sidang - ${s.agendaSidang}`,
      type: 'Laporan Sidang',
      date: s.tanggalSidang,
      source: 'Nadine (Auto-generated)',
      noDokumen: '',
      description: ''
    }));

    const laporanPutusanDocs = (record.putusan || []).map(p => ({
      id: `lp-${p.id}`,
      name: `Laporan Putusan - ${p.nomor}`,
      type: 'Laporan Putusan',
      date: p.tanggal,
      source: 'Nadine (Auto-generated)',
      noDokumen: '',
      description: ''
    }));

    return [...laporanSidangDocs, ...laporanPutusanDocs];
  });

  const [putusanDocs, setPutusanDocs] = useState<any[]>(() => {
    return (record.putusan || []).filter(p => (p as any).dokumen).map(p => ({
      id: `p-${p.id}`,
      name: (p as any).dokumen,
      nomor: p.nomor,
      tanggal: p.tanggal,
      status: p.status,
      type: 'Berkas Putusan',
      description: ''
    }));
  });

  // Modal & Form States
  type DocCategory = 'permohonan' | 'litigasi' | 'laporan' | 'putusan';
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<DocCategory | null>(null);
  
  const [noDokumen, setNoDokumen] = useState('');
  const [tanggalDokumen, setTanggalDokumen] = useState('');
  const [jenisDokumen, setJenisDokumen] = useState('Surat Permohonan');
  const [deskripsiDokumen, setDeskripsiDokumen] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputError, setInputError] = useState('');

  const resetUploadForm = () => {
    setNoDokumen('');
    setTanggalDokumen('');
    setJenisDokumen('Surat Permohonan');
    setDeskripsiDokumen('');
    setSelectedFile(null);
    setDragActive(false);
    setInputError('');
    setIsUploadOpen(false);
    setUploadCategory(null);
  };

  const handleUploadClick = (category: DocCategory) => {
    setUploadCategory(category);
    setIsUploadOpen(true);
    setTanggalDokumen(new Date().toISOString().split('T')[0]);
    if (category === 'permohonan') {
      setJenisDokumen('Surat Permohonan');
    } else if (category === 'litigasi') {
      setJenisDokumen('SKU / Berkas Jawab Jinawab');
    } else if (category === 'laporan') {
      setJenisDokumen('Laporan Sidang');
    } else {
      setJenisDokumen('Berkas Putusan');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setInputError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setInputError('');
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setInputError('Silakan pilih berkas dokumen terlebih dahulu.');
      return;
    }

    const filePayload = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type || 'application/pdf',
      nomor: noDokumen || undefined,
      noNaskah: noDokumen || undefined, // For compatibility
      tanggal: tanggalDokumen || undefined,
      timestamp: tanggalDokumen || undefined, // For compatibility
      jenis: jenisDokumen,
      deskripsi: deskripsiDokumen || undefined,
      description: deskripsiDokumen || undefined // For compatibility
    };

    if (uploadCategory === 'permohonan') {
      setPermohonanDocs([...permohonanDocs, filePayload]);
    } else if (uploadCategory === 'litigasi') {
      setLitigasiDocs([...litigasiDocs, filePayload]);
    } else if (uploadCategory === 'laporan') {
      setLaporanDocs([...laporanDocs, filePayload]);
    } else if (uploadCategory === 'putusan') {
      setPutusanDocs([...putusanDocs, filePayload]);
    }

    resetUploadForm();
  };

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

  return (
    <div className="p-8 bg-gray-50 h-full overflow-y-auto">
      <Breadcrumb currentView="eAdvokasiPerkaraDokumen" onNavigate={onNavigate} />
      
      {/* Upload Form Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto transform transition-all scale-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UploadIcon className="h-5 w-5 text-green-600" />
                <span>Unggah Berkas Dokumen Perkara</span>
              </h3>
              <button 
                onClick={resetUploadForm}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  No. Dokumen
                </label>
                <input 
                  type="text"
                  value={noDokumen}
                  onChange={(e) => setNoDokumen(e.target.value)}
                  placeholder="Contoh: No. Register / No. Surat / No. Gugatan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Dokumen
                  </label>
                  <input 
                    type="date"
                    value={tanggalDokumen}
                    onChange={(e) => setTanggalDokumen(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Jenis Dokumen
                  </label>
                  <select
                    value={jenisDokumen}
                    onChange={(e) => setJenisDokumen(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Surat Permohonan">Surat Permohonan</option>
                    <option value="SKU / Berkas Jawab Jinawab">SKU / Berkas Jawab Jinawab</option>
                    <option value="Surat Tugas / Surat Perintah">Surat Tugas / Surat Perintah</option>
                    <option value="Data Dukung / Bukti">Data Dukung / Bukti</option>
                    <option value="Laporan Sidang">Laporan Sidang</option>
                    <option value="Berkas Putusan">Berkas Putusan</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Deskripsi Dokumen/Perihal
                </label>
                <textarea 
                  rows={3}
                  value={deskripsiDokumen}
                  onChange={(e) => setDeskripsiDokumen(e.target.value)}
                  placeholder="Tuliskan deskripsi singkat atau perihal surat/dokumen ini..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Berkas Dokumen
                </label>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center cursor-pointer ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : selectedFile 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="file"
                    id="modal-file-upload-perkara"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  />
                  <label htmlFor="modal-file-upload-perkara" className="w-full h-full cursor-pointer flex flex-col items-center justify-center space-y-2">
                    <UploadIcon className={`h-8 w-8 ${selectedFile ? 'text-green-500' : 'text-gray-400 animate-pulse'}`} />
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-sm font-bold text-green-700 break-all">{selectedFile.name}</p>
                        <p className="text-xs text-green-600 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        <p className="text-[10px] text-gray-400 mt-2 italic">(Klik atau seret file lain untuk mengganti)</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">Drag & drop berkas Anda di sini, atau <span className="text-blue-600 hover:underline">pilih file</span></p>
                        <p className="text-xs text-gray-500 mt-1">Mendukung format PDF, Word, Excel, Gambar</p>
                      </div>
                    )}
                  </label>
                </div>
                {inputError && (
                  <p className="text-xs text-red-600 font-bold mt-1">{inputError}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetUploadForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Upload</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={() => onNavigate('eAdvokasiPenangananPerkara')}
          className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Dokumen Perkara</h1>
          <p className="text-gray-600 mt-1">
            {record.abstraksiPerkara?.noPerkara || record.Nomor || record.id} - {record.perihal}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* 1. Dokumen Permohonan */}
        {renderTable(
          "1. Dokumen Permohonan",
          ["Nama Berkas / Deskripsi", "No. & Tanggal Dokumen", "Ukuran / Jenis"],
          permohonanDocs,
          (file: any, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div className="flex items-start space-x-2">
                  <DocumentTextIcon className="h-5 w-5 mt-0.5 text-blue-500 shrink-0" />
                  <div>
                    <span className="block font-bold text-gray-950">{file.name}</span>
                    {file.jenis && <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200 mt-1 mr-2">{file.jenis}</span>}
                    {file.deskripsi && <p className="text-xs text-gray-500 mt-1 font-normal max-w-sm break-words">{file.deskripsi}</p>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="block font-semibold text-gray-700">{file.nomor || '-'}</span>
                <span className="text-xs text-gray-400 block mt-0.5">{file.tanggal || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-5 w-5" /></button>
              </td>
            </tr>
          ),
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleUploadClick('permohonan')}
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
          </div>
        )}

        {/* 2. Dokumen Litigasi */}
        {renderTable(
          "2. Dokumen Litigasi (SKU, Dokumen Jawab Jinawab, Data Dukung)",
          ["Nama Berkas / Deskripsi", "No. & Tanggal Dokumen", "Ukuran / Jenis"],
          litigasiDocs,
          (doc: any, index) => (
            <tr key={doc.id || index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div className="flex items-start space-x-2">
                  <DocumentTextIcon className="h-5 w-5 mt-0.5 text-purple-500 shrink-0" />
                  <div>
                    <span className="block font-bold text-gray-950">{doc.nama || doc.name || 'Dokumen Litigasi'}</span>
                    {doc.jenis && <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-200 mt-1 mr-2">{doc.jenis}</span>}
                    {doc.deskripsi && <p className="text-xs text-gray-500 mt-1 font-normal max-w-sm break-words">{doc.deskripsi}</p>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="block font-semibold text-gray-700">{doc.noNaskah || doc.nomor || '-'}</span>
                <span className="text-xs text-gray-400 block mt-0.5">{doc.timestamp ? doc.timestamp.split(' ')[0] : doc.tanggal || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-5 w-5" /></button>
              </td>
            </tr>
          ),
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleUploadClick('litigasi')}
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

        {/* 3. Dokumen Laporan */}
        {renderTable(
          "3. Dokumen Laporan (Laporan Sidang, Laporan Putusan)",
          ["Nama Laporan / Deskripsi", "No. & Tanggal Dokumen", "Ukuran / Sumber"],
          laporanDocs,
          (doc, index) => (
            <tr key={doc.id || index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div className="flex items-start space-x-2">
                  <DocumentTextIcon className="h-5 w-5 mt-0.5 text-teal-500 shrink-0" />
                  <div>
                    <span className="block font-bold text-gray-950">{doc.name || doc.nama}</span>
                    {doc.type && <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-200 mt-1 mr-2">{doc.type}</span>}
                    {(doc.description || doc.deskripsi) && <p className="text-xs text-gray-500 mt-1 font-normal max-w-sm break-words">{doc.description || doc.deskripsi}</p>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="block font-semibold text-gray-700">{doc.noDokumen || doc.nomor || '-'}</span>
                <span className="text-xs text-gray-400 block mt-0.5">{doc.date || doc.tanggal || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : <span className="text-gray-400 italic text-xs">{doc.source || 'Nadine (Auto-generated)'}</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-5 w-5" /></button>
              </td>
            </tr>
          ),
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleUploadClick('laporan')}
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
          </div>
        )}

        {/* 4. Dokumen Putusan */}
        {renderTable(
          "4. Dokumen Putusan",
          ["Nama Putusan / Deskripsi", "No. Putusan / Tanggal", "Status / Ukuran"],
          putusanDocs,
          (doc, index) => (
            <tr key={doc.id || index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div className="flex items-start space-x-2">
                  <DocumentTextIcon className="h-5 w-5 mt-0.5 text-red-500 shrink-0" />
                  <div>
                    <span className="block font-bold text-gray-950">{doc.name || doc.nama}</span>
                    <span className="inline-block bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200 mt-1 mr-2">{doc.type || 'Berkas Putusan'}</span>
                    {(doc.description || doc.deskripsi) && <p className="text-xs text-gray-500 mt-1 font-normal max-w-sm break-words">{doc.description || doc.deskripsi}</p>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="block font-semibold text-gray-700">{doc.nomor || '-'}</span>
                <span className="text-xs text-gray-400 block mt-0.5">{doc.tanggal || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${doc.status === 'Menang' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {doc.status || 'Archived'}
                </span>
                {doc.size && <span className="block text-xs text-gray-400 mt-1 font-normal">{(doc.size / 1024).toFixed(1)} KB</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-5 w-5" /></button>
              </td>
            </tr>
          ),
          <button 
            onClick={() => handleUploadClick('putusan')}
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

export default DokumenPerkara;
