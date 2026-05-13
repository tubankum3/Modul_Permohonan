import React, { useState, useEffect } from 'react';
import { PendampinganRecord, Permohonan, StatusPendampingan, JenisPermohonan } from '../types';
import { XIcon, PlusIcon, TrashIcon, ArrowLeftIcon, SearchIcon, CheckIcon } from './icons';
import TarikDataNadineModal from './TarikDataNadineModal';

interface FormPendampinganModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: PendampinganRecord) => void;
    initialData: PendampinganRecord | Permohonan | null;
    showNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const UNIT_KEMENKEU = ['Sekretariat Jenderal', 'Direktorat Jenderal Pajak', 'Direktorat Jenderal Bea dan Cukai', 'Direktorat Jenderal Perbendaharaan', 'Direktorat Jenderal Kekayaan Negara', 'Direktorat Jenderal Perimbangan Keuangan', 'Direktorat Jenderal Pengelolaan Pembiayaan dan Risiko', 'Inspektorat Jenderal', 'Badan Kebijakan Fiskal', 'Badan Pendidikan dan Pelatihan Keuangan'];
const UNIT_PEMANGGIL_OPTIONS = ['KPK', 'Kejaksaan Agung', 'Kepolisian RI', 'Pengadilan Negeri', 'Pengadilan Tinggi', 'Mahkamah Agung', 'Ombudsman', 'Kementerian/Lembaga Lain', 'Instansi Lainnya'];
const WILAYAH_OPTIONS = ['Seluruh Indonesia', 'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku', 'Maluku Utara', 'Papua Barat', 'Papua'];

