

import React, { useState, useEffect, useMemo } from 'react';
import { SearchIcon, XIcon, PlusIcon } from './icons';

// FIX: Rename TeamMember to Personnel to avoid conflicts with the global TeamMember type.
export interface Personnel {
  id: string;
  name: string;
  eselon1: string;
  eselon2: string;
  eselon3?: string;
  eselon4?: string;
  role: string;
}

interface AssignTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    // FIX: Update onSave to use the local Personnel type.
    onSave: (team: Personnel[]) => void;
    // FIX: Update initialSelectedMembers to use the local Personnel type.
    initialSelectedMembers: Personnel[];
}

// FIX: Export ALL_PERSONNEL so it can be used for mapping in the parent component.
export const ALL_PERSONNEL: Personnel[] = [
  { id: '001', name: 'Andi Pratama', eselon1: 'Direktorat Jenderal Pajak', eselon2: 'Kanwil DJP Jakarta Pusat', eselon3: 'KPP Pratama Jakarta Menteng Satu', role: 'Analis Hukum' },
  { id: '002', name: 'Budi Santoso', eselon1: 'Direktorat Jenderal Pajak', eselon2: 'Kanwil DJP Jakarta Selatan I', eselon3: 'KPP Pratama Jakarta Setiabudi Dua', role: 'Penelaah Kebijakan' },
  { id: '003', name: 'Citra Lestari', eselon1: 'Direktorat Jenderal Bea dan Cukai', eselon2: 'Kantor Pusat DJBC', eselon3: 'Direktorat Teknis Kepabeanan', role: 'Kepala Seksi' },
  { id: '004', name: 'Dewi Anggraini', eselon1: 'Direktorat Jenderal Bea dan Cukai', eselon2: 'KPU Bea dan Cukai Tipe A Tanjung Priok', eselon3: 'Seksi Penindakan dan Penyidikan', role: 'Analis Hukum' },
  { id: '005', name: 'Eko Wijoyo', eselon1: 'Direktorat Jenderal Perbendaharaan', eselon2: 'Direktorat Sistem Perbendaharaan', eselon3: 'Subdirektorat Pengembangan Sistem', role: 'Kepala Subdirektorat' },
  { id: '006', name: 'Fajar Nugroho', eselon1: 'Direktorat Jenderal Perbendaharaan', eselon2: 'Kanwil DJPb Provinsi DKI Jakarta', eselon3: 'Bidang Pembinaan Pelaksanaan Anggaran I', role: 'Analis Hukum' },
  { id: '007', name: 'Gita Permata', eselon1: 'Direktorat Jenderal Kekayaan Negara', eselon2: 'Kantor Pusat DJKN', role: 'Penelaah Kebijakan' },
  { id: '008', name: 'Hadi Wibowo', eselon1: 'Badan Kebijakan Fiskal', eselon2: 'Pusat Kebijakan APBN', role: 'Analis Kebijakan' },
  { id: '009', name: 'Indah Cahyani', eselon1: 'Badan Kebijakan Fiskal', eselon2: 'Pusat Kebijakan Sektor Keuangan', role: 'Analis Hukum' },
  { id: '010', name: 'Joko Susilo', eselon1: 'Direktorat Jenderal Pajak', eselon2: 'Kanwil DJP Wajib Pajak Besar', eselon3: 'KPP Wajib Pajak Besar Empat', role: 'Kepala Seksi' },
  { id: '011', name: 'Kurniawan Prasetyo', eselon1: 'Direktorat Jenderal Perbendaharaan', eselon2: 'Direktorat Sistem Perbendaharaan', eselon3: 'Subdirektorat Pengembangan Sistem', eselon4: 'Seksi Pengembangan Aplikasi', role: 'Staff' },
  { id: '012', name: 'Lina Marlina', eselon1: 'Direktorat Jenderal Bea dan Cukai', eselon2: 'Kantor Pusat DJBC', eselon3: 'Direktorat Teknis Kepabeanan', eselon4: 'Subdirektorat Klasifikasi Barang', role: 'Staff Pelaksana' },
];

const eselon1Options = ['Semua', ...new Set(ALL_PERSONNEL.map(p => p.eselon1))];


