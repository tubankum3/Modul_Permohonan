
import React, { useState } from 'react';
import { XIcon, UploadIcon, DocumentTextIcon, UserIcon, CloudIcon, CloudDownloadIcon, CheckIcon, EyeIcon, DownloadIcon, CloudArrowDownIcon, ArrowLeftIcon, TagIcon } from './icons';
import { PendampinganRecord, PosisiUpdate, SuratMasukNadine, JenisPermohonan, View } from '../types';
import TarikDataNadineModal from './eadvo_TarikDataNadineModal';
import Breadcrumb from './Breadcrumb';
import DocumentTable from './eadvo_DocumentTable';

interface DokumenPendampinganProps {
    record: PendampinganRecord;
    posisi?: PosisiUpdate;
    onNavigate: (view: View, record?: PendampinganRecord) => void;
}

type DokumenCategory = 'permohonan' | 'pendampingan' | 'laporan';

interface DokumenItem {
    id: string;
    nama: string;
    nomor?: string;
    tanggal?: string;
    jenis?: string;
    deskripsi?: string;
    type: 'upload' | 'nadine' | 'generate';
    category: DokumenCategory;
    size?: number | string;
    tags?: string[];
}

const DokumenPendampingan: React.FC<DokumenPendampinganProps> = ({ record, posisi, onNavigate }) => {
    const [isNadineOpen, setIsNadineOpen] = useState(false);
    const [nadineTarget, setNadineTarget] = useState<string>('');
    
    // Load documents from record.files if available, or fall back to default
    const getInitialDocs = (): DokumenItem[] => {
        const initialDocs: DokumenItem[] = [];
        
        if (record.files && record.files.length > 0) {
            record.files.forEach((file, index) => {
                initialDocs.push({
                    id: `permohonan-file-${index}-${file.name}`,
                    nama: file.name,
                    nomor: record.Nomor,
                    tanggal: record.tanggal,
                    type: 'upload',
                    category: 'permohonan'
                });
            });
        } else {
            initialDocs.push({ 
                id: '1', 
                nama: 'Surat Permohonan.pdf', 
                nomor: record.Nomor, 
                tanggal: record.tanggal, 
                type: 'upload', 
                category: 'permohonan' 
            });
        }

        initialDocs.push({ 
            id: '2', 
            nama: 'ST-' + (posisi?.suratTugas || '....') + '.docx', 
            type: 'generate', 
            category: 'pendampingan' 
        });

        return initialDocs;
    };

    const [documents, setDocuments] = useState<DokumenItem[]>(getInitialDocs);

    // Modal & Form States
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadCategory, setUploadCategory] = useState<DokumenCategory | null>(null);
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

    const handleUploadClick = (category: DokumenCategory) => {
        setUploadCategory(category);
        setIsUploadOpen(true);
        setTanggalDokumen(new Date().toISOString().split('T')[0]);
        if (category === 'permohonan') {
            setJenisDokumen('Surat Permohonan');
            setTagsDokumen('Permohonan, Nadine');
        } else if (category === 'pendampingan') {
            setJenisDokumen('Surat Tugas / Surat Perintah');
            setTagsDokumen('Surat Tugas, Pendampingan');
        } else {
            setJenisDokumen('Laporan / Memo');
            setTagsDokumen('Laporan, Resmi');
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

        const newDoc: DokumenItem = {
            id: Math.random().toString(36).substr(2, 9),
            nama: selectedFile.name,
            nomor: noDokumen || undefined,
            tanggal: tanggalDokumen || undefined,
            jenis: jenisDokumen,
            deskripsi: deskripsiDokumen || undefined,
            type: 'upload',
            category: uploadCategory || 'pendampingan',
            size: selectedFile.size,
            tags: parsedTags
        };

        setDocuments([...documents, newDoc]);
        resetUploadForm();
    };

    const handleGetFromNadine = (category: DokumenCategory) => {
        setNadineTarget(category);
        setIsNadineOpen(true);
    };

    const handleNadineData = (suratList: SuratMasukNadine[], jenis: JenisPermohonan) => {
        const newDocs: DokumenItem[] = suratList.map(data => ({
            id: Math.random().toString(36).substr(2, 9),
            nama: data.perihal || 'Dokumen Nadine',
            nomor: data.nomorSurat,
            tanggal: data.tanggal,
            type: 'nadine',
            category: nadineTarget as DokumenCategory
        }));
        setDocuments([...documents, ...newDocs]);
        setIsNadineOpen(false);
    };

    const handleGenerateNaskah = () => {
        onNavigate('pilihTemplate');
    };

    const handleDelete = (id: string) => {
        setDocuments(documents.filter(d => d.id !== id));
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {isNadineOpen && (
                <TarikDataNadineModal 
                    isOpen={isNadineOpen}
                    onClose={() => setIsNadineOpen(false)}
                    onTarikData={handleNadineData}
                />
            )}

            {isUploadOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <UploadIcon className="h-5 w-5 text-green-600" />
                                <span>Unggah Berkas Dokumen</span>
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
                                    placeholder="Contoh: SP/102/V/2026 atau No. Surat Keluar"
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
                                        <option value="Surat Tugas / Surat Perintah">Surat Tugas / Surat Perintah</option>
                                        <option value="Surat Pemanggilan">Surat Pemanggilan</option>
                                        <option value="Data Dukung / Bukti">Data Dukung / Bukti</option>
                                        <option value="Laporan / Memo">Laporan / Memo</option>
                                        <option value="Berita Acara">Berita Acara</option>
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
                                        placeholder="Contoh: Permohonan, Nadine, Urgent"
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
                                        id="modal-file-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                    />
                                    <label htmlFor="modal-file-upload" className="w-full h-full cursor-pointer flex flex-col items-center justify-center space-y-2">
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
            
            <div className="px-6 pt-4 bg-white flex-shrink-0">
                <Breadcrumb currentView="eAdvokasiPendampinganDokumen" onNavigate={onNavigate} />
            </div>
            
            <header className="p-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onNavigate('eAdvokasiPendampingan')}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-none">Dokumen</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            {record.Nomor || record.id} • {record.perihal}
                            {posisi && <span className="text-orange-600 font-bold ml-2">[{posisi.agenda}]</span>}
                        </p>
                    </div>
                </div>
            </header>

            <main className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* 1. Dokumen Permohonan & Pemanggilan */}
                    <DocumentTable
                        title="1. Dokumen Permohonan & Pemanggilan"
                        categoryContext="permohonan"
                        items={documents.filter(d => d.category === 'permohonan')}
                        onDelete={(item) => item.id && handleDelete(item.id.toString())}
                        headerAction={
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => handleUploadClick('permohonan')}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    <UploadIcon className="h-4 w-4" />
                                    <span>UNGGAH</span>
                                </button>
                                <button 
                                    onClick={() => handleGetFromNadine('permohonan')}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    <CloudArrowDownIcon className="h-4 w-4" />
                                    <span>NADINE</span>
                                </button>
                            </div>
                        }
                    />

                    {/* 2. Dokumen Pendampingan & Data Dukung */}
                    <DocumentTable
                        title="2. Dokumen Pendampingan & Data Dukung"
                        categoryContext="pendampingan"
                        items={documents.filter(d => d.category === 'pendampingan')}
                        onDelete={(item) => item.id && handleDelete(item.id.toString())}
                        headerAction={
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => handleUploadClick('pendampingan')}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    <UploadIcon className="h-4 w-4" />
                                    <span>UNGGAH</span>
                                </button>
                                <button 
                                    onClick={() => handleGetFromNadine('pendampingan')}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    <CloudArrowDownIcon className="h-4 w-4" />
                                    <span>NADINE</span>
                                </button>
                                <button 
                                    onClick={handleGenerateNaskah}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    <DocumentTextIcon className="h-4 w-4" />
                                    <span>GENERATE</span>
                                </button>
                            </div>
                        }
                    />

                    {/* 3. Dokumen Laporan */}
                    <DocumentTable
                        title="3. Dokumen Laporan"
                        categoryContext="laporan"
                        items={documents.filter(d => d.category === 'laporan')}
                        onDelete={(item) => item.id && handleDelete(item.id.toString())}
                        headerAction={
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => handleUploadClick('laporan')}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    <UploadIcon className="h-4 w-4" />
                                    <span>UNGGAH</span>
                                </button>
                                <button 
                                    onClick={() => handleGetFromNadine('laporan')}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    <CloudArrowDownIcon className="h-4 w-4" />
                                    <span>NADINE</span>
                                </button>
                            </div>
                        }
                    />
                </div>
            </main>
        </div>
    );
};

export default DokumenPendampingan;