const SimpleRichText: React.FC<{ value: string, onChange: (val: string) => void, label?: string, rows?: number, placeholder?: string }> = ({ value, onChange, label, rows = 6, placeholder = "Ketik di sini..." }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                <div className="bg-gray-50 border-b border-gray-300 px-3 py-1.5 flex gap-2">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs font-bold">B</button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs italic">I</button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs underline">U</button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1 self-center"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">List</button>
                </div>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    className="w-full p-3 focus:outline-none text-sm font-sans leading-relaxed"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

const FormPendampinganModal: React.FC<FormPendampinganModalProps> = ({ isOpen, onClose, onSave, initialData, showNotification }) => {
    const [formData, setFormData] = useState<Partial<PendampinganRecord>>({});
    const [activeTab, setActiveTab] = useState<'informasi' | 'pihak' | 'analisa'>('informasi');
    const [isNadineModalOpen, setIsNadineModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            const isPendampinganRecord = 'statusPendampingan' in initialData;
            
            const prefilledRincian = `1. Dasar\n2. Focus\n3. Locus\n4. Tempus\n5. Dolus\n6. Modus\n7. Aktor`;

            const data: Partial<PendampinganRecord> = {
                ...initialData,
                statusPendampingan: isPendampinganRecord ? initialData.statusPendampingan : StatusPendampingan.AKTIF,
                abstraksi: isPendampinganRecord ? initialData.abstraksi : {
                    tahunMasuk: new Date(initialData.tanggal).getFullYear(),
                    nomorTiket: initialData.Nomor || initialData.id,
                    pokokPermasalahan: prefilledRincian,
                    keterangan: initialData.uraian,
                    pihakTerpanggil: [],
                    pihakPemanggil: [],
                    analisaKasus: {
                        informasiAwal: '',
                        informasiPihakTerpanggil: []
                    }
                }
            };
            
            if (data.abstraksi) {
                if (!data.abstraksi.pihakTerpanggil) data.abstraksi.pihakTerpanggil = [];
                if (!data.abstraksi.pihakPemanggil) data.abstraksi.pihakPemanggil = [];
                if (!data.abstraksi.analisaKasus) data.abstraksi.analisaKasus = {
                    informasiAwal: '',
                    informasiPihakTerpanggil: []
                };
                if (!data.abstraksi.analisaKasus.informasiPihakTerpanggil) {
                    data.abstraksi.analisaKasus.informasiPihakTerpanggil = [];
                }
                if (!data.abstraksi.pokokPermasalahan) data.abstraksi.pokokPermasalahan = prefilledRincian;
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

    const handleAnalisaChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            abstraksi: {
                ...prev.abstraksi,
                analisaKasus: {
                    ...prev.abstraksi?.analisaKasus,
                    [field]: value
                }
            }
        }));
    };

    const addPihak = (type: 'pihakTerpanggil' | 'pihakPemanggil') => {
        const list = [...(formData.abstraksi?.[type] || [])];
        list.push({ id: Math.random().toString(36).substr(2, 9), nama: '', jabatan: '' });
        handleAbstraksiChange(type, list);
    };

    const removePihak = (type: 'pihakTerpanggil' | 'pihakPemanggil', id: string) => {
        const list = (formData.abstraksi?.[type] || []).filter((p: any) => p.id !== id);
        handleAbstraksiChange(type, list);
    };

    const updatePihak = (type: 'pihakTerpanggil' | 'pihakPemanggil', id: string, field: string, value: any) => {
        const list = (formData.abstraksi?.[type] || []).map((p: any) => 
            p.id === id ? { ...p, [field]: value } : p
        );
        handleAbstraksiChange(type, list);
    };

    const handleSave = () => {
        if (!formData.abstraksi?.nomorTiket) {
            if (showNotification) {
                showNotification('Nomor Tiket wajib diisi.', 'error');
            } else {
                alert('Nomor Tiket wajib diisi.');
            }
            return;
        }
        if (!formData.perihal) {
            if (showNotification) {
                showNotification('Perihal wajib diisi.', 'error');
            } else {
                alert('Perihal wajib diisi.');
            }
            return;
        }
        onSave(formData as PendampinganRecord);
    };

    const TabButton = ({ tab, label }: { tab: 'informasi' | 'pihak' | 'analisa', label: string }) => (
        <button 
            type="button" 
            onClick={() => setActiveTab(tab)} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab ? 'bg-white text-blue-600 border-gray-200 border-t border-x shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : 'bg-blue-500 text-white hover:bg-blue-400'}`}
        >
            {label}
        </button>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col overflow-hidden">
            <TarikDataNadineModal 
                isOpen={isNadineModalOpen} 
                onClose={() => setIsNadineModalOpen(false)}
                onTarikData={(suratList) => {
                    if (suratList.length > 0) {
                        const surat = suratList[0];
                        handleAbstraksiChange('nomorTiket', surat.nomorSurat);
                        handleAbstraksiChange('unitPemohon', surat.unitPengirim);
                    }
                    setIsNadineModalOpen(false);
                }}
            />

            <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start">
                <button 
                    onClick={onClose} 
                    className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1 mr-4 shadow-sm transition-all"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        {initialData && 'statusPendampingan' in initialData ? 'Edit Data Pendampingan' : 'Rekam Pendampingan Baru'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <span className="font-medium text-blue-600 mr-2">{formData.abstraksi?.nomorTiket || 'New Ticket'}</span>
                        {formData.perihal && <span className="opacity-50">|</span>}
                        {formData.perihal && <span className="ml-2 truncate max-w-md">{formData.perihal}</span>}
                    </p>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-blue-600 rounded-t-lg px-4 pt-2 flex gap-1">
                        <TabButton tab="informasi" label="Informasi Umum" />
                        <TabButton tab="pihak" label="Para Pihak" />
                        <TabButton tab="analisa" label="Analisa Kasus" />
                    </div>
                    
                    <div className="bg-white p-8 rounded-b-lg border-x border-b border-gray-200 shadow-xl min-h-[60vh]">
                        {activeTab === 'informasi' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans uppercase tracking-wider text-[11px]">Tahun Masuk</label>
                                            <input 
                                                type="number" 
                                                placeholder="2026"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                                                value={formData.abstraksi?.tahunMasuk || ''}
                                                onChange={(e) => handleAbstraksiChange('tahunMasuk', parseInt(e.target.value))}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans uppercase tracking-wider text-[11px]">Nomor Tiket / Surat Permohonan</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                                                    value={formData.abstraksi?.nomorTiket || ''}
                                                    onChange={(e) => handleAbstraksiChange('nomorTiket', e.target.value)}
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setIsNadineModalOpen(true)}
                                                    className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center shadow-md active:scale-95"
                                                    title="Tarik Data Nadine"
                                                >
                                                    <SearchIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans uppercase tracking-wider text-[11px]">Unit Pemohon</label>
                                            <select 
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all shadow-sm"
                                                value={formData.abstraksi?.unitPemohon || ''}
                                                onChange={(e) => handleAbstraksiChange('unitPemohon', e.target.value)}
                                            >
                                                <option value="">Pilih Unit Kemenkeu</option>
                                                {UNIT_KEMENKEU.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans uppercase tracking-wider text-[11px]">Unit Pemanggil</label>
                                            <select 
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all shadow-sm"
                                                value={formData.abstraksi?.unitPemanggil || ''}
                                                onChange={(e) => handleAbstraksiChange('unitPemanggil', e.target.value)}
                                            >
                                                <option value="">Pilih Unit Pemanggil</option>
                                                {UNIT_PEMANGGIL_OPTIONS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans uppercase tracking-wider text-[11px]">Wilayah</label>
                                            <select 
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all shadow-sm"
                                                value={formData.abstraksi?.wilayah || ''}
                                                onChange={(e) => handleAbstraksiChange('wilayah', e.target.value)}
                                            >
                                                <option value="">Pilih Wilayah</option>
                                                {WILAYAH_OPTIONS.map(wilayah => <option key={wilayah} value={wilayah}>{wilayah}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <SimpleRichText 
                                        label="Rincian Pokok Permasalahan" 
                                        value={formData.abstraksi?.pokokPermasalahan || ''} 
                                        onChange={(val) => handleAbstraksiChange('pokokPermasalahan', val)}
                                        rows={10}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'pihak' && (
                            <div className="space-y-12 animate-in fade-in duration-300">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                            <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                                            Pihak Terpanggil
                                        </h3>
                                        <button 
                                            type="button" 
                                            onClick={() => addPihak('pihakTerpanggil')}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-md active:scale-95"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            PIHAK
                                        </button>
                                    </div>
                                    <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-12 text-center">No</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Pihak / Instansi</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Jabatan / Keterangan</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center w-20">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {(!formData.abstraksi?.pihakTerpanggil || formData.abstraksi.pihakTerpanggil.length === 0) ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic bg-gray-50/50">Belum ada pihak terpanggil terdaftar.</td>
                                                    </tr>
                                                ) : (
                                                    formData.abstraksi.pihakTerpanggil.map((p, idx) => (
                                                        <tr key={p.id} className="hover:bg-blue-50/30 transition-all group">
                                                            <td className="px-6 py-4 text-center text-gray-400 font-mono text-xs">{idx + 1}</td>
                                                            <td className="px-6 py-4">
                                                                <input 
                                                                    type="text" 
                                                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-sm font-medium text-gray-800"
                                                                    value={p.nama}
                                                                    onChange={(e) => updatePihak('pihakTerpanggil', p.id, 'nama', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input 
                                                                    type="text" 
                                                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-sm text-gray-600"
                                                                    value={p.jabatan}
                                                                    onChange={(e) => updatePihak('pihakTerpanggil', p.id, 'jabatan', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => removePihak('pihakTerpanggil', p.id)}
                                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                            <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                                            Pihak Pemanggil
                                        </h3>
                                        <button 
                                            type="button" 
                                            onClick={() => addPihak('pihakPemanggil')}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-md active:scale-95"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            PIHAK
                                        </button>
                                    </div>
                                    <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-12 text-center">No</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Pihak</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Jabatan / Keterangan</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center w-20">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {(!formData.abstraksi?.pihakPemanggil || formData.abstraksi.pihakPemanggil.length === 0) ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic bg-gray-50/50">Belum ada pihak pemanggil terdaftar.</td>
                                                    </tr>
                                                ) : (
                                                    formData.abstraksi.pihakPemanggil.map((p: any, idx: number) => (
                                                        <tr key={p.id} className="hover:bg-blue-50/30 transition-all group">
                                                            <td className="px-6 py-4 text-center text-gray-400 font-mono text-xs">{idx + 1}</td>
                                                            <td className="px-6 py-4">
                                                                <input 
                                                                    type="text" 
                                                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-sm font-medium text-gray-800"
                                                                    value={p.nama}
                                                                    onChange={(e) => updatePihak('pihakPemanggil', p.id, 'nama', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input 
                                                                    type="text" 
                                                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-sm text-gray-600"
                                                                    value={p.jabatan}
                                                                    onChange={(e) => updatePihak('pihakPemanggil', p.id, 'jabatan', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => removePihak('pihakPemanggil', p.id)}
                                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                                </div>
                            </div>
                        )}

                        {activeTab === 'analisa' && (
                            <div className="space-y-10 animate-in fade-in duration-300">
                                <div>
                                    <SimpleRichText 
                                        label="Informasi Awal" 
                                        value={formData.abstraksi?.analisaKasus?.informasiAwal || ''} 
                                        onChange={(val) => handleAnalisaChange('informasiAwal', val)}
                                        placeholder="Masukkan background informasi awal di sini..."
                                    />
                                </div>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                            <span className="w-1.5 h-6 bg-orange-500 rounded-full mr-3 border-none"></span>
                                            Informasi Pihak Terpanggil
                                        </h3>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                const list = [...(formData.abstraksi?.analisaKasus?.informasiPihakTerpanggil || [])];
                                                list.push({ id: Math.random().toString(36).substr(2, 9), pihakId: '', keterangan: '' });
                                                handleAnalisaChange('informasiPihakTerpanggil', list);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-md active:scale-95 uppercase tracking-wider"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Keterangan Terpanggil
                                        </button>
                                    </div>
                                    
                                    {(!formData.abstraksi?.analisaKasus?.informasiPihakTerpanggil || formData.abstraksi.analisaKasus.informasiPihakTerpanggil.length === 0) ? (
                                        <div className="p-12 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-gray-500 italic">
                                            Klik tombol "+ Keterangan Terpanggil" untuk menambahkan informasi pemeriksaan.
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {formData.abstraksi.analisaKasus.informasiPihakTerpanggil.map((info: any, idx: number) => (
                                                <div key={info.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                                                        <div className="flex-1 max-w-sm">
                                                            <select 
                                                                className="w-full p-2 bg-white border border-gray-300 rounded text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                                                                value={info.pihakId}
                                                                onChange={(e) => {
                                                                    const list = [...(formData.abstraksi?.analisaKasus?.informasiPihakTerpanggil || [])];
                                                                    list[idx] = { ...info, pihakId: e.target.value };
                                                                    handleAnalisaChange('informasiPihakTerpanggil', list);
                                                                }}
                                                            >
                                                                <option value="">-- Pilih Pihak Terpanggil --</option>
                                                                {(formData.abstraksi?.pihakTerpanggil || []).map((p: any) => (
                                                                    <option key={p.id} value={p.id}>{p.nama || 'Tanpa Nama'} {p.jabatan ? `(${p.jabatan})` : ''}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const list = formData.abstraksi?.analisaKasus?.informasiPihakTerpanggil?.filter((x: any) => x.id !== info.id);
                                                                handleAnalisaChange('informasiPihakTerpanggil', list);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <div className="p-6">
                                                        <SimpleRichText 
                                                            value={info.keterangan || ''}
                                                            onChange={(val) => {
                                                                const list = [...(formData.abstraksi?.analisaKasus?.informasiPihakTerpanggil || [])];
                                                                list[idx] = { ...info, keterangan: val };
                                                                handleAnalisaChange('informasiPihakTerpanggil', list);
                                                            }}
                                                            placeholder="Masukkan detail keterangan atau hasil pemeriksaan pihak terpanggil..."
                                                            rows={6}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="flex-shrink-0 flex justify-end items-center p-4 bg-white border-t border-gray-200 space-x-3">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-8 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                >
                    Batal
                </button>
                <button 
                    type="button" 
                    onClick={handleSave} 
                    className="px-8 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg transition-all active:scale-95 flex items-center"
                >
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Simpan Perubahan
                </button>
            </footer>
        </div>
    );
};

export default FormPendampinganModal;
