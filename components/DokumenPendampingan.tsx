
import React, { useState } from 'react';
import { XIcon, UploadIcon, DocumentTextIcon, UserIcon, CloudIcon, CloudDownloadIcon, CheckIcon, EyeIcon, DownloadIcon, CloudArrowDownIcon, ArrowLeftIcon } from './icons';
import { PendampinganRecord, PosisiUpdate, SuratMasukNadine, JenisPermohonan, View } from '../types';
import TarikDataNadineModal from './TarikDataNadineModal';

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
    type: 'upload' | 'nadine' | 'generate';
    category: DokumenCategory;
}

const DokumenPendampingan: React.FC<DokumenPendampinganProps> = ({ record, posisi, onNavigate }) => {
    const [isNadineOpen, setIsNadineOpen] = useState(false);
    const [nadineTarget, setNadineTarget] = useState<string>('');
    
    // Mock data for existing documents
    const [documents, setDocuments] = useState<DokumenItem[]>([
        { id: '1', nama: 'Surat Permohonan.pdf', nomor: record.Nomor, tanggal: record.tanggal, type: 'upload', category: 'permohonan' },
        { id: '2', nama: 'ST-' + (posisi?.suratTugas || '....') + '.docx', type: 'generate', category: 'pendampingan' }
    ]);

    const handleUpload = (category: DokumenCategory) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const newDoc: DokumenItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    nama: file.name,
                    type: 'upload',
                    category: category,
                    tanggal: new Date().toISOString().split('T')[0]
                };
                setDocuments([...documents, newDoc]);
            }
        };
        input.click();
    };

    const handleGetFromNadine = (category: DokumenCategory) => {
        setNadineTarget(category);
        setIsNadineOpen(true);
    };

    const handleNadineData = (data: SuratMasukNadine, jenis: JenisPermohonan) => {
        const newDoc: DokumenItem = {
            id: Math.random().toString(36).substr(2, 9),
            nama: data.perihal || 'Dokumen Nadine',
            nomor: data.nomorSurat,
            tanggal: data.tanggal,
            type: 'nadine',
            category: nadineTarget as DokumenCategory
        };
        setDocuments([...documents, newDoc]);
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
                            onClick={() => handleUpload(category)}
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
                                        <div className="flex items-center space-x-2">
                                            <DocumentTextIcon className={`h-5 w-5 ${
                                                doc.type === 'upload' ? 'text-orange-500' : 
                                                doc.type === 'nadine' ? 'text-blue-500' : 'text-green-500'
                                            }`} />
                                            <span>{doc.nama}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doc.nomor && <span className="block font-medium text-gray-700">{doc.nomor}</span>}
                                        {doc.tanggal && <span className="text-xs">{doc.tanggal}</span>}
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

