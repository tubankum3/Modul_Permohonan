import React, { useState, useEffect } from 'react';
import { PerkaraRecord, Pihak, Tuntutan, TuntutanAkhir, Putusan, Majelis, View } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, XIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import Breadcrumb from './Breadcrumb';

const JENIS_OBJEK_TUNTUTAN_OPTIONS = ['Tanah', 'Bangunan', 'Uang/Dana', 'Aset Tetap/BMN', 'Aset Lainnya', 'Sita Jaminan', 'Lain-lain'];
const JENIS_TUNTUTAN_OPTIONS = ['Materiil', 'Immateriil', 'Dwangsom'];
const SATUAN_MATA_UANG_OPTIONS = ['IDR - Rupiah', 'USD - US Dollar', 'EUR - Euro', 'JPY - Yen', 'Lainnya'];

const PREFILL_ANALISA = `1. Formil (Prosedur): 
2. Materiil (Substansi): 
3. Strategi Bantahan dan Penanganan`;

const PREFILL_RISIKO = `1. Risiko
2. Mitigasi`;

const SimpleRichText: React.FC<{ value: string, onChange: (val: string) => void, label?: string, rows?: number }> = ({ value, onChange, label, rows = 6 }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white">
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
                    className="w-full p-3 focus:outline-none text-sm font-sans"
                    placeholder="Ketik di sini..."
                />
            </div>
        </div>
    );
};

const referenceTags = ['Strategis', 'Non-Strategis', 'Penting', 'Perdata', 'Pidana', 'TUN', 'Penting Mendesak', 'Keuangan Negara'];

const TagInput: React.FC<{ tags: string[], setTags: (tags: string[]) => void }> = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            const filteredSuggestions = referenceTags.filter(
                tag => tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
        }
        setInputValue('');
        setSuggestions([]);
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        }
        if (e.key === 'Backspace' && !inputValue) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="relative">
            <div className="w-full p-2 border border-gray-300 rounded-md flex flex-wrap items-center gap-2">
                {tags.map((tag, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full flex items-center">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-blue-500 hover:text-blue-700">
                            <XIcon className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-transparent focus:outline-none"
                    placeholder="Tambah tag..."
                />
            </div>
            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => addTag(suggestion)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Shared Modal for Pihak, Tuntutan, Putusan
const CrudModal: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    onSave: (data: any) => void, 
    title: string, 
    initialData: any, 
    fields: { name: string, label: string, type: string, options?: string[] }[],
    extraSection?: React.ReactNode
}> = ({ isOpen, onClose, onSave, title, initialData, fields, extraSection }) => {
    const [formData, setFormData] = useState(initialData);
    useEffect(() => { setFormData(initialData) }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleRichChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const renderField = (field: { name: string, label: string, type: string, options?: string[] }) => {
        return (
            <div key={field.name} className={field.type === 'textarea' || field.type === 'richtext' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                    <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" />
                ) : field.type === 'richtext' ? (
                    <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                        <div className="bg-gray-50 border-b border-gray-300 px-3 py-1 flex gap-2">
                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs font-bold">B</button>
                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs italic">I</button>
                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs underline">U</button>
                        </div>
                        <textarea 
                            name={field.name} 
                            value={formData[field.name] || ''} 
                            onChange={handleChange} 
                            rows={5} 
                            className="w-full p-2 outline-none resize-none text-sm" 
                            placeholder={`Masukan ${field.label.toLowerCase()}...`}
                        />
                    </div>
                ) : field.type === 'select' ? (
                    <select name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">Pilih {field.label}</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : field.type === 'file' ? (
                    <div className="flex items-center gap-2">
                        <input 
                            type="file" 
                            id={`file-${field.name}`}
                            className="hidden" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleRichChange(field.name, file.name);
                            }}
                        />
                        <label 
                            htmlFor={`file-${field.name}`}
                            className="flex-1 p-2 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 text-sm text-gray-600"
                        >
                            {formData[field.name] || 'Pilih Berkas atau Tarik ke sini'}
                        </label>
                        {formData[field.name] && (
                            <button 
                                type="button" 
                                onClick={() => handleRichChange(field.name, '')}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            >
                                <XIcon className="h-4 w-4"/>
                            </button>
                        )}
                    </div>
                ) : (
                    <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                )}
            </div>
        );
    };

    // For Putusan, we inject extraSection between Amar and Keterangan
    const isPutusan = title.toLowerCase().includes('putusan');
    const amarIndex = fields.findIndex(f => f.name === 'amar');
    const firstHalf = isPutusan && amarIndex !== -1 ? fields.slice(0, amarIndex + 1) : fields;
    const secondHalf = isPutusan && amarIndex !== -1 ? fields.slice(amarIndex + 1) : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <header className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><XIcon className="h-5 w-5" /></button>
                </header>
                <main className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {firstHalf.map(renderField)}
                    </div>
                    
                    {isPutusan && extraSection && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                           {React.cloneElement(extraSection as React.ReactElement<any>, { 
                               data: formData.susunanMajelis || [],
                               onChange: (newList: any[]) => setFormData((prev: any) => ({ ...prev, susunanMajelis: newList }))
                           })}
                        </div>
                    )}

                    {isPutusan && secondHalf.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                            {secondHalf.map(renderField)}
                        </div>
                    )}

                    {!isPutusan && extraSection && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                           {React.cloneElement(extraSection as React.ReactElement<any>, { 
                               data: formData.susunanMajelis || [],
                               onChange: (newList: any[]) => setFormData((prev: any) => ({ ...prev, susunanMajelis: newList }))
                           })}
                        </div>
                    )}
                </main>
                <footer className="flex justify-end items-center p-4 bg-gray-50 space-x-3 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">Batal</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">Submit</button>
                </footer>
            </form>
        </div>
    );
};

