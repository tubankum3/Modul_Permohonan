import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    SearchIcon, DocumentTextIcon, DownloadIcon, EyeIcon, 
    RefreshIcon, CheckCircleIcon, InformationCircleIcon,
    AdjustmentsIcon, FilterIcon, XIcon, PrinterIcon, ClipboardCopyIcon,
    HomeIcon, ChevronRightIcon, ChevronDownIcon, CheckIcon, ShieldCheckIcon
} from './icons';
import { motion, AnimatePresence } from 'motion/react';

// Structure of documents in our Kemenkeu legal catalog
export type DocCategory = 'all' | 'putusan' | 'regulasi' | 'litigasi' | 'permohonan' | 'laporan' | 'dalil';

export interface LegalDoc {
    id: string;
    type: 'putusan' | 'regulasi' | 'litigasi' | 'permohonan' | 'laporan' | 'yurisprudensi' | 'brief' | 'dalil';
    nomor: string;
    judul: string;
    kategori: string;
    tanggal: string;
    instansiPenerbit: string;
    ringkasan: string;
    kontenLengkap: string;
    keywords: string[];
    citation?: string;
    fileSize: string;
    semanticCluster?: string;
}

export const matchDocCategory = (docType: string, filter: DocCategory): boolean => {
    if (filter === 'all') return true;
    if (filter === 'putusan') return docType === 'putusan' || docType === 'yurisprudensi';
    if (filter === 'regulasi') return docType === 'regulasi';
    if (filter === 'litigasi') return docType === 'litigasi' || docType === 'brief';
    if (filter === 'permohonan') return docType === 'permohonan';
    if (filter === 'laporan') return docType === 'laporan';
    if (filter === 'dalil') return docType === 'dalil';
    return docType === filter;
};

