
import React, { useState } from 'react';
import { View } from '../types';
import { 
    SearchIcon, CalendarIcon, ShieldCheckIcon, UserGroupIcon, 
    DocumentTextIcon, InformationCircleIcon, ClockIcon, DesktopComputerIcon,
    DownloadIcon, PrintIcon, RefreshIcon, ChevronDownIcon, EyeIcon,
    TrendingUpIcon, TrendingDownIcon, ArchiveIcon, ScaleIcon,
    CheckCircleIcon, ExclamationIcon, ClipboardCopyIcon, XIcon
} from './icons';
import Breadcrumb from './Breadcrumb';
import { CariDokumen } from './eadvo_CariDokumen';
import { useAdvokasiStore } from '../useAdvokasiStore';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface MonitoringProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

const FilterIconPlaceholder = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
);

const PrinterIconPlaceholder = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm2-9V5a2 2 0 00-2-2H9a2 2 0 00-2 2v3m4-3h6" />
    </svg>
);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

    const FILTER_OPTIONS = {
        tahunMasuk: ['2026', '2025', '2024', '2023', '2022', '2021'],
        unitInstansi: ['Setjen', 'Itjen', 'DJP', 'DJBC', 'DJPK', 'DJKN', 'DJPb', 'BKF', 'BPPK'],
        unitPemohon: ['Setjen', 'Itjen', 'DJP', 'DJBC', 'DJPK', 'DJKN'],
        unitPemanggil: ['Kejari', 'Kejati', 'Polres', 'Polda', 'KPK'],
        jenisPerkara: ['Perdata', 'Pidana', 'TUN', 'Uji Materiil', 'PHI'],
        pokokPerkara: ['Keuangan Negara', 'Aset Negara', 'Kepegawaian', 'Kontrak', 'PMH'],
        wilayah: ['Pusat', 'Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku & Papua'],
        pengadilan: ['PN Jakarta Pusat', 'PN Jakarta Selatan', 'PTUN Jakarta', 'MA', 'MK'],
        objekTuntutan: ['Ganti Rugi Materil', 'Ganti Rugi Immateril', 'Pembatalan SK', 'Pemulihan Aset'],
        posisiPerkara: ['Tingkat Pertama', 'Banding', 'Kasasi', 'Peninjauan Kembali'],
        posisiKasus: ['Saksi', 'Tersangka', 'Terdakwa', 'Teradu'],
        status: ['Aktif', 'Selesai', 'Dihentikan', 'Mediasi'],
        pic: ['Admin Tuban Kum', 'Dedi Irawan', 'Rini Astuti', 'Budi Santoso']
    };

    const MultiSelectDropdown: React.FC<{
        label: string,
        options: string[],
        selected: string[],
        onToggle: (val: string) => void,
        onReset: () => void
    }> = ({ label, options, selected, onToggle, onReset }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="relative group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">{label}</label>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-left text-xs font-bold text-gray-700 hover:bg-white hover:border-blue-300 transition-all focus:ring-2 focus:ring-blue-100 outline-none"
                    type="button"
                >
                    <span className="truncate pr-4">
                        {selected.length === 0 ? `Pilih ${label}...` : `${selected.length} Item Terpilih`}
                    </span>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                        <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/50 p-2 animate-in fade-in zoom-in-95 duration-200 max-h-64 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center px-3 py-2 border-b border-gray-50 mb-2">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">Opsi</span>
                                <button onClick={onReset} className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-tight">Clear</button>
                            </div>
                            <div className="grid grid-cols-1 gap-0.5">
                                {options.map((opt) => (
                                    <label key={opt} className="flex items-center space-x-3 px-3 py-2.5 hover:bg-blue-50/50 rounded-xl cursor-pointer group transition-colors">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="appearance-none h-5 w-5 border-2 border-gray-200 rounded-lg checked:bg-[#0055A5] checked:border-[#0055A5] transition-all cursor-pointer"
                                                checked={selected.includes(opt)}
                                                onChange={() => onToggle(opt)}
                                            />
                                            {selected.includes(opt) && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-3.5 w-3.5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-[11px] font-bold ${selected.includes(opt) ? 'text-blue-700' : 'text-gray-500'} group-hover:text-gray-900 transition-colors`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

const Monitoring: React.FC<MonitoringProps> = ({ currentView, onNavigate }) => {
    const { telaahanRecords, perkaraRecords, pendampinganRecords, putusanRecords } = useAdvokasiStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [auditSearchQuery, setAuditSearchQuery] = useState('');
    const [auditStartDate, setAuditStartDate] = useState('');
    const [auditEndDate, setAuditEndDate] = useState('');
    const [activeAuditTab, setActiveAuditTab] = useState('Semua');
    const [auditPage, setAuditPage] = useState(1);
    const [selectedStatistikMonth, setSelectedStatistikMonth] = useState('Juli');
    const [selectedStatistikYear, setSelectedStatistikYear] = useState('2026');
    const [selectedStatistikKategori, setSelectedStatistikKategori] = useState('Jenis Perkara');
    const [activeStatistikTab, setActiveStatistikTab] = useState<'Perkara' | 'Pendampingan' | 'Telaahan' | 'Penanganan Putusan'>('Perkara');

    // State for Sub-Modul Monitoring Telaahan
    const [telaahanSearch, setTelaahanSearch] = useState('');
    const [telaahanStatus, setTelaahanStatus] = useState('Semua Status');
    const [telaahanPengirim, setTelaahanPengirim] = useState('Semua Pengirim');
    const [telaahanPic, setTelaahanPic] = useState('Semua PIC');
    const [telaahanStartDate, setTelaahanStartDate] = useState('');
    const [telaahanEndDate, setTelaahanEndDate] = useState('');
    const [telaahanPeriodePreset, setTelaahanPeriodePreset] = useState<'Semua' | 'Bulan Ini' | 'Triwulan Ini' | 'Tahun 2026'>('Semua');
    const [telaahanPage, setTelaahanPage] = useState(1);
    const [selectedTelaahanForDetail, setSelectedTelaahanForDetail] = useState<any | null>(null);

    // State for Sub-Modul Monitoring Kelengkapan Data
    const [kelengkapanModul, setKelengkapanModul] = useState('Semua Modul');
    const [kelengkapanLevel, setKelengkapanLevel] = useState('Semua Tingkat');
    const [kelengkapanSearch, setKelengkapanSearch] = useState('');
    const [kelengkapanPage, setKelengkapanPage] = useState(1);
    const [selectedAuditRecordForModal, setSelectedAuditRecordForModal] = useState<any | null>(null);

    const [filters, setFilters] = useState({
        tahunMasuk: [] as string[],
        startDate: '',
        endDate: '',
        unitInstansi: [] as string[], // Used for Perkara
        unitPemohon: [] as string[],   // For Pendampingan
        unitPemanggil: [] as string[],  // For Pendampingan
        jenisPerkara: [] as string[],   // For Perkara
        pokokPerkara: [] as string[],
        wilayah: [] as string[],
        pengadilan: [] as string[],      // For Perkara
        objekTuntutan: [] as string[],   // For Perkara
        posisiPerkara: [] as string[],
        posisiKasus: [] as string[],     // For Pendampingan
        status: [] as string[],
        pic: [] as string[]
    });

    const statsData = {
        permohonan: { total: 156, active: { count: 42, trend: 'up' as const, percent: 12 }, selesai: { count: 114, trend: 'up' as const, percent: 8 } },
        pendampingan: { total: 89, active: { count: 15, trend: 'down' as const, percent: 5 }, selesai: { count: 74, trend: 'up' as const, percent: 15 } },
        perkara: { total: 432, active: { count: 128, trend: 'up' as const, percent: 22 }, selesai: { count: 304, trend: 'up' as const, percent: 10 } },
        putusan: { total: 285, active: { count: 56, trend: 'up' as const, percent: 18 }, selesai: { count: 229, trend: 'up' as const, percent: 5 } },
    };

    const chartData = [
        { name: 'Permohonan', Aktif: 42, Selesai: 114 },
        { name: 'Pendampingan', Aktif: 15, Selesai: 74 },
        { name: 'Perkara', Aktif: 128, Selesai: 304 },
        { name: 'Putusan', Aktif: 56, Selesai: 229 },
    ];

    const pieData = [
        { name: 'Permohonan', value: 156 },
        { name: 'Pendampingan', value: 89 },
        { name: 'Perkara', value: 432 },
        { name: 'Putusan', value: 285 },
    ];

    const isPencarianView = currentView.includes('Pencarian');

    interface MenuItemType {
        icon: React.ReactNode;
        name: string;
        view: View;
        badge?: string;
    }

    interface MenuGroupType {
        group: string;
        items: MenuItemType[];
    }

    const menus: MenuGroupType[] = isPencarianView ? [
        { 
            group: 'PENCARIAN DATA', 
            items: [
                { icon: <SearchIcon className="h-4 w-4" />, name: 'Cari Perkara', view: 'eAdvokasiPencarianPerkara' as View },
                { icon: <SearchIcon className="h-4 w-4" />, name: 'Cari Pendampingan', view: 'eAdvokasiPencarianPendampingan' as View },
                { icon: <SearchIcon className="h-4 w-4" />, name: 'Cari Penanganan Putusan', view: 'eAdvokasiPencarianPutusan' as View },
                { icon: <SearchIcon className="h-4 w-4" />, name: 'Cari Dokumen', view: 'eAdvokasiPencarianDokumen' as View },
            ]
        }
    ] : [
        { 
            group: 'MONITORING UTAMA', 
            items: [
                { icon: <DesktopComputerIcon className="h-4 w-4" />, name: 'Dashboard', view: 'eAdvokasiDashboard' as View },
                { icon: <TrendingUpIcon className="h-4 w-4" />, name: 'Statistik', view: 'eAdvokasiStatistikPerkara' as View },
                { icon: <CalendarIcon className="h-4 w-4" />, name: 'Persidangan', view: 'eAdvokasiMonitoringPersidangan' as View },
                { icon: <DocumentTextIcon className="h-4 w-4" />, name: 'Putusan', view: 'eAdvokasiMonitoringPutusan' as View },
                { icon: <UserGroupIcon className="h-4 w-4" />, name: 'Pendampingan', view: 'eAdvokasiMonitoringPendampingan' as View },
                { icon: <ShieldCheckIcon className="h-4 w-4" />, name: 'Perkara', view: 'eAdvokasiMonitoringPerkara' as View },
                { icon: <ScaleIcon className="h-4 w-4" />, name: 'Telaahan', view: 'eAdvokasiMonitoringTelaahan' as View },
                { icon: <CheckCircleIcon className="h-4 w-4" />, name: 'Kelengkapan Data', view: 'eAdvokasiMonitoringKelengkapanData' as View },
            ]
        },
        {
            group: 'PENGAWASAN & AUDIT',
            items: [
                { icon: <InformationCircleIcon className="h-4 w-4" />, name: 'Risiko Hukum', view: 'eAdvokasiMonitoringRisikoHukum' as View },
                { icon: <ClockIcon className="h-4 w-4" />, name: 'Riwayat (Audit Trail)', view: 'eAdvokasiAuditTrail' as View },
            ]
        }
    ];

    const renderDashboard = () => (
        <div className="h-full flex flex-col space-y-6">
            <Breadcrumb currentView={currentView} onNavigate={onNavigate} />
            
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Monitoring</h2>
                    <p className="text-sm text-gray-500 mt-1">Laporan statistik Penanganan Permasalahan Hukum di Lingkungan Kementerian Keuangan</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 transition shadow-sm">
                        <RefreshIcon className="h-4 w-4" />
                        <span>Reset Data</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition shadow-sm">
                        <DownloadIcon className="h-4 w-4" />
                        <span>Ekspor Laporan</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Permohonan" 
                    stats={statsData.permohonan} 
                    icon={<ArchiveIcon className="h-6 w-6 text-blue-600" />}
                    color="blue"
                />
                <StatCard 
                    title="Pendampingan" 
                    stats={statsData.pendampingan} 
                    icon={<UserGroupIcon className="h-6 w-6 text-green-600" />}
                    color="green"
                />
                <StatCard 
                    title="Perkara" 
                    stats={statsData.perkara} 
                    icon={<ShieldCheckIcon className="h-6 w-6 text-amber-600" />}
                    color="amber"
                />
                <StatCard 
                    title="Putusan" 
                    stats={statsData.putusan} 
                    icon={<DocumentTextIcon className="h-6 w-6 text-purple-600" />}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 tracking-tight">Volume Aktivitas Bulanan</h3>
                            <p className="text-xs text-gray-400 font-bold tracking-widest mt-1 uppercase">Data Periode Mei 2026</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1.5 mr-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Aktif</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Selesai</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#F3F4F6" />
                                <XAxis 
                                    dataKey="name" 
                                    fontSize={10} 
                                    fontWeight={900}
                                    stroke="#9CA3AF" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ dy: 10 }}
                                />
                                <YAxis 
                                    fontSize={10} 
                                    fontWeight={900}
                                    stroke="#9CA3AF" 
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="Aktif" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                                <Bar dataKey="Selesai" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Distribution Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 tracking-tight uppercase mb-8">Distribusi Kasus</h3>
                    <div className="h-80 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Total</span>
                            <span className="text-3xl font-black text-gray-800 tracking-tighter">962</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {pieData.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{item.name}</span>
                                </div>
                                <span className="text-xs font-bold text-gray-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const handleFilterToggle = (field: string, value: string) => {
        setFilters(prev => {
            const currentField = prev[field as keyof typeof prev] as string[];
            const isSelected = currentField.includes(value);
            return {
                ...prev,
                [field]: isSelected 
                    ? currentField.filter(v => v !== value)
                    : [...currentField, value]
            };
        });
    };

    const renderSearchPage = (title: string, placeholder: string) => (
        <div className="space-y-6">
            <Breadcrumb currentView={currentView} onNavigate={onNavigate} />
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`p-3 rounded-lg flex items-center justify-center transition shadow-sm border ${isFilterOpen ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            title="Filter Lanjut"
                        >
                            <FilterIconPlaceholder className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 text-sm"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition shadow-md font-semibold" title="Cari Data">
                        <SearchIcon className="h-5 w-5 mr-2" />
                        <span>Cari</span>
                    </button>
                </div>

                {isFilterOpen && (
                    <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-in slide-in-from-top-4 duration-300">
                        {currentView === 'eAdvokasiPencarianPendampingan' ? (
                            <>
                                <MultiSelectDropdown 
                                    label="Tahun Masuk" 
                                    options={FILTER_OPTIONS.tahunMasuk} 
                                    selected={filters.tahunMasuk} 
                                    onToggle={(val) => handleFilterToggle('tahunMasuk', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, tahunMasuk: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Unit Pemohon" 
                                    options={FILTER_OPTIONS.unitPemohon} 
                                    selected={filters.unitPemohon} 
                                    onToggle={(val) => handleFilterToggle('unitPemohon', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, unitPemohon: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Unit Pemanggil" 
                                    options={FILTER_OPTIONS.unitPemanggil} 
                                    selected={filters.unitPemanggil} 
                                    onToggle={(val) => handleFilterToggle('unitPemanggil', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, unitPemanggil: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Pokok Perkara" 
                                    options={FILTER_OPTIONS.pokokPerkara} 
                                    selected={filters.pokokPerkara} 
                                    onToggle={(val) => handleFilterToggle('pokokPerkara', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, pokokPerkara: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Wilayah" 
                                    options={FILTER_OPTIONS.wilayah} 
                                    selected={filters.wilayah} 
                                    onToggle={(val) => handleFilterToggle('wilayah', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, wilayah: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Posisi Kasus" 
                                    options={FILTER_OPTIONS.posisiKasus} 
                                    selected={filters.posisiKasus} 
                                    onToggle={(val) => handleFilterToggle('posisiKasus', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, posisiKasus: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="PIC" 
                                    options={FILTER_OPTIONS.pic} 
                                    selected={filters.pic} 
                                    onToggle={(val) => handleFilterToggle('pic', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, pic: [] }))}
                                />
                            </>
                        ) : (
                            <>
                                <MultiSelectDropdown 
                                    label="Tahun Masuk" 
                                    options={FILTER_OPTIONS.tahunMasuk} 
                                    selected={filters.tahunMasuk} 
                                    onToggle={(val) => handleFilterToggle('tahunMasuk', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, tahunMasuk: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Unit Instansi" 
                                    options={FILTER_OPTIONS.unitInstansi} 
                                    selected={filters.unitInstansi} 
                                    onToggle={(val) => handleFilterToggle('unitInstansi', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, unitInstansi: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Jenis Perkara" 
                                    options={FILTER_OPTIONS.jenisPerkara} 
                                    selected={filters.jenisPerkara} 
                                    onToggle={(val) => handleFilterToggle('jenisPerkara', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, jenisPerkara: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Pokok Perkara" 
                                    options={FILTER_OPTIONS.pokokPerkara} 
                                    selected={filters.pokokPerkara} 
                                    onToggle={(val) => handleFilterToggle('pokokPerkara', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, pokokPerkara: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Wilayah" 
                                    options={FILTER_OPTIONS.wilayah} 
                                    selected={filters.wilayah} 
                                    onToggle={(val) => handleFilterToggle('wilayah', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, wilayah: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Pengadilan" 
                                    options={FILTER_OPTIONS.pengadilan} 
                                    selected={filters.pengadilan} 
                                    onToggle={(val) => handleFilterToggle('pengadilan', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, pengadilan: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Objek Tuntutan" 
                                    options={FILTER_OPTIONS.objekTuntutan} 
                                    selected={filters.objekTuntutan} 
                                    onToggle={(val) => handleFilterToggle('objekTuntutan', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, objekTuntutan: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Posisi Perkara" 
                                    options={FILTER_OPTIONS.posisiPerkara} 
                                    selected={filters.posisiPerkara} 
                                    onToggle={(val) => handleFilterToggle('posisiPerkara', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, posisiPerkara: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="Status" 
                                    options={FILTER_OPTIONS.status} 
                                    selected={filters.status} 
                                    onToggle={(val) => handleFilterToggle('status', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, status: [] }))}
                                />
                                <MultiSelectDropdown 
                                    label="PIC" 
                                    options={FILTER_OPTIONS.pic} 
                                    selected={filters.pic} 
                                    onToggle={(val) => handleFilterToggle('pic', val)} 
                                    onReset={() => setFilters(prev => ({ ...prev, pic: [] }))}
                                />
                            </>
                        )}

                        <div className="flex items-end lg:col-span-1">
                            <button 
                                onClick={() => setFilters({
                                    tahunMasuk: [],
                                    startDate: '',
                                    endDate: '',
                                    unitInstansi: [],
                                    unitPemohon: [],
                                    unitPemanggil: [],
                                    jenisPerkara: [],
                                    pokokPerkara: [],
                                    wilayah: [],
                                    pengadilan: [],
                                    objekTuntutan: [],
                                    posisiPerkara: [],
                                    posisiKasus: [],
                                    status: [],
                                    pic: []
                                })}
                                className="w-full text-center p-3 text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-dashed border-red-200"
                            >
                                Reset Semua Filter
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center px-8">
                    <h3 className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Database Search Results</h3>
                    <div className="flex space-x-1">
                        <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition" title="Ekspor Excel">
                            <DownloadIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <SearchIcon className="h-10 w-10 text-gray-200" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to Search</h4>
                    <p className="text-gray-500 max-w-sm mx-auto">Gunakan kolom di atas untuk mencari data spesifik dalam database E-Advokasi.</p>
                </div>
            </div>
        </div>
    );

    const renderMonitoringTable = (title: string, columns: string[]) => (
        <div className="space-y-6">
             <Breadcrumb currentView={currentView} onNavigate={onNavigate} />
             <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitoring update data penanganan.</p>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition text-sm font-semibold shadow-sm focus:ring-2 focus:ring-blue-100 border ${isFilterOpen ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <FilterIconPlaceholder className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition text-sm font-semibold shadow-sm">
                        <DownloadIcon className="h-4 w-4" />
                        <span>Ekspor</span>
                    </button>
                </div>
            </div>

            {isFilterOpen && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div className="space-y-4">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Periode</label>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] text-gray-500 w-8">Dari</span>
                                    <input 
                                        type="date" 
                                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] text-gray-500 w-8">Sampai</span>
                                    <input 
                                        type="date" 
                                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                                {(filters.startDate || filters.endDate) && (
                                    <button 
                                        onClick={() => setFilters(prev => ({ ...prev, startDate: '', endDate: '' }))}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold text-right"
                                    >
                                        Reset Tanggal
                                    </button>
                                )}
                            </div>
                        </div>

                        {(currentView === 'eAdvokasiMonitoringPerkara') && (
                            <MultiSelectDropdown 
                                label="Unit Instansi" 
                                options={FILTER_OPTIONS.unitInstansi} 
                                selected={filters.unitInstansi} 
                                onToggle={(val) => handleFilterToggle('unitInstansi', val)} 
                                onReset={() => setFilters(prev => ({ ...prev, unitInstansi: [] }))}
                            />
                        )}

                        {(currentView === 'eAdvokasiMonitoringPutusan' || currentView === 'eAdvokasiMonitoringPerkara' || currentView === 'eAdvokasiMonitoringRisikoHukum') && (
                            <MultiSelectDropdown 
                                label="Jenis Perkara" 
                                options={FILTER_OPTIONS.jenisPerkara} 
                                selected={filters.jenisPerkara} 
                                onToggle={(val) => handleFilterToggle('jenisPerkara', val)} 
                                onReset={() => setFilters(prev => ({ ...prev, jenisPerkara: [] }))}
                            />
                        )}

                        {(currentView === 'eAdvokasiMonitoringPutusan' || currentView === 'eAdvokasiMonitoringPerkara' || currentView === 'eAdvokasiMonitoringRisikoHukum') && (
                            <MultiSelectDropdown 
                                label="Pokok Perkara" 
                                options={FILTER_OPTIONS.pokokPerkara} 
                                selected={filters.pokokPerkara} 
                                onToggle={(val) => handleFilterToggle('pokokPerkara', val)} 
                                onReset={() => setFilters(prev => ({ ...prev, pokokPerkara: [] }))}
                            />
                        )}

                        {(currentView === 'eAdvokasiMonitoringPerkara') && (
                            <MultiSelectDropdown 
                                label="Tingkat Pengadilan" 
                                options={FILTER_OPTIONS.posisiPerkara} 
                                selected={filters.posisiPerkara} 
                                onToggle={(val) => handleFilterToggle('posisiPerkara', val)} 
                                onReset={() => setFilters(prev => ({ ...prev, posisiPerkara: [] }))}
                            />
                        )}

                        {(currentView === 'eAdvokasiMonitoringPutusan' || currentView === 'eAdvokasiMonitoringRisikoHukum') && (
                            <MultiSelectDropdown 
                                label="Objek Tuntutan" 
                                options={FILTER_OPTIONS.objekTuntutan} 
                                selected={filters.objekTuntutan} 
                                onToggle={(val) => handleFilterToggle('objekTuntutan', val)} 
                                onReset={() => setFilters(prev => ({ ...prev, objekTuntutan: [] }))}
                            />
                        )}

                        {(currentView === 'eAdvokasiMonitoringPerkara') && (
                            <MultiSelectDropdown 
                                label="Status" 
                                options={FILTER_OPTIONS.status} 
                                selected={filters.status} 
                                onToggle={(val) => handleFilterToggle('status', val)} 
                                onReset={() => setFilters(prev => ({ ...prev, status: [] }))}
                            />
                        )}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">No</th>
                                {columns.map((col, idx) => (
                                    <th key={idx} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {col}
                                    </th>
                                ))}
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                <tr key={item} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-8 py-5 text-sm font-bold text-gray-300">{item}</td>
                                    {columns.map((_, idx) => (
                                        <td key={idx} className="px-8 py-5">
                                            <div className="h-2 bg-gray-100 group-hover:bg-blue-100 rounded-full w-24 transition-colors"></div>
                                        </td>
                                    ))}
                                    <td className="px-8 py-5 text-center">
                                        <button className="text-blue-600 hover:bg-blue-600 hover:text-white p-2.5 rounded-xl transition-all shadow-sm hover:shadow-blue-200">
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center px-8">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing 7 of 124 Results</span>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-400 text-xs font-black cursor-not-allowed">PREV</button>
                        <button className="px-4 py-2 bg-[#0055A5] text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100">1</button>
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black hover:bg-gray-50 transition">2</button>
                        <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-600 text-xs font-black hover:bg-gray-50 transition">NEXT</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStatistikPerkara = () => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const years = ['2023', '2024', '2025', '2026'];

        type TabKey = 'Perkara' | 'Pendampingan' | 'Telaahan' | 'Penanganan Putusan';

        const tabConfigs: Record<TabKey, {
            title: string;
            description: string;
            icon: React.ReactNode;
            sisa: number;
            kategoriOptions: string[];
            defaultKategori: string;
        }> = {
            'Perkara': {
                title: 'Statistik Penanganan Perkara',
                description: 'Laporan statistik penanganan perkara litigasi (Gugatan, Permohonan, PKPU, PHI, TUN) berdasarkan kategori.',
                icon: <ScaleIcon className="h-4 w-4" />,
                sisa: 887,
                kategoriOptions: ['Jenis Perkara', 'Pokok Perkara', 'Unit Berperkara', 'Wilayah'],
                defaultKategori: 'Jenis Perkara'
            },
            'Pendampingan': {
                title: 'Statistik Pendampingan Hukum',
                description: 'Laporan statistik permohonan dan pelaksanaan pendampingan hukum di lingkungan Kementerian Keuangan.',
                icon: <UserGroupIcon className="h-4 w-4" />,
                sisa: 122,
                kategoriOptions: ['Jenis Pendampingan', 'Unit Pemohon', 'Posisi Kasus', 'Status Pendampingan'],
                defaultKategori: 'Jenis Pendampingan'
            },
            'Telaahan': {
                title: 'Statistik Telaahan Kasus Hukum',
                description: 'Laporan statistik analisis yuridis dan penerbitan telaahan kasus hukum bagi unit kerja.',
                icon: <DocumentTextIcon className="h-4 w-4" />,
                sisa: 153,
                kategoriOptions: ['Jenis Telaahan', 'Tingkat Urgensi', 'Unit Pemohon', 'Status Naskah'],
                defaultKategori: 'Jenis Telaahan'
            },
            'Penanganan Putusan': {
                title: 'Statistik Penanganan Putusan',
                description: 'Laporan statistik eksekusi dan tindak lanjut penanganan putusan pengadilan berkekuatan hukum tetap.',
                icon: <ShieldCheckIcon className="h-4 w-4" />,
                sisa: 301,
                kategoriOptions: ['Klasifikasi Putusan', 'Status BHT', 'Tindak Lanjut Putusan', 'Tingkat Peradilan'],
                defaultKategori: 'Klasifikasi Putusan'
            }
        };

        const currentTabInfo = tabConfigs[activeStatistikTab] || tabConfigs['Perkara'];
        const kategoriOptions = currentTabInfo.kategoriOptions;

        // Ensure current selected category is valid for this tab
        const effectiveKategori = kategoriOptions.includes(selectedStatistikKategori)
            ? selectedStatistikKategori
            : currentTabInfo.defaultKategori;

        let statistikData: any[] = [];

        if (activeStatistikTab === 'Perkara') {
            if (effectiveKategori === 'Jenis Perkara') {
                statistikData = [
                    { kategori: 'Gugatan', sisaLalu: 425, masuk: 54, selesai: 65, sisa: 414 },
                    { kategori: 'Permohonan', sisaLalu: 48, masuk: 44, selesai: 37, sisa: 55 },
                    { kategori: 'Kepailitan', sisaLalu: 26, masuk: 3, selesai: 8, sisa: 21 },
                    { kategori: 'Penundaan Kewajiban Pembayaran Utang (PKPU)', sisaLalu: 125, masuk: 23, selesai: 29, sisa: 119 },
                    { kategori: 'Hak Kekayaan Intelektual (HKI)', sisaLalu: 69, masuk: 14, selesai: 12, sisa: 71 },
                    { kategori: 'Pengadilan Hubungan Industrial (PHI)', sisaLalu: 160, masuk: 40, selesai: 25, sisa: 175 },
                    { kategori: 'Perlawanan/Bantahan (derden verzet)', sisaLalu: 25, masuk: 3, selesai: 3, sisa: 25 },
                    { kategori: 'Gugatan Sederhana', sisaLalu: 1, masuk: 7, selesai: 1, sisa: 7 },
                ];
            } else if (effectiveKategori === 'Pokok Perkara') {
                statistikData = [
                    { kategori: 'Perdata Umum', sisaLalu: 210, masuk: 30, selesai: 40, sisa: 200 },
                    { kategori: 'Perdata Khusus', sisaLalu: 150, masuk: 25, selesai: 20, sisa: 155 },
                    { kategori: 'Tata Usaha Negara (TUN)', sisaLalu: 80, masuk: 15, selesai: 10, sisa: 85 },
                    { kategori: 'Pidana Perpajakan & Kepabeanan', sisaLalu: 45, masuk: 5, selesai: 8, sisa: 42 },
                    { kategori: 'Agama / Syariah', sisaLalu: 12, masuk: 2, selesai: 4, sisa: 10 },
                ];
            } else if (effectiveKategori === 'Unit Berperkara') {
                statistikData = [
                    { kategori: 'Sekretariat Jenderal', sisaLalu: 45, masuk: 5, selesai: 10, sisa: 40 },
                    { kategori: 'Direktorat Jenderal Pajak', sisaLalu: 320, masuk: 40, selesai: 45, sisa: 315 },
                    { kategori: 'Direktorat Jenderal Bea dan Cukai', sisaLalu: 180, masuk: 20, selesai: 15, sisa: 185 },
                    { kategori: 'Direktorat Jenderal Kekayaan Negara', sisaLalu: 250, masuk: 35, selesai: 40, sisa: 245 },
                    { kategori: 'Inspektorat Jenderal', sisaLalu: 15, masuk: 2, selesai: 5, sisa: 12 },
                    { kategori: 'Direktorat Jenderal Perbendaharaan', sisaLalu: 38, masuk: 6, selesai: 7, sisa: 37 },
                ];
            } else {
                // Wilayah
                statistikData = [
                    { kategori: 'DKI Jakarta', sisaLalu: 410, masuk: 60, selesai: 70, sisa: 400 },
                    { kategori: 'Jawa Barat & Banten', sisaLalu: 150, masuk: 20, selesai: 25, sisa: 145 },
                    { kategori: 'Jawa Tengah & DIY', sisaLalu: 120, masuk: 15, selesai: 10, sisa: 125 },
                    { kategori: 'Jawa Timur', sisaLalu: 180, masuk: 25, selesai: 30, sisa: 175 },
                    { kategori: 'Sumatera', sisaLalu: 90, masuk: 10, selesai: 15, sisa: 85 },
                    { kategori: 'Kalimantan & Sulawesi', sisaLalu: 65, masuk: 8, selesai: 12, sisa: 61 },
                    { kategori: 'Bali, Nusa Tenggara, Maluku & Papua', sisaLalu: 45, masuk: 6, selesai: 7, sisa: 44 },
                ];
            }
        } else if (activeStatistikTab === 'Pendampingan') {
            if (effectiveKategori === 'Jenis Pendampingan') {
                statistikData = [
                    { kategori: 'Konsultasi Regulasi & Peraturan Perundangan', sisaLalu: 24, masuk: 8, selesai: 10, sisa: 22 },
                    { kategori: 'Pendampingan Perjanjian / Kontrak Kerja Sama', sisaLalu: 30, masuk: 12, selesai: 14, sisa: 28 },
                    { kategori: 'Klarifikasi / Pemanggilan Aparat Penegak Hukum (APH)', sisaLalu: 42, masuk: 15, selesai: 18, sisa: 39 },
                    { kategori: 'Permintaan Keterangan Ahli / Saksi Ahli', sisaLalu: 10, masuk: 5, selesai: 6, sisa: 9 },
                    { kategori: 'Pengadaan Barang dan Jasa (PBJ)', sisaLalu: 18, masuk: 7, selesai: 8, sisa: 17 },
                    { kategori: 'Bantuan Hukum Pra-Peradilan', sisaLalu: 8, masuk: 3, selesai: 4, sisa: 7 },
                ];
            } else if (effectiveKategori === 'Unit Pemohon') {
                statistikData = [
                    { kategori: 'Sekretariat Jenderal', sisaLalu: 22, masuk: 6, selesai: 8, sisa: 20 },
                    { kategori: 'Direktorat Jenderal Pajak', sisaLalu: 40, masuk: 14, selesai: 16, sisa: 38 },
                    { kategori: 'Direktorat Jenderal Bea dan Cukai', sisaLalu: 28, masuk: 9, selesai: 11, sisa: 26 },
                    { kategori: 'Direktorat Jenderal Kekayaan Negara', sisaLalu: 25, masuk: 8, selesai: 10, sisa: 23 },
                    { kategori: 'Direktorat Jenderal Perbendaharaan', sisaLalu: 15, masuk: 4, selesai: 5, sisa: 14 },
                    { kategori: 'Badan Kebijakan Fiskal (BKF)', sisaLalu: 8, masuk: 3, selesai: 4, sisa: 7 },
                    { kategori: 'BPPK & Unit Lainnya', sisaLalu: 6, masuk: 2, selesai: 3, sisa: 5 },
                ];
            } else if (effectiveKategori === 'Posisi Kasus') {
                statistikData = [
                    { kategori: 'Saksi Fakta', sisaLalu: 45, masuk: 16, selesai: 20, sisa: 41 },
                    { kategori: 'Saksi Ahli', sisaLalu: 12, masuk: 6, selesai: 7, sisa: 11 },
                    { kategori: 'Pendampingan Telaah Preventif', sisaLalu: 35, masuk: 12, selesai: 15, sisa: 32 },
                    { kategori: 'Teradu / Terperiksa', sisaLalu: 15, masuk: 4, selesai: 5, sisa: 14 },
                ];
            } else {
                // Status Pendampingan
                statistikData = [
                    { kategori: 'Telaah Awal & Pembentukan Tim', sisaLalu: 18, masuk: 12, selesai: 10, sisa: 20 },
                    { kategori: 'Pendampingan Berjalan / Pemeriksaan APH', sisaLalu: 48, masuk: 15, selesai: 22, sisa: 41 },
                    { kategori: 'Penyusunan Resume & Legal Opinion', sisaLalu: 24, masuk: 8, selesai: 12, sisa: 20 },
                    { kategori: 'Selesai & Rekomendasi Terlaksana', sisaLalu: 12, masuk: 6, selesai: 14, sisa: 4 },
                ];
            }
        } else if (activeStatistikTab === 'Telaahan') {
            if (effectiveKategori === 'Jenis Telaahan') {
                statistikData = [
                    { kategori: 'Kajian Regulasi & Uji Materiil', sisaLalu: 28, masuk: 10, selesai: 12, sisa: 26 },
                    { kategori: 'Sengketa Kepegawaian & Disiplin ASN', sisaLalu: 45, masuk: 16, selesai: 18, sisa: 43 },
                    { kategori: 'Pengelolaan BMN & Piutang Negara', sisaLalu: 36, masuk: 11, selesai: 14, sisa: 33 },
                    { kategori: 'Kontrak Pengadaan, Jasa & Addendum', sisaLalu: 22, masuk: 9, selesai: 10, sisa: 21 },
                    { kategori: 'Restrukturisasi Keuangan & BLU', sisaLalu: 14, masuk: 5, selesai: 6, sisa: 13 },
                    { kategori: 'Perlindungan Hukum Pegawai', sisaLalu: 18, masuk: 6, selesai: 7, sisa: 17 },
                ];
            } else if (effectiveKategori === 'Tingkat Urgensi') {
                statistikData = [
                    { kategori: 'Sangat Segera (Kilat)', sisaLalu: 12, masuk: 8, selesai: 10, sisa: 10 },
                    { kategori: 'Segera', sisaLalu: 65, masuk: 24, selesai: 28, sisa: 61 },
                    { kategori: 'Biasa', sisaLalu: 86, masuk: 25, selesai: 29, sisa: 82 },
                ];
            } else if (effectiveKategori === 'Unit Pemohon') {
                statistikData = [
                    { kategori: 'Biro Hukum / Sekretariat Jenderal', sisaLalu: 32, masuk: 11, selesai: 14, sisa: 29 },
                    { kategori: 'Direktorat Jenderal Pajak', sisaLalu: 50, masuk: 18, selesai: 20, sisa: 48 },
                    { kategori: 'Direktorat Jenderal Bea dan Cukai', sisaLalu: 34, masuk: 12, selesai: 15, sisa: 31 },
                    { kategori: 'Direktorat Jenderal Kekayaan Negara', sisaLalu: 28, masuk: 9, selesai: 11, sisa: 26 },
                    { kategori: 'Direktorat Jenderal Perbendaharaan', sisaLalu: 16, masuk: 5, selesai: 6, sisa: 15 },
                    { kategori: 'Badan Pendidikan dan Pelatihan Keuangan (BPPK)', sisaLalu: 10, masuk: 3, selesai: 4, sisa: 9 },
                ];
            } else {
                // Status Naskah
                statistikData = [
                    { kategori: 'Draft Analisis Penelaah', sisaLalu: 25, masuk: 14, selesai: 12, sisa: 27 },
                    { kategori: 'Review Kasi / Kasubdit', sisaLalu: 38, masuk: 16, selesai: 18, sisa: 36 },
                    { kategori: 'Persetujuan Kepala Biro', sisaLalu: 18, masuk: 8, selesai: 12, sisa: 14 },
                    { kategori: 'Naskah TTE Nadine Selesai', sisaLalu: 82, masuk: 19, selesai: 25, sisa: 76 },
                ];
            }
        } else {
            // Penanganan Putusan
            if (effectiveKategori === 'Klasifikasi Putusan') {
                statistikData = [
                    { kategori: 'Gugatan Ditolak (Menang Kemenkeu)', sisaLalu: 145, masuk: 32, selesai: 38, sisa: 139 },
                    { kategori: 'Tidak Dapat Diterima (Niet Ontvankelijke/NO)', sisaLalu: 80, masuk: 18, selesai: 22, sisa: 76 },
                    { kategori: 'Gugatan Dikabulkan Sebagian', sisaLalu: 42, masuk: 12, selesai: 14, sisa: 40 },
                    { kategori: 'Gugatan Dikabulkan Seluruhnya', sisaLalu: 26, masuk: 7, selesai: 9, sisa: 24 },
                    { kategori: 'Perdamaian (Dading) / Pencabutan', sisaLalu: 15, masuk: 4, selesai: 6, sisa: 13 },
                    { kategori: 'Putusan Gugur', sisaLalu: 10, masuk: 2, selesai: 3, sisa: 9 },
                ];
            } else if (effectiveKategori === 'Status BHT') {
                statistikData = [
                    { kategori: 'Berkekuatan Hukum Tetap (BHT / Inkracht)', sisaLalu: 180, masuk: 38, selesai: 45, sisa: 173 },
                    { kategori: 'Upaya Hukum Banding Berjalan', sisaLalu: 68, masuk: 16, selesai: 18, sisa: 66 },
                    { kategori: 'Upaya Hukum Kasasi Berjalan', sisaLalu: 48, masuk: 12, selesai: 14, sisa: 46 },
                    { kategori: 'Upaya Hukum Peninjauan Kembali (PK)', sisaLalu: 22, masuk: 9, selesai: 15, sisa: 16 },
                ];
            } else if (effectiveKategori === 'Tindak Lanjut Putusan') {
                statistikData = [
                    { kategori: 'Selesai Dilaksanakan (Tuntas)', sisaLalu: 120, masuk: 28, selesai: 35, sisa: 113 },
                    { kategori: 'Pelaksanaan Eksekusi / Rekonsiliasi Dokumen', sisaLalu: 45, masuk: 14, selesai: 16, sisa: 43 },
                    { kategori: 'Penyusunan Rekomendasi Yuridis & Kebijakan', sisaLalu: 35, masuk: 10, selesai: 12, sisa: 33 },
                    { kategori: 'Koordinasi Antar-Kementerian / Lembaga', sisaLalu: 28, masuk: 8, selesai: 10, sisa: 26 },
                    { kategori: 'Usulan Anggaran Pembayaran Ganti Rugi', sisaLalu: 15, masuk: 4, selesai: 5, sisa: 14 },
                ];
            } else {
                // Tingkat Peradilan
                statistikData = [
                    { kategori: 'Pengadilan Negeri / PTUN (Tingkat I)', sisaLalu: 135, masuk: 30, selesai: 35, sisa: 130 },
                    { kategori: 'Pengadilan Tinggi / PT.TUN (Tingkat Banding)', sisaLalu: 72, masuk: 18, selesai: 20, sisa: 70 },
                    { kategori: 'Mahkamah Agung (Kasasi & PK)', sisaLalu: 95, masuk: 22, selesai: 28, sisa: 89 },
                    { kategori: 'Mahkamah Konstitusi (Uji Materi Undang-Undang)', sisaLalu: 16, masuk: 5, selesai: 9, sisa: 12 },
                ];
            }
        }

        return (
            <div className="space-y-6">
                <Breadcrumb currentView={currentView} onNavigate={onNavigate} />
                
                {/* Main Top Header Card with Statistik Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Top Navigation Tabs */}
                    <div className="border-b border-gray-200 px-6 pt-4 bg-gray-50/60">
                        <div className="flex space-x-2 md:space-x-4 overflow-x-auto -mb-px pb-1">
                            {(['Perkara', 'Pendampingan', 'Telaahan', 'Penanganan Putusan'] as TabKey[]).map((tabKey) => {
                                const tab = tabConfigs[tabKey];
                                const isActive = activeStatistikTab === tabKey;
                                return (
                                    <button
                                        key={tabKey}
                                        type="button"
                                        onClick={() => {
                                            setActiveStatistikTab(tabKey);
                                            setSelectedStatistikKategori(tab.defaultKategori);
                                        }}
                                        className={`flex items-center space-x-2.5 py-3 px-5 border-b-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                                            isActive
                                                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-2xs font-bold'
                                                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                                            {tab.icon}
                                        </span>
                                        <span>{tabKey}</span>
                                        <span 
                                            title="Sisa Perkara / Kasus"
                                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                isActive
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-200/70 text-gray-600'
                                            }`}
                                        >
                                            {isActive ? statistikData.reduce((acc, curr) => acc + curr.sisa, 0) : tab.sisa}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filter and Title Controls */}
                    <div className="p-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center space-x-3">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">
                                    {currentTabInfo.title}
                                </h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {currentTabInfo.description}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold text-gray-600">Kategori:</span>
                                <div className="relative">
                                    <select 
                                        value={effectiveKategori}
                                        onChange={(e) => setSelectedStatistikKategori(e.target.value)}
                                        className="appearance-none border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm font-medium"
                                    >
                                        {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
                                <span className="text-sm font-semibold text-gray-600">Periode:</span>
                                <div className="relative">
                                    <select 
                                        value={selectedStatistikMonth}
                                        onChange={(e) => setSelectedStatistikMonth(e.target.value)}
                                        className="appearance-none border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm font-medium"
                                    >
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select 
                                        value={selectedStatistikYear}
                                        onChange={(e) => setSelectedStatistikYear(e.target.value)}
                                        className="appearance-none border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm font-medium"
                                    >
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="border-l border-gray-200 pl-3 flex items-center">
                                <button 
                                    type="button"
                                    onClick={() => window.print()}
                                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                                >
                                    <DownloadIcon className="h-4 w-4" />
                                    <span>Export PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700">
                            <thead className="bg-[#F5F8FA] text-gray-600 border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="py-3 px-6 font-semibold w-16 text-center">No</th>
                                    <th scope="col" className="py-3 px-6 font-semibold">{effectiveKategori}</th>
                                    <th scope="col" className="py-3 px-6 font-semibold text-center w-36">Sisa Bulan Lalu</th>
                                    <th scope="col" className="py-3 px-6 font-semibold text-center w-36">Masuk</th>
                                    <th scope="col" className="py-3 px-6 font-semibold text-center w-36">Selesai</th>
                                    <th scope="col" className="py-3 px-6 font-semibold text-center w-36">Sisa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {statistikData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition">
                                        <td className="py-3 px-6 text-center text-gray-500">{index + 1}</td>
                                        <td className="py-3 px-6 font-medium text-gray-800">{row.kategori}</td>
                                        <td className="py-3 px-6 text-center font-semibold text-gray-600">{row.sisaLalu}</td>
                                        <td className="py-3 px-6 text-center font-semibold text-blue-600">{row.masuk}</td>
                                        <td className="py-3 px-6 text-center font-semibold text-green-600">{row.selesai}</td>
                                        <td className="py-3 px-6 text-center font-semibold text-gray-800">{row.sisa}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                                    <td className="py-4 px-6 text-center text-gray-800" colSpan={2}>Total Keseluruhan</td>
                                    <td className="py-4 px-6 text-center text-gray-800">{statistikData.reduce((acc, curr) => acc + curr.sisaLalu, 0)}</td>
                                    <td className="py-4 px-6 text-center text-blue-700">{statistikData.reduce((acc, curr) => acc + curr.masuk, 0)}</td>
                                    <td className="py-4 px-6 text-center text-green-700">{statistikData.reduce((acc, curr) => acc + curr.selesai, 0)}</td>
                                    <td className="py-4 px-6 text-center text-gray-900">{statistikData.reduce((acc, curr) => acc + curr.sisa, 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderAuditTrail = () => {
        interface AuditLogItem {
            id: string;
            rawDate: string;
            t: string;
            modul: 'Permohonan' | 'Pendampingan' | 'Telaahan' | 'Penanganan Perkara' | 'Penanganan Putusan';
            refNo: string;
            u: string;
            user: string;
        }

        const baseAuditLogs: AuditLogItem[] = [
            // Telaahan Kasus Hukum
            {
                id: 'LOG-001',
                rawDate: '2026-09-30',
                t: '30 September 2026 pukul 14.15.22',
                modul: 'Telaahan',
                refNo: 'TLH/2026/09/0142',
                u: 'Admin Tuban Kum menyelesaikan penyusunan kajian yuridis dan rekomendasi atas permohonan telaahan Ditjen Pajak.',
                user: 'Admin Tuban Kum'
            },
            {
                id: 'LOG-002',
                rawDate: '2026-09-28',
                t: '28 September 2026 pukul 10.35.40',
                modul: 'Telaahan',
                refNo: 'ND-218/SJ.6/2026',
                u: 'Dedi Irawan (PIC) memproses tanda tangan elektronik (TTE Nadine) Nota Dinas Telaahan Kasus Eksekusi Jaminan Sita.',
                user: 'Dedi Irawan'
            },
            {
                id: 'LOG-003',
                rawDate: '2026-09-25',
                t: '25 September 2026 pukul 16.20.10',
                modul: 'Telaahan',
                refNo: 'TLH/2026/01/0088',
                u: 'Rini Astuti mengunggah draft kesimpulan & rekomendasi telaahan yuridis sengketa PPh Badan PT Sumber Alfaria.',
                user: 'Rini Astuti'
            },
            {
                id: 'LOG-004',
                rawDate: '2026-09-21',
                t: '21 September 2026 pukul 11.05.33',
                modul: 'Telaahan',
                refNo: 'ND-189/SJ.6/2026',
                u: 'Admin Tuban Kum meregistrasi permohonan telaahan kasus hukum baru dari Direktorat Jenderal Bea dan Cukai.',
                user: 'Admin Tuban Kum'
            },
            {
                id: 'LOG-005',
                rawDate: '2026-09-18',
                t: '18 September 2026 pukul 09.45.12',
                modul: 'Telaahan',
                refNo: 'TLH/2026/08/0115',
                u: 'Budi Santoso merevisi analisis pertimbangan hukum PMK No. 02/PMK.03/2010 pada draf resume telaahan.',
                user: 'Budi Santoso'
            },

            // Penanganan Perkara (Litigasi)
            {
                id: 'LOG-006',
                rawDate: '2026-09-29',
                t: '29 September 2026 pukul 09.30.00',
                modul: 'Penanganan Perkara',
                refNo: '142/G/2026/PTUN.JKT',
                u: 'Budi Santoso menambahkan dokumen Alat Bukti P-1 sampai P-12 dan naskah Duplik Kuasa Tergugat.',
                user: 'Budi Santoso'
            },
            {
                id: 'LOG-007',
                rawDate: '2026-09-27',
                t: '27 September 2026 pukul 13.45.19',
                modul: 'Penanganan Perkara',
                refNo: '88/G/BC/2026/PTUN.SMG',
                u: 'Dedi Irawan (PIC) memperbarui hasil persidangan pembacaan gugatan dan menjadwalkan agenda jawaban Tergugat.',
                user: 'Dedi Irawan'
            },
            {
                id: 'LOG-008',
                rawDate: '2026-09-24',
                t: '24 September 2026 pukul 15.10.45',
                modul: 'Penanganan Perkara',
                refNo: '302/Pdt.G/2026/PN.Jkt.Pst',
                u: 'Admin Tuban Kum mengunggah Surat Kuasa Khusus Menteri Keuangan RI No. SKU-42/MK.01/2026.',
                user: 'Admin Tuban Kum'
            },
            {
                id: 'LOG-009',
                rawDate: '2026-09-19',
                t: '19 September 2026 pukul 08.20.11',
                modul: 'Penanganan Perkara',
                refNo: '115/G/2026/PTUN.BDG',
                u: 'Rini Astuti mengunggah salinan Relaas Panggilan Sidang Pertama dari Panitera PTUN Bandung.',
                user: 'Rini Astuti'
            },
            {
                id: 'LOG-010',
                rawDate: '2026-09-12',
                t: '12 September 2026 pukul 14.00.00',
                modul: 'Penanganan Perkara',
                refNo: '77/Pdt.Sus-KPPU/2026/PN.Niaga.Jkt.Pst',
                u: 'Joko Santoso menginput jadwal sidang mendengarkan keterangan saksi ahli persaingan usaha.',
                user: 'Joko Santoso'
            },

            // Penanganan Putusan Pengadilan
            {
                id: 'LOG-011',
                rawDate: '2026-09-29',
                t: '29 September 2026 pukul 16.50.14',
                modul: 'Penanganan Putusan',
                refNo: '98/B/2025/PT.TUN.JKT',
                u: 'Admin Tuban Kum mencatat status BHT (Berkekuatan Hukum Tetap) dan rekomendasi pelaksanaan amar putusan.',
                user: 'Admin Tuban Kum'
            },
            {
                id: 'LOG-012',
                rawDate: '2026-09-26',
                t: '26 September 2026 pukul 11.15.00',
                modul: 'Penanganan Putusan',
                refNo: '215 K/TUN/2025',
                u: 'Rini Astuti mengunggah Salinan Resmi Putusan Kasasi Mahkamah Agung RI yang menolak permohonan Pemohon Kasasi.',
                user: 'Rini Astuti'
            },
            {
                id: 'LOG-013',
                rawDate: '2026-09-22',
                t: '22 September 2026 pukul 14.30.25',
                modul: 'Penanganan Putusan',
                refNo: '45/Pdt.G/2025/PN.Sby',
                u: 'Dedi Irawan merekam surat permohonan penetapan eksekusi putusan ganti rugi perdata kepada Pengadilan Negeri Surabaya.',
                user: 'Dedi Irawan'
            },
            {
                id: 'LOG-014',
                rawDate: '2026-09-15',
                t: '15 September 2026 pukul 10.00.05',
                modul: 'Penanganan Putusan',
                refNo: '71/G/2025/PTUN.JKT',
                u: 'Budi Santoso memperbarui status tindak lanjut: Disposisi pemenuhan amar ganti rugi telah disetujui DJA.',
                user: 'Budi Santoso'
            },
            {
                id: 'LOG-015',
                rawDate: '2026-09-08',
                t: '08 September 2026 pukul 13.25.10',
                modul: 'Penanganan Putusan',
                refNo: '12/G/2025/PTUN.BJM',
                u: 'Admin System mencatat penerbitan surat keterangan inkracht / BHT dari Panitera PTUN Banjarmasin.',
                user: 'Admin System'
            },

            // Permohonan Advokasi
            {
                id: 'LOG-016',
                rawDate: '2026-09-30',
                t: '30 September 2026 pukul 11.20.15',
                modul: 'Permohonan',
                refNo: 'TIKET-2026-0982',
                u: 'Admin System meregistrasi berkas Permohonan Bantuan Hukum baru dari Ditjen Perbendaharaan terkait sengketa rekening kas negara.',
                user: 'Admin System'
            },
            {
                id: 'LOG-017',
                rawDate: '2026-09-28',
                t: '28 September 2026 pukul 08.40.50',
                modul: 'Permohonan',
                refNo: 'ND-452/SJ/2026',
                u: 'Dedi Irawan memverifikasi kelengkapan dokumen pendukung dan menetapkan disposisi pimpinan Biro Advokasi.',
                user: 'Dedi Irawan'
            },
            {
                id: 'LOG-018',
                rawDate: '2026-09-23',
                t: '23 September 2026 pukul 13.10.00',
                modul: 'Permohonan',
                refNo: 'TIKET-2026-0814',
                u: 'Admin Tuban Kum menyetujui validasi permohonan advokasi perkara sengketa aset tanah negara di Surabaya.',
                user: 'Admin Tuban Kum'
            },
            {
                id: 'LOG-019',
                rawDate: '2026-09-16',
                t: '16 September 2026 pukul 15.25.42',
                modul: 'Permohonan',
                refNo: 'ND-389/SJ/2026',
                u: 'Rini Astuti meneruskan permohonan advokasi ke Biro Bantuan Hukum untuk pembentukan tim penanganan perkara.',
                user: 'Rini Astuti'
            },
            {
                id: 'LOG-020',
                rawDate: '2026-09-10',
                t: '10 September 2026 pukul 09.15.20',
                modul: 'Permohonan',
                refNo: 'TIKET-2026-0775',
                u: 'Budi Santoso melengkapi data identitas pemohon dan pokok permasalahan sengketa kepegawaian Kemenkeu.',
                user: 'Budi Santoso'
            },

            // Pendampingan Hukum
            {
                id: 'LOG-021',
                rawDate: '2026-09-29',
                t: '29 September 2026 pukul 14.05.30',
                modul: 'Pendampingan',
                refNo: 'ND-104/SJ.6/2026',
                u: 'Dedi Irawan (PIC) mendampingi saksi dari Kemenkeu dalam proses klarifikasi di Kejaksaan Agung RI.',
                user: 'Dedi Irawan'
            },
            {
                id: 'LOG-022',
                rawDate: '2026-09-27',
                t: '27 September 2026 pukul 10.15.18',
                modul: 'Pendampingan',
                refNo: 'TIKET-PDP-2026-041',
                u: 'Budi Santoso mengunggah Berita Acara Pendampingan Hukum Non-Litigasi Mediasi Pengadaan Tanah.',
                user: 'Budi Santoso'
            },
            {
                id: 'LOG-023',
                rawDate: '2026-09-20',
                t: '20 September 2026 pukul 16.40.12',
                modul: 'Pendampingan',
                refNo: 'ND-088/SJ.6/2026',
                u: 'Admin Tuban Kum menerbitkan Surat Tugas Tim Pendampingan Hukum Pemeriksaan Saksi Ahli di Polda Metro Jaya.',
                user: 'Admin Tuban Kum'
            },
            {
                id: 'LOG-024',
                rawDate: '2026-09-17',
                t: '17 September 2026 pukul 09.30.00',
                modul: 'Pendampingan',
                refNo: 'TIKET-PDP-2026-035',
                u: 'Rini Astuti menutup berkas pendampingan hukum setelah tercapai kesepakatan damai para pihak.',
                user: 'Rini Astuti'
            },
            {
                id: 'LOG-025',
                rawDate: '2026-09-11',
                t: '11 September 2026 pukul 11.50.45',
                modul: 'Pendampingan',
                refNo: 'ND-074/SJ.6/2026',
                u: 'Dedi Irawan menyusun resume telaah awal atas pemanggilan klarifikasi pejabat DJKN oleh penyidik.',
                user: 'Dedi Irawan'
            }
        ];

        // Also incorporate records dynamically from store
        const storeAuditLogs: AuditLogItem[] = [];
        (telaahanRecords || []).forEach((r: any) => {
            storeAuditLogs.push({
                id: `LOG-TLH-${r.id}`,
                rawDate: r.tanggal || '2026-09-20',
                t: `${r.tanggal || '2026-09-20'} pukul 10.00.00`,
                modul: 'Telaahan',
                refNo: r.nomorNotaDinas || r.nomorTelaahan || r.Nomor || `ND-${r.id}`,
                u: `Perekaman dan pembaharuan berkas telaahan: ${r.perihal || 'Telaahan yuridis penanganan kasus'}`,
                user: (r.team && r.team[0]?.nama) || 'Admin Tuban Kum'
            });
        });

        (perkaraRecords || []).forEach((r: any) => {
            storeAuditLogs.push({
                id: `LOG-PRK-${r.id}`,
                rawDate: r.tanggal || '2026-09-15',
                t: `${r.tanggal || '2026-09-15'} pukul 11.30.00`,
                modul: 'Penanganan Perkara',
                refNo: r.nomorPerkara || r.nomorRegistrasi || r.Nomor || `PERKARA-${r.id}`,
                u: `Update status perkara: ${r.judul || r.pokokPerkara || r.perihal || 'Sengketa litigasi kementerian'}`,
                user: r.pic || (r.team && r.team[0]?.nama) || 'Budi Santoso'
            });
        });

        (pendampinganRecords || []).forEach((r: any) => {
            storeAuditLogs.push({
                id: `LOG-PDP-${r.id}`,
                rawDate: r.tanggal || '2026-09-10',
                t: `${r.tanggal || '2026-09-10'} pukul 13.00.00`,
                modul: 'Pendampingan',
                refNo: r.nomorNotaDinas || r.nomorTiket || r.Nomor || `TIKET-PDP-${r.id}`,
                u: `Aktivitas pendampingan hukum: ${r.judul || r.masalah || r.perihal || 'Pendampingan non-litigasi satker'}`,
                user: r.pic || (r.team && r.team[0]?.nama) || 'Dedi Irawan'
            });
        });

        (putusanRecords || []).forEach((r: any) => {
            storeAuditLogs.push({
                id: `LOG-PTS-${r.id}`,
                rawDate: r.tanggal || '2026-09-05',
                t: `${r.tanggal || '2026-09-05'} pukul 15.00.00`,
                modul: 'Penanganan Putusan',
                refNo: r.nomorPerkara || r.nomorPutusan || r.Nomor || `PUTUSAN-${r.id}`,
                u: `Pencatatan amar dan tindak lanjut putusan perkara: ${r.amar || r.perihal || 'Pelaksanaan amar putusan pengadilan'}`,
                user: r.pic || (r.team && r.team[0]?.nama) || 'Rini Astuti'
            });
        });

        // Combine and deduplicate
        const allAuditLogs = [...baseAuditLogs, ...storeAuditLogs].sort((a, b) => {
            return b.rawDate.localeCompare(a.rawDate);
        });

        // Filtering logic
        const filteredLogs = allAuditLogs.filter(log => {
            // Tab filter
            if (activeAuditTab !== 'Semua' && log.modul !== activeAuditTab) {
                return false;
            }

            // Start Date filter
            if (auditStartDate && log.rawDate < auditStartDate) {
                return false;
            }

            // End Date filter
            if (auditEndDate && log.rawDate > auditEndDate) {
                return false;
            }

            // Search query filter
            if (auditSearchQuery.trim()) {
                const q = auditSearchQuery.toLowerCase().trim();
                const matchU = log.u.toLowerCase().includes(q);
                const matchRef = log.refNo.toLowerCase().includes(q);
                const matchUser = log.user.toLowerCase().includes(q);
                const matchModul = log.modul.toLowerCase().includes(q);
                const matchDate = log.t.toLowerCase().includes(q);
                if (!matchU && !matchRef && !matchUser && !matchModul && !matchDate) {
                    return false;
                }
            }

            return true;
        });

        // Pagination
        const pageSize = 8;
        const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
        const currentPageLogs = filteredLogs.slice((auditPage - 1) * pageSize, auditPage * pageSize);

        const auditTabs = [
            'Semua', 
            'Permohonan', 
            'Pendampingan', 
            'Telaahan', 
            'Penanganan Perkara', 
            'Penanganan Putusan'
        ];

        const getModulBadge = (modul: string) => {
            switch (modul) {
                case 'Permohonan':
                    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Permohonan</span>;
                case 'Pendampingan':
                    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Pendampingan</span>;
                case 'Telaahan':
                    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Telaahan</span>;
                case 'Penanganan Perkara':
                    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Penanganan Perkara</span>;
                case 'Penanganan Putusan':
                    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Penanganan Putusan</span>;
                default:
                    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{modul}</span>;
            }
        };

        return (
            <div className="space-y-6">
                <Breadcrumb currentView={currentView} onNavigate={onNavigate} />

                {/* Page Title & Main Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Riwayat (Audit Trail)</h1>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">
                            System integrity, log aktivitas, dan jejak rekam penanganan perkara secara menyeluruh.
                        </p>
                    </div>

                    {/* Filter Controls: Date Pickers & Search */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Start Date Picker */}
                        <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <CalendarIcon className="h-4 w-4 text-blue-600 shrink-0" />
                            <div className="flex flex-col">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Start Date</label>
                                <input 
                                    type="date" 
                                    value={auditStartDate}
                                    onChange={(e) => { setAuditStartDate(e.target.value); setAuditPage(1); }}
                                    className="text-xs font-semibold text-gray-700 bg-transparent outline-none cursor-pointer focus:text-blue-600"
                                />
                            </div>
                        </div>

                        {/* End Date Picker */}
                        <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <CalendarIcon className="h-4 w-4 text-blue-600 shrink-0" />
                            <div className="flex flex-col">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">End Date</label>
                                <input 
                                    type="date" 
                                    value={auditEndDate}
                                    onChange={(e) => { setAuditEndDate(e.target.value); setAuditPage(1); }}
                                    className="text-xs font-semibold text-gray-700 bg-transparent outline-none cursor-pointer focus:text-blue-600"
                                />
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                                placeholder="Cari aktivitas, nomor, user..."
                                value={auditSearchQuery}
                                onChange={(e) => { setAuditSearchQuery(e.target.value); setAuditPage(1); }}
                            />
                        </div>

                        {/* Reset Filter Button */}
                        {(auditStartDate || auditEndDate || auditSearchQuery || activeAuditTab !== 'Semua') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setAuditStartDate('');
                                    setAuditEndDate('');
                                    setAuditSearchQuery('');
                                    setActiveAuditTab('Semua');
                                    setAuditPage(1);
                                }}
                                className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold border border-rose-200 transition"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Sub-Tabs Navigation (Including Telaahan Tab) */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 pt-2">
                    <nav className="flex space-x-2 md:space-x-6 overflow-x-auto custom-scrollbar">
                        {auditTabs.map(tab => {
                            const count = tab === 'Semua' 
                                ? allAuditLogs.length 
                                : allAuditLogs.filter(l => l.modul === tab).length;
                            const isActive = activeAuditTab === tab;
                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => { setActiveAuditTab(tab); setAuditPage(1); }}
                                    className={`pb-3 text-xs md:text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center space-x-2 px-1 ${
                                        isActive
                                            ? 'text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <span>{tab}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {count}
                                    </span>
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-md" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Active Filter Indicators if applied */}
                {(auditStartDate || auditEndDate) && (
                    <div className="flex items-center space-x-2 bg-blue-50/80 border border-blue-200 px-4 py-2.5 rounded-xl text-xs text-blue-800 font-medium">
                        <CalendarIcon className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>Filter Tanggal Aktif:</span>
                        <span className="font-bold font-mono">
                            {auditStartDate ? auditStartDate : 'Dari awal'} s/d {auditEndDate ? auditEndDate : 'Sekarang'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>Ditemukan <strong className="text-blue-900">{filteredLogs.length}</strong> catatan aktivitas</span>
                        <button
                            type="button"
                            onClick={() => { setAuditStartDate(''); setAuditEndDate(''); setAuditPage(1); }}
                            className="ml-auto text-xs text-blue-700 underline hover:text-blue-900 font-semibold"
                        >
                            Hapus Rentang Tanggal
                        </button>
                    </div>
                )}

                {/* Table Audit Trail */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-700">
                            <thead className="bg-[#F8FAFC] text-gray-700 border-b border-gray-200 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th scope="col" className="py-3.5 px-3 text-center w-12">No</th>
                                    <th scope="col" className="py-3.5 px-4 w-48">Date &amp; Time</th>
                                    <th scope="col" className="py-3.5 px-4 w-36">Modul</th>
                                    <th scope="col" className="py-3.5 px-4 w-52 text-[#0055A5] font-black">
                                        No. Perkara/Tiket/ND
                                    </th>
                                    <th scope="col" className="py-3.5 px-4">Uraian Aktivitas</th>
                                    <th scope="col" className="py-3.5 px-4 w-40">Pelaksana / User</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs">
                                {currentPageLogs.length > 0 ? (
                                    currentPageLogs.map((log, i) => {
                                        const globalIndex = (auditPage - 1) * pageSize + i + 1;
                                        const isPerkaraModule = ['Penanganan Perkara', 'Penanganan Putusan'].includes(log.modul);
                                        return (
                                            <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="py-3.5 px-3 text-center text-gray-400 font-medium">
                                                    {globalIndex}
                                                </td>
                                                <td className="py-3.5 px-4 text-gray-600 font-medium whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-800">{log.t.split(' pukul ')[0]}</span>
                                                        <span className="text-[10px] text-gray-400 font-mono">
                                                            {log.t.includes(' pukul ') ? `pukul ${log.t.split(' pukul ')[1]}` : ''}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    {getModulBadge(log.modul)}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900 font-mono text-xs select-all">
                                                            {log.refNo}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-gray-400 mt-0.5">
                                                            {isPerkaraModule ? 'No. Perkara' : 'No. Tiket/ND'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-gray-800 font-medium leading-relaxed">
                                                    {log.u}
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                                                            {log.user.charAt(0)}
                                                        </div>
                                                        <span className="text-gray-700 font-semibold">{log.user}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400">
                                            <InformationCircleIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                                            <p className="font-semibold text-sm text-gray-600">Tidak ada riwayat aktivitas yang sesuai</p>
                                            <p className="text-xs text-gray-400 mt-1">Coba sesuaikan tanggal pencarian, kata kunci, atau pilih tab modul lain.</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAuditStartDate('');
                                                    setAuditEndDate('');
                                                    setAuditSearchQuery('');
                                                    setActiveAuditTab('Semua');
                                                    setAuditPage(1);
                                                }}
                                                className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                                            >
                                                Tampilkan Semua Log
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                            <div>
                                Menampilkan <span className="font-bold">{(auditPage - 1) * pageSize + 1}</span> - <span className="font-bold">{Math.min(auditPage * pageSize, filteredLogs.length)}</span> dari <span className="font-bold">{filteredLogs.length}</span> aktivitas
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    disabled={auditPage === 1}
                                    onClick={() => setAuditPage(p => Math.max(p - 1, 1))}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-semibold"
                                >
                                    Sebelumnya
                                </button>
                                <span className="font-bold text-gray-800 px-2">{auditPage} / {totalPages}</span>
                                <button
                                    type="button"
                                    disabled={auditPage === totalPages}
                                    onClick={() => setAuditPage(p => Math.min(p + 1, totalPages))}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-semibold"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderMonitoringTelaahan = () => {
        const defaultTelaahanList = [
            {
                id: 'TLH-2026-001',
                nomor: 'TLH/2026/01/0088',
                tanggal: '2026-01-14',
                pengirim: 'Direktorat Jenderal Pajak',
                perihal: 'Kajian Yuridis Pengajuan Keberatan Pajak PPh Badan PT Sumber Alfaria',
                urgensi: 'Sangat Segera',
                statusTelaahan: 'Selesai',
                statusNaskah: 'TTE Nadine Selesai',
                pic: 'Admin Tuban Kum',
                dokumenCount: 5,
                unit: 'Ditjen Pajak',
                durasiHari: 3,
                nomorPerkara: '142/G/2026/PTUN.JKT',
                jenisPerkara: 'Tata Usaha Negara (TUN)',
                tingkatPengadilan: 'PTUN Jakarta',
                pihakPenggugat: 'PT Sumber Alfaria Tbk',
                pihakTergugat: 'Direktur Jenderal Pajak cq Menkeu RI',
                nilaiTuntutan: 'Rp 4.250.000.000',
                pokokPerkara: 'Sengketa Keberatan Koreksi Positif Biaya Promosi & Penghitungan PPh Badan',
                abstraksiAnalisis: 'Berdasarkan Pasal 6 ayat (1) huruf a UU PPh, biaya promosi telah memenuhi kriteria 3M (Mendapatkan, Menagih, Memelihara penghasilan) dengan bukti nominatif lengkap. Disarankan pengajuan kontra memori kasasi.',
                kesimpulanRekomendasi: 'Kuat untuk dipertahankan dalam memori penjelasan dengan penegasan PMK No. 02/PMK.03/2010.'
            },
            {
                id: 'TLH-2026-002',
                nomor: 'TLH/2026/01/0094',
                tanggal: '2026-01-22',
                pengirim: 'Direktorat Jenderal Bea dan Cukai',
                perihal: 'Analisis Gugatan Pembatalan Penetapan Nilai Pabean PT Samudera Perkasa',
                urgensi: 'Segera',
                statusTelaahan: 'Aktif',
                statusNaskah: 'Review Kasubdit',
                pic: 'Dedi Irawan',
                dokumenCount: 4,
                unit: 'Ditjen Bea dan Cukai',
                durasiHari: 6,
                nomorPerkara: '88/G/BC/2026/PTUN.SMG',
                jenisPerkara: 'Kepabeanan & Cukai',
                tingkatPengadilan: 'PTUN Semarang',
                pihakPenggugat: 'PT Samudera Perkasa Logistik',
                pihakTergugat: 'Kepala KPPBC Tipe Madya Pabean Tanjung Emas',
                nilaiTuntutan: 'Rp 1.820.000.000',
                pokokPerkara: 'Pembatalan Surat Penetapan Tarif dan Nilai Pabean (SPTNP) atas Impor Mesin Tekstil',
                abstraksiAnalisis: 'Penetapan nilai pabean oleh pejabat bea cukai telah sesuai dengan Metode II dan III Deklarasi Nilai Pabean. Penggugat tidak menyertakan bukti transfer valuta asing sah.',
                kesimpulanRekomendasi: 'Melakukan pendampingan persidangan pembuktian ahli kepabeanan di PTUN Semarang.'
            },
            {
                id: 'TLH-2026-003',
                nomor: 'TLH/2026/02/0105',
                tanggal: '2026-02-05',
                pengirim: 'Direktorat Jenderal Kekayaan Negara',
                perihal: 'Telaahan Penyelesaian Piutang Negara Macet Eks BPPN atas Debitur PT Graha Cipta',
                urgensi: 'Biasa',
                statusTelaahan: 'Selesai',
                statusNaskah: 'TTE Nadine Selesai',
                pic: 'Rini Astuti',
                dokumenCount: 7,
                unit: 'Ditjen Kekayaan Negara',
                durasiHari: 4,
                nomorPerkara: '215/Pdt.G/2026/PN.Jkt.Sel',
                jenisPerkara: 'Perdata / Gugatan PMH',
                tingkatPengadilan: 'Pengadilan Negeri Jakarta Selatan',
                pihakPenggugat: 'PT Graha Cipta Mandiri',
                pihakTergugat: 'Menteri Keuangan RI cq PUPN Cabang DKI Jakarta',
                nilaiTuntutan: 'Rp 12.500.000.000',
                pokokPerkara: 'Perlawanan atas Pelaksanaan Sita Eksekusi Agunan Aset Piutang Macet BDL/BPPN',
                abstraksiAnalisis: 'PUPN berwenang melakukan penyitaan berdasarkan UU No. 49 Prp 1960. Hak tanggungan peringkat pertama masih terdaftar sah atas nama Menkeu.',
                kesimpulanRekomendasi: 'Lanjutkan lelang eksekusi hak tanggungan dan koordinasi Kantor Pertanahan setempat.'
            },
            {
                id: 'TLH-2026-004',
                nomor: 'TLH/2026/02/0112',
                tanggal: '2026-02-18',
                pengirim: 'Biro Hukum, Setjen',
                perihal: 'Harmonisasi dan Kajian Uji Materiil Peraturan Pemerintah terkait Tarif PNBP',
                urgensi: 'Sangat Segera',
                statusTelaahan: 'Aktif',
                statusNaskah: 'Draft Analisis',
                pic: 'Budi Santoso',
                dokumenCount: 6,
                unit: 'Biro Hukum Setjen',
                durasiHari: 2,
                nomorPerkara: '12/HUM/2026/MA',
                jenisPerkara: 'Hak Uji Materiil (HUM)',
                tingkatPengadilan: 'Mahkamah Agung RI',
                pihakPenggugat: 'Asosiasi Pengusaha Mineral & Batubara',
                pihakTergugat: 'Menteri Keuangan RI & Presiden RI',
                nilaiTuntutan: 'Non-Materiil (Pembatalan Regulasi)',
                pokokPerkara: 'Permohonan Uji Materiil terhadap Klausul Tarif Royalti Progresif Ekspor Mineral',
                abstraksiAnalisis: 'Delegasi wewenang penetapan tarif diatur jelas dalam UU No. 9 Tahun 2018 tentang PNBP. Tidak bertentangan dengan asas kepastian hukum perpajakan.',
                kesimpulanRekomendasi: 'Penyusunan Surat Jawaban Termohon HUM MA bersama Ditjen Anggaran dan BKF.'
            },
            {
                id: 'TLH-2026-005',
                nomor: 'TLH/2026/02/0120',
                tanggal: '2026-02-27',
                pengirim: 'Direktorat Jenderal Perbendaharaan',
                perihal: 'Analisis Gugatan PMH atas Penolakan SPM Retur Rekening Bendahara Pengeluaran',
                urgensi: 'Segera',
                statusTelaahan: 'Aktif',
                statusNaskah: 'Review Kasi',
                pic: 'Admin Tuban Kum',
                dokumenCount: 3,
                unit: 'Ditjen Perbendaharaan',
                durasiHari: 5,
                nomorPerkara: '44/Pdt.G/2026/PN.Bdg',
                jenisPerkara: 'Perdata / Gugatan PMH',
                tingkatPengadilan: 'Pengadilan Negeri Bandung',
                pihakPenggugat: 'CV Mitra Sejahtera Sentosa (Rekanan Satker)',
                pihakTergugat: 'KPPN Bandung II cq Direktorat Jenderal Perbendaharaan',
                nilaiTuntutan: 'Rp 850.000.000',
                pokokPerkara: 'Tuntutan Ganti Kerugian Bunga Akibat Retur SP2D Pembayaran Termin Kontrak Fisik',
                abstraksiAnalisis: 'KPPN menolak SPM karena nomor rekening bank pihak ketiga tidak sinkron dengan data SPAN. Sesuai PMK Pengelolaan Rekening Kas Negara.',
                kesimpulanRekomendasi: 'Eksepsi kompetensi absolut dan bukti sistem audit trail SPAN perbendaharaan.'
            },
            {
                id: 'TLH-2026-006',
                nomor: 'TLH/2026/03/0135',
                tanggal: '2026-03-08',
                pengirim: 'Badan Kebijakan Fiskal',
                perihal: 'Telaahan Aspek Hukum Klausul Arbitrase Internasional pada Perjanjian Kerjasama Multilateral',
                urgensi: 'Biasa',
                statusTelaahan: 'Selesai',
                statusNaskah: 'TTE Nadine Selesai',
                pic: 'Dedi Irawan',
                dokumenCount: 8,
                unit: 'BKF',
                durasiHari: 7,
                nomorPerkara: 'ARB/BANI/2026/019',
                jenisPerkara: 'Arbitrase Komersial',
                tingkatPengadilan: 'BANI Arbitrase Jakarta',
                pihakPenggugat: 'Global Infrastructure Consortium Ltd.',
                pihakTergugat: 'Kementerian Keuangan RI cq PT Penjaminan Infrastruktur',
                nilaiTuntutan: 'USD 3.200.000 (Rp 51 Miliar)',
                pokokPerkara: 'Klaim Wanprestasi Dukungan Kelayakan Proyek KPBU SPAM Regional',
                abstraksiAnalisis: 'Klausul force majeure pada masa pandemi dan pergeseran trase perizinan daerah bukan tanggung jawab sepihak Pemerintah Pusat.',
                kesimpulanRekomendasi: 'Penetapan Arbiter Pendamping dan negosiasi rekonsiliasi adendum kontrak KPBU.'
            },
            {
                id: 'TLH-2026-007',
                nomor: 'TLH/2026/03/0142',
                tanggal: '2026-03-19',
                pengirim: 'Direktorat Jenderal Pajak',
                perihal: 'Kajian Hukum Permohonan Praperadilan Penetapan Tersangka Tindak Pidana Perpajakan',
                urgensi: 'Sangat Segera',
                statusTelaahan: 'Aktif',
                statusNaskah: 'Draft Analisis',
                pic: 'Rini Astuti',
                dokumenCount: 5,
                unit: 'Ditjen Pajak',
                durasiHari: 3,
                nomorPerkara: '07/Pid.Pra/2026/PN.Jkt.Pst',
                jenisPerkara: 'Praperadilan Pidana Pajak',
                tingkatPengadilan: 'Pengadilan Negeri Jakarta Pusat',
                pihakPenggugat: 'H. Mohammad Arifin (Tersangka Faktur Fiktif)',
                pihakTergugat: 'Penyidik Pegawai Negeri Sipil (PPNS) Kanwil DJP Jakpus',
                nilaiTuntutan: 'Non-Materiil (Pembatalan Status Tersangka)',
                pokokPerkara: 'Gugatan Praperadilan atas Keabsahan Penetapan Tersangka dan Penyitaan Dokumen Akuntansi',
                abstraksiAnalisis: 'Bukti permulaan cukup didukung minimal 3 alat bukti sah (Keterangan saksi, dokumen faktur, dan keterangan ahli forensik digital).',
                kesimpulanRekomendasi: 'Siapkan eksepsi serta hadirkan Ahli Hukum Acara Pidana pada sidang praperadilan.'
            },
            {
                id: 'TLH-2026-008',
                nomor: 'TLH/2026/03/0150',
                tanggal: '2026-03-24',
                pengirim: 'BPPK',
                perihal: 'Telaahan Status Kepemilikan Lahan Gedung Balai Diklat Keuangan Cimahi',
                urgensi: 'Biasa',
                statusTelaahan: 'Selesai',
                statusNaskah: 'TTE Nadine Selesai',
                pic: 'Budi Santoso',
                dokumenCount: 4,
                unit: 'BPPK',
                durasiHari: 4,
                nomorPerkara: '109/Pdt.Bth/2026/PN.Cmh',
                jenisPerkara: 'Perdata / Perlawanan Sita',
                tingkatPengadilan: 'Pengadilan Negeri Cimahi',
                pihakPenggugat: 'Ahli Waris Rd. Kartadibrata',
                pihakTergugat: 'BPPK Kementerian Keuangan RI',
                nilaiTuntutan: 'Rp 18.000.000.000',
                pokokPerkara: 'Sengketa Kepemilikan Hak Milik Adat atas Tanah Kompleks Kampus BDK Cimahi',
                abstraksiAnalisis: 'Sertifikat Hak Pakai atas nama Pemerintah RI terbit tahun 1982 dan telah dikuasai secara fisik tanpa interupsi lebih dari 40 tahun.',
                kesimpulanRekomendasi: 'Pertahankan aset BMN dengan mengajukan alat bukti otentik buku warkah BPN.'
            }
        ];

        const storeRecords = (telaahanRecords || []).map((r: any, idx) => {
            const pic = (r.team && r.team.find((m: any) => m.id === r.picId)) || (r.team && r.team[0]);
            const picName = pic ? pic.nama : (r.team && r.team[0]?.nama) || 'Belum Ditetapkan';
            const urgensi = r.abstraksiTelaahan?.tingkatUrgensi || r.urgensi || 'Biasa';
            const statusPosisi = (r.statusTelaahan === 'Selesai' || r.naskahTelaahan?.statusNaskah === 'Dikirim' || (r.naskahTelaahan?.statusNaskah as any) === 'Telah di-TTE & Dikirim') ? 'Terkirim' : 'Konsep Telaahan';
            const linkedPerkara: any = perkaraRecords?.[idx % (perkaraRecords.length || 1)];
            
            // Format last update
            let lastUpdate = r.tanggal || '2026-03-18';
            if (r.history && r.history.length > 0) {
                const last = r.history[r.history.length - 1];
                if (last.timestamp) {
                    lastUpdate = new Date(last.timestamp).toLocaleDateString('id-ID', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    }).replace(/\./g, '/');
                }
            } else if (r.naskahTelaahan?.tglTte) {
                lastUpdate = r.naskahTelaahan.tglTte;
            }

            return {
                id: r.id,
                rawRecord: r,
                nomor: r.Nomor || r.nomorTelaahan || r.id,
                nomorTelaahan: r.nomorTelaahan || r.Nomor || '-',
                tanggal: r.tanggal || '2026-03-18',
                pemohon: r.pemohon || 'Kepala Unit Pemohon',
                pengirim: r.pemohon || r.unit || 'Biro Advokasi, Setjen',
                unit: r.unit || 'Kementerian Keuangan RI',
                perihal: r.perihal || r.naskahTelaahan?.perihal || 'Telaahan Kasus Hukum',
                urgensi: urgensi,
                statusTelaahan: r.statusTelaahan === 'Selesai' ? 'Selesai' : 'Aktif',
                statusPosisi: statusPosisi,
                statusNaskah: r.naskahTelaahan?.statusNaskah || (r.statusTelaahan === 'Selesai' ? 'TTE Selesai' : 'Konsep Telaahan'),
                nomorNaskah: r.naskahTelaahan?.nomorNaskah || '-',
                tglTte: r.naskahTelaahan?.tglTte || '',
                pic: picName,
                lastUpdate: lastUpdate,
                kategoriHukum: r.abstraksiTelaahan?.kategoriHukum || 'Hukum Administrasi Negara',
                dokumenCount: (r.dokumenTelaahan?.length || 0) + (r.files?.length || 0) || 1,
                durasiHari: r.statusTelaahan === 'Selesai' ? 4 : 2,
                nomorPerkara: linkedPerkara?.nomorPerkara || `REG/PKR/2026/0${120 + idx}`,
                jenisPerkara: linkedPerkara?.jenisPerkara || 'Tata Usaha Negara (TUN)',
                tingkatPengadilan: linkedPerkara?.pengadilan || 'Pengadilan Pajak / PTUN Jakarta',
                pihakPenggugat: linkedPerkara?.pemohon || r.pemohon || 'Pihak Pemohon / Penggugat',
                pihakTergugat: 'Menteri Keuangan RI cq Tim Advokasi',
                nilaiTuntutan: linkedPerkara?.tuntutan || 'Objek Evaluasi Keuangan Negara',
                pokokPerkara: r.abstraksiTelaahan?.pokokPermasalahan || linkedPerkara?.posisiKasus || r.uraian || r.perihal,
                faktaHukum: r.abstraksiTelaahan?.faktaHukum || '-',
                dasarHukum: r.abstraksiTelaahan?.dasarHukum || [],
                abstraksiAnalisis: r.abstraksiTelaahan?.analisisKajian || 'Analisis yuridis komprehensif atas pertimbangan permohonan bantuan hukum.',
                kesimpulanRekomendasi: r.abstraksiTelaahan?.rekomendasi || 'Rekomendasi tindak lanjut penyusunan naskah dinas pembelaan hukum.'
            };
        });

        // Use real store records directly as in /eadvokasi/telaahan, fallback to enriched list if empty
        const allRecords = storeRecords.length > 0 
            ? storeRecords 
            : defaultTelaahanList.map(d => ({
                ...d,
                pemohon: d.pengirim,
                statusPosisi: d.statusTelaahan === 'Selesai' ? 'Terkirim' : 'Konsep Telaahan',
                nomorNaskah: d.statusNaskah,
                lastUpdate: `${d.tanggal} 09:00`,
                kategoriHukum: d.jenisPerkara,
                tglTte: d.statusTelaahan === 'Selesai' ? d.tanggal : ''
            }));

        const filtered = allRecords.filter(item => {
            const matchSearch = telaahanSearch === '' || 
                item.nomor.toLowerCase().includes(telaahanSearch.toLowerCase()) ||
                item.nomorPerkara.toLowerCase().includes(telaahanSearch.toLowerCase()) ||
                item.perihal.toLowerCase().includes(telaahanSearch.toLowerCase()) ||
                item.pengirim.toLowerCase().includes(telaahanSearch.toLowerCase()) ||
                item.pic.toLowerCase().includes(telaahanSearch.toLowerCase()) ||
                item.pihakPenggugat.toLowerCase().includes(telaahanSearch.toLowerCase()) ||
                item.pihakTergugat.toLowerCase().includes(telaahanSearch.toLowerCase()) ||
                item.pokokPerkara.toLowerCase().includes(telaahanSearch.toLowerCase());

            const matchStatus = telaahanStatus === 'Semua Status' || item.statusTelaahan === telaahanStatus;
            const matchPengirim = telaahanPengirim === 'Semua Pengirim' || item.pengirim.toLowerCase().includes(telaahanPengirim.toLowerCase());
            const matchPic = telaahanPic === 'Semua PIC' || item.pic.toLowerCase().includes(telaahanPic.toLowerCase());

            let matchPreset = true;
            if (telaahanPeriodePreset === 'Bulan Ini') {
                matchPreset = item.tanggal.startsWith('2026-03') || item.tanggal.startsWith('2026-02');
            } else if (telaahanPeriodePreset === 'Triwulan Ini') {
                matchPreset = item.tanggal >= '2026-01-01' && item.tanggal <= '2026-03-31';
            } else if (telaahanPeriodePreset === 'Tahun 2026') {
                matchPreset = item.tanggal.startsWith('2026');
            }

            let matchDate = true;
            if (telaahanStartDate && item.tanggal < telaahanStartDate) matchDate = false;
            if (telaahanEndDate && item.tanggal > telaahanEndDate) matchDate = false;

            return matchSearch && matchStatus && matchPengirim && matchPic && matchPreset && matchDate;
        });

        const pengirimOptions = ['Semua Pengirim', 'Biro Hukum, Setjen', 'Direktorat Jenderal Pajak', 'Direktorat Jenderal Bea dan Cukai', 'Direktorat Jenderal Kekayaan Negara', 'Direktorat Jenderal Perbendaharaan', 'Badan Kebijakan Fiskal', 'BPPK'];
        const picOptions = ['Semua PIC', 'Admin Tuban Kum', 'Dedi Irawan', 'Rini Astuti', 'Budi Santoso', 'Hendra Wijaya', 'Siti Rahma'];
        const statusOptions = ['Semua Status', 'Aktif', 'Selesai'];

        const pageSize = 6;
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        const pagedData = filtered.slice((telaahanPage - 1) * pageSize, telaahanPage * pageSize);

        const countAktif = filtered.filter(f => f.statusTelaahan === 'Aktif').length;
        const countSelesai = filtered.filter(f => f.statusTelaahan === 'Selesai').length;

        return (
            <div className="space-y-6">
                <Breadcrumb currentView={currentView} onNavigate={onNavigate} />

                {/* Top Title & Action */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-blue-50 text-[#0055A5] rounded-xl border border-blue-100">
                                <ScaleIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">
                                        Sub-Modul Monitoring: Telaahan Kasus Hukum
                                    </h1>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#0055A5] border border-blue-200">
                                        Laporan Tabular Perkara
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Laporan tabular secara komprehensif terkait rincian data Perkara dan analisis telaahan hukum
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button 
                            type="button"
                            onClick={() => window.print()}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition shadow-2xs"
                        >
                            <PrintIcon className="h-4 w-4" />
                            <span>Cetak</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => window.print()}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-[#0055A5] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-2xs"
                        >
                            <DownloadIcon className="h-4 w-4" />
                            <span>Ekspor Laporan Tabular</span>
                        </button>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Telaahan Terdaftar</div>
                        <div className="text-2xl font-bold text-gray-800 mt-1">{filtered.length} Berkas</div>
                        <div className="text-xs text-blue-600 font-semibold mt-1">Terintegrasi rincian perkara</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Status Aktif (Dalam Proses)</div>
                        <div className="text-2xl font-bold text-amber-600 mt-1">{countAktif}</div>
                        <div className="text-xs text-gray-500 mt-1">Sedang dalam proses telaah / review</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Status Selesai</div>
                        <div className="text-2xl font-bold text-emerald-600 mt-1">{countSelesai}</div>
                        <div className="text-xs text-emerald-600 font-semibold mt-1">Naskah telah di-TTE Nadine</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Rata-rata Durasi Penelaahan</div>
                        <div className="text-2xl font-bold text-gray-800 mt-1">4.2 Hari</div>
                        <div className="text-xs text-gray-500 mt-1">Standar SLA &lt; 7 Hari Kerja</div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0055A5]"></span>
                            <h3 className="text-sm font-bold text-gray-800">
                                Filter Data: Periode, Status Telaahan, Pengirim &amp; PIC
                            </h3>
                        </div>
                        {(telaahanSearch || telaahanStatus !== 'Semua Status' || telaahanPengirim !== 'Semua Pengirim' || telaahanPic !== 'Semua PIC' || telaahanStartDate || telaahanEndDate || telaahanPeriodePreset !== 'Semua') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setTelaahanSearch('');
                                    setTelaahanStatus('Semua Status');
                                    setTelaahanPengirim('Semua Pengirim');
                                    setTelaahanPic('Semua PIC');
                                    setTelaahanStartDate('');
                                    setTelaahanEndDate('');
                                    setTelaahanPeriodePreset('Semua');
                                    setTelaahanPage(1);
                                }}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition flex items-center space-x-1"
                            >
                                <span>Reset Filter</span>
                            </button>
                        )}
                    </div>

                    {/* Quick Periode Tabs */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase mr-1">Preset Periode:</span>
                        {(['Semua', 'Bulan Ini', 'Triwulan Ini', 'Tahun 2026'] as const).map(preset => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                    setTelaahanPeriodePreset(preset);
                                    setTelaahanStartDate('');
                                    setTelaahanEndDate('');
                                    setTelaahanPage(1);
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                    telaahanPeriodePreset === preset
                                        ? 'bg-[#0055A5] text-white shadow-2xs'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Periode Range */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                                Periode (Tanggal Awal - Akhir)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input 
                                    type="date"
                                    value={telaahanStartDate}
                                    onChange={(e) => { 
                                        setTelaahanStartDate(e.target.value); 
                                        setTelaahanPeriodePreset('Semua');
                                        setTelaahanPage(1); 
                                    }}
                                    className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50"
                                    placeholder="Dari"
                                />
                                <input 
                                    type="date"
                                    value={telaahanEndDate}
                                    onChange={(e) => { 
                                        setTelaahanEndDate(e.target.value); 
                                        setTelaahanPeriodePreset('Semua');
                                        setTelaahanPage(1); 
                                    }}
                                    className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50"
                                    placeholder="Sampai"
                                />
                            </div>
                        </div>

                        {/* 2. Status Telaahan */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                                Status Telaahan
                            </label>
                            <div className="relative">
                                <select
                                    value={telaahanStatus}
                                    onChange={(e) => { setTelaahanStatus(e.target.value); setTelaahanPage(1); }}
                                    className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50 font-medium text-gray-700"
                                >
                                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* 3. Pengirim */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                                Pengirim / Unit Pemohon
                            </label>
                            <div className="relative">
                                <select
                                    value={telaahanPengirim}
                                    onChange={(e) => { setTelaahanPengirim(e.target.value); setTelaahanPage(1); }}
                                    className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50 font-medium text-gray-700"
                                >
                                    {pengirimOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* 4. PIC Penelaah */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                                PIC Penelaah
                            </label>
                            <div className="relative">
                                <select
                                    value={telaahanPic}
                                    onChange={(e) => { setTelaahanPic(e.target.value); setTelaahanPage(1); }}
                                    className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50 font-medium text-gray-700"
                                >
                                    {picOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative pt-2">
                        <SearchIcon className="absolute left-3.5 top-5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={telaahanSearch}
                            onChange={(e) => { setTelaahanSearch(e.target.value); setTelaahanPage(1); }}
                            placeholder="Cari nomor telaahan, nomor perkara, pihak penggugat/tergugat, perihal kasus, atau PIC..."
                            className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50 text-gray-800 placeholder-gray-400 font-medium"
                        />
                    </div>
                </div>

                {/* Tabular Table: Laporan tabular secara komprehensif terkait rincian data Perkara */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Laporan Tabular Rincian Data Perkara &amp; Hasil Telaahan
                            </h3>
                            <p className="text-xs text-gray-500">
                                Rincian lengkap status perkara litigasi/non-litigasi yang ditelaah oleh Tim Advokasi
                            </p>
                        </div>
                        <div className="text-xs font-semibold text-gray-500">
                            Total Data: <span className="text-gray-900 font-bold">{filtered.length}</span> perkara
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-700">
                            <thead className="bg-[#F1F5F9] text-gray-700 border-b border-gray-200 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th scope="col" className="py-3.5 px-3 text-center w-12">No</th>
                                    <th scope="col" className="py-3.5 px-4 min-w-[220px]">Nomor &amp; Tanggal Naskah Dinas</th>
                                    <th scope="col" className="py-3.5 px-4 min-w-[220px]">Pemohon/Pengirim &amp; Unit Pengirim</th>
                                    <th scope="col" className="py-3.5 px-4 min-w-[250px]">Perihal Naskah Dinas &amp; Rincian Perkara</th>
                                    <th scope="col" className="py-3.5 px-3 text-center min-w-[130px]">Status Posisi</th>
                                    <th scope="col" className="py-3.5 px-3.5 min-w-[170px]">PIC &amp; Last Update</th>
                                    <th scope="col" className="py-3.5 px-3.5 text-center w-36">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {pagedData.length > 0 ? (
                                    pagedData.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                                            <td className="py-3.5 px-3 text-center text-gray-500 font-medium">
                                                {(telaahanPage - 1) * pageSize + idx + 1}
                                            </td>

                                            {/* Nomor & Tanggal Naskah Dinas */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-gray-900 font-mono text-[13px]">{item.nomor}</div>
                                                <div className="text-[11px] text-gray-500 mt-0.5">{item.tanggal}</div>
                                                <div className="mt-1 flex items-center space-x-1.5 flex-wrap gap-1">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        item.urgensi === 'Sangat Segera' || item.urgensi === 'Segera'
                                                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                            : item.urgensi === 'Penting'
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                : 'bg-gray-50 text-gray-650 border border-gray-200'
                                                    }`}>
                                                        {item.urgensi}
                                                    </span>
                                                    {(item as any).nomorTelaahan && (item as any).nomorTelaahan !== '-' && (item as any).nomorTelaahan !== item.nomor && (
                                                        <span className="text-[10px] text-gray-400 font-mono" title="No. Register Telaahan">
                                                            Reg: {(item as any).nomorTelaahan}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Pemohon/Pengirim & Unit Pengirim */}
                                            <td className="py-3.5 px-4 max-w-xs">
                                                <div className="font-semibold text-gray-900 line-clamp-1" title={item.pemohon}>
                                                    {item.pemohon}
                                                </div>
                                                <div className="text-gray-600 text-[11px] mt-0.5 line-clamp-2" title={item.unit}>
                                                    {item.unit}
                                                </div>
                                                <div className="mt-1 flex items-center space-x-2 text-[10px] text-gray-400">
                                                    <span>📎 {item.dokumenCount} Dokumen</span>
                                                </div>
                                            </td>

                                            {/* Perihal Naskah Dinas & Rincian Perkara Komprehensif */}
                                            <td className="py-3.5 px-4 max-w-sm">
                                                <div 
                                                    className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug"
                                                    onClick={() => setSelectedTelaahanForDetail(item)}
                                                    title={item.perihal}
                                                >
                                                    {item.perihal}
                                                </div>

                                                {/* Badge Kategori & Rincian Perkara Terkait */}
                                                <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                                                    <div className="flex items-center space-x-1.5 flex-wrap">
                                                        <span className="font-bold text-[#0055A5] font-mono text-[11px]">
                                                            {item.nomorPerkara}
                                                        </span>
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                            {item.jenisPerkara}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 flex items-center space-x-1 truncate" title={item.tingkatPengadilan}>
                                                        <span>🏛️ {item.tingkatPengadilan}</span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-600 line-clamp-1 italic" title={item.pokokPerkara}>
                                                        Pokok: {item.pokokPerkara}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Posisi */}
                                            <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                                {item.statusPosisi === 'Terkirim' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
                                                        Terkirim
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                                        <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full"></span>
                                                        Konsep Telaahan
                                                    </span>
                                                )}

                                                {item.nomorNaskah && item.nomorNaskah !== '-' && (
                                                    <div className="text-[10px] text-gray-500 font-mono mt-1" title="Nomor Surat Balasan Nadine">
                                                        {item.nomorNaskah}
                                                    </div>
                                                )}
                                                {item.tglTte && (
                                                    <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">
                                                        TTE: {item.tglTte.split(' ')[0]}
                                                    </div>
                                                )}
                                            </td>

                                            {/* PIC & Last Update */}
                                            <td className="py-3.5 px-3.5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-2 shrink-0 border border-blue-100 font-bold text-xs">
                                                        {item.pic ? item.pic.charAt(0) : 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-800 font-semibold truncate max-w-[130px]" title={item.pic}>
                                                            {item.pic}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-bold leading-tight">Last update:</span>
                                                        <span className="text-[10px] text-gray-500 font-medium truncate leading-tight">
                                                            {item.lastUpdate}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Aksi */}
                                            <td className="py-3.5 px-3.5 text-center">
                                                <div className="flex flex-col space-y-1.5 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedTelaahanForDetail(item)}
                                                        className="w-full px-2.5 py-1.5 bg-blue-50 text-[#0055A5] hover:bg-blue-100 border border-blue-200 rounded-lg font-semibold text-[11px] transition shadow-2xs flex items-center justify-center space-x-1"
                                                    >
                                                        <EyeIcon className="h-3.5 w-3.5" />
                                                        <span>Detail Perkara</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onNavigate('eAdvokasiTelaahanKasusHukum')}
                                                        className="w-full px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-medium text-[11px] transition"
                                                    >
                                                        Buka Modul
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-400">
                                            Tidak ada data telaahan perkara yang cocok dengan parameter filter yang dipilih.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                            <div>
                                Menampilkan <span className="font-bold">{(telaahanPage - 1) * pageSize + 1}</span> - <span className="font-bold">{Math.min(telaahanPage * pageSize, filtered.length)}</span> dari <span className="font-bold">{filtered.length}</span> data
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    disabled={telaahanPage === 1}
                                    onClick={() => setTelaahanPage(p => p - 1)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-semibold"
                                >
                                    Sebelumnya
                                </button>
                                <span className="font-bold text-gray-800 px-2">{telaahanPage} / {totalPages}</span>
                                <button
                                    type="button"
                                    disabled={telaahanPage === totalPages}
                                    onClick={() => setTelaahanPage(p => p + 1)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-semibold"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderMonitoringKelengkapanData = () => {
        const auditRecords = [
            {
                id: 'AUD-001',
                registerId: 'REG/PKR/2026/0142',
                modul: 'Perkara',
                perihal: 'Gugatan PMH Ganti Rugi Lahan Bendungan Jatigede',
                unit: 'Direktorat Jenderal Kekayaan Negara',
                totalFields: 12,
                filledFields: 12,
                missingFields: [] as string[],
                score: 100,
                status: 'Lengkap',
                viewTarget: 'eAdvokasiPenangananPerkara' as View,
                checklist: [
                    { name: 'Nomor Register & Administrasi', category: 'Administrasi', isFilled: true, value: 'REG/PKR/2026/0142' },
                    { name: 'Tanggal Registrasi Masuk', category: 'Administrasi', isFilled: true, value: '10 Januari 2026' },
                    { name: 'Unit Kerja Pemohon', category: 'Administrasi', isFilled: true, value: 'DJKN Jawa Barat' },
                    { name: 'Identitas Para Pihak Penggugat', category: 'Para Pihak', isFilled: true, value: 'Warga Terdampak Waduk' },
                    { name: 'Identitas Para Pihak Tergugat', category: 'Para Pihak', isFilled: true, value: 'Menkeu RI cq DJKN' },
                    { name: 'Objek Sengketa & Posisi Kasus', category: 'Substansi', isFilled: true, value: 'Klaim ganti rugi tanah adat' },
                    { name: 'Nilai Tuntutan / Ganti Kerugian', category: 'Substansi', isFilled: true, value: 'Rp 14.500.000.000' },
                    { name: 'Jadwal & Agenda Sidang Pertama', category: 'Persidangan', isFilled: true, value: '04 Februari 2026 (Mediasi)' },
                    { name: 'Dokumen Salinan Gugatan & Relaas', category: 'Lampiran', isFilled: true, value: 'Gugatan_Resmi_Jatigede.pdf' },
                    { name: 'Alat Bukti Surat & Kepemilikan (P-1)', category: 'Lampiran', isFilled: true, value: 'Warkah_Tanah_1982.pdf' },
                    { name: 'NIP & Surat Kuasa Tim Advokasi', category: 'Tim Hukum', isFilled: true, value: 'SK-Adv/014/2026' },
                    { name: 'Resume Analisis & Strategi Hukum', category: 'Analisis', isFilled: true, value: 'Eksepsi Kompetensi Absolut' }
                ]
            },
            {
                id: 'AUD-002',
                registerId: 'REG/PKR/2026/0155',
                modul: 'Perkara',
                perihal: 'Sengketa Tata Usaha Negara Pembatalan Izin Impor Garam Industri',
                unit: 'Direktorat Jenderal Bea dan Cukai',
                totalFields: 12,
                filledFields: 10,
                missingFields: ['Nilai Tuntutan Ganti Rugi', 'Dokumen Bukti P-1'],
                score: 83,
                status: 'Perlu Dilengkapi',
                viewTarget: 'eAdvokasiPenangananPerkara' as View,
                checklist: [
                    { name: 'Nomor Register & Administrasi', category: 'Administrasi', isFilled: true, value: 'REG/PKR/2026/0155' },
                    { name: 'Tanggal Registrasi Masuk', category: 'Administrasi', isFilled: true, value: '18 Januari 2026' },
                    { name: 'Unit Kerja Pemohon', category: 'Administrasi', isFilled: true, value: 'KPPBC Tanjung Priok' },
                    { name: 'Identitas Para Pihak Penggugat', category: 'Para Pihak', isFilled: true, value: 'PT Garam Samudera' },
                    { name: 'Identitas Para Pihak Tergugat', category: 'Para Pihak', isFilled: true, value: 'Kepala Kantor DJBC' },
                    { name: 'Objek Sengketa & Posisi Kasus', category: 'Substansi', isFilled: true, value: 'Pembatalan SPTNP Garam' },
                    { name: 'Nilai Tuntutan Ganti Rugi', category: 'Substansi', isFilled: false, value: 'Belum diisi (Missing)' },
                    { name: 'Jadwal & Agenda Sidang Pertama', category: 'Persidangan', isFilled: true, value: '12 Februari 2026' },
                    { name: 'Dokumen Salinan Gugatan & Relaas', category: 'Lampiran', isFilled: true, value: 'Gugatan_PTUN_0155.pdf' },
                    { name: 'Dokumen Bukti P-1', category: 'Lampiran', isFilled: false, value: 'Belum diunggah (Missing)' },
                    { name: 'NIP & Surat Kuasa Tim Advokasi', category: 'Tim Hukum', isFilled: true, value: 'SK-BC/88/2026' },
                    { name: 'Resume Analisis & Strategi Hukum', category: 'Analisis', isFilled: true, value: 'Kajian Dokumen Pabean' }
                ]
            },
            {
                id: 'AUD-003',
                registerId: 'REG/PKR/2026/0168',
                modul: 'Perkara',
                perihal: 'Permohonan PKPU PT Nusantara Prima Energy kepada Kemenkeu',
                unit: 'Sekretariat Jenderal',
                totalFields: 12,
                filledFields: 7,
                missingFields: ['Jadwal Sidang Pertama', 'Amar Putusan Sela', 'NIP Tim Advokasi', 'Dokumen Gugatan Asli', 'Objek Tuntutan'],
                score: 58,
                status: 'Kritis',
                viewTarget: 'eAdvokasiPenangananPerkara' as View,
                checklist: [
                    { name: 'Nomor Register & Administrasi', category: 'Administrasi', isFilled: true, value: 'REG/PKR/2026/0168' },
                    { name: 'Tanggal Registrasi Masuk', category: 'Administrasi', isFilled: true, value: '25 Januari 2026' },
                    { name: 'Unit Kerja Pemohon', category: 'Administrasi', isFilled: true, value: 'Biro Hukum Setjen' },
                    { name: 'Identitas Para Pihak Penggugat', category: 'Para Pihak', isFilled: true, value: 'PT Nusantara Prima Energy' },
                    { name: 'Identitas Para Pihak Tergugat', category: 'Para Pihak', isFilled: true, value: 'Menteri Keuangan RI' },
                    { name: 'Objek Tuntutan', category: 'Substansi', isFilled: false, value: 'Belum diisi (Missing)' },
                    { name: 'Nilai Tuntutan / Ganti Kerugian', category: 'Substansi', isFilled: true, value: 'Rp 32.000.000.000' },
                    { name: 'Jadwal Sidang Pertama', category: 'Persidangan', isFilled: false, value: 'Belum diisi (Missing)' },
                    { name: 'Amar Putusan Sela', category: 'Persidangan', isFilled: false, value: 'Belum diisi (Missing)' },
                    { name: 'Dokumen Gugatan Asli', category: 'Lampiran', isFilled: false, value: 'Belum diunggah (Missing)' },
                    { name: 'NIP Tim Advokasi', category: 'Tim Hukum', isFilled: false, value: 'Belum diisi (Missing)' },
                    { name: 'Resume Analisis & Strategi Hukum', category: 'Analisis', isFilled: true, value: 'Analisis awal piutang' }
                ]
            },
            {
                id: 'AUD-004',
                registerId: 'REG/PDP/2026/0073',
                modul: 'Pendampingan',
                perihal: 'Pendampingan Saksi Dugaan Penyimpangan Pengadaan IT Core Tax',
                unit: 'Direktorat Jenderal Pajak',
                totalFields: 10,
                filledFields: 10,
                missingFields: [] as string[],
                score: 100,
                status: 'Lengkap',
                viewTarget: 'eAdvokasiPendampingan' as View,
                checklist: [
                    { name: 'Nomor Tiket & Tanggal Masuk', category: 'Administrasi', isFilled: true, value: 'REG/PDP/2026/0073' },
                    { name: 'Instansi / Unit Pemohon', category: 'Administrasi', isFilled: true, value: 'Direktorat KITSDA DJP' },
                    { name: 'Identitas Pegawai yang Dipanggil', category: 'Personel', isFilled: true, value: 'Ahmad Fauzi (Pranata Komputer)' },
                    { name: 'Surat Panggilan Pemeriksaan', category: 'Dokumen', isFilled: true, value: 'SP-Bareskrim/09/2026.pdf' },
                    { name: 'Pokok Masalah Pemanggilan', category: 'Substansi', isFilled: true, value: 'Klarifikasi spesifikasi teknis server' },
                    { name: 'Jadwal Tanggal Pemanggilan', category: 'Jadwal', isFilled: true, value: '14 Februari 2026' },
                    { name: 'Instansi Penegak Hukum Pemanggil', category: 'Pihak Eksternal', isFilled: true, value: 'Bareskrim Polri Dit Tipikor' },
                    { name: 'Tim Pendamping Hukum Kemenkeu', category: 'Tim Advokasi', isFilled: true, value: 'Dedi Irawan & Rini Astuti' },
                    { name: 'Resume / Berita Acara Konseling', category: 'Laporan', isFilled: true, value: 'Resume_Pra_Pemeriksaan.pdf' },
                    { name: 'Rekomendasi Tindak Lanjut', category: 'Laporan', isFilled: true, value: 'Menyiapkan dokumen adendum kontrak' }
                ]
            },
            {
                id: 'AUD-005',
                registerId: 'REG/PDP/2026/0081',
                modul: 'Pendampingan',
                perihal: 'Klarifikasi Pemanggilan Pegawai oleh Bareskrim Polri',
                unit: 'Direktorat Jenderal Bea dan Cukai',
                totalFields: 10,
                filledFields: 8,
                missingFields: ['Salinan Surat Panggilan Resmi', 'Resume Hasil Pemeriksaan'],
                score: 80,
                status: 'Perlu Dilengkapi',
                viewTarget: 'eAdvokasiPendampingan' as View,
                checklist: [
                    { name: 'Nomor Tiket & Tanggal Masuk', category: 'Administrasi', isFilled: true, value: 'REG/PDP/2026/0081' },
                    { name: 'Instansi / Unit Pemohon', category: 'Administrasi', isFilled: true, value: 'KPPBC Merak' },
                    { name: 'Identitas Pegawai yang Dipanggil', category: 'Personel', isFilled: true, value: 'Bambang Sudiro (Pemeriksa Bea Cukai)' },
                    { name: 'Salinan Surat Panggilan Resmi', category: 'Dokumen', isFilled: false, value: 'Belum diunggah (Missing)' },
                    { name: 'Pokok Masalah Pemanggilan', category: 'Substansi', isFilled: true, value: 'Pemeriksaan jalur hijau kontainer tekstil' },
                    { name: 'Jadwal Tanggal Pemanggilan', category: 'Jadwal', isFilled: true, value: '20 Februari 2026' },
                    { name: 'Instansi Penegak Hukum Pemanggil', category: 'Pihak Eksternal', isFilled: true, value: 'Polda Banten' },
                    { name: 'Tim Pendamping Hukum Kemenkeu', category: 'Tim Advokasi', isFilled: true, value: 'Admin Tuban Kum' },
                    { name: 'Resume Hasil Pemeriksaan', category: 'Laporan', isFilled: false, value: 'Belum diunggah (Missing)' },
                    { name: 'Rekomendasi Tindak Lanjut', category: 'Laporan', isFilled: true, value: 'Koordinasi Bidang Hukum DJBC' }
                ]
            },
            {
                id: 'AUD-006',
                registerId: 'REG/PDP/2026/0089',
                modul: 'Pendampingan',
                perihal: 'Konsultasi Perjanjian Kerjasama Kereta Cepat Jakarta-Surabaya',
                unit: 'Direktorat Jenderal Perbendaharaan',
                totalFields: 10,
                filledFields: 6,
                missingFields: ['Draft Nota Kesepahaman Final', 'Analisis Risiko Hukum Kontrak', 'NIP PIC Pendamping', 'Tindak Lanjut Rekomendasi'],
                score: 60,
                status: 'Kritis',
                viewTarget: 'eAdvokasiPendampingan' as View,
                checklist: [
                    { name: 'Nomor Tiket & Tanggal Masuk', category: 'Administrasi', isFilled: true, value: 'REG/PDP/2026/0089' },
                    { name: 'Instansi / Unit Pemohon', category: 'Administrasi', isFilled: true, value: 'Dit. SMI DJPb' },
                    { name: 'Identitas Pegawai yang Dipanggil', category: 'Personel', isFilled: true, value: 'Direktur Sistem Manajemen Investasi' },
                    { name: 'Draft Nota Kesepahaman Final', category: 'Dokumen', isFilled: false, value: 'Belum diunggah (Missing)' },
                    { name: 'Pokok Masalah Pemanggilan', category: 'Substansi', isFilled: true, value: 'Klausul jaminan penyertaan modal negara' },
                    { name: 'Analisis Risiko Hukum Kontrak', category: 'Substansi', isFilled: false, value: 'Belum diisi (Missing)' },
                    { name: 'Instansi Penegak Hukum Pemanggil', category: 'Pihak Eksternal', isFilled: true, value: 'Kementerian Perhubungan RI' },
                    { name: 'NIP PIC Pendamping', category: 'Tim Advokasi', isFilled: false, value: 'Belum diisi (Missing)' },
                    { name: 'Resume / Berita Acara Konseling', category: 'Laporan', isFilled: true, value: 'Notula_Rapat_Harmonisasi.pdf' },
                    { name: 'Tindak Lanjut Rekomendasi', category: 'Laporan', isFilled: false, value: 'Belum diisi (Missing)' }
                ]
            },
            {
                id: 'AUD-007',
                registerId: 'TLH/2026/01/0088',
                modul: 'Telaahan',
                perihal: 'Kajian Yuridis Pengajuan Keberatan Pajak PPh Badan PT Sumber Alfaria',
                unit: 'Direktorat Jenderal Pajak',
                totalFields: 10,
                filledFields: 10,
                missingFields: [] as string[],
                score: 100,
                status: 'Lengkap',
                viewTarget: 'eAdvokasiTelaahanKasusHukum' as View,
                checklist: [
                    { name: 'Nomor Registrasi Telaahan', category: 'Administrasi', isFilled: true, value: 'TLH/2026/01/0088' },
                    { name: 'Tanggal Surat Masuk', category: 'Administrasi', isFilled: true, value: '14 Januari 2026' },
                    { name: 'Unit Pengirim / Pemohon', category: 'Administrasi', isFilled: true, value: 'Ditjen Pajak' },
                    { name: 'Nomor Perkara Terkait', category: 'Data Perkara', isFilled: true, value: '142/G/2026/PTUN.JKT' },
                    { name: 'Pokok Permasalahan Hukum', category: 'Substansi', isFilled: true, value: 'Koreksi Positif Biaya Promosi 3M' },
                    { name: 'Tingkat Urgensi Kasus', category: 'Substansi', isFilled: true, value: 'Sangat Segera' },
                    { name: 'Tim & PIC Penelaah', category: 'Tim Penelaah', isFilled: true, value: 'Admin Tuban Kum (Ketua Tim)' },
                    { name: 'Dokumen Berkas Lampiran', category: 'Lampiran', isFilled: true, value: '5 Berkas Lengkap' },
                    { name: 'Hasil Analisis & Abstraksi Yuridis', category: 'Hasil Kajian', isFilled: true, value: 'Analisis Pasal 6 ayat 1 UU PPh' },
                    { name: 'Nomor Registrasi Nadine TTE', category: 'Validasi Nadine', isFilled: true, value: 'ND-882/SET.1/2026' }
                ]
            },
            {
                id: 'AUD-008',
                registerId: 'TLH/2026/02/0112',
                modul: 'Telaahan',
                perihal: 'Harmonisasi dan Kajian Uji Materiil Peraturan Pemerintah terkait Tarif PNBP',
                unit: 'Biro Hukum, Setjen',
                totalFields: 10,
                filledFields: 9,
                missingFields: ['Nomor Registrasi Nadine TTE'],
                score: 90,
                status: 'Perlu Dilengkapi',
                viewTarget: 'eAdvokasiTelaahanKasusHukum' as View,
                checklist: [
                    { name: 'Nomor Registrasi Telaahan', category: 'Administrasi', isFilled: true, value: 'TLH/2026/02/0112' },
                    { name: 'Tanggal Surat Masuk', category: 'Administrasi', isFilled: true, value: '18 Februari 2026' },
                    { name: 'Unit Pengirim / Pemohon', category: 'Administrasi', isFilled: true, value: 'Biro Hukum Setjen' },
                    { name: 'Nomor Perkara Terkait', category: 'Data Perkara', isFilled: true, value: '12/HUM/2026/MA' },
                    { name: 'Pokok Permasalahan Hukum', category: 'Substansi', isFilled: true, value: 'Uji materiil tarif royalti progresif' },
                    { name: 'Tingkat Urgensi Kasus', category: 'Substansi', isFilled: true, value: 'Sangat Segera' },
                    { name: 'Tim & PIC Penelaah', category: 'Tim Penelaah', isFilled: true, value: 'Budi Santoso' },
                    { name: 'Dokumen Berkas Lampiran', category: 'Lampiran', isFilled: true, value: '6 Berkas Termasuk Salinan PP' },
                    { name: 'Hasil Analisis & Abstraksi Yuridis', category: 'Hasil Kajian', isFilled: true, value: 'Kajian UU No. 9 Tahun 2018 PNBP' },
                    { name: 'Nomor Registrasi Nadine TTE', category: 'Validasi Nadine', isFilled: false, value: 'Belum diisi (TTE Pending)' }
                ]
            },
            {
                id: 'AUD-009',
                registerId: 'REG/PUT/2026/0045',
                modul: 'Penanganan Putusan',
                perihal: 'Eksekusi Putusan Mahkamah Agung Gugatan Sengketa Pajak Rokok',
                unit: 'Direktorat Jenderal Bea dan Cukai',
                totalFields: 11,
                filledFields: 11,
                missingFields: [] as string[],
                score: 100,
                status: 'Lengkap',
                viewTarget: 'eAdvokasiPenangananPutusan' as View,
                checklist: [
                    { name: 'Nomor Putusan Pengadilan', category: 'Administrasi Putusan', isFilled: true, value: '45/B/PK/PJK/2025' },
                    { name: 'Tanggal Putusan Diucapkan', category: 'Administrasi Putusan', isFilled: true, value: '08 November 2025' },
                    { name: 'Lembaga Peradilan Pemutus', category: 'Administrasi Putusan', isFilled: true, value: 'Mahkamah Agung RI' },
                    { name: 'Para Pihak Pemohon PK vs Termohon PK', category: 'Para Pihak', isFilled: true, value: 'Menkeu RI vs PT Djarum' },
                    { name: 'Klasifikasi Amar Putusan', category: 'Amar Putusan', isFilled: true, value: 'Menolak Permohonan PK Wajib Pajak (Menang)' },
                    { name: 'Status Berkekuatan Hukum Tetap (BHT)', category: 'Status Hukum', isFilled: true, value: 'Inkracht van Gewijsde' },
                    { name: 'Tanggal Penerimaan Salinan Relaas', category: 'Dokumen', isFilled: true, value: '15 Januari 2026' },
                    { name: 'Salinan Resmi Amar Putusan Kasasi/PK', category: 'Dokumen', isFilled: true, value: 'Salinan_Resmi_MA_45PK.pdf' },
                    { name: 'Rekomendasi Tindak Lanjut Eksekusi', category: 'Tindak Lanjut', isFilled: true, value: 'Penerbitan Surat Tagihan Cukai Final' },
                    { name: 'Tim Kuasa Penanganan Putusan', category: 'Tim Advokasi', isFilled: true, value: 'Dedi Irawan & Hendra Wijaya' },
                    { name: 'Catatan Dampak Fiskal / Keuangan Negara', category: 'Dampak Finansial', isFilled: true, value: 'Penyelamatan Keuangan Negara Rp 28,4 Miliar' }
                ]
            },
            {
                id: 'AUD-010',
                registerId: 'REG/PUT/2026/0052',
                modul: 'Penanganan Putusan',
                perihal: 'Tindak Lanjut Putusan PTUN Pembatalan SK Pemecatan Pegawai',
                unit: 'Sekretariat Jenderal',
                totalFields: 11,
                filledFields: 8,
                missingFields: ['Salinan Resmi Amar Putusan Kasasi', 'Tanggal Penerimaan Salinan Relaas', 'Dokumen Rekomendasi Eksekusi'],
                score: 72,
                status: 'Perlu Dilengkapi',
                viewTarget: 'eAdvokasiPenangananPutusan' as View,
                checklist: [
                    { name: 'Nomor Putusan Pengadilan', category: 'Administrasi Putusan', isFilled: true, value: '52/G/2025/PTUN.JKT' },
                    { name: 'Tanggal Putusan Diucapkan', category: 'Administrasi Putusan', isFilled: true, value: '12 Desember 2025' },
                    { name: 'Lembaga Peradilan Pemutus', category: 'Administrasi Putusan', isFilled: true, value: 'PTUN Jakarta' },
                    { name: 'Para Pihak Pemohon PK vs Termohon PK', category: 'Para Pihak', isFilled: true, value: 'Eks Pegawai vs Sekretaris Jenderal' },
                    { name: 'Klasifikasi Amar Putusan', category: 'Amar Putusan', isFilled: true, value: 'Mengabulkan Gugatan Penggugat Sebagian' },
                    { name: 'Status Berkekuatan Hukum Tetap (BHT)', category: 'Status Hukum', isFilled: true, value: 'Belum Inkracht (Proses Banding PTTUN)' },
                    { name: 'Tanggal Penerimaan Salinan Relaas', category: 'Dokumen', isFilled: false, value: 'Belum diisi (Missing)' },
                    { name: 'Salinan Resmi Amar Putusan Kasasi', category: 'Dokumen', isFilled: false, value: 'Belum diunggah (Missing)' },
                    { name: 'Dokumen Rekomendasi Eksekusi', category: 'Tindak Lanjut', isFilled: false, value: 'Belum diunggah (Missing)' },
                    { name: 'Tim Kuasa Penanganan Putusan', category: 'Tim Advokasi', isFilled: true, value: 'Budi Santoso & Siti Rahma' },
                    { name: 'Catatan Dampak Fiskal / Keuangan Negara', category: 'Dampak Finansial', isFilled: true, value: 'Rehabilitasi hak kepegawaian dan gaji' }
                ]
            }
        ];

        const filtered = auditRecords.filter(item => {
            const matchModul = kelengkapanModul === 'Semua Modul' || item.modul === kelengkapanModul;
            const matchLevel = kelengkapanLevel === 'Semua Tingkat' ||
                (kelengkapanLevel === 'Lengkap (100%)' && item.score === 100) ||
                (kelengkapanLevel === 'Sebagian Missing (70-99%)' && item.score >= 70 && item.score < 100) ||
                (kelengkapanLevel === 'Kritis (<70%)' && item.score < 70);

            const matchSearch = kelengkapanSearch === '' ||
                item.registerId.toLowerCase().includes(kelengkapanSearch.toLowerCase()) ||
                item.perihal.toLowerCase().includes(kelengkapanSearch.toLowerCase()) ||
                item.unit.toLowerCase().includes(kelengkapanSearch.toLowerCase()) ||
                item.missingFields.some(m => m.toLowerCase().includes(kelengkapanSearch.toLowerCase()));

            return matchModul && matchLevel && matchSearch;
        });

        const pageSize = 6;
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        const pagedData = filtered.slice((kelengkapanPage - 1) * pageSize, kelengkapanPage * pageSize);

        const overallScore = 92.4;
        const totalLengkap = 785;
        const totalIncomplete = 177;

        return (
            <div className="space-y-6">
                <Breadcrumb currentView={currentView} onNavigate={onNavigate} />

                {/* Top Header Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                            <CheckCircleIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">
                                    Sub-Modul Monitoring: Kelengkapan Data
                                </h1>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Audit Completeness
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Persentase kelengkapan pengisian data dan audit list field yang missing dengan tingkat completeness di seluruh proses advokasi
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button 
                            type="button"
                            onClick={() => window.print()}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition shadow-2xs"
                        >
                            <DownloadIcon className="h-4 w-4" />
                            <span>Unduh Laporan Audit</span>
                        </button>
                    </div>
                </div>

                {/* Section 1: Persentase Kelengkapan Data Pengisian (Score & Breakdown) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Overall Score Box */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Audit Status Sistem</span>
                            <h3 className="text-lg font-bold mt-1">Skor Kelengkapan Pengisian Data</h3>
                            <p className="text-xs text-slate-300 mt-1">Akumulasi pengisian field wajib dari 962 berkas advokasi terdaftar</p>
                        </div>
                        <div className="my-5 flex items-baseline space-x-3">
                            <span className="text-5xl font-black text-white tracking-tight">{overallScore}%</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Sangat Baik (Grade A)
                            </span>
                        </div>
                        <div className="space-y-2 border-t border-slate-700/60 pt-4 text-xs text-slate-300">
                            <div className="flex justify-between">
                                <span>Total Field Wajib Dimonitor:</span>
                                <span className="font-bold text-white">9,620 Field</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Field Terisi Lengkap (100%):</span>
                                <span className="font-bold text-emerald-400">8,890 Field (92.4%)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Field Missing / Belum Lengkap:</span>
                                <span className="font-bold text-rose-400">730 Field (7.6%)</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-700/40 pt-2 text-[11px]">
                                <span>Berkas Lengkap vs Belum:</span>
                                <span className="font-bold text-white">{totalLengkap} Lengkap / {totalIncomplete} Belum</span>
                            </div>
                        </div>
                    </div>

                    {/* Module Progress Breakdown */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                1. Persentase Kelengkapan per Modul
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">Tingkat pengisian field wajib pada masing-masing proses advokasi</p>
                        </div>
                        <div className="space-y-3.5">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-gray-700">1. Penanganan Perkara (Litigasi)</span>
                                    <span className="text-blue-600 font-bold">93.8% (405/432 Lengkap)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '93.8%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-gray-700">2. Pendampingan Hukum (Non-Litigasi)</span>
                                    <span className="text-emerald-600 font-bold">88.5% (79/89 Lengkap)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '88.5%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-gray-700">3. Telaahan Kasus Hukum</span>
                                    <span className="text-indigo-600 font-bold">95.1% (147/156 Lengkap)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '95.1%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-gray-700">4. Penanganan Putusan Pengadilan</span>
                                    <span className="text-amber-600 font-bold">89.4% (254/285 Lengkap)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '89.4%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unit Breakdown & Top Missing Ranking */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                2. Top Field Missing yang Paling Sering Kosong
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">Prioritas audit perbaikan data bagi Satker dan Tim Kuasa</p>
                        </div>
                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                                <span className="font-semibold text-rose-900">1. Nilai Tuntutan / Objek Kerugian</span>
                                <span className="font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">42 Berkas Kosong</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                                <span className="font-semibold text-amber-900">2. Jadwal Sidang Lanjutan &amp; Sela</span>
                                <span className="font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">35 Berkas Kosong</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50/70 border border-orange-100">
                                <span className="font-semibold text-orange-900">3. Salinan Resmi Putusan / Relaas Asli</span>
                                <span className="font-bold text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200">28 Berkas Kosong</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="font-semibold text-slate-800">4. NIP &amp; Surat Tugas Tim Kuasa</span>
                                <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">22 Berkas Kosong</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                                <span className="font-semibold text-blue-900">5. Nomor Registrasi TTE Nadine</span>
                                <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">18 Berkas Kosong</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: List Field yang Missing dengan Tingkat Completeness */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                                <span>Daftar Record &amp; List Field yang Missing dengan Tingkat Completeness</span>
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Pantau dan audit kelengkapan setiap berkas perkara, pendampingan, telaahan, dan putusan
                            </p>
                        </div>
                        {(kelengkapanModul !== 'Semua Modul' || kelengkapanLevel !== 'Semua Tingkat' || kelengkapanSearch) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setKelengkapanModul('Semua Modul');
                                    setKelengkapanLevel('Semua Tingkat');
                                    setKelengkapanSearch('');
                                    setKelengkapanPage(1);
                                }}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1">Filter Modul</label>
                            <div className="relative">
                                <select
                                    value={kelengkapanModul}
                                    onChange={(e) => { setKelengkapanModul(e.target.value); setKelengkapanPage(1); }}
                                    className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-medium text-gray-700"
                                >
                                    {['Semua Modul', 'Perkara', 'Pendampingan', 'Telaahan', 'Penanganan Putusan'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1">Tingkat Completeness</label>
                            <div className="relative">
                                <select
                                    value={kelengkapanLevel}
                                    onChange={(e) => { setKelengkapanLevel(e.target.value); setKelengkapanPage(1); }}
                                    className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-medium text-gray-700"
                                >
                                    {['Semua Tingkat', 'Lengkap (100%)', 'Sebagian Missing (70-99%)', 'Kritis (<70%)'].map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1">Pencarian Cepat</label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={kelengkapanSearch}
                                    onChange={(e) => { setKelengkapanSearch(e.target.value); setKelengkapanPage(1); }}
                                    placeholder="Cari ID register, perihal, unit kerja, atau field missing..."
                                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800 font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Tabular Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">
                                Data Audit Completeness Pengisian Field
                            </span>
                            <span className="text-xs text-gray-500">
                                ({filtered.length} Berkas Ditemukan)
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                {auditRecords.filter(r => r.score === 100).length} Lengkap (100%)
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                                {auditRecords.filter(r => r.score >= 70 && r.score < 100).length} Sebagian Missing
                            </span>
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                                {auditRecords.filter(r => r.score < 70).length} Kritis
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-700">
                            <thead className="bg-[#F1F5F9] text-gray-700 border-b border-gray-200 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th scope="col" className="py-3.5 px-3 text-center w-10">No</th>
                                    <th scope="col" className="py-3.5 px-4 w-44">No. Register &amp; Modul</th>
                                    <th scope="col" className="py-3.5 px-4 max-w-xs">Perihal Kasus</th>
                                    <th scope="col" className="py-3.5 px-3.5">Unit Kerja</th>
                                    <th scope="col" className="py-3.5 px-4 w-44">Tingkat Completeness</th>
                                    <th scope="col" className="py-3.5 px-4 min-w-[260px]">List Field yang Missing</th>
                                    <th scope="col" className="py-3.5 px-3 text-center w-28">Status Audit</th>
                                    <th scope="col" className="py-3.5 px-3.5 text-center w-36">Aksi Cepat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pagedData.length > 0 ? (
                                    pagedData.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="py-3.5 px-3 text-center text-gray-500 font-medium">
                                                {(kelengkapanPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-mono font-bold text-gray-900">{item.registerId}</div>
                                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold ${
                                                    item.modul === 'Perkara'
                                                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                        : item.modul === 'Pendampingan'
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : item.modul === 'Telaahan'
                                                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                }`}>
                                                    {item.modul}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 max-w-xs">
                                                <div className="font-semibold text-gray-900 line-clamp-2" title={item.perihal}>
                                                    {item.perihal}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-3.5 font-medium text-gray-600">
                                                {item.unit}
                                            </td>

                                            {/* Tingkat Completeness */}
                                            <td className="py-3.5 px-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="text-gray-500 font-medium">{item.filledFields}/{item.totalFields} Field</span>
                                                        <span className={`font-bold ${
                                                            item.score === 100 ? 'text-emerald-700' : item.score >= 70 ? 'text-blue-700' : 'text-rose-700'
                                                        }`}>
                                                            {item.score}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                                item.score === 100 
                                                                    ? 'bg-emerald-500' 
                                                                    : item.score >= 70 
                                                                        ? 'bg-blue-500' 
                                                                        : 'bg-rose-500'
                                                            }`} 
                                                            style={{ width: `${item.score}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* List Field yang Missing */}
                                            <td className="py-3.5 px-4">
                                                {item.missingFields.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.missingFields.map((f, i) => (
                                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                                                                {f}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                                        <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600" />
                                                        <span>Semua 12 Field Terisi Lengkap</span>
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-3 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    item.status === 'Lengkap'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : item.status === 'Perlu Dilengkapi'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-3.5 text-center">
                                                <div className="flex flex-col space-y-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedAuditRecordForModal(item)}
                                                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-md font-semibold text-[11px] transition"
                                                    >
                                                        Audit Checklist
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onNavigate(item.viewTarget)}
                                                        className="px-2.5 py-1 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 rounded-md font-medium text-[11px] transition"
                                                    >
                                                        {item.score === 100 ? 'Buka Data' : 'Lengkapi Field'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-400">
                                            Tidak ada data audit kelengkapan yang cocok dengan parameter filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                            <div>
                                Menampilkan <span className="font-bold">{(kelengkapanPage - 1) * pageSize + 1}</span> - <span className="font-bold">{Math.min(kelengkapanPage * pageSize, filtered.length)}</span> dari <span className="font-bold">{filtered.length}</span> data
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    disabled={kelengkapanPage === 1}
                                    onClick={() => setKelengkapanPage(p => p - 1)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-semibold"
                                >
                                    Sebelumnya
                                </button>
                                <span className="font-bold text-gray-800 px-2">{kelengkapanPage} / {totalPages}</span>
                                <button
                                    type="button"
                                    disabled={kelengkapanPage === totalPages}
                                    onClick={() => setKelengkapanPage(p => p + 1)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-semibold"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (currentView) {
            case 'eAdvokasiDashboard': return renderDashboard();
            case 'eAdvokasiPencarian':
            case 'eAdvokasiPencarianPerkara': return renderSearchPage('Pencarian Penanganan Perkara', 'Cari berdasarkan Nomor Perkara, Nama Pihak, atau Unit...');
            case 'eAdvokasiPencarianPendampingan': return renderSearchPage('Pencarian Pendampingan', 'Cari berdasarkan Nomor Tiket, Subjek, atau Pemohon...');
            case 'eAdvokasiPencarianPutusan': return renderSearchPage('Pencarian Penanganan Putusan', 'Cari berdasarkan Nomor Putusan, Amar, atau Klasifikasi...');
            case 'eAdvokasiPencarianDokumen': return <CariDokumen currentView={currentView} onNavigate={onNavigate} />;
            case 'eAdvokasiPencarianBankDalil': return <CariDokumen currentView={currentView} onNavigate={onNavigate} initialFilter="dalil" />;
            case 'eAdvokasiMonitoringPersidangan': return renderMonitoringTable('Monitoring Persidangan', ['Jadwal Sidang', 'No. Perkara', 'Pengadilan', 'Agenda', 'Status']);
            case 'eAdvokasiMonitoringPutusan': return renderMonitoringTable('Monitoring Putusan', ['Tgl. Putusan', 'No. Putusan', 'Amar Putusan', 'Status BHT', 'Tindak Lanjut']);
            case 'eAdvokasiMonitoringPendampingan': return renderMonitoringTable('Monitoring Pendampingan', ['Tahun', 'Pihak Terkait', 'Pokok Permasalahan', 'Progress', 'Posisi']);
            case 'eAdvokasiMonitoringPerkara': return renderMonitoringTable('Monitoring Perkara', ['No. Perkara', 'Klasifikasi', 'Nilai Tuntutan', 'Tahapan', 'Probabilitas']);
            case 'eAdvokasiMonitoringTelaahan': return renderMonitoringTelaahan();
            case 'eAdvokasiMonitoringKelengkapanData': return renderMonitoringKelengkapanData();
            case 'eAdvokasiMonitoringRisikoHukum': return renderMonitoringTable('Monitoring Risiko Hukum', ['Objek Risiko', 'Tingkat Risiko', 'Potensi Kerugian', 'Mitigasi', 'Update Terakhir']);
            case 'eAdvokasiAuditTrail': return renderAuditTrail();
            case 'eAdvokasiStatistikPerkara': return renderStatistikPerkara();
            default: return renderDashboard();
        }
    };

    return (
        <div className="flex h-full bg-gray-50 overflow-hidden">
            {/* Local Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{isPencarianView ? 'Pencarian' : 'Monitoring'}</h2>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                    {menus.map((group) => (
                        <div key={group.group}>
                            <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                {group.group}
                            </h3>
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = currentView === item.view;
                                    return (
                                        <li key={item.view}>
                                            <button
                                                type="button"
                                                onClick={() => onNavigate(item.view)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left text-xs ${
                                                    isActive 
                                                    ? 'bg-[#0055A5] text-white font-semibold shadow-xs' 
                                                    : 'text-gray-600 hover:bg-gray-100 font-medium'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3 min-w-0">
                                                    <div className={isActive ? 'text-white' : 'text-gray-400'}>
                                                        {item.icon}
                                                    </div>
                                                    <span className="truncate">{item.name}</span>
                                                </div>
                                                {item.badge && (
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1 shrink-0 ${
                                                        isActive 
                                                        ? 'bg-white/20 text-white border border-white/30' 
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>

            {/* Modal Detail Komprehensif Data Perkara & Telaahan Kasus */}
            {selectedTelaahanForDetail && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="px-6 py-4 bg-gradient-to-r from-[#0055A5] to-blue-800 text-white flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <ScaleIcon className="h-5 w-5 text-blue-200" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-base">Rincian Komprehensif Data Perkara & Telaahan</h3>
                                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                                            {selectedTelaahanForDetail.id}
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-100 mt-0.5">
                                        Nomor Registrasi: {selectedTelaahanForDetail.nomor} • Unit: {selectedTelaahanForDetail.pengirim}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedTelaahanForDetail(null)}
                                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[78vh] overflow-y-auto space-y-6 custom-scrollbar text-xs">
                            {/* Card Status & Urgensi */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status Telaahan</span>
                                    <div className="mt-1">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                            (selectedTelaahanForDetail.statusTelaahan === 'Selesai' || selectedTelaahanForDetail.statusPosisi === 'Terkirim')
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {selectedTelaahanForDetail.statusPosisi || selectedTelaahanForDetail.statusTelaahan || 'Aktif'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Urgensi Kasus</span>
                                    <div className="mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                            selectedTelaahanForDetail.urgensi === 'Sangat Segera' || selectedTelaahanForDetail.urgensi === 'Segera'
                                                ? 'bg-rose-100 text-rose-800 font-black'
                                                : selectedTelaahanForDetail.urgensi === 'Penting'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {selectedTelaahanForDetail.urgensi || 'Biasa'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status Naskah Dinas</span>
                                    <div className="mt-1 font-semibold text-gray-800">
                                        {selectedTelaahanForDetail.statusNaskah || selectedTelaahanForDetail.statusPosisi || 'Konsep Telaahan'}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Surat Balasan / TTE</span>
                                    <div className="mt-1 font-mono text-[11px] font-bold text-indigo-700">
                                        {selectedTelaahanForDetail.nomorNaskah || selectedTelaahanForDetail.tglTte || '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Section 1: Rincian Data Perkara Terkait */}
                            <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-2xs space-y-4">
                                <div className="flex items-center space-x-2 border-b border-blue-50 pb-3">
                                    <ScaleIcon className="h-4 w-4 text-blue-600" />
                                    <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                                        1. Rincian Data Perkara (Litigasi / Objek Gugatan)
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">Nomor Register Perkara</span>
                                        <div className="font-mono font-bold text-sm text-blue-700 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                                            {selectedTelaahanForDetail.nomorPerkara || '-'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">Klasifikasi & Jenis Perkara</span>
                                        <div className="font-semibold text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                                            {selectedTelaahanForDetail.jenisPerkara || 'Gugatan Tata Usaha Negara (TUN)'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">Lembaga Peradilan / Pengadilan</span>
                                        <div className="font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                                            {selectedTelaahanForDetail.tingkatPengadilan || 'Pengadilan Pajak / PTUN Jakarta'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">Kedudukan Hukum Pihak Kemenkeu</span>
                                        <div className="font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                                            {selectedTelaahanForDetail.pihak || 'Tergugat / Termohon PK (Menteri Keuangan c.q. DJP)'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Substansi Pokok Permasalahan & Analisis Hukum */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
                                <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                                    <DocumentTextIcon className="h-4 w-4 text-emerald-600" />
                                    <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                                        2. Pokok Permasalahan Hukum & Hasil Kajian Telaahan
                                    </h4>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">Perihal / Subjek Permohonan Telaahan</span>
                                        <p className="mt-1 font-semibold text-gray-900 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                                            {selectedTelaahanForDetail.perihal}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">Hasil Analisis & Abstraksi Yuridis</span>
                                        <p className="mt-1 text-gray-700 bg-blue-50/30 p-3 rounded-lg border border-blue-100 leading-relaxed font-normal">
                                            {selectedTelaahanForDetail.analisisHukum || 'Berdasarkan telaahan dokumen permohonan dan peraturan perundang-undangan terkait, telah disusun opsi tindak lanjut pembelaan serta penyusunan kontra-memori kasasi/PK untuk memitigasi potensi risiko keuangan negara.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Tim Penelaah & Administrasi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">PIC Penelaah & Kuasa</span>
                                    <div className="flex items-center space-x-3 pt-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                                            {selectedTelaahanForDetail.pic.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{selectedTelaahanForDetail.pic}</div>
                                            <div className="text-[10px] text-gray-500">Biro Advokasi / Tim Litigasi Kemenkeu</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">Dokumen Pendukung & Lampiran</span>
                                    <div className="flex items-center space-x-2 pt-1 text-blue-600 font-semibold">
                                        <DocumentTextIcon className="h-4 w-4 text-blue-500" />
                                        <span>{selectedTelaahanForDetail.dokumenCount || selectedTelaahanForDetail.dokumen || 1} Berkas Lampiran Tersimpan</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">
                                Terakhir diperbarui: {selectedTelaahanForDetail.tanggal}
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTelaahanForDetail(null)}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold text-xs transition"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedTelaahanForDetail(null);
                                        onNavigate('eAdvokasiTelaahanKasusHukum');
                                    }}
                                    className="px-4 py-2 bg-[#0055A5] hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition flex items-center space-x-1.5 shadow-2xs"
                                >
                                    <span>Buka Modul Telaahan</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail Audit Checklist Kelengkapan Data */}
            {selectedAuditRecordForModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                                    <CheckCircleIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-base">Checklist Audit Kelengkapan Data Pengisian</h3>
                                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                                            {selectedAuditRecordForModal.registerId}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 mt-0.5">
                                        Modul: {selectedAuditRecordForModal.modul} • Unit: {selectedAuditRecordForModal.unit}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedAuditRecordForModal(null)}
                                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 custom-scrollbar text-xs">
                            {/* Score Overview */}
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tingkat Completeness</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-2xl font-black text-gray-900">{selectedAuditRecordForModal.score}%</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            selectedAuditRecordForModal.status === 'Lengkap'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : selectedAuditRecordForModal.status === 'Perlu Dilengkapi'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-rose-100 text-rose-800'
                                        }`}>
                                            {selectedAuditRecordForModal.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-gray-700">
                                        <span className="font-bold text-emerald-600">{selectedAuditRecordForModal.filledFields}</span> terisi dari <span className="font-bold text-gray-900">{selectedAuditRecordForModal.totalFields}</span> total field
                                    </div>
                                    <div className="text-[11px] text-gray-500 mt-0.5">
                                        {selectedAuditRecordForModal.missingFields.length > 0 
                                            ? `${selectedAuditRecordForModal.missingFields.length} field wajib missing` 
                                            : 'Semua field mandatory telah terpenuhi'}
                                    </div>
                                </div>
                            </div>

                            {/* Missing Fields Alert Banner */}
                            {selectedAuditRecordForModal.missingFields.length > 0 && (
                                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
                                    <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs mb-2">
                                        <ExclamationIcon className="h-4 w-4 text-rose-600" />
                                        <span>Daftar Field Yang Missing / Wajib Dilengkapi Segera:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAuditRecordForModal.missingFields.map((f: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 bg-white text-rose-700 font-bold text-[11px] rounded-md border border-rose-300 shadow-2xs flex items-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5"></span>
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Detailed Checklist Table */}
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 mb-3 uppercase tracking-wide">
                                    Rincian Audit Seluruh Field Standar
                                </h4>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold text-[11px]">
                                            <tr>
                                                <th className="py-2.5 px-3 w-10 text-center">No</th>
                                                <th className="py-2.5 px-3">Nama Field Standar</th>
                                                <th className="py-2.5 px-3">Kategori</th>
                                                <th className="py-2.5 px-3 text-center">Status</th>
                                                <th className="py-2.5 px-3">Nilai / Isi Field Saat Ini</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedAuditRecordForModal.checklist.map((item: any, idx: number) => (
                                                <tr key={idx} className={item.isFilled ? 'hover:bg-gray-50/50' : 'bg-rose-50/40 hover:bg-rose-50/70'}>
                                                    <td className="py-2.5 px-3 text-center text-gray-400 font-mono text-[10px]">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="py-2.5 px-3 font-semibold text-gray-800">
                                                        {item.name}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-gray-500">
                                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">
                                                            {item.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        {item.isFilled ? (
                                                            <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                Terisi
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-300">
                                                                <ExclamationIcon className="h-3 w-3 mr-1" />
                                                                Missing
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3">
                                                        <span className={item.isFilled ? 'text-gray-700 font-normal' : 'text-rose-600 italic font-medium'}>
                                                            {item.value}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">
                                Subject: {selectedAuditRecordForModal.perihal}
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedAuditRecordForModal(null)}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold text-xs transition"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedAuditRecordForModal(null);
                                        onNavigate(selectedAuditRecordForModal.viewTarget);
                                    }}
                                    className="px-4 py-2 bg-[#0055A5] hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition flex items-center space-x-1.5 shadow-2xs"
                                >
                                    <span>Buka Modul & Lengkapi Data</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Monitoring;

interface StatCardProps {
    title: string;
    stats: {
        total: number;
        active: { count: number; trend: 'up' | 'down'; percent: number };
        selesai: { count: number; trend: 'up' | 'down'; percent: number };
    };
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, stats, icon, color }) => {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-lg border ${colorClasses[color]} shadow-sm`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1 tracking-tight">{stats.total}</h2>
                </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-50 mt-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Dalam Proses</span>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-800">{stats.active.count}</span>
                        <div className={`flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded ${stats.active.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {stats.active.trend === 'up' ? <TrendingUpIcon className="h-3 w-3 mr-1" /> : <TrendingDownIcon className="h-3 w-3 mr-1" />}
                            {stats.active.percent}%
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Selesai/Arsip</span>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-800">{stats.selesai.count}</span>
                        <div className={`flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded ${stats.selesai.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {stats.selesai.trend === 'up' ? <TrendingUpIcon className="h-3 w-3 mr-1" /> : <TrendingDownIcon className="h-3 w-3 mr-1" />}
                            {stats.selesai.percent}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
