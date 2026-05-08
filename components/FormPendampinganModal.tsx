import React, { useState, useEffect, useRef } from 'react';
import { PendampinganRecord, Permohonan, StatusPendampingan } from '../types';
import { XIcon, PlusIcon, TrashIcon, ArrowLeftIcon, CalendarIcon, SearchIcon, TagIcon, CheckIcon } from './icons';

interface FormPendampinganModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: PendampinganRecord) => void;
    initialData: PendampinganRecord | Permohonan | null;
}

const AGENCIES = ['Kejaksaan Agung', 'Kepolisian RI', 'KPK', 'Ombudsman', 'K/L', 'Lainnya'];
const STATUS_PENYELIDIKAN = ['Penyelidikan Tipidkor', 'Penyelidikan Umum', 'Penyelidikan Internal', 'Intelijen'];
const REGIONS = ['Sumatera Utara (Belawan-Medan)', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali', 'Sulawesi Selatan'];
const DOC_CATEGORIES = ['Permohonan Bantuan Hukum', 'Permohonan Permintaan Data', 'Pemanggilan', 'Laporan Hasil Penyelidikan'];

const TagInput: React.FC<{ 
    tags: string[], 
    setTags: (tags: string[]) => void, 
    placeholder?: string 
}> = ({ tags, setTags, placeholder = "Ketik dan tekan Enter..." }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = input.trim();
            if (value && !tags.includes(value)) {
                setTags([...tags, value]);
                setInput('');
            }
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                {tags.map((tag, idx) => (
                    <span key={idx} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-500 hover:text-blue-700">
                            <XIcon className="h-4 w-4" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 outline-none text-sm min-w-[120px]"
                />
            </div>
        </div>
    );
};

const FormPendampinganModal: React.FC<FormPendampinganModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Partial<PendampinganRecord>>({});

    useEffect(() => {
        if (isOpen && initialData) {
            const isPendampinganRecord = 'statusPendampingan' in initialData;
            const data: Partial<PendampinganRecord> = {
                ...initialData,
                statusPendampingan: isPendampinganRecord ? initialData.statusPendampingan : StatusPendampingan.AKTIF,
                abstraksi: isPendampinganRecord ? initialData.abstraksi : {
                    tahunMasuk: new Date(initialData.tanggal).getFullYear(),
                    nomorTiket: initialData.Nomor || initialData.id,
                    pokokPermasalahan: initialData.perihal,
                    keterangan: initialData.uraian,
                    statusPenyelidikan: '',
                    dasar: { nomorSuratPerintah: '', tanggalSurat: '' },
                    pic: { agency: '', unitSubdit: '' },
                    focus: [],
                    locus: { wilayah: '', spesifik: '' },
                    tempus: { dari: '', sampai: '' },
                    actor: '',
                    dolus: '',
                    modus: '',
                    informasiAwal: '',
                    penyelidik: [],
                    pihakTerpanggil: [],
                    administrasiDokumen: []
                }
            };
            
            // Ensure nested objects exist to avoid undefined errors
            if (data.abstraksi) {
                if (!data.abstraksi.dasar) data.abstraksi.dasar = { nomorSuratPerintah: '', tanggalSurat: '' };
                if (!data.abstraksi.pic) data.abstraksi.pic = { agency: '', unitSubdit: '' };
                if (!data.abstraksi.locus) data.abstraksi.locus = { wilayah: '', spesifik: '' };
                if (!data.abstraksi.tempus) data.abstraksi.tempus = { dari: '', sampai: '' };
                if (!data.abstraksi.focus) data.abstraksi.focus = [];
                if (!data.abstraksi.penyelidik) data.abstraksi.penyelidik = [];
                if (!data.abstraksi.pihakTerpanggil) data.abstraksi.pihakTerpanggil = [];
                if (!data.abstraksi.administrasiDokumen) data.abstraksi.administrasiDokumen = [];
            }

            setFormData(data);
        }
    }, [initialData, isOpen]);

    const handleAbstraksiChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            abstraksi: {
                ...prev.abstraksi,
                [field]: value
            }
        }));
    };

    const handleNestedChange = (parentField: string, childField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            abstraksi: {
                ...prev.abstraksi,
                [parentField]: {
                    ...(prev.abstraksi?.[parentField as keyof typeof prev.abstraksi] as any || {}),
                    [childField]: value
                }
            }
        }));
    };

    // Repeater handlers for Administrasi Dokumen
    const addDokumen = () => {
        const docs = [...(formData.abstraksi?.administrasiDokumen || [])];
        docs.push({ id: Math.random().toString(36).substr(2, 9), kategori: '', nomorSurat: '', tanggal: '', keterangan: '' });
        handleAbstraksiChange('administrasiDokumen', docs);
    };

    const removeDokumen = (id: string) => {
        const docs = (formData.abstraksi?.administrasiDokumen || []).filter(d => d.id !== id);
        handleAbstraksiChange('administrasiDokumen', docs);
    };

    const updateDokumen = (id: string, field: string, value: string) => {
        const docs = (formData.abstraksi?.administrasiDokumen || []).map(d => 
            d.id === id ? { ...d, [field]: value } : d
        );
        handleAbstraksiChange('administrasiDokumen', docs);
    };

    // Repeater handlers for Pihak Terpanggil
    const addPihak = () => {
        const pihak = [...(formData.abstraksi?.pihakTerpanggil || [])];
        pihak.push({ id: Math.random().toString(36).substr(2, 9), nama: '', jabatan: '', poinPenjelasan: [''] });
        handleAbstraksiChange('pihakTerpanggil', pihak);
    };

    const removePihak = (id: string) => {
        const pihak = (formData.abstraksi?.pihakTerpanggil || []).filter(p => p.id !== id);
        handleAbstraksiChange('pihakTerpanggil', pihak);
    };

    const updatePihak = (id: string, field: string, value: any) => {
        const pihak = (formData.abstraksi?.pihakTerpanggil || []).map(p => 
            p.id === id ? { ...p, [field]: value } : p
        );
        handleAbstraksiChange('pihakTerpanggil', pihak);
    };

    const addPoin = (pihakId: string) => {
        const pihakList = (formData.abstraksi?.pihakTerpanggil || []).map(p => {
            if (p.id === pihakId) {
                return { ...p, poinPenjelasan: [...p.poinPenjelasan, ''] };
            }
            return p;
        });
        handleAbstraksiChange('pihakTerpanggil', pihakList);
    };

    const updatePoin = (pihakId: string, idx: number, value: string) => {
        const pihakList = (formData.abstraksi?.pihakTerpanggil || []).map(p => {
            if (p.id === pihakId) {
                const newPoin = [...p.poinPenjelasan];
                newPoin[idx] = value;
                return { ...p, poinPenjelasan: newPoin };
            }
            return p;
        });
        handleAbstraksiChange('pihakTerpanggil', pihakList);
    };

    const removePoin = (pihakId: string, idx: number) => {
        const pihakList = (formData.abstraksi?.pihakTerpanggil || []).map(p => {
            if (p.id === pihakId) {
                return { ...p, poinPenjelasan: p.poinPenjelasan.filter((_, i) => i !== idx) };
            }
            return p;
        });
        handleAbstraksiChange('pihakTerpanggil', pihakList);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as PendampinganRecord);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col overflow-hidden">
            {/* Sticky Top Bar */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={onClose}
                        className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-1" />
                        Back to Dashboard
                    </button>
                    <div className="h-6 w-[1px] bg-gray-300"></div>
                    <h1 className="text-xl font-bold text-gray-800">Form Perekaman Data Penyelidikan</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => {/* Save Draft logic */}}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-colors flex items-center"
                    >
                        <CheckIcon className="h-5 w-5 mr-1 text-white" />
                        Submit Case Data
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto bg-gray-50 pb-20">
                <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
                    
                    {/* Card 1: Informasi Utama Perkara */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800">⚖️ Card 1: Informasi Utama Perkara</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                                    <select 
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all"
                                        value={formData.abstraksi?.statusPenyelidikan || ''}
                                        onChange={(e) => handleAbstraksiChange('statusPenyelidikan', e.target.value)}
                                    >
                                        <option value="">Pilih Status</option>
                                        {STATUS_PENYELIDIKAN.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Surat Perintah (Dasar)</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g., PRIN-6/F.2..."
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={formData.abstraksi?.dasar?.nomorSuratPerintah || ''}
                                            onChange={(e) => handleNestedChange('dasar', 'nomorSuratPerintah', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Surat</label>
                                        <input 
                                            type="date"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={formData.abstraksi?.dasar?.tanggalSurat || ''}
                                            onChange={(e) => handleNestedChange('dasar', 'tanggalSurat', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">PIC (Agency / Instansi)</label>
                                        <input 
                                            list="agencies_list"
                                            placeholder="e.g., Kejaksaan Agung"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={formData.abstraksi?.pic?.agency || ''}
                                            onChange={(e) => handleNestedChange('pic', 'agency', e.target.value)}
                                        />
                                        <datalist id="agencies_list">
                                            {AGENCIES.map(a => <option key={a} value={a} />)}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Detail Unit / Subdit</label>
                                        <input 
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={formData.abstraksi?.pic?.unitSubdit || ''}
                                            onChange={(e) => handleNestedChange('pic', 'unitSubdit', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Focus (Fokus Penyelidikan)</label>
                                    <TagInput 
                                        tags={formData.abstraksi?.focus || []} 
                                        setTags={(tags) => handleAbstraksiChange('focus', tags)} 
                                        placeholder="Tambah fokus penyelidikan..."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">e.g., Penurunan Pajak, Penyalahgunaan Izin</p>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Locus (Provinsi/Kota)</label>
                                        <select 
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all"
                                            value={formData.abstraksi?.locus?.wilayah || ''}
                                            onChange={(e) => handleNestedChange('locus', 'wilayah', e.target.value)}
                                        >
                                            <option value="">Pilih Wilayah</option>
                                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi Spesifik</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g., Belawan-Medan"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={formData.abstraksi?.locus?.spesifik || ''}
                                            onChange={(e) => handleNestedChange('locus', 'spesifik', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tempus (Waktu Kejadian)</label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Dari</span>
                                            <input 
                                                type="date"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                value={formData.abstraksi?.tempus?.dari || ''}
                                                onChange={(e) => handleNestedChange('tempus', 'dari', e.target.value)}
                                            />
                                        </div>
                                        <div className="pt-5 text-gray-400">to</div>
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Sampai</span>
                                            <input 
                                                type="date"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                value={formData.abstraksi?.tempus?.sampai || ''}
                                                onChange={(e) => handleNestedChange('tempus', 'sampai', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Card 2: Analisis & Anatomi Kasus */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800">⚖️ Card 2: Analisis & Anatomi Kasus</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Aktor (Terduga / Pihak Terlibat)</label>
                                <input 
                                    type="text"
                                    placeholder="e.g., PT. Toba Pulp Lestari (Industri)"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={formData.abstraksi?.actor || ''}
                                    onChange={(e) => handleAbstraksiChange('actor', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Dolus (Niat Jahat / Unsur Kesengajaan)</label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                                    <div className="bg-gray-50 border-b border-gray-300 px-3 py-1 flex space-x-2">
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded font-bold text-xs">B</button>
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded italic text-xs">I</button>
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded underline text-xs">U</button>
                                    </div>
                                    <textarea 
                                        rows={4}
                                        placeholder="Masukkan detail dolus, atau ketik 'Masih belum diketahui'..."
                                        className="w-full p-3 outline-none min-h-[120px] text-sm"
                                        value={formData.abstraksi?.dolus || ''}
                                        onChange={(e) => handleAbstraksiChange('dolus', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Modus (Cara Operandi)</label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                                    <div className="bg-gray-50 border-b border-gray-300 px-3 py-1 flex space-x-2">
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded font-bold text-xs">B</button>
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded italic text-xs">I</button>
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded underline text-xs">U</button>
                                    </div>
                                    <textarea 
                                        rows={4}
                                        placeholder="Masukkan detail cara operandi..."
                                        className="w-full p-3 outline-none min-h-[120px] text-sm"
                                        value={formData.abstraksi?.modus || ''}
                                        onChange={(e) => handleAbstraksiChange('modus', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Card 3: Administrasi Surat & Dokumen */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">📄 Card 3: Administrasi Surat & Dokumen</h2>
                            <button 
                                type="button"
                                onClick={addDokumen}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-sm"
                            >
                                <PlusIcon className="h-4 w-4 mr-1 text-white" />
                                Tambah Dokumen
                            </button>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Kategori</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Nomor Surat</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Keterangan</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {formData.abstraksi?.administrasiDokumen?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">Belum ada dokumen. Klik "Tambah Dokumen" untuk memulai.</td>
                                        </tr>
                                    ) : (
                                        formData.abstraksi?.administrasiDokumen?.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-3">
                                                    <select 
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm bg-white"
                                                        value={doc.kategori}
                                                        onChange={(e) => updateDokumen(doc.id, 'kategori', e.target.value)}
                                                    >
                                                        <option value="">Pilih</option>
                                                        {DOC_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <input 
                                                        type="text" 
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                                                        value={doc.nomorSurat}
                                                        onChange={(e) => updateDokumen(doc.id, 'nomorSurat', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-6 py-3">
                                                    <input 
                                                        type="date" 
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                                                        value={doc.tanggal}
                                                        onChange={(e) => updateDokumen(doc.id, 'tanggal', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-6 py-3">
                                                    <input 
                                                        type="text" 
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                                                        value={doc.keterangan}
                                                        onChange={(e) => updateDokumen(doc.id, 'keterangan', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeDokumen(doc.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Card 4: Detail Informasi Penyelidikan */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800">🕵️ Card 4: Detail Informasi Penyelidikan</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Informasi Awal (Background Information)</label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                                    <div className="bg-gray-50 border-b border-gray-300 px-3 py-1 flex space-x-2">
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded font-bold text-xs underline">T</button>
                                        <div className="h-4 w-[1px] bg-gray-400 mt-1"></div>
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">List (Bullet)</button>
                                    </div>
                                    <textarea 
                                        rows={6}
                                        placeholder="a. Banjir dan longsor Sumatera&#10;b. Satgas Penertiban..."
                                        className="w-full p-3 outline-none min-h-[160px] text-sm leading-relaxed"
                                        value={formData.abstraksi?.informasiAwal || ''}
                                        onChange={(e) => handleAbstraksiChange('informasiAwal', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Penyelidik (Investigators Assigned)</label>
                                <TagInput 
                                    tags={formData.abstraksi?.penyelidik || []} 
                                    setTags={(tags) => handleAbstraksiChange('penyelidik', tags)} 
                                    placeholder="Tambah penyelidik (ketik nama dan Enter)..."
                                />
                                <p className="mt-1 text-xs text-gray-500">Ketik nama seperti "Dimas", "Arya", kemudian tekan Enter.</p>
                            </div>
                        </div>
                    </section>

                    {/* Card 5: Pihak Terpanggil & Hasil Pemeriksaan */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">🗣️ Card 5: Pihak Terpanggil & Hasil Pemeriksaan</h2>
                            <button 
                                type="button"
                                onClick={addPihak}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-sm"
                            >
                                <PlusIcon className="h-4 w-4 mr-1 text-white" />
                                Tambah Pihak Terpanggil
                            </button>
                        </div>
                        <div className="p-6 space-y-8">
                            {formData.abstraksi?.pihakTerpanggil?.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                    <p className="text-gray-500">Belum ada pihak terpanggil.</p>
                                </div>
                            ) : (
                                formData.abstraksi?.pihakTerpanggil?.map((pihak, pidx) => (
                                    <div key={pihak.id} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden relative">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                            <h3 className="text-sm font-bold text-blue-700">Terpanggil {pidx + 1}</h3>
                                            <button 
                                                type="button" 
                                                onClick={() => removePihak(pihak.id)}
                                                className="flex items-center text-xs text-red-600 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                            >
                                                <TrashIcon className="h-3 w-3 mr-1" />
                                                Hapus
                                            </button>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-600 mb-1">Nama Pihak / Instansi</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                                        placeholder="e.g., Muhammad Arya Priastama Putra"
                                                        value={pihak.nama}
                                                        onChange={(e) => updatePihak(pihak.id, 'nama', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-600 mb-1">Jabatan / Keterangan Tambahan</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                                        placeholder="e.g., PBC-PPDE Belawan / 207"
                                                        value={pihak.jabatan}
                                                        onChange={(e) => updatePihak(pihak.id, 'jabatan', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2">Poin Penjelasan / Hasil Pemeriksaan</label>
                                                <div className="space-y-3">
                                                    {pihak.poinPenjelasan.map((poin, poIdx) => (
                                                        <div key={poIdx} className="flex space-x-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold mt-2">
                                                                {poIdx + 1}
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                                                placeholder="Masukkan penjelasan..."
                                                                value={poin}
                                                                onChange={(e) => updatePoin(pihak.id, poIdx, e.target.value)}
                                                            />
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removePoin(pihak.id, poIdx)}
                                                                className="p-1 text-gray-400 hover:text-red-500 mt-1"
                                                            >
                                                                <XIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button 
                                                        type="button"
                                                        onClick={() => addPoin(pihak.id)}
                                                        className="ml-8 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center"
                                                    >
                                                        <PlusIcon className="h-3 w-3 mr-1" />
                                                        Tambah Poin
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {/* Bottom Safe Area Spacer if needed or a sticky footer */}
        </div>
    );
};

export default FormPendampinganModal;
