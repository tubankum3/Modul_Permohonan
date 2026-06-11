
import React, { useState } from 'react';
import { View } from '../types';
import { 
    SearchIcon, CalendarIcon, ShieldCheckIcon, UserGroupIcon, 
    DocumentTextIcon, InformationCircleIcon, ClockIcon, DesktopComputerIcon,
    DownloadIcon, PrintIcon, RefreshIcon, ChevronDownIcon, EyeIcon,
    TrendingUpIcon, TrendingDownIcon, ArchiveIcon
} from './icons';
import Breadcrumb from './Breadcrumb';
import { CariDokumen } from './eadvo_CariDokumen';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [auditSearchQuery, setAuditSearchQuery] = useState('');
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

    const menus = isPencarianView ? [
        { group: 'PENCARIAN DATA', items: [
            { icon: <SearchIcon className="h-4 w-4" />, name: 'Cari Perkara', view: 'eAdvokasiPencarianPerkara' as View },
            { icon: <SearchIcon className="h-4 w-4" />, name: 'Cari Pendampingan', view: 'eAdvokasiPencarianPendampingan' as View },
            { icon: <SearchIcon className="h-4 w-4" />, name: 'Cari Penanganan Putusan', view: 'eAdvokasiPencarianPutusan' as View },
            { icon: <SearchIcon className="h-4 w-4" />, name: 'Cari Dokumen', view: 'eAdvokasiPencarianDokumen' as View },
            { icon: <SearchIcon className="h-4 w-4" />, name: 'Bank Dalil', view: 'eAdvokasiPencarianBankDalil' as View },
        ]}
    ] : [
        { group: 'MONITORING', items: [
            { icon: <DesktopComputerIcon className="h-4 w-4" />, name: 'Dashboard', view: 'eAdvokasiDashboard' as View },
            { icon: <CalendarIcon className="h-4 w-4" />, name: 'Persidangan', view: 'eAdvokasiMonitoringPersidangan' as View },
            { icon: <DocumentTextIcon className="h-4 w-4" />, name: 'Putusan', view: 'eAdvokasiMonitoringPutusan' as View },
            { icon: <UserGroupIcon className="h-4 w-4" />, name: 'Pendampingan', view: 'eAdvokasiMonitoringPendampingan' as View },
            { icon: <ShieldCheckIcon className="h-4 w-4" />, name: 'Perkara', view: 'eAdvokasiMonitoringPerkara' as View },
            { icon: <InformationCircleIcon className="h-4 w-4" />, name: 'Risiko Hukum', view: 'eAdvokasiMonitoringRisikoHukum' as View },
            { icon: <ClockIcon className="h-4 w-4" />, name: 'Riwayat (Audit Trail)', view: 'eAdvokasiAuditTrail' as View },
        ]}
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

    const renderAuditTrail = () => (
        <div className="space-y-4">
            <Breadcrumb currentView={currentView} onNavigate={onNavigate} />
            <div className="flex justify-between items-baseline px-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Audit Trail</h1>
                    <p className="text-gray-500 text-sm mt-1">System integrity and activity logs.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="User / Activity search..."
                            value={auditSearchQuery}
                            onChange={(e) => setAuditSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Identity</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Network</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Events</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-mono text-[11px]">
                        {[
                            { t: '2026-05-19 10:15:32', u: 'ADMIN TUBAN KUM', a: 'STATUS_UPDATE: #PRK-2026-001', ip: '10.20.30.40', m: 'CASE_MGNT' },
                            { t: '2026-05-19 09:42:12', u: 'USER_CORE_01', a: 'LOGIN_SUCCESS: API_GATEWAY', ip: '192.168.1.102', m: 'AUTH' },
                            { t: '2026-05-18 16:20:05', u: 'DEDI_IRAWAN', a: 'DATA_SYNC: NADINE_TICKET_ND-2025', m: 'INBOX' },
                            { t: '2026-05-17 14:10:55', u: 'RINI_ASTUTI', a: 'CREATE_EVENT: COURT_SESSION', m: 'CALENDAR' },
                            { t: '2026-05-16 11:05:22', u: 'SYSTEM_ROOT', a: 'CONFIG_CHANGE: REF_UNIT_MGNT', m: 'ADMIN' }
                        ].map((log, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-4 text-gray-400">{log.t}</td>
                                <td className="px-8 py-4 font-black text-gray-900">{log.u}</td>
                                <td className="px-8 py-4 text-blue-700 font-bold">{log.a}</td>
                                <td className="px-8 py-4 text-gray-300 font-bold">{log.ip}</td>
                                <td className="px-8 py-4 text-right">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded-md text-[9px] font-black uppercase tracking-tighter">{log.m}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (currentView) {
            case 'eAdvokasiDashboard': return renderDashboard();
            case 'eAdvokasiPencarianPerkara': return renderSearchPage('Pencarian Penanganan Perkara', 'Cari berdasarkan Nomor Perkara, Nama Pihak, atau Unit...');
            case 'eAdvokasiPencarianPendampingan': return renderSearchPage('Pencarian Pendampingan', 'Cari berdasarkan Nomor Tiket, Subjek, atau Pemohon...');
            case 'eAdvokasiPencarianPutusan': return renderSearchPage('Pencarian Penanganan Putusan', 'Cari berdasarkan Nomor Putusan, Amar, atau Klasifikasi...');
            case 'eAdvokasiPencarianDokumen': return <CariDokumen currentView={currentView} onNavigate={onNavigate} />;
            case 'eAdvokasiPencarianBankDalil': return renderSearchPage('Bank Dalil', 'Cari dalil, yurisprudensi, atau referensi hukum...');
            case 'eAdvokasiMonitoringPersidangan': return renderMonitoringTable('Monitoring Persidangan', ['Jadwal Sidang', 'No. Perkara', 'Pengadilan', 'Agenda', 'Status']);
            case 'eAdvokasiMonitoringPutusan': return renderMonitoringTable('Monitoring Putusan', ['Tgl. Putusan', 'No. Putusan', 'Amar Putusan', 'Status BHT', 'Tindak Lanjut']);
            case 'eAdvokasiMonitoringPendampingan': return renderMonitoringTable('Monitoring Pendampingan', ['Tahun', 'Pihak Terkait', 'Pokok Permasalahan', 'Progress', 'Posisi']);
            case 'eAdvokasiMonitoringPerkara': return renderMonitoringTable('Monitoring Perkara', ['No. Perkara', 'Klasifikasi', 'Nilai Tuntutan', 'Tahapan', 'Probabilitas']);
            case 'eAdvokasiMonitoringRisikoHukum': return renderMonitoringTable('Monitoring Risiko Hukum', ['Objek Risiko', 'Tingkat Risiko', 'Potensi Kerugian', 'Mitigasi', 'Update Terakhir']);
            case 'eAdvokasiAuditTrail': return renderAuditTrail();
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
                
                <nav className="flex-1 overflow-y-auto p-4 space-y-6 mt-2 custom-scrollbar">
                    {menus.map((group) => (
                        <div key={group.group}>
                            <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{group.group}</h3>
                            <ul className="space-y-1">
                                {group.items.map((item) => (
                                    <li key={item.view}>
                                        <button
                                            onClick={() => onNavigate(item.view)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 text-left text-sm ${
                                                currentView === item.view 
                                                ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className={`${currentView === item.view ? 'text-blue-700' : 'text-gray-400'}`}>
                                                {item.icon}
                                            </div>
                                            <span>{item.name}</span>
                                        </button>
                                    </li>
                                ))}
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