const MajelisEditor: React.FC<{ data?: Majelis[], onChange?: (newList: Majelis[]) => void }> = ({ data = [], onChange }) => {
    const [newItem, setNewItem] = useState<Partial<Majelis>>({ jabatan: 'Hakim Anggota', identitas: '' });

    const addItem = () => {
        if (newItem.identitas && onChange) {
            onChange([...data, { id: Date.now(), jabatan: newItem.jabatan || '', identitas: newItem.identitas || '' }]);
            setNewItem({ jabatan: 'Hakim Anggota', identitas: '' });
        }
    };

    const removeItem = (id: number) => {
        if (onChange) {
            onChange(data.filter(item => item.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Majelis & Panitera</h3>
            </div>
            <div className="flex gap-2 mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex-1">
                    <select 
                        value={newItem.jabatan} 
                        onChange={(e) => setNewItem(prev => ({ ...prev, jabatan: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
                    >
                        {['Hakim Ketua', 'Hakim Anggota', 'Hakim Mediator'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div className="flex-[2]">
                    <input 
                        type="text" 
                        placeholder="Nama Identitas"
                        value={newItem.identitas}
                        onChange={(e) => setNewItem(prev => ({ ...prev, identitas: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
                <button 
                    type="button" 
                    onClick={addItem}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex items-center"
                >
                    <PlusIcon className="h-4 w-4 mr-1"/> Majelis
                </button>
            </div>
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-2 px-3 border-b text-left font-medium text-gray-600">No</th>
                        <th className="py-2 px-3 border-b text-left font-medium text-gray-600">Jabatan</th>
                        <th className="py-2 px-3 border-b text-left font-medium text-gray-600">Nama</th>
                        <th className="py-2 px-3 border-b text-center font-medium text-gray-600">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((m, i) => (
                        <tr key={m.id}>
                            <td className="py-2 px-3 border-b">{i + 1}</td>
                            <td className="py-2 px-3 border-b">{m.jabatan}</td>
                            <td className="py-2 px-3 border-b">{m.identitas}</td>
                            <td className="py-2 px-3 border-b text-center">
                                <button type="button" onClick={() => removeItem(m.id)} className="text-red-500 hover:text-red-700">
                                    <TrashIcon className="h-4 w-4"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-4 text-center text-gray-500 italic">Belum ada majelis</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


// Main Component
interface EditPutusanProps {
    initialData: PerkaraRecord | null;
    onSave: (record: PerkaraRecord) => void;
    onBack: () => void;
    onNavigate?: (view: View) => void;
}

const EditPutusan: React.FC<EditPutusanProps> = ({ initialData, onSave, onBack, onNavigate }) => {
    const [formData, setFormData] = useState<Partial<PerkaraRecord>>({});
    const [activeTab, setActiveTab] = useState<'tuntutan' | 'analisis'>('tuntutan');
    const [modal, setModal] = useState<{ type: string, isOpen: boolean, data: any }>({ type: '', isOpen: false, data: null });
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, isOpen: boolean, data: any }>({ type: '', isOpen: false, data: null });

    useEffect(() => {
        if (initialData) {
            const defaultAnalisis = {
                isuKrusial: '',
                analisaHukum: PREFILL_ANALISA,
                potensiDampak: '',
                risiko: 'Rendah' as const,
                keteranganRisiko: PREFILL_RISIKO,
                analisisSementara: '',
                kesimpulanSementara: '',
            };
            setFormData({
                ...initialData,
                analisisPutusan: {
                    ...defaultAnalisis,
                    ...(initialData.analisisPutusan || {}),
                }
            });
        }
    }, [initialData]);

    const handleAnalisisChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            analisisPutusan: {
                ...prev.analisisPutusan,
                [name]: value,
            },
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Handle nested Abstraksi Perkara updates
        if (['tahunMasuk', 'noPerkara', 'tanggalPendaftaranGugatan', 'wilayah', 'pengadilan', 'jenisPerkara', 'klasifikasiPerkara', 'subKlasifikasiPerkara', 'subSubKlasifikasiPerkara', 'jenisPokokPerkara', 'subPokokPerkara', 'subSubPokokPerkara', 'nomorSuratKuasaKhusus', 'rincianPokokPerkara'].includes(name)) {
             setFormData(prev => ({
                ...prev,
                abstraksiPerkara: {
                    ...prev.abstraksiPerkara,
                    [name]: value,
                },
            }));
        } else if (name === 'statusBHT' || name === 'keteranganDampak') {
             setFormData(prev => ({
                ...prev,
                statusBHT: {
                    status: prev.statusBHT?.status || '',
                    keteranganDampak: prev.statusBHT?.keteranganDampak || '',
                    [name === 'statusBHT' ? 'status' : 'keteranganDampak']: value
                }
            }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        onSave(formData as PerkaraRecord);
    };

    const handleCrudSave = (data: any) => {
        const { type } = modal;
        let list: any[] = [];
        let setList: (list: any[]) => void = () => {};

        if (type === 'tuntutan-akhir') {
            list = formData.tuntutanAkhir || [];
            setList = (newList) => setFormData(prev => ({ ...prev, tuntutanAkhir: newList }));
        }
        
        if (data.id) { // Edit
            setList(list.map(item => item.id === data.id ? data : item));
        } else { // Add
            const newId = Date.now();
            setList([...list, { ...data, id: newId }]);
        }
        setModal({ type: '', isOpen: false, data: null });
    };

    const handleDelete = () => {
        const { type, data } = deleteConfirm;
        let list: any[] = [];
        let setList: (list: any[]) => void = () => {};

        if (type === 'tuntutan-akhir') {
            list = formData.tuntutanAkhir || [];
            setList = (newList) => setFormData(prev => ({ ...prev, tuntutanAkhir: newList }));
        }

        setList(list.filter(item => item.id !== data.id));
        setDeleteConfirm({ type: '', isOpen: false, data: null });
    }

    const TabButton = ({ tab, label }: { tab: 'tuntutan' | 'analisis', label: string }) => (
        <button 
            type="button" 
            onClick={() => setActiveTab(tab)} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab 
                    ? 'bg-white text-blue-600 border-gray-200 border-t border-x' 
                    : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="h-full flex flex-col bg-white">
            {onNavigate && (
                <div className="px-6 pt-4 bg-white flex-shrink-0">
                    <Breadcrumb currentView="eAdvokasiPutusanEdit" onNavigate={onNavigate} />
                </div>
            )}
            {modal.isOpen && (
                <CrudModal isOpen={modal.isOpen} onClose={() => setModal({ type: '', isOpen: false, data: null })} onSave={handleCrudSave}
                    title={`${modal.data.id ? 'Edit' : 'Tambah'} Tuntutan Akhir`}
                    initialData={modal.data}
                    fields={[ 
                        { name: 'jenisObjekTuntutan', label: 'Jenis Objek Tuntutan', type: 'select', options: JENIS_OBJEK_TUNTUTAN_OPTIONS }, 
                        { name: 'jenis', label: 'Jenis Tuntutan', type: 'select', options: JENIS_TUNTUTAN_OPTIONS }, 
                        { name: 'satuan', label: 'Satuan/Mata Uang', type: 'select', options: SATUAN_MATA_UANG_OPTIONS }, 
                        { name: 'jumlahNominal', label: 'Jumlah/Nominal', type: 'number' }, 
                        { name: 'keterangan', label: 'Keterangan', type: 'richtext' } 
                    ]}
                />
            )}
            {deleteConfirm.isOpen && <ConfirmationModal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ type: '', isOpen: false, data: null })} onConfirm={handleDelete} title="Konfirmasi Hapus" message="Apakah Anda yakin ingin menghapus item ini?" confirmText="Hapus" />}
            
            <header className="flex-shrink-0 bg-white p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-2">
                            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Edit Penanganan Putusan</h1>
                    </div>
                </div>
                <div className="ml-11">
                    <p className="text-sm font-semibold text-blue-600">
                        {formData.abstraksiPerkara?.noPerkara || formData.Nomor}
                    </p>
                    <p className="text-sm text-gray-500">
                        {formData.perihal}
                    </p>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-blue-600 rounded-t-lg px-4 pt-2 flex gap-1">
                        <TabButton tab="tuntutan" label="Tuntutan Akhir" />
                        <TabButton tab="analisis" label="Analisis Putusan" />
                    </div>
                    
                    <div className="bg-white p-6 rounded-b-lg border-x border-b border-gray-200 shadow-sm animate-in fade-in duration-200">
                        {activeTab === 'tuntutan' ? (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-850">Daftar Tuntutan Akhir</h3>
                                    <button 
                                        type="button" 
                                        onClick={() => setModal({ type: 'tuntutan-akhir', isOpen: true, data: {} })} 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center shadow-sm transition-all"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1"/>
                                        Tuntutan Akhir
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {['No', 'Jenis Objek', 'Tuntutan', 'Satuan', 'Jumlah', 'Aksi'].map(h => (
                                                    <th key={h} className="py-2.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                            {(formData.tuntutanAkhir || []).map((t, i) => (
                                                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-2.5 px-4 text-gray-600 font-medium">{i + 1}</td>
                                                    <td className="py-2.5 px-4 text-gray-800 font-semibold">{t.jenisObjekTuntutan}</td>
                                                    <td className="py-2.5 px-4 text-gray-700">{t.jenis}</td>
                                                    <td className="py-2.5 px-4 text-gray-700">{t.satuan}</td>
                                                    <td className="py-2.5 px-4 font-mono text-blue-700 font-bold">
                                                        {typeof t.jumlahNominal === 'number' ? t.jumlahNominal.toLocaleString('id-ID') : t.jumlahNominal}
                                                    </td>
                                                    <td className="py-2.5 px-4 space-x-2">
                                                        <button type="button" onClick={() => setModal({type: 'tuntutan-akhir', isOpen: true, data: t})} className="text-yellow-500 hover:text-yellow-600 inline-block p-1">
                                                            <PencilIcon className="h-4 w-4"/>
                                                        </button>
                                                        <button type="button" onClick={() => setDeleteConfirm({type: 'tuntutan-akhir', isOpen: true, data: t})} className="text-red-500 hover:text-red-600 inline-block p-1">
                                                            <TrashIcon className="h-4 w-4"/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!formData.tuntutanAkhir || formData.tuntutanAkhir.length === 0) && (
                                                <tr>
                                                    <td colSpan={6} className="py-12 text-center text-gray-400 italic bg-gray-55/50">
                                                        Belum ada data tuntutan akhir. Silakan tambah data.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <SimpleRichText 
                                    label="Isu Krusial" 
                                    value={formData.analisisPutusan?.isuKrusial || ''} 
                                    onChange={(val) => handleAnalisisChange('isuKrusial', val)} 
                                    rows={4}
                                />
                                <SimpleRichText 
                                    label="Analisa Hukum" 
                                    value={formData.analisisPutusan?.analisaHukum || ''} 
                                    onChange={(val) => handleAnalisisChange('analisaHukum', val)} 
                                    rows={5}
                                />
                                <SimpleRichText 
                                    label="Potensi Dampak bagi Kemenkeu" 
                                    value={formData.analisisPutusan?.potensiDampak || ''} 
                                    onChange={(val) => handleAnalisisChange('potensiDampak', val)} 
                                    rows={4}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Risiko</label>
                                    <div className="flex gap-4">
                                        {['Rendah', 'Sedang', 'Tinggi'].map(level => (
                                            <label key={level} className="flex items-center space-x-2 cursor-pointer select-none">
                                                <input 
                                                    type="radio" 
                                                    name="risiko-putusan" 
                                                    value={level} 
                                                    checked={formData.analisisPutusan?.risiko === level} 
                                                    onChange={() => handleAnalisisChange('risiko', level as any)} 
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                                                />
                                                <span className={`text-sm font-medium ${
                                                    level === 'Tinggi' 
                                                        ? 'text-red-600' 
                                                        : level === 'Sedang' 
                                                            ? 'text-yellow-600' 
                                                            : 'text-green-600'
                                                }`}>
                                                    {level}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <SimpleRichText 
                                    label="Keterangan Risiko" 
                                    value={formData.analisisPutusan?.keteranganRisiko || ''} 
                                    onChange={(val) => handleAnalisisChange('keteranganRisiko', val)} 
                                    rows={4}
                                />
                                <SimpleRichText 
                                    label="Analisis Sementara" 
                                    value={formData.analisisPutusan?.analisisSementara || ''} 
                                    onChange={(val) => handleAnalisisChange('analisisSementara', val)} 
                                    rows={4}
                                />
                                <SimpleRichText 
                                    label="Kesimpulan Sementara" 
                                    value={formData.analisisPutusan?.kesimpulanSementara || ''} 
                                    onChange={(val) => handleAnalisisChange('kesimpulanSementara', val)} 
                                    rows={4}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <footer className="flex-shrink-0 flex justify-end items-center p-4 bg-white border-t border-gray-200 space-x-3">
                <button 
                    type="button" 
                    onClick={onBack} 
                    className="px-8 py-2 rounded-lg bg-red-650 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                    Batal
                </button>
                <button 
                    type="button" 
                    onClick={handleSave} 
                    className="px-8 py-2 rounded-lg bg-green-650 bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                    Simpan Perubahan
                </button>
            </footer>
        </div>
    );
};

export default EditPutusan;
