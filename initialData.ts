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
                {id: 3, suratTugas: 'ST-21', tanggalSuratTugas: '2026-02-21', agendaSidang: 'Replik', tanggalSidang: '2026-02-22', agendaBerikutnya: 'Duplik', tanggalSidangBerikutnya: '2026-02-26', kehadiranPihak: []},
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
  }
];
