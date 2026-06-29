
import React, { useMemo, useState, useEffect } from 'react';
import {
    DesktopComputerIcon,
    CursorClickIcon,
    DocumentAddIcon,
    SendIcon,
    ShieldCheckIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    BriefcaseIcon,
    UserGroupIcon,
    DocumentTextIcon,
    ArchiveIcon,
    SearchIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from './icons';
import { BerandaContent, Permohonan, PendampinganRecord, PerkaraRecord, StatusPermohonan, StatusPendampingan, StatusPerkara, StatusPutusan, View } from '../types';
import { useAdvokasiStore } from '../useAdvokasiStore';
import Breadcrumb from './Breadcrumb';
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

interface BerandaPageProps {
  content?: BerandaContent;
  isDashboard?: boolean;
  permohonanList?: Permohonan[];
  pendampinganRecords?: PendampinganRecord[];
  perkaraRecords?: PerkaraRecord[];
  putusanRecords?: PerkaraRecord[];
  onNavigate?: (view: View) => void;
}

const flowIcons = [
    <DesktopComputerIcon className="h-10 w-10 text-blue-600" />,
    <CursorClickIcon className="h-10 w-10 text-blue-600" />,
    <DocumentAddIcon className="h-10 w-10 text-blue-600" />,
    <SendIcon className="h-10 w-10 text-blue-600" />,
    <ShieldCheckIcon className="h-10 w-10 text-blue-600" />,
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const BerandaPage: React.FC<BerandaPageProps> = ({ 
    content, 
    isDashboard = false,
    permohonanList = [],
    pendampinganRecords = [],
    perkaraRecords = [],
    putusanRecords = [],
    onNavigate
}) => {
    const userName = useAdvokasiStore(state => state.userName);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    
    const carouselImages = content?.carouselImages || [
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200", // law theme
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200", // law theme 2
        "https://images.unsplash.com/photo-1505664173622-b8146bf78162?auto=format&fit=crop&q=80&w=1200", // law theme 3
        "/alur_permohonan.jpg" // flow image
    ];

    useEffect(() => {
        if (!isDashboard) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [isDashboard, carouselImages.length]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onNavigate) {
            // Trigger navigation if needed, or we could handle search in the current view
            onNavigate('eAdvokasiPencarianPerkara');
        }
    };
    
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastYear = lastMonthDate.getFullYear();

        const parseDate = (dateStr?: string) => {
            if (!dateStr) return null;
            const parts = dateStr.split('/');
            if (parts.length !== 3) return null;
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        };

        const calculateCategoryStats = (list: any[], statusActive: any, statusSelesai: any, statusKey: string) => {
            const total = list.length;
            
            const currentMonthActive = list.filter(item => {
                const date = parseDate(item.tanggal);
                return item[statusKey] === statusActive && date && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length;

            const currentMonthSelesai = list.filter(item => {
                const date = parseDate(item.tanggal);
                return item[statusKey] === statusSelesai && date && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length;

            const lastMonthActive = list.filter(item => {
                const date = parseDate(item.tanggal);
                return item[statusKey] === statusActive && date && date.getMonth() === lastMonth && date.getFullYear() === lastYear;
            }).length;

            const lastMonthSelesai = list.filter(item => {
                const date = parseDate(item.tanggal);
                return item[statusKey] === statusSelesai && date && date.getMonth() === lastMonth && date.getFullYear() === lastYear;
            }).length;

            const activeTrend: 'up' | 'down' = currentMonthActive >= lastMonthActive ? 'up' : 'down';
            const activePercent = lastMonthActive === 0 ? 100 : Math.abs(Math.round(((currentMonthActive - lastMonthActive) / (lastMonthActive || 1)) * 100)) || 0;
            
            const selesaiTrend: 'up' | 'down' = currentMonthSelesai >= lastMonthSelesai ? 'up' : 'down';
            const selesaiPercent = lastMonthSelesai === 0 ? 100 : Math.abs(Math.round(((currentMonthSelesai - lastMonthSelesai) / (lastMonthSelesai || 1)) * 100)) || 0;

            return {
                total,
                active: { count: currentMonthActive, trend: activeTrend, percent: activePercent },
                selesai: { count: currentMonthSelesai, trend: selesaiTrend, percent: selesaiPercent }
            };
        };

        return {
            permohonan: calculateCategoryStats(permohonanList, StatusPermohonan.DIPROSES, StatusPermohonan.SELESAI, 'status'),
            pendampingan: calculateCategoryStats(pendampinganRecords, StatusPendampingan.AKTIF, StatusPendampingan.SELESAI, 'statusPendampingan'),
            perkara: calculateCategoryStats(perkaraRecords, StatusPerkara.AKTIF, StatusPerkara.SELESAI, 'statusPerkara'),
            putusan: calculateCategoryStats(putusanRecords, StatusPutusan.AKTIF, StatusPutusan.SELESAI, 'statusPutusan'),
        };
    }, [permohonanList, pendampinganRecords, perkaraRecords, putusanRecords]);

    const chartData = [
        { name: 'Permohonan', Total: stats.permohonan.total, Aktif: stats.permohonan.active.count, Selesai: stats.permohonan.selesai.count },
        { name: 'Pendampingan', Total: stats.pendampingan.total, Aktif: stats.pendampingan.active.count, Selesai: stats.pendampingan.selesai.count },
        { name: 'Perkara', Total: stats.perkara.total, Aktif: stats.perkara.active.count, Selesai: stats.perkara.selesai.count },
        { name: 'Putusan', Total: stats.putusan.total, Aktif: stats.putusan.active.count, Selesai: stats.putusan.selesai.count },
    ];

    const pieData = [
        { name: 'Permohonan', value: stats.permohonan.total },
        { name: 'Pendampingan', value: stats.pendampingan.total },
        { name: 'Perkara', value: stats.perkara.total },
        { name: 'Putusan', value: stats.putusan.total },
    ];

    if (isDashboard) {
        return (
            <div className="p-8 bg-gray-50 h-full overflow-y-auto space-y-4">
                {onNavigate && <Breadcrumb currentView="eAdvokasiBeranda" onNavigate={onNavigate} />}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Statistik</h1>
                    <p className="text-gray-600 mt-1">Ringkasan aktivitas bantuan hukum E-Advokasi.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Permohonan Module" 
                        stats={stats.permohonan} 
                        icon={<ArchiveIcon className="h-6 w-6 text-blue-600" />}
                        color="blue"
                    />
                    <StatCard 
                        title="Pendampingan" 
                        stats={stats.pendampingan} 
                        icon={<UserGroupIcon className="h-6 w-6 text-green-600" />}
                        color="green"
                    />
                    <StatCard 
                        title="Penanganan Perkara" 
                        stats={stats.perkara} 
                        icon={<ShieldCheckIcon className="h-6 w-6 text-amber-600" />}
                        color="amber"
                    />
                    <StatCard 
                        title="Penanganan Putusan" 
                        stats={stats.putusan} 
                        icon={<DocumentTextIcon className="h-6 w-6 text-purple-600" />}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 font-sans">Aktivitas Bulan Ini</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} stroke="#6B7280" />
                                    <YAxis fontSize={12} stroke="#6B7280" />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="Aktif" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Selesai" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 font-sans">Komposisi Kasus Total</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!content) return null;

    return (
        <div className="p-0 bg-gray-50 h-full overflow-y-auto">
            <style>{`
                .rich-text-content h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; color: #1F2937; }
                .rich-text-content h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; color: #1F2937; }
                .rich-text-content h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; color: #1F2937; }
                .rich-text-content ul { list-style-type: disc; margin-left: 1.5em; margin-bottom: 1em; }
                .rich-text-content ol { list-style-type: decimal; margin-left: 1.5em; margin-bottom: 1em; }
                .rich-text-content li { margin-bottom: 0.25em; }
                .rich-text-content p { margin-bottom: 1em; }
                .rich-text-content a { color: #2563EB; text-decoration: underline; font-weight: 500; }
                .rich-text-content a:hover { color: #1D4ED8; }
                .rich-text-content table { border-collapse: collapse; width: 100%; margin-bottom: 1.5em; border-radius: 0.5rem; overflow: hidden; }
                .rich-text-content th, .rich-text-content td { border: 1px solid #E5E7EB; padding: 0.75em 1em; text-align: left; }
                .rich-text-content th { background-color: #F8FAFC; font-weight: 600; color: #334155; }
            `}</style>
            
            {/* Page Header Greeting */}
            <div className="bg-white py-6 px-8 shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {content.pageTitle.includes('[User]') 
                            ? content.pageTitle.replace('[User]', userName) 
                            : content.pageTitle}
                    </h1>
                </div>
            </div>

            {/* Hero Section with Carousel */}
            <div className="relative w-full h-[400px] overflow-hidden bg-gray-900">
                {carouselImages.map((img, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover opacity-60" />
                    </div>
                ))}
                
                {/* Carousel Controls */}
                <button 
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition z-10"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition z-10"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>

                {/* Hero Content Overlay (Removed pageTitle as requested to put it as header above carousel) */}
            </div>

            {/* Main Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                
                {/* Search Bar */}
                <div className="flex justify-center -mt-20 relative z-20 mb-8">
                    <div className="w-full max-w-3xl bg-white p-2 rounded-xl shadow-xl border border-gray-100 flex items-center">
                        <div className="pl-4 text-gray-400">
                            <SearchIcon className="w-6 h-6" />
                        </div>
                        <form onSubmit={handleSearch} className="flex-1 flex">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari Perkara (Nomor Perkara, Nama Pihak, Unit)..."
                                className="w-full pl-3 pr-4 py-4 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-lg outline-none"
                            />
                            <button 
                                type="submit"
                                className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                            >
                                Cari
                            </button>
                        </form>
                    </div>
                </div>

                {/* Description & Quick Links Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left side: Text Box */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{content.eAdvokasiTitle}</h3>
                        {content.eAdvokasiHtml ? (
                            <div 
                                className="text-gray-600 leading-relaxed text-lg text-left rich-text-content"
                                dangerouslySetInnerHTML={{ __html: content.eAdvokasiHtml }}
                            />
                        ) : (
                            <>
                                <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                                    {content.eAdvokasiParagraph1}
                                </p>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {content.eAdvokasiParagraph2}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Right side: Quick Links Box */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100 flex items-center">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full mr-2.5"></span>
                            Tautan Cepat
                        </h3>
                        <div className="space-y-3">
                            {(content.quickLinks || []).map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition group border border-gray-100/80 hover:border-blue-100 text-sm md:text-base"
                                >
                                    <span className="truncate pr-2">{link.title || 'Tautan'}</span>
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                                </a>
                            ))}
                            {(!content.quickLinks || content.quickLinks.length === 0) && (
                                <p className="text-sm text-gray-500 italic py-4 text-center">Belum ada tautan cepat.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        amber: 'bg-amber-50 text-amber-700',
        purple: 'bg-purple-50 text-purple-700'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</h2>
                </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Sedang Ditangani</span>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-800">{stats.active.count}</span>
                        <div className={`flex items-center text-[10px] px-1.5 py-0.5 rounded-full ${stats.active.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {stats.active.trend === 'up' ? <TrendingUpIcon className="h-3 w-3 mr-1" /> : <TrendingDownIcon className="h-3 w-3 mr-1" />}
                            {stats.active.percent}%
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Selesai</span>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-800">{stats.selesai.count}</span>
                        <div className={`flex items-center text-[10px] px-1.5 py-0.5 rounded-full ${stats.selesai.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {stats.selesai.trend === 'up' ? <TrendingUpIcon className="h-3 w-3 mr-1" /> : <TrendingDownIcon className="h-3 w-3 mr-1" />}
                            {stats.selesai.percent}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BerandaPage;
