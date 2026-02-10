import React, { useState, useEffect } from 'react';
import { SuratMasukNadine, JenisPermohonan } from '../types';
import { SearchIcon, XIcon, ShieldCheckIcon, UserGroupIcon } from './icons';

interface TarikDataNadineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTarikData: (surat: SuratMasukNadine, jenis: JenisPermohonan) => void;
}

const mockNadineData: SuratMasukNadine[] = [
  { naskahId: '60977314', nomorSurat: 'ND-7/KN.4/2026', perihal: 'Permohonan penerbitan surat kuasa perkara 129/pdt.g/2026/pn.dps', unitPengirim: 'KPKNL Denpasar', tanggal: '28/01/2026' },
  { naskahId: '61152685', nomorSurat: 'ND-5/PJ.4/2026', perihal: 'Panggilan a.n. Joko untuk menghadap Polda Jatim', unitPengirim: 'Direktorat P2', tanggal: '05/02/2026' },
  { naskahId: '60960599', nomorSurat: 'ND-3/BC.4/2026', perihal: 'Permohonan bantuan hukum atas perkara perdata nomor 444/pdt.g/2026/pn.cbi', unitPengirim: 'KPBC Tanjung Priok', tanggal: '28/01/2026' },
  { naskahId: '60969171', nomorSurat: 'ND-6/PK.4/2026', perihal: 'Panggilan saksi a.n. Bowo di Kejaksaan Negeri Serang', unitPengirim: 'Direktorat Perimbangan', tanggal: '28/01/2026' },
  { naskahId: '60949171', nomorSurat: 'ND-4/SJ.4/2026', perihal: 'Panggilan saksi a.n. Raka', unitPengirim: 'Biro Umum', tanggal: '27/01/2026' },
  { naskahId: '88776655', nomorSurat: 'S-101/DJP/2026', perihal: 'Permohonan Data Wajib Pajak PT Sejahtera', unitPengirim: 'Direktorat Jenderal Pajak', tanggal: '15/02/2026' },
];


