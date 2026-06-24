import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface ReferensiModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeMenu: string;
    mode?: 'add' | 'edit' | 'addSub';
    item?: any;
}

const ReferensiModal: React.FC<ReferensiModalProps> = ({ isOpen, onClose, activeMenu, mode = 'add', item = null }) => {
    const [level, setLevel] = useState('1');
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && item) {
                // Determine level based on type if possible, or just mock it
                let itemLevel = '1';
                if (item.type?.includes('Klasifikasi')) itemLevel = '2';
                if (item.type?.includes('Sub Klasifikasi')) itemLevel = '3';
                if (item.type?.includes('Sub Bidang')) itemLevel = '2';
                if (item.type?.includes('Pokok Perkara')) itemLevel = '3';
                if (item.type?.includes('Jenis Tuntutan')) itemLevel = '2';
                setLevel(itemLevel);
                
                setFormData({
                    name: item.name,
                    status: 'aktif',
                    format: item.format,
                    unit: item.unit
                });
            } else if (mode === 'addSub' && item) {
                // If adding sub, level is parent level + 1
                let parentLevel = 1;
                if (item.type?.includes('Klasifikasi')) parentLevel = 2;
                if (item.type?.includes('Sub Klasifikasi')) parentLevel = 3;
                if (item.type?.includes('Sub Bidang')) parentLevel = 2;
                setLevel((parentLevel + 1).toString());
                
                setFormData({
                    name: '',
                    status: 'aktif',
                    parent: item.name
                });
            } else {
                setLevel('1');
                setFormData({ status: 'aktif' });
            }
        }
    }, [isOpen, activeMenu, mode, item]);

    if (!isOpen) return null;
    
    const isEdit = mode === 'edit';
    const isAddSub = mode === 'addSub';
    const title = isEdit ? 'Edit Data Referensi' : isAddSub ? 'Tambah Sub Referensi' : 'Tambah Data Referensi';

    const renderForm = () => {
        switch (activeMenu) {
            case 'jenis_perkara':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Referensi</label>
                            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                <option value="1">Jenis Perkara</option>
                                <option value="2">Klasifikasi Perkara</option>
                                <option value="3">Sub Klasifikasi</option>
                                <option value="4">Sub Sub Klasifikasi</option>
                            </select>
                        </div>
                        {level > '1' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Induk Referensi</label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                    <option>-- Pilih Induk --</option>
                                    <option>Perdata</option>
                                    <option>TUN</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Referensi</label>
                            <input type="text" defaultValue={formData.name || ''} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Masukkan nama referensi..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kode (Opsional)</label>
                            <input type="text" defaultValue={formData.code || ''} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Masukkan kode..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="status" defaultChecked className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                    <span className="ml-2 text-sm text-gray-700">Aktif</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="status" className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                    <span className="ml-2 text-sm text-gray-700">Tidak Aktif</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'pokok_perkara':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Referensi</label>
                            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                <option value="1">Bidang Pokok Perkara</option>
                                <option value="2">Sub Bidang Pokok</option>
                                <option value="3">Pokok Perkara</option>
                            </select>
                        </div>
                        {level > '1' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Induk Referensi</label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                    <option>-- Pilih Induk --</option>
                                    <option>Kepabeanan</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Referensi</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Masukkan nama..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="status" defaultChecked className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                    <span className="ml-2 text-sm text-gray-700">Aktif</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="status" className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                    <span className="ml-2 text-sm text-gray-700">Tidak Aktif</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'wilayah':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Referensi</label>
                            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                <option value="1">Provinsi</option>
                                <option value="2">Wilayah Lainnya (Kabupaten/Kota)</option>
                            </select>
                        </div>
                        {level > '1' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi Induk</label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                    <option>-- Pilih Provinsi --</option>
                                    <option>DKI Jakarta</option>
                                    <option>Jawa Barat</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wilayah</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Masukkan nama wilayah..." />
                        </div>
                    </div>
                );
            case 'pengadilan':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Lingkungan Peradilan</label>
                            <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                <option>-- Pilih Jenis --</option>
                                <option>Peradilan Umum</option>
                                <option>Peradilan Tata Usaha Negara</option>
                                <option>Peradilan Agama</option>
                                <option>Peradilan Militer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Pengadilan</label>
                            <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                <option>Tingkat Pertama (PN/PTUN/PA)</option>
                                <option>Tingkat Banding (PT/PTTUN/PTA)</option>
                                <option>Tingkat Kasasi/PK (Mahkamah Agung)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengadilan</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Contoh: Pengadilan Negeri Jakarta Pusat" />
                        </div>
                    </div>
                );
            case 'tuntutan':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Referensi</label>
                            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                <option value="1">Objek Tuntutan</option>
                                <option value="2">Jenis Tuntutan</option>
                                <option value="3">Satuan</option>
                                <option value="4">Mata Uang</option>
                            </select>
                        </div>
                        {level === '2' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Induk Objek Tuntutan</label>
                                    <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                        <option>-- Pilih Induk --</option>
                                        <option>Tuntutan Materil</option>
                                        <option>Tuntutan Imateril</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Format Nilai</label>
                                    <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                        <option>Tidak Ada</option>
                                        <option value="mata_uang">Mata Uang (Contoh: IDR)</option>
                                        <option value="satuan">Satuan (Contoh: m2, unit)</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Referensi</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Masukkan nama..." />
                        </div>
                    </div>
                );
            case 'pihak':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pihak</label>
                            <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border bg-white">
                                <option>Pihak Penggugat (P)</option>
                                <option>Pihak Tergugat (T & TT)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pihak</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Contoh: PT. ABC / Budi Santoso" />
                        </div>
                    </div>
                );
            case 'kementerian':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kementerian/Lembaga</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Contoh: Kementerian Keuangan" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Singkatan / Kode</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Contoh: Kemenkeu" />
                        </div>
                    </div>
                );
            case 'tags':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tag</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 border" placeholder="Contoh: Important" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
                            <input type="color" className="h-10 w-full border-gray-300 rounded-lg shadow-sm p-1" />
                        </div>
                    </div>
                );
            default:
                return (
                    <div>Pilih menu referensi terlebih dahulu.</div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {renderForm()}
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                        Batal
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                        Simpan Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReferensiModal;
