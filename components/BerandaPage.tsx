
import React, { useMemo } from 'react';
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
    ArchiveIcon
} from './icons';
import { BerandaContent, Permohonan, PendampinganRecord, PerkaraRecord, StatusPermohonan, StatusPendampingan, StatusPerkara, StatusPutusan } from '../types';
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
    putusanRecords = []
}) => {
    
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
            const activePercent = lastMonthActive === 0 ? 100 : Math.abs(Math.round(((currentMonthActive - lastMonthActive) / lastMonthActive) * 100));
            
            const selesaiTrend: 'up' | 'down' = currentMonthSelesai >= lastMonthSelesai ? 'up' : 'down';
            const selesaiPercent = lastMonthSelesai === 0 ? 100 : Math.abs(Math.round(((currentMonthSelesai - lastMonthSelesai) / lastMonthSelesai) * 100));

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
            <div className="p-8 bg-gray-50 h-full overflow-y-auto space-y-8">
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
        <div className="p-8 bg-gray-100 h-full overflow-y-auto">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
                <h1 className="text-2xl font-bold text-blue-800">{content.pageTitle}</h1>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md relative">
                <div className="flex items-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{content.flowTitle}</h2>
                </div>

                <div className="relative">
                    <div className="flex flex-col md:flex-row items-start justify-center md:space-x-4 space-y-8 md:space-y-0">
                         {content.flowSteps.map((item, index) => (
                             <div key={item.step} className="relative w-full md:w-1/5 flex flex-col items-center text-center px-2">
                                <div className="relative mb-4">
                                    <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full shadow-inner">
                                        {flowIcons[index % flowIcons.length]}
                                    </div>
                                    <div className="absolute -top-1 -right-1 flex items-center justify-center w-8 h-8 bg-[#0055A5] text-white font-bold text-lg rounded-full border-2 border-white">
                                        {item.step}
                                    </div>

                                </div>
                                <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
                                <p className="mt-1 text-xs text-gray-600 h-16">{item.description}</p>
                                {index < content.flowSteps.length - 1 && (
                                     <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{content.eAdvokasiTitle}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        {content.eAdvokasiParagraph1}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        {content.eAdvokasiParagraph2}
                    </p>
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
