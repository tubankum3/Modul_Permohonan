import React, { useState, useEffect } from 'react';
import { 
    SearchIcon, DocumentTextIcon, DownloadIcon, EyeIcon, 
    RefreshIcon, CheckCircleIcon, InformationCircleIcon, ChevronDownIcon
} from './icons';
import { motion, AnimatePresence } from 'motion/react';

// Define structure of our mock database document
interface SemanticDoc {
    id: string;
    type: 'yurisprudensi' | 'regulasi' | 'brief';
    nomor: string;
    judul: string;
    kategori: string;
    tanggal: string;
    ringkasan: string;
    kontenLengkap: string;
    keywords: string[];
    indexColumns: string[];
    citation?: string;
    instansiPenerbit?: string;
}

const mockDocDatabase: SemanticDoc[] = [
    {
        id: 'YUR-2022-124',
        type: 'yurisprudensi',
        nomor: 'Putusan MA No. 124 K/TUN/2022',
        judul: 'Sengketa Pemberhentian Tidak Dengan Hormat Pegawai Negeri Sipil di Direktorat Jenderal Pajak',
        kategori: 'Kepegawaian / Tata Usaha Negara (TUN)',
        tanggal: '18 Maret 2022',
        ringkasan: 'Mahkamah Agung menegaskan bahwa kewenangan melakukan Pemberhentian Tidak Dengan Hormat (PTDH) akibat tindak pidana korupsi berada pada Pejabat Pembina Kepegawaian (PPK) secara mutlak sepanjang putusan pidana telah berkekuatan hukum tetap (Inkracht). Diskresi pimpinan instansi dibatasi oleh asas penegakan hukum prima.',
        keywords: ['pemberhentian', 'direktorat jenderal pajak', 'tun', 'inkracht', 'pegawai negeri sipil', 'korupsi'],
        indexColumns: ['Judul', 'Ringkasan', 'Kategori'],
        citation: 'MA JUR-2022-TUN-124',
        instansiPenerbit: 'Mahkamah Agung RI',
        kontenLengkap: `DUDUK PERKARA:
Bahwa Penggugat mengajukan gugatan terhadap Keputusan Direktur Jenderal Pajak atas nama Menteri Keuangan mengenai Pemberhentian Tidak Dengan Hormat sebagai Pegawai Negeri Sipil. Penggugat sebelumnya dijatuhi hukuman pidana penjara berdasarkan putusan Pengadilan Tindak Pidana Korupsi yang telah berkekuatan hukum tetap selama 1 (satu) tahun 6 (enam) bulan.

PERTIMBANGAN HUKUM:
1. Bahwa ketentuan Pasal 87 ayat (4) huruf b Undang-Undang Nomor 5 Tahun 2014 tentang Aparatur Sipil Negara secara eksplisit menyatakan PNS diberhentikan tidak dengan hormat karena dihukum penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap karena melakukan tindak pidana kejahatan jabatan atau tindak pidana kejahatan yang ada hubungannya dengan jabatan.
2. Bahwa sengketa kepegawaian yang diajukan Penggugat tidak beralasan hukum karena keputusan Tergugat menerbitkan SK Pemberhentian merupakan kewajiban hukum yang bersifat terikat (gebonden beschikking) dan bukan merupakan pilihan diskresi bebas.

AMAR PUTUSAN:
Mengadili, Menolak permohonan kasasi dari Pemohon Kasasi dahulu Penggugat; Menghukum Pemohon Kasasi untuk membayar biaya perkara dalam tingkat kasasi.`
    },
    {
        id: 'YUR-2023-089',
        type: 'yurisprudensi',
        nomor: 'Putusan MA No. 89 PK/Pdt/2023',
        judul: 'Sengketa Gugatan Ganti Rugi Atas Aset Tanah dan Bangunan Milik Kementerian Keuangan di Lapangan Banteng',
        kategori: 'Hukum Perdata / Sengketa Aset Negara',
        tanggal: '14 September 2023',
        ringkasan: 'Dalam Peninjauan Kembali, MA memutuskan bahwa sertifikat hak pakai atas nama Departemen Keuangan RI (kini Kementerian Keuangan) merupakan bukti otentik kepemilikan aset negara yang sah dan tidak dapat ditumpangi oleh klaim eigendom verponding yang tidak dikonversi sesuai UU Pokok Agraria.',
        keywords: ['aset negara', 'ganti rugi', 'lapangan banteng', 'sertifikat hak pakai', 'perdata', 'eigendom verponding'],
        indexColumns: ['Judul', 'Ringkasan', 'Keywords'],
        citation: 'MA JUR-2023-PDT-89',
        instansiPenerbit: 'Mahkamah Agung RI',
        kontenLengkap: `DUDUK PERKARA:
Bahwa Para Penggugat mengklaim sebidang tanah seluas 12.400 m2 di kawasan Lapangan Banteng, Jakarta Pusat, berdasarkan bukti kepemilikan jaman kolonial Eigendom Verponding No. 4912. Tergugat (Kementerian Keuangan) telah menduduki dan menggunakan tanah tersebut sebagai komplek perkantoran berdasarkan Sertifikat Hak Pakai No. 12/Pasar Baru yang diterbitkan sejak tahun 1982.

PERTIMBANGAN HUKUM:
1. Bahwa tanah yang telah dikuasai secara terus-menerus oleh lembaga negara dan digunakan untuk pelayanan publik publik, serta telah bersertifikat Hak Pakai atas nama Pemerintah RI c.q. Departemen Keuangan, diklasifikasikan sebagai Barang Milik Negara (BMN) yang dilindungi oleh Undang-Undang Perbendaharaan Negara.
2. Bahwa hak lama sejenis Eigendom Verponding wajib dikonversikan paling lambat 20 tahun sejak berlakunya UU No. 5 Tahun 1960 tentang Peraturan Dasar Pokok-Pokok Agraria (UUPA). Kelalaian melakukan konversi mengakibatkan hak tersebut hapus demi hukum dan tanahnya jatuh kembali menjadi tanah negara bebas.

AMAR PUTUSAN:
Mengabulkan permohonan Peninjauan Kembali dari Pemohon Peninjauan Kembali (Kementerian Keuangan RI); Membatalkan Putusan Mahkamah Agung tingkat Kasasi; Mengadili Sendiri: Menolak gugatan Para Penggugat untuk seluruhnya.`
    },
    {
        id: 'REG-2021-120',
        type: 'regulasi',
        nomor: 'PMK No. 120/PMK.01/2021',
        judul: 'Pedoman Pemberian Bantuan Hukum di Lingkungan Kementerian Keuangan',
        kategori: 'Peraturan Menteri Keuangan (PMK)',
        tanggal: '1 September 2021',
        ringkasan: 'Mengatur mengenai tata cara, syarat, ruang lingkup, hak, serta kewajiban dalam penyediaan advokasi dan bantuan hukum bagi satuan kerja, pejabat, pegawai, maupun pensiunan Kementerian Keuangan yang menghadapi permasalahan hukum dalam melaksanakan tugas jabatan.',
        keywords: ['pedoman', 'bantuan hukum', 'advokasi', 'pendampingan', 'pensiunan', 'tugas jabatan'],
        indexColumns: ['Judul', 'Ringkasan', 'Keywords'],
        citation: 'Menteri Keuangan RI Regulasi',
        instansiPenerbit: 'Kementerian Keuangan RI',
        kontenLengkap: `RUANG LINGKUP BANTUAN HUKUM:
Bantuan Hukum diberikan kepada:
a. Kementerian Keuangan sebagai institusi.
b. Pejabat dan pegawai di lingkungan Kementerian Keuangan yang menghadapi masalah hukum atau tuntutan hukum sehubungan dengan pelaksanaan tugas.
c. Mantan pejabat/pegawai atau pensiunan sepanjang tindakan hukum yang dipermasalahkan terjadi saat yang bersangkutan masih aktif menjabat.

JENIS ADVOKASI HUKUM:
1. Perkara Perdata: Pendampingan dari tingkat pertama, banding, kasasi, hingga peninjauan kembali, termasuk eksekusi putusan.
2. Perkara Tata Usaha Negara (TUN): Mewakili dalam gugatan pembatalan KTUN Kemenkeu di PTUN.
3. Perkara Pidana: Pendampingan sebagai Saksi, Ahli, maupun pendampingan pada tahap penyidikan/penuntutan bagi tersangka (sepanjang tidak ada benturan kepentingan dengan keuangan negara).
4. Uji Materiil: Penyusunan keterangan pemerintah dalam sidang Mahkamah Konstitusi.`
    },
    {
        id: 'REG-2003-017',
        type: 'regulasi',
        nomor: 'Undang-Undang No. 17 Tahun 2003',
        judul: 'Undang-Undang Tentang Keuangan Negara',
        kategori: 'Undang-Undang (UU)',
        tanggal: '5 April 2003',
        ringkasan: 'Undang-Undang pilar pengelolaan fiskal yang menetapkan asas-asas umum pengelolaan keuangan negara secara tertib, taat pada peraturan perundang-undangan, efisien, ekonomis, efektif, transparan, dan bertanggung jawab dengan memperhatikan rasa keadilan dan kepatutan.',
        keywords: ['keuangan negara', 'fiskal', 'apbn', 'pengelolaan', 'perbendaharaan', 'tanggung jawab'],
        indexColumns: ['Judul', 'Ringkasan', 'Kategori'],
        citation: 'UU No. 17 Tahun 2003',
        instansiPenerbit: 'Dewan Perwakilan Rakyat & Presiden RI',
        kontenLengkap: `KETENTUAN UMUM:
Keuangan Negara adalah semua hak dan kewajiban negara yang dapat dinilai dengan uang, serta segala sesuatu baik berupa uang maupun berupa barang yang dapat dijadikan milik negara berhubung dengan pelaksanaan hak dan kewajiban tersebut.

ASAS-ASAS UMUM PENGELOLAAN:
Keuangan Negara dikelola secara tertib, taat pada peraturan perundang-undangan, efisien, ekonomis, efektif, transparan, dan bertanggung jawab dengan memperhatikan rasa keadilan dan kepatutan.

KEKUASAAN ATAS PENGELOLAAN:
1. Presiden memegang kekuasaan umum pengelolaan keuangan negara sebagai bagian dari kekuasaan pemerintahan.
2. Menteri Keuangan selaku pengelola fiskal dan Wakil Pemerintah dalam kepemilikan kekayaan negara yang dipisahkan.
3. Menteri/Pimpinan Lembaga selaku Pengguna Anggaran/Pengguna Barang kementerian negara/lembaga yang dipimpinnya.`
    },
    {
        id: 'BRF-2026-001',
        type: 'brief',
        nomor: 'Legal Brief LBO-2026-001',
        judul: 'Ringkasan Hukum dan Analisis Risiko Permohonan Eksekusi Aset Lapangan Banteng',
        kategori: 'Internal Legal Brief / Brief Kasus',
        tanggal: '10 Mei 2026',
        ringkasan: 'Ringkasan eksekutif pasca keluarnya putusan PK No. 89 PK/Pdt/2023. Membahas rencana tindak banding balik dan koordinasi sertifikasi mitigasi fisik dengan instansi BPN Daerah Khusus Jakarta, serta estimasi dampak keuangan negara sebesar IDR 450 Miliar jika sertifikasi terhambat.',
        keywords: ['mitigasi', 'eksekusi', 'lapangan banteng', 'risiko', 'bpn', 'analisis hukum'],
        indexColumns: ['Judul', 'Ringkasan', 'Keywords'],
        citation: 'Internal Kemenkeu BH-01',
        instansiPenerbit: 'Biro Advokasi Sekretariat Jenderal',
        kontenLengkap: `RISIKO HUKUM:
Meskipun Kementerian Keuangan memenangkan peninjauan kembali (PK) atas kepemilikan tanah Lapangan Banteng, pihak eksternal masih mencoba melakukan provokasi lapangan dan mengajukan gugatan perlawanan pihak ketiga (Derden Verzet). 

TINDAK LANJUT STRATEGIS (MITIGASI):
1. Mengamankan penguasaan fisik tanah dengan memasang patok, papan pengumuman kepemilikan aset Kementerian Keuangan RI, dan menempatkan personel keamanan internal.
2. Mempercepat integrasi sistem pendaftaran Barang Milik Negara (BMN) Kemenkeu ke sistem pertanahan elektronik nasional (BPN) guna mengunci potensi klaim sertifikat ganda.
3. Memersiapkan draf jawaban komprehensif atas gugatan Derden Verzet apabila didaftarkan resmi di PN Jakarta Pusat.`
    },
    {
        id: 'BRF-2025-012',
        type: 'brief',
        nomor: 'Legal Brief DJBC-2025-012',
        judul: 'Telaahan Hukum Tanggapan Gugatan Pembatasan Ekspor Mineral Mentah DJBC',
        kategori: 'Internal Legal Brief / Brief Kasus',
        tanggal: '22 November 2025',
        ringkasan: 'Telaahan hukum mengenai gugatan perusahaan tambang terhadap pembatasan pengapalan ekspor bijih nikel yang diberlakukan Kantor Wilayah Bea Cukai. Mengurai argumen kedaulatan ekonomi negara dan konsistensi dengan aturan GATT WTO.',
        keywords: ['ekspor', 'mineral', 'bea cukai', 'gugatan', 'nickel', 'gatt', 'wto'],
        indexColumns: ['Judul', 'Ringkasan', 'Kategori'],
        citation: 'Internal DJBC BH-12',
        instansiPenerbit: 'Kasi Hukum Kanwil Bea Cukai',
        kontenLengkap: `LATAR BELAKANG:
Gugatan diajukan oleh PT Minerba Jaya Sentosa di PTUN terkait keputusan penolakan pelayanan ekspor (PEB) atas komoditas konsentrat mineral tambang mentah. Bea Cukai mendasarkan keputusan pada PMK yang melarang pengapalan bahan mentah yang belum dihilirisasi sesuai UU Minerba.

ANALISIS HUKUM:
1. Tindakan penolakan pelayanan ekspor merupakan tindakan hukum administrasi yang sah berdasarkan kewenangan pengawasan kepabeanan ekspor dalam UU Kepabeanan.
2. Aturan GATT Article XX (Generals Exceptions) membolehkan anggota WTO membatasi ekspor komoditas guna melindungi sumber daya alam yang dapat habis, sehingga argumen Penggugat mengenai pelanggaran perdagangan bebas internasional dinilai tidak relevan.`
    }
];