const AssignTeamModal: React.FC<AssignTeamModalProps> = ({ isOpen, onClose, onSave, initialSelectedMembers }) => {
    const [selectionType, setSelectionType] = useState('pegawai');
    const [searchTerm, setSearchTerm] = useState('');
    const [eselon1, setEselon1] = useState('Semua');
    const [eselon2, setEselon2] = useState('Semua');
    const [eselon3, setEselon3] = useState('Semua');
    const [eselon4, setEselon4] = useState('Semua');
    // FIX: Use the renamed Personnel type for state.
    const [selectedMembers, setSelectedMembers] = useState<Personnel[]>([]);

    useEffect(() => {
        setSelectedMembers(initialSelectedMembers);
    }, [isOpen, initialSelectedMembers]);

    const eselon2Options = useMemo(() => {
        if (eselon1 === 'Semua') return ['Semua'];
        return ['Semua', ...new Set(ALL_PERSONNEL.filter(p => p.eselon1 === eselon1).map(p => p.eselon2))];
    }, [eselon1]);

    const eselon3Options = useMemo(() => {
        if (eselon2 === 'Semua') return ['Semua'];
        return ['Semua', ...new Set(ALL_PERSONNEL.filter(p => p.eselon1 === eselon1 && p.eselon2 === eselon2 && p.eselon3).map(p => p.eselon3!))];
    }, [eselon1, eselon2]);

    const eselon4Options = useMemo(() => {
        if (eselon3 === 'Semua') return ['Semua'];
        return ['Semua', ...new Set(ALL_PERSONNEL.filter(p => p.eselon1 === eselon1 && p.eselon2 === eselon2 && p.eselon3 === eselon3 && p.eselon4).map(p => p.eselon4!))];
    }, [eselon1, eselon2, eselon3]);

    const availablePersonnel = useMemo(() => {
        if (selectionType === 'tim') return [];
        
        const selectedIds = new Set(selectedMembers.map(m => m.id));
        return ALL_PERSONNEL.filter(p => {
            const isSelected = selectedIds.has(p.id);
            if (isSelected) return false;

            const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const eselon1Match = eselon1 === 'Semua' || p.eselon1 === eselon1;
            const eselon2Match = eselon2 === 'Semua' || p.eselon2 === eselon2;
            const eselon3Match = eselon3 === 'Semua' || p.eselon3 === eselon3;
            const eselon4Match = eselon4 === 'Semua' || p.eselon4 === eselon4;

            return nameMatch && eselon1Match && eselon2Match && eselon3Match && eselon4Match;
        });
    }, [searchTerm, eselon1, eselon2, eselon3, eselon4, selectedMembers, selectionType]);
    
    const handleReset = () => {
        setSearchTerm('');
        setEselon1('Semua');
        setEselon2('Semua');
        setEselon3('Semua');
        setEselon4('Semua');
    };

    // FIX: Use the renamed Personnel type for the member parameter.
    const handleAddMember = (member: Personnel) => {
        setSelectedMembers(prev => [...prev, member]);
    };

    const handleRemoveMember = (memberId: string) => {
        setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
    };

    const handleSave = () => {
        onSave(selectedMembers);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">Pilih Anggota Tim</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <XIcon className="h-6 w-6 text-gray-600" />
                    </button>
                </header>
                
                <div className="p-4 bg-white border-b border-gray-200 space-y-4">
                    <div>
                        <select 
                            value={selectionType} 
                            onChange={e => setSelectionType(e.target.value)} 
                            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
                        >
                            <option value="pegawai">Pegawai</option>
                            <option value="tim" disabled>Tim (coming soon)</option>
                        </select>
                    </div>

                    {selectionType === 'pegawai' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Eselon 1</label>
                                    <select value={eselon1} onChange={e => { setEselon1(e.target.value); setEselon2('Semua'); setEselon3('Semua'); setEselon4('Semua'); }} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                        {eselon1Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Eselon 2</label>
                                    <select value={eselon2} onChange={e => { setEselon2(e.target.value); setEselon3('Semua'); setEselon4('Semua'); }} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                        {eselon2Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Eselon 3</label>
                                    <select value={eselon3} onChange={e => { setEselon3(e.target.value); setEselon4('Semua'); }} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                        {eselon3Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Eselon 4</label>
                                    <select value={eselon4} onChange={e => setEselon4(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                        {eselon4Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-end space-x-2">
                                 <div className="relative flex-grow">
                                    <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari Personal" 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <button onClick={handleReset} className="text-sm text-yellow-600 hover:underline font-semibold whitespace-nowrap">Reset</button>
                            </div>
                        </>
                    )}
                </div>

                <main className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-hidden">
                    <div className="bg-white rounded-lg border border-gray-200 flex flex-col">
                        <h3 className="p-3 font-semibold text-gray-700 border-b">Daftar Personal</h3>
                        <ul className="overflow-y-auto flex-1 p-2 space-y-1">
                            {availablePersonnel.length > 0 ? availablePersonnel.map(p => (
                                <li key={p.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.eselon2}</p>
                                    </div>
                                    <button onClick={() => handleAddMember(p)} className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                                        <PlusIcon className="h-5 w-5" />
                                    </button>
                                </li>
                            )) : 
                            <div className="text-center text-gray-500 p-4 h-full flex flex-col justify-center items-center">
                                <p>Silahkan masukan keyword pencarian terlebih dahulu</p>
                            </div>
                            }
                        </ul>
                    </div>
                     <div className="bg-white rounded-lg border border-gray-200 flex flex-col">
                        <h3 className="p-3 font-semibold text-gray-700 border-b">Tim Terpilih ({selectedMembers.length})</h3>
                        <ul className="overflow-y-auto flex-1 p-2 space-y-1">
                            {selectedMembers.length > 0 ? selectedMembers.map(p => (
                                <li key={p.id} className="flex items-center justify-between p-2 rounded-md bg-blue-50">
                                    <div>
                                        <p className="font-medium text-blue-800">{p.name}</p>
                                        <p className="text-xs text-blue-600">{p.eselon2}</p>
                                    </div>
                                    <button onClick={() => handleRemoveMember(p.id)} className="p-1 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600">
                                        <XIcon className="h-5 w-5" />
                                    </button>
                                </li>
                            )) : 
                            <div className="text-center text-gray-500 p-4 h-full flex flex-col justify-center items-center">
                                <p>Tidak ada data yang ditampilkan</p>
                            </div>
                            }
                        </ul>
                    </div>
                </main>

                <footer className="flex justify-end items-center p-4 border-t border-gray-200 bg-white rounded-b-lg space-x-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Batal</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold">Simpan</button>
                </footer>
            </div>
        </div>
    );
};

export default AssignTeamModal;