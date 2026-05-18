import React, { useState, useMemo } from 'react';
import { SearchIcon, FileTextIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, EyeIcon, PencilIcon, BookOpenIcon, RefreshIcon, PrintIcon } from './icons';
import { View } from '../types';
import Breadcrumb from './Breadcrumb';
import Pagination from './Pagination';

interface ArsipProps {
    onNavigate: (view: View) => void;
}

interface PerkaraSelesai {
    id: string;
    nomorPerkara: string;
    jenisPerkara: string;
    tahunMasuk: number;
    pengadilan?: string;
    wilayah?: string;
    pihakP?: string;
    pihakT?: string;
}

interface Peminjaman {
    id: string;
    peminjam: string;
    tanggalPinjam: string;
    tanggalKembali?: string;
    keterangan: string;
}

interface ArsipPerkaraSelesai {
    id: string;
    kodeKlasifikasi: string;
    nomorPerkara: string;
    jenisPerkara: string;
    tahunMasuk: number;
    tahunSelesai: number;
    tingkatPerkembangan: string;
    jumlahBerkas: string;
    lokasiSimpan: string;
    keterangan: string;
    status: string;
    peminjaman?: Peminjaman[];
}

const initialPerkaraSelesai: PerkaraSelesai[] = [
    { id: '1', nomorPerkara: '276/Pdt.G/2017/PN.Jkt.Pst', jenisPerkara: 'Perdata', tahunMasuk: 2017, pengadilan: 'PN Jakarta Pusat', wilayah: 'DKI Jakarta', pihakP: 'PT ABC', pihakT: 'Kementerian Keuangan' },
    { id: '2', nomorPerkara: '46/Pdt.G/2017/PN.Skh', jenisPerkara: 'Perdata', tahunMasuk: 2017, pengadilan: 'PN Sukoharjo', wilayah: 'Jawa Tengah', pihakP: 'Budi Utomo', pihakT: 'KPP Pratama Sukoharjo' },
    { id: '3', nomorPerkara: '491/Pdt.G/2017/PN.Smg', jenisPerkara: 'Perdata', tahunMasuk: 2017, pengadilan: 'PN Semarang', wilayah: 'Jawa Tengah', pihakP: 'Siti Aminah', pihakT: 'Kanwil DJP Jawa Tengah I' },
    { id: '4', nomorPerkara: '371/PDT.G/2017/PN.BDG', jenisPerkara: 'Perbuatan Melawan Hukum', tahunMasuk: 2017, pengadilan: 'PN Bandung', wilayah: 'Jawa Barat', pihakP: 'Wawan Hermawan', pihakT: 'KPTIK BMN Bandung' },
    { id: '5', nomorPerkara: '490/Pdt.G/2017/PN.Smg', jenisPerkara: 'Perdata', tahunMasuk: 2017, pengadilan: 'PN Semarang', wilayah: 'Jawa Tengah' },
    { id: '6', nomorPerkara: '16/Pdt.G/2017/PN.Tlg', jenisPerkara: 'Perkara Perdata', tahunMasuk: 2017, pengadilan: 'PN Tulungagung', wilayah: 'Jawa Timur' },
    { id: '7', nomorPerkara: '16/PDT.G/2014/PN.GS', jenisPerkara: 'Perdata', tahunMasuk: 2014, pengadilan: 'PN Gresik', wilayah: 'Jawa Timur' },
    { id: '8', nomorPerkara: '3/PDT.G/2014/PN.Mgl', jenisPerkara: 'Perdata', tahunMasuk: 2014, pengadilan: 'PN Magelang', wilayah: 'Jawa Tengah' },
    { id: '9', nomorPerkara: '511/Pdt.G/2014/PN.SBY', jenisPerkara: 'Perdata', tahunMasuk: 2014, pengadilan: 'PN Surabaya', wilayah: 'Jawa Timur' },
    { id: '10', nomorPerkara: '47/Pdt.G/2014/PN.Pkl', jenisPerkara: 'Perdata', tahunMasuk: 2015, pengadilan: 'PN Pekalongan', wilayah: 'Jawa Tengah' },
];

