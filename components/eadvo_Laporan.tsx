import React, { useState } from 'react';
import { 
    DocumentTextIcon, CloudDownloadIcon as ArrowDownTrayIcon, PrintIcon as PrinterIcon, 
    CalendarIcon, SearchIcon as FilterIcon, SearchIcon, ChevronDownIcon, FolderIcon
} from './icons';
import { View } from '../types';
import Breadcrumb from './Breadcrumb';

interface LaporanProps {
    onNavigate: (view: View) => void;
}

type LaporanType = 'periodik' | 'insidental';
type PeriodikVariant = 'bulanan' | 'triwulanan' | 'tahunan';

const incidentalReports = [
    "1. Laporan Monitoring Perkara",
    "2. Laporan Putusan Yang Telah Berkekuatan Hukum Tetap",
    "3. Daftar Perkara Kalah",
    "4. Daftar Perkara Eks BDL",
    "5. Daftar Perkara Eks BPPN",
    "6. Daftar Perkara Eks PPA",
    "7. Daftar Perkara PUPN",
    "8. Rekapitulasi Perkara Berdasarkan Jenis Perkara",
    "9. Rekapitulasi Perkara Berdasarkan Pokok Perkara",
    "10. Rekapitulasi Perkara Berdasarkan Objek Tuntutan",
    "11. Rekapitulasi Perkara Berdasarkan Unit Instansi",
    "12. Rekapitulasi Perkara Berdasarkan Tingkat Pengadilan",
    "13. Rekapitulasi Berdasarkan Penyelesaian Perkara",
    "14. Rekapitulasi Perkara Berdasarkan Penangan Perkara"
];

