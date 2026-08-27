import re

with open('components/eadvo_Monitoring.tsx', 'r') as f:
    content = f.read()

# Add state
if 'const [activeAuditTab, setActiveAuditTab] = useState(\'Semua\');' not in content:
    content = content.replace(
        "const [auditSearchQuery, setAuditSearchQuery] = useState('');",
        "const [auditSearchQuery, setAuditSearchQuery] = useState('');\n    const [activeAuditTab, setActiveAuditTab] = useState('Semua');"
    )

old_audit = """    const renderAuditTrail = () => (
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
    );"""

new_audit = """    const renderAuditTrail = () => {
        const getMockAuditData = () => {
            return [
                { t: '25 Desember 2021 pukul 08.46.37', u: 'Admin System merekam Perkara dari Permohonan #11223344.' },
                { t: '12 November 2021 pukul 08.46.37', u: 'Joko (PIC) memperbarui Posisi Sidang Tk. Pertama.' },
                { t: '10 November 2021 pukul 14.20.10', u: 'Budi Santoso menambahkan dokumen Bukti P-1 pada Penanganan Perkara.' },
                { t: '05 November 2021 pukul 09.15.00', u: 'Rini Astuti mengunggah draft Putusan Akhir.' }
            ];
        };

        return (
            <div className="space-y-4">
                <Breadcrumb currentView={currentView} onNavigate={onNavigate} />
                <div className="flex justify-between items-baseline px-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Riwayat (Audit Trail)</h1>
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

                <div className="bg-white border-b border-gray-200 px-4 pt-2">
                    <nav className="flex space-x-6 overflow-x-auto custom-scrollbar">
                        {['Semua', 'Permohonan', 'Pendampingan', 'Penanganan Perkara', 'Penganganan Putusan'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveAuditTab(tab)}
                                className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                                    activeAuditTab === tab
                                        ? 'text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                                {activeAuditTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-md" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Uraian</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {getMockAuditData().map((log, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{log.t}</td>
                                    <td className="px-6 py-4 text-gray-800">{log.u}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };"""

content = content.replace(old_audit, new_audit)

with open('components/eadvo_Monitoring.tsx', 'w') as f:
    f.write(content)
print("Updated Audit Trail")
