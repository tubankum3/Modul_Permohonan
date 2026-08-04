export const renderStatistikPerkara = `
    const renderStatistikPerkara = () => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const years = ['2023', '2024', '2025', '2026'];

        const statistikData = [
            { kategori: 'Gugatan', sisaLalu: 425, masuk: 54, selesai: 65, sisa: 414 },
            { kategori: 'Permohonan', sisaLalu: 48, masuk: 44, selesai: 37, sisa: 55 },
            { kategori: 'Kepailitan', sisaLalu: 26, masuk: 3, selesai: 8, sisa: 21 },
            { kategori: 'Penundaan Kewajiban Pembayaran Utang', sisaLalu: 125, masuk: 23, selesai: 29, sisa: 119 },
            { kategori: 'Hak Kekayaan intelektual', sisaLalu: 69, masuk: 14, selesai: 12, sisa: 71 },
            { kategori: 'Pengadilan Hubungan Industrial', sisaLalu: 160, masuk: 40, selesai: 25, sisa: 175 },
            { kategori: 'Perlawanan/Bantahan (derden verzet)', sisaLalu: 25, masuk: 3, selesai: 3, sisa: 25 },
            { kategori: 'Gugatan Sederhana', sisaLalu: 1, masuk: 7, selesai: 1, sisa: 7 },
            { kategori: 'Permohonan Konsinyasi', sisaLalu: 0, masuk: 0, selesai: 0, sisa: 0 },
            { kategori: 'KPPU', sisaLalu: 48, masuk: 0, selesai: 0, sisa: 48 },
        ];

        return (
            <div className="space-y-6">
                <Breadcrumb currentView={currentView} onNavigate={onNavigate} />
                
                <div className="flex justify-between items-end bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Statistik Perkara</h2>
                        <p className="text-sm text-gray-500 mt-1">Laporan statistik penanganan perkara berdasarkan kategori.</p>
                    </div>
                    <div className="flex space-x-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-600">Periode:</span>
                            <div className="relative">
                                <select 
                                    value={selectedStatistikMonth}
                                    onChange={(e) => setSelectedStatistikMonth(e.target.value)}
                                    className="appearance-none border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                                >
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select 
                                    value={selectedStatistikYear}
                                    onChange={(e) => setSelectedStatistikYear(e.target.value)}
                                    className="appearance-none border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                                >
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
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
                                    <th scope="col" className="py-3 px-6 font-semibold">Kategori</th>
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
`;
