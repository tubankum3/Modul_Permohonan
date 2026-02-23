import React, { useState, useEffect } from 'react';
import { PerkaraRecord, Pihak, Tuntutan, TuntutanAkhir, Putusan } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, XIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';

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
const CrudModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void, title: string, initialData: any, fields: { name: string, label: string, type: string, options?: string[] }[] }> = ({ isOpen, onClose, onSave, title, initialData, fields }) => {
    const [formData, setFormData] = useState(initialData);
    useEffect(() => { setFormData(initialData) }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <header className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><XIcon className="h-5 w-5" /></button>
                </header>
                <main className="p-6 space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            {field.type === 'textarea' ? <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" />
                            : field.type === 'select' ? <select name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">{field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
                            : <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />}
                        </div>
                    ))}
                </main>
                <footer className="flex justify-end items-center p-4 bg-gray-50 space-x-3 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">Batal</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">Submit</button>
                </footer>
            </form>
        </div>
    );
};


// Main Component
interface EditPutusanProps {
    initialData: PerkaraRecord | null;
    onSave: (record: PerkaraRecord) => void;
    onBack: () => void;
}

type EditTab = 'informasi-umum' | 'putusan' | 'tuntutan-akhir';

const EditPutusan: React.FC<EditPutusanProps> = ({ initialData, onSave, onBack }) => {
    const [formData, setFormData] = useState<Partial<PerkaraRecord>>({});
    const [activeTab, setActiveTab] = useState<EditTab>('informasi-umum');
    const [modal, setModal] = useState<{ type: string, isOpen: boolean, data: any }>({ type: '', isOpen: false, data: null });
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, isOpen: boolean, data: any }>({ type: '', isOpen: false, data: null });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

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

        if (type.startsWith('pihak')) {
            const pihakType = type.split('-')[1] as 'P' | 'T';
            list = formData[pihakType === 'P' ? 'pihakP' : 'pihakT'] || [];
            setList = (newList) => setFormData(prev => ({ ...prev, [pihakType === 'P' ? 'pihakP' : 'pihakT']: newList }));
        } else if (type === 'tuntutan') {
            list = formData.tuntutan || [];
            setList = (newList) => setFormData(prev => ({ ...prev, tuntutan: newList }));
        } else if (type === 'tuntutan-akhir') {
            list = formData.tuntutanAkhir || [];
            setList = (newList) => setFormData(prev => ({ ...prev, tuntutanAkhir: newList }));
        } else if (type === 'putusan') {
            list = formData.putusan || [];
            setList = (newList) => setFormData(prev => ({ ...prev, putusan: newList }));
        }
        
        if (data.id) { // Edit
            setList(list.map(item => item.id === data.id ? data : item));
        } else { // Add
            const newId = type.startsWith('pihak') ? `${type.split('-')[1]}${list.length + 1}` : Date.now();
            setList([...list, { ...data, id: newId }]);
        }
        setModal({ type: '', isOpen: false, data: null });
    };

    const handleDelete = () => {
        const { type, data } = deleteConfirm;
        let list: any[] = [];
        let setList: (list: any[]) => void = () => {};

        if (type.startsWith('pihak')) {
            const pihakType = type.split('-')[1] as 'P' | 'T';
            list = formData[pihakType === 'P' ? 'pihakP' : 'pihakT'] || [];
            setList = (newList) => setFormData(prev => ({ ...prev, [pihakType === 'P' ? 'pihakP' : 'pihakT']: newList }));
        } else if (type === 'tuntutan') {
            list = formData.tuntutan || [];
            setList = (newList) => setFormData(prev => ({ ...prev, tuntutan: newList }));
        } else if (type === 'tuntutan-akhir') {
            list = formData.tuntutanAkhir || [];
            setList = (newList) => setFormData(prev => ({ ...prev, tuntutanAkhir: newList }));
        } else if (type === 'putusan') {
            list = formData.putusan || [];
            setList = (newList) => setFormData(prev => ({ ...prev, putusan: newList }));
        }

        setList(list.filter(item => item.id !== data.id));
        setDeleteConfirm({ type: '', isOpen: false, data: null });
    }

    const TabButton = ({ tab, label }: { tab: EditTab, label: string }) => (
        <button type="button" onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tab ? 'bg-white text-blue-600 border-gray-200 border-t border-x' : 'bg-blue-500 text-white hover:bg-blue-400'}`}>
            {label}
        </button>
    );

    const PihakSection: React.FC<{ type: 'P' | 'T' }> = ({ type }) => {
        const title = `Para Pihak ${type}`;
        const data = type === 'P' ? formData.pihakP : formData.pihakT;
        return (
            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <button type="button" onClick={() => setModal({ type: `pihak-${type}`, isOpen: true, data: { noUrut: `${type}${ (data?.length || 0) + 1}`, pihak: '', identitas: '' }})} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Pihak</button>
                </div>
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-50"><tr>{['No. Urut', 'Pihak', 'Identitas', 'Aksi'].map(h => <th key={h} className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">{h}</th>)}</tr></thead>
                    <tbody>
                        {(data || []).map(p => (
                            <tr key={p.id}>
                                <td className="py-2 px-4 border-b text-sm">{p.noUrut}</td>
                                <td className="py-2 px-4 border-b text-sm">{p.pihak}</td>
                                <td className="py-2 px-4 border-b text-sm">{p.identitas}</td>
                                <td className="py-2 px-4 border-b text-sm space-x-2">
                                    <button type="button" onClick={() => setModal({type: `pihak-${type}`, isOpen: true, data: p})} className="text-yellow-500"><PencilIcon className="h-5 w-5"/></button>
                                    <button type="button" onClick={() => setDeleteConfirm({type: `pihak-${type}`, isOpen: true, data: p})} className="text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-100">
            {modal.isOpen && (
                <CrudModal isOpen={modal.isOpen} onClose={() => setModal({ type: '', isOpen: false, data: null })} onSave={handleCrudSave}
                    title={`${modal.data.id ? 'Edit' : 'Tambah'} ${ { 'pihak-P': 'Pihak P', 'pihak-T': 'Pihak T', 'tuntutan': 'Objek Tuntutan', 'tuntutan-akhir': 'Tuntutan Akhir', 'putusan': 'Putusan' }[modal.type] }`}
                    initialData={modal.data}
                    fields={
                        modal.type.startsWith('pihak') ? [ { name: 'noUrut', label: 'No. Urut', type: 'text' }, { name: 'pihak', label: 'Jenis Pihak', type: 'select', options: ['Penggugat', 'Tergugat', 'Turut Tergugat'] }, { name: 'identitas', label: 'Nama Identitas', type: 'text' } ]
                        : (modal.type === 'tuntutan' || modal.type === 'tuntutan-akhir') ? [ { name: 'objek', label: 'Objek', type: 'text' }, { name: 'jenis', label: 'Jenis Tuntutan', type: 'text' }, { name: 'satuan', label: 'Jenis Satuan/Mata Uang', type: 'text'}, { name: 'jumlahNominal', label: 'Jumlah/Nominal', type: 'text' }, { name: 'keterangan', label: 'Keterangan', type: 'textarea' } ]
                        : modal.type === 'putusan' ? [ { name: 'nomor', label: 'Nomor Putusan', type: 'text' }, { name: 'tanggal', label: 'Tanggal', type: 'date' }, { name: 'amar', label: 'Amar Putusan', type: 'textarea' }, { name: 'status', label: 'Status', type: 'select', options: ['Menang', 'Kalah', 'Damai'] }, { name: 'posisi', label: 'Tingkat', type: 'select', options: ['Pertama', 'Banding', 'Kasasi', 'PK'] } ]
                        : []
                    }
                />
            )}
            {deleteConfirm.isOpen && <ConfirmationModal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ type: '', isOpen: false, data: null })} onConfirm={handleDelete} title="Konfirmasi Hapus" message="Apakah Anda yakin ingin menghapus item ini?" confirmText="Hapus" />}
            
            <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1 mr-2">
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-800">
                         Edit Penanganan Putusan
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.abstraksiPerkara?.noPerkara || formData.Nomor} - {formData.perihal}
                    </p>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-6">
                <div className="bg-blue-600 rounded-t-lg px-4 pt-2">
                    <TabButton tab="informasi-umum" label="Informasi Umum" />
                    <TabButton tab="putusan" label="Putusan" />
                    <TabButton tab="tuntutan-akhir" label="Tuntutan Akhir" />
                </div>
                <div className="bg-white p-6 rounded-b-lg border-x border-b border-gray-200">
                    {activeTab === 'informasi-umum' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries({ 'tahunMasuk': 'Tahun Masuk', 'noPerkara': 'Nomor Perkara', 'tanggalPendaftaranGugatan': 'Tanggal Pendaftaran Gugatan', 'wilayah': 'Wilayah', 'pengadilan': 'Pengadilan', 'jenisPerkara': 'Jenis Perkara', 'klasifikasiPerkara': 'Klasifikasi Perkara', 'subKlasifikasiPerkara': 'Sub Klasifikasi Perkara', 'subSubKlasifikasiPerkara': 'Sub-Sub Klasifikasi Perkara', 'jenisPokokPerkara': 'Jenis Pokok Perkara', 'subPokokPerkara': 'Sub Pokok Perkara', 'subSubPokokPerkara': 'Sub-Sub Pokok Perkara', 'nomorSuratKuasaKhusus': 'Nomor Surat Kuasa Khusus' }).map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                        <input type={key.includes('tanggal') ? 'date' : 'text'} name={key} value={(formData.abstraksiPerkara as any)?.[key] || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                ))}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rincian Pokok Perkara</label>
                                    <textarea name="rincianPokokPerkara" value={formData.abstraksiPerkara?.rincianPokokPerkara || ''} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                    <TagInput
                                        tags={formData.abstraksiPerkara?.tagsPerkara || []}
                                        setTags={(newTags) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                abstraksiPerkara: {
                                                    ...(prev.abstraksiPerkara || {}),
                                                    tagsPerkara: newTags,
                                                },
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <hr />
                            <PihakSection type="P" />
                            <PihakSection type="T" />
                            <hr />
                            <div>
                                <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-lg">Objek Tuntutan</h3><button type="button" onClick={() => setModal({ type: 'tuntutan', isOpen: true, data: {} })} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Objek Tuntutan</button></div>
                                <table className="min-w-full bg-white border"><thead className="bg-gray-50"><tr>{['No', 'Objek', 'Jenis', 'Satuan', 'Jumlah', 'Keterangan', 'Aksi'].map(h => <th key={h} className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">{h}</th>)}</tr></thead>
                                    <tbody>
                                        {(formData.tuntutan || []).map((t, i) => (<tr key={t.id}><td className="py-2 px-4 border-b text-sm">{i + 1}</td><td className="py-2 px-4 border-b text-sm">{t.objek}</td><td className="py-2 px-4 border-b text-sm">{t.jenis}</td><td className="py-2 px-4 border-b text-sm">{t.satuan}</td><td className="py-2 px-4 border-b text-sm">{t.jumlahNominal}</td><td className="py-2 px-4 border-b text-sm">{t.keterangan}</td>
                                            <td className="py-2 px-4 border-b text-sm space-x-2"><button type="button" onClick={() => setModal({type: 'tuntutan', isOpen: true, data: t})} className="text-yellow-500"><PencilIcon className="h-5 w-5"/></button><button type="button" onClick={() => setDeleteConfirm({type: 'tuntutan', isOpen: true, data: t})} className="text-red-500"><TrashIcon className="h-5 w-5"/></button></td></tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'putusan' && (
                        <div>
                             <div className="mb-6">
                                <h3 className="font-semibold text-lg mb-2">Status BHT</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select name="statusBHT" value={formData.statusBHT?.status || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                            <option value="">Pilih Status</option>
                                            <option value="Inkracht">Inkracht</option>
                                            <option value="Belum Inkracht">Belum Inkracht</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Dampak</label>
                                        <textarea name="keteranganDampak" value={formData.statusBHT?.keteranganDampak || ''} onChange={handleInputChange} rows={2} className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                             </div>
                             <hr className="my-4"/>
                             <div>
                                <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-lg">Putusan Perkara</h3><button type="button" onClick={() => setModal({ type: 'putusan', isOpen: true, data: {} })} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Putusan</button></div>
                                <table className="min-w-full bg-white border"><thead className="bg-gray-50"><tr>{['No', 'Nomor', 'Tanggal', 'Amar', 'Status', 'Tingkat', 'Aksi'].map(h => <th key={h} className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">{h}</th>)}</tr></thead>
                                    <tbody>
                                        {(formData.putusan || []).map((p, i) => (<tr key={p.id}><td className="py-2 px-4 border-b text-sm">{i + 1}</td><td className="py-2 px-4 border-b text-sm">{p.nomor}</td><td className="py-2 px-4 border-b text-sm">{p.tanggal}</td><td className="py-2 px-4 border-b text-sm">{p.amar}</td><td className="py-2 px-4 border-b text-sm">{p.status}</td><td className="py-2 px-4 border-b text-sm">{p.posisi}</td>
                                            <td className="py-2 px-4 border-b text-sm space-x-2"><button type="button" onClick={() => setModal({type: 'putusan', isOpen: true, data: p})} className="text-yellow-500"><PencilIcon className="h-5 w-5"/></button><button type="button" onClick={() => setDeleteConfirm({type: 'putusan', isOpen: true, data: p})} className="text-red-500"><TrashIcon className="h-5 w-5"/></button></td></tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'tuntutan-akhir' && (
                        <div>
                             <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-lg">Tuntutan Akhir</h3><button type="button" onClick={() => setModal({ type: 'tuntutan-akhir', isOpen: true, data: {} })} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Tuntutan Akhir</button></div>
                             <table className="min-w-full bg-white border"><thead className="bg-gray-50"><tr>{['No', 'Objek', 'Jenis', 'Satuan', 'Jumlah', 'Keterangan', 'Aksi'].map(h => <th key={h} className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">{h}</th>)}</tr></thead>
                                 <tbody>
                                     {(formData.tuntutanAkhir || []).map((t, i) => (<tr key={t.id}><td className="py-2 px-4 border-b text-sm">{i + 1}</td><td className="py-2 px-4 border-b text-sm">{t.objek}</td><td className="py-2 px-4 border-b text-sm">{t.jenis}</td><td className="py-2 px-4 border-b text-sm">{t.satuan}</td><td className="py-2 px-4 border-b text-sm">{t.jumlahNominal}</td><td className="py-2 px-4 border-b text-sm">{t.keterangan}</td>
                                         <td className="py-2 px-4 border-b text-sm space-x-2"><button type="button" onClick={() => setModal({type: 'tuntutan-akhir', isOpen: true, data: t})} className="text-yellow-500"><PencilIcon className="h-5 w-5"/></button><button type="button" onClick={() => setDeleteConfirm({type: 'tuntutan-akhir', isOpen: true, data: t})} className="text-red-500"><TrashIcon className="h-5 w-5"/></button></td></tr>))}
                                 </tbody>
                             </table>
                        </div>
                    )}
                </div>
            </main>
            
            <footer className="flex-shrink-0 flex justify-end items-center p-4 bg-white border-t border-gray-200 space-x-3">
                <button type="button" onClick={onBack} className="px-8 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">Batal</button>
                <button type="button" onClick={handleSave} className="px-8 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">Simpan { { 'informasi-umum': 'Informasi Umum', 'putusan': 'Putusan', 'tuntutan-akhir': 'Tuntutan Akhir' }[activeTab] }</button>
            </footer>
        </div>
    );
};

export default EditPutusan;
