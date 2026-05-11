
import React, { useState } from 'react';
import { SearchIcon, FileTextIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from './icons';

interface PerkaraBHT {
    id: string;
    nomorPerkara: string;
    jenisPerkara: string;
    tahunMasuk: number;
}

interface ArsipPerkaraBHT {
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
}

const initialPerkaraBHT: PerkaraBHT[] = [
    { id: '1', nomorPerkara: '276/Pdt.G/2017/PN.Jkt.Pst', jenisPerkara: 'Perdata', tahunMasuk: 2017 },
    { id: '2', nomorPerkara: '46/Pdt.G/2017/PN.Skh', jenisPerkara: 'Perdata', tahunMasuk: 2017 },
    { id: '3', nomorPerkara: '491/Pdt.G/2017/PN.Smg', jenisPerkara: 'Perdata', tahunMasuk: 2017 },
    { id: '4', nomorPerkara: '371/PDT.G/2017/PN.BDG', jenisPerkara: 'Perbuatan Melawan Hukum', tahunMasuk: 2017 },
    { id: '5', nomorPerkara: '490/Pdt.G/2017/PN.Smg', jenisPerkara: 'Perdata', tahunMasuk: 2017 },
    { id: '6', nomorPerkara: '16/Pdt.G/2017/PN.Tlg', jenisPerkara: 'Perkara Perdata', tahunMasuk: 2017 },
    { id: '7', nomorPerkara: '16/PDT.G/2014/PN.GS', jenisPerkara: 'Perdata', tahunMasuk: 2014 },
    { id: '8', nomorPerkara: '3/PDT.G/2014/PN.Mgl', jenisPerkara: 'Perdata', tahunMasuk: 2014 },
    { id: '9', nomorPerkara: '511/Pdt.G/2014/PN.SBY', jenisPerkara: 'Perdata', tahunMasuk: 2014 },
    { id: '10', nomorPerkara: '47/Pdt.G/2014/PN.Pkl', jenisPerkara: 'Perdata', tahunMasuk: 2015 },
];

const ArsipModal: React.FC<{
    record: PerkaraBHT;
    onClose: () => void;
    onSave: (data: Partial<ArsipPerkaraBHT>) => void;
}> = ({ record, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        kodeKlasifikasi: '',
        tahunSelesai: '',
        tingkatPerkembangan: '',
        jumlahBerkas: '',
        lokasiSimpan: '',
        keterangan: ''
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            tahunSelesai: parseInt(formData.tahunSelesai) || 0,
            status: 'Terarsip'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-300">
                <div className="bg-[#f5f5f5] shadow-sm px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center text-gray-800 font-bold">
                        <span className="mr-2 text-xl">■</span>
                        Arsip Perkara BHT
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave}>
                    <div className="p-12 space-y-7">
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

const Arsip: React.FC = () => {
    const [perkaraBHT, setPerkaraBHT] = useState<PerkaraBHT[]>(initialPerkaraBHT);
    const [arsipBHT, setArsipBHT] = useState<ArsipPerkaraBHT[]>([]);
    const [searchTermBHT, setSearchTermBHT] = useState('');
    const [searchTermArsip, setSearchTermArsip] = useState('');
    const [selectedPerkara, setSelectedPerkara] = useState<PerkaraBHT | null>(null);

    const filteredBHT = perkaraBHT.filter(p => 
        p.nomorPerkara.toLowerCase().includes(searchTermBHT.toLowerCase()) ||
        p.jenisPerkara.toLowerCase().includes(searchTermBHT.toLowerCase())
    );

    const filteredArsip = arsipBHT.filter(p => 
        p.nomorPerkara.toLowerCase().includes(searchTermArsip.toLowerCase()) ||
        p.jenisPerkara.toLowerCase().includes(searchTermArsip.toLowerCase())
    );

    const handleArchive = (details: Partial<ArsipPerkaraBHT>) => {
        if (!selectedPerkara) return;

        const newArsip: ArsipPerkaraBHT = {
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
            status: 'Terarsip'
        };

        setArsipBHT(prev => [...prev, newArsip]);
        setPerkaraBHT(prev => prev.filter(p => p.id !== selectedPerkara.id));
        setSelectedPerkara(null);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-10 space-y-12">
            {/* Modal */}
            {selectedPerkara && (
                <ArsipModal 
                    record={selectedPerkara} 
                    onClose={() => setSelectedPerkara(null)} 
                    onSave={handleArchive} 
                />
            )}

            {/* Table 1: Daftar Perkara BHT */}
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-visible relative pt-2">
                <div className="absolute -top-4 left-6 bg-white px-3 py-1 text-gray-700 font-bold flex items-center text-sm border border-gray-200 rounded-t-md shadow-sm border-b-white">
                    <FileTextIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span>Daftar Perkara BHT</span>
                </div>
                
                <div className="p-6">
                    <div className="relative mb-6">
                        <input 
                            type="text" 
                            className="w-full pl-5 pr-12 py-2.5 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner text-sm"
                            placeholder="Search"
                            value={searchTermBHT}
                            onChange={(e) => setSearchTermBHT(e.target.value)}
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
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredBHT.map((p, index) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{index + 1}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200 font-medium">{p.nomorPerkara}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.jenisPerkara}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.tahunMasuk}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-right text-sm">
                                            <button 
                                                onClick={() => setSelectedPerkara(p)}
                                                className="p-2 bg-cyan-400 text-white rounded hover:bg-cyan-500 transition-colors shadow-sm"
                                            >
                                                <FileTextIcon className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm font-medium text-gray-700">
                        <div>Showing 1-10 of 3549 records</div>
                        <div className="flex items-center space-x-1 mt-4 md:mt-0">
                            <button className="px-4 py-2 border border-gray-200 bg-[#f9f9f9] text-gray-600 rounded hover:bg-gray-100 transition-colors">First</button>
                            <button className="px-4 py-2 border border-gray-200 bg-[#f9f9f9] text-gray-600 rounded hover:bg-gray-100 transition-colors">
                                <ChevronLeftIcon className="h-4 w-4" />
                            </button>
                            <div className="flex items-center space-x-2 px-2">
                                <input type="text" className="w-12 text-center border border-gray-300 rounded py-2 shadow-sm" defaultValue="1" />
                                <span className="text-gray-500">of 355</span>
                            </div>
                            <button className="px-4 py-2 border border-gray-200 bg-[#f9f9f9] text-gray-600 rounded hover:bg-gray-100 transition-colors">
                                <ChevronRightIcon className="h-4 w-4" />
                            </button>
                            <button className="px-4 py-2 border border-gray-200 bg-[#f9f9f9] text-gray-600 rounded hover:bg-gray-100 transition-colors">Last</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table 2: Daftar Arsip Perkara BHT */}
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-visible relative pt-2">
                <div className="absolute -top-4 left-6 bg-white px-3 py-1 text-gray-700 font-bold flex items-center text-sm border border-gray-200 rounded-t-md shadow-sm border-b-white">
                    <FileTextIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span>Daftar Arsip Perkara BHT</span>
                </div>
                
                <div className="p-6">
                    <div className="overflow-x-auto border-x border-t border-gray-200 mt-2">
                        <table className="min-w-full">
                            <thead className="bg-[#fcfcfc] border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-24 border-r border-gray-200">No</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Kode Klasifikasi</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nomor Perkara</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Jenis Perkara</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Masuk</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Selesai</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Lokasi Simpan</th>
                                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredArsip.length > 0 ? filteredArsip.map((p, index) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{index + 1}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.kodeKlasifikasi}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.nomorPerkara}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.jenisPerkara}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.tahunMasuk}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.tahunSelesai}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{p.lokasiSimpan}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800">{p.status}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-6 text-sm text-gray-600 font-medium">
                                            Showing 1-0 of 0 records
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Arsip;