// Mock database containing authentic Kementerian Keuangan legal documents
export const kemenkeuDocDatabase: LegalDoc[] = [
    {
        id: 'YUR-2022-124',
        type: 'yurisprudensi',
        nomor: 'Putusan MA No. 124 K/TUN/2022',
        judul: 'Sengketa Pemberhentian Tidak Dengan Hormat Pegawai Negeri Sipil di Direktorat Jenderal Pajak',
        kategori: 'Tata Usaha Negara (TUN) / Kepegawaian',
        tanggal: '18 Maret 2022',
        instansiPenerbit: 'Mahkamah Agung RI',
        ringkasan: 'Mahkamah Agung menegaskan bahwa kewenangan melakukan Pemberhentian Tidak Dengan Hormat (PTDH) akibat tindak pidana korupsi berada pada Pejabat Pembina Kepegawaian (PPK) secara mutlak sepanjang putusan pidana telah berkekuatan hukum tetap (Inkracht). Diskresi pimpinan instansi dibatasi oleh asas penegakan hukum prima.',
        keywords: ['pemberhentian', 'direktorat jenderal pajak', 'tun', 'inkracht', 'pegawai negeri sipil', 'korupsi', 'djp', 'ppk', 'disiplin pns', 'pemecatan'],
        citation: 'MA JUR-2022-TUN-124',
        fileSize: '1.4 MB',
        semanticCluster: 'kepegawaian_asn_tun',
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
        instansiPenerbit: 'Mahkamah Agung RI',
        ringkasan: 'Dalam Peninjauan Kembali, MA memutuskan bahwa sertifikat hak pakai atas nama Departemen Keuangan RI (kini Kementerian Keuangan) merupakan bukti otentik kepemilikan aset negara yang sah dan tidak dapat ditumpangi oleh klaim eigendom verponding yang tidak dikonversi sesuai UU Pokok Agraria.',
        keywords: ['aset negara', 'ganti rugi', 'lapangan banteng', 'sertifikat hak pakai', 'perdata', 'eigendom verponding', 'bmn', 'tanah', 'sengketa kepemilikan'],
        citation: 'MA JUR-2023-PDT-89',
        fileSize: '2.8 MB',
        semanticCluster: 'bmn_aset_perdata',
        kontenLengkap: `DUDUK PERKARA:
Bahwa Para Penggugat mengklaim sebidang tanah seluas 12.400 m2 di kawasan Lapangan Banteng, Jakarta Pusat, berdasarkan bukti kepemilikan jaman kolonial Eigendom Verponding No. 4912. Tergugat (Kementerian Keuangan) telah menduduki dan menggunakan tanah tersebut sebagai komplek perkantoran berdasarkan Sertifikat Hak Pakai No. 12/Pasar Baru yang diterbitkan sejak tahun 1982.

PERTIMBANGAN HUKUM:
1. Bahwa tanah yang telah dikuasai secara terus-menerus oleh lembaga negara dan digunakan untuk pelayanan publik, serta telah bersertifikat Hak Pakai atas nama Pemerintah RI c.q. Departemen Keuangan, diklasifikasikan sebagai Barang Milik Negara (BMN) yang dilindungi oleh Undang-Undang Perbendaharaan Negara.
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
        instansiPenerbit: 'Kementerian Keuangan RI',
        ringkasan: 'Mengatur mengenai tata cara, syarat, ruang lingkup, hak, serta kewajiban dalam penyediaan advokasi dan bantuan hukum bagi satuan kerja, pejabat, pegawai, maupun pensiunan Kementerian Keuangan yang menghadapi permasalahan hukum dalam melaksanakan tugas jabatan.',
        keywords: ['pedoman', 'bantuan hukum', 'advokasi', 'pendampingan', 'pensiunan', 'tugas jabatan', 'pmk', 'biro advokasi', 'litigasi'],
        citation: 'PMK 120/2021',
        fileSize: '850 KB',
        semanticCluster: 'bantuan_hukum_advokasi',
        kontenLengkap: `RUANG LINGKUP BANTUAN HUKUM:
Bantuan Hukum diberikan kepada:
a. Kementerian Keuangan sebagai institusi negara.
b. Pejabat dan pegawai di lingkungan Kementerian Keuangan yang menghadapi masalah hukum atau tuntutan hukum sehubungan dengan pelaksanaan tugas kedinasan.
c. Mantan pejabat/pegawai atau pensiunan sepanjang tindakan hukum yang dipermasalahkan terjadi saat yang bersangkutan masih aktif menjabat.

JENIS ADVOKASI HUKUM:
1. Perkara Perdata: Pendampingan dari tingkat pertama, banding, kasasi, hingga peninjauan kembali, termasuk eksekusi putusan peradilan.
2. Perkara Tata Usaha Negara (TUN): Mewakili dalam gugatan pembatalan KTUN Kemenkeu di Pengadilan Tata Usaha Negara.
3. Perkara Pidana: Pendampingan sebagai Saksi, Ahli, maupun pendampingan pada tahap penyidikan/penuntutan bagi tersangka (sepanjang tidak ada benturan kepentingan dengan keuangan negara).
4. Uji Materiil: Penyusunan keterangan tertulis pemerintah dalam sidang Mahkamah Konstitusi.`
    },
    {
        id: 'REG-2003-017',
        type: 'regulasi',
        nomor: 'Undang-Undang No. 17 Tahun 2003',
        judul: 'Undang-Undang Tentang Keuangan Negara',
        kategori: 'Undang-Undang (UU)',
        tanggal: '5 April 2003',
        instansiPenerbit: 'Dewan Perwakilan Rakyat & Presiden RI',
        ringkasan: 'Undang-Undang pilar pengelolaan fiskal yang menetapkan asas-asas umum pengelolaan keuangan negara secara tertib, taat pada peraturan perundang-undangan, efisien, ekonomis, efektif, transparan, dan bertanggung jawab dengan memperhatikan rasa keadilan dan kepatutan.',
        keywords: ['keuangan negara', 'fiskal', 'apbn', 'pengelolaan', 'perbendaharaan', 'tanggung jawab', 'uu', 'presiden', 'fiskal negara'],
        citation: 'UU No. 17 Tahun 2003',
        fileSize: '3.1 MB',
        semanticCluster: 'keuangan_negara_fiskal',
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
        kategori: 'Dokumen Litigasi / Legal Brief',
        tanggal: '10 Mei 2026',
        instansiPenerbit: 'Biro Advokasi Sekretariat Jenderal',
        ringkasan: 'Ringkasan eksekutif pasca keluarnya putusan PK No. 89 PK/Pdt/2023. Membahas rencana tindak banding balik dan koordinasi sertifikasi mitigasi fisik dengan instansi BPN Daerah Khusus Jakarta, serta estimasi dampak keuangan negara sebesar IDR 450 Miliar jika sertifikasi terhambat.',
        keywords: ['mitigasi', 'eksekusi', 'lapangan banteng', 'risiko', 'bpn', 'analisis hukum', 'derden verzet', 'aset negara'],
        citation: 'Internal Kemenkeu BH-01',
        fileSize: '420 KB',
        semanticCluster: 'bmn_aset_perdata',
        kontenLengkap: `RISIKO HUKUM:
Meskipun Kementerian Keuangan memenangkan peninjauan kembali (PK) atas kepemilikan tanah Lapangan Banteng, pihak eksternal masih mencoba melakukan provokasi lapangan dan mengajukan gugatan perlawanan pihak ketiga (Derden Verzet). 

TINDAK LANJUT STRATEGIS (MITIGASI):
1. Mengamankan penguasaan fisik tanah dengan memasang patok, papan pengumuman kepemilikan aset Kementerian Keuangan RI, dan menempatkan personel keamanan internal.
2. Mempercepat integrasi sistem pendaftaran Barang Milik Negara (BMN) Kemenkeu ke sistem pertanahan elektronik nasional (BPN) guna mengunci potensi klaim sertifikat ganda.
3. Mempersiapkan draf jawaban komprehensif atas gugatan Derden Verzet apabila didaftarkan resmi di PN Jakarta Pusat.`
    },
    {
        id: 'BRF-2025-012',
        type: 'brief',
        nomor: 'Legal Brief DJBC-2025-012',
        judul: 'Telaahan Hukum Tanggapan Gugatan Pembatasan Ekspor Mineral Mentah DJBC',
        kategori: 'Dokumen Litigasi / Legal Brief',
        tanggal: '22 November 2025',
        instansiPenerbit: 'Kasi Bantuan Hukum Kanwil Bea Cukai',
        ringkasan: 'Telaahan hukum mengenai gugatan perusahaan tambang terhadap pembatasan pengapalan ekspor bijih nikel yang diberlakukan Kantor Wilayah Bea Cukai. Mengurai argumen kedaulatan ekonomi negara dan konsistensi dengan aturan GATT WTO.',
        keywords: ['ekspor', 'mineral', 'bea cukai', 'gugatan', 'nickel', 'gatt', 'wto', 'peb', 'djbc', 'kepabeanan'],
        citation: 'Internal DJBC BH-12',
        fileSize: '510 KB',
        semanticCluster: 'kepabeanan_cukai',
        kontenLengkap: `LATAR BELAKANG:
Gugatan diajukan oleh PT Minerba Jaya Sentosa di PTUN terkait keputusan penolakan pelayanan ekspor (PEB) atas komoditas konsentrat mineral tambang mentah. Bea Cukai mendasarkan keputusan pada PMK yang melarang pengapalan bahan mentah yang belum dihilirisasi sesuai UU Minerba.

ANALISIS HUKUM:
1. Tindakan penolakan pelayanan ekspor merupakan tindakan hukum administrasi yang sah berdasarkan kewenangan pengawasan kepabeanan ekspor dalam UU Kepabeanan.
2. Aturan GATT Article XX (General Exceptions) membolehkan anggota WTO membatasi ekspor komoditas guna melindungi sumber daya alam yang dapat habis, sehingga argumen Penggugat mengenai pelanggaran perdagangan bebas internasional dinilai tidak relevan.`
    },
    {
        id: 'REG-2020-542',
        type: 'regulasi',
        nomor: 'KMK No. 542/KMK.01/2020',
        judul: 'Tata Kelola Penanganan Perkara Hukum dan Advokasi di Lingkungan Kementerian Keuangan',
        kategori: 'Keputusan Menteri Keuangan (KMK)',
        tanggal: '28 Desember 2020',
        instansiPenerbit: 'Kementerian Keuangan RI',
        ringkasan: 'Menetapkan standar operasional prosedur penanganan perkara perdata, tata usaha negara, pengujian undang-undang, serta koordinasi antar unit eselon I dalam memberikan kesaksian dan dokumen pembuktian peradilan.',
        keywords: ['tata kelola', 'penanganan perkara', 'kmk', 'eselon i', 'advokasi', 'sop', 'persidangan', 'biro hukum'],
        citation: 'KMK 542/2020',
        fileSize: '1.1 MB',
        semanticCluster: 'bantuan_hukum_advokasi',
        kontenLengkap: `TATA CARA KOORDINASI:
1. Setiap unit vertikal Eselon I wajib melaporkan panggilan sidang peradilan atau relas panggilan paling lambat 2 (dua) hari kerja setelah diterima kepada Biro Advokasi.
2. Penunjukan kuasa hukum dari aparatur Kemenkeu dilakukan melalui Surat Kuasa Khusus (SKK) Menteri Keuangan atau pejabat yang didelegasikan.
3. Unit teknis berkewajiban menyiapkan seluruh dokumen pendukung, kronologi fakta hukum, dan saksi fakta yang relevan.`
    },
    {
        id: 'YUR-2020-048',
        type: 'yurisprudensi',
        nomor: 'Putusan MK No. 48/PUU-XVIII/2020',
        judul: 'Pengujian Materiil Undang-Undang Bea Meterai Terhadap Undang-Undang Dasar 1945',
        kategori: 'Mahkamah Konstitusi (Uji Materiil)',
        tanggal: '12 November 2020',
        instansiPenerbit: 'Mahkamah Konstitusi RI',
        ringkasan: 'Mahkamah Konstitusi menolak permohonan pengujian materiil ketentuan pengenaan bea meterai atas dokumen elektronik, menyatakan bahwa pengenaan meterai digital konstitusional dan sesuai prinsip keadilan perpajakan modern.',
        keywords: ['bea meterai', 'dokumen elektronik', 'mk', 'konstitusional', 'pajak', 'uud 1945', 'uji materiil', 'mahkamah konstitusi'],
        citation: 'MK 48/PUU/2020',
        fileSize: '2.3 MB',
        semanticCluster: 'konstitusi_pajak',
        kontenLengkap: `PERTIMBANGAN MAHKAMAH:
1. Perkembangan teknologi transaksi elektronik memerlukan kepastian hukum atas fungsi pembuktian dokumen perdata dalam peradilan.
2. Pengenaan bea meterai terhadap dokumen elektronik tidak melanggar hak konstitusional warga negara, melainkan perwujudan gotong royong membiayai belanja negara melalui instrumen fiskal yang adil.`
    },
    {
        id: 'DAL-2024-001',
        type: 'dalil',
        nomor: 'Bank Dalil No. DAL-01/BA.2/2024',
        judul: 'Dalil Eksepsi Kompetensi Absolut dan Gugatan Prematur Sengketa Pengelolaan Barang Milik Negara (BMN)',
        kategori: 'Bank Dalil / Eksepsi Hukum',
        tanggal: '20 Agustus 2024',
        instansiPenerbit: 'Biro Advokasi Sekretariat Jenderal',
        ringkasan: 'Kompilasi dalil bantahan baku dan yurisprudensi tetap Mahkamah Agung untuk menangkis gugatan perdata perbuatan melawan hukum (PMH) atas penetapan status penggunaan dan pemanfaatan aset tanah/bangunan BMN oleh pihak ketiga.',
        keywords: ['dalil', 'eksepsi', 'kompetensi absolut', 'bmn', 'aset negara', 'gugatan prematur', 'ptun', 'pmh', 'perdata'],
        citation: 'DAL-01/BA.2/2024',
        fileSize: '850 KB',
        semanticCluster: 'bmn_aset_perdata',
        kontenLengkap: `DALIL UTAMA:
1. EKSEPSI KOMPETENSI ABSOLUT: Bahwa objek sengketa merupakan Keputusan Tata Usaha Negara (KTUN) di bidang pengelolaan Barang Milik Negara yang diterbitkan oleh Pejabat Tata Usaha Negara yang berwenang, sehingga berdasarkan Pasal 1 angka 9 UU Peratun jo. Perma No. 2 Tahun 2019, sengketa ini merupakan yurisdiksi absolut Pengadilan Tata Usaha Negara dan bukan Pengadilan Negeri.
2. EKSEPSI OBSCUUR LIBEL: Posita gugatan Penggugat saling bertentangan antara dalil Wanprestasi dan Perbuatan Melawan Hukum (PMH), yang menurut Yurisprudensi MA RI No. 1875 K/Pdt/1984 mengakibatkan gugatan harus dinyatakan tidak dapat diterima (Niet Ontvankelijke Verklaard).
3. DALIL POKOK PERKARA: Pengelolaan BMN dilakukan berdasarkan asas kepastian hukum dan perlindungan keuangan negara sesuai amanat PP No. 27 Tahun 2014 jo. PP No. 28 Tahun 2020.`
    },
    {
        id: 'DAL-2023-004',
        type: 'dalil',
        nomor: 'Bank Dalil No. DAL-04/DJP-BH/2023',
        judul: 'Standardisasi Dalil Pembelaan Sengketa Transfer Pricing dan Rekonstruksi Pembukuan Perpajakan',
        kategori: 'Bank Dalil / Sengketa Pajak',
        tanggal: '14 Juli 2023',
        instansiPenerbit: 'Biro Advokasi & Ditjen Pajak',
        ringkasan: 'Petunjuk teknis formulasi dalil hukum dan pembuktian empiris dalam menghadapi banding dan gugatan wajib pajak atas koreksi peredaran usaha dan penentuan transfer pricing pada Pengadilan Pajak.',
        keywords: ['dalil', 'pengadilan pajak', 'transfer pricing', 'koreksi', 'arm length principle', 'sengketa pajak', 'pembuktian', 'djp'],
        citation: 'DAL-04/DJP-BH/2023',
        fileSize: '720 KB',
        semanticCluster: 'pajak_perpajakan',
        kontenLengkap: `STANDARISASI DALIL:
1. Argumentasi harus mendasarkan pada arm's length principle (prinsip kewajaran dan kelaziman usaha).
2. Bukti pembanding eksternal wajib diverifikasi keabsahannya dengan database komersial tepercaya.
3. Seluruh dalil hukum diselaraskan dengan putusan-putusan preseden Pengadilan Pajak dan Yurisprudensi Mahkamah Agung.`
    },
    {
        id: 'REQ-2026-004',
        type: 'permohonan',
        nomor: 'Permohonan Bantuan Hukum No. PH-04/BC.08/2026',
        judul: 'Permohonan Pendampingan Hukum Sidang Praperadilan Penyitaan Barang Kena Cukai Hasil Tembakau Ilegal',
        kategori: 'Permohonan Bantuan Hukum',
        tanggal: '12 Februari 2026',
        instansiPenerbit: 'KPPBC Tipe Madya Pabean B Kudus',
        ringkasan: 'Permohonan penyediaan kuasa hukum dan advokasi dari Biro Advokasi Kemenkeu untuk mewakili Penyidik Bea Cukai dalam gugatan praperadilan sah tidaknya penyitaan truk bermuatan 1,2 juta batang rokok tanpa dilekati pita cukai resmi.',
        keywords: ['permohonan', 'praperadilan', 'bea cukai', 'pita cukai', 'penyitaan', 'cukai', 'tembakau', 'rokok ilegal', 'penyidik'],
        citation: 'PH-04/BC.08/2026',
        fileSize: '680 KB',
        semanticCluster: 'kepabeanan_cukai',
        kontenLengkap: `POKOK PERMOHONAN:
Sehubungan dengan diterimanya Relaas Panggilan Sidang Praperadilan dari Pengadilan Negeri Kudus Nomor Perkara 02/Pid.Pra/2026/PN Kds, bersama ini kami memohon bantuan penugasan Tim Advokasi Kementerian Keuangan untuk memberikan pendampingan hukum dan bertindak sebagai kuasa hukum Termohon Praperadilan.

URAIAN SINGKAT KASUS:
Penyidik Bea Cukai telah melakukan penindakan dan penyitaan terhadap 1 (satu) unit truk yang mengangkut Barang Kena Cukai Hasil Tembakau berupa rokok jenis Sigaret Kretek Mesin (SKM) tanpa dilekati pita cukai pada tanggal 28 Januari 2026 di Jalan Lingkar Kudus-Pati. Pemohon Praperadilan mendalilkan bahwa proses penggeledahan dan penyitaan tidak sah karena tidak disertai surat izin ketua pengadilan negeri setempat.

DOKUMEN PENDUKUNG:
1. Surat Perintah Tugas Penindakan.
2. Berita Acara Penggeledahan dan Berita Acara Penyitaan.
3. Surat Izin Penyitaan dari Ketua PN Kudus (diterbitkan post-factum secara sah sesuai Pasal 38 ayat (2) KUHAP).`
    },
    {
        id: 'LAP-2025-018',
        type: 'laporan',
        nomor: 'Laporan Triwulanan LHK-04/BA/2025',
        judul: 'Laporan Kinerja Penanganan Perkara dan Mitigasi Risiko Hukum Kementerian Keuangan Tahun 2025',
        kategori: 'Laporan Bantuan Hukum',
        tanggal: '15 Januari 2026',
        instansiPenerbit: 'Biro Advokasi Sekretariat Jenderal',
        ringkasan: 'Laporan komprehensif evaluasi penanganan 384 perkara hukum di lingkungan Kementerian Keuangan sepanjang tahun 2025, mencatat tingkat kemenangan (win rate) 88,5% serta potensi penyelamatan keuangan negara mencapai Rp 4,78 Triliun.',
        keywords: ['laporan', 'kinerja', 'evaluasi', 'penanganan perkara', 'mitigasi risiko', 'win rate', 'keuangan negara', 'biro advokasi'],
        citation: 'LHK-04/BA/2025',
        fileSize: '4.2 MB',
        semanticCluster: 'laporan_evaluasi_fiskal',
        kontenLengkap: `RINGKASAN EKSEKUTIF:
Sepanjang Tahun Anggaran 2025, Biro Advokasi bersama Tim Advokasi Unit Vertikal telah menangani total 384 perkara hukum yang terdiri dari Perdata (126 perkara), Tata Usaha Negara (154 perkara), Pengujian Undang-Undang di Mahkamah Konstitusi (18 perkara), dan Sengketa Khusus di Pengadilan Pajak (86 perkara).

CAPAIAN KINERJA:
1. Tingkat Keberhasilan Penanganan Perkara: 88,5% (target renstra 85%).
2. Penyelamatan Potensi Kerugian Keuangan Negara: Rp 4.782.550.000.000,- yang berhasil dipertahankan dari tuntutan ganti rugi perdata dan gugatan pembatalan penetapan bea cukai/pajak.
3. Pemulihan Aset Barang Milik Negara (BMN): Berhasil mengamankan 14 bidang tanah sengketa seluas total 28,6 hektar di berbagai daerah.`
    },
    {
        id: 'YUR-2024-210',
        type: 'putusan',
        nomor: 'Putusan MA No. 210 K/Pdt.Sus-Pailit/2024',
        judul: 'Hak Mendahulu Negara Atas Tagihan Pajak dalam Perkara Kepailitan Perseroan Terbatas',
        kategori: 'Kepailitan / Piutang Pajak Negara',
        tanggal: '4 Mei 2024',
        instansiPenerbit: 'Mahkamah Agung RI',
        ringkasan: 'Mahkamah Agung mengukuhkan kedudukan hak mendahulu negara atas utang pajak debitur pailit melebihi hak kreditur separatis (hak tanggungan/fidusia) sebagaimana diatur dalam Pasal 21 UU Ketentuan Umum dan Tata Cara Perpajakan (KUP).',
        keywords: ['kepailitan', 'hak mendahulu', 'utang pajak', 'kurator', 'separatis', 'djp', 'piutang negara', 'kemenkeu'],
        citation: 'MA JUR-2024-PAILIT-210',
        fileSize: '1.9 MB',
        semanticCluster: 'pajak_perpajakan',
        kontenLengkap: `PERTIMBANGAN MAHKAMAH:
1. Bahwa Negara mempunyai hak mendahulu untuk utang pajak atas barang-barang milik Penanggung Pajak.
2. Hak mendahulu untuk tagihan pajak meliputi pokok pajak, sanksi administrasi berupa bunga, denda, dan biaya penagihan pajak.
3. Kedudukan hak mendahulu kas negara berada di atas segala hak gadai, hipotek, dan hak tanggungan, kecuali biaya perkara yang semata-mata disebabkan oleh suatu penghukuman untuk melelang suatu barang bergerak dan/atau barang tidak bergerak.`
    },
    {
        id: 'REG-2023-190',
        type: 'regulasi',
        nomor: 'PMK No. 190/PMK.05/2023',
        judul: 'Tata Cara Pembayaran dalam Rangka Pelaksanaan Anggaran Pendapatan dan Belanja Negara (APBN)',
        kategori: 'Peraturan Menteri Keuangan (PMK)',
        tanggal: '18 Desember 2023',
        instansiPenerbit: 'Kementerian Keuangan RI',
        ringkasan: 'Ketentuan komprehensif mengenai mekanisme penerbitan Surat Perintah Membayar (SPM), Surat Perintah Pencairan Dana (SP2D), penatausahaan Uang Persediaan (UP), serta tanggung jawab Pejabat Pembuat Komitmen (PPK) dan KPPN.',
        keywords: ['spm', 'sp2d', 'apbn', 'pembayaran', 'kppn', 'djpb', 'perbendaharaan', 'uang persediaan', 'ppk'],
        citation: 'PMK 190/2023',
        fileSize: '2.1 MB',
        semanticCluster: 'keuangan_negara_fiskal',
        kontenLengkap: `TATA CARA PENCAIRAN DANA:
1. Pejabat Pembuat Komitmen (PPK) menerbitkan Surat Permintaan Pembayaran (SPP) setelah menguji kebenaran tagihan dan kesesuaian prestasi kerja.
2. Pejabat Penandatangan SPM (PPSPM) melakukan pengujian formal dan substantif sebelum menerbitkan Surat Perintah Membayar (SPM).
3. Kantor Pelayanan Perbendaharaan Negara (KPPN) selaku Kuasa Bendahara Umum Negara (BUN) menerbitkan Surat Perintah Pencairan Dana (SP2D) secara elektronik melalui sistem terintegrasi.`
    }
];

// Indonesian stop words to avoid skewing IR query weights
const INDONESIAN_STOP_WORDS = new Set([
    'yang', 'di', 'ke', 'dari', 'pada', 'untuk', 'dan', 'atau', 'ini', 'itu', 
    'adalah', 'sebagai', 'dalam', 'bisa', 'akan', 'oleh', 'ada', 'juga', 'dengan', 
    'atas', 'tersebut', 'serta', 'dapat', 'secara', 'karena', 'tentang', 'terhadap',
    'antara', 'bagi', 'sampai', 'seperti', 'para'
]);

// Tokenizer that cleans punctuation and produces query tokens
export const tokenizeText = (text: string): string[] => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s/-]/gi, ' ')
        .split(/\s+/)
        .map(t => t.trim())
        .filter(t => t.length > 1);
};

// ============================================================================
// SEMANTIC EMBEDDING & VECTOR SEARCH (STAGE 1 - BRANCH 2)
// ============================================================================

// Legal semantic concept dimensions for dense vector representation (32 dimensions)
const LEGAL_CONCEPT_PROJECTIONS = [
    { dim: 0, keywords: ['pajak', 'perpajakan', 'djp', 'pph', 'ppn', 'fiskal', 'wajib pajak', 'sengketa pajak', 'transfer pricing', 'surat ketetapan'] },
    { dim: 1, keywords: ['cukai', 'bea cukai', 'djbc', 'kepabeanan', 'ekspor', 'impor', 'tarif', 'penyelundupan', 'rokok', 'tembakau', 'peb'] },
    { dim: 2, keywords: ['bmn', 'aset', 'tanah', 'bangunan', 'lapangan banteng', 'sertifikat', 'eigendom', 'kpknl', 'djkn', 'kekayaan negara', 'lelang'] },
    { dim: 3, keywords: ['apbn', 'anggaran', 'sp2d', 'spm', 'kppn', 'djpb', 'perbendaharaan', 'keuangan negara', 'bendahara', 'uang persediaan'] },
    { dim: 4, keywords: ['advokasi', 'bantuan hukum', 'biro advokasi', 'pendampingan', 'kuasa hukum', 'skk', 'perkara', 'litigasi', 'sidang'] },
    { dim: 5, keywords: ['kepegawaian', 'pns', 'asn', 'ptdh', 'pemecatan', 'disiplin', 'ppk', 'jabatan', 'korupsi', 'inkracht'] },
    { dim: 6, keywords: ['perdata', 'pmh', 'ganti rugi', 'wanprestasi', 'derden verzet', 'sita', 'putusan ma', 'kasasi', 'pk', 'peninjauan kembali'] },
    { dim: 7, keywords: ['tun', 'tata usaha negara', 'ptun', 'ktun', 'keputusan', 'pejabat', 'diskresi', 'gebonden', 'pembatalan'] },
    { dim: 8, keywords: ['mk', 'mahkamah konstitusi', 'uji materiil', 'puu', 'konstitusional', 'uud 1945', 'pengujian undang-undang', 'meterai'] },
    { dim: 9, keywords: ['pidana', 'praperadilan', 'penyidikan', 'penyidik', 'penyitaan', 'tersangka', 'geledah', 'kuhap', 'tipikor'] },
    { dim: 10, keywords: ['kepailitan', 'pailit', 'hak mendahulu', 'kurator', 'separatis', 'kreditur', 'piutang'] },
    { dim: 11, keywords: ['wto', 'gatt', 'internasional', 'mineral', 'nikel', 'perdagangan', 'hilirisasi'] },
    { dim: 12, keywords: ['eksepsi', 'kompetensi absolut', 'obscuur libel', 'dalil', 'tangkisan', 'niet ontvankelijk'] },
    { dim: 13, keywords: ['laporan', 'kinerja', 'evaluasi', 'win rate', 'mitigasi risiko', 'analisis'] },
    { dim: 14, keywords: ['permohonan', 'satker', 'pengajuan', 'telaahan', 'kajian'] },
    { dim: 15, keywords: ['regulasi', 'pmk', 'kmk', 'uu', 'undang-undang', 'peraturan menteri', 'pedoman', 'sop'] }
];

// Helper to compute a normalized 32-dimensional dense embedding vector
export const computeSemanticEmbedding = (text: string, keywords: string[] = []): number[] => {
    const vector = new Array(32).fill(0);
    const tokens = tokenizeText(text);
    const combinedTerms = [...tokens, ...keywords.map(k => k.toLowerCase())];

    // 1. Concept Projections (Dimensions 0-15)
    LEGAL_CONCEPT_PROJECTIONS.forEach(({ dim, keywords: dimKeywords }) => {
        let matchScore = 0;
        dimKeywords.forEach(k => {
            const occurrences = combinedTerms.filter(t => t === k || t.includes(k) || k.includes(t)).length;
            matchScore += occurrences;
        });
        vector[dim] = matchScore;
    });

    // 2. Subword & N-Gram Hash Projections (Dimensions 16-31)
    combinedTerms.forEach(term => {
        let hash = 0;
        for (let i = 0; i < term.length; i++) {
            hash = (hash << 5) - hash + term.charCodeAt(i);
            hash |= 0;
        }
        const dimIndex = 16 + (Math.abs(hash) % 16);
        vector[dimIndex] += 1.0;
    });

    // 3. L2 Normalization
    let norm = 0;
    for (let i = 0; i < vector.length; i++) {
        norm += vector[i] * vector[i];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
        for (let i = 0; i < vector.length; i++) {
            vector[i] = vector[i] / norm;
        }
    }

    return vector;
};

// Cosine similarity between two unit-normalized vectors
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dotProduct));
};

// Pre-computed embeddings for all documents in catalog
export const documentEmbeddingsCache = new Map<string, number[]>();
kemenkeuDocDatabase.forEach(doc => {
    const combinedContent = `${doc.nomor} ${doc.judul} ${doc.kategori} ${doc.keywords.join(' ')} ${doc.ringkasan}`;
    documentEmbeddingsCache.set(doc.id, computeSemanticEmbedding(combinedContent, doc.keywords));
});

// ============================================================================
// STAGE 2: CROSS-ENCODER JOINT RE-RANKER MODEL
// ============================================================================

export interface CrossEncoderOutput {
    finalScore: number; // 0.0 - 1.0 (or percentage)
    crossAttentionWeight: number;
    contextualSpanScore: number;
    exactAlignmentScore: number;
    highAttentionSentences: string[];
}

// Simulates a Transformer Cross-Encoder with full cross-attention between Query & Document
export const evaluateCrossEncoder = (query: string, doc: LegalDoc): CrossEncoderOutput => {
    const queryTokens = tokenizeText(query).filter(t => !INDONESIAN_STOP_WORDS.has(t) || query.length <= 5);
    const effectiveQTokens = queryTokens.length > 0 ? queryTokens : tokenizeText(query);
    
    // Split full text into meaningful legal sentences for granular attention
    const sentences = doc.kontenLengkap.split(/(?<=[.\n])\s+/).filter(s => s.trim().length > 15);
    
    let totalAttention = 0;
    const sentenceAttentionScores: { sentence: string; attention: number }[] = [];

    sentences.forEach(sentence => {
        const lowerSentence = sentence.toLowerCase();
        let sentenceAtt = 0;

        effectiveQTokens.forEach(qTerm => {
            if (lowerSentence.includes(qTerm)) {
                sentenceAtt += 1.5;
            }
            // Partial subword matching
            if (qTerm.length >= 4 && lowerSentence.includes(qTerm.substring(0, qTerm.length - 2))) {
                sentenceAtt += 0.5;
            }
        });

        // Exact multi-term span match
        if (query.trim().length > 4 && lowerSentence.includes(query.trim().toLowerCase())) {
            sentenceAtt += 3.0;
        }

        sentenceAttentionScores.push({ sentence, attention: sentenceAtt });
        totalAttention += sentenceAtt;
    });

    // Sort sentences by attention to highlight top attention spans
    sentenceAttentionScores.sort((a, b) => b.attention - a.attention);
    const highAttentionSentences = sentenceAttentionScores
        .filter(s => s.attention > 0.8)
        .map(s => s.sentence)
        .slice(0, 3);

    // Deep title & keyword cross-attention
    let titleAttention = 0;
    const lowerTitle = `${doc.nomor} ${doc.judul}`.toLowerCase();
    effectiveQTokens.forEach(t => {
        if (lowerTitle.includes(t)) titleAttention += 2.0;
    });
    if (query.length > 4 && lowerTitle.includes(query.toLowerCase())) {
        titleAttention += 4.0;
    }

    // Keyword vector overlap
    let keywordAttention = 0;
    effectiveQTokens.forEach(t => {
        if (doc.keywords.some(k => k.toLowerCase().includes(t) || t.includes(k.toLowerCase()))) {
            keywordAttention += 2.0;
        }
    });

    // Normalized scores
    const crossAttentionWeight = Math.min(1.0, (totalAttention * 0.15) + (titleAttention * 0.25) + (keywordAttention * 0.2));
    const contextualSpanScore = highAttentionSentences.length > 0 ? Math.min(1.0, highAttentionSentences.length * 0.35) : 0.1;
    const exactAlignmentScore = lowerTitle.includes(query.toLowerCase()) || doc.ringkasan.toLowerCase().includes(query.toLowerCase()) ? 0.95 : (titleAttention > 0 ? 0.65 : 0.25);

    // Sigmoid calibration: Score = 1 / (1 + exp(-(beta0 + beta1*Att + beta2*Span + beta3*Align)))
    const logit = -2.2 + (3.4 * crossAttentionWeight) + (2.0 * contextualSpanScore) + (2.5 * exactAlignmentScore);
    const sigmoidScore = 1 / (1 + Math.exp(-logit));

    return {
        finalScore: Number(sigmoidScore.toFixed(4)),
        crossAttentionWeight: Number(crossAttentionWeight.toFixed(3)),
        contextualSpanScore: Number(contextualSpanScore.toFixed(3)),
        exactAlignmentScore: Number(exactAlignmentScore.toFixed(3)),
        highAttentionSentences
    };
};

// ============================================================================
// DATA STRUCTURES FOR TWO-STAGE PIPELINE RESULTS
// ============================================================================

export interface BM25Explanation {
    term: string;
    idf: number;
    tf: number;
    score: number;
}

export interface PipelineCandidate {
    doc: LegalDoc;
    // Stage 1 - Branch 1: BM25 Lexical
    bm25Score: number;
    bm25Rank: number;
    bm25Terms: BM25Explanation[];
    // Stage 1 - Branch 2: Semantic Vector
    vectorSimilarity: number;
    vectorRank: number;
    // Stage 1 - Fusion: RRF
    rrfScore: number;
    rrfRank: number;
    // Stage 2: Cross-Encoder Re-Ranking
    crossEncoderScore: number;
    crossEncoderRank: number;
    crossEncoderDetails: CrossEncoderOutput;
    // Highlighted Snippet
    highlightSnippet: string;
}

export interface PipelineMetrics {
    totalCorpus: number;
    preFilteredCount: number;
    stage1LatencyMs: number; // Retrieval: BM25 + Vector + RRF
    stage2LatencyMs: number; // Re-ranking: Cross-Encoder Top K
    totalLatencyMs: number;
    stage1CandidatesCount: number;
    stage2TopKEvaluated: number;
    finalResultsCount: number;
    queryTokens: string[];
}

// ============================================================================
// MAIN CARI DOKUMEN COMPONENT
// ============================================================================

export const CariDokumen: React.FC<{ 
    currentView: string; 
    onNavigate: (view: any) => void;
    initialFilter?: DocCategory;
}> = ({ onNavigate, initialFilter = 'all' }) => {
    // Search Query & Pre-Filter states (FR-SRC-02)
    const [searchQuery, setSearchQuery] = useState('');
    const [docTypeFilter, setDocTypeFilter] = useState<DocCategory>(initialFilter);

    // FR-SRC-03: Pipeline Configuration Parameters
    const [showPipelineDrawer, setShowPipelineDrawer] = useState<boolean>(false);
    const [rrfK, setRrfK] = useState<number>(60); // RRF constant k (default 60)
    const [topKStage2, setTopKStage2] = useState<number>(50); // Top K to pass to Stage 2 (default 50)
    const [crossEncoderThreshold, setCrossEncoderThreshold] = useState<number>(0.25); // Min Cross-Encoder threshold (default 0.25 / 25%)
    const [weightBM25, setWeightBM25] = useState<number>(1.0); // Weight for BM25 branch in RRF
    const [weightVector, setWeightVector] = useState<number>(1.0); // Weight for Vector branch in RRF
    const [bm25K1, setBm25K1] = useState<number>(1.5); // BM25 term frequency saturation
    const [bm25B, setBm25B] = useState<number>(0.75); // BM25 length normalization

    // Execution & Results states (FR-SRC-01)
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [pipelineResults, setPipelineResults] = useState<PipelineCandidate[]>([]);
    const [pipelineMetrics, setPipelineMetrics] = useState<PipelineMetrics | null>(null);

    // Modal & Toast states (FR-SRC-04, FR-SRC-05)
    const [viewedDoc, setViewedDoc] = useState<LegalDoc | null>(null);
    const [viewedPipelineCandidate, setViewedPipelineCandidate] = useState<PipelineCandidate | null>(null);
    const [showOnlyAttentionText, setShowOnlyAttentionText] = useState<boolean>(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const showToast = (msg: string) => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setToastMessage(msg);
        toastTimeoutRef.current = setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    // Precomputed corpus statistics for Okapi BM25
    const corpusStats = useMemo(() => {
        const N = kemenkeuDocDatabase.length;
        const docTokenCounts = new Map<string, number>();
        let totalTokens = 0;

        kemenkeuDocDatabase.forEach(doc => {
            const combinedText = `${doc.nomor} ${doc.judul} ${doc.keywords.join(' ')} ${doc.ringkasan} ${doc.kontenLengkap}`;
            const tokens = tokenizeText(combinedText);
            docTokenCounts.set(doc.id, tokens.length);
            totalTokens += tokens.length;
        });

        const avgdl = totalTokens / (N || 1);
        return { N, docTokenCounts, avgdl: Math.round(avgdl) };
    }, []);

    // ========================================================================
    // EXECUTION: TWO-STAGE PIPELINE SEARCH (FR-SRC-01, FR-SRC-02, FR-SRC-03)
    // ========================================================================
    const executeTwoStagePipelineSearch = (queryText: string) => {
        const trimmed = queryText.trim();
        if (!trimmed) return;

        setIsSearching(true);
        setHasSearched(true);
        
        const overallStart = performance.now();

        // --------------------------------------------------------------------
        // FR-SRC-02: Pre-Filtering (Stage 1 Search Space Restriction)
        // --------------------------------------------------------------------
        const candidateSearchSpace = docTypeFilter === 'all'
            ? kemenkeuDocDatabase
            : kemenkeuDocDatabase.filter(d => matchDocCategory(d.type, docTypeFilter));

        const stage1Start = performance.now();

        // Tokenize query
        const rawTokens = tokenizeText(trimmed);
        const queryTokens = rawTokens.filter(t => !INDONESIAN_STOP_WORDS.has(t) || rawTokens.length <= 2);
        const effectiveTokens = queryTokens.length > 0 ? queryTokens : rawTokens;

        // --------------------------------------------------------------------
        // TAHAP 1 - CABANG 1: Okapi BM25 Lexical Retrieval
        // --------------------------------------------------------------------
        const docFrequency = new Map<string, number>();
        effectiveTokens.forEach(term => {
            let count = 0;
            candidateSearchSpace.forEach(doc => {
                const combined = `${doc.nomor} ${doc.judul} ${doc.keywords.join(' ')} ${doc.ringkasan} ${doc.kontenLengkap}`.toLowerCase();
                if (combined.includes(term)) count++;
            });
            docFrequency.set(term, count);
        });

        const termIdfs = new Map<string, number>();
        effectiveTokens.forEach(term => {
            const n_q = docFrequency.get(term) || 0;
            const N = candidateSearchSpace.length;
            const idf = Math.log(1 + (N - n_q + 0.5) / (n_q + 0.5));
            termIdfs.set(term, Math.max(0.1, idf));
        });

        const bm25Map = new Map<string, { score: number; termExps: BM25Explanation[] }>();

        candidateSearchSpace.forEach(doc => {
            const docTokens = corpusStats.docTokenCounts.get(doc.id) || 100;
            const lengthRatio = docTokens / (corpusStats.avgdl || 1);
            const lengthPenalty = 1 - bm25B + (bm25B * lengthRatio);

            const titleTokens = tokenizeText(`${doc.nomor} ${doc.judul}`);
            const keywordTokens = tokenizeText(doc.keywords.join(' '));
            const ringkasanTokens = tokenizeText(doc.ringkasan);
            const contentTokens = tokenizeText(doc.kontenLengkap);

            let totalBM25 = 0;
            const termExps: BM25Explanation[] = [];

            effectiveTokens.forEach(term => {
                const idf = termIdfs.get(term) || 0;
                const tfTitle = titleTokens.filter(t => t === term || t.includes(term)).length;
                const tfKeywords = keywordTokens.filter(t => t === term || t.includes(term)).length;
                const tfRingkasan = ringkasanTokens.filter(t => t === term || t.includes(term)).length;
                const tfContent = contentTokens.filter(t => t === term || t.includes(term)).length;
                const rawTf = tfTitle + tfKeywords + tfRingkasan + tfContent;

                const weightedTf = (tfTitle * 2.5) + (tfKeywords * 2.0) + (tfRingkasan * 1.4) + (tfContent * 1.0);

                if (rawTf > 0) {
                    const numerator = weightedTf * (bm25K1 + 1);
                    const denominator = weightedTf + (bm25K1 * lengthPenalty);
                    const tScore = idf * (numerator / denominator);
                    totalBM25 += tScore;

                    termExps.push({
                        term,
                        idf: Number(idf.toFixed(2)),
                        tf: rawTf,
                        score: Number(tScore.toFixed(2))
                    });
                }
            });

            // Exact phrase match bonus
            const lowerQuery = trimmed.toLowerCase();
            if (trimmed.includes(' ') && (
                doc.judul.toLowerCase().includes(lowerQuery) || 
                doc.nomor.toLowerCase().includes(lowerQuery) ||
                doc.ringkasan.toLowerCase().includes(lowerQuery)
            )) {
                totalBM25 += totalBM25 > 0 ? totalBM25 * 0.25 : 1.5;
            }

            bm25Map.set(doc.id, { score: Number(totalBM25.toFixed(2)), termExps });
        });

        // Rank candidates by BM25
        const bm25Ranked = [...candidateSearchSpace].sort((a, b) => {
            const scoreA = bm25Map.get(a.id)?.score || 0;
            const scoreB = bm25Map.get(b.id)?.score || 0;
            return scoreB - scoreA;
        });

        const bm25Ranks = new Map<string, number>();
        bm25Ranked.forEach((doc, idx) => {
            bm25Ranks.set(doc.id, idx + 1);
        });

        // --------------------------------------------------------------------
        // TAHAP 1 - CABANG 2: Semantic Vector Search (Embedding Cosine Sim)
        // --------------------------------------------------------------------
        const queryVector = computeSemanticEmbedding(trimmed, effectiveTokens);
        const vectorScores = new Map<string, number>();

        candidateSearchSpace.forEach(doc => {
            const docVec = documentEmbeddingsCache.get(doc.id) || computeSemanticEmbedding(`${doc.nomor} ${doc.judul} ${doc.ringkasan}`, doc.keywords);
            const sim = cosineSimilarity(queryVector, docVec);
            vectorScores.set(doc.id, Number(sim.toFixed(4)));
        });

        // Rank candidates by Vector Cosine Similarity
        const vectorRanked = [...candidateSearchSpace].sort((a, b) => {
            const simA = vectorScores.get(a.id) || 0;
            const simB = vectorScores.get(b.id) || 0;
            return simB - simA;
        });

        const vectorRanks = new Map<string, number>();
        vectorRanked.forEach((doc, idx) => {
            vectorRanks.set(doc.id, idx + 1);
        });

        // --------------------------------------------------------------------
        // TAHAP 1 - PENGGABUNGAN: Reciprocal Rank Fusion (RRF)
        // RRF(d) = w1 / (k + rank_bm25) + w2 / (k + rank_vec)
        // --------------------------------------------------------------------
        const rrfScores = new Map<string, number>();

        candidateSearchSpace.forEach(doc => {
            const rBM25 = bm25Ranks.get(doc.id) || candidateSearchSpace.length + 1;
            const rVec = vectorRanks.get(doc.id) || candidateSearchSpace.length + 1;

            const rrfVal = (weightBM25 / (rrfK + rBM25)) + (weightVector / (rrfK + rVec));
            rrfScores.set(doc.id, Number(rrfVal.toFixed(5)));
        });

        // Rank all candidates by RRF score descending
        const rrfRanked = [...candidateSearchSpace].sort((a, b) => {
            const scoreA = rrfScores.get(a.id) || 0;
            const scoreB = rrfScores.get(b.id) || 0;
            return scoreB - scoreA;
        });

        const stage1End = performance.now();
        const stage1Latency = Math.max(1, Math.round(stage1End - stage1Start));

        // --------------------------------------------------------------------
        // TAHAP 2: Cross-Encoder Re-Ranking (Top 50 / Top K Candidate Selection)
        // --------------------------------------------------------------------
        const stage2Start = performance.now();

        // Select Top K candidates from RRF (default 50 or total available)
        const effectiveTopK = Math.min(topKStage2, rrfRanked.length);
        const topCandidates = rrfRanked.slice(0, effectiveTopK);

        // Process through Cross-Encoder Model
        const crossEncoderResults: PipelineCandidate[] = [];

        topCandidates.forEach((doc, idx) => {
            const ceOutput = evaluateCrossEncoder(trimmed, doc);
            const bm25Data = bm25Map.get(doc.id) || { score: 0, termExps: [] };

            // Apply Cross-Encoder minimum threshold filter
            if (ceOutput.finalScore >= crossEncoderThreshold) {
                crossEncoderResults.push({
                    doc,
                    bm25Score: bm25Data.score,
                    bm25Rank: bm25Ranks.get(doc.id) || (idx + 1),
                    bm25Terms: bm25Data.termExps,
                    vectorSimilarity: vectorScores.get(doc.id) || 0,
                    vectorRank: vectorRanks.get(doc.id) || (idx + 1),
                    rrfScore: rrfScores.get(doc.id) || 0,
                    rrfRank: idx + 1,
                    crossEncoderScore: ceOutput.finalScore,
                    crossEncoderRank: 0, // set after sorting
                    crossEncoderDetails: ceOutput,
                    highlightSnippet: doc.ringkasan
                });
            }
        });

        // Final sorting strictly by Cross-Encoder score descending
        crossEncoderResults.sort((a, b) => b.crossEncoderScore - a.crossEncoderScore);
        crossEncoderResults.forEach((cand, index) => {
            cand.crossEncoderRank = index + 1;
        });

        const stage2End = performance.now();
        const stage2Latency = Math.max(1, Math.round(stage2End - stage2Start));
        const totalLatency = Math.max(1, Math.round(stage2End - overallStart));

        setPipelineResults(crossEncoderResults);
        setPipelineMetrics({
            totalCorpus: kemenkeuDocDatabase.length,
            preFilteredCount: candidateSearchSpace.length,
            stage1LatencyMs: stage1Latency,
            stage2LatencyMs: stage2Latency,
            totalLatencyMs: totalLatency,
            stage1CandidatesCount: candidateSearchSpace.length,
            stage2TopKEvaluated: effectiveTopK,
            finalResultsCount: crossEncoderResults.length,
            queryTokens: effectiveTokens
        });

        setIsSearching(false);
    };

    // Trigger re-search when category pre-filter or pipeline parameters change (FR-SRC-02, FR-SRC-03)
    useEffect(() => {
        if (hasSearched && searchQuery.trim()) {
            executeTwoStagePipelineSearch(searchQuery);
        }
    }, [docTypeFilter, rrfK, topKStage2, crossEncoderThreshold, weightBM25, weightVector, bm25K1, bm25B]);

    // Handle suggested search clicks
    const suggestedSearches = [
        "Sengketa Aset Lapangan Banteng",
        "PMK Bantuan Hukum Pegawai",
        "Pemberhentian PNS Ditjen Pajak",
        "Ekspor Mineral Mentah Bea Cukai",
        "Undang-Undang Keuangan Negara",
        "Gugatan Derden Verzet BMN",
        "Hak Mendahulu Tagihan Pajak Pailit"
    ];

    const handleSuggestedClick = (text: string) => {
        setSearchQuery(text);
        executeTwoStagePipelineSearch(text);
    };

    // Helper to highlight terms in text snippets (FR-SRC-04)
    const renderHighlightedSnippet = (text: string, terms: string[]) => {
        if (!terms || terms.length === 0) return text;
        const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(t => t.length > 1);
        if (escaped.length === 0) return text;

        const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
        const parts = text.split(regex);

        return (
            <span>
                {parts.map((part, index) => {
                    const isMatch = terms.some(t => t.toLowerCase() === part.toLowerCase());
                    return isMatch ? (
                        <mark key={index} className="bg-amber-100 text-amber-950 font-semibold px-0.5 rounded">
                            {part}
                        </mark>
                    ) : (
                        <span key={index}>{part}</span>
                    );
                })}
            </span>
        );
    };

    // Helper for rendering high-attention highlighted legal text (FR-SRC-04)
    const renderFullTextWithAttention = (fullText: string, attentionSentences: string[], queryTokens: string[]) => {
        const paragraphs = fullText.split('\n');

        return (
            <div className="space-y-3 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-wrap select-all">
                {paragraphs.map((p, pIdx) => {
                    if (!p.trim()) return <div key={pIdx} className="h-2" />;

                    // Check if this paragraph contains any of the top attention sentences
                    const isHighAttention = attentionSentences.some(att => p.toLowerCase().includes(att.toLowerCase().slice(0, 40)));

                    return (
                        <div 
                            key={pIdx} 
                            className={`p-2.5 rounded transition ${
                                isHighAttention 
                                    ? 'bg-amber-50/70 border-l-4 border-amber-500 shadow-2xs' 
                                    : 'hover:bg-slate-50'
                            }`}
                        >
                            {isHighAttention && (
                                <div className="text-[10px] font-sans font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                                    <span>Segmen Relevansi Tinggi (Bobot Atensi Cross-Encoder)</span>
                                </div>
                            )}
                            <p>{renderHighlightedSnippet(p, queryTokens)}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    // FR-SRC-05: Action Handlers (Unduh, Cetak, Salin)
    const handleCopyText = (text: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            showToast('Naskah teks lengkap berhasil disalin ke clipboard.');
        } else {
            showToast('Clipboard API tidak didukung peramban.');
        }
    };

    const handlePrintDoc = () => {
        window.print();
    };

    const handleDownloadDoc = (doc: LegalDoc) => {
        // Create mock downloadable text blob representing physical PDF repository
        const element = document.createElement('a');
        const file = new Blob([
            `KEMENTERIAN KEUANGAN REPUBLIK INDONESIA\nSALINAN RESMI BERKAS HUKUM\n\n` +
            `Nomor: ${doc.nomor}\nJudul: ${doc.judul}\nKategori: ${doc.kategori}\nTanggal: ${doc.tanggal}\n` +
            `Instansi: ${doc.instansiPenerbit}\nKutipan: ${doc.citation || doc.nomor}\n\n` +
            `RINGKASAN:\n${doc.ringkasan}\n\n` +
            `NASKAH LENGKAP:\n${doc.kontenLengkap}\n\n` +
            `Diunduh melalui Portal e-Advokasi Satu Kemenkeu pada: ${new Date().toLocaleString('id-ID')}`
        ], { type: 'text/plain;charset=utf-8' });

        element.href = URL.createObjectURL(file);
        element.download = `${doc.nomor.replace(/[^a-z0-9]/gi, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        showToast(`Mengunduh berkas fisik resmi: ${doc.nomor} (${doc.fileSize})`);
    };

    return (
        <div id="pencarian-dokumen-container" className="space-y-5">
            
            {/* Toast Notification Container */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center space-x-2 border border-slate-700"
                    >
                        <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FR-SRC-06 / UI-SRC-06: Breadcrumb Header: Home > Pencarian > Dokumen */}
            <div className="bg-white rounded-lg border border-slate-200 px-4 py-2.5 shadow-xs">
                <nav aria-label="Breadcrumb" className="flex items-center">
                    <ol className="flex items-center space-x-2 text-xs">
                        <li className="flex items-center">
                            <button
                                type="button"
                                onClick={() => onNavigate('eAdvokasiBeranda')}
                                className="flex items-center text-slate-500 hover:text-[#0055A5] font-medium transition cursor-pointer"
                                title="Kembali ke Beranda"
                            >
                                <HomeIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                <span>Home</span>
                            </button>
                        </li>
                        <li className="flex items-center text-slate-400">
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                        </li>
                        <li className="flex items-center">
                            <button
                                type="button"
                                onClick={() => onNavigate('eAdvokasiPencarian')}
                                className="text-slate-500 hover:text-[#0055A5] font-medium transition cursor-pointer"
                                title="Kembali ke Modul Pencarian"
                            >
                                Pencarian
                            </button>
                        </li>
                        <li className="flex items-center text-slate-400">
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                        </li>
                        <li className="flex items-center font-bold text-[#0055A5]">
                            Dokumen
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Search Box & Controls Container */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
                
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">
                            Pencarian Dokumen
                        </h2>
                    </div>

                    {/* FR-SRC-03: Parameter Button */}
                    <button
                        type="button"
                        onClick={() => setShowPipelineDrawer(!showPipelineDrawer)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition flex items-center space-x-1.5 cursor-pointer ${
                            showPipelineDrawer 
                                ? 'bg-blue-50 text-[#0055A5] border-[#0055A5] ring-2 ring-blue-100'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                        title="Buka Konfigurasi Parameter"
                    >
                        <AdjustmentsIcon className="h-3.5 w-3.5 text-[#0055A5]" />
                        <span>Parameter</span>
                        <ChevronDownIcon className={`h-3 w-3 transition-transform ${showPipelineDrawer ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* FR-SRC-01 / UI-SRC-01: Main Search Bar */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    executeTwoStagePipelineSearch(searchQuery);
                                }
                            }}
                            placeholder="Ketik kueri hukum (contoh: Lapangan Banteng, PTDH PNS DJP, Ekspor Bea Cukai, UU Keuangan Negara)..."
                            className="w-full pl-9 pr-8 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-[#0055A5] focus:ring-1 focus:ring-[#0055A5] transition outline-none"
                        />
                        <SearchIcon className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setPipelineResults([]);
                                    setHasSearched(false);
                                }}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                                title="Hapus Kueri"
                            >
                                <XIcon className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={isSearching || !searchQuery.trim()}
                        onClick={() => executeTwoStagePipelineSearch(searchQuery)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0055A5] hover:bg-[#004282] disabled:bg-slate-300 disabled:cursor-not-allowed rounded-md shadow-2xs transition flex items-center justify-center space-x-1.5 cursor-pointer min-w-[120px]"
                    >
                        {isSearching ? (
                            <>
                                <RefreshIcon className="animate-spin h-3.5 w-3.5 text-white" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <SearchIcon className="h-3.5 w-3.5" />
                                <span>Cari Dokumen</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Popular Query Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">Rekomendasi:</span>
                    {suggestedSearches.map((phrase, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSuggestedClick(phrase)}
                            className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 px-2.5 py-1 rounded transition border border-slate-200/70 cursor-pointer"
                        >
                            {phrase}
                        </button>
                    ))}
                </div>

                {/* FR-SRC-03 / UI-SRC-03: Collapsible Pipeline Parameters Drawer */}
                <AnimatePresence>
                    {showPipelineDrawer && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pt-2 border-t border-slate-200"
                        >
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                                            <span>Konfigurasi</span>
                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                                                Active Config
                                            </span>
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Pengaturan konstanta RRF, batas kandidat Top K, dan ambang batas minimum skor Cross-Encoder.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRrfK(60);
                                            setTopKStage2(50);
                                            setCrossEncoderThreshold(0.25);
                                            setWeightBM25(1.0);
                                            setWeightVector(1.0);
                                            setBm25K1(1.5);
                                            setBm25B(0.75);
                                        }}
                                        className="text-xs text-[#0055A5] hover:underline font-semibold cursor-pointer"
                                    >
                                        Reset ke Baku
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                                    {/* 1. RRF Constant k */}
                                    <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-700">RRF Constant (k)</span>
                                            <span className="font-mono font-bold text-[#0055A5] bg-blue-50 px-1.5 py-0.5 rounded">
                                                k = {rrfK}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="120"
                                            step="5"
                                            value={rrfK}
                                            onChange={(e) => setRrfK(parseInt(e.target.value, 10))}
                                            className="w-full accent-[#0055A5] h-1.5 bg-slate-200 rounded cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>10 (Agresif)</span>
                                            <span>Baku: 60</span>
                                            <span>120 (Rata)</span>
                                        </div>
                                    </div>

                                    {/* 2. Top K Candidates passed to Stage 2 */}
                                    <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-700">Kandidat Top K</span>
                                            <span className="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                                Top {topKStage2}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5"
                                            max="100"
                                            step="5"
                                            value={topKStage2}
                                            onChange={(e) => setTopKStage2(parseInt(e.target.value, 10))}
                                            className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>5</span>
                                            <span>Baku: 50 Dokumen</span>
                                            <span>100</span>
                                        </div>
                                    </div>

                                    {/* 3. Cross-Encoder Threshold */}
                                    <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-700">Ambang Cross-Encoder</span>
                                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                ≥ {(crossEncoderThreshold * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.05"
                                            max="0.85"
                                            step="0.05"
                                            value={crossEncoderThreshold}
                                            onChange={(e) => setCrossEncoderThreshold(parseFloat(e.target.value))}
                                            className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>5% (Longgar)</span>
                                            <span>Baku: 25%</span>
                                            <span>85% (Ketat)</span>
                                        </div>
                                    </div>

                                    {/* 4. Weight BM25 vs Vector */}
                                    <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-700">Bobot BM25 vs Vector</span>
                                            <span className="font-mono text-slate-700 text-[11px]">
                                                BM25: <strong>{weightBM25.toFixed(1)}</strong> • Vec: <strong>{weightVector.toFixed(1)}</strong>
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="range"
                                                min="0.2"
                                                max="2.0"
                                                step="0.1"
                                                value={weightBM25}
                                                onChange={(e) => setWeightBM25(parseFloat(e.target.value))}
                                                className="w-1/2 accent-[#0055A5] h-1.5 bg-slate-200 rounded cursor-pointer"
                                                title="Bobot BM25"
                                            />
                                            <input
                                                type="range"
                                                min="0.2"
                                                max="2.0"
                                                step="0.1"
                                                value={weightVector}
                                                onChange={(e) => setWeightVector(parseFloat(e.target.value))}
                                                className="w-1/2 accent-teal-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                                                title="Bobot Vector"
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>BM25 Leksikal</span>
                                            <span>Baku: 1.0 : 1.0</span>
                                            <span>Vector Semantik</span>
                                        </div>
                                    </div>

                                    {/* 5. BM25 k1 */}
                                    <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-700">BM25 Kejenuhan TF (k₁)</span>
                                            <span className="font-mono font-bold text-slate-700 text-[11px]">
                                                {bm25K1.toFixed(2)}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2.5"
                                            step="0.1"
                                            value={bm25K1}
                                            onChange={(e) => setBm25K1(parseFloat(e.target.value))}
                                            className="w-full accent-slate-700 h-1.5 bg-slate-200 rounded cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>0.5 (Cepat Jenuh)</span>
                                            <span>Baku: 1.50</span>
                                            <span>2.5 (Sensitif TF)</span>
                                        </div>
                                    </div>

                                    {/* 6. BM25 b */}
                                    <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-700">BM25 Penalti Panjang (b)</span>
                                            <span className="font-mono font-bold text-slate-700 text-[11px]">
                                                {bm25B.toFixed(2)}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.0"
                                            max="1.0"
                                            step="0.05"
                                            value={bm25B}
                                            onChange={(e) => setBm25B(parseFloat(e.target.value))}
                                            className="w-full accent-slate-700 h-1.5 bg-slate-200 rounded cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>0.0 (Tanpa Penalti)</span>
                                            <span>Baku: 0.75</span>
                                            <span>1.0 (Penalti Penuh)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Preset Buttons */}
                                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/80">
                                    <span className="text-[11px] font-semibold text-slate-500">Preset Rekomendasi:</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRrfK(60);
                                            setTopKStage2(50);
                                            setCrossEncoderThreshold(0.25);
                                            setWeightBM25(1.0);
                                            setWeightVector(1.0);
                                        }}
                                        className="text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 cursor-pointer"
                                    >
                                        Standar (RRF k=60, Top 50, CE ≥25%)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRrfK(50);
                                            setTopKStage2(25);
                                            setCrossEncoderThreshold(0.50);
                                            setWeightBM25(1.0);
                                            setWeightVector(1.2);
                                        }}
                                        className="text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 cursor-pointer"
                                    >
                                        Presisi Tinggi (Cross-Encoder Ketat ≥50%)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRrfK(80);
                                            setTopKStage2(80);
                                            setCrossEncoderThreshold(0.10);
                                            setWeightBM25(1.0);
                                            setWeightVector(1.0);
                                        }}
                                        className="text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 cursor-pointer"
                                    >
                                        Recall Luas (Cakupan Maksimal)
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FR-SRC-02 / UI-SRC-02: Pre-Filtering Category Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1 border-b sm:border-b-0 border-slate-200">
                        {[
                            { key: 'all', label: 'Semua', count: kemenkeuDocDatabase.length },
                            { key: 'putusan', label: 'Putusan', count: kemenkeuDocDatabase.filter(d => matchDocCategory(d.type, 'putusan')).length },
                            { key: 'regulasi', label: 'Regulasi', count: kemenkeuDocDatabase.filter(d => matchDocCategory(d.type, 'regulasi')).length },
                            { key: 'litigasi', label: 'Dokumen Litigasi', count: kemenkeuDocDatabase.filter(d => matchDocCategory(d.type, 'litigasi')).length },
                            { key: 'permohonan', label: 'Permohonan', count: kemenkeuDocDatabase.filter(d => matchDocCategory(d.type, 'permohonan')).length },
                            { key: 'laporan', label: 'Laporan', count: kemenkeuDocDatabase.filter(d => matchDocCategory(d.type, 'laporan')).length },
                            { key: 'dalil', label: 'Dalil', count: kemenkeuDocDatabase.filter(d => matchDocCategory(d.type, 'dalil')).length },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setDocTypeFilter(tab.key as DocCategory)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                                    docTypeFilter === tab.key
                                        ? 'bg-[#0055A5] text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label} <span className="opacity-75 text-[10px]">({tab.count})</span>
                            </button>
                        ))}
                    </div>

                    {/* Quick result summary */}
                    {pipelineMetrics && (
                        <div className="text-[11px] text-slate-500 font-medium">
                            Ditemukan <strong className="text-slate-900">{pipelineResults.length}</strong> dokumen relevan 
                            (Pre-Filter: <span className="text-[#0055A5] font-mono">{pipelineMetrics.preFilteredCount}</span> dok)
                        </div>
                    )}
                </div>

            </div>

            {/* Results Section */}
            <div className="space-y-3">
                {isSearching ? (
                    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-xs">
                        <RefreshIcon className="animate-spin h-8 w-8 text-[#0055A5] mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-slate-800">Mengeksekusi Two-Stage Search Pipeline</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                            Tahap 1: Menjalankan BM25 leksikal dan Vector Search semantik secara paralel, menggabungkan peringkat via Reciprocal Rank Fusion (RRF)...<br/>
                            Tahap 2: Menerapkan Cross-Encoder joint attention model untuk melakukan re-ranking presisi tinggi...
                        </p>
                    </div>
                ) : pipelineResults.length > 0 ? (
                    <div className="space-y-3">
                        {pipelineResults.map((candidate) => {
                            const { doc, crossEncoderScore, crossEncoderRank, rrfScore, rrfRank, bm25Score, bm25Rank, vectorSimilarity, vectorRank, highlightSnippet } = candidate;
                            const cePercentage = (crossEncoderScore * 100).toFixed(1);

                            return (
                                <div 
                                    key={doc.id}
                                    className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 p-5 shadow-xs transition-all space-y-3"
                                >
                                    {/* Card Header & Badges */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Document Type Badge */}
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                    doc.type === 'yurisprudensi' || doc.type === 'putusan'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : doc.type === 'regulasi'
                                                            ? 'bg-blue-100 text-[#0055A5]'
                                                            : doc.type === 'permohonan'
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : doc.type === 'laporan'
                                                                    ? 'bg-rose-100 text-rose-800'
                                                                    : doc.type === 'dalil'
                                                                        ? 'bg-teal-100 text-teal-800'
                                                                        : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                    {doc.type === 'yurisprudensi' || doc.type === 'putusan' ? 'Putusan' :
                                                     doc.type === 'regulasi' ? 'Regulasi' :
                                                     doc.type === 'permohonan' ? 'Permohonan' :
                                                     doc.type === 'laporan' ? 'Laporan' :
                                                     doc.type === 'dalil' ? 'Dalil' : 'Dokumen Litigasi'}
                                                </span>

                                                {/* Nomor Berkas */}
                                                <span className="text-xs font-mono font-bold text-slate-700">
                                                    {doc.nomor}
                                                </span>

                                                <span className="text-slate-300">•</span>

                                                {/* Instansi Penerbit */}
                                                <span className="text-xs text-slate-500">
                                                    {doc.instansiPenerbit}
                                                </span>

                                                <span className="text-slate-300">•</span>

                                                {/* Tanggal */}
                                                <span className="text-xs text-slate-500">
                                                    {doc.tanggal}
                                                </span>
                                            </div>

                                            {/* FR-SRC-04: Judul Dokumen (Click opens Preview) */}
                                            <h3 
                                                onClick={() => {
                                                    setViewedDoc(doc);
                                                    setViewedPipelineCandidate(candidate);
                                                }}
                                                className="text-base font-bold text-slate-900 hover:text-[#0055A5] cursor-pointer transition pt-0.5 leading-snug"
                                                title="Klik untuk membuka Pratinjau Lengkap Dokumen"
                                            >
                                                {renderHighlightedSnippet(doc.judul, pipelineMetrics?.queryTokens || [])}
                                            </h3>
                                        </div>

                                        {/* Skor Indicator: only show Skor: xx% */}
                                        <div className="flex flex-col sm:items-end flex-shrink-0">
                                            <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                                                <span className="text-xs font-semibold text-emerald-800">
                                                    Skor:
                                                </span>
                                                <span className="text-xs font-mono font-bold text-emerald-700">
                                                    {cePercentage}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ringkasan Dokumen */}
                                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded border border-slate-100">
                                        {renderHighlightedSnippet(highlightSnippet, pipelineMetrics?.queryTokens || [])}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                                        <div className="flex items-center space-x-2">
                                            {/* Pratinjau Dokumen Button (FR-SRC-04) */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setViewedDoc(doc);
                                                    setViewedPipelineCandidate(candidate);
                                                }}
                                                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                                                title="Pratinjau naskah dokumen lengkap"
                                            >
                                                <EyeIcon className="h-3.5 w-3.5 text-slate-500" />
                                                <span>Pratinjau Dokumen</span>
                                            </button>

                                            {/* Unduh PDF Button (FR-SRC-05) */}
                                            <button
                                                type="button"
                                                onClick={() => handleDownloadDoc(doc)}
                                                className="px-3 py-1.5 text-xs font-semibold text-[#0055A5] bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200 rounded transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                                                title="Unduh berkas fisik resmi (PDF)"
                                            >
                                                <DownloadIcon className="h-3.5 w-3.5 text-[#0055A5]" />
                                                <span>Unduh PDF ({doc.fileSize})</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : hasSearched ? (
                    <div className="bg-white rounded-lg border border-slate-200 p-10 text-center shadow-xs">
                        <InformationCircleIcon className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-slate-800">Tidak Ada Dokumen yang Lolos Ambang Batas Cross-Encoder</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Tidak ada dokumen dalam kategori <strong>{docTypeFilter.toUpperCase()}</strong> yang mencapai ambang batas Cross-Encoder ≥ {(crossEncoderThreshold * 100).toFixed(0)}%.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2">
                            <button
                                type="button"
                                onClick={() => setCrossEncoderThreshold(0.1)}
                                className="px-3.5 py-1.5 text-xs font-semibold text-[#0055A5] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition cursor-pointer"
                            >
                                Turunkan Ambang Batas ke 10%
                            </button>
                            <button
                                type="button"
                                onClick={() => setDocTypeFilter('all')}
                                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition cursor-pointer"
                            >
                                Tampilkan Semua Kategori
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0055A5] mx-auto flex items-center justify-center">
                            <SearchIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">Pencari Dokumen</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                            Ketik kata kunci hukum pada bilah pencarian.
                        </p>
                    </div>
                )}
            </div>

            {/* ================================================================ */}
            {/* FR-SRC-04 / FR-SRC-05: MODAL PRATINJAU DETAIL DOKUMEN LAYAR PENUH */}
            {/* ================================================================ */}
            <AnimatePresence>
                {viewedDoc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 pointer-events-auto"
                        onClick={() => setViewedDoc(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.98, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.98, y: 15 }}
                            className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden border border-slate-200 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header: Satu Kemenkeu Official Bar */}
                            <div className="p-4 bg-[#0055A5] text-white flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center text-white font-bold text-base">
                                        ⚖
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-blue-200 font-semibold uppercase tracking-wider">
                                            Satu Kemenkeu
                                        </div>
                                        <h3 className="text-sm font-bold text-white leading-tight">
                                            {viewedDoc.nomor}
                                        </h3>
                                    </div>
                                </div>

                                {/* Header Actions (FR-SRC-05) */}
                                <div className="flex items-center space-x-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleCopyText(viewedDoc.kontenLengkap)}
                                        className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded transition cursor-pointer"
                                        title="Salin Teks Lengkap ke Clipboard"
                                    >
                                        <ClipboardCopyIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePrintDoc}
                                        className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded transition cursor-pointer"
                                        title="Cetak Dokumen (Print Spooler)"
                                    >
                                        <PrinterIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewedDoc(null)}
                                        className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded transition cursor-pointer"
                                        title="Tutup Pratinjau"
                                    >
                                        <XIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body: Metadata & Full Text */}
                            <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
                                
                                {/* Metadata Grid */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Klasifikasi:</span>
                                        <p className="font-semibold text-slate-800 mt-0.5">{viewedDoc.kategori}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Instansi Penerbit:</span>
                                        <p className="font-semibold text-slate-800 mt-0.5">{viewedDoc.instansiPenerbit}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Terbit:</span>
                                        <p className="font-semibold text-slate-800 mt-0.5">{viewedDoc.tanggal}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Kutipan / Berkas:</span>
                                        <p className="font-semibold text-slate-800 mt-0.5">{viewedDoc.citation || viewedDoc.nomor} ({viewedDoc.fileSize})</p>
                                    </div>
                                </div>

                                {/* Score Badge Bar inside modal */}
                                {viewedPipelineCandidate && (
                                    <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-emerald-900">Skor:</span>
                                            <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                                {(viewedPipelineCandidate.crossEncoderScore * 100).toFixed(1)}%
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <label className="text-[11px] text-slate-600 font-medium flex items-center space-x-1 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={showOnlyAttentionText}
                                                    onChange={(e) => setShowOnlyAttentionText(e.target.checked)}
                                                    className="accent-[#0055A5] h-3.5 w-3.5 rounded cursor-pointer"
                                                />
                                                <span>Sorot Segmen Perhatian Tinggi (Attention Highlights)</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Title Header */}
                                <div className="space-y-1">
                                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                                        {viewedDoc.judul}
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Nomor Berkas Resmi: <span className="font-mono font-semibold text-slate-700">{viewedDoc.nomor}</span>
                                    </p>
                                </div>

                                {/* Ringkasan Substansi */}
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                        Ringkasan Substansi:
                                    </h4>
                                    <div className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-md border border-amber-200/70 leading-relaxed">
                                        {renderHighlightedSnippet(viewedDoc.ringkasan, pipelineMetrics?.queryTokens || [])}
                                    </div>
                                </div>

                                {/* Naskah Lengkap with Attention / Keyword Highlighting (FR-SRC-04) */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                            Naskah Lengkap (Full Text):
                                        </h4>
                                        <span className="text-[11px] text-slate-400 font-mono">
                                            {viewedDoc.kontenLengkap.length} Karakter
                                        </span>
                                    </div>

                                    <div className="bg-white border border-slate-200 p-5 rounded-lg border-l-4 border-l-[#0055A5] shadow-2xs">
                                        {showOnlyAttentionText && viewedPipelineCandidate ? (
                                            renderFullTextWithAttention(
                                                viewedDoc.kontenLengkap,
                                                viewedPipelineCandidate.crossEncoderDetails.highAttentionSentences,
                                                pipelineMetrics?.queryTokens || []
                                            )
                                        ) : (
                                            <div className="space-y-2 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-wrap select-all">
                                                {viewedDoc.kontenLengkap}
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* Modal Footer: Action Buttons (FR-SRC-05) */}
                            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs flex-shrink-0">
                                <span className="text-slate-500 text-[11px]">
                                    Format: Berkas Salinan Resmi PDF ({viewedDoc.fileSize})
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCopyText(viewedDoc.kontenLengkap)}
                                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                                    >
                                        <ClipboardCopyIcon className="h-3.5 w-3.5 text-slate-600" />
                                        <span>Salin Naskah</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePrintDoc}
                                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                                    >
                                        <PrinterIcon className="h-3.5 w-3.5 text-slate-600" />
                                        <span>Cetak Dokumen</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadDoc(viewedDoc)}
                                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0055A5] hover:bg-[#004282] rounded shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
                                    >
                                        <DownloadIcon className="h-3.5 w-3.5" />
                                        <span>Unduh PDF Resmi</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
export default CariDokumen;
