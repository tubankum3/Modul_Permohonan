
import React, { useState, useEffect } from 'react';
import { PosisiUpdate } from '../types';
import { XIcon } from './icons';

interface UpdatePosisiModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (posisi: Omit<PosisiUpdate, 'id' | 'timestamp'>) => void;
    initialData?: PosisiUpdate | null;
}

const initialState = {
    suratTugas: '',
    tanggalSuratTugas: '',
    agenda: '',
    tanggalAgenda: '',
    pemanggilDanSurat: { pemanggil: '', surat: '' },
    lokasi: '',
    durasi: 0,
    rincian: ''
};

const UpdatePosisiModal: React.FC<UpdatePosisiModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (initialData) {
            setFormData({
                suratTugas: initialData.suratTugas,
                tanggalSuratTugas: initialData.tanggalSuratTugas || '',
                agenda: initialData.agenda,
                tanggalAgenda: initialData.tanggalAgenda || '',
                pemanggilDanSurat: initialData.pemanggilDanSurat,
                lokasi: initialData.lokasi,
                durasi: initialData.durasi,
                rincian: initialData.rincian,
            });
        } else {
            setFormData(initialState);
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const val = name === 'durasi' ? parseInt(value, 10) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };
    
    const handlePemanggilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            pemanggilDanSurat: { ...prev.pemanggilDanSurat, [name]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setFormData(initialState);
    };

    if (!isOpen) return null;

    const title = initialData ? 'Edit Posisi Pendampingan' : 'Tambah Posisi Pendampingan';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <header className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><XIcon className="h-6 w-6" /></button>
                    </header>
                    <main className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Surat Tugas</label>
                            <input type="text" name="suratTugas" value={formData.suratTugas} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat Tugas</label>
                            <input type="date" name="tanggalSuratTugas" value={formData.tanggalSuratTugas} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
                            <input type="text" name="agenda" value={formData.agenda} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Agenda</label>
                            <input type="date" name="tanggalAgenda" value={formData.tanggalAgenda} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pemanggil</label>
                            <input type="text" name="pemanggil" value={formData.pemanggilDanSurat.pemanggil} onChange={handlePemanggilChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Surat Pemanggilan</label>
                            <input type="text" name="surat" value={formData.pemanggilDanSurat.surat} onChange={handlePemanggilChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                            <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Menit)</label>
                            <input type="number" name="durasi" value={formData.durasi} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rincian Pelaksanaan</label>
                            <textarea name="rincian" value={formData.rincian} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                    </main>
                    <footer className="flex justify-end items-center p-4 bg-gray-50 space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">Batal</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">Simpan</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default UpdatePosisiModal;