const EAdvokasiLaporan: React.FC<LaporanProps> = ({ onNavigate }) => {
    const [laporanType, setLaporanType] = useState<LaporanType>('periodik');
    const [periodikVariant, setPeriodikVariant] = useState<PeriodikVariant>('triwulanan');
    const [selectedInsidental, setSelectedInsidental] = useState<string>(incidentalReports[0]);

    // This would be replaced with actual chart generation / data processing
    const renderPeriodikContent = () => {
        return (
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm mt-4">
                <div className="text-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800 uppercase">Laporan Perkembangan Perkara</h2>
                    <p className="text-sm text-gray-600 font-medium">Periode {periodikVariant === 'bulanan' ? 'Bulan .../Tahun ...' : periodikVariant === 'triwulanan' ? 'Triwulan .../Tahun ...' : 'Tahun ...'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                    <div>
                        <p><span className="font-semibold text-gray-700 w-24 inline-block">Periode:</span> <span>[Pilih Periode]</span></p>
                        <p><span className="font-semibold text-gray-700 w-24 inline-block">Jenis Perkara:</span> <span className="text-red-500 font-semibold">[Pilih Jenis]</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-center text-sm font-semibold text-gray-600 mb-4">Perkara Aktif Sampai {periodikVariant === 'triwulanan' ? 'Triwulan' : periodikVariant === 'bulanan' ? 'Bulan' : 'Tahun'} Ini</h3>
                        {/* Placeholder for bar chart */}
                        <div className="h-32 bg-gray-50 flex items-center justify-center rounded border border-gray-100 italic text-gray-400">
                            [Grafik Perkara Aktif]
                        </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-center text-sm font-semibold text-gray-600 mb-4">Perkara Selesai Pada {periodikVariant === 'triwulanan' ? 'Triwulan' : periodikVariant === 'bulanan' ? 'Bulan' : 'Tahun'} Ini</h3>
                        {/* Placeholder for bar chart */}
                        <div className="h-32 bg-gray-50 flex items-center justify-center rounded border border-gray-100 italic text-gray-400">
                            [Grafik Perkara Selesai]
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto text-xs border border-gray-200 rounded">
                    <table className="w-full text-center">
                        <thead className="bg-gray-50">
                            <tr>
                                <th rowSpan={2} className="border border-gray-200 p-2 text-left font-semibold align-middle">No</th>
                                <th rowSpan={2} className="border border-gray-200 p-2 text-left font-semibold align-middle">Uraian</th>
                                <th colSpan={5} className="border border-gray-200 p-2 font-semibold">s.d. {periodikVariant === 'triwulanan' ? 'Triwulan' : periodikVariant === 'bulanan' ? 'Bulan' : 'Tahun'} Lalu</th>
                                <th colSpan={5} className="border border-gray-200 p-2 font-semibold">{periodikVariant === 'triwulanan' ? 'Triwulan' : periodikVariant === 'bulanan' ? 'Bulan' : 'Tahun'} Ini</th>
                                <th colSpan={5} className="border border-gray-200 p-2 font-semibold">Selesai {periodikVariant === 'triwulanan' ? 'Triwulan' : periodikVariant === 'bulanan' ? 'Bulan' : 'Tahun'} Ini</th>
                                <th colSpan={5} className="border border-gray-200 p-2 font-semibold">s.d. {periodikVariant === 'triwulanan' ? 'Triwulan' : periodikVariant === 'bulanan' ? 'Bulan' : 'Tahun'} Ini</th>
                            </tr>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-200 p-1">PN</th><th className="border border-gray-200 p-1">PT</th><th className="border border-gray-200 p-1">Kasasi</th><th className="border border-gray-200 p-1">PK</th><th className="border border-gray-200 p-1">Jumlah</th>
                                <th className="border border-gray-200 p-1">PN</th><th className="border border-gray-200 p-1">PT</th><th className="border border-gray-200 p-1">Kasasi</th><th className="border border-gray-200 p-1">PK</th><th className="border border-gray-200 p-1">Jumlah</th>
                                <th className="border border-gray-200 p-1">PN</th><th className="border border-gray-200 p-1">PT</th><th className="border border-gray-200 p-1">Kasasi</th><th className="border border-gray-200 p-1">PK</th><th className="border border-gray-200 p-1">Jumlah</th>
                                <th className="border border-gray-200 p-1">PN</th><th className="border border-gray-200 p-1">PT</th><th className="border border-gray-200 p-1">Kasasi</th><th className="border border-gray-200 p-1">PK</th><th className="border border-gray-200 p-1">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="border border-gray-200 p-2 text-left">1</td><td className="border border-gray-200 p-2 text-left">Proses</td><td colSpan={20} className="border border-gray-200 p-2 bg-gray-50/50 text-gray-400 italic">Data ...</td></tr>
                            <tr><td className="border border-gray-200 p-2 text-left">2</td><td className="border border-gray-200 p-2 text-left">Menang</td><td colSpan={20} className="border border-gray-200 p-2 bg-gray-50/50 text-gray-400 italic">Data ...</td></tr>
                            <tr><td className="border border-gray-200 p-2 text-left">3</td><td className="border border-gray-200 p-2 text-left">Kalah</td><td colSpan={20} className="border border-gray-200 p-2 bg-gray-50/50 text-gray-400 italic">Data ...</td></tr>
                            <tr className="bg-gray-100 font-semibold"><td colSpan={2} className="border border-gray-200 p-2">Total</td><td colSpan={20} className="border border-gray-200 p-2 text-gray-400 italic">Total ...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderInsidentalContent = () => {
        return (
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm mt-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800 uppercase">{selectedInsidental.substring(selectedInsidental.indexOf('.') + 2)}</h2>
                    <div className="flex space-x-2">
                         <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-md text-sm hover:bg-gray-100 font-medium transition">
                            <FilterIcon className="h-4 w-4" />
                            <span>Filter Parameter</span>
                        </button>
                    </div>
                </div>

                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg border-dashed">
                    <FolderIcon className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-500">Pratinjau Laporan</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm text-center">Silakan sesuaikan parameter laporan untuk melihat data {selectedInsidental.substring(selectedInsidental.indexOf('.') + 2)}.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-blue-700 transition">
                        Tampilkan Data
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="p-8 pb-4">
                <Breadcrumb currentView="eAdvokasiLaporan" onNavigate={onNavigate} />
                <div className="flex justify-between items-center mt-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Laporan & Statistik</h1>
                        <p className="text-sm text-gray-500 mt-1">Buat, lihat, dan unduh laporan penanganan hukum.</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
                            <PrinterIcon className="h-4 w-4" />
                            <span>Cetak</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            <span>Unduh Laporan</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 p-8 pt-0 gap-8 overflow-hidden">
                {/* Left Sidebar for Report Types */}
                <div className="w-72 flex-shrink-0 flex flex-col space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4 text-blue-600" />
                                <span>1. Laporan Periodik</span>
                            </h3>
                        </div>
                        <div className="p-2 space-y-1">
                            <button 
                                onClick={() => { setLaporanType('periodik'); setPeriodikVariant('bulanan'); }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${laporanType === 'periodik' && periodikVariant === 'bulanan' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                Laporan Bulanan
                            </button>
                            <button 
                                onClick={() => { setLaporanType('periodik'); setPeriodikVariant('triwulanan'); }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${laporanType === 'periodik' && periodikVariant === 'triwulanan' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                Laporan Triwulanan
                            </button>
                            <button 
                                onClick={() => { setLaporanType('periodik'); setPeriodikVariant('tahunan'); }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${laporanType === 'periodik' && periodikVariant === 'tahunan' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                Laporan Tahunan
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-2">
                                <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                                <span>2. Laporan Insidental</span>
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {incidentalReports.map((report) => (
                                <button
                                    key={report}
                                    onClick={() => { setLaporanType('insidental'); setSelectedInsidental(report); }}
                                    className={`w-full text-left px-3 py-2.5 text-xs rounded-md transition leading-relaxed ${laporanType === 'insidental' && selectedInsidental === report ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    {report}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-8">
                    {/* Filter Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
                        {laporanType === 'periodik' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tahun</label>
                                    <select className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                        <option>2026</option>
                                        <option>2025</option>
                                        <option>2024</option>
                                    </select>
                                </div>
                                {periodikVariant === 'bulanan' && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Bulan</label>
                                        <select className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                            <option>Januari</option>
                                            <option>Februari</option>
                                            <option>Maret</option>
                                            <option>April</option>
                                        </select>
                                    </div>
                                )}
                                {periodikVariant === 'triwulanan' && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Triwulan</label>
                                        <select className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                            <option>Triwulan I</option>
                                            <option>Triwulan II</option>
                                            <option>Triwulan III</option>
                                            <option>Triwulan IV</option>
                                        </select>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Jenis Laporan</label>
                                    <select className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                        <option>LPP</option>
                                        <option>LPP Aktif</option>
                                        <option>LPP Masuk</option>
                                        <option>LPP Selesai</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Jenis Perkara</label>
                                    <select className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                        <option value="">Semua</option>
                                        <option>Perdata</option>
                                        <option>TUN</option>
                                        <option>Pidana</option>
                                        <option>Lainnya</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pokok Perkara</label>
                                    <input type="text" placeholder="Semua..." className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Wilayah</label>
                                    <input type="text" placeholder="Semua..." className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pengadilan</label>
                                    <input type="text" placeholder="Semua..." className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Objek Tuntutan</label>
                                    <input type="text" placeholder="Semua..." className="w-40 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3" />
                                </div>
                            </>
                        )}
                        <div className="space-y-1 min-w-[200px] flex-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Kriteria / Unit (Opsional)</label>
                            <input 
                                type="text" 
                                placeholder="Pilih unit atau klasifikasi..."
                                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                            />
                        </div>
                        <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-semibold hover:bg-blue-100 transition h-[38px] border border-blue-200 ml-auto self-end">
                            Terapkan Parameter
                        </button>
                    </div>

                    {/* Report Content */}
                    {laporanType === 'periodik' ? renderPeriodikContent() : renderInsidentalContent()}
                </div>
            </div>
        </div>
    );
};

export default EAdvokasiLaporan;