const InformasiUmum: React.FC<{ record: PerkaraSelesai }> = ({ record }) => (
    <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
            <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Nomor Perkara</div>
            <div className="text-gray-900 font-bold">{record.nomorPerkara}</div>
        </div>
        <div>
            <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Jenis Perkara</div>
            <div className="text-gray-900 font-bold">{record.jenisPerkara}</div>
        </div>
        <div>
            <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Pengadilan</div>
            <div className="text-gray-900 font-bold">{record.pengadilan || '-'}</div>
        </div>
        <div>
            <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Wilayah</div>
            <div className="text-gray-900 font-bold">{record.wilayah || '-'}</div>
        </div>
        <div>
            <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Pihak Penggugat</div>
            <div className="text-gray-900 font-bold">{record.pihakP || '-'}</div>
        </div>
        <div>
            <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Pihak Tergugat</div>
            <div className="text-gray-900 font-bold">{record.pihakT || '-'}</div>
        </div>
    </div>
);

const ArsipModal: React.FC<{
    record: PerkaraSelesai;
    onClose: () => void;
    onSave: (data: Partial<ArsipPerkaraSelesai>) => void;
    initialData?: Partial<ArsipPerkaraSelesai>;
    isEdit?: boolean;
}> = ({ record, onClose, onSave, initialData, isEdit = false }) => {
    const [formData, setFormData] = useState({
        kodeKlasifikasi: initialData?.kodeKlasifikasi || '',
        tahunSelesai: initialData?.tahunSelesai?.toString() || '',
        tingkatPerkembangan: initialData?.tingkatPerkembangan || '',
        jumlahBerkas: initialData?.jumlahBerkas || '',
        lokasiSimpan: initialData?.lokasiSimpan || '',
        keterangan: initialData?.keterangan || ''
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            tahunSelesai: parseInt(formData.tahunSelesai) || 0,
            status: isEdit ? initialData?.status : 'Terarsip'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-300">
                <div className="bg-[#f5f5f5] shadow-sm px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center text-gray-800 font-bold">
                        <span className="mr-2 text-xl">■</span>
                        {isEdit ? 'Edit Arsip Perkara Selesai' : 'Arsip Perkara Selesai'}
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="flex flex-col max-h-[90vh]">
                    <div className="p-8 overflow-y-auto space-y-7">
                        <InformasiUmum record={record} />
                        
                        <div className="grid grid-cols-[280px_1fr] items-center gap-8">
                            <label className="text-sm font-bold text-gray-700 text-right">Kode Klasifikasi <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
                                placeholder="Kode Klasifikasi"
                                value={formData.kodeKlasifikasi}
                                onChange={(e) => setFormData({...formData, kodeKlasifikasi: e.target.value})}
                            />
                        </div>
                        
                        <div className="grid grid-cols-[280px_1fr] items-center gap-8">
                            <label className="text-sm font-bold text-gray-700 text-right">Tahun Selesai <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
                                placeholder="Tahun Selesai"
                                value={formData.tahunSelesai}
                                onChange={(e) => setFormData({...formData, tahunSelesai: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-[280px_1fr] items-center gap-8">
                            <label className="text-sm font-bold text-gray-700 text-right">Tingkat Perkembangan <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
                                placeholder="Tingkat Perkembangan"
                                value={formData.tingkatPerkembangan}
                                onChange={(e) => setFormData({...formData, tingkatPerkembangan: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-[280px_1fr] items-center gap-8">
                            <label className="text-sm font-bold text-gray-700 text-right">Jumlah Berkas <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
                                placeholder="Jumlah Berkas"
                                value={formData.jumlahBerkas}
                                onChange={(e) => setFormData({...formData, jumlahBerkas: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-[280px_1fr] items-start gap-8">
                            <label className="text-sm font-bold text-gray-700 text-right mt-2">
                                <div className="leading-tight">Lokasi Simpan (Gedung, Boks, Folder), <span className="text-red-500">*</span></div>
                            </label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
                                placeholder="Lokasi Simpan"
                                value={formData.lokasiSimpan}
                                onChange={(e) => setFormData({...formData, lokasiSimpan: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-[280px_1fr] items-start gap-8">
                            <label className="text-sm font-bold text-gray-700 text-right mt-2">Keterangan <span className="text-red-500">*</span></label>
                            <textarea 
                                required
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-h-[120px] shadow-sm resize-none"
                                placeholder="Keterangan"
                                value={formData.keterangan}
                                onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-[#f5f5f5] px-8 py-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-xs text-gray-600 italic">Input yang bertanda <span className="text-red-500 font-bold">*</span> harus diisi</div>
                        <div className="space-x-3">
                            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded hover:bg-gray-300 transition-colors shadow-sm">Batal</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition-colors shadow-md active:scale-95">Simpan</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DetailArsipModal: React.FC<{
    archive: ArsipPerkaraSelesai;
    original: PerkaraSelesai | undefined;
    onClose: () => void;
    onReturn?: (borrowingId: string) => void;
}> = ({ archive, original, onClose, onReturn }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-300">
                <div className="bg-[#f5f5f5] shadow-sm px-6 py-3 border-b border-gray-200 flex justify-between items-center print:hidden">
                    <div className="flex items-center text-gray-800 font-bold">
                        <span className="mr-2 text-xl">■</span>
                        Detail Arsip: {archive.nomorPerkara}
                    </div>
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => window.print()}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <PrintIcon className="h-4 w-4 mr-1.5" />
                            Download Resume
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 p-1 rounded bg-white">
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                
                <div className="p-8 overflow-y-auto max-h-[85vh] space-y-6 print:max-h-none print:overflow-visible">
                    {original && <InformasiUmum record={original} />}
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div className="border-b border-gray-100 pb-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kode Klasifikasi</div>
                            <div className="text-sm font-medium text-gray-800">{archive.kodeKlasifikasi}</div>
                        </div>
                        <div className="border-b border-gray-100 pb-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tahun Selesai</div>
                            <div className="text-sm font-medium text-gray-800">{archive.tahunSelesai}</div>
                        </div>
                        <div className="border-b border-gray-100 pb-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tingkat Perkembangan</div>
                            <div className="text-sm font-medium text-gray-800">{archive.tingkatPerkembangan}</div>
                        </div>
                        <div className="border-b border-gray-100 pb-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jumlah Berkas</div>
                            <div className="text-sm font-medium text-gray-800">{archive.jumlahBerkas}</div>
                        </div>
                        <div className="border-b border-gray-100 pb-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lokasi Simpan</div>
                            <div className="text-sm font-medium text-gray-800">{archive.lokasiSimpan}</div>
                        </div>
                        <div className="border-b border-gray-100 pb-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</div>
                            <div className="text-sm font-medium text-gray-800">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${archive.status === 'Terarsip' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{archive.status}</span>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keterangan</div>
                            <div className="text-sm text-gray-800 italic whitespace-pre-wrap mt-1">{archive.keterangan}</div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-sm font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">Riwayat Peminjaman (Borrowing Mechanism)</h4>
                        <div className="overflow-hidden border border-gray-200 rounded">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Peminjam</th>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tgl Pinjam</th>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tgl Kembali</th>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Keterangan</th>
                                        <th className="px-4 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {archive.peminjaman && archive.peminjaman.length > 0 ? archive.peminjaman.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-4 py-2 text-sm text-gray-800 font-medium">{p.peminjam}</td>
                                            <td className="px-4 py-2 text-sm text-gray-800">{p.tanggalPinjam}</td>
                                            <td className="px-4 py-2 text-sm text-gray-800">{p.tanggalKembali || '-'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-800">{p.keterangan}</td>
                                            <td className="px-4 py-2 text-sm text-center">
                                                {!p.tanggalKembali && onReturn && (
                                                    <button 
                                                        onClick={() => onReturn(p.id)}
                                                        className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded hover:bg-green-200 transition-colors uppercase"
                                                    >
                                                        Kembalikan
                                                    </button>
                                                )}
                                                {p.tanggalKembali && (
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase italic">Selesai</span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 italic">Belum ada riwayat peminjaman.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="bg-[#f5f5f5] px-8 py-4 border-t border-gray-200 flex justify-end print:hidden">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-600 text-white text-sm font-bold rounded hover:bg-gray-700 transition-colors shadow-md">Tutup</button>
                </div>
            </div>
        </div>
    );
};

const PinjamModal: React.FC<{
    archiveId: string;
    onClose: () => void;
    onSave: (data: Peminjaman) => void;
}> = ({ archiveId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        peminjam: '',
        tanggalPinjam: new Date().toISOString().split('T')[0],
        keterangan: ''
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: `p-${Date.now()}`,
            ...formData
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-300">
                <div className="bg-[#f5f5f5] shadow-sm px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center text-gray-800 font-bold text-sm">
                        <BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Rekam Peminjaman Arsip (Borrowing Mechanism)
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave}>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nama Peminjam <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
                                placeholder="Nama Lengkap Peminjam"
                                value={formData.peminjam}
                                onChange={(e) => setFormData({...formData, peminjam: e.target.value})}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Tanggal Pinjam <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="date" 
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
                                value={formData.tanggalPinjam}
                                onChange={(e) => setFormData({...formData, tanggalPinjam: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Keterangan / Keperluan <span className="text-red-500">*</span></label>
                            <textarea 
                                required
                                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-h-[100px] shadow-sm resize-none"
                                placeholder="Tujuan peminjaman berkas"
                                value={formData.keterangan}
                                onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-[#f5f5f5] px-8 py-4 border-t border-gray-200 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded hover:bg-gray-300 transition-colors shadow-sm">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition-colors shadow-md">Rekam Peminjaman</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Arsip: React.FC<ArsipProps> = ({ onNavigate }) => {
    const [perkaraSelesai, setPerkaraSelesai] = useState<PerkaraSelesai[]>(initialPerkaraSelesai);
    const [arsipSelesai, setArsipSelesai] = useState<ArsipPerkaraSelesai[]>([]);
    const [searchTermSelesai, setSearchTermSelesai] = useState('');
    const [searchTermArsip, setSearchTermArsip] = useState('');
    const [selectedPerkara, setSelectedPerkara] = useState<PerkaraSelesai | null>(null);
    const [viewingArchive, setViewingArchive] = useState<ArsipPerkaraSelesai | null>(null);
    const [editingArchive, setEditingArchive] = useState<ArsipPerkaraSelesai | null>(null);
    const [borrowingArchiveId, setBorrowingArchiveId] = useState<string | null>(null);

    const [currentPageSelesai, setCurrentPageSelesai] = useState(1);
    const [itemsPerPageSelesai, setItemsPerPageSelesai] = useState(10);
    const [currentPageArsip, setCurrentPageArsip] = useState(1);
    const [itemsPerPageArsip, setItemsPerPageArsip] = useState(10);

    const filteredSelesai = useMemo(() => {
        return perkaraSelesai.filter(p => 
            p.nomorPerkara.toLowerCase().includes(searchTermSelesai.toLowerCase()) ||
            p.jenisPerkara.toLowerCase().includes(searchTermSelesai.toLowerCase())
        );
    }, [perkaraSelesai, searchTermSelesai]);

    const paginatedSelesai = useMemo(() => {
        const start = (currentPageSelesai - 1) * itemsPerPageSelesai;
        return filteredSelesai.slice(start, start + itemsPerPageSelesai);
    }, [filteredSelesai, currentPageSelesai, itemsPerPageSelesai]);

    const filteredArsip = useMemo(() => {
        return arsipSelesai.filter(p => 
            p.nomorPerkara.toLowerCase().includes(searchTermArsip.toLowerCase()) ||
            p.jenisPerkara.toLowerCase().includes(searchTermArsip.toLowerCase())
        );
    }, [arsipSelesai, searchTermArsip]);

    const paginatedArsip = useMemo(() => {
        const start = (currentPageArsip - 1) * itemsPerPageArsip;
        return filteredArsip.slice(start, start + itemsPerPageArsip);
    }, [filteredArsip, currentPageArsip, itemsPerPageArsip]);

    const handleArchive = (details: Partial<ArsipPerkaraSelesai>) => {
        if (!selectedPerkara) return;

        const newArsip: ArsipPerkaraSelesai = {
            id: selectedPerkara.id,
            nomorPerkara: selectedPerkara.nomorPerkara,
            jenisPerkara: selectedPerkara.jenisPerkara,
            tahunMasuk: selectedPerkara.tahunMasuk,
            kodeKlasifikasi: details.kodeKlasifikasi || '',
            tahunSelesai: details.tahunSelesai || 0,
            tingkatPerkembangan: details.tingkatPerkembangan || '',
            jumlahBerkas: details.jumlahBerkas || '',
            lokasiSimpan: details.lokasiSimpan || '',
            keterangan: details.keterangan || '',
            status: 'Terarsip',
            peminjaman: []
        };

        setArsipSelesai(prev => [...prev, newArsip]);
        setPerkaraSelesai(prev => prev.filter(p => p.id !== selectedPerkara.id));
        setSelectedPerkara(null);
    };

    const handleUpdateArchive = (details: Partial<ArsipPerkaraSelesai>) => {
        if (!editingArchive) return;
        setArsipSelesai(prev => prev.map(a => a.id === editingArchive.id ? { ...a, ...details } : a));
        setEditingArchive(null);
    };

    const handleRecordBorrowing = (borrowing: Peminjaman) => {
        if (!borrowingArchiveId) return;
        setArsipSelesai(prev => prev.map(a => a.id === borrowingArchiveId ? { 
            ...a, 
            peminjaman: [...(a.peminjaman || []), borrowing],
            status: 'Dipinjam'
        } : a));
        setBorrowingArchiveId(null);
    };

    const handleReturnArchive = (archiveId: string, borrowingId: string) => {
        const today = new Date().toISOString().split('T')[0];
        setArsipSelesai(prev => prev.map(a => a.id === archiveId ? {
            ...a,
            status: 'Terarsip', // For now assume returning one means it's back
            peminjaman: a.peminjaman?.map(p => p.id === borrowingId ? {
                ...p,
                tanggalKembali: today
            } : p)
        } : a));
        
        // Update viewing archive state to reflect changes immediately in modal
        setViewingArchive(prev => {
            if (prev && prev.id === archiveId) {
                return {
                    ...prev,
                    status: 'Terarsip',
                    peminjaman: prev.peminjaman?.map(p => p.id === borrowingId ? {
                        ...p,
                        tanggalKembali: today
                    } : p)
                };
            }
            return prev;
        });
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-10 space-y-8 pb-24 flex flex-col">
            <Breadcrumb currentView="eAdvokasiArsip" onNavigate={onNavigate} />
            
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Arsip</h1>
                <p className="text-gray-600 mt-1">Kelola arsip perkara yang telah selesai dan riwayat peminjamannya.</p>
                <div className="border-b-4 border-blue-600 w-16 mt-4"></div>
            </div>

            {/* Modal Record Arsip */}
            {selectedPerkara && (
                <ArsipModal 
                    record={selectedPerkara} 
                    onClose={() => setSelectedPerkara(null)} 
                    onSave={handleArchive} 
                />
            )}

            {/* Modal Edit Arsip */}
            {editingArchive && (
                <ArsipModal 
                    record={arsipSelesai.find(a => a.id === editingArchive.id) as any} // Using initial data workaround
                    initialData={editingArchive}
                    onClose={() => setEditingArchive(null)} 
                    onSave={handleUpdateArchive}
                    isEdit={true}
                />
            )}

            {/* Modal View Detail */}
            {viewingArchive && (
                <DetailArsipModal 
                    archive={viewingArchive}
                    original={initialPerkaraSelesai.find(p => p.id === viewingArchive.id)}
                    onClose={() => setViewingArchive(null)}
                    onReturn={(borrowingId) => handleReturnArchive(viewingArchive.id, borrowingId)}
                />
            )}

            {/* Modal Pinjam */}
            {borrowingArchiveId && (
                <PinjamModal 
                    archiveId={borrowingArchiveId}
                    onClose={() => setBorrowingArchiveId(null)}
                    onSave={handleRecordBorrowing}
                />
            )}

            {/* Table 1: Daftar Perkara Selesai */}
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-visible relative pt-2">
                <div className="absolute -top-4 left-6 bg-white px-3 py-1 text-gray-700 font-bold flex items-center text-sm border border-gray-200 rounded-t-md shadow-sm border-b-white">
                    <FileTextIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span>Daftar Perkara Selesai</span>
                </div>
                
                <div className="p-6">
                    <div className="relative mb-6">
                        <input 
                            type="text" 
                            className="w-full pl-5 pr-12 py-2.5 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner text-sm"
                            placeholder="Search Perkara Selesai"
                            value={searchTermSelesai}
                            onChange={(e) => setSearchTermSelesai(e.target.value)}
                        />
                        <SearchIcon className="absolute right-4 top-2.5 h-6 w-6 text-gray-400" />
                    </div>

                    <div className="overflow-x-auto border-x border-t border-gray-200">
                        <table className="min-w-full">
                            <thead className="bg-[#fcfcfc] border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-20 border-r border-gray-200">No</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nomor Perkara</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Jenis Perkara</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Masuk</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {paginatedSelesai.map((p, index) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{(currentPageSelesai - 1) * itemsPerPageSelesai + index + 1}</td>
                                        <td className="px-5 py-4 text-sm text-gray-800 border-r border-gray-200 font-medium">{p.nomorPerkara}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.jenisPerkara}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.tahunMasuk}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-center text-sm">
                                            <button 
                                                onClick={() => setSelectedPerkara(p)}
                                                className="p-2 bg-cyan-400 text-white rounded hover:bg-cyan-500 transition-colors shadow-sm"
                                                title="Record ke Arsip"
                                            >
                                                <FileTextIcon className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedSelesai.length === 0 && (
                                    <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500 italic">Tidak ada perkara selesai yang ditemukan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination 
                        totalItems={filteredSelesai.length}
                        currentPage={currentPageSelesai}
                        itemsPerPage={itemsPerPageSelesai}
                        onPageChange={setCurrentPageSelesai}
                        onItemsPerPageChange={(val) => { setItemsPerPageSelesai(val); setCurrentPageSelesai(1); }}
                    />
                </div>
            </div>

            {/* Table 2: Daftar Arsip Perkara Selesai */}
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-visible relative pt-2">
                <div className="absolute -top-4 left-6 bg-white px-3 py-1 text-gray-700 font-bold flex items-center text-sm border border-gray-200 rounded-t-md shadow-sm border-b-white">
                    <FileTextIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span>Daftar Arsip Perkara Selesai</span>
                </div>
                
                <div className="p-6">
                    <div className="relative mb-6 mt-2">
                        <input 
                            type="text" 
                            className="w-full pl-5 pr-12 py-2.5 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner text-sm"
                            placeholder="Search Daftar Arsip Perkara Selesai"
                            value={searchTermArsip}
                            onChange={(e) => setSearchTermArsip(e.target.value)}
                        />
                        <SearchIcon className="absolute right-4 top-2.5 h-6 w-6 text-gray-400" />
                    </div>

                    <div className="overflow-x-auto border-x border-t border-gray-200 mt-2">
                        <table className="min-w-full">
                            <thead className="bg-[#fcfcfc] border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-16 border-r border-gray-200">No</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Klasifikasi</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nomor Perkara</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Jenis</th>
                                    <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Masuk</th>
                                    <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Selesai</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Lokasi</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Status</th>
                                    <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {paginatedArsip.length > 0 ? paginatedArsip.map((p, index) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{(currentPageArsip - 1) * itemsPerPageArsip + index + 1}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.kodeKlasifikasi}</td>
                                        <td className="px-5 py-4 text-sm text-gray-800 border-r border-gray-200 font-medium">{p.nomorPerkara}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.jenisPerkara}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200 text-center">{p.tahunMasuk}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200 text-center">{p.tahunSelesai}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.lokasiSimpan}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.status === 'Terarsip' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                         <td className="px-5 py-4 whitespace-nowrap text-center text-sm">
                                             <div className="grid grid-cols-4 gap-1 w-fit mx-auto">
                                                 <button 
                                                     onClick={() => setViewingArchive(p)}
                                                     className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                     title="View Detail (Termasuk Borrowing Mechanism)"
                                                 >
                                                     <EyeIcon className="h-4 w-4" />
                                                 </button>
                                                 <button 
                                                     onClick={() => {
                                                         setViewingArchive(p);
                                                         setTimeout(() => window.print(), 500);
                                                     }}
                                                     className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                     title="Print/Download Resume"
                                                 >
                                                     <PrintIcon className="h-4 w-4" />
                                                 </button>
                                                 <button 
                                                     onClick={() => setEditingArchive(p)}
                                                     className="p-1.5 bg-amber-50 text-amber-600 rounded hover:bg-amber-100 transition-colors"
                                                     title="Edit Data Arsip"
                                                 >
                                                     <PencilIcon className="h-4 w-4" />
                                                 </button>
                                                 {p.status === 'Dipinjam' ? (
                                                     <button 
                                                         onClick={() => {
                                                             const active = p.peminjaman?.find(borrow => !borrow.tanggalKembali);
                                                             if (active) handleReturnArchive(p.id, active.id);
                                                         }}
                                                         className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                                         title="Kembalikan Arsip (Return)"
                                                     >
                                                         <RefreshIcon className="h-4 w-4" />
                                                     </button>
                                                 ) : (
                                                     <button 
                                                         onClick={() => setBorrowingArchiveId(p.id)}
                                                         className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                                                         title="Rekam Peminjaman Arsip (Borrowing Mechanism)"
                                                     >
                                                         <BookOpenIcon className="h-4 w-4" />
                                                     </button>
                                                 )}
                                             </div>
                                         </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={9} className="px-5 py-12 text-sm text-gray-500 font-medium text-center italic">
                                            Belum ada data arsip terekam.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination 
                        totalItems={filteredArsip.length}
                        currentPage={currentPageArsip}
                        itemsPerPage={itemsPerPageArsip}
                        onPageChange={setCurrentPageArsip}
                        onItemsPerPageChange={(val) => { setItemsPerPageArsip(val); setCurrentPageArsip(1); }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Arsip;
