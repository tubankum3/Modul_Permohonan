
import React, { useState, useEffect } from 'react';
import { PerkaraRecord, View, DokumenLitigasi, FileData, PosisiSidangEntry, Putusan } from '../types';
import { ArrowLeftIcon, DownloadIcon, EyeIcon, SearchIcon, CloudArrowDownIcon, PencilSquareIcon, DocumentTextIcon, UploadIcon, XIcon, CheckIcon, TagIcon } from './icons';
import TarikDataNadineModal from './eadvo_TarikDataNadineModal';
import Breadcrumb from './Breadcrumb';
import DocumentTable, { DocumentItemRow } from './eadvo_DocumentTable';

interface DokumenPerkaraProps {
  record: PerkaraRecord;
  onNavigate: (view: View, record?: PerkaraRecord) => void;
}

const DokumenPerkara: React.FC<DokumenPerkaraProps> = ({ record, onNavigate }) => {
  const [isNadineModalOpen, setIsNadineModalOpen] = useState(false);
  
  // Local states for keeping track of documents
  const [permohonanDocs, setPermohonanDocs] = useState<any[]>(record.files || []);
  const [litigasiDocs, setLitigasiDocs] = useState<any[]>(record.dokumenLitigasi || []);

  useEffect(() => {
    setPermohonanDocs(record.files || []);
  }, [record.id, record.files]);
  
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
  const [tagsDokumen, setTagsDokumen] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputError, setInputError] = useState('');

  const resetUploadForm = () => {
    setNoDokumen('');
    setTanggalDokumen('');
    setJenisDokumen('Surat Permohonan');
    setDeskripsiDokumen('');
    setTagsDokumen('');
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
      setTagsDokumen('Permohonan, Nadine');
    } else if (category === 'litigasi') {
      setJenisDokumen('SKU / Berkas Jawab Jinawab');
      setTagsDokumen('SKU, Litigasi');
    } else if (category === 'laporan') {
      setJenisDokumen('Laporan Sidang');
      setTagsDokumen('Laporan, Sidang');
    } else {
      setJenisDokumen('Berkas Putusan');
      setTagsDokumen('Putusan, Salinan');
    }
  };

  const handleDeleteDoc = (category: DocCategory, item: any, index: number) => {
    if (category === 'permohonan') {
      setPermohonanDocs(permohonanDocs.filter((_, i) => i !== index));
    } else if (category === 'litigasi') {
      setLitigasiDocs(litigasiDocs.filter((_, i) => i !== index));
    } else if (category === 'laporan') {
      setLaporanDocs(laporanDocs.filter((_, i) => i !== index));
    } else if (category === 'putusan') {
      setPutusanDocs(putusanDocs.filter((_, i) => i !== index));
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

    const parsedTags = tagsDokumen 
      ? tagsDokumen.split(',').map(t => t.trim()).filter(Boolean)
      : undefined;

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
      description: deskripsiDokumen || undefined, // For compatibility
      tags: parsedTags
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
                  rows={2}
                  value={deskripsiDokumen}
                  onChange={(e) => setDeskripsiDokumen(e.target.value)}
                  placeholder="Tuliskan deskripsi singkat atau perihal surat/dokumen ini..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Tags / Label</span>
                  <span className="text-[11px] text-gray-400 font-normal">Pisahkan dengan koma</span>
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={tagsDokumen}
                    onChange={(e) => setTagsDokumen(e.target.value)}
                    placeholder="Contoh: SKU, Litigasi, Prioritas"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <TagIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
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
        <DocumentTable
          title="1. Dokumen Permohonan"
          categoryContext="permohonan"
          items={permohonanDocs}
          onDelete={(item, index) => handleDeleteDoc('permohonan', item, index)}
          headerAction={
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
          }
        />

        {/* 2. Dokumen Litigasi */}
        <DocumentTable
          title="2. Dokumen Litigasi (SKU, Dokumen Jawab Jinawab, Data Dukung)"
          categoryContext="litigasi"
          items={litigasiDocs}
          onDelete={(item, index) => handleDeleteDoc('litigasi', item, index)}
          headerAction={
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
          }
        />

        {/* 3. Dokumen Laporan */}
        <DocumentTable
          title="3. Dokumen Laporan (Laporan Sidang, Laporan Putusan)"
          categoryContext="laporan"
          items={laporanDocs}
          onDelete={(item, index) => handleDeleteDoc('laporan', item, index)}
          headerAction={
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
          }
        />

        {/* 4. Dokumen Putusan */}
        <DocumentTable
          title="4. Dokumen Putusan"
          categoryContext="putusan"
          items={putusanDocs}
          onDelete={(item, index) => handleDeleteDoc('putusan', item, index)}
          headerAction={
            <button 
              onClick={() => handleUploadClick('putusan')}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
            >
              <UploadIcon className="h-4 w-4" />
              <span>UNGGAH DOKUMEN</span>
            </button>
          }
        />

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
