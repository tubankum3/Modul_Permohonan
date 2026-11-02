import { 
  Permohonan, 
  JenisPermohonan, 
  StatusPermohonan, 
  BerandaContent, 
  FaqCategory, 
  PendampinganRecord, 
  StatusPendampingan, 
  PerkaraRecord, 
  StatusPerkara,
  StatusPutusan,
  UserAccount,
  TelaahanRecord,
  StatusTelaahan,
  StatusNaskahTelaahan
} from './types';

export const initialPermohonan: Permohonan[] = [
    {
    id: '11223344',
    Nomor: 'ND-123/PB.01/2026',
    pemohon: 'Kepala Seksi Pembinaan Proses Bisnis dan Hukum II',
    unit: 'Direktorat Sistem Perbendaharaan, Ditjen Perbendaharaan',
    tanggal: '12/01/2026',
    jenis: JenisPermohonan.PENANGANAN_PERKARA,
    perihal: 'Gugatan Perdata, Kemenkeu cq Kanwil DJPb Jawa Tengah cq KPPN Surakarta sebagai Turut Tergugat IV',
    uraian: 'Terdapat gugatan perdata kepada Kemenkeu cq Kanwil DJPb Jawa Tengah cq KPPN Surakarta sebagai Turut Tergugat IV dalam relaas yang disampaikan Pengadilan Negeri Surakarta. Kemenkeu diharapkan hadir dalam sidang pada tanggal 21 Januari 2026',
    files: [{ name: 'Relaas 6.pdf', size: 123456, type: 'application/pdf' }],
    status: StatusPermohonan.DIPROSES,
    history: [],
    sumber: 'Internal',
    disposisi: [
        {
            id: 1,
            pengirim: 'Biro Advokasi (Aloysius Yanis Dhaniarto)',
            tujuan: [
                'Bagian Advokasi I [SJ.41]',
                'Bagian Advokasi II [SJ.42]',
                'Bagian Advokasi III [SJ.43]',
                'Bagian Advokasi IV [SJ.44]',
            ],
            catatan: '-',
            petunjukDisposisi: ['Untuk Perhatian', 'Selesaikan Sesuai Dengan Ketentuan Yang Berlaku'],
            tanggalKirim: '31-01-2026 12:16:02',
        },
        {
            id: 2,
            pengirim: 'Bagian Advokasi III (Pangihutan Siagian)',
            tujuan: [
                'Subbagian Advokasi IIIA [SJ.431]',
                'Subbagian Advokasi IIIB [SJ.432]',
                'Subbagian Advokasi IIIC [SJ.433]',
            ],
            catatan: '',
            petunjukDisposisi: ['Edarkan'],
            tanggalKirim: '02-02-2026 05:36:18',
        },
        {
            id: 3,
            pengirim: 'Subbagian Advokasi IIIA (Dhian Fajar Suryawan)',
            tujuan: [
                'Hendra Cahyono',
                'Arlina Haryuningsih',
                'Made Gde Satria Bela',
                'Haenry Waskito Jati',
                'Dhian Fajar Suryawan',
            ],
            catatan: '',
            petunjukDisposisi: ['Selesaikan Sesuai Dengan Ketentuan Yang Berlaku'],
            tanggalKirim: '02-02-2026 09:01:25',
        }
    ]
  },
  {
    id: '22334455',
    Nomor: '20260115-1abn',
    pemohon: 'Analis Hukum - Seksi Pembinaan Proses Bisnis dan Hukum II',
    unit: 'Direktorat Sistem Perbendaharaan, Ditjen Perbendaharaan',
    jenis: JenisPermohonan.PENDAMPINGAN,
    perihal: 'Permohonan bantuan pendampingan saksi OTT',
    uraian: 'Sehubungan dengan adanya OTT, kami memohon pendampingan untuk pemeriksaan di kejaksaan.',
    files: [{ name: 'panggilan.pdf', size: 123456, type: 'application/pdf' }],
    status: StatusPermohonan.TERKIRIM,
    tanggal: '15/01/2026',
    history: [
      { id: 1, author: 'Pegawai', message: 'Mohon agar segera ditindaklanjuti.', files: [], timestamp: new Date('2026-01-15T09:00:00') },
      { id: 2, author: 'Administrator', message: 'Permohonan diterima dan sedang diproses.', files: [], timestamp: new Date('2026-01-16T11:30:00') }
    ],
    sumber: 'Internal',
    disposisi: [
        {
            id: 1,
            pengirim: 'Biro Advokasi (Rofii Edy Purnomo)',
            tujuan: [
                'Bagian Advokasi I [SJ.41]',
                'Bagian Advokasi II [SJ.42]',
                'Bagian Advokasi III [SJ.43]',
                'Bagian Advokasi IV [SJ.44]',
            ],
            catatan: '-',
            petunjukDisposisi: ['Untuk Perhatian', 'Selesaikan Sesuai Dengan Ketentuan Yang Berlaku'],
            tanggalKirim: '31-01-2026 12:16:02',
        },
        {
            id: 2,
            pengirim: 'Bagian Advokasi III (Helda Anggraini Octavina)',
            tujuan: [
                'Subbagian Advokasi IIIA [SJ.431]',
                'Subbagian Advokasi IIIB [SJ.432]',
                'Subbagian Advokasi IIIC [SJ.433]',
            ],
            catatan: '',
            petunjukDisposisi: ['Edarkan'],
            tanggalKirim: '02-02-2026 05:36:18',
        },
        {
            id: 3,
            pengirim: 'Subbagian Advokasi IIIA (Lulus Hadi Purnawan)',
            tujuan: [
                'Hendra Cahyono',
            ],
            catatan: '',
            petunjukDisposisi: ['Selesaikan Sesuai Dengan Ketentuan Yang Berlaku'],
            tanggalKirim: '02-02-2026 09:01:25',
        }
    ]
  },
  {
    id: '33445566',
    Nomor: '20251023-1abc',
    pemohon: 'Analis Hukum - Seksi Pembinaan Proses Bisnis dan Hukum II',
    unit: 'Direktorat Sistem Perbendaharaan, Ditjen Perbendaharaan',
    jenis: JenisPermohonan.PENDAMPINGAN,
    perihal: 'Permohonan pendampingan ahli hukum keuangan negara di PN Jakarta Pusat',
    uraian: 'Mohon pendampingan hukum terkait penyusunan dan review dokumen penganggaran TA 2025.',
    files: [{ name: 'suratKPK.pdf', size: 123456, type: 'application/pdf' }],
    status: StatusPermohonan.DIPROSES,
    tanggal: '23/10/2025',
    history: [
      { id: 1, author: 'Pegawai', message: 'Mohon didampingi untuk pemberian keterangan ahli.', files: [], timestamp: new Date('2025-10-23T14:00:00') },
      { id: 2, author: 'Administrator', message: 'Permohonan diterima dan sedang diproses.', files: [], timestamp: new Date('2025-10-24T11:30:00') },
      { id: 3, author: 'Administrator', message: 'Pendampingan akan dilakukan oleh Sdr. X.', files: [{ name: 'ST.pdf', size: 123456, type: 'application/pdf' }], timestamp: new Date('2026-01-16T11:30:00') }
    ],
    sumber: 'Internal',
  },
    {
    id: '44556677',
    pemohon: 'Analis Hukum - Seksi Pembinaan Proses Bisnis dan Hukum II',
    unit: 'Direktorat Sistem Perbendaharaan, Ditjen Perbendaharaan',
    jenis: JenisPermohonan.PENDAMPINGAN,
    perihal: 'Draft Permohonan Bantuan Pendampingan Saksi Perkara DAK',
    uraian: 'Permohonan untuk bantuan hukum terkait masalah Dana alokasi khusus.',
    files: [{ name: 'suratSPGL DAK.pdf', size: 123, type: 'application/pdf' }],
    status: StatusPermohonan.DRAFT,
    tanggal: '15/07/2024',
    history: [],
    sumber: 'Internal',
  },
  {
    id: '77889900',
    Nomor: '20240601-5xyz',
    pemohon: 'Kepala Bidang Hukum',
    unit: 'Direktorat Jenderal Pajak',
    jenis: JenisPermohonan.PENANGANAN_PERKARA,
    perihal: 'Gugatan Selesai Terkait Sengketa Tanah',
    uraian: 'Gugatan terkait sengketa tanah di wilayah X telah selesai dengan putusan yang menguntungkan.',
    files: [{ name: 'putusan.pdf', size: 54321, type: 'application/pdf' }],
    status: StatusPermohonan.SELESAI,
    tanggal: '01/06/2024',
    history: [],
    sumber: 'Internal',
  },
];

export const initialBerandaContent: BerandaContent = {
  pageTitle: "Selamat Datang, [User] di Aplikasi e-Advokasi!",
  flowTitle: "Alur Permohonan Bantuan Hukum",
  flowSteps: [
    { step: 1, title: "Akses e-Advokasi", description: "Pegawai mengakses aplikasi e-Advokasi melalui portal Satu Kemenkeu." },
    { step: 2, title: "Pilih Jenis Permohonan", description: "Memilih jenis permohonan bantuan hukum (Penanganan Perkara/Pendampingan)." },
    { step: 3, title: "Isi Formulir & Unggah Dokumen", description: "Mengisi formulir permohonan dan mengunggah dokumen pendukung." },
    { step: 4, title: "Kirim Permohonan", description: "Permohonan dikirim ke Biro Advokasi untuk diproses lebih lanjut." },
    { step: 5, title: "Terima Bantuan Hukum", description: "Pegawai menerima pendampingan atau bantuan penanganan perkara dari Tim Biro Advokasi." },
  ],
  eAdvokasiTitle: "Tentang E-Advokasi",
  eAdvokasiParagraph1: "E-Advokasi adalah sistem informasi digital yang dikembangkan untuk memfasilitasi proses permohonan bantuan hukum bagi pegawai di lingkungan Kementerian Keuangan. Aplikasi ini bertujuan untuk menyederhanakan alur, meningkatkan transparansi, dan mempercepat respons terhadap permohonan yang masuk.",
  eAdvokasiParagraph2: "Melalui e-Advokasi, pegawai dapat dengan mudah mengajukan permohonan, melacak status, dan berkomunikasi dengan tim dari Biro Advokasi. Sistem ini merupakan bagian dari komitmen Kementerian Keuangan untuk memberikan dukungan hukum yang optimal bagi seluruh jajarannya.",
  carouselImages: [
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1505664173622-b8146bf78162?auto=format&fit=crop&q=80&w=1200",
    "/alur_permohonan.jpg"
  ],
  eAdvokasiHtml: "<p><strong>E-Advokasi</strong> adalah sistem informasi digital yang dikembangkan untuk memfasilitasi proses permohonan bantuan hukum bagi pegawai di lingkungan Kementerian Keuangan. Aplikasi ini bertujuan untuk menyederhanakan alur, meningkatkan transparansi, dan mempercepat respons terhadap permohonan yang masuk.</p><p><br></p><p>Melalui e-Advokasi, pegawai dapat dengan mudah mengajukan permohonan, melacak status, dan berkomunikasi dengan tim dari Biro Advokasi. Sistem ini merupakan bagian dari komitmen Kementerian Keuangan untuk memberikan dukungan hukum yang optimal bagi seluruh jajarannya.</p>",
  quickLinks: [
    { title: "Portal Satu Kemenkeu", url: "https://satu.kemenkeu.go.id" },
    { title: "JDIH Kemenkeu", url: "https://jdih.kemenkeu.go.id" },
    { title: "Kemenkeu RI", url: "https://www.kemenkeu.go.id" }
  ]
};

