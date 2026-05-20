import { 
  Permohonan, 
  JenisPermohonan, 
  StatusPermohonan, 
  BerandaContent, 
  FaqCategory, 
  PendampinganRecord, 
  StatusPendampingan, 
  PerkaraRecord, 
  StatusPerkara 
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
    files: [],
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
  pageTitle: "Selamat Datang di Sistem Permohonan Bantuan Hukum",
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
            { id: 1, suratTugas: 'ST-12', tanggalSuratTugas: '2021-08-11', agenda: 'Pemeriksaan saksi', tanggalAgenda: '2021-08-11', suratPemanggilan: 'SPGL-12', pemanggil: ['Joko bareskrim mabes polri'], terpanggil: ['Pihak Terkait'], posisiKasus: 'Penyelidikan', lokasi: 'RR Rapat Bareskrim', durasi: 180, rincian: 'di cecar pertanyaan menjebak', timestamp: new Date('2021-08-11') },
        ],
        team: [
            { id: '19XXXXX-XXXXXX-XXXXX-MADE', nama: 'Made', nip: '19XXXXX XXXXXX XXXXX', unit: 'Subbagian Advokasi IIIA, Bagian Advokasi III, Biro Advokasi, Sekretariat Jenderal', role: 'Analis Hukum', teamRole: 'Editor' },
            { id: 'k1', nama: 'Joko', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Analis Hukum', teamRole: 'Editor' },
            { id: 'k2', nama: 'Supeno', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Penelaah Kebijakan', teamRole: 'Editor' },
            { id: 'k3', nama: 'Marjuki', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Kepala Seksi', teamRole: 'Viewer' },
        ],
        picId: '19XXXXX-XXXXXX-XXXXX-MADE',
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
            ],
            tkBanding: [], tkKasasi: [], tkPK: []
        },
        putusan: [
            { 
                id: 1, 
                nomor: '37/Pdt.G/2021/PN', 
                tanggal: '2021-11-25', 
                amar: 'Lorem ipsum', 
                status: 'Menang', 
                posisi: 'Pertama',
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
            { id: 'k1', nama: 'Joko', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Analis Hukum', teamRole: 'Editor' },
            { id: 'k2', nama: 'Supeno', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Penelaah Kebijakan', teamRole: 'Editor' },
            { id: 'k3', nama: 'Marjuki', nip: '19XXXXX XXXXXX XXXXX', unit: 'Eselon IV, Eselon III, Eselon II, Eselon I', role: 'Kepala Seksi', teamRole: 'Viewer' },
        ],
        picId: 'k1',
        auditTrail: [
            { id: 1, timestamp: new Date('2021-12-25T01:46:37Z'), user: 'Admin System', action: 'merekam', details: 'Perkara dari Permohonan #11223344' },
            { id: 2, timestamp: new Date('2021-11-12T01:46:37Z'), user: 'Joko', action: 'memperbarui', details: 'Posisi Sidang Tk. Pertama' },
        ],
    },
];
