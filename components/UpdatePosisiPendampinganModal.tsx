
import React, { useState, useEffect } from 'react';
import { PosisiUpdate, PendampinganRecord } from '../types';
import { XIcon, SearchIcon, CloudIcon, UserIcon, TrashIcon, CheckIcon } from './icons';
import TarikDataNadineModal from './TarikDataNadineModal';

interface UpdatePosisiModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (posisi: Omit<PosisiUpdate, 'id' | 'timestamp'>) => void;
    initialData?: PosisiUpdate | null;
    record: PendampinganRecord;
}

const POSISI_KASUS_OPTIONS = ['Penyelidikan', 'Penyidikan', 'Penuntutan', 'Sidang'];

const SimpleRichText: React.FC<{ value: string, onChange: (val: string) => void, label?: string, rows?: number, placeholder?: string }> = ({ value, onChange, label, rows = 6, placeholder = "Ketik di sini..." }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm">
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

const TwoColumnRow: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start border-b border-gray-100 py-4 last:border-0">
        <div className="md:col-span-4 self-center">
            <label className="block text-sm font-bold text-gray-600 font-sans uppercase tracking-wider text-[11px]">
                {label}
            </label>
        </div>
        <div className="md:col-span-8">
            {children}
        </div>
    </div>
);

const UpdatePosisiModal: React.FC<UpdatePosisiModalProps> = ({ isOpen, onClose, onSave, initialData, record }) => {
    const initialState = {
        suratTugas: '',
        tanggalSuratTugas: '',
        suratPemanggilan: '',
        pemanggil: '',
        terpanggil: '',
        agenda: '',
        tanggalAgenda: '',
        durasi: 60,
        posisiKasus: 'Penyelidikan',
        rincian: '',
        lokasi: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [isNadineModalOpen, setIsNadineModalOpen] = useState(false);
    const [nadineTarget, setNadineTarget] = useState<'st' | 'pemanggilan'>('st');
    const [isPihakModalOpen, setIsPihakModalOpen] = useState(false);
    const [pihakTarget, setPihakTarget] = useState<'pemanggil' | 'terpanggil'>('pemanggil');

    useEffect(() => {
        if (initialData) {
            setFormData({
                suratTugas: initialData.suratTugas || '',
                tanggalSuratTugas: initialData.tanggalSuratTugas || '',
                suratPemanggilan: initialData.suratPemanggilan || '',
                pemanggil: initialData.pemanggil || '',
                terpanggil: initialData.terpanggil || '',
                agenda: initialData.agenda || '',
                tanggalAgenda: initialData.tanggalAgenda || '',
                durasi: initialData.durasi || 60,
                posisiKasus: initialData.posisiKasus || 'Penyelidikan',
                rincian: initialData.rincian || '',
                lokasi: initialData.lokasi || ''
            });
        } else {
            setFormData(initialState);
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const val = name === 'durasi' ? parseInt(value, 10) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleOpenNadine = (target: 'st' | 'pemanggilan') => {
        setNadineTarget(target);
        setIsNadineModalOpen(true);
    };

    const handleOpenPihakSearch = (target: 'pemanggil' | 'terpanggil') => {
        setPihakTarget(target);
        setIsPihakModalOpen(true);
    };

    const pihakList = pihakTarget === 'pemanggil' 
        ? record.abstraksi?.pihakPemanggil || [] 
        : record.abstraksi?.pihakTerpanggil || [];

    if (!isOpen) return null;

    const title = initialData ? 'Edit Posisi Pendampingan' : 'Tambah Posisi Pendampingan';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
            <TarikDataNadineModal 
                isOpen={isNadineModalOpen}
                onClose={() => setIsNadineModalOpen(false)}
                onTarikData={(suratList) => {
                    if (suratList.length > 0) {
                        const surat = suratList[0];
                        if (nadineTarget === 'st') {
                            setFormData(prev => ({ ...prev, suratTugas: surat.nomorSurat, tanggalSuratTugas: surat.tanggal }));
                        } else {
                            setFormData(prev => ({ ...prev, suratPemanggilan: surat.nomorSurat }));
                        }
                    }
                    setIsNadineModalOpen(false);
                }}
            />

            {isPihakModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[110] flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
                        <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Pilih {pihakTarget === 'pemanggil' ? 'Pihak Pemanggil' : 'Pihak Terpanggil'}</h3>
                            <button onClick={() => setIsPihakModalOpen(false)}><XIcon className="h-5 w-5 text-gray-400" /></button>
                        </header>
                        <div className="max-h-[400px] overflow-y-auto">
                            {pihakList.length === 0 ? (
                                <div className="p-10 text-center text-gray-500 italic">Pihak data tidak ditemukan di Abstraksi.</div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {pihakList.map((p) => (
                                        <button 
                                            key={p.id}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, [pihakTarget]: p.nama }));
                                                setIsPihakModalOpen(false);
                                            }}
                                            className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors flex items-center justify-between group"
                                        >
                                            <div>
                                                <p className="font-bold text-gray-800 group-hover:text-blue-700">{p.nama}</p>
                                                <p className="text-xs text-gray-500">{p.jabatan}</p>
                                            </div>
                                            <SearchIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-500" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200">
                <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[95vh]">
                    <header className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                            <p className="text-sm text-gray-500 mt-1">Lengkapi rincian pelaksanaan pendampingan</p>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-all"><XIcon className="h-6 w-6 text-gray-400" /></button>
                    </header>

                    <main className="p-8 overflow-y-auto bg-white space-y-2">
                        <TwoColumnRow label="Nomor ST">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    name="suratTugas" 
                                    value={formData.suratTugas} 
                                    onChange={handleChange} 
                                    className="flex-1 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleOpenNadine('st')}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md active:scale-95 transition-all"
                                >
                                    <SearchIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </TwoColumnRow>

                        <TwoColumnRow label="Tanggal Surat Tugas">
                            <input 
                                type="date" 
                                name="tanggalSuratTugas" 
                                value={formData.tanggalSuratTugas} 
                                onChange={handleChange} 
                                className="w-full md:w-1/2 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white font-sans text-sm" 
                            />
                        </TwoColumnRow>

                        <TwoColumnRow label="Surat Pemanggilan">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    name="suratPemanggilan" 
                                    value={formData.suratPemanggilan} 
                                    onChange={handleChange} 
                                    className="flex-1 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleOpenNadine('pemanggilan')}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all"
                                    title="Cari di Nadine"
                                >
                                    <SearchIcon className="h-5 w-5" />
                                </button>
                                <button 
                                    type="button" 
                                    className="p-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 shadow-sm transition-all"
                                    title="Upload Dokumen"
                                >
                                    <CloudIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </TwoColumnRow>

                        <TwoColumnRow label="Pemanggil">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    name="pemanggil" 
                                    value={formData.pemanggil} 
                                    onChange={handleChange} 
                                    className="flex-1 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleOpenPihakSearch('pemanggil')}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all"
                                >
                                    <UserIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </TwoColumnRow>

                        <TwoColumnRow label="Terpanggil">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    name="terpanggil" 
                                    value={formData.terpanggil} 
                                    onChange={handleChange} 
                                    className="flex-1 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleOpenPihakSearch('terpanggil')}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all"
                                >
                                    <UserIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </TwoColumnRow>

                        <TwoColumnRow label="Agenda">
                            <input 
                                type="text" 
                                name="agenda" 
                                value={formData.agenda} 
                                onChange={handleChange} 
                                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" 
                            />
                        </TwoColumnRow>

                        <TwoColumnRow label="Tanggal Agenda">
                            <input 
                                type="date" 
                                name="tanggalAgenda" 
                                value={formData.tanggalAgenda} 
                                onChange={handleChange} 
                                className="w-full md:w-1/2 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white font-sans text-sm" 
                            />
                        </TwoColumnRow>

                        <TwoColumnRow label="Durasi (Menit)">
                            <div className="flex items-center gap-3">
                                <input 
                                    type="number" 
                                    name="durasi" 
                                    value={formData.durasi} 
                                    onChange={handleChange} 
                                    className="w-24 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white" 
                                />
                                <span className="text-sm text-gray-500 font-medium">Menit</span>
                            </div>
                        </TwoColumnRow>

                        <TwoColumnRow label="Posisi Kasus">
                            <div className="relative">
                                <select 
                                    name="posisiKasus" 
                                    value={POSISI_KASUS_OPTIONS.includes(formData.posisiKasus) ? formData.posisiKasus : 'custom'} 
                                    onChange={(e) => {
                                        if (e.target.value !== 'custom') {
                                            setFormData(prev => ({ ...prev, posisiKasus: e.target.value }));
                                        } else {
                                            setFormData(prev => ({ ...prev, posisiKasus: '' })); // trigger custom mode
                                        }
                                    }} 
                                    className="w-full md:w-1/2 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all appearance-none text-sm"
                                >
                                    {POSISI_KASUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    <option value="custom">Input Manual...</option>
                                </select>
                                {!POSISI_KASUS_OPTIONS.includes(formData.posisiKasus) && (
                                    <input 
                                        type="text"
                                        placeholder="Ketik posisi kasus..."
                                        value={formData.posisiKasus}
                                        className="mt-3 w-full p-2.5 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-sm"
                                        onChange={(e) => setFormData(prev => ({ ...prev, posisiKasus: e.target.value }))}
                                        autoFocus
                                    />
                                )}
                            </div>
                        </TwoColumnRow>

                        <div className="pt-6">
                            <SimpleRichText 
                                label="Keterangan Pemeriksaan / Rincian Pelaksanaan Pendampingan" 
                                value={formData.rincian} 
                                onChange={(val) => setFormData(prev => ({ ...prev, rincian: val }))}
                                rows={8}
                            />
                        </div>
                    </main>

                    <footer className="flex justify-end items-center p-6 bg-white border-t border-gray-100 space-x-3 rounded-b-lg">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-8 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all active:scale-95"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            className="px-8 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-xl shadow-green-200 transition-all active:scale-95 flex items-center"
                        >
                            <CheckIcon className="h-5 w-5 mr-2" />
                            Simpan Data
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default UpdatePosisiModal;