export const initialFaqData: FaqCategory[] = [
  {
    id: 'cat-1',
    category: 'Umum',
    questions: [
      { id: 'q-1-1', question: 'Apa itu e-Advokasi?', answer: 'E-Advokasi adalah sistem informasi digital yang dikembangkan untuk memfasilitasi proses permohonan bantuan hukum bagi pegawai di lingkungan Kementerian Keuangan.' },
      { id: 'q-1-2', question: 'Siapa saja yang dapat menggunakan layanan ini?', answer: 'Layanan ini dapat digunakan oleh seluruh pegawai aktif di lingkungan Kementerian Keuangan yang memerlukan bantuan hukum terkait tugas kedinasan.' },
      { id: 'q-1-3', question: 'Apakah layanan ini berbayar?', answer: 'Tidak, layanan bantuan hukum yang disediakan melalui e-Advokasi tidak dipungut biaya bagi pegawai Kementerian Keuangan.' },
    ]
  },
  {
    id: 'cat-2',
    category: 'Teknis',
    questions: [
      { id: 'q-2-1', question: 'Bagaimana cara mengajukan permohonan baru?', answer: 'Anda dapat mengajukan permohonan baru dengan mengklik tombol "Buat Permohonan Baru" di halaman Daftar Permohonan, kemudian ikuti langkah-langkah yang tertera.' },
      { id: 'q-2-2', question: 'Format dokumen apa saja yang didukung untuk diunggah?', answer: 'Sistem mendukung format dokumen umum seperti PDF, DOCX, dan JPG. Ukuran maksimal per file adalah 10MB.' },
      { id: 'q-2-3', question: 'Bagaimana cara melacak status permohonan saya?', answer: 'Status permohonan dapat dilihat pada halaman "Daftar Permohonan". Status akan diperbarui secara real-time sesuai dengan progres dari tim Biro Advokasi.' },
    ]
  }
];

