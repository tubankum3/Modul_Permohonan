
import React, { useState } from 'react';
import { XIcon, UploadIcon, DocumentTextIcon, UserIcon, CloudIcon, CloudDownloadIcon, CheckIcon, EyeIcon, DownloadIcon, CloudArrowDownIcon, ArrowLeftIcon } from './icons';
import { PendampinganRecord, PosisiUpdate, SuratMasukNadine, JenisPermohonan, View } from '../types';
import TarikDataNadineModal from './eadvo_TarikDataNadineModal';
import Breadcrumb from './Breadcrumb';

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

    const handleUploadClick = (category: DokumenCategory) => {
        setUploadCategory(category);
        setIsUploadOpen(true);
        setTanggalDokumen(new Date().toISOString().split('T')[0]);
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

        const newDoc: DokumenItem = {
            id: Math.random().toString(36).substr(2, 9),
            nama: selectedFile.name,
            nomor: noDokumen || undefined,
            tanggal: tanggalDokumen || undefined,
            jenis: jenisDokumen,
            deskripsi: deskripsiDokumen || undefined,
            type: 'upload',
            category: uploadCategory || 'pendampingan'
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

    const renderTable = (title: string, category: DokumenCategory, showGenerate: boolean = false) => {
        const categoryDocs = documents.filter(d => d.category === category);

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8 last:mb-0">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-gray-800">{title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{categoryDocs.length} Berkas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => handleUploadClick(category)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                        >
                            <UploadIcon className="h-4 w-4" />
                            <span>UNGGAH</span>
                        </button>
                        <button 
                            onClick={() => handleGetFromNadine(category)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            <CloudArrowDownIcon className="h-4 w-4" />
                            <span>NADINE</span>
                        </button>
                        {showGenerate && (
                            <button 
                                onClick={handleGenerateNaskah}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow-md"
                            >
                                <DocumentTextIcon className="h-4 w-4" />
                                <span>GENERATE</span>
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokumen</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor / Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sumber</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categoryDocs.length > 0 ? categoryDocs.map((doc, index) => (
                                <tr key={doc.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="flex items-start space-x-2">
                                            <DocumentTextIcon className={`h-5 w-5 mt-0.5 shrink-0 ${
                                                doc.type === 'upload' ? 'text-orange-500' : 
                                                doc.type === 'nadine' ? 'text-blue-500' : 'text-green-500'
                                            }`} />
                                            <div>
                                                <span className="block font-bold text-gray-950">{doc.nama}</span>
                                                {doc.jenis && <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200 mt-1 mr-2">{doc.jenis}</span>}
                                                {doc.deskripsi && <p className="text-xs text-gray-500 mt-1 font-normal max-w-sm break-words">{doc.deskripsi}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doc.nomor ? <span className="block font-semibold text-gray-700">{doc.nomor}</span> : <span className="text-gray-400 font-light italic">-</span>}
                                        {doc.tanggal && <span className="text-xs text-gray-400 block mt-0.5">{doc.tanggal}</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                            doc.type === 'upload' ? 'bg-orange-100 text-orange-700' : 
                                            doc.type === 'nadine' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <button className="text-blue-500 hover:text-blue-700"><EyeIcon className="h-5 w-5" /></button>
                                        <button className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-700"><XIcon className="h-5 w-5" /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic text-sm">Belum ada dokumen yang tersedia.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
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
                <div className="max-w-6xl mx-auto">
                    {renderTable("1. Dokumen Permohonan & Pemanggilan", "permohonan")}
                    {renderTable("2. Dokumen Pendampingan & Data Dukung", "pendampingan", true)}
                    {renderTable("3. Dokumen Laporan", "laporan")}
                </div>
            </main>
        </div>
    );
};

export default DokumenPendampingan;

