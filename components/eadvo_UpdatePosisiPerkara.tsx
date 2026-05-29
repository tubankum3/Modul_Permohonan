
import React, { useState, useEffect } from 'react';
import { PerkaraRecord, PosisiSidangEntry, Putusan, View, StatusPerkara, Majelis, KehadiranPihak, Pihak } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, XIcon, ChevronDownIcon, ChevronUpIcon, PrintIcon, DocumentTextIcon, EyeIcon, SearchIcon, CheckIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import TarikDataNadineModal from './eadvo_TarikDataNadineModal';
import Breadcrumb from './Breadcrumb';

// Specialized Modal for Posisi Sidang
const SidangModal: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    onSave: (data: any) => void, 
    initialData: any,
    record: PerkaraRecord
}> = ({ isOpen, onClose, onSave, initialData, record }) => {
    const [activeTab, setActiveTab] = useState<'tambah' | 'kehadiran'>('tambah');
    const [formData, setFormData] = useState<any>(initialData);
    const [isNadineOpen, setIsNadineOpen] = useState(false);

    useEffect(() => { 
        if (isOpen) {
            const parties = [...(record.pihakP || []), ...(record.pihakT || [])];
            setFormData({
                ...initialData,
                kehadiranPihak: initialData.kehadiranPihak || parties.map(p => ({
                    pihakId: p.id,
                    identitas: p.identitas,
                    label: p.noUrut,
                    status: 'Tidak Hadir'
                }))
            });
        }
    }, [initialData, isOpen, record]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleKehadiran = (pihakId: string, status: 'Hadir' | 'Tidak Hadir') => {
        setFormData((prev: any) => ({
            ...prev,
            kehadiranPihak: (prev.kehadiranPihak || []).map((k: KehadiranPihak) => 
                k.pihakId === pihakId ? { ...k, status } : k
            )
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col overflow-hidden h-[90vh]">
                <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
                    <h2 className="text-lg font-bold">Posisi Sidang</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors"><XIcon className="h-5 w-5" /></button>
                </header>

                <div className="bg-blue-600 px-4 pt-2">
                    <button 
                        onClick={() => setActiveTab('tambah')} 
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-1 ${activeTab === 'tambah' ? 'bg-white text-blue-600 border-gray-200 border-t border-x' : 'bg-blue-500 text-white hover:bg-blue-400'}`}
                    >
                        Tambah Posisi Sidang
                    </button>
                    <button 
                        onClick={() => setActiveTab('kehadiran')} 
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'kehadiran' ? 'bg-white text-blue-600 border-gray-200 border-t border-x' : 'bg-blue-500 text-white hover:bg-blue-400'}`}
                    >
                        Kehadiran Para Pihak
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {activeTab === 'tambah' && (
                        <div className="max-w-3xl mx-auto space-y-4">
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Sidang</label>
                                        <select 
                                            name="posisiSidangType"
                                            value={formData.posisiSidangType || 'TK Pertama'}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="TK Pertama">TK Pertama</option>
                                            <option value="TK Banding">TK Banding</option>
                                            <option value="TK Kasasi">TK Kasasi</option>
                                            <option value="TK PK">TK PK</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat Tugas</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                name="suratTugas" 
                                                value={formData.suratTugas || ''} 
                                                onChange={handleChange} 
                                                className="flex-1 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setIsNadineOpen(true)}
                                                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                <SearchIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat Tugas</label>
                                        <input 
                                            type="date" 
                                            name="tanggalSuratTugas" 
                                            value={formData.tanggalSuratTugas || ''} 
                                            onChange={handleChange} 
                                            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Agenda Sidang</label>
                                        <input 
                                            type="text" 
                                            name="agendaSidang" 
                                            value={formData.agendaSidang || ''} 
                                            onChange={handleChange} 
                                            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Sidang</label>
                                        <input 
                                            type="date" 
                                            name="tanggalSidang" 
                                            value={formData.tanggalSidang || ''} 
                                            onChange={handleChange} 
                                            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Agenda Berikutnya</label>
                                        <input 
                                            type="text" 
                                            name="agendaBerikutnya" 
                                            value={formData.agendaBerikutnya || ''} 
                                            onChange={handleChange} 
                                            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Sidang Berikutnya</label>
                                        <input 
                                            type="date" 
                                            name="tanggalSidangBerikutnya" 
                                            value={formData.tanggalSidangBerikutnya || ''} 
                                            onChange={handleChange} 
                                            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Beracara/Persidangan</label>
                                        <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                            <div className="bg-gray-50 border-b border-gray-300 px-3 py-1 flex gap-2">
                                                <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs font-bold">B</button>
                                                <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs italic">I</button>
                                                <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs underline">U</button>
                                            </div>
                                            <textarea 
                                                name="keterangan" 
                                                value={formData.keterangan || ''} 
                                                onChange={handleChange} 
                                                rows={5} 
                                                className="w-full p-2 outline-none resize-none text-sm" 
                                                placeholder="Masukan keterangan detail persidangan..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'kehadiran' && (
                        <div className="max-w-3xl mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <table className="w-full text-sm border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700 border-r border-gray-200 w-20">Pihak</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700 border-r border-gray-200">Identitas</th>
                                        <th className="py-3 px-4 text-center font-semibold text-gray-700 border-r border-gray-200 w-32">Status</th>
                                        <th className="py-3 px-4 text-center font-semibold text-gray-700 w-32">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(formData.kehadiranPihak || []).map((k: KehadiranPihak) => (
                                        <tr key={k.pihakId}>
                                            <td className="py-3 px-4 font-bold text-gray-600 border-r border-gray-200">{k.label}</td>
                                            <td className="py-3 px-4 border-r border-gray-200">{k.identitas}</td>
                                            <td className="py-3 px-4 text-center border-r border-gray-200">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${k.status === 'Hadir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {k.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex justify-center gap-1">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleKehadiran(k.pihakId, 'Hadir')}
                                                        className={`p-1.5 rounded-md transition-colors ${k.status === 'Hadir' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'}`}
                                                        title="Hadir"
                                                    >
                                                        <CheckIcon className="h-4 w-4" />
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleKehadiran(k.pihakId, 'Tidak Hadir')}
                                                        className={`p-1.5 rounded-md transition-colors ${k.status === 'Tidak Hadir' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600 hover:bg-red-50'}`}
                                                        title="Tidak Hadir"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <footer className="flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200 space-x-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors">Batal</button>
                    <button 
                        type="button"
                        onClick={handleSubmit} 
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Simpan Perubahan
                    </button>
                </footer>
            </div>

            <TarikDataNadineModal 
                isOpen={isNadineOpen} 
                onClose={() => setIsNadineOpen(false)} 
                onTarikData={(suratList) => {
                    if (suratList.length > 0) {
                        const surat = suratList[0];
                        setFormData({
                            ...formData,
                            suratTugas: surat.nomorSurat,
                            tanggalSuratTugas: surat.tanggal.split('/').reverse().join('-')
                        });
                    }
                }} 
            />
        </div>
    );
};

// CRUD Modal for Sidang and Putusan
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
        const { name, value, type } = e.target;
        const isRadio = type === 'radio';
        setFormData((prev: any) => ({ ...prev, [name]: isRadio ? value : (e.target as any).value }));
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
                                if (file) setFormData((prev: any) => ({ ...prev, [field.name]: file.name }));
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
                                onClick={() => setFormData((prev: any) => ({ ...prev, [field.name]: '' }))}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            >
                                <XIcon className="h-4 w-4"/>
                            </button>
                        )}
                    </div>
                ) : field.type === 'radio' ? (
                    <div className="flex space-x-4">
                        {field.options?.map(opt => (
                            <label key={opt} className="flex items-center">
                                <input type="radio" name={field.name} value={opt} checked={formData[field.name] === opt} onChange={handleChange} className="mr-1" />
                                {opt}
                            </label>
                        ))}
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
interface UpdatePosisiPerkaraProps {
    record: PerkaraRecord;
    onSave: (record: PerkaraRecord) => void;
    onBack: () => void;
    onNavigate: (view: View) => void;
}

type UpdateTab = 'sidang' | 'putusan' | 'bht';
type TingkatSidang = 'tkPertama' | 'tkBanding' | 'tkKasasi' | 'tkPK';

const UpdatePosisiPerkara: React.FC<UpdatePosisiPerkaraProps> = ({ record, onSave, onBack, onNavigate }) => {
    const [formData, setFormData] = useState<PerkaraRecord>(record);
    const [activeTab, setActiveTab] = useState<UpdateTab>('sidang');
    const [openTingkat, setOpenTingkat] = useState<Record<TingkatSidang, boolean>>({ tkPertama: true, tkBanding: false, tkKasasi: false, tkPK: false });
    const [modal, setModal] = useState<{ type: string, isOpen: boolean, data: any, tingkat?: TingkatSidang }>({ type: '', isOpen: false, data: null });
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, isOpen: boolean, data: any, tingkat?: TingkatSidang }>({ type: '', isOpen: false, data: null });
    
    useEffect(() => { setFormData(record) }, [record]);

    const handleSave = () => {
        let dataToSave = { ...formData };
        if (activeTab === 'bht' && dataToSave.statusBHT?.status) {
            dataToSave.statusPerkara = StatusPerkara.SELESAI;
        }
        onSave(dataToSave);
    };

    const handleCrudSave = (data: any) => {
        const { type } = modal;
        let tingkat = modal.tingkat;
        const oldTingkat = modal.tingkat;
        
        if (type === 'sidang') {
            const typeMap: Record<string, TingkatSidang> = {
                'TK Pertama': 'tkPertama',
                'TK Banding': 'tkBanding',
                'TK Kasasi': 'tkKasasi',
                'TK PK': 'tkPK'
            };
            if (data.posisiSidangType) {
                tingkat = typeMap[data.posisiSidangType];
            }
        }

        if (type === 'sidang' && tingkat !== oldTingkat && oldTingkat && data.id) {
             // Move entry between levels
             setFormData(prev => {
                const updatedPosisi = { ...(prev.posisiSidang || {}) } as any;
                updatedPosisi[oldTingkat] = (updatedPosisi[oldTingkat] || []).filter((i: any) => i.id !== data.id);
                updatedPosisi[tingkat!] = [...(updatedPosisi[tingkat!] || []), data];
                return { ...prev, posisiSidang: updatedPosisi };
             });
             setModal({ type: '', isOpen: false, data: null });
             return;
        }

        let list: any[] = [];
        let setList: (list: any[]) => void = () => {};

        if (type === 'sidang' && tingkat) {
            list = formData.posisiSidang?.[tingkat] || [];
            setList = (newList) => setFormData(prev => ({ ...prev, posisiSidang: { ...prev.posisiSidang, [tingkat!]: newList } as PerkaraRecord['posisiSidang'] }));
        } else if (type === 'putusan') {
            list = formData.putusan || [];
            setList = (newList) => setFormData(prev => ({ ...prev, putusan: newList }));
        }
        
        if (data.id) { // Edit same level
            setList(list.map(item => item.id === data.id ? data : item));
        } else { // Add
            setList([...list, { ...data, id: Date.now() }]);
        }
        setModal({ type: '', isOpen: false, data: null });
    };

    const handleDelete = () => {
        const { type, data, tingkat } = deleteConfirm;
        let list: any[] = [];
        let setList: (list: any[]) => void = () => {};

        if (type === 'sidang' && tingkat) {
            list = formData.posisiSidang?.[tingkat] || [];
            setList = (newList) => setFormData(prev => ({ ...prev, posisiSidang: { ...prev.posisiSidang, [tingkat]: newList } as PerkaraRecord['posisiSidang'] }));
        } else if (type === 'putusan') {
            list = formData.putusan || [];
            setList = (newList) => setFormData(prev => ({ ...prev, putusan: newList }));
        }

        setList(list.filter(item => item.id !== data.id));
        setDeleteConfirm({ type: '', isOpen: false, data: null });
    }

    const handleBhtChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, statusBHT: { ...(prev.statusBHT || { status: '', keteranganDampak: '' }), [name]: value } }));
    };

    const TabButton = ({ tab, label }: { tab: UpdateTab, label: string }) => (
        <button type="button" onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tab ? 'bg-white text-blue-600 border-gray-200 border-t border-x' : 'bg-blue-500 text-white hover:bg-blue-400'}`}>
            {label}
        </button>
    );

    const PosisiSidangSection: React.FC<{ tingkat: TingkatSidang, title: string }> = ({ tingkat, title }) => {
        const data = formData.posisiSidang?.[tingkat] || [];
        const isOpen = openTingkat[tingkat];
        const reverseTypeMap: Record<TingkatSidang, string> = {
            'tkPertama': 'TK Pertama',
            'tkBanding': 'TK Banding',
            'tkKasasi': 'TK Kasasi',
            'tkPK': 'TK PK'
        };

        return (
            <div className="bg-white border rounded-md">
                <button type="button" onClick={() => setOpenTingkat(p => ({ ...p, [tingkat]: !p[tingkat] }))} className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-t-md">
                    <h3 className="font-semibold text-lg text-gray-700">{title}</h3>
                    {isOpen ? <ChevronUpIcon className="h-6 w-6"/> : <ChevronDownIcon className="h-6 w-6"/>}
                </button>
                {isOpen && (
                    <div className="p-3">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100"><tr>{['No', 'Nomor & Tanggal ST', 'Agenda & Tanggal Sidang', 'Agenda Berikutnya', 'Aksi'].map(h => <th key={h} className="py-2 px-3 border-b text-left font-medium text-gray-600">{h}</th>)}</tr></thead>
                            <tbody>
                                {data.map((s, i) => (
                                    <tr key={s.id}>
                                        <td className="py-2 px-3 border-b">{i + 1}</td>
                                        <td className="py-2 px-3 border-b">{s.suratTugas}<br/>{s.tanggalSuratTugas}</td>
                                        <td className="py-2 px-3 border-b">{s.agendaSidang}<br/>{s.tanggalSidang}</td>
                                        <td className="py-2 px-3 border-b">{s.agendaBerikutnya}<br/>{s.tanggalSidangBerikutnya}</td>
                                        <td className="py-2 px-3 border-b space-x-1">
                                            <button type="button" onClick={() => {}} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><EyeIcon className="h-4 w-4"/></button>
                                            <button type="button" onClick={() => setModal({ type: 'sidang', isOpen: true, data: { ...s, posisiSidangType: reverseTypeMap[tingkat] }, tingkat })} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><PencilIcon className="h-4 w-4"/></button>
                                            <button type="button" onClick={() => setDeleteConfirm({ type: 'sidang', isOpen: true, data: s, tingkat })} className="text-red-500 p-1 hover:bg-gray-200 rounded-full"><TrashIcon className="h-4 w-4"/></button>
                                            <button type="button" onClick={() => alert('Print action!')} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><PrintIcon className="h-4 w-4"/></button>
                                            <button type="button" onClick={() => onNavigate('formNaskah')} className="text-blue-500 p-1 hover:bg-gray-200 rounded-full" title="Generate Laporan (LAP) - Nadine"><DocumentTextIcon className="h-4 w-4"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-100">
            {onNavigate && (
                <div className="px-6 pt-4 bg-white flex-shrink-0">
                    <Breadcrumb currentView="eAdvokasiPerkaraUpdatePosisi" onNavigate={onNavigate} />
                </div>
            )}
             {modal.isOpen && modal.type === 'sidang' && (
                 <SidangModal 
                    isOpen={modal.isOpen} 
                    onClose={() => setModal({ type: '', isOpen: false, data: null })} 
                    onSave={handleCrudSave}
                    initialData={modal.data}
                    record={record}
                 />
             )}
             {modal.isOpen && modal.type !== 'sidang' && (
                <CrudModal isOpen={modal.isOpen} onClose={() => setModal({ type: '', isOpen: false, data: null })} onSave={handleCrudSave}
                    title={`${modal.data.id ? 'Edit' : 'Tambah'} ${ { 'sidang': 'Posisi Sidang', 'putusan': 'Posisi Putusan' }[modal.type] }`}
                    initialData={modal.data}
                    fields={
                        modal.type === 'sidang' ? [ { name: 'suratTugas', label: 'Nomor Surat Tugas', type: 'text' }, { name: 'tanggalSuratTugas', label: 'Tanggal Surat Tugas', type: 'date' }, { name: 'agendaSidang', label: 'Agenda Sidang', type: 'text' }, { name: 'tanggalSidang', label: 'Tanggal Sidang', type: 'date' }, { name: 'agendaBerikutnya', label: 'Agenda Berikutnya', type: 'text' }, { name: 'tanggalSidangBerikutnya', label: 'Tanggal Sidang Berikutnya', type: 'date' }, { name: 'keterangan', label: 'Keterangan Beracara/Persidangan', type: 'textarea' } ]
                        : modal.type === 'putusan' ? [ 
                            { name: 'posisi', label: 'Posisi Putusan', type: 'select', options: ['Pertama', 'Banding', 'Kasasi', 'PK'] }, 
                            { name: 'nomor', label: 'Nomor Putusan', type: 'text' }, 
                            { name: 'tanggal', label: 'Tanggal Putusan', type: 'date' }, 
                            { name: 'pertimbanganHakim', label: 'Pertimbangan Hakim', type: 'richtext' }, 
                            { name: 'amar', label: 'Amar Putusan', type: 'richtext' }, 
                            { name: 'keterangan', label: 'Keterangan', type: 'richtext' }, 
                            { name: 'status', label: 'Status Putusan', type: 'radio', options: ['Menang', 'Kalah'] },
                            { name: 'dokumen', label: 'Upload Dokumen Putusan', type: 'file' }
                        ]
                        : []
                    }
                    extraSection={modal.type === 'putusan' ? <MajelisEditor /> : null}
                />
            )}
            {deleteConfirm.isOpen && <ConfirmationModal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ type: '', isOpen: false, data: null })} onConfirm={handleDelete} title="Konfirmasi Hapus" message="Apakah Anda yakin ingin menghapus item ini?" confirmText="Hapus" />}
            <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1 mr-2">
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Update Posisi Perkara</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {record.abstraksiPerkara?.noPerkara || record.Nomor} - {record.perihal}
                    </p>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
                <div className="bg-blue-600 rounded-t-lg px-4 pt-2">
                    <TabButton tab="sidang" label="Posisi Sidang" />
                    <TabButton tab="putusan" label="Posisi Putusan" />
                    <TabButton tab="bht" label="Status BHT" />
                </div>
                <div className="bg-white p-6 rounded-b-lg border-x border-b border-gray-200">
                    {activeTab === 'sidang' && (
                        <div className="space-y-4">
                            <div className="text-right">
                                <button type="button" onClick={() => setModal({ type: 'sidang', isOpen: true, data: { posisiSidangType: 'TK Pertama' }, tingkat: 'tkPertama' })} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center ml-auto"><PlusIcon className="h-4 w-4 mr-1"/>Sidang</button>
                            </div>
                            <PosisiSidangSection tingkat="tkPertama" title="Posisi Tingkat Pertama" />
                            <PosisiSidangSection tingkat="tkBanding" title="Posisi Tingkat Banding" />
                            <PosisiSidangSection tingkat="tkKasasi" title="Posisi Tingkat Kasasi" />
                            <PosisiSidangSection tingkat="tkPK" title="Posisi Tingkat Peninjauan Kembali" />
                        </div>
                    )}
                    {activeTab === 'putusan' && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-lg">Posisi Putusan</h3><button type="button" onClick={() => setModal({ type: 'putusan', isOpen: true, data: {} })} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center ml-auto"><PlusIcon className="h-4 w-4 mr-1"/>Putusan</button></div>
                                <table className="min-w-full bg-white border">
                                    <thead className="bg-gray-50"><tr>{['No', 'Nomor Putusan', 'Tanggal Putusan', 'Amar Putusan', 'Status Putusan', 'Aksi'].map(h => <th key={h} className="py-2 px-3 border-b text-left text-sm font-medium text-gray-600">{h}</th>)}</tr></thead>
                                    <tbody>
                                        {(formData.putusan || []).map((p, i) => (
                                            <tr key={p.id}>
                                                <td className="py-2 px-3 border-b">{i + 1}</td><td className="py-2 px-3 border-b">{p.nomor}</td><td className="py-2 px-3 border-b">{p.tanggal}</td><td className="py-2 px-3 border-b">{p.amar}</td><td className="py-2 px-3 border-b">{p.status}</td>
                                                <td className="py-2 px-3 border-b space-x-1 text-center">
                                                    <button type="button" onClick={() => {}} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><EyeIcon className="h-4 w-4"/></button>
                                                    <button type="button" onClick={() => setModal({type: 'putusan', isOpen: true, data: p})} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><PencilIcon className="h-4 w-4"/></button>
                                                    <button type="button" onClick={() => setDeleteConfirm({type: 'putusan', isOpen: true, data: p})} className="text-red-500 p-1 hover:bg-gray-200 rounded-full"><TrashIcon className="h-4 w-4"/></button>
                                                    <button type="button" onClick={() => alert('Print action!')} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><PrintIcon className="h-4 w-4"/></button>
                                                    <button type="button" onClick={() => onNavigate('formNaskah')} className="text-blue-500 p-1 hover:bg-gray-200 rounded-full" title="Generate Laporan (LAP) - Nadine"><DocumentTextIcon className="h-4 w-4"/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'bht' && (
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Perkara Berkekuatan Hukum Tetap</h3>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Pilih Status BHT</label><select name="status" value={formData.statusBHT?.status || ''} onChange={handleBhtChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"><option value="">Pilih status</option><option value="Inkracht">Inkracht</option></select></div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Dampak Putusan Tetap Kemenkeu/PemRI</label>
                                    <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                        <div className="bg-gray-50 border-b border-gray-300 px-3 py-1 flex gap-2">
                                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs font-bold">B</button>
                                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs italic">I</button>
                                            <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs underline">U</button>
                                        </div>
                                        <textarea 
                                            name="keteranganDampak" 
                                            value={formData.statusBHT?.keteranganDampak || ''} 
                                            onChange={handleBhtChange} 
                                            rows={6} 
                                            className="w-full p-2 outline-none resize-none text-sm" 
                                            placeholder="Masukan keterangan dampak..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <footer className="flex-shrink-0 flex justify-between items-center p-4 bg-white border-t border-gray-200">
                <button type="button" onClick={onBack} className="px-8 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">Kembali</button>
                <button type="button" onClick={handleSave} className="px-8 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
                    {activeTab === 'bht' ? 'Submit BHT' : 'Simpan & Lanjutkan'}
                </button>
            </footer>
        </div>
    );
};

export default UpdatePosisiPerkara;
