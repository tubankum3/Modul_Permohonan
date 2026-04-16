
import React, { useState, useEffect } from 'react';
import { PerkaraRecord, PosisiSidangEntry, Putusan, View, StatusPerkara, Majelis } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, XIcon, ChevronDownIcon, ChevronUpIcon, PrintIcon, DocumentTextIcon, EyeIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';

// CRUD Modal for Sidang and Putusan
const CrudModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void, title: string, initialData: any, fields: { name: string, label: string, type: string, options?: string[] }[] }> = ({ isOpen, onClose, onSave, title, initialData, fields }) => {
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
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <header className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><XIcon className="h-5 w-5" /></button>
                </header>
                <main className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            {field.type === 'textarea' ? <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" />
                            : field.type === 'select' ? <select name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">{field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
                            : field.type === 'radio' ? <div className="flex space-x-4">{field.options?.map(opt => <label key={opt} className="flex items-center"><input type="radio" name={field.name} value={opt} checked={formData[field.name] === opt} onChange={handleChange} className="mr-1" />{opt}</label>)}</div>
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
        const { type, tingkat } = modal;
        let list: any[] = [];
        let setList: (list: any[]) => void = () => {};

        if (type === 'sidang' && tingkat) {
            list = formData.posisiSidang?.[tingkat] || [];
            setList = (newList) => setFormData(prev => ({ ...prev, posisiSidang: { ...prev.posisiSidang, [tingkat]: newList } as PerkaraRecord['posisiSidang'] }));
        } else if (type === 'putusan') {
            list = formData.putusan || [];
            setList = (newList) => setFormData(prev => ({ ...prev, putusan: newList }));
        } else if (type === 'majelis') {
            list = formData.susunanMajelis || [];
            setList = (newList) => setFormData(prev => ({ ...prev, susunanMajelis: newList }));
        }
        
        if (data.id) { // Edit
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
        } else if (type === 'majelis') {
            list = formData.susunanMajelis || [];
            setList = (newList) => setFormData(prev => ({ ...prev, susunanMajelis: newList }));
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
                                            <button type="button" onClick={() => setModal({ type: 'sidang', isOpen: true, data: s, tingkat })} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><PencilIcon className="h-4 w-4"/></button>
                                            <button type="button" onClick={() => setDeleteConfirm({ type: 'sidang', isOpen: true, data: s, tingkat })} className="text-red-500 p-1 hover:bg-gray-200 rounded-full"><TrashIcon className="h-4 w-4"/></button>
                                            <button type="button" onClick={() => alert('Print action!')} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><PrintIcon className="h-4 w-4"/></button>
                                            <button type="button" onClick={() => onNavigate('pilihTemplate')} className="text-blue-500 p-1 hover:bg-gray-200 rounded-full"><DocumentTextIcon className="h-4 w-4"/></button>
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
             {modal.isOpen && (
                <CrudModal isOpen={modal.isOpen} onClose={() => setModal({ type: '', isOpen: false, data: null })} onSave={handleCrudSave}
                    title={`${modal.data.id ? 'Edit' : 'Tambah'} ${ { 'sidang': 'Posisi Sidang', 'putusan': 'Posisi Putusan', 'majelis': 'Majelis & Panitera' }[modal.type] }`}
                    initialData={modal.data}
                    fields={
                        modal.type === 'sidang' ? [ { name: 'suratTugas', label: 'Nomor Surat Tugas', type: 'text' }, { name: 'tanggalSuratTugas', label: 'Tanggal Surat Tugas', type: 'date' }, { name: 'agendaSidang', label: 'Agenda Sidang', type: 'text' }, { name: 'tanggalSidang', label: 'Tanggal Sidang', type: 'date' }, { name: 'agendaBerikutnya', label: 'Agenda Berikutnya', type: 'text' }, { name: 'tanggalSidangBerikutnya', label: 'Tanggal Sidang Berikutnya', type: 'date' }, { name: 'keterangan', label: 'Keterangan Beracara/Persidangan', type: 'textarea' } ]
                        : modal.type === 'putusan' ? [ { name: 'posisi', label: 'Posisi Putusan', type: 'select', options: ['Pertama', 'Banding', 'Kasasi', 'PK'] }, { name: 'nomor', label: 'Nomor Putusan', type: 'text' }, { name: 'tanggal', label: 'Tanggal Putusan', type: 'date' }, { name: 'pertimbanganHakim', label: 'Pertimbangan Hakim', type: 'textarea' }, { name: 'amar', label: 'Amar Putusan', type: 'textarea' }, { name: 'keterangan', label: 'Keterangan', type: 'textarea' }, { name: 'status', label: 'Status Putusan', type: 'radio', options: ['Menang', 'Kalah'] } ]
                        : modal.type === 'majelis' ? [ { name: 'jabatan', label: 'Jabatan Majelis', type: 'select', options: ['Hakim Ketua', 'Hakim Anggota', 'Hakim Mediator'] }, { name: 'identitas', label: 'Nama Identitas', type: 'text' } ]
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
                                <button type="button" onClick={() => setModal({ type: 'sidang', isOpen: true, data: { tingkat: 'tkPertama' }, tingkat: 'tkPertama' })} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center ml-auto"><PlusIcon className="h-4 w-4 mr-1"/>Sidang</button>
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
                                                <td className="py-2 px-3 border-b space-x-1">
                                                    <button type="button" onClick={() => {}} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><EyeIcon className="h-4 w-4"/></button>
                                                    <button type="button" onClick={() => setModal({type: 'putusan', isOpen: true, data: p})} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><PencilIcon className="h-4 w-4"/></button>
                                                    <button type="button" onClick={() => setDeleteConfirm({type: 'putusan', isOpen: true, data: p})} className="text-red-500 p-1 hover:bg-gray-200 rounded-full"><TrashIcon className="h-4 w-4"/></button>
                                                    <button type="button" onClick={() => alert('Print action!')} className="text-gray-500 p-1 hover:bg-gray-200 rounded-full"><PrintIcon className="h-4 w-4"/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr />
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-lg text-gray-700">Majelis & Panitera</h3>
                                    <button type="button" onClick={() => setModal({ type: 'majelis', isOpen: true, data: { jabatan: '', identitas: '' }})} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Majelis</button>
                                </div>
                                <table className="min-w-full bg-white border">
                                    <thead className="bg-gray-50"><tr>{['No', 'Jabatan Majelis', 'Identitas', 'Aksi'].map(h => <th key={h} className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">{h}</th>)}</tr></thead>
                                    <tbody>
                                        {(formData.susunanMajelis || []).map((m, i) => (
                                            <tr key={m.id}>
                                                <td className="py-2 px-4 border-b text-sm">{i + 1}</td>
                                                <td className="py-2 px-4 border-b text-sm">{m.jabatan}</td>
                                                <td className="py-2 px-4 border-b text-sm">{m.identitas}</td>
                                                <td className="py-2 px-4 border-b text-sm space-x-2">
                                                    <button type="button" onClick={() => setModal({type: 'majelis', isOpen: true, data: m})} className="text-yellow-500"><PencilIcon className="h-5 w-5"/></button>
                                                    <button type="button" onClick={() => setDeleteConfirm({type: 'majelis', isOpen: true, data: m})} className="text-red-500"><TrashIcon className="h-5 w-5"/></button>
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
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Dampak Putusan Tetap Kemenkeu/PemRI</label><textarea name="keteranganDampak" value={formData.statusBHT?.keteranganDampak || ''} onChange={handleBhtChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
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