export const CariDokumen: React.FC<{ currentView: string; onNavigate: (view: any) => void }> = ({ currentView, onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [predicateMode, setPredicateMode] = useState<'CONTAINS' | 'FREETEXT' | 'HYBRID'>('HYBRID');
    const [docTypeFilter, setDocTypeFilter] = useState<'all' | 'yurisprudensi' | 'regulasi' | 'brief'>('all');
    const [threshold, setThreshold] = useState<number>(0.4);
    
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionMetric, setExecutionMetric] = useState<{
        latency: string;
        scanType: string;
        rowsEvaluated: number;
        cost: string;
    } | null>(null);

    const [searchResults, setSearchResults] = useState<{ doc: SemanticDoc; score: number }[]>([]);
    const [viewedDoc, setViewedDoc] = useState<SemanticDoc | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Predefined chips that users can click to search instantly
    const suggestedSearches = [
        "Sengketa Aset Lapangan Banteng",
        "Pemberhentian PNS Ditjen Pajak",
        "Bantuan Hukum Pejabat Kemenkeu",
        "Ekspor Mineral Mentah Bea Cukai",
        "Undang-Undang Keuangan Negara"
    ];

    const executeTsqlSearch = (query: string) => {
        if (!query.trim()) return;
        setIsExecuting(true);
        setHasSearched(true);

        setTimeout(() => {
            const results: { doc: SemanticDoc; score: number }[] = [];
            const lowQuery = query.toLowerCase();

            // Simulate parsing with CONTAINS vs FREETEXT logic
            mockDocDatabase.forEach(doc => {
                let matchScore = 0;
                
                // If filter type doesn't match, skip
                if (docTypeFilter !== 'all' && doc.type !== docTypeFilter) return;

                // CONTAINS algorithm: requires near exact keyword matching on indexed columns
                if (predicateMode === 'CONTAINS') {
                    doc.keywords.forEach(kw => {
                        if (lowQuery.includes(kw.toLowerCase())) {
                            matchScore += 0.35;
                        }
                    });
                    if (doc.nomor.toLowerCase().includes(lowQuery) || doc.judul.toLowerCase().includes(lowQuery)) {
                        matchScore += 0.5;
                    }
                } 
                // FREETEXT algorithm: matches synonyms, words in text, context expanders (more matches, broader, softer weights)
                else if (predicateMode === 'FREETEXT') {
                    const docText = `${doc.judul} ${doc.ringkasan} ${doc.kategori} ${doc.kontenLengkap}`.toLowerCase();
                    const words = lowQuery.split(/\s+/).filter(w => w.length > 2);
                    
                    let hits = 0;
                    words.forEach(word => {
                        if (docText.includes(word)) {
                            hits++;
                        }
                    });
                    
                    if (hits > 0) {
                        matchScore = Math.min(0.98, 0.2 + (hits * 0.15));
                    }
                } 
                // HYBRID combines both, applying custom SQL weights
                else {
                    doc.keywords.forEach(kw => {
                        if (lowQuery.includes(kw.toLowerCase())) {
                            matchScore += 0.25;
                        }
                    });
                    const docText = `${doc.judul} ${doc.ringkasan} ${doc.kontenLengkap}`.toLowerCase();
                    const words = lowQuery.split(/\s+/).filter(w => w.length > 2);
                    words.forEach(word => {
                        if (docText.includes(word)) {
                            matchScore += 0.12;
                        }
                    });
                    if (doc.nomor.toLowerCase().includes(lowQuery)) {
                        matchScore += 0.4;
                    }
                }

                // Bound score to 0.0 - 1.0 (with slight randomization for ultra realism)
                if (matchScore > 0) {
                    const finalScore = Math.min(1.0, Math.max(0.1, matchScore + (Math.random() * 0.05)));
                    if (finalScore >= threshold) {
                        results.push({ doc, score: parseFloat(finalScore.toFixed(3)) });
                    }
                }
            });

            // Sort results by score descending
            results.sort((a, b) => b.score - a.score);
            setSearchResults(results);

            // Set execution performance mock indicators based on query and results
            const simulatedLatency = (10 + Math.random() * 15).toFixed(3);
            const indexUsed = docTypeFilter === 'all' 
                ? 'FT_Index_Omni_Scan' 
                : docTypeFilter === 'yurisprudensi' 
                    ? 'FT_Index_Yurisprudensi_Seek' 
                    : docTypeFilter === 'regulasi' 
                        ? 'FT_Index_Regulasi_Seek' 
                        : 'FT_Index_LegalBriefs_Seek';

            setExecutionMetric({
                latency: `${simulatedLatency} ms`,
                scanType: indexUsed,
                rowsEvaluated: mockDocDatabase.length,
                cost: `${(0.01 + Math.random() * 0.03).toFixed(3)}%`
            });
            setIsExecuting(false);
        }, 600);
    };

    const handleChipClick = (term: string) => {
        setSearchQuery(term);
        executeTsqlSearch(term);
    };


    return (
        <div className="space-y-6">
            {/* Top Title Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center space-x-2">
                        <span className="bg-blue-600 text-white p-2 rounded-xl text-lg shadow-sm">🔎</span>
                        <span>Semantic Search</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1.5">
                        Pencarian berbasis indeks kata kunci dan perluasan bahasa alamiah pada berkas Putusan, Regulasi, dan Dokumen Litigasi.
                    </p>
                </div>
            </div>

            {/* main Search Control Console */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                
                {/* Mode Selector Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
                    <button
                        type="button"
                        onClick={() => setPredicateMode('HYBRID')}
                        className={`p-4 rounded-xl text-left border transition-all ${
                            predicateMode === 'HYBRID' 
                                ? 'bg-blue-50/60 border-blue-500 shadow-sm ring-1 ring-blue-500' 
                                : 'bg-white border-gray-150 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black tracking-wider uppercase text-blue-800">Hybrid Search</span>
                            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Rekomendasi</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-2 font-medium">
                            Kombinasi optimal predikat CONTAINS & FREETEXT untuk meretret dokumen secara kontekstual dan leksikal.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setPredicateMode('CONTAINS')}
                        className={`p-4 rounded-xl text-left border transition-all ${
                            predicateMode === 'CONTAINS' 
                                ? 'bg-indigo-50/60 border-indigo-500 shadow-sm ring-1 ring-indigo-500' 
                                : 'bg-white border-gray-150 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black tracking-wider uppercase text-indigo-800">CONTAINS Predicate</span>
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Leksikal</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-2 font-medium">
                            Pencarian kata kunci presisi tertimbang, mencocokkan konjugasi frasa, awalan kata kasar, maupun istilah terdekat.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setPredicateMode('FREETEXT')}
                        className={`p-4 rounded-xl text-left border transition-all ${
                            predicateMode === 'FREETEXT' 
                                ? 'bg-emerald-50/60 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
                                : 'bg-white border-gray-150 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black tracking-wider uppercase text-emerald-800">FREETEXT Predicate</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Kontekstual</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-2 font-medium">
                            Pencarian arti makna bahasa natural. Menemukan sinonim, akar kata infleksi, pembagian kalimat kategorial.
                        </p>
                    </button>
                </div>

                {/* Input Search Box */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    executeTsqlSearch(searchQuery);
                                }
                            }}
                            placeholder="Ketik kriteria pencarian dokumen semantik... (Contoh: Sengketa Pajak atau Aset Negara)"
                            className="w-full pl-12 pr-4 py-4 text-sm font-semibold border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition bg-gray-50/50 text-gray-900 shadow-inner"
                        />
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => executeTsqlSearch(searchQuery)}
                        disabled={isExecuting || !searchQuery.trim()}
                        className={`px-8 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all ${
                            isExecuting || !searchQuery.trim()
                                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                        }`}
                    >
                        {isExecuting ? (
                            <>
                                <RefreshIcon className="animate-spin h-5 w-5 mr-2" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <SearchIcon className="h-5 w-5 mr-2" />
                                <span>Cari Dokumen</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Suggested Chips */}
                <div className="flex flex-wrap gap-2 items-center text-xs">
                    <span className="text-gray-400 font-black uppercase tracking-wider text-[10px]">Populer:</span>
                    {suggestedSearches.map((term, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleChipClick(term)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-semibold transition border border-gray-200/50"
                        >
                            {term}
                        </button>
                    ))}
                </div>

                <hr className="border-gray-100" />

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Klasifikasi Indeks</label>
                        <div className="flex bg-gray-100 p-0.5 rounded-xl border border-gray-200">
                            {[
                                { key: 'all', label: 'Semua' },
                                { key: 'yurisprudensi', label: 'Putusan' },
                                { key: 'regulasi', label: 'Regulasi' },
                                { key: 'brief', label: 'Dok. Litigasi' }
                            ].map(item => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setDocTypeFilter(item.key as any)}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                        docTypeFilter === item.key 
                                            ? 'bg-white shadow-sm text-blue-700 border-none' 
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Match Score Threshold Slider */}
                    <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Relevance Threshold (Skor Kecocokan)</label>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                                Min: {Math.round(threshold * 100)}% Match
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <input
                                type="range"
                                min="0.2"
                                max="0.9"
                                step="0.05"
                                value={threshold}
                                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                className="flex-1 accent-blue-600 h-1.5 bg-gray-250 rounded-lg cursor-pointer"
                            />
                            <div className="w-12 text-xs font-black text-right text-gray-600">
                                {(threshold).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Main Search Results Display */}
            <div className="flex flex-col space-y-4">
                    


                    {/* Results Container */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[350px] flex flex-col">
                        
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center px-6">
                            <h3 className="font-black text-gray-500 uppercase tracking-widest text-[10px]">
                                {hasSearched ? `Ditemukan ${searchResults.length} Berkas Hasil Pencarian Semantik` : "Ready to Search"}
                            </h3>
                            {hasSearched && (
                                <span className="text-xs font-bold text-gray-400">Threshold filter: {threshold}</span>
                            )}
                        </div>

                        {/* Rendering states */}
                        {isExecuting ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
                                <div className="relative flex items-center justify-center mb-6">
                                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600"></div>
                                    <SearchIcon className="absolute h-5 w-5 text-blue-600 animate-pulse" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Memproses Prosedur Semantik</h4>
                                <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                                    Menjalankan predikat CONTAINS & FREETEXT pada index katalog terdistribusi...
                                </p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="divide-y divide-gray-100 flex-1">
                                {searchResults.map(({ doc, score }) => (
                                    <div key={doc.id} className="p-6 hover:bg-gray-55/40 transition-colors space-y-3.5">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                                    {/* Badge corresponding to Doc Type */}
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                        doc.type === 'yurisprudensi' 
                                                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                                            : doc.type === 'regulasi' 
                                                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                    }`}>
                                                        {doc.type === 'yurisprudensi' ? 'Yurisprudensi' : doc.type === 'regulasi' ? 'Regulasi Tersemat' : 'Internal Case Brief'}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-400">{doc.nomor}</span>
                                                </div>
                                                <h4 className="text-base font-bold text-gray-950 hover:text-blue-700 transition cursor-pointer" onClick={() => setViewedDoc(doc)}>
                                                    {doc.judul}
                                                </h4>
                                            </div>

                                            {/* Relevance score indicator */}
                                            <div className="text-right flex-shrink-0">
                                                <div className="flex items-center space-x-1.5 justify-end">
                                                    <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden inline-block align-middle">
                                                        <div 
                                                            className={`h-full rounded-full ${score > 0.75 ? 'bg-emerald-500' : score > 0.5 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                                            style={{ width: `${score * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900 leading-none">
                                                        {Math.round(score * 100)}%
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">Relevance Score</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                            {doc.ringkasan}
                                        </p>

                                        {/* Row with actions & keywords match */}
                                        <div className="flex justify-between items-center flex-wrap gap-3 pt-1">
                                            <div className="flex flex-wrap gap-1 items-center">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mr-1">Matched index:</span>
                                                {doc.indexColumns.map((col, index) => (
                                                    <span key={index} className="text-[9px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                                        [{col}]
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewedDoc(doc)}
                                                    className="px-3.5 py-1.5 bg-gray-55 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                                                >
                                                    <EyeIcon className="h-3.5 w-3.5" />
                                                    <span>Buka Pratinjau</span>
                                                </button>
                                                <a
                                                    href={`#download-${doc.id}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        alert(`Berkas ${doc.nomor} berhasil diunduh ke sistem lokal.`);
                                                    }}
                                                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                                                >
                                                    <DownloadIcon className="h-3.5 w-3.5 animate-pulse" />
                                                    <span>Unduh PDF</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : hasSearched ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 border border-rose-100">
                                    <InformationCircleIcon className="h-8 w-8 text-rose-500" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Tidak Ada Dokumen Cocok</h4>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
                                    Hasil pencarian dengan query <span className="font-bold text-gray-800">"{searchQuery}"</span> berada di bawah batas koordinat threshold relevansi {threshold * 100}%. Coba turunkan threshold relevansi atau gunakan query lain.
                                </p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 border border-blue-100">
                                    <SearchIcon className="h-8 w-8 text-blue-500" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Mari Cari Dokumen Hukum</h4>
                                <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 leading-relaxed font-semibold">
                                    Masukkan kueri bebas pada kolom search di atas untuk meretret draf permohonan, aturan menteri bantuan hukum, risalah putusan, atau telaahan kasus menggunakan T-SQL Full-text Search Engine.
                                </p>
                            </div>
                        )}
                        
                    </div>

                </div>

            {/* Document Preview Overlay / Modal */}
            <AnimatePresence>
                {viewedDoc && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 pointer-events-auto"
                        onClick={() => setViewedDoc(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden border border-gray-100 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <header className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
                                <div>
                                    <span className="text-[10px] bg-blue-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                        Pratinjau Dokumen Semantik
                                    </span>
                                    <h3 className="text-base font-black text-gray-950 mt-1">{viewedDoc.nomor}</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setViewedDoc(null)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 transition"
                                >
                                    Tutup Pratinjau
                                </button>
                            </header>

                            {/* Modal Content - Scrollable Legal Format */}
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 space-y-6">
                                
                                {/* Legal Seal Representation */}
                                <div className="text-center space-y-2 border-b border-gray-200/60 pb-6">
                                    <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-sm">
                                        <span className="text-gray-400 font-bold text-lg">⚖</span>
                                    </div>
                                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">{viewedDoc.instansiPenerbit}</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{viewedDoc.citation || 'REPUBLIK INDONESIA'}</p>
                                </div>

                                {/* Metadata Grid */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">ID Katalog</span>
                                        <span className="text-gray-900 font-bold font-mono text-[10px]">{viewedDoc.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Klasifikasi Dokumen</span>
                                        <span className="text-blue-700 font-bold uppercase tracking-tight">{viewedDoc.kategori}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Tanggal Diterbitkan</span>
                                        <span className="text-gray-900 font-bold">{viewedDoc.tanggal}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Kata Kunci FTS</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {viewedDoc.keywords.map(kw => (
                                                <span key={kw} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-600">#{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Document Title */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black text-gray-900 leading-snug">
                                        {viewedDoc.judul}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                                        ISI UTAMA DOKUMEN:
                                    </p>
                                    <div className="bg-white border border-gray-150 p-6 rounded-xl shadow-inner font-serif text-sm leading-relaxed text-gray-800 whitespace-pre-wrap select-all border-l-4 border-l-blue-600">
                                        {viewedDoc.kontenLengkap}
                                    </div>
                                </div>

                            </div>

                            {/* Modal Footer */}
                            <footer className="p-4 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-gray-400">Terindex pada database SQL Server Full-Text Catalog</span>
                                <button
                                    type="button"
                                    onClick={() => alert(`Unduhan untuk berkas ${viewedDoc.nomor} dimulai.`)}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-100 transition flex items-center space-x-2"
                                >
                                    <DownloadIcon className="h-4 w-4" />
                                    <span>Download PDF Salinan Resmi</span>
                                </button>
                            </footer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
