import React, { useState, useEffect } from 'react';
import { PendampinganRecord, Permohonan, StatusPendampingan } from '../types';
import { XIcon } from './icons';

interface FormPendampinganModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: PendampinganRecord) => void;
    initialData: PendampinganRecord | Permohonan | null;
}

const FormPendampinganModal: React.FC<FormPendampinganModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Partial<PendampinganRecord>>({});

    useEffect(() => {
        if (initialData) {
            const isPendampinganRecord = 'statusPendampingan' in initialData;
            setFormData({
                ...initialData,
                statusPendampingan: isPendampinganRecord ? initialData.statusPendampingan : StatusPendampingan.AKTIF, // Ensure status is set
                abstraksi: isPendampinganRecord ? initialData.abstraksi : {
                    tahunMasuk: new Date(initialData.tanggal).getFullYear(),
                    nomorTiket: initialData.Nomor || initialData.id,
                    unitPemanggil: '',
                    unitPemohon: initialData.unit,
                    pihakDipanggil: '',
                    wilayah: '',
                    pokokPermasalahan: initialData.perihal,
                    keterangan: initialData.uraian,
                }
            });
        } else {
            // For new record from scratch
            setFormData({
                 statusPendampingan: StatusPendampingan.AKTIF, // Default status
                 perihal: '',
                 abstraksi: {
                    tahunMasuk: new Date().getFullYear(),
                    nomorTiket: '',
                    unitPemanggil: '',
                    unitPemohon: '',
                    pihakDipanggil: '',
                    wilayah: '',
                    pokokPermasalahan: '',
                    keterangan: '',
                }
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newAbstraksi = {
                ...(prev.abstraksi || {}),
                [name]: value
            };

            const newState: Partial<PendampinganRecord> = {
                ...prev,
                abstraksi: newAbstraksi,
            };
            
            if (name === 'pokokPermasalahan') {
                newState.perihal = value;
            }

            return newState;
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as PendampinganRecord);
    };

    if (!isOpen) return null;

    const isEditing = initialData && 'statusPendampingan' in initialData;
    const title = isEditing ? 'Edit Informasi Pendampingan' : (initialData ? 'Rekam Pendampingan Baru' : 'Tambah Pendampingan Baru');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <header className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><XIcon className="h-6 w-6" /></button>
                    </header>
                    <main className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            {Object.entries(formData.abstraksi || {}).map(([key, value]) => {
                                let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                if (key === 'nomorTiket') {
                                    label = 'Nomor Tiket / Nota Dinas';
                                }
                                const isTextarea = ['pokokPermasalahan', 'keterangan'].includes(key);
                                return (
                                    <div key={key}>
                                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                        {isTextarea ? (
                                            <textarea id={key} name={key} value={value as string} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" />
                                        ) : (
                                            <input type={key === 'tahunMasuk' ? 'number' : 'text'} id={key} name={key} value={value as string} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                        )}
                                    </div>
                                );
                            })}
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

export default FormPendampinganModal;