export const initialPendampinganRecords: PendampinganRecord[] = [
    {
        id: 'pd-1',
        Nomor: 'ND22/IT/2022',
        pemohon: 'Analis Hukum - Seksi Pembinaan Proses Bisnis dan Hukum II',
        unit: 'Direktorat Jenderal Pajak',
        jenis: JenisPermohonan.PENDAMPINGAN,
        perihal: 'Permohonan pendampingan ahli hukum keuangan negara di PN Jakarta Pusat',
        uraian: 'Mohon pendampingan hukum terkait penyusunan dan review dokumen penganggaran TA 2025.',
        files: [{ name: 'suratKPK.pdf', size: 123456, type: 'application/pdf' }],
        status: StatusPermohonan.DIPROSES,
        tanggal: '23/10/2025',
        history: [],
        statusPendampingan: StatusPendampingan.AKTIF,
        abstraksi: {
            tahunMasuk: 2021,
            nomorTiket: 'ND22/IT/2022',
            unitPemanggil: 'Kejaksaan',
            unitPemohon: 'Direktorat Jenderal Pajak',
            pihakDipanggil: 'Pihak',
            wilayah: 'Riau',
            pokokPermasalahan: 'lorem ipsum',
            keterangan: 'keterangan'
        },
        posisi: [
            { id: 1, suratTugas: 'ST-12/SJ.4/2026', tanggalSuratTugas: '2026-09-15', agenda: 'Pemeriksaan Saksi & Klarifikasi Dokumen Anggaran', tanggalAgenda: '2026-09-25', suratPemanggilan: 'SPGL-402/Ditreskrimsus/2026', pemanggil: ['Penyidik Ditreskrimsus Polda Metro Jaya'], terpanggil: ['Pejabat Pengadaan Kemenkeu'], posisiKasus: 'Penyelidikan', lokasi: 'Ruang Riksa Subdit Fismondev Polda Metro Jaya', durasi: 180, rincian: 'Klarifikasi dan verifikasi dokumen penganggaran dan pembayaran termin TA 2025.', timestamp: new Date('2026-09-15') },
            { id: 2, suratTugas: 'ST-92/SJ.4/2026', tanggalSuratTugas: '2026-09-20', agenda: 'Pemeriksaan Keterangan Tambahan di Kejaksaan Agung RI', tanggalAgenda: '2026-09-30', suratPemanggilan: 'SPGL-88/Pidsus/2026', pemanggil: ['Jampidsus Kejaksaan Agung'], terpanggil: ['Tim Teknis BMN'], posisiKasus: 'Penyidikan', lokasi: 'Gedung Bundar Jampidsus Kejaksaan Agung', durasi: 120, rincian: 'Pemberian keterangan ahli tata kelola keuangan negara.', timestamp: new Date('2026-09-20') },
            { id: 3, suratTugas: 'ST-98/SJ.4/2026', tanggalSuratTugas: '2026-09-22', agenda: 'Batas Penyampaian Tanggapan Tertulis BPK RI atas LHP Kinerja', tanggalAgenda: '2026-10-02', suratPemanggilan: 'SURAT-BPK-19/2026', pemanggil: ['Auditor Utama Investigasi BPK RI'], terpanggil: ['Tim Biro Advokasi & Satker'], posisiKasus: 'Pemeriksaan BPK', lokasi: 'Auditorium BPK RI Pusat', durasi: 240, rincian: 'Batas akhir tenggang waktu penyampaian matriks tindak lanjut rekomendasi audit investigatif.', timestamp: new Date('2026-09-22') },
        ],
        team: [
            { id: '19XXXXX XXXXXX XXXX0', nama: 'Made', nip: '19XXXXX XXXXXX XXXXX', unit: 'Subbagian Advokasi IIIA, Bagian Advokasi III, Biro Advokasi, Sekretariat Jenderal', role: 'Analis Kebijakan', teamRole: 'Editor' },
            { id: '19XXXXX XXXXXX XXXX1', nama: 'Joko', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Ahli Madya', teamRole: 'PIC' },
            { id: '19XXXXX XXXXXX XXXX2', nama: 'Supeno', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Ahli Muda', teamRole: 'PIC' },
            { id: '19XXXXX XXXXXX XXXX3', nama: 'Marjuki', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Ahli Pertama', teamRole: 'PIC' },
            { id: '19XXXXX XXXXXX XXXX4', nama: 'Margono', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Penelaah Teknis Kebijakan', teamRole: 'Editor' },
            { id: '19XXXXX XXXXXX XXXX5', nama: 'Bowo', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Kepala Seksi KPKNL Jkt 48', teamRole: 'Viewer' },
        ],
        picId: 'k1',
        auditTrail: [
            { id: 1, timestamp: new Date('2021-08-10T10:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Pendampingan dari Permohonan #pd-1' },
            { id: 2, timestamp: new Date('2021-08-11T09:30:00Z'), user: 'Made', action: 'menambahkan', details: 'Posisi Pendampingan "Pemeriksaan saksi"' },
            { id: 3, timestamp: new Date('2021-08-12T14:00:00Z'), user: 'Admin System', action: 'memperbarui', details: 'Susunan Anggota Tim' },
        ],
    },
    {
        id: 'pd-2',
        Nomor: 'ND-104/BC.08/2026',
        pemohon: 'Kepala Bidang Penindakan dan Penyidikan KPU BC Batam',
        unit: 'Direktorat Jenderal Bea dan Cukai',
        jenis: JenisPermohonan.PENDAMPINGAN,
        perihal: 'Pendampingan Pemeriksaan Saksi Ahli Kasus Dugaan Penyelundupan Pasir Kuarsa',
        uraian: 'Permohonan bantuan hukum pendampingan saksi pegawai Bea Cukai Batam yang dimintai keterangan dalam perkara tindak pidana kepabeanan ekspor ilegal.',
        files: [{ name: 'Surat_Panggilan_Bareskrim_Tipidter.pdf', size: 345000, type: 'application/pdf' }],
        status: StatusPermohonan.DIPROSES,
        tanggal: '14/01/2026',
        history: [],
        statusPendampingan: StatusPendampingan.AKTIF,
        abstraksi: {
            tahunMasuk: 2026,
            nomorTiket: 'ND-104/BC.08/2026',
            unitPemanggil: 'Kepolisian',
            unitPemohon: 'Direktorat Jenderal Bea dan Cukai',
            pihakDipanggil: 'Pemeriksa Bea Cukai Madya Batam',
            wilayah: 'Sumatera',
            pokokPermasalahan: 'Penyelidikan dugaan pelanggaran Pasal 102A UU Kepabeanan terkait dokumen PEB fiktif kuota ekspor pasir kuarsa.',
            keterangan: 'Pemeriksaan saksi dan penyerahan data manifes kapal kargo di Bareskrim Polri.'
        },
        posisi: [
            { id: 1, suratTugas: 'ST-18/SJ.4/2026', tanggalSuratTugas: '2026-01-18', agenda: 'Pemeriksaan Saksi Pertama di Dittipidter Bareskrim Polri', tanggalAgenda: '2026-01-22', suratPemanggilan: 'SPGL/45/I/RES.5.3/2026/Dittipidter', pemanggil: ['Penyidik Subdit II Dittipidter Bareskrim Polri'], terpanggil: ['Tim Hanggar Pabean KPU BC Batam'], posisiKasus: 'Pemeriksaan Saksi', lokasi: 'Gedung Bareskrim Polri Lt. 9, Jakarta', durasi: 210, rincian: 'Pemeriksaan kesesuaian fisik muatan kapal dengan nota pelayanan ekspor (NPE).', timestamp: new Date('2026-01-18') },
            { id: 2, suratTugas: 'ST-31/SJ.4/2026', tanggalSuratTugas: '2026-02-04', agenda: 'Gelar Perkara Bersama Penyidik Mabes Polri', tanggalAgenda: '2026-02-10', suratPemanggilan: 'UND-82/Bareskrim/2026', pemanggil: ['Wadir Tipidter Bareskrim Polri'], terpanggil: ['Tim Kuasa Hukum Kemenkeu & Ahli Kepabeanan'], posisiKasus: 'Penyidikan', lokasi: 'Ruang Rapat Utama Bareskrim Polri', durasi: 180, rincian: 'Ekspose alat bukti dan penetapan status hukum barang bukti sitaan.', timestamp: new Date('2026-02-04') },
        ],
        team: [
            { id: 'usr-2', nama: 'Andi Pratama', nip: '198501012010011001', unit: 'Biro Advokasi, Setjen', role: 'Ahli Muda', teamRole: 'PIC' },
            { id: 'usr-4', nama: 'Citra Lestari', nip: '198807202011012003', unit: 'Kantor Pusat DJBC', role: 'Analis Hukum', teamRole: 'Editor' }
        ],
        picId: 'usr-2',
        auditTrail: [
            { id: 1, timestamp: new Date('2026-01-14T08:30:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Permohonan Pendampingan ND-104/BC.08/2026' }
        ]
    },
    {
        id: 'pd-3',
        Nomor: 'ND-88/KN.05/2025',
        pemohon: 'Kepala KPKNL Bandung',
        unit: 'Direktorat Jenderal Kekayaan Negara',
        jenis: JenisPermohonan.PENDAMPINGAN,
        perihal: 'Pendampingan Audit Investigatif BPK RI atas Pengelolaan Lahan BMN Balai Latihan Kerja',
        uraian: 'Permohonan asistensi hukum dalam rangka menghadapi audit investigatif pemeriksaan dengan tujuan tertentu (PDTT) oleh BPK RI.',
        files: [{ name: 'Surat_Tugas_Investigasi_BPK.pdf', size: 512000, type: 'application/pdf' }],
        status: StatusPermohonan.SELESAI,
        tanggal: '12/08/2025',
        history: [],
        statusPendampingan: StatusPendampingan.SELESAI,
        abstraksi: {
            tahunMasuk: 2025,
            nomorTiket: 'ND-88/KN.05/2025',
            unitPemanggil: 'BPK',
            unitPemohon: 'Direktorat Jenderal Kekayaan Negara',
            pihakDipanggil: 'Pejabat Penatausahaan BMN KPKNL Bandung',
            wilayah: 'Jawa',
            pokokPermasalahan: 'Pemeriksaan potensi kerugian negara akibat penetapan tarif sewa BMN yang tidak sesuai PMK No. 115/PMK.06/2020.',
            keterangan: 'Telah diterbitkan LHP BPK dengan rekomendasi penyesuaian SOP penilai pemerintah.'
        },
        posisi: [
            { id: 1, suratTugas: 'ST-112/SJ.4/2025', tanggalSuratTugas: '2025-08-15', agenda: 'Entry Meeting Audit Investigatif BPK RI', tanggalAgenda: '2025-08-18', suratPemanggilan: 'ST-BPK/AK-01/VIII/2025', pemanggil: ['Penanggung Jawab Tim Pemeriksa BPK'], terpanggil: ['Kepala KPKNL Bandung & Tim Penilai'], posisiKasus: 'Pemeriksaan BPK', lokasi: 'Gedung Keuangan Negara Bandung', durasi: 120, rincian: 'Pemaparan metodologi penilaian wajar aset sewa BMN.', timestamp: new Date('2025-08-15') },
            { id: 2, suratTugas: 'ST-125/SJ.4/2025', tanggalSuratTugas: '2025-09-02', agenda: 'Klarifikasi Dokumen dan Matriks Pemantauan Temuan', tanggalAgenda: '2025-09-08', suratPemanggilan: 'MEMO-BPK-04/2025', pemanggil: ['Ketua Tim Auditor Investigasi BPK'], terpanggil: ['Tim Biro Advokasi & KPKNL'], posisiKasus: 'Pemeriksaan BPK', lokasi: 'Kantor Perwakilan BPK Provinsi Jawa Barat', durasi: 240, rincian: 'Penyampaian tanggapan resmi dan berkas perizinan pemanfaatan BMN.', timestamp: new Date('2025-09-02') },
            { id: 3, suratTugas: 'ST-140/SJ.4/2025', tanggalSuratTugas: '2025-10-10', agenda: 'Exit Meeting dan Penandatanganan Berita Acara Rekomendasi', tanggalAgenda: '2025-10-15', suratPemanggilan: 'UND-BPK-EXIT/2025', pemanggil: ['Auditor Utama Investigasi BPK RI'], terpanggil: ['Direktur BMN DJKN & Tim Advokasi'], posisiKasus: 'Pemeriksaan BPK', lokasi: 'Kantor Pusat BPK RI, Jakarta', durasi: 90, rincian: 'Penandatanganan matriks tindak lanjut perbaikan sistem tarif sewa BMN.', timestamp: new Date('2025-10-10') }
        ],
        team: [
            { id: 'usr-1', nama: 'Sukiyem', nip: '198203122005012001', unit: 'Biro Advokasi, Setjen', role: 'Ahli Madya', teamRole: 'PIC' }
        ],
        picId: 'usr-1',
        auditTrail: [
            { id: 1, timestamp: new Date('2025-08-12T10:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Permohonan' },
            { id: 2, timestamp: new Date('2025-10-20T11:00:00Z'), user: 'Sukiyem', action: 'menyelesaikan', details: 'Pendampingan dinyatakan selesai setelah LHP ditindaklanjuti.' }
        ]
    },
    {
        id: 'pd-4',
        Nomor: 'ND-52/SJ.6/2026',
        pemohon: 'Kepala Pusat Pembinaan Profesi Keuangan (PPPK)',
        unit: 'Sekretariat Jenderal',
        jenis: JenisPermohonan.PENDAMPINGAN,
        perihal: 'Pendampingan Pemanggilan Klarifikasi oleh Kejaksaan Tinggi DKI Jakarta terkait Sanksi Akuntan Publik',
        uraian: 'Permohonan pendampingan atas pemanggilan jaksa penyidik terkait dasar hukum penerbitan Keputusan Menkeu sanksi pembekuan izin Akuntan Publik.',
        files: [{ name: 'Surat_Panggilan_Kejati_DKI.pdf', size: 215000, type: 'application/pdf' }],
        status: StatusPermohonan.DIPROSES,
        tanggal: '08/02/2026',
        history: [],
        statusPendampingan: StatusPendampingan.AKTIF,
        abstraksi: {
            tahunMasuk: 2026,
            nomorTiket: 'ND-52/SJ.6/2026',
            unitPemanggil: 'Kejaksaan',
            unitPemohon: 'Sekretariat Jenderal',
            pihakDipanggil: 'Kabid Pengawasan Akuntan Publik PPPK',
            wilayah: 'Pusat',
            pokokPermasalahan: 'Klarifikasi laporan aduan masyarakat atas pembekuan izin AP rekanan KAP independen.',
            keterangan: 'Pemeriksaan tahap klarifikasi intelijen yustisial di Kejati DKI Jakarta.'
        },
        posisi: [
            { id: 1, suratTugas: 'ST-44/SJ.4/2026', tanggalSuratTugas: '2026-02-12', agenda: 'Wawancara Klarifikasi di Seksi Penkum / Intel Kejati DKI', tanggalAgenda: '2026-02-18', suratPemanggilan: 'B-812/M.1.3/Dek.1/02/2026', pemanggil: ['Jaksa Penyelidik Asintel Kejati DKI Jakarta'], terpanggil: ['Tim Ahli Hukum PPPK Kemenkeu'], posisiKasus: 'Klarifikasi', lokasi: 'Kantor Kejaksaan Tinggi DKI Jakarta, Jl. Rasuna Said', durasi: 150, rincian: 'Pemberian keterangan terkait bukti pelanggaran standar audit akuntan publik.', timestamp: new Date('2026-02-12') }
        ],
        team: [
            { id: 'usr-3', nama: 'Budi Santoso', nip: '199002152015021002', unit: 'Biro Advokasi, Setjen', role: 'Analis Hukum Pertama', teamRole: 'PIC' }
        ],
        picId: 'usr-3',
        auditTrail: [
            { id: 1, timestamp: new Date('2026-02-08T09:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Permohonan Pendampingan' }
        ]
    },
    {
        id: 'pd-5',
        Nomor: 'ND-33/PB.02/2026',
        pemohon: 'Kepala Kantor Pelayanan Perbendaharaan Negara Surabaya II',
        unit: 'Direktorat Jenderal Perbendaharaan',
        jenis: JenisPermohonan.PENDAMPINGAN,
        perihal: 'Pendampingan Saksi Dugaan Tindak Pidana Korupsi Retur SP2D Palsu oleh Penyidik Kejari',
        uraian: 'Pendampingan hukum bagi staf Seksi Pencairan Dana KPPN yang dipanggil sebagai saksi kasus perbankan daerah.',
        files: [{ name: 'Panggilan_Kejari_Surabaya.pdf', size: 198000, type: 'application/pdf' }],
        status: StatusPermohonan.DIPROSES,
        tanggal: '20/02/2026',
        history: [],
        statusPendampingan: StatusPendampingan.AKTIF,
        abstraksi: {
            tahunMasuk: 2026,
            nomorTiket: 'ND-33/PB.02/2026',
            unitPemanggil: 'Kejaksaan',
            unitPemohon: 'Direktorat Jenderal Perbendaharaan',
            pihakDipanggil: 'Front Office & Verifikator SP2D KPPN Surabaya II',
            wilayah: 'Jawa',
            pokokPermasalahan: 'Dugaan manipulasi kode billing dan retur pencairan SPM rekening kas satker daerah.',
            keterangan: 'Pemeriksaan saksi pro-justitia tindak pidana korupsi.'
        },
        posisi: [
            { id: 1, suratTugas: 'ST-56/SJ.4/2026', tanggalSuratTugas: '2026-02-23', agenda: 'Pemeriksaan Berita Acara Saksi di Ruang Pidsus Kejari', tanggalAgenda: '2026-02-27', suratPemanggilan: 'SP-Sidik/77/M.5.10/Fd.1/02/2026', pemanggil: ['Kasi Pidsus Kejaksaan Negeri Surabaya'], terpanggil: ['Petugas FO Pencairan Dana KPPN'], posisiKasus: 'Penyidikan', lokasi: 'Kejaksaan Negeri Surabaya, Jawa Timur', durasi: 180, rincian: 'Verifikasi tanda tangan elektronik SP2D dan rekonsiliasi Bank Operasional.', timestamp: new Date('2026-02-23') }
        ],
        team: [
            { id: 'usr-2', nama: 'Andi Pratama', nip: '198501012010011001', unit: 'Biro Advokasi, Setjen', role: 'Ahli Muda', teamRole: 'PIC' }
        ],
        picId: 'usr-2',
        auditTrail: [
            { id: 1, timestamp: new Date('2026-02-20T10:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Permohonan' }
        ]
    }
];

export const initialPerkaraRecords: PerkaraRecord[] = [
    {
        id: 'pk-1',
        Nomor: '37/PUU-XVII/2021',
        pemohon: 'KPKNL Jakarta II',
        unit: 'Direktorat Jenderal Kekayaan Negara',
        jenis: JenisPermohonan.PENANGANAN_PERKARA,
        perihal: 'Gugatan Perdata terkait Objek Sengketa Tanah di Aceh',
        uraian: 'Detail uraian gugatan perdata...',
        files: [],
        status: StatusPermohonan.DIPROSES,
        tanggal: '18/11/2021',
        history: [],
        statusPerkara: StatusPerkara.AKTIF,
        abstraksiPerkara: {
            tahunMasuk: 2021,
            noPerkara: '37/PUU-XVII/2021',
            tanggalPendaftaranGugatan: '2021-11-18',
            wilayah: 'Aceh',
            jenisPerkara: 'Perdata',
            pengadilan: 'Pengadilan Tinggi Sabang',
            jenisPokokPerkara: 'Kekayaan Negara',
            rincianPokokPerkara: 'lorem ipsum lorem ipsum',
            nomorSuratKuasaKhusus: 'SKU 666',
            tagsPerkara: ['Non-Strategis'],
        },
        pihakP: [
            { id: 'P1', noUrut: 'P1', pihak: 'Penggugat I', identitas: 'Joko', keterangan: 'Lawyer Asep Solihin, Tlp: 08122', unitBerperkara: 'Tidak' },
            { id: 'P2', noUrut: 'P2', pihak: 'Penggugat II', identitas: 'widodo', keterangan: 'Lawyer Soleh Solihin, Tlp: 08123', unitBerperkara: 'Tidak' },
        ],
        pihakT: [
            { id: 'T1', noUrut: 'T1', pihak: 'Tergugat I', identitas: 'BRI Cab Aceh', keterangan: 'Lawyer Hotman, Tlp:123', unitBerperkara: 'Tidak' },
            { id: 'T2', noUrut: 'T2', pihak: 'Tergugat II', identitas: 'KPKNL Jakarta II', keterangan: '', unitBerperkara: 'Ya' },
            { id: 'T3', noUrut: 'T3', pihak: 'Tergugat III', identitas: 'Pemda Aceh', keterangan: '', unitBerperkara: 'Tidak' },
        ],
        tuntutan: [
            { id: 1, objek: 'TGR', jenis: 'Materiil', jumlahNominal: 1000000000, satuan: 'IDR', keterangan: '-' },
            { id: 2, objek: 'TGR', jenis: 'Immateriil', jumlahNominal: 1000000000000, satuan: 'IDR', keterangan: '-' },
            { id: 3, objek: 'TGR', jenis: 'Dwangsom', jumlahNominal: 0, satuan: '-', keterangan: 'Lorem Ipsum' },
            { id: 4, objek: 'BMN', jenis: 'Tanah', jumlahNominal: 100, satuan: 'm2', keterangan: 'SHM No. XX' },
        ],
        posisiSidang: {
            tkPertama: [
                {id: 1, suratTugas: 'ST-12', tanggalSuratTugas: '2026-02-11', agendaSidang: 'Mediasi', tanggalSidang: '2026-02-12', agendaBerikutnya: 'Jawaban', tanggalSidangBerikutnya: '2026-02-18', kehadiranPihak: []},
                {id: 2, agendaSidang: 'Jawaban', tanggalSidang: '2026-02-18', agendaBerikutnya: 'Replik', tanggalSidangBerikutnya: '2026-02-22', kehadiranPihak: []},
                {id: 3, suratTugas: 'ST-21', tanggalSuratTugas: '2026-02-21', agendaSidang: 'Replik', tanggalSidang: '2026-02-22', agendaBerikutnya: 'Duplik', tanggalSidangBerikutnya: '2026-02-26', statusSidang: 'Ditunda', kehadiranPihak: []},
                {id: 4, suratTugas: 'ST-55/SJ.4/2026', tanggalSuratTugas: '2026-09-20', agendaSidang: 'Sidang Pembuktian & Pemeriksaan Saksi Ahli Tergugat', tanggalSidang: '2026-09-24', agendaBerikutnya: 'Sidang Kesimpulan Para Pihak', tanggalSidangBerikutnya: '2026-09-29', kehadiranPihak: []},
                {id: 5, suratTugas: 'ST-62/SJ.4/2026', tanggalSuratTugas: '2026-09-26', agendaSidang: 'Sidang Kesimpulan Para Pihak', tanggalSidang: '2026-09-29', agendaBerikutnya: 'Sidang Pembacaan Putusan Akhir', tanggalSidangBerikutnya: '2026-10-06', kehadiranPihak: []},
            ],
            tkBanding: [], tkKasasi: [], tkPK: []
        },
        tindakLanjut: [
            { id: 1, tanggal: '2026-09-24', tindakLanjut: 'Koordinasi Data Dukung Sertifikat Aset bersama DJKN', uraian: 'Pengambilan salinan warkah tanah asli dan surat ukur BPN di Kantor Pertanahan.', jenisTindakLanjut: 'Koordinasi Internal' },
            { id: 2, tanggal: '2026-09-28', tindakLanjut: 'Deadline Penyusunan Duplik Tergugat Kemenkeu', uraian: 'Penyelesaian draf akhir duplik dan pengesahan oleh Koordinator Advokasi.', jenisTindakLanjut: 'Penyusunan Dokumen Litigasi' },
            { id: 3, tanggal: '2026-10-05', tindakLanjut: 'Batas Penyerahan Bukti Tambahan Surat ke Panitera', uraian: 'Penyerahan novum dan bukti pelengkap akta otentik menjelang musyawarah majelis hakim.', jenisTindakLanjut: 'Penyerahan Bukti' },
            { id: 4, tanggal: '2026-10-08', tindakLanjut: 'Rapat Koordinasi Pelaksanaan Eksekusi Putusan BHT', uraian: 'Konsolidasi tindak lanjut amar putusan bersama satker pengelola BMN.', jenisTindakLanjut: 'Pelaksanaan Putusan' },
        ],
        putusan: [
            { 
                id: 1, 
                nomor: '37/Pdt.G/2021/PN', 
                tanggal: '2026-09-10', 
                amar: 'Menyatakan gugatan Penggugat dikabulkan sebagian. Menghukum Turut Tergugat tunduk pada putusan.', 
                status: 'Kalah', 
                posisi: 'Banding',
                susunanMajelis: [
                    { id: 1, jabatan: 'Hakim Ketua', identitas: 'Joko' },
                    { id: 2, jabatan: 'Hakim Anggota', identitas: 'Wi' },
                    { id: 3, jabatan: 'Hakim Anggota', identitas: 'Dodo' },
                ]
            }
        ],
        statusBHT: { status: 'Inkracht', keteranganDampak: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'},
        dokumenLitigasi: [
            { id: 1, noNaskah: 'XXX', jenis: 'SKU', deskripsi: 'Lorem ipsum', timestamp: 'DD/MM/YYYY HH:MM:SS' }
        ],
        team: [
            { id: '19XXXXX XXXXXX XXXX1', nama: 'Joko', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Ahli Madya', teamRole: 'PIC' },
            { id: '19XXXXX XXXXXX XXXX2', nama: 'Supeno', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Ahli Muda', teamRole: 'PIC' },
            { id: '19XXXXX XXXXXX XXXX3', nama: 'Marjuki', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Ahli Pertama', teamRole: 'PIC' },
            { id: '19XXXXX XXXXXX XXXX4', nama: 'Margono', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Penelaah Teknis Kebijakan', teamRole: 'Editor' },
            { id: '19XXXXX XXXXXX XXXX5', nama: 'Bowo', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Kepala Seksi KPKNL Jkt 48', teamRole: 'Viewer' },
        ],
        picId: 'k1',
        auditTrail: [
            { id: 1, timestamp: new Date('2021-12-25T01:46:37Z'), user: 'Admin System', action: 'merekam', details: 'Perkara dari Permohonan #11223344' },
            { id: 2, timestamp: new Date('2021-11-12T01:46:37Z'), user: 'Joko (PIC)', action: 'memperbarui', details: 'Posisi Sidang Tk. Pertama' },
        ],
    },
    {
        id: 'pk-2',
        Nomor: '142/G/2026/PTUN.JKT',
        pemohon: 'Kanwil DJP Jakarta Selatan I',
        unit: 'Direktorat Jenderal Pajak',
        jenis: JenisPermohonan.PENANGANAN_PERKARA,
        perihal: 'Gugatan Pembatalan SK Penetapan Keberatan Pajak PPh Badan PT Nusantara Sejahtera',
        uraian: 'Gugatan TUN yang diajukan oleh wajib pajak atas penerbitan Surat Keputusan Keberatan PPh Badan tahun pajak 2023.',
        files: [{ name: 'Salinan_Gugatan_PTUN_142.pdf', size: 1450000, type: 'application/pdf' }],
        status: StatusPermohonan.DIPROSES,
        tanggal: '10/01/2026',
        history: [],
        statusPerkara: StatusPerkara.AKTIF,
        abstraksiPerkara: {
            tahunMasuk: 2026,
            noPerkara: '142/G/2026/PTUN.JKT',
            tanggalPendaftaranGugatan: '2026-01-10',
            wilayah: 'Pusat',
            jenisPerkara: 'TUN',
            pengadilan: 'PTUN Jakarta',
            jenisPokokPerkara: 'Perpajakan',
            rincianPokokPerkara: 'Sengketa yuridis koreksi positif biaya royalti dan jasa manajemen antar afiliasi mancanegara.',
            nomorSuratKuasaKhusus: 'SKU-24/SJ.4/2026',
            tagsPerkara: ['Strategis', 'Pajak'],
        },
        pihakP: [
            { id: 'P1', noUrut: 'P1', pihak: 'Penggugat', identitas: 'PT Nusantara Sejahtera Tbk', keterangan: 'Kuasa Hukum Assegaf & Partners', unitBerperkara: 'Tidak' }
        ],
        pihakT: [
            { id: 'T1', noUrut: 'T1', pihak: 'Tergugat', identitas: 'Direktur Jenderal Pajak cq Menkeu RI', keterangan: 'Biro Advokasi & Tim DJP', unitBerperkara: 'Ya' }
        ],
        tuntutan: [
            { id: 1, objek: 'SK Keberatan', jenis: 'Materiil', jumlahNominal: 18500000000, satuan: 'IDR', keterangan: 'Pembatalan SK KEP-0082/WPJ.04/2025' }
        ],
        posisiSidang: {
            tkPertama: [
                { id: 1, suratTugas: 'ST-08/SJ.4/2026', tanggalSuratTugas: '2026-02-05', agendaSidang: 'Pemeriksaan Persiapan', tanggalSidang: '2026-02-10', agendaBerikutnya: 'Pembacaan Gugatan', tanggalSidangBerikutnya: '2026-02-24', kehadiranPihak: [] },
                { id: 2, suratTugas: 'ST-19/SJ.4/2026', tanggalSuratTugas: '2026-02-20', agendaSidang: 'Pembacaan Gugatan & Jawaban Tergugat', tanggalSidang: '2026-02-24', agendaBerikutnya: 'Replik Penggugat', tanggalSidangBerikutnya: '2026-03-10', kehadiranPihak: [] },
                { id: 3, suratTugas: 'ST-28/SJ.4/2026', tanggalSuratTugas: '2026-03-05', agendaSidang: 'Penyampaian Replik Penggugat', tanggalSidang: '2026-03-10', agendaBerikutnya: 'Duplik Tergugat', tanggalSidangBerikutnya: '2026-03-24', kehadiranPihak: [] },
                { id: 4, suratTugas: 'ST-40/SJ.4/2026', tanggalSuratTugas: '2026-03-20', agendaSidang: 'Duplik Tergugat Kemenkeu', tanggalSidang: '2026-03-24', agendaBerikutnya: 'Sidang Pembuktian Surat Dokumen', tanggalSidangBerikutnya: '2026-04-07', kehadiranPihak: [] },
                { id: 5, suratTugas: 'ST-58/SJ.4/2026', tanggalSuratTugas: '2026-04-02', agendaSidang: 'Sidang Pembuktian Surat Dokumen Para Pihak', tanggalSidang: '2026-04-07', agendaBerikutnya: 'Sidang Saksi Ahli Transfer Pricing', tanggalSidangBerikutnya: '2026-10-26', kehadiranPihak: [] },
                { id: 6, suratTugas: 'ST-72/SJ.4/2026', tanggalSuratTugas: '2026-10-15', agendaSidang: 'Pemeriksaan Saksi Ahli Perpajakan Internasional', tanggalSidang: '2026-10-26', agendaBerikutnya: 'Kesimpulan Para Pihak', tanggalSidangBerikutnya: '2026-11-09', kehadiranPihak: [] },
                { id: 7, suratTugas: 'ST-85/SJ.4/2026', tanggalSuratTugas: '2026-10-30', agendaSidang: 'Sidang Kesimpulan Para Pihak', tanggalSidang: '2026-11-09', agendaBerikutnya: 'Pembacaan Putusan Akhir', tanggalSidangBerikutnya: '2026-11-23', kehadiranPihak: [] },
            ],
            tkBanding: [], tkKasasi: [], tkPK: []
        },
        analisisPerkara: {
            isuKrusial: 'Keabsahan metode transfer pricing dan kesebandingan tarif royalti internasional.',
            analisaHukum: 'DJP telah menerapkan metode CUP sesuai ketentuan PER-22/PJ/2013 dan PMK No. 22/PMK.03/2020.',
            potensiDampak: 'Potensi kerugian penerimaan pajak negara sebesar Rp 18,5 Miliar.',
            risiko: 'Tinggi',
            keteranganRisiko: 'Diperlukan keterangan ahli transfer pricing yang kompeten di persidangan.'
        },
        tindakLanjut: [
            { id: 1, tanggal: '2026-03-22', tindakLanjut: 'Penyusunan Naskah Duplik bersama Kanwil DJP', uraian: 'Konsolidasi argumentasi dasar koreksi biaya royalti dengan tim penelaah keberatan.', jenisTindakLanjut: 'Penyusunan Dokumen' }
        ],
        putusan: [
            {
                id: 1,
                nomor: '142/G/2026/PTUN.JKT',
                tanggal: '2026-05-18',
                amar: 'Mengabulkan gugatan Penggugat untuk sebagian terkait pos biaya manajemen; Menolak gugatan Penggugat untuk pos koreksi royalti transfer pricing; Menghukum Para Pihak membayar biaya perkara secara tanggung renteng.',
                status: 'Sebagian Dikabulkan',
                posisi: 'Pertama',
                susunanMajelis: [
                    { id: 1, jabatan: 'Hakim Ketua', identitas: 'Dr. Teguh Satya, S.H., M.H.' },
                    { id: 2, jabatan: 'Hakim Anggota I', identitas: 'Dra. Endang Purwanti, S.H.' },
                    { id: 3, jabatan: 'Hakim Anggota II', identitas: 'Mansyur Syah, S.H.' }
                ]
            }
        ],
        statusBHT: { status: 'Belum Inkracht', keteranganDampak: 'Kemenangan parsial; Tim Kuasa Kemenkeu menempuh upaya hukum banding ke PTTUN Jakarta atas pos biaya manajemen.' },
        team: [
            { id: 'usr-2', nama: 'Andi Pratama', nip: '198501012010011001', unit: 'Biro Advokasi, Setjen', role: 'Ahli Muda', teamRole: 'PIC' }
        ],
        picId: 'usr-2',
        auditTrail: [
            { id: 1, timestamp: new Date('2026-01-10T09:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Perkara 142/G/2026/PTUN.JKT' }
        ]
    },
    {
        id: 'pk-3',
        Nomor: '88/G/BC/2025/PTUN.SBY',
        pemohon: 'KPPBC Tipe Madya Pabean Tanjung Perak',
        unit: 'Direktorat Jenderal Bea dan Cukai',
        jenis: JenisPermohonan.PENANGANAN_PERKARA,
        perihal: 'Gugatan Pembatalan Penetapan Nilai Pabean dan Denda Impor Mesin Cetak Industri',
        uraian: 'Sengketa penetapan nilai pabean barang impor mesin tekstil berdasar SPTNP.',
        files: [{ name: 'Putusan_Kasasi_MA_412.pdf', size: 2100000, type: 'application/pdf' }],
        status: StatusPermohonan.SELESAI,
        tanggal: '15/03/2025',
        history: [],
        statusPerkara: StatusPerkara.SELESAI,
        statusPutusan: StatusPutusan.SELESAI,
        abstraksiPerkara: {
            tahunMasuk: 2025,
            noPerkara: '88/G/BC/2025/PTUN.SBY',
            tanggalPendaftaranGugatan: '2025-03-15',
            wilayah: 'Jawa',
            jenisPerkara: 'Kepabeanan',
            pengadilan: 'PTUN Surabaya',
            jenisPokokPerkara: 'Kepabeanan',
            rincianPokokPerkara: 'Sengketa nilai pabean metode deduksi atas impor mesin cetak offset.',
            nomorSuratKuasaKhusus: 'SKU-88/SJ.4/2025',
            tagsPerkara: ['Non-Strategis', 'Kepabeanan'],
        },
        pihakP: [
            { id: 'P1', noUrut: 'P1', pihak: 'Penggugat', identitas: 'PT Surya Perkasa Logistik', keterangan: 'Advokat Hartono & Rekan', unitBerperkara: 'Tidak' }
        ],
        pihakT: [
            { id: 'T1', noUrut: 'T1', pihak: 'Tergugat', identitas: 'Kepala KPPBC Tanjung Perak cq Menkeu RI', keterangan: '', unitBerperkara: 'Ya' }
        ],
        tuntutan: [
            { id: 1, objek: 'Nilai Pabean SPTNP', jenis: 'Materiil', jumlahNominal: 5200000000, satuan: 'IDR', keterangan: 'Klaim pengembalian bea masuk & denda' }
        ],
        posisiSidang: {
            tkPertama: [
                { id: 1, suratTugas: 'ST-22/2025', tanggalSuratTugas: '2025-04-01', agendaSidang: 'Sidang Putusan PTUN Surabaya', tanggalSidang: '2025-06-12', agendaBerikutnya: 'Upaya Hukum Banding', tanggalSidangBerikutnya: '2025-06-25', kehadiranPihak: [] }
            ],
            tkBanding: [
                { id: 2, suratTugas: 'ST-45/2025', tanggalSuratTugas: '2025-07-01', agendaSidang: 'Putusan Banding PTTUN Surabaya', tanggalSidang: '2025-08-20', agendaBerikutnya: 'Memori Kasasi MA', tanggalSidangBerikutnya: '2025-09-10', kehadiranPihak: [] }
            ],
            tkKasasi: [
                { id: 3, suratTugas: 'ST-68/2025', tanggalSuratTugas: '2025-09-15', agendaSidang: 'Musyawarah Putusan Kasasi Mahkamah Agung', tanggalSidang: '2025-11-20', agendaBerikutnya: 'Pemberitahuan Putusan BHT', tanggalSidangBerikutnya: '2025-12-05', kehadiranPihak: [] }
            ],
            tkPK: []
        },
        analisisPerkara: {
            isuKrusial: 'Keabsahan penetapan nilai transaksi impor barang sejenis.',
            risiko: 'Rendah',
            potensiDampak: 'Penyelamatan penerimaan bea masuk Rp 5,2 Miliar.'
        },
        tindakLanjut: [
            { id: 1, tanggal: '2025-12-10', tindakLanjut: 'Pencairan Jaminan Pembayaran Bea Masuk ke Kas Negara', uraian: 'Eksekusi amar putusan inkracht kasasi Mahkamah Agung bersama KPPBC.', jenisTindakLanjut: 'Pelaksanaan Putusan' }
        ],
        putusan: [
            {
                id: 1,
                nomor: '412 K/TUN/2025',
                tanggal: '2025-11-20',
                amar: 'Menolak permohonan kasasi dari Pemohon Kasasi PT Surya Perkasa Logistik. Menghukum Pemohon Kasasi membayar biaya perkara pada tingkat kasasi.',
                status: 'Menang',
                posisi: 'Kasasi',
                susunanMajelis: [
                    { id: 1, jabatan: 'Hakim Agung Ketua', identitas: 'Dr. Yulius, S.H., M.H.' },
                    { id: 2, jabatan: 'Hakim Agung Anggota I', identitas: 'Dr. H. Yodi Martono, S.H.' },
                    { id: 3, jabatan: 'Hakim Agung Anggota II', identitas: 'Is Sudaryono, S.H., M.H.' }
                ]
            }
        ],
        statusBHT: { status: 'Inkracht', keteranganDampak: 'Kemenangan inkrah Mahkamah Agung, jaminan bea masuk senilai Rp 5,2 Miliar disetor penuh ke Kas Negara.' },
        team: [
            { id: 'usr-4', nama: 'Citra Lestari', nip: '198807202011012003', unit: 'Kantor Pusat DJBC', role: 'Analis Hukum', teamRole: 'PIC' }
        ],
        picId: 'usr-4',
        auditTrail: [
            { id: 1, timestamp: new Date('2025-03-15T09:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Perkara' },
            { id: 2, timestamp: new Date('2025-12-15T10:00:00Z'), user: 'Citra Lestari', action: 'menyelesaikan', details: 'Perkara selesai dengan kemenangan inkracht kasasi MA.' }
        ]
    },
    {
        id: 'pk-4',
        Nomor: '24/HUM/2025/MA',
        pemohon: 'Biro Hukum',
        unit: 'Sekretariat Jenderal',
        jenis: JenisPermohonan.PENANGANAN_PERKARA,
        perihal: 'Uji Materiil Peraturan Menteri Keuangan tentang Standar Biaya Masukan TA 2025',
        uraian: 'Permohonan Hak Uji Materiil (HUM) terhadap klausul besaran honorarium dan uang lembur.',
        files: [{ name: 'Permohonan_HUM_MA_24.pdf', size: 890000, type: 'application/pdf' }],
        status: StatusPermohonan.DIPROSES,
        tanggal: '18/09/2025',
        history: [],
        statusPerkara: StatusPerkara.AKTIF,
        abstraksiPerkara: {
            tahunMasuk: 2025,
            noPerkara: '24/HUM/2025/MA',
            tanggalPendaftaranGugatan: '2025-09-18',
            wilayah: 'Pusat',
            jenisPerkara: 'Uji Materiil',
            pengadilan: 'Mahkamah Agung',
            jenisPokokPerkara: 'Regulasi',
            rincianPokokPerkara: 'Pengujian legalitas Pasal 4 ayat (2) PMK Standar Biaya Masukan terhadap UU No. 17 Tahun 2003 tentang Keuangan Negara.',
            nomorSuratKuasaKhusus: 'SKU-02/MENKEU/2025',
            tagsPerkara: ['Strategis', 'Regulasi'],
        },
        pihakP: [
            { id: 'P1', noUrut: 'P1', pihak: 'Pemohon HUM', identitas: 'Forum Pegawai dan Tenaga Teknis Instansi', keterangan: '', unitBerperkara: 'Tidak' }
        ],
        pihakT: [
            { id: 'T1', noUrut: 'T1', pihak: 'Termohon', identitas: 'Menteri Keuangan Republik Indonesia', keterangan: '', unitBerperkara: 'Ya' }
        ],
        tuntutan: [
            { id: 1, objek: 'Pasal PMK', jenis: 'Non-Materiil', jumlahNominal: 0, satuan: '-', keterangan: 'Pembatalan lampiran besaran standar biaya honorarium' }
        ],
        posisiSidang: {
            tkPertama: [],
            tkBanding: [],
            tkKasasi: [
                { id: 1, suratTugas: 'ST-82/SJ.4/2025', tanggalSuratTugas: '2025-10-01', agendaSidang: 'Penyampaian Jawaban Termohon Menkeu ke Panitera MA', tanggalSidang: '2025-10-15', agendaBerikutnya: 'Musyawarah Majelis Hakim Agung', tanggalSidangBerikutnya: '2026-03-25', kehadiranPihak: [] },
                { id: 2, suratTugas: 'ST-14/SJ.4/2026', tanggalSuratTugas: '2026-03-10', agendaSidang: 'Musyawarah dan Pemeriksaan Berkas Majelis Hakim Agung', tanggalSidang: '2026-03-25', agendaBerikutnya: 'Pengucapan Putusan Yudisial', tanggalSidangBerikutnya: '2026-04-15', kehadiranPihak: [] }
            ],
            tkPK: []
        },
        analisisPerkara: {
            isuKrusial: 'Kewenangan atribusi Menteri Keuangan dalam menetapkan batas efisiensi belanja negara.',
            analisaHukum: 'Pasal 8 UU No. 17/2003 memberikan mandat penuh kepada Menkeu selaku Pengelola Fiskal Negara.',
            risiko: 'Sedang',
            potensiDampak: 'Implikasi revisi menyeluruh regulasi SBM pada seluruh K/L.'
        },
        tindakLanjut: [
            { id: 1, tanggal: '2025-10-14', tindakLanjut: 'Finalisasi Surat Jawaban Resmi Termohon Menkeu', uraian: 'Penyelarasan materi bantahan bersama Ditjen Anggaran (DJA) dan Biro Hukum.', jenisTindakLanjut: 'Penyusunan Dokumen' }
        ],
        putusan: [
            {
                id: 1,
                nomor: '24 P/HUM/2025',
                tanggal: '2026-04-15',
                amar: 'Menolak permohonan keberatan hak uji materiil dari Para Pemohon. Menghukum Para Pemohon membayar biaya perkara.',
                status: 'Menang',
                posisi: 'Kasasi',
                susunanMajelis: [
                    { id: 1, jabatan: 'Hakim Agung Ketua', identitas: 'Prof. Dr. H. Supandi, S.H., M.Hum.' },
                    { id: 2, jabatan: 'Hakim Agung Anggota I', identitas: 'Dr. H. Yosran, S.H., M.Hum.' },
                    { id: 3, jabatan: 'Hakim Agung Anggota II', identitas: 'H. Is Sudaryono, S.H., M.H.' }
                ]
            }
        ],
        statusBHT: { status: 'Inkracht', keteranganDampak: 'Putusan final & mengikat Mahkamah Agung mempertahankan keberlakuan legalitas PMK Standar Biaya Masukan.' },
        team: [
            { id: 'usr-1', nama: 'Sukiyem', nip: '198203122005012001', unit: 'Biro Advokasi, Setjen', role: 'Ahli Madya', teamRole: 'PIC' }
        ],
        picId: 'usr-1',
        auditTrail: [
            { id: 1, timestamp: new Date('2025-09-18T10:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Perkara HUM MA' }
        ]
    },
    {
        id: 'pk-5',
        Nomor: '56/Pdt.Sus-PHI/2025/PN.Jkt.Pst',
        pemohon: 'Pusat Sistem Informasi dan Teknologi Keuangan',
        unit: 'Sekretariat Jenderal',
        jenis: JenisPermohonan.PENANGANAN_PERKARA,
        perihal: 'Gugatan Perselisihan Pemutusan Hubungan Kerja Tenaga Programmer BLU',
        uraian: 'Gugatan ganti rugi pesangon yang diajukan eks tenaga kontrak jasa konsultan IT Pusintek.',
        files: [{ name: 'Salinan_Putusan_PHI_56.pdf', size: 1200000, type: 'application/pdf' }],
        status: StatusPermohonan.SELESAI,
        tanggal: '20/04/2025',
        history: [],
        statusPerkara: StatusPerkara.SELESAI,
        statusPutusan: StatusPutusan.SELESAI,
        abstraksiPerkara: {
            tahunMasuk: 2025,
            noPerkara: '56/Pdt.Sus-PHI/2025/PN.Jkt.Pst',
            tanggalPendaftaranGugatan: '2025-04-20',
            wilayah: 'Pusat',
            jenisPerkara: 'PHI',
            pengadilan: 'PN Jakarta Pusat',
            jenisPokokPerkara: 'Kepegawaian',
            rincianPokokPerkara: 'Gugatan uang pesangon dan uang kompensasi berakhirnya kontrak kerja perseorangan.',
            nomorSuratKuasaKhusus: 'SKU-56/SJ.4/2025',
            tagsPerkara: ['Non-Strategis', 'Ketenagakerjaan'],
        },
        pihakP: [
            { id: 'P1', noUrut: 'P1', pihak: 'Penggugat', identitas: 'Bambang Sudarsono dkk', keterangan: '', unitBerperkara: 'Tidak' }
        ],
        pihakT: [
            { id: 'T1', noUrut: 'T1', pihak: 'Tergugat', identitas: 'PPK Pusintek Setjen Kementerian Keuangan RI', keterangan: '', unitBerperkara: 'Ya' }
        ],
        tuntutan: [
            { id: 1, objek: 'Uang Kompensasi & Pesangon', jenis: 'Materiil', jumlahNominal: 350000000, satuan: 'IDR', keterangan: 'Klaim sisa pembayaran masa kontrak' }
        ],
        posisiSidang: {
            tkPertama: [
                { id: 1, suratTugas: 'ST-35/2025', tanggalSuratTugas: '2025-05-02', agendaSidang: 'Sidang Mediasi PHI', tanggalSidang: '2025-05-15', agendaBerikutnya: 'Jawaban', tanggalSidangBerikutnya: '2025-05-29', kehadiranPihak: [] },
                { id: 2, suratTugas: 'ST-48/2025', tanggalSuratTugas: '2025-07-20', agendaSidang: 'Pembacaan Putusan Akhir Pengadilan Hubungan Industrial', tanggalSidang: '2025-08-14', agendaBerikutnya: 'Pemberitahuan Putusan', tanggalSidangBerikutnya: '2025-08-28', kehadiranPihak: [] }
            ],
            tkBanding: [], tkKasasi: [], tkPK: []
        },
        analisisPerkara: {
            isuKrusial: 'Perjanjian kerja berstatus perikatan perdata pengadaan jasa konsultan perorangan, bukan hubungan industrial UU Ketenagakerjaan.',
            risiko: 'Rendah'
        },
        tindakLanjut: [
            { id: 1, tanggal: '2025-09-01', tindakLanjut: 'Pengambilan Salinan Putusan Inkracht dari Kepaniteraan PHI', uraian: 'Memastikan putusan berkekuatan hukum tetap tanpa ada pengajuan kasasi dari penggugat.', jenisTindakLanjut: 'Administrasi Putusan' }
        ],
        putusan: [
            {
                id: 1,
                nomor: '56/Pdt.Sus-PHI/2025/PN.Jkt.Pst',
                tanggal: '2025-08-14',
                amar: 'Mengabulkan Eksepsi Kompetensi Absolut Tergugat. Menyatakan Pengadilan Hubungan Industrial pada PN Jakarta Pusat tidak berwenang mengadili perkara ini (Niet Ontvankelijke Verklaard / NO). Menghukum Penggugat membayar biaya perkara.',
                status: 'Menang',
                posisi: 'Pertama'
            }
        ],
        statusBHT: { status: 'Inkracht', keteranganDampak: 'Kemenangan putusan NO, tidak ada pengeluaran anggaran negara atas tuntutan pesangon fiktif.' },
        team: [
            { id: 'usr-3', nama: 'Budi Santoso', nip: '199002152015021002', unit: 'Biro Advokasi, Setjen', role: 'Analis Hukum Pertama', teamRole: 'PIC' }
        ],
        picId: 'usr-3',
        auditTrail: [
            { id: 1, timestamp: new Date('2025-04-20T10:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Perkara PHI' }
        ]
    },
    {
        id: 'pk-6',
        Nomor: '215/Pdt.G/2026/PN.Jkt.Sel',
        pemohon: 'KPKNL Jakarta IV',
        unit: 'Direktorat Jenderal Kekayaan Negara',
        jenis: JenisPermohonan.PENANGANAN_PERKARA,
        perihal: 'Gugatan Perbuatan Melawan Hukum atas Eksekusi Pengosongan Lahan Aset Agunan BMN',
        uraian: 'Gugatan PMH yang diajukan oleh debitur atas rencana lelang eksekusi hak tanggungan aset properti komersial.',
        files: [{ name: 'Gugatan_PMH_PN_Jaksel_215.pdf', size: 1750000, type: 'application/pdf' }],
        status: StatusPermohonan.DIPROSES,
        tanggal: '05/02/2026',
        history: [],
        statusPerkara: StatusPerkara.AKTIF,
        abstraksiPerkara: {
            tahunMasuk: 2026,
            noPerkara: '215/Pdt.G/2026/PN.Jkt.Sel',
            tanggalPendaftaranGugatan: '2026-02-05',
            wilayah: 'Pusat',
            jenisPerkara: 'Perdata',
            pengadilan: 'PN Jakarta Selatan',
            jenisPokokPerkara: 'Kekayaan Negara',
            rincianPokokPerkara: 'Perlawanan pihak ketiga dan permohonan provisi penundaan lelang hak tanggungan BMN.',
            nomorSuratKuasaKhusus: 'SKU-15/SJ.4/2026',
            tagsPerkara: ['Strategis', 'Aset BMN'],
        },
        pihakP: [
            { id: 'P1', noUrut: 'P1', pihak: 'Penggugat', identitas: 'PT Graha Cipta Mandiri', keterangan: 'Law Firm Otto & Rekan', unitBerperkara: 'Tidak' }
        ],
        pihakT: [
            { id: 'T1', noUrut: 'T1', pihak: 'Tergugat I', identitas: 'Menteri Keuangan RI cq KPKNL Jakarta IV', keterangan: '', unitBerperkara: 'Ya' },
            { id: 'T2', noUrut: 'T2', pihak: 'Tergugat II', identitas: 'Panitia Urusan Piutang Negara (PUPN) DKI Jakarta', keterangan: '', unitBerperkara: 'Ya' }
        ],
        tuntutan: [
            { id: 1, objek: 'Ganti Rugi Materiil & Immateriil', jenis: 'Materiil', jumlahNominal: 45000000000, satuan: 'IDR', keterangan: 'Tuntutan pembatalan risalah lelang & ganti rugi' }
        ],
        posisiSidang: {
            tkPertama: [
                { id: 1, suratTugas: 'ST-29/SJ.4/2026', tanggalSuratTugas: '2026-02-25', agendaSidang: 'Sidang Pertama & Pemeriksaan Legal Standing Kuasa Hukum', tanggalSidang: '2026-03-04', agendaBerikutnya: 'Mediasi Pengadilan', tanggalSidangBerikutnya: '2026-03-18', kehadiranPihak: [] },
                { id: 2, suratTugas: 'ST-38/SJ.4/2026', tanggalSuratTugas: '2026-03-12', agendaSidang: 'Sidang Mediasi di Depan Hakim Mediator', tanggalSidang: '2026-03-18', agendaBerikutnya: 'Laporan Hasil Mediasi & Pembacaan Gugatan', tanggalSidangBerikutnya: '2026-04-01', kehadiranPihak: [] },
                { id: 3, suratTugas: 'ST-50/SJ.4/2026', tanggalSuratTugas: '2026-03-26', agendaSidang: 'Pembacaan Gugatan Penggugat & Eksepsi Tergugat Menkeu', tanggalSidang: '2026-04-01', agendaBerikutnya: 'Putusan Sela atas Provisi', tanggalSidangBerikutnya: '2026-04-15', kehadiranPihak: [] },
                { id: 4, suratTugas: 'ST-64/SJ.4/2026', tanggalSuratTugas: '2026-10-14', agendaSidang: 'Sidang Pembuktian Surat Dokumen Penggugat & Tergugat Menkeu', tanggalSidang: '2026-10-28', agendaBerikutnya: 'Pemeriksaan Saksi Penggugat', tanggalSidangBerikutnya: '2026-11-12', kehadiranPihak: [] }
            ],
            tkBanding: [], tkKasasi: [], tkPK: []
        },
        analisisPerkara: {
            isuKrusial: 'Permohonan putusan provisi penundaan lelang yang diajukan penggugat berpotensi menghambat pemulihan piutang negara.',
            analisaHukum: 'Lelang eksekusi Pasal 6 UU Hak Tanggungan merupakan hak parate eksekusi yang dilindungi undang-undang.',
            risiko: 'Sedang',
            potensiDampak: 'Risiko tertundanya pemulihan hak tagih negara sebesar Rp 45 Miliar.'
        },
        tindakLanjut: [
            { id: 1, tanggal: '2026-03-20', tindakLanjut: 'Koordinasi Penyusunan Eksepsi Kompetensi dan Tanggapan Provisi', uraian: 'Pertemuan intensif dengan tim seksi hukum KPKNL Jakarta IV.', jenisTindakLanjut: 'Penyusunan Eksepsi' }
        ],
        putusan: [
            {
                id: 1,
                nomor: '215/Pdt.G/2026/PN.Jkt.Sel',
                tanggal: '2026-03-25',
                amar: 'Menolak permohonan provisi Penggugat untuk menangguhkan pelaksanaan lelang eksekusi hak tanggungan BMN.',
                status: 'Menang',
                posisi: 'Pertama',
                susunanMajelis: [
                    { id: 1, jabatan: 'Hakim Ketua', identitas: 'Dr. Ahmad Fauzi, S.H., M.H.' },
                    { id: 2, jabatan: 'Hakim Anggota I', identitas: 'Sri Wahyuni, S.H.' },
                    { id: 3, jabatan: 'Hakim Anggota II', identitas: 'Bambang Irawan, S.H.' }
                ]
            }
        ],
        statusBHT: { status: 'Belum Inkracht', keteranganDampak: 'Putusan Sela menolak provisi; pemeriksaan materi pokok perkara terus berlanjut.' },
        team: [
            { id: 'usr-1', nama: 'Sukiyem', nip: '198203122005012001', unit: 'Biro Advokasi, Setjen', role: 'Ahli Madya', teamRole: 'PIC' },
            { id: 'usr-2', nama: 'Andi Pratama', nip: '198501012010011001', unit: 'Biro Advokasi, Setjen', role: 'Ahli Muda', teamRole: 'Editor' }
        ],
        picId: 'usr-1',
        auditTrail: [
            { id: 1, timestamp: new Date('2026-02-05T10:00:00Z'), user: 'Admin System', action: 'merekam', details: 'Registrasi Perkara PMH PN Jaksel' }
        ]
    }
];

export const initialUserAccounts: UserAccount[] = [
  { id: 'usr-1', nama: 'Sukiyem', nip: '198203122005012001', unit: 'Biro Advokasi - Setjen', roles: ['Super Admin'], status: 'Aktif' },
  { id: 'usr-2', nama: 'Andi Pratama', nip: '198501012010011001', unit: 'Kanwil DJP Jakarta Pusat', roles: ['Manajer'], status: 'Aktif' },
  { id: 'usr-3', nama: 'Budi Santoso', nip: '199002152015021002', unit: 'Kanwil DJP Jakarta Selatan I', roles: ['Operator'], status: 'Aktif' },
  { id: 'usr-4', nama: 'Citra Lestari', nip: '198807202011012003', unit: 'Kantor Pusat DJBC', roles: ['Pegawai'], status: 'Tidak Aktif' },
];

export const initialTelaahanRecords: TelaahanRecord[] = [
  {
    id: 'TLH-2026-001',
    Nomor: 'ND-112/SJ.4/2026',
    nomorTelaahan: 'TLH-01/SJ.4/2026',
    pemohon: 'Kepala Pusat Sistem Informasi dan Teknologi Keuangan',
    unit: 'Pusat Sistem Informasi dan Teknologi Keuangan, Setjen',
    tanggal: '10/02/2026',
    jenis: JenisPermohonan.TELAAHAN_KASUS_HUKUM,
    perihal: 'Permohonan Telaahan Kasus Hukum atas Dugaan Pelanggaran Kontrak Pengadaan Perangkat IT',
    uraian: 'Permohonan analisis yuridis terkait wanprestasi penyedia dalam pemenuhan spesifikasi teknis dan keterlambatan serah terima pekerjaan pengadaan perangkat keras pusat data Kemenkeu TA 2025.',
    files: [{ name: 'Surat_Permohonan_Telaahan_Pusintek.pdf', size: 245000, type: 'application/pdf' }],
    status: StatusPermohonan.DIPROSES,
    statusTelaahan: StatusTelaahan.AKTIF,
    history: [],
    sumber: 'Nadine',
    tahunMasuk: 2026,
    abstraksiTelaahan: {
      pokokPermasalahan: 'Penyedia PT Dinamika Solusi Digital belum merampungkan deliverable server utama dan terjadi deviasi spesifikasi RAM serta storage sebesar 25% dari KAK.',
      faktaHukum: '1. Surat Perjanjian Kontrak No. SP-04/PPK.IT/2025 tgl 14 Maret 2025 dengan nilai Rp 4.850.000.000,-.\n2. BAST parsial tgl 20 November 2025 menunjukkan keterlambatan 45 hari kalender.\n3. Telah diterbitkan SP-1, SP-2, dan SP-3 namun penyedia tidak memenuhi pemulihan performa sistem.',
      dasarHukum: [
        'Peraturan Presiden No. 16 Tahun 2018 jo Perpres No. 12 Tahun 2021 tentang Pengadaan Barang/Jasa Pemerintah',
        'Pasal 1243 dan Pasal 1244 Kitab Undang-Undang Hukum Perdata',
        'PMK No. 118/PMK.01/2021 tentang Organisasi dan Tata Kerja Kementerian Keuangan'
      ],
      analisisKajian: 'Berdasarkan ketentuan Klausul Kontrak dan Pasal 1243 KUHPerdata, penyedia telah nyata-nyata melakukan wanprestasi. Pejabat Pembuat Komitmen (PPK) berwenang mengenakan sanksi denda keterlambatan maksimal 5%, mencairkan jaminan pelaksanaan ke Kas Negara, serta memutus kontrak secara sepihak disertai usulan pencantuman dalam Daftar Hitam (Blacklist).',
      rekomendasi: '1. PPK menerbitkan Surat Pemutusan Kontrak secara sepihak karena cidera janji.\n2. Segera mengajukan klaim pencairan Jaminan Pelaksanaan kepada pihak penjamin.\n3. Mengusulkan sanksi pencantuman penyedia dalam Daftar Hitam nasional LKPP.',
      tingkatUrgensi: 'Segera',
      kategoriHukum: 'Kontrak Pengadaan Barang dan Jasa'
    },
    dokumenTelaahan: [
      { id: 'dt-1', name: 'Surat_Permohonan_Telaahan_Pusintek.pdf', size: 245000, type: 'application/pdf', kategori: 'Permohonan', tanggal: '10/02/2026', deskripsi: 'Nota Dinas Permohonan Resmi dari Kapusintek' },
      { id: 'dt-2', name: 'Kontrak_Pengadaan_Server_2025.pdf', size: 3400000, type: 'application/pdf', kategori: 'Data Dukung', tanggal: '14/03/2025', deskripsi: 'Salinan Kontrak Asli & Syarat Khusus Kontrak' },
      { id: 'dt-3', name: 'Berita_Acara_Pemeriksaan_Teknis_BAP.pdf', size: 1200000, type: 'application/pdf', kategori: 'Data Dukung', tanggal: '20/11/2025', deskripsi: 'Hasil Uji Fungsi dan Audit Teknis Tim Ahli IT' }
    ],
    naskahTelaahan: {
      statusNaskah: StatusNaskahTelaahan.BELUM_DIBUAT,
      perihal: 'Telaahan Hukum atas Dugaan Wanprestasi Pekerjaan Pengadaan Perangkat Server Pusintek TA 2025'
    },
    team: [
      { id: 't1', nama: 'Hendra Cahyono', nip: '198505122008011003', unit: 'Biro Advokasi, Setjen', role: 'Koordinator Advokasi III', teamRole: 'PIC' },
      { id: 't2', nama: 'Arlina Haryuningsih', nip: '198902142012012002', unit: 'Biro Advokasi, Setjen', role: 'Analis Hukum Ahli Muda', teamRole: 'Editor' }
    ],
    picId: 't1'
  },
  {
    id: 'TLH-2026-002',
    Nomor: 'ND-88/PB.03/2026',
    nomorTelaahan: 'TLH-02/SJ.4/2026',
    pemohon: 'Direktur Sistem Perbendaharaan',
    unit: 'Direktorat Sistem Perbendaharaan, Ditjen Perbendaharaan',
    tanggal: '05/01/2026',
    jenis: JenisPermohonan.TELAAHAN_KASUS_HUKUM,
    perihal: 'Permohonan Telaahan Hukum Permasalahan Hak Guna Bangunan dan Sengketa Tanah KPPN',
    uraian: 'Kajian kepemilikan dan status hak atas tanah gedung operasional KPPN terhadap klaim pihak ketiga.',
    files: [{ name: 'Surat_DJPb_Sengketa_Tanah.pdf', size: 180000, type: 'application/pdf' }],
    status: StatusPermohonan.SELESAI,
    statusTelaahan: StatusTelaahan.SELESAI,
    history: [],
    sumber: 'Nadine',
    tahunMasuk: 2026,
    abstraksiTelaahan: {
      pokokPermasalahan: 'Klaim pihak ketiga atas tanah BMN seluas 1.200 m2 bersertifikat Hak Pakai an. Kementerian Keuangan RI.',
      faktaHukum: 'Sertifikat Hak Pakai No. 14 terbit tahun 1984 dan dikuasai secara fisik dan administratif tanpa henti oleh Kementerian Keuangan.',
      dasarHukum: [
        'UU No. 1 Tahun 2004 tentang Perbendaharaan Negara',
        'PP No. 28 Tahun 2020 tentang Perubahan Atas PP No. 27 Tahun 2014 tentang Pengelolaan BMN',
        'PMK No. 181/PMK.05/2016 tentang Penatausahaan BMN'
      ],
      analisisKajian: 'Kedudukan yuridis Kementerian Keuangan mutlak dilindungi asas legalitas kepemilikan sertifikat Hak Pakai yang sah dan tidak pernah dibatalkan oleh putusan peradilan. Klaim perorangan tidak berdasar bukti otentik.',
      rekomendasi: 'Mempertahankan aset BMN secara konsisten, memasang plang pengamanan fisik BMN, dan berkoordinasi dengan Kantor Pertanahan setempat untuk pencegahan peralihan hak.',
      tingkatUrgensi: 'Biasa',
      kategoriHukum: 'Aset dan Barang Milik Negara (BMN)'
    },
    dokumenTelaahan: [
      { id: 'dt-10', name: 'Surat_DJPb_Sengketa_Tanah.pdf', size: 180000, type: 'application/pdf', kategori: 'Permohonan', tanggal: '05/01/2026' },
      { id: 'dt-11', name: 'Sertifikat_Hak_Pakai_No14.pdf', size: 4500000, type: 'application/pdf', kategori: 'Data Dukung', tanggal: '12/01/2026' },
      { id: 'dt-12', name: 'ND-45-SJ.4-2026_Telaahan_Hukum_Final_TTE.pdf', size: 980000, type: 'application/pdf', kategori: 'Naskah Telaahan', tanggal: '28/01/2026', nomor: 'ND-45/SJ.4/2026' }
    ],
    naskahTelaahan: {
      naskahId: 'NADINE-TLH-9921',
      nomorNaskah: 'ND-45/SJ.4/2026',
      statusNaskah: StatusNaskahTelaahan.DIKIRIM,
      penandaTangan: 'Kepala Biro Advokasi (Aloysius Yanis Dhaniarto)',
      tglTte: '28/01/2026 14:30 WIB',
      tglKirim: '28/01/2026 15:00 WIB',
      perihal: 'Telaahan Hukum atas Status Sertifikat Hak Pakai Tanah Gedung KPPN Terhadap Gugatan Pihak Ketiga'
    },
    team: [
      { id: 't1', nama: 'Hendra Cahyono', nip: '198505122008011003', unit: 'Biro Advokasi, Setjen', role: 'Koordinator Advokasi III', teamRole: 'PIC' }
    ],
    picId: 't1'
  },
  {
    id: 'TLH-2026-003',
    Nomor: 'ND-304/DJP/2026',
    nomorTelaahan: 'TLH-03/SJ.4/2026',
    pemohon: 'Direktur Kepatuhan Internal dan Transformasi Sumber Daya Aparatur',
    unit: 'Direktorat Jenderal Pajak',
    tanggal: '20/09/2026',
    jenis: JenisPermohonan.TELAAHAN_KASUS_HUKUM,
    perihal: 'Permohonan Telaahan Hukum Dugaan Pelanggaran Kode Etik dan Benturan Kepentingan Oknum Pegawai',
    uraian: 'Kajian yuridis terhadap penerapan sanksi disiplin tingkat berat PP No. 94 Tahun 2021 atas gratifikasi dan benturan kepentingan penanganan sengketa pajak.',
    files: [{ name: 'LHA_Investigasi_Internal_DJP.pdf', size: 540000, type: 'application/pdf' }],
    status: StatusPermohonan.DIPROSES,
    statusTelaahan: StatusTelaahan.AKTIF,
    history: [],
    sumber: 'Nadine',
    tahunMasuk: 2026,
    abstraksiTelaahan: {
      pokokPermasalahan: 'Pemeriksaan kepatuhan internal menemukan indikasi penerimaan fasilitas tidak sah dari wajib pajak dalam proses pemeriksaan bukti permulaan.',
      faktaHukum: 'Bukti transfer rekening perantara, salinan percakapan, dan pengakuan tertulis terlapor saat berita acara pemeriksaan investigasi.',
      dasarHukum: [
        'PP No. 94 Tahun 2021 tentang Disiplin Pegawai Negeri Sipil',
        'UU No. 20 Tahun 2001 jo UU No. 31 Tahun 1999 tentang Pemberantasan Tindak Pidana Korupsi',
        'PMK No. 190/PMK.01/2018 tentang Kode Etik dan Kode Perilaku Pegawai Negeri Sipil di Lingkungan Kementerian Keuangan'
      ],
      analisisKajian: 'Unsur pelanggaran disiplin berat terbukti secara sah dan meyakinkan. Disarankan pembentukan Tim Pemeriksa Gabungan dan penjatuhan sanksi pembebasan dari jabatan serta penerusan ke Aparat Penegak Hukum.',
      rekomendasi: '1. Penjatuhan hukuman disiplin berat tingkat pemberhentian dengan hormat tidak atas permintaan sendiri.\n2. Pemblokiran akun akses sistem informasi perpajakan.',
      tingkatUrgensi: 'Segera',
      kategoriHukum: 'Hukum Kepegawaian dan Tindak Pidana Korupsi'
    },
    dokumenTelaahan: [
      { id: 'dt-20', name: 'LHA_Investigasi_Internal_DJP.pdf', size: 540000, type: 'application/pdf', kategori: 'Permohonan', tanggal: '20/09/2026' }
    ],
    naskahTelaahan: {
      statusNaskah: StatusNaskahTelaahan.DRAFT,
      perihal: 'Telaahan Hukum atas Rekomendasi Sanksi Disiplin Berat Oknum Pegawai DJP',
      tanggalNaskah: '2026-09-26'
    },
    team: [
      { id: 't1', nama: 'Hendra Cahyono', nip: '198505122008011003', unit: 'Biro Advokasi, Setjen', role: 'Koordinator Advokasi III', teamRole: 'PIC' }
    ],
    picId: 't1'
  },
  {
    id: 'TLH-2026-004',
    Nomor: 'ND-112/ROKUM/2026',
    nomorTelaahan: 'TLH-04/SJ.4/2026',
    pemohon: 'Kepala Biro Hukum, Sekretariat Jenderal',
    unit: 'Biro Hukum, Setjen',
    tanggal: '18/02/2026',
    jenis: JenisPermohonan.TELAAHAN_KASUS_HUKUM,
    perihal: 'Harmonisasi dan Kajian Uji Materiil Peraturan Pemerintah terkait Tarif PNBP',
    uraian: 'Permohonan Uji Materiil terhadap Klausul Tarif Royalti Progresif Ekspor Mineral (Perkara 12/HUM/2026/MA).',
    files: [{ name: 'Salinan_Permohonan_HUM_MA_No12.pdf', size: 680000, type: 'application/pdf' }],
    status: StatusPermohonan.DIPROSES,
    statusTelaahan: StatusTelaahan.AKTIF,
    history: [],
    sumber: 'Nadine',
    tahunMasuk: 2026,
    abstraksiTelaahan: {
      pokokPermasalahan: 'Permohonan Uji Materiil terhadap Klausul Tarif Royalti Progresif Ekspor Mineral (Perkara 12/HUM/2026/MA).',
      faktaHukum: 'Asosiasi Pengusaha mengajukan hak uji materiil atas norma perhitungan tarif PNBP progresif pada PP No. 26 Tahun 2022.',
      dasarHukum: [
        'UU No. 9 Tahun 2018 tentang PNBP',
        'UU No. 12 Tahun 2011 jo UU No. 13 Tahun 2022 tentang Pembentukan Peraturan Perundang-undangan'
      ],
      analisisKajian: 'Delegasi wewenang penetapan tarif diatur jelas dalam UU No. 9 Tahun 2018 tentang PNBP. Tidak bertentangan dengan asas kepastian hukum perpajakan.',
      rekomendasi: 'Penyusunan Surat Jawaban Termohon HUM MA bersama Ditjen Anggaran dan BKF.',
      tingkatUrgensi: 'Sangat Segera',
      kategoriHukum: 'Hak Uji Materiil (HUM)'
    },
    dokumenTelaahan: [
      { id: 'dt-30', name: 'Salinan_Permohonan_HUM_MA_No12.pdf', size: 680000, type: 'application/pdf', kategori: 'Permohonan', tanggal: '18/02/2026' }
    ],
    naskahTelaahan: {
      statusNaskah: StatusNaskahTelaahan.DRAFT,
      perihal: 'Jawaban Termohon Uji Materiil Klausul Tarif Royalti Progresif Ekspor Mineral'
    },
    team: [
      { id: 't-budi', nama: 'Budi Santoso', nip: '199002152015021002', unit: 'Biro Advokasi, Setjen', role: 'Analis Hukum', teamRole: 'PIC' }
    ],
    picId: 't-budi'
  },
  {
    id: 'TLH-2026-005',
    Nomor: 'ND-120/PB.02/2026',
    nomorTelaahan: 'TLH-05/SJ.4/2026',
    pemohon: 'Direktur Pengelolaan Kas Negara, Ditjen Perbendaharaan',
    unit: 'Direktorat Jenderal Perbendaharaan',
    tanggal: '27/02/2026',
    jenis: JenisPermohonan.TELAAHAN_KASUS_HUKUM,
    perihal: 'Analisis Gugatan PMH atas Penolakan SPM Retur Rekening Bendahara Pengeluaran',
    uraian: 'Tuntutan Ganti Kerugian Bunga Akibat Retur SP2D Pembayaran Termin Kontrak Fisik (Perkara 44/Pdt.G/2026/PN.Bdg).',
    files: [{ name: 'Gugatan_PMH_Retur_SPM_Bandung.pdf', size: 310000, type: 'application/pdf' }],
    status: StatusPermohonan.DIPROSES,
    statusTelaahan: StatusTelaahan.AKTIF,
    history: [],
    sumber: 'Nadine',
    tahunMasuk: 2026,
    abstraksiTelaahan: {
      pokokPermasalahan: 'Tuntutan Ganti Kerugian Bunga Akibat Retur SP2D Pembayaran Termin Kontrak Fisik (Perkara 44/Pdt.G/2026/PN.Bdg).',
      faktaHukum: 'Rekening pihak ketiga yang ditunjuk tidak aktif sehingga sistem SPAN menerbitkan retur SP2D secara otomatis.',
      dasarHukum: [
        'UU No. 1 Tahun 2004 tentang Perbendaharaan Negara',
        'PMK No. 190/PMK.05/2012 tentang Tata Cara Pembayaran APBN'
      ],
      analisisKajian: 'KPPN menolak SPM karena nomor rekening bank pihak ketiga tidak sinkron dengan data SPAN. Sesuai PMK Pengelolaan Rekening Kas Negara.',
      rekomendasi: 'Eksepsi kompetensi absolut dan bukti sistem audit trail SPAN perbendaharaan.',
      tingkatUrgensi: 'Segera',
      kategoriHukum: 'Perdata / Gugatan PMH'
    },
    dokumenTelaahan: [
      { id: 'dt-40', name: 'Gugatan_PMH_Retur_SPM_Bandung.pdf', size: 310000, type: 'application/pdf', kategori: 'Permohonan', tanggal: '27/02/2026' }
    ],
    naskahTelaahan: {
      statusNaskah: StatusNaskahTelaahan.DRAFT,
      perihal: 'Kajian Hukum dan Eksepsi Gugatan PMH Retur SPM Rekening KPPN Bandung'
    },
    team: [
      { id: 't-admin', nama: 'Admin Tuban Kum', nip: '198709122010011004', unit: 'Biro Advokasi, Setjen', role: 'Koordinator Advokasi I', teamRole: 'PIC' }
    ],
    picId: 't-admin'
  },
  {
    id: 'TLH-2026-006',
    Nomor: 'ND-135/BKF/2026',
    nomorTelaahan: 'TLH-06/SJ.4/2026',
    pemohon: 'Kepala Pusat Kebijakan Sektor Keuangan, BKF',
    unit: 'Badan Kebijakan Fiskal',
    tanggal: '08/03/2026',
    jenis: JenisPermohonan.TELAAHAN_KASUS_HUKUM,
    perihal: 'Telaahan Aspek Hukum Klausul Arbitrase Internasional pada Perjanjian Kerjasama Multilateral',
    uraian: 'Klaim Wanprestasi Dukungan Kelayakan Proyek KPBU SPAM Regional (Perkara ARB/BANI/2026/019).',
    files: [{ name: 'Perjanjian_KPBU_SPAM_Multilateral.pdf', size: 1450000, type: 'application/pdf' }],
    status: StatusPermohonan.SELESAI,
    statusTelaahan: StatusTelaahan.SELESAI,
    history: [],
    sumber: 'Nadine',
    tahunMasuk: 2026,
    abstraksiTelaahan: {
      pokokPermasalahan: 'Klaim Wanprestasi Dukungan Kelayakan Proyek KPBU SPAM Regional senilai USD 3.200.000.',
      faktaHukum: 'Klausul force majeure pada masa pandemi dan pergeseran trase perizinan daerah bukan tanggung jawab sepihak Pemerintah Pusat.',
      dasarHukum: [
        'UU No. 30 Tahun 1999 tentang Arbitrase dan Alternatif Penyelesaian Sengketa',
        'Perpres No. 38 Tahun 2015 tentang Kerjasama Pemerintah dengan Badan Usaha'
      ],
      analisisKajian: 'Klausul force majeure pada masa pandemi dan pergeseran trase perizinan daerah bukan tanggung jawab sepihak Pemerintah Pusat.',
      rekomendasi: 'Penetapan Arbiter Pendamping dan negosiasi rekonsiliasi adendum kontrak KPBU.',
      tingkatUrgensi: 'Biasa',
      kategoriHukum: 'Arbitrase Komersial'
    },
    dokumenTelaahan: [
      { id: 'dt-50', name: 'Perjanjian_KPBU_SPAM_Multilateral.pdf', size: 1450000, type: 'application/pdf', kategori: 'Permohonan', tanggal: '08/03/2026' },
      { id: 'dt-51', name: 'ND-135-SJ.4-2026_Telaahan_Arbitrase_TTE.pdf', size: 520000, type: 'application/pdf', kategori: 'Naskah Telaahan', tanggal: '12/03/2026', nomor: 'ND-135/SJ.4/2026' }
    ],
    naskahTelaahan: {
      naskahId: 'NADINE-TLH-006',
      nomorNaskah: 'ND-135/SJ.4/2026',
      statusNaskah: StatusNaskahTelaahan.DIKIRIM,
      tglTte: '12/03/2026 10:15 WIB',
      tglKirim: '12/03/2026 11:00 WIB',
      perihal: 'Telaahan Klausul Arbitrase Internasional Proyek KPBU SPAM Regional'
    },
    team: [
      { id: 't-dedi', nama: 'Dedi Irawan', nip: '198603102009011002', unit: 'Biro Advokasi, Setjen', role: 'Analis Kebijakan', teamRole: 'PIC' }
    ],
    picId: 't-dedi'
  },
  {
    id: 'TLH-2026-007',
    Nomor: 'ND-142/DJP.04/2026',
    nomorTelaahan: 'TLH-07/SJ.4/2026',
    pemohon: 'Direktur Penegakan Hukum, Ditjen Pajak',
    unit: 'Direktorat Jenderal Pajak',
    tanggal: '19/03/2026',
    jenis: JenisPermohonan.TELAAHAN_KASUS_HUKUM,
    perihal: 'Kajian Hukum Permohonan Praperadilan Penetapan Tersangka Tindak Pidana Perpajakan',
    uraian: 'Gugatan Praperadilan atas Keabsahan Penetapan Tersangka dan Penyitaan Dokumen Akuntansi (Perkara 07/Pid.Pra/2026/PN.Jkt.Pst).',
    files: [{ name: 'Gugatan_Praperadilan_Faktur_Pajak.pdf', size: 420000, type: 'application/pdf' }],
    status: StatusPermohonan.DIPROSES,
    statusTelaahan: StatusTelaahan.AKTIF,
    history: [],
    sumber: 'Nadine',
    tahunMasuk: 2026,
    abstraksiTelaahan: {
      pokokPermasalahan: 'Gugatan Praperadilan atas Keabsahan Penetapan Tersangka dan Penyitaan Dokumen Akuntansi.',
      faktaHukum: 'Penyidik telah memenuhi minimal dua alat bukti sah sesuai putusan MK No. 21/PUU-XII/2014.',
      dasarHukum: [
        'Pasal 77 s.d. Pasal 83 KUHAP',
        'UU No. 6 Tahun 1983 jo UU KUP Terakhir',
        'Peraturan Mahkamah Agung No. 4 Tahun 2016'
      ],
      analisisKajian: 'Bukti permulaan cukup didukung minimal 3 alat bukti sah (Keterangan saksi, dokumen faktur, dan keterangan ahli forensik digital). Prosedur penyitaan didukung izin Ketua PN.',
      rekomendasi: 'Siapkan eksepsi serta hadirkan Ahli Hukum Acara Pidana pada sidang praperadilan.',
      tingkatUrgensi: 'Sangat Segera',
      kategoriHukum: 'Praperadilan Pidana Pajak'
    },
    dokumenTelaahan: [
      { id: 'dt-60', name: 'Gugatan_Praperadilan_Faktur_Pajak.pdf', size: 420000, type: 'application/pdf', kategori: 'Permohonan', tanggal: '19/03/2026' }
    ],
    naskahTelaahan: {
      statusNaskah: StatusNaskahTelaahan.DRAFT,
      perihal: 'Telaahan Yuridis dan Materi Eksepsi Praperadilan DJP Jakarta Pusat'
    },
    team: [
      { id: 't-rini', nama: 'Rini Astuti', nip: '199104082014022001', unit: 'Biro Advokasi, Setjen', role: 'Analis Hukum Ahli Muda', teamRole: 'PIC' }
    ],
    picId: 't-rini'
  },
  {
    id: 'TLH-2026-008',
    Nomor: 'ND-150/PPK/2026',
    nomorTelaahan: 'TLH-08/SJ.4/2026',
    pemohon: 'Sekretaris Badan Pendidikan dan Pelatihan Keuangan',
    unit: 'Badan Pendidikan dan Pelatihan Keuangan (BPPK)',
    tanggal: '24/03/2026',
    jenis: JenisPermohonan.TELAAHAN_KASUS_HUKUM,
    perihal: 'Telaahan Status Kepemilikan Lahan Gedung Balai Diklat Keuangan Cimahi',
    uraian: 'Sengketa Kepemilikan Hak Milik Adat atas Tanah Kompleks Kampus BDK Cimahi (Perkara 109/Pdt.Bth/2026/PN.Cmh).',
    files: [{ name: 'Gugatan_Perlawanan_Sita_BDK_Cimahi.pdf', size: 560000, type: 'application/pdf' }],
    status: StatusPermohonan.SELESAI,
    statusTelaahan: StatusTelaahan.SELESAI,
    history: [],
    sumber: 'Nadine',
    tahunMasuk: 2026,
    abstraksiTelaahan: {
      pokokPermasalahan: 'Sengketa Kepemilikan Hak Milik Adat atas Tanah Kompleks Kampus BDK Cimahi senilai Rp 18 Miliar.',
      faktaHukum: 'Sertifikat Hak Pakai atas nama Pemerintah RI terbit tahun 1982 dan telah dikuasai secara fisik tanpa interupsi lebih dari 40 tahun.',
      dasarHukum: [
        'UU No. 5 Tahun 1960 tentang Pokok Agraria',
        'PP No. 18 Tahun 2021 tentang Hak Pengelolaan, Hak Atas Tanah, dan Pendaftaran Tanah'
      ],
      analisisKajian: 'Sertifikat Hak Pakai atas nama Pemerintah RI terbit tahun 1982 dan telah dikuasai secara fisik tanpa interupsi lebih dari 40 tahun. Gugatan pihak lawan daluwarsa (rechtsverwerking).',
      rekomendasi: 'Pertahankan aset BMN dengan mengajukan alat bukti otentik buku warkah BPN dan memohon pembatalan sita jaminan.',
      tingkatUrgensi: 'Biasa',
      kategoriHukum: 'Perdata / Perlawanan Sita'
    },
    dokumenTelaahan: [
      { id: 'dt-70', name: 'Gugatan_Perlawanan_Sita_BDK_Cimahi.pdf', size: 560000, type: 'application/pdf', kategori: 'Permohonan', tanggal: '24/03/2026' },
      { id: 'dt-71', name: 'ND-150-SJ.4-2026_Telaahan_BDK_Cimahi_TTE.pdf', size: 840000, type: 'application/pdf', kategori: 'Naskah Telaahan', tanggal: '28/03/2026', nomor: 'ND-150/SJ.4/2026' }
    ],
    naskahTelaahan: {
      naskahId: 'NADINE-TLH-008',
      nomorNaskah: 'ND-150/SJ.4/2026',
      statusNaskah: StatusNaskahTelaahan.DIKIRIM,
      tglTte: '28/03/2026 14:00 WIB',
      tglKirim: '28/03/2026 14:30 WIB',
      perihal: 'Telaahan Yuridis Penyelamatan Aset BMN Gedung Balai Diklat Keuangan Cimahi'
    },
    team: [
      { id: 't-budi2', nama: 'Budi Santoso', nip: '199002152015021002', unit: 'Biro Advokasi, Setjen', role: 'Analis Hukum', teamRole: 'PIC' }
    ],
    picId: 't-budi2'
  }
];
