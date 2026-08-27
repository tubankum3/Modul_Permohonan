import re

with open('components/eadvo_Laporan.tsx', 'r') as f:
    content = f.read()

# Replace the whole Filter Bar section
old_filter_bar = """<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
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
                    </div>"""

new_filter_bar = """<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {laporanType === 'periodik' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tahun</label>
                                        <select className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                            <option>2026</option>
                                            <option>2025</option>
                                            <option>2024</option>
                                        </select>
                                    </div>
                                    {periodikVariant === 'bulanan' && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Bulan</label>
                                            <select className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
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
                                            <select className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                                <option>Triwulan I</option>
                                                <option>Triwulan II</option>
                                                <option>Triwulan III</option>
                                                <option>Triwulan IV</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Jenis Laporan</label>
                                        <select className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                            <option>LPP</option>
                                            <option>LPP Aktif</option>
                                            <option>LPP Masuk</option>
                                            <option>LPP Selesai</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Jenis Perkara</label>
                                        <select className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2">
                                            <option value="">Semua</option>
                                            <option>Perdata</option>
                                            <option>TUN</option>
                                            <option>Pidana</option>
                                            <option>Lainnya</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pokok Perkara</label>
                                        <input type="text" placeholder="Semua..." className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Wilayah</label>
                                        <input type="text" placeholder="Semua..." className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pengadilan</label>
                                        <input type="text" placeholder="Semua..." className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Objek Tuntutan</label>
                                        <input type="text" placeholder="Semua..." className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3" />
                                    </div>
                                </>
                            )}
                            <div className="space-y-1 col-span-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Kriteria / Unit (Opsional)</label>
                                <input 
                                    type="text" 
                                    placeholder="Pilih unit atau klasifikasi..."
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 shadow-sm transition">
                                Terapkan Parameter
                            </button>
                        </div>
                    </div>"""

if old_filter_bar in content:
    content = content.replace(old_filter_bar, new_filter_bar)
    with open('components/eadvo_Laporan.tsx', 'w') as f:
        f.write(content)
    print("Replaced Filter Bar successfully")
else:
    print("Could not find the exact Filter Bar string")