const TarikDataNadineModal: React.FC<TarikDataNadineModalProps> = ({ isOpen, onClose, onTarikData }) => {
    const [view, setView] = useState<'search' | 'categorize'>('search');
    const [searchParams, setSearchParams] = useState({ nomorSurat: '', perihal: '', naskahId: '', unitPengirim: '' });
    const [searchResults, setSearchResults] = useState<SuratMasukNadine[]>([]);
    const [selectedNadineSurat, setSelectedNadineSurat] = useState<SuratMasukNadine | null>(null);
    const [selectedJenis, setSelectedJenis] = useState<JenisPermohonan | null>(null);

    const resetStateAndClose = () => {
        onClose();
        setTimeout(() => {
            setView('search');
            setSearchParams({ nomorSurat: '', perihal: '', naskahId: '', unitPengirim: '' });
            setSearchResults([]);
            setSelectedNadineSurat(null);
            setSelectedJenis(null);
        }, 300); // Delay reset to allow modal to close gracefully
    };

    const handleSearch = () => {
        const { nomorSurat, perihal, naskahId, unitPengirim } = searchParams;
        const filtered = mockNadineData.filter(item => 
            (nomorSurat ? item.nomorSurat.toLowerCase().includes(nomorSurat.toLowerCase()) : true) &&
            (perihal ? item.perihal.toLowerCase().includes(perihal.toLowerCase()) : true) &&
            (naskahId ? item.naskahId.toLowerCase().includes(naskahId.toLowerCase()) : true) &&
            (unitPengirim ? item.unitPengirim.toLowerCase().includes(unitPengirim.toLowerCase()) : true)
        );
        setSearchResults(filtered);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (selectedNadineSurat) {
            setView('categorize');
        }
    };
    
    const handleBack = () => {
        setView('search');
        setSelectedJenis(null);
    };

    const handleConfirm = () => {
        if (selectedNadineSurat && selectedJenis) {
            onTarikData(selectedNadineSurat, selectedJenis);
            resetStateAndClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true">
            <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">
                        {view === 'search' ? 'Tarik Data dari Nadine' : 'Kategorikan Permohonan'}
                    </h2>
                    <button onClick={resetStateAndClose} className="p-2 rounded-full hover:bg-gray-200">
                        <XIcon className="h-6 w-6 text-gray-600" />
                    </button>
                </header>
                
                {view === 'search' && (
                    <>
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="nomorSurat" placeholder="Masukan nomor surat" value={searchParams.nomorSurat} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="perihal" placeholder="Masukan perihal surat" value={searchParams.perihal} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="naskahId" placeholder="Masukan id surat" value={searchParams.naskahId} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="unitPengirim" placeholder="Masukan Unit Pengirim" value={searchParams.unitPengirim} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button onClick={handleSearch} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                    <SearchIcon className="h-5 w-5" />
                                    <span>Cari</span>
                                </button>
                            </div>
                        </div>
                        
                        <main className="flex-1 p-4 overflow-y-auto">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="w-12 px-6 py-3"></th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Surat</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perihal</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {searchResults.map(item => (
                                            <tr key={item.naskahId} className={`hover:bg-blue-50 cursor-pointer ${selectedNadineSurat?.naskahId === item.naskahId ? 'bg-blue-100' : ''}`} onClick={() => setSelectedNadineSurat(item)}>
                                                <td className="px-6 py-4">
                                                    <input type="radio" name="selectNadine" checked={selectedNadineSurat?.naskahId === item.naskahId} readOnly className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nomorSurat}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800">{item.perihal}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tanggal}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unitPengirim}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {searchResults.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">
                                        <p>Tidak ada data ditemukan. Silakan lakukan pencarian.</p>
                                    </div>
                                )}
                            </div>
                        </main>

                        <footer className="flex justify-end items-center p-4 border-t border-gray-200 bg-white rounded-b-lg space-x-3">
                            <button onClick={resetStateAndClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Batal</button>
                            <button onClick={handleNext} disabled={!selectedNadineSurat} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold disabled:bg-gray-300">Selanjutnya</button>
                        </footer>
                    </>
                )}

                {view === 'categorize' && selectedNadineSurat && (
                    <>
                        <main className="flex-1 p-6 overflow-y-auto">
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Surat Terpilih</h3>
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4 w-1/4">ID Permohonan</td><td className="text-gray-800 py-2.5">{selectedNadineSurat.naskahId}</td></tr>
                                        <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">No Tiket/ND</td><td className="text-gray-800 py-2.5">{selectedNadineSurat.nomorSurat}</td></tr>
                                        <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Tanggal</td><td className="text-gray-800 py-2.5">{selectedNadineSurat.tanggal}</td></tr>
                                        <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Pemohon</td><td className="text-gray-800 py-2.5">{selectedNadineSurat.unitPengirim}</td></tr>
                                        <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Unit</td><td className="text-gray-800 py-2.5">{selectedNadineSurat.unitPengirim}</td></tr>
                                        <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Jenis</td><td className="text-gray-800 py-2.5">{selectedJenis || <span className="text-gray-400 italic">Pilih jenis di bawah</span>}</td></tr>
                                        <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Status</td><td className="text-gray-800 py-2.5"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Baru</span></td></tr>
                                        <tr><td className="font-medium text-gray-500 pt-2.5 pr-4 align-top">Perihal</td><td className="text-gray-800 pt-2.5">{selectedNadineSurat.perihal}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Jenis Permohonan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div onClick={() => setSelectedJenis(JenisPermohonan.PENANGANAN_PERKARA)} className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 ${selectedJenis === JenisPermohonan.PENANGANAN_PERKARA ? 'border-orange-500 border-2 bg-orange-50 shadow-lg' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
                                        <div className="flex items-center mb-2">
                                            <ShieldCheckIcon className="h-6 w-6 text-orange-600 mr-3"/>
                                            <h4 className="font-bold text-lg text-orange-800">Penanganan Perkara</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Bantuan hukum untuk penyelesaian perkara di badan peradilan (litigasi).</p>
                                    </div>
                                    <div onClick={() => setSelectedJenis(JenisPermohonan.PENDAMPINGAN)} className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 ${selectedJenis === JenisPermohonan.PENDAMPINGAN ? 'border-green-500 border-2 bg-green-50 shadow-lg' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
                                        <div className="flex items-center mb-2">
                                            <UserGroupIcon className="h-6 w-6 text-green-600 mr-3"/>
                                            <h4 className="font-bold text-lg text-green-800">Pendampingan</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Bantuan hukum di luar pengadilan, seperti konsultasi, mediasi, atau sebagai saksi/ahli (non-litigasi).</p>
                                    </div>
                                </div>
                            </div>

                        </main>
                        <footer className="flex justify-end items-center p-4 border-t border-gray-200 bg-white rounded-b-lg space-x-3">
                            <button onClick={handleBack} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Sebelumnya</button>
                            <button onClick={handleConfirm} disabled={!selectedJenis} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold disabled:bg-gray-300">OK</button>
                        </footer>
                    </>
                )}
            </div>
        </div>
    );
};

export default TarikDataNadineModal;