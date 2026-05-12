
import React, { useState, useEffect } from 'react';
import { PerkaraRecord, Pihak, Tuntutan, Majelis, StatusPerkara, AnalisisPerkara } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, XIcon, SearchIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import TarikDataNadineModal from './TarikDataNadineModal';

const referenceTags = ['Strategis', 'Non-Strategis', 'Penting', 'Perdata', 'Pidana', 'TUN', 'Penting Mendesak', 'Keuangan Negara'];

const WILAYAH_OPTIONS = ['Seluruh Indonesia', 'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku', 'Maluku Utara', 'Papua Barat', 'Papua'];
const PENGADILAN_OPTIONS = ['Pengadilan Negeri', 'Pengadilan Tinggi', 'Mahkamah Agung', 'Pengadilan Tata Usaha Negara', 'Pengadilan Tinggi Tata Usaha Negara', 'Pengadilan Agama', 'Pengadilan Tinggi Agama', 'Mahkamah Syar\'iyah', 'Pengadilan Pajak', 'Mahkamah Konstitusi'];
const JENIS_PERKARA_OPTIONS = ['Perdata', 'Pidana', 'Tata Usaha Negara', 'Uji Materiil', 'Perselisihan Hasil Pemilihan'];

const PERKARA_HIERARCHY: Record<string, Record<string, Record<string, string[]>>> = {
    'Perdata': {
        'Perbuatan Melawan Hukum': {
            'Ganti Rugi': ['Materiil', 'Immateriil'],
            'Wanprestasi': ['Jual Beli', 'Sewa Menyewa', 'Pinjam Meminjam']
        },
        'Waris': {
            'Sengketa': ['Tanah', 'Harta Bergerak']
        }
    },
    'Pidana': {
        'Korupsi': {
            'Gratifikasi': ['Aktif', 'Pasif'],
            'Suap': ['Pemberian', 'Penerimaan']
        }
    },
    'Tata Usaha Negara': {
        'Keputusan TUN': {
            'Kepegawaian': ['Pemberhentian', 'Mutasi'],
            'Perijinan': ['Pembatalan Ijin', 'Penolakan Ijin']
        }
    }
};

const POKOK_HIERARCHY: Record<string, Record<string, string[]>> = {
    'Keuangan Negara': {
        'Belanja Negara': ['Kontrak Pengadaan', 'Ganti Rugi Proyek'],
        'Penerimaan Negara': ['Pajak', 'PNBP']
    },
    'Aset Negara': {
        'Tanah dan Bangunan': ['Sengketa Lahan', 'Pengambilalihan Aset'],
        'Barang Milik Negara': ['Penghapusan Aset', 'Pemindahtanganan']
    }
};

const KELOMPOK_PIHAK_OPTIONS = ['Penggugat/Pemohon', 'Tergugat/Termohon', 'Turut Tergugat', 'Pihak Ketiga Intervensi'];
const JENIS_IDENTITAS_OPTIONS = ['Orang Perorangan', 'Badan Hukum (PT/CV)', 'Instansi Pemerintah', 'Organisasi Masa'];

const JENIS_OBJEK_TUNTUTAN_OPTIONS = ['Tanah', 'Bangunan', 'Uang/Dana', 'Aset Tetap/BMN', 'Aset Lainnya', 'Sita Jaminan', 'Lain-lain'];
const JENIS_TUNTUTAN_OPTIONS = ['Materiil', 'Immateriil', 'Dwangsom'];
const SATUAN_MATA_UANG_OPTIONS = ['IDR - Rupiah', 'USD - US Dollar', 'EUR - Euro', 'JPY - Yen', 'Lainnya'];

const PREFILL_RINCIAN = `1. Dasar Hukum
2. What (Masalah dan Objek Perkara)
3. Who (Para Pihak)
4. Where (Lokasi)
5. When
6. Why (Latar Belakang atau Penyebab)
7. How (Penjelasan mengenai proses atau kronologi)`;

const PREFILL_ANALISA = `1. Formil (Prosedur): 
2. Materiil (Substansi): 
3. Strategi Bantahan dan Penanganan`;

const PREFILL_RISIKO = `1. Risiko
2. Mitigasi`;

const SimpleRichText: React.FC<{ value: string, onChange: (val: string) => void, label?: string, rows?: number }> = ({ value, onChange, label, rows = 6 }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
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

// Shared Modal for Pihak, Tuntutan, Majelis
const CrudModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void, title: string, initialData: any, fields: { name: string, label: string, type: string, options?: (string | number)[] }[] }> = ({ isOpen, onClose, onSave, title, initialData, fields }) => {
    const [formData, setFormData] = useState(initialData);
    useEffect(() => { setFormData(initialData) }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><XIcon className="h-5 w-5" /></button>
                </header>
                <main className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {fields.map(field => (
                        <div key={field.name}>
                            {field.type === 'rich' ? (
                                <SimpleRichText label={field.label} value={formData[field.name] || ''} onChange={(val) => handleChange(field.name, val)} rows={4} />
                            ) : (
                                <>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <select name={field.name} value={formData[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                            <option value="">Pilih {field.label}</option>
                                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </main>
                <footer className="flex justify-end items-center p-4 bg-gray-50 space-x-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">Batal</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">Simpan</button>
                </footer>
            </form>
        </div>
    );
};


// Main Component
interface EditPerkaraProps {
    initialData: PerkaraRecord | Partial<PerkaraRecord> | null;
    onSave: (record: PerkaraRecord) => void;
    onBack: () => void;
}

type EditTab = 'abstraksi' | 'pihak' | 'tuntutan' | 'analisis';

const EditPerkara: React.FC<EditPerkaraProps> = ({ initialData, onSave, onBack }) => {
    const [formData, setFormData] = useState<Partial<PerkaraRecord>>({});
    const [activeTab, setActiveTab] = useState<EditTab>('abstraksi');
    const [modal, setModal] = useState<{ type: string, isOpen: boolean, data: any }>({ type: '', isOpen: false, data: null });
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, isOpen: boolean, data: any }>({ type: '', isOpen: false, data: null });
    const [isNadineModalOpen, setIsNadineModalOpen] = useState(false);

    useEffect(() => {
        const isNewRecordFromPermohonan = initialData && !initialData.statusPerkara;
        const defaultAbstraksi = {
            tahunMasuk: new Date().getFullYear(),
            tanggalPendaftaranGugatan: new Date().toLocaleDateString('en-CA'),
            rincianPokokPerkara: PREFILL_RINCIAN,
        };
        const defaultAnalisis = {
            isuKrusial: '',
            analisaHukum: PREFILL_ANALISA,
            potensiDampak: '',
            risiko: 'Rendah' as const,
            keteranganRisiko: PREFILL_RISIKO,
            analisisSementara: '',
            kesimpulanSementara: '',
        };
        
        const abstraksiFromPermohonan = isNewRecordFromPermohonan ? {
            ...defaultAbstraksi,
            noPerkara: initialData.Nomor,
            rincianPokokPerkara: initialData.uraian || PREFILL_RINCIAN,
        } : {};
        
        setFormData({
            ...initialData,
            abstraksiPerkara: {
                ...defaultAbstraksi,
                ...(initialData?.abstraksiPerkara || {}),
                ...abstraksiFromPermohonan,
            },
            analisisPerkara: {
                ...defaultAnalisis,
                ...(initialData?.analisisPerkara || {}),
            }
        });
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newAbstraksi = {
                ...prev.abstraksiPerkara,
                [name]: value,
            };

            // Hierarchy 1: Perkara Classification
            if (name === 'jenisPerkara') {
                newAbstraksi.klasifikasiPerkara = '';
                newAbstraksi.subKlasifikasiPerkara = '';
                newAbstraksi.subSubKlasifikasiPerkara = '';
            } else if (name === 'klasifikasiPerkara') {
                newAbstraksi.subKlasifikasiPerkara = '';
                newAbstraksi.subSubKlasifikasiPerkara = '';
            } else if (name === 'subKlasifikasiPerkara') {
                newAbstraksi.subSubKlasifikasiPerkara = '';
            }

            // Hierarchy 2: Pokok Perkara
            if (name === 'jenisPokokPerkara') {
                newAbstraksi.subPokokPerkara = '';
                newAbstraksi.subSubPokokPerkara = '';
            } else if (name === 'subPokokPerkara') {
                newAbstraksi.subSubPokokPerkara = '';
            }

            return {
                ...prev,
                abstraksiPerkara: newAbstraksi,
            };
        });
    };

    const handleAnalisisChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            analisisPerkara: {
                ...prev.analisisPerkara,
                [name]: value,
            },
        }));
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
        }

        const itemToDelete = list.find(item => item.id === data.id);
        
        setList(list.filter(item => item.id !== data.id));

        if (itemToDelete?.unitBerperkara === 'Ya') {
            setFormData(prev => {
                const pihakType = type.split('-')[1] as 'P' | 'T';
                const otherPihakType = pihakType === 'P' ? 'pihakT' : 'pihakP';
                
                // Get remaining identities from the updated lists
                const remainingCurrentList = (prev[pihakType === 'P' ? 'pihakP' : 'pihakT'] || []).filter(item => item.id !== data.id);
                const otherPihakList = prev[otherPihakType] || [];

                const allCheckedNames = [
                    ...remainingCurrentList.filter(item => item.unitBerperkara === 'Ya').map(item => item.identitas),
                    ...otherPihakList.filter(item => item.unitBerperkara === 'Ya').map(item => item.identitas)
                ];

                return {
                    ...prev,
                    abstraksiPerkara: {
                        ...prev.abstraksiPerkara,
                        unitInternal: allCheckedNames.join(', ')
                    }
                };
            });
        }

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
                    <thead className="bg-gray-50"><tr>{['Principal', 'Urutan', 'Kelompok', 'Jenis ID', 'Nama Identitas', 'Aksi'].map(h => <th key={h} className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">{h}</th>)}</tr></thead>
                    <tbody>
                        {(data || []).map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-2 px-4 border-b text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={p.unitBerperkara === 'Ya'} 
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            const pihakType = type === 'P' ? 'pihakP' : 'pihakT';
                                            const otherType = type === 'P' ? 'pihakT' : 'pihakP';
                                            
                                            setFormData(prev => {
                                                const currentList = prev[pihakType] || [];
                                                const otherList = prev[otherType] || [];

                                                const updatedCurrentList = currentList.map(item => 
                                                    item.id === p.id ? { ...item, unitBerperkara: isChecked ? 'Ya' : 'Tidak' } : item
                                                );

                                                // Get all identities who are marked as unitBerperkara in both P and T lists
                                                const allCheckedNames = [
                                                    ...updatedCurrentList.filter(item => item.unitBerperkara === 'Ya').map(item => item.identitas),
                                                    ...otherList.filter(item => item.unitBerperkara === 'Ya').map(item => item.identitas)
                                                ];

                                                return {
                                                    ...prev,
                                                    [pihakType]: updatedCurrentList,
                                                    abstraksiPerkara: {
                                                        ...prev.abstraksiPerkara,
                                                        unitInternal: allCheckedNames.join(', ')
                                                    }
                                                };
                                            });
                                        }}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b text-sm font-semibold">{p.urutan}</td>
                                <td className="py-2 px-4 border-b text-sm">{p.kelompokPihak}</td>
                                <td className="py-2 px-4 border-b text-sm">{p.jenisIdentitas}</td>
                                <td className="py-2 px-4 border-b text-sm">{p.identitas}</td>
                                <td className="py-2 px-4 border-b text-sm space-x-2">
                                    <button type="button" onClick={() => setModal({type: `pihak-${type}`, isOpen: true, data: p})} className="p-1 text-yellow-500 hover:bg-yellow-50 rounded"><PencilIcon className="h-5 w-5"/></button>
                                    <button type="button" onClick={() => setDeleteConfirm({type: `pihak-${type}`, isOpen: true, data: p})} className="p-1 text-red-500 hover:bg-red-50 rounded"><TrashIcon className="h-5 w-5"/></button>
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
                    title={`${modal.data.id ? 'Edit' : 'Tambah'} ${ { 'pihak-P': 'Pihak P', 'pihak-T': 'Pihak T', 'tuntutan': 'Objek Tuntutan' }[modal.type] }`}
                    initialData={modal.data}
                    fields={
                        modal.type.startsWith('pihak') ? [ 
                            { name: 'kelompokPihak', label: 'Kelompok Para Pihak', type: 'select', options: KELOMPOK_PIHAK_OPTIONS },
                            { name: 'urutan', label: 'Urutan', type: 'select', options: [1,2,3,4,5,6,7,8,9,10] },
                            { name: 'jenisIdentitas', label: 'Jenis Identitas', type: 'select', options: JENIS_IDENTITAS_OPTIONS },
                            { name: 'identitas', label: 'Nama Identitas', type: 'text' },
                            { name: 'keterangan', label: 'Keterangan Kuasa Hukum', type: 'rich' }
                        ]
                        : modal.type === 'tuntutan' ? [ 
                            { name: 'jenisObjekTuntutan', label: 'Jenis Objek Tuntutan', type: 'select', options: JENIS_OBJEK_TUNTUTAN_OPTIONS }, 
                            { name: 'jenis', label: 'Jenis Tuntutan', type: 'select', options: JENIS_TUNTUTAN_OPTIONS }, 
                            { name: 'satuan', label: 'Satuan/Mata Uang', type: 'select', options: SATUAN_MATA_UANG_OPTIONS }, 
                            { name: 'jumlahNominal', label: 'Jumlah/Nominal', type: 'number' }, 
                            { name: 'keterangan', label: 'Keterangan', type: 'rich' } 
                        ]
                        : []
                    }
                />
            )}
            <TarikDataNadineModal 
                isOpen={isNadineModalOpen} 
                onClose={() => setIsNadineModalOpen(false)} 
                onTarikData={(suratList) => {
                    if (suratList.length > 0) {
                        const surat = suratList[0];
                        setFormData(prev => ({
                            ...prev,
                            abstraksiPerkara: {
                                ...prev.abstraksiPerkara,
                                nomorSuratKuasaKhusus: surat.nomorSurat
                            }
                        }));
                    }
                }} 
            />
            {deleteConfirm.isOpen && <ConfirmationModal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ type: '', isOpen: false, data: null })} onConfirm={handleDelete} title="Konfirmasi Hapus" message="Apakah Anda yakin ingin menghapus item ini?" confirmText="Hapus" />}
            
            <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1 mr-2">
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-800">
                         {formData.statusPerkara ? 'Edit Informasi Perkara' : 'Rekam Perkara Baru'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.abstraksiPerkara?.noPerkara || formData.Nomor} - {formData.perihal}
                    </p>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-6">
                <div className="bg-blue-600 rounded-t-lg px-4 pt-2">
                    <TabButton tab="abstraksi" label="Abstraksi" />
                    <TabButton tab="pihak" label="Para Pihak" />
                    <TabButton tab="tuntutan" label="Objek Tuntutan" />
                    <TabButton tab="analisis" label="Analisis" />
                </div>
                <div className="bg-white p-6 rounded-b-lg border-x border-b border-gray-200 shadow-sm">
                    {activeTab === 'abstraksi' && (
                        <div className="flex flex-col gap-5 max-w-3xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Masuk</label>
                                <input type="number" name="tahunMasuk" value={formData.abstraksiPerkara?.tahunMasuk || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Perkara</label>
                                <input type="text" name="noPerkara" value={formData.abstraksiPerkara?.noPerkara || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pendaftaran Perkara</label>
                                <input type="date" name="tanggalPendaftaranGugatan" value={formData.abstraksiPerkara?.tanggalPendaftaranGugatan || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat Kuasa Khusus</label>
                                <div className="flex gap-2">
                                    <input type="text" name="nomorSuratKuasaKhusus" value={formData.abstraksiPerkara?.nomorSuratKuasaKhusus || ''} onChange={handleInputChange} className="flex-1 p-2 border border-gray-300 rounded-md" />
                                    <button type="button" onClick={() => setIsNadineModalOpen(true)} className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center">
                                        <SearchIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah</label>
                                <select name="wilayah" value={formData.abstraksiPerkara?.wilayah || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">Pilih Wilayah</option>
                                    {WILAYAH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pengadilan</label>
                                <select name="pengadilan" value={formData.abstraksiPerkara?.pengadilan || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">Pilih Pengadilan</option>
                                    {PENGADILAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Perkara (Lv 1)</label>
                                <select name="jenisPerkara" value={formData.abstraksiPerkara?.jenisPerkara || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">Pilih Jenis Perkara</option>
                                    {Object.keys(PERKARA_HIERARCHY).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>

                            {formData.abstraksiPerkara?.jenisPerkara && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Klasifikasi Perkara (Lv 2)</label>
                                    <select name="klasifikasiPerkara" value={formData.abstraksiPerkara?.klasifikasiPerkara || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                        <option value="">Pilih Klasifikasi</option>
                                        {Object.keys(PERKARA_HIERARCHY[formData.abstraksiPerkara.jenisPerkara] || {}).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            )}

                            {formData.abstraksiPerkara?.klasifikasiPerkara && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Klasifikasi Perkara (Lv 3)</label>
                                    <select name="subKlasifikasiPerkara" value={formData.abstraksiPerkara?.subKlasifikasiPerkara || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                        <option value="">Pilih Sub Klasifikasi</option>
                                        {Object.keys(PERKARA_HIERARCHY[formData.abstraksiPerkara.jenisPerkara!][formData.abstraksiPerkara.klasifikasiPerkara] || {}).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            )}

                            {formData.abstraksiPerkara?.subKlasifikasiPerkara && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Sub Klasifikasi Perkara (Lv 4)</label>
                                    <select name="subSubKlasifikasiPerkara" value={formData.abstraksiPerkara?.subSubKlasifikasiPerkara || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                        <option value="">Pilih Sub-Sub Klasifikasi</option>
                                        {(PERKARA_HIERARCHY[formData.abstraksiPerkara.jenisPerkara!][formData.abstraksiPerkara.klasifikasiPerkara!] [formData.abstraksiPerkara.subKlasifikasiPerkara] || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            )}

                            <div className="border-t border-gray-100 my-2"></div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pokok Perkara (Lv 1)</label>
                                <select name="jenisPokokPerkara" value={formData.abstraksiPerkara?.jenisPokokPerkara || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">Pilih Jenis Pokok</option>
                                    {Object.keys(POKOK_HIERARCHY).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>

                            {formData.abstraksiPerkara?.jenisPokokPerkara && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Pokok Perkara (Lv 2)</label>
                                    <select name="subPokokPerkara" value={formData.abstraksiPerkara?.subPokokPerkara || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                        <option value="">Pilih Sub Pokok</option>
                                        {Object.keys(POKOK_HIERARCHY[formData.abstraksiPerkara.jenisPokokPerkara] || {}).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            )}

                            {formData.abstraksiPerkara?.subPokokPerkara && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Sub Pokok Perkara (Lv 3)</label>
                                    <select name="subSubPokokPerkara" value={formData.abstraksiPerkara?.subSubPokokPerkara || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                        <option value="">Pilih Sub-Sub Pokok</option>
                                        {(POKOK_HIERARCHY[formData.abstraksiPerkara.jenisPokokPerkara!][formData.abstraksiPerkara.subPokokPerkara] || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            )}
                            
                            <div>
                                <SimpleRichText 
                                    label="Rincian Pokok Perkara" 
                                    value={formData.abstraksiPerkara?.rincianPokokPerkara || ''} 
                                    onChange={(val) => setFormData(prev => ({ ...prev, abstraksiPerkara: { ...prev.abstraksiPerkara, rincianPokokPerkara: val } }))} 
                                />
                            </div>
                            <div>
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
                    )}
                    {activeTab === 'pihak' && (
                        <div className="space-y-6">
                            <PihakSection type="P" />
                            <PihakSection type="T" />
                            
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Unit Principal</label>
                                <div className="max-w-2xl flex items-stretch border border-gray-300 rounded-md overflow-hidden shadow-sm hover:border-blue-400 transition-colors">
                                    <div className="bg-blue-600 text-white px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-700">
                                        <span className="text-sm font-semibold whitespace-nowrap">Unit Internal</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 relative flex items-center">
                                        <input 
                                            type="text" 
                                            value={formData.abstraksiPerkara?.unitInternal || ''} 
                                            onChange={(e) => setFormData(prev => ({ 
                                                ...prev, 
                                                abstraksiPerkara: { ...prev.abstraksiPerkara, unitInternal: e.target.value } 
                                            }))}
                                            className="w-full h-full px-4 py-2 text-sm text-gray-700 focus:outline-none"
                                            placeholder="Cari di unit internal"
                                        />
                                        <button className="absolute right-3 text-gray-400 hover:text-blue-600">
                                            <SearchIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-500 italic">
                                    * Cari Unit Principal pemilik perkara di lingkungan Kementerian Keuangan apabila tidak termasuk dalam Tabel Pihak.
                                </p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'tuntutan' && (
                        <div>
                             <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-lg">Objek Tuntutan</h3><button type="button" onClick={() => setModal({ type: 'tuntutan', isOpen: true, data: {} })} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Objek Tuntutan</button></div>
                            <table className="min-w-full bg-white border"><thead className="bg-gray-50"><tr>{['No', 'Jenis Objek', 'Tuntutan', 'Satuan', 'Jumlah', 'Aksi'].map(h => <th key={h} className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">{h}</th>)}</tr></thead>
                                <tbody>
                                    {(formData.tuntutan || []).map((t, i) => (<tr key={t.id}><td className="py-2 px-4 border-b text-sm">{i + 1}</td><td className="py-2 px-4 border-b text-sm">{t.jenisObjekTuntutan}</td><td className="py-2 px-4 border-b text-sm">{t.jenis}</td><td className="py-2 px-4 border-b text-sm">{t.satuan}</td><td className="py-2 px-4 border-b text-sm font-mono">{t.jumlahNominal?.toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b text-sm space-x-2"><button type="button" onClick={() => setModal({type: 'tuntutan', isOpen: true, data: t})} className="text-yellow-500"><PencilIcon className="h-5 w-5"/></button><button type="button" onClick={() => setDeleteConfirm({type: 'tuntutan', isOpen: true, data: t})} className="text-red-500"><TrashIcon className="h-5 w-5"/></button></td></tr>))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === 'analisis' && (
                        <div className="space-y-6">
                            <SimpleRichText label="Isu Krusial" value={formData.analisisPerkara?.isuKrusial || ''} onChange={(val) => handleAnalisisChange('isuKrusial', val)} />
                            <SimpleRichText label="Analisa Hukum" value={formData.analisisPerkara?.analisaHukum || ''} onChange={(val) => handleAnalisisChange('analisaHukum', val)} />
                            <SimpleRichText label="Potensi Dampak bagi Kemenkeu" value={formData.analisisPerkara?.potensiDampak || ''} onChange={(val) => handleAnalisisChange('potensiDampak', val)} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Risiko</label>
                                <div className="flex gap-4">
                                    {['Rendah', 'Sedang', 'Tinggi'].map(level => (
                                        <label key={level} className="flex items-center space-x-2 cursor-pointer">
                                            <input type="radio" name="risiko" value={level} checked={formData.analisisPerkara?.risiko === level} onChange={(e) => handleAnalisisChange('risiko', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                            <span className={`text-sm font-medium ${level === 'Tinggi' ? 'text-red-600' : level === 'Sedang' ? 'text-yellow-600' : 'text-green-600'}`}>{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <SimpleRichText label="Keterangan Risiko" value={formData.analisisPerkara?.keteranganRisiko || ''} onChange={(val) => handleAnalisisChange('keteranganRisiko', val)} />
                            <SimpleRichText label="Analisis Sementara" value={formData.analisisPerkara?.analisisSementara || ''} onChange={(val) => handleAnalisisChange('analisisSementara', val)} />
                            <SimpleRichText label="Kesimpulan Sementara" value={formData.analisisPerkara?.kesimpulanSementara || ''} onChange={(val) => handleAnalisisChange('kesimpulanSementara', val)} />
                        </div>
                    )}
                </div>
            </main>
            
            <footer className="flex-shrink-0 flex justify-end items-center p-4 bg-white border-t border-gray-200 space-x-3">
                <button type="button" onClick={onBack} className="px-8 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">Batal</button>
                <button type="button" onClick={handleSave} className="px-8 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">Simpan { {abstraksi: 'Abstraksi', pihak: 'Pihak', tuntutan: 'Tuntutan', analisis: 'Analisis'}[activeTab as EditTab] }</button>
            </footer>
        </div>
    );
};

export default EditPerkara;
