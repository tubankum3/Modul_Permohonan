
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import DaftarPermohonan from './components/DaftarPermohonan';
import DetailPermohonan from './components/DetailPermohonan';
import BuatPermohonan from './components/BuatPermohonan';
import Notification from './components/Notification';
import { NadineLayout } from './components/NadineLayout';
import PilihTemplateNaskah from './components/PilihTemplateNaskah';
import FormNaskahDinas from './components/FormNaskahDinas';
import FaqPage from './components/FaqPage';
import BerandaPage from './components/BerandaPage';
import ConfirmationModal from './components/ConfirmationModal';
import EAdvokasiInbox from './components/EAdvokasiInbox';
import PengelolaanPermohonan from './components/PengelolaanPermohonan';
import ProsesPermohonan from './components/ProsesPermohonan';
import PengelolaanInformasi from './components/PengelolaanInformasi';
import PengelolaanFaq from './components/PengelolaanFaq';
import Pendampingan from './components/Pendampingan';
import DetailPendampingan from './components/DetailPendampingan';
import AssignTeam from './components/AssignTeam';
import PosisiPendampingan from './components/PosisiPendampingan';
import PenangananPerkara from './components/PenangananPerkara';
import DetailPerkara from './components/DetailPerkara';
import EditPerkara from './components/EditPerkara';
import UpdatePosisiPerkara from './components/UpdatePosisiPerkara';
import EAdvokasiKalender from './components/EAdvokasiKalender';
import DaftarAgendaBerikutnya from './components/DaftarAgendaBerikutnya';
import PenangananPutusan from './components/PenangananPutusan';
import DetailPutusan from './components/DetailPutusan';
import UpdateTindakLanjut from './components/UpdateTindakLanjut';

import { Permohonan, StatusPermohonan, Riwayat, NotificationType, Notification as NotificationProps, JenisPermohonan, View, SuratMasukNadine, BerandaContent, FaqCategory, PendampinganRecord, StatusPendampingan, PosisiUpdate, TeamMember, PerkaraRecord, StatusPerkara, StatusPutusan } from './types';
import { ArrowLeftIcon } from './components/icons';

const generateRandomId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const generateTiketNomor = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    
    const randomDigit = Math.floor(Math.random() * 10);
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let randomLetters = '';
    for (let i = 0; i < 3; i++) {
        randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    return `${year}${month}${day}-${randomDigit}${randomLetters}`;
};


const initialPermohonan: Permohonan[] = [
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

const initialBerandaContent: BerandaContent = {
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

const initialFaqData: FaqCategory[] = [
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

const initialPendampinganRecords: PendampinganRecord[] = [
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
            { id: 1, suratTugas: 'ST-12', tanggalSuratTugas: '2021-08-11', agenda: 'Pemeriksaan saksi', tanggalAgenda: '2021-08-11', pemanggilDanSurat: { pemanggil: 'Joko bareskrim mabes polri', surat: 'SPGL-12' }, lokasi: 'RR Rapat Bareskrim', durasi: 180, rincian: 'di cecar pertanyaan menjebak', timestamp: new Date('2021-08-11') },
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

const initialPerkaraRecords: PerkaraRecord[] = [
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
            jenisPerkara: ['Perdata'],
            pengadilan: ['Pengadilan Tinggi Sabang'],
            jenisPokokPerkara: ['Kekayaan Negara'],
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
            { id: 1, objek: 'TGR', jenis: 'Materiil', jumlahNominal: '1.000.000.000', satuan: 'IDR', keterangan: '-' },
            { id: 2, objek: 'TGR', jenis: 'Immateriil', jumlahNominal: '1.000.000.000.000', satuan: 'IDR', keterangan: '-' },
            { id: 3, objek: 'TGR', jenis: 'Dwangsom', jumlahNominal: '-', satuan: '-', keterangan: 'Lorem Ipsum' },
            { id: 4, objek: 'BMN', jenis: 'Tanah', jumlahNominal: '100', satuan: 'm2', keterangan: 'SHM No. XX' },
        ],
        susunanMajelis: [
            { id: 1, jabatan: 'Hakim Ketua', identitas: 'Joko' },
            { id: 2, jabatan: 'Hakim Anggota', identitas: 'Wi' },
            { id: 3, jabatan: 'Hakim Anggota', identitas: 'Dodo' },
        ],
        posisiSidang: {
            tkPertama: [
                {id: 1, suratTugas: 'ST-12', tanggalSuratTugas: '2026-02-11', agendaSidang: 'Mediasi', tanggalSidang: '2026-02-12', agendaBerikutnya: 'Jawaban', tanggalSidangBerikutnya: '2026-02-18', kehadiran: 'Hadir'},
                {id: 2, agendaSidang: 'Jawaban', tanggalSidang: '2026-02-18', agendaBerikutnya: 'Replik', tanggalSidangBerikutnya: '2026-02-22', kehadiran: 'Tidak Hadir'},
                {id: 3, suratTugas: 'ST-21', tanggalSuratTugas: '2026-02-21', agendaSidang: 'Replik', tanggalSidang: '2026-02-22', agendaBerikutnya: 'Duplik', tanggalSidangBerikutnya: '2026-02-26', kehadiran: 'Hadir'},
            ],
            tkBanding: [], tkKasasi: [], tkPK: []
        },
        putusan: [
            { id: 1, nomor: '37/Pdt.G/2021/PN', tanggal: '2021-11-25', amar: 'Lorem ipsum', status: 'Menang', posisi: 'Pertama' }
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


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('beranda');
  const [permohonanList, setPermohonanList] = useState<Permohonan[]>(initialPermohonan);
  const [selectedPermohonan, setSelectedPermohonan] = useState<Permohonan | null>(null);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [currentPermohonanToProses, setCurrentPermohonanToProses] = useState<Permohonan | null>(null);
  const [berandaContent, setBerandaContent] = useState<BerandaContent>(initialBerandaContent);
  const [faqData, setFaqData] = useState<FaqCategory[]>(initialFaqData);
  const [pendampinganRecords, setPendampinganRecords] = useState<PendampinganRecord[]>(initialPendampinganRecords);
  const [selectedPendampingan, setSelectedPendampingan] = useState<PendampinganRecord | null>(null);
  const [perkaraRecords, setPerkaraRecords] = useState<PerkaraRecord[]>(initialPerkaraRecords);
  const [selectedPerkara, setSelectedPerkara] = useState<PerkaraRecord | Partial<PerkaraRecord> | null>(null);
  const [putusanRecords, setPutusanRecords] = useState<PerkaraRecord[]>([]);
  const [selectedPutusan, setSelectedPutusan] = useState<PerkaraRecord | null>(null);

  useEffect(() => {
    const recordsToMove = perkaraRecords.filter(p => 
        p.statusPerkara === StatusPerkara.AKTIF && 
        p.statusBHT?.status === 'Inkracht' && 
        p.putusan?.some(put => put.status === 'Kalah')
    );

    if (recordsToMove.length > 0) {
        const newPutusanRecords = recordsToMove.map(p => ({ ...p, statusPutusan: StatusPutusan.AKTIF }));
        
        setPutusanRecords(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const uniqueNewRecords = newPutusanRecords.filter(r => !existingIds.has(r.id));
            return [...prev, ...uniqueNewRecords];
        });
    }
  }, [perkaraRecords]);


  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
  };
  
  const handleSelectPermohonan = (permohonan: Permohonan) => {
    setSelectedPermohonan(permohonan);
    if(currentView !== 'eAdvokasiPengelolaan') {
        setCurrentView('detail');
    }
  };
  
  const handleNavigate = useCallback((view: View, data?: any) => {
    if (view === 'list' || view === 'eAdvokasiPengelolaan') {
      setSelectedPermohonan(null);
    }
    if (!['eAdvokasiPendampinganDetail', 'eAdvokasiPendampinganPosisi', 'eAdvokasiPendampinganTim'].includes(view)) {
        setSelectedPendampingan(null);
    }
    if (!view.startsWith('eAdvokasiPerkara')) {
        setSelectedPerkara(null);
    }
    if (!view.startsWith('eAdvokasiPutusan')) {
        setSelectedPutusan(null);
    }
    if (data) {
        if(view.startsWith('eAdvokasiPendampingan')) setSelectedPendampingan(data);
        if(view.startsWith('eAdvokasiPerkara')) setSelectedPerkara(data);
        if(view.startsWith('eAdvokasiPutusan')) setSelectedPutusan(data);
    }
    setCurrentView(view);
  }, []);

  const handleSaveDraft = (draft: Omit<Permohonan, 'id' | 'status' | 'tanggal' | 'unit' | 'history' | 'pemohon'>) => {
    const newDraft: Permohonan = {
      ...draft,
      id: generateRandomId(),
      status: StatusPermohonan.DRAFT,
      tanggal: new Date().toLocaleDateString('en-GB'),
      unit: 'Direktorat Sistem Perbendaharaan, Ditjen Perbendaharaan',
      pemohon: 'Analis Hukum - Seksi Pembinaan Proses Bisnis dan Hukum II',
      history: [],
      sumber: 'Internal'
    };
    setPermohonanList([newDraft, ...permohonanList]);
    showNotification('Draft permohonan berhasil disimpan.');
    handleNavigate('list');
  };
  
  const handleUpdateDraft = (updatedDraft: Permohonan) => {
    setPermohonanList(permohonanList.map(p => p.id === updatedDraft.id ? updatedDraft : p));
    showNotification('Draft permohonan berhasil diperbarui.');
    handleNavigate('list');
    setSelectedPermohonan(updatedDraft);
  };
  
  const handleDelete = (id: string) => {
    setPermohonanList(permohonanList.filter(p => p.id !== id));
    showNotification('Draft berhasil dihapus.', 'info');
    if (selectedPermohonan?.id === id) {
      setSelectedPermohonan(null);
      handleNavigate('list');
    }
  };
  
  const handleSend = (id: string) => {
    setPermohonanList(permohonanList.map(p => 
      p.id === id 
        ? { ...p, status: StatusPermohonan.TERKIRIM, Nomor: p.Nomor || generateTiketNomor() } 
        : p
    ));
    showNotification('Permohonan berhasil dikirim.');
    setSelectedPermohonan(null);
    handleNavigate('list');
  };

  const handleAddReply = (permohonanId: string, reply: Riwayat) => {
    const updateList = (list: Permohonan[]) => list.map(p => 
      p.id === permohonanId 
        ? { ...p, history: [...p.history, reply] } 
        : p
    );
    setPermohonanList(updateList);
    setPendampinganRecords(prev => updateList(prev) as PendampinganRecord[]);

    if (selectedPermohonan?.id === permohonanId) {
        setSelectedPermohonan(prev => prev ? { ...prev, history: [...prev.history, reply] } : null);
    }
    if (currentPermohonanToProses?.id === permohonanId) {
        setCurrentPermohonanToProses(prev => prev ? { ...prev, history: [...prev.history, reply] } : null);
    }
  };
  
  const handleUpdateReply = (permohonanId: string, historyId: number, newMessage: string) => {
      const updateHistory = (history: Riwayat[]) => history.map(h => h.id === historyId ? { ...h, message: newMessage } : h);
      
      const updateList = (list: Permohonan[]) => list.map(p => 
        p.id === permohonanId 
          ? { ...p, history: updateHistory(p.history) } 
          : p
      );
      setPermohonanList(updateList);
      setPendampinganRecords(prev => updateList(prev) as PendampinganRecord[]);

      if (selectedPermohonan?.id === permohonanId) {
          setSelectedPermohonan(prev => prev ? { ...prev, history: updateHistory(prev.history) } : null);
      }
      if (currentPermohonanToProses?.id === permohonanId) {
          setCurrentPermohonanToProses(prev => prev ? { ...prev, history: updateHistory(prev.history) } : null);
      }
  };

  const handleDeleteReply = (permohonanId: string, historyId: number) => {
      const updateHistory = (history: Riwayat[]) => history.filter(h => h.id !== historyId);

      const updateList = (list: Permohonan[]) => list.map(p => 
        p.id === permohonanId 
          ? { ...p, history: updateHistory(p.history) } 
          : p
      );
      setPermohonanList(updateList);
      setPendampinganRecords(prev => updateList(prev) as PendampinganRecord[]);

      if (selectedPermohonan?.id === permohonanId) {
          setSelectedPermohonan(prev => prev ? { ...prev, history: updateHistory(prev.history) } : null);
      }
      if (currentPermohonanToProses?.id === permohonanId) {
          setCurrentPermohonanToProses(prev => prev ? { ...prev, history: updateHistory(prev.history) } : null);
      }
  };
  
  const handleProses = (permohonan: Permohonan) => {
    setCurrentPermohonanToProses(permohonan);
    handleNavigate('eAdvokasiProses');
  };
  
  const handleAcceptPermohonan = (id: string) => {
    setPermohonanList(permohonanList.map(p => p.id === id ? { ...p, status: StatusPermohonan.DIPROSES } : p));
    showNotification('Permohonan telah diterima dan dipindahkan ke Pengelolaan Permohonan.');
    handleNavigate('eAdvokasiPengelolaan');
  };

  const handleUpdateStatus = (id: string, newStatus: StatusPermohonan | StatusPendampingan) => {
      setPermohonanList(permohonanList.map(p => p.id === id ? { ...p, status: newStatus as StatusPermohonan } : p));
      setPendampinganRecords(pendampinganRecords.map(p => p.id === id ? { ...p, statusPendampingan: newStatus as StatusPendampingan } : p));
      showNotification('Status berhasil diperbarui.', 'info');
  };
  
  const handleTarikDataNadine = (surat: SuratMasukNadine, jenis: JenisPermohonan) => {
      const newPermohonan: Permohonan = {
          id: surat.naskahId,
          Nomor: surat.nomorSurat,
          pemohon: surat.unitPengirim,
          unit: surat.unitPengirim,
          tanggal: surat.tanggal,
          jenis: jenis,
          perihal: surat.perihal,
          uraian: `Permohonan dari Nadine dengan perihal: ${surat.perihal}`,
          files: [],
          status: StatusPermohonan.BARU,
          history: [],
          sumber: 'Nadine'
      };
      setPermohonanList([newPermohonan, ...permohonanList]);
      showNotification('Data dari Nadine berhasil ditarik.');
  };
  
  const handleSaveBerandaContent = (newContent: BerandaContent) => {
    setBerandaContent(newContent);
    showNotification('Informasi beranda berhasil diperbarui.');
  };

  const handleSaveFaq = (newFaqData: FaqCategory[]) => {
    setFaqData(newFaqData);
    showNotification('FAQ berhasil diperbarui.');
  };

  const handleSavePendampingan = (record: PendampinganRecord) => {
    const index = record.id ? pendampinganRecords.findIndex(r => r.id === record.id) : -1;
    
    if (index > -1) {
        setPendampinganRecords(prev => prev.map(r => r.id === record.id ? record : r));
        showNotification('Data pendampingan berhasil diperbarui.');
    } else {
        const isRecording = record.id && permohonanList.some(p => p.id === record.id);
        const newRecord = { ...record, id: record.id || `pd-${generateRandomId()}` };
        setPendampinganRecords(prev => [newRecord, ...prev]);
        
        if (isRecording) {
            showNotification('Permohonan berhasil direkam sebagai Pendampingan Aktif.');
        } else {
            showNotification('Pendampingan baru berhasil ditambahkan.');
        }
    }
  };

  const handleDeletePendampingan = (id: string) => {
    setPendampinganRecords(prev => prev.filter(r => r.id !== id));
    showNotification('Data pendampingan berhasil dihapus.', 'info');
  };

  const handleAddPosisiUpdate = (recordId: string, posisi: Omit<PosisiUpdate, 'id' | 'timestamp'>) => {
    setPendampinganRecords(prev => prev.map(r => {
        if (r.id === recordId) {
            const newPosisi: PosisiUpdate = { ...posisi, id: (r.posisi?.length || 0) + 1, timestamp: new Date() };
            const updatedRecord = { ...r, posisi: [...(r.posisi || []), newPosisi] };
            if(selectedPendampingan?.id === recordId) setSelectedPendampingan(updatedRecord);
            return updatedRecord;
        }
        return r;
    }));
    showNotification('Posisi pendampingan berhasil ditambahkan.');
  };

  const handleUpdatePosisiUpdate = (recordId: string, posisiId: number, updatedPosisiData: Omit<PosisiUpdate, 'id' | 'timestamp' | 'timestamp'>) => {
    setPendampinganRecords(prev => prev.map(r => {
        if (r.id === recordId) {
            const updatedPosisiArray = r.posisi?.map(p => p.id === posisiId ? { ...p, ...updatedPosisiData } : p) || [];
            const updatedRecord = { ...r, posisi: updatedPosisiArray };
             if(selectedPendampingan?.id === recordId) setSelectedPendampingan(updatedRecord);
            return updatedRecord;
        }
        return r;
    }));
    showNotification('Posisi pendampingan berhasil diperbarui.');
};

  const handleDeletePosisiUpdate = (recordId: string, posisiId: number) => {
      setPendampinganRecords(prev => prev.map(r => {
          if (r.id === recordId) {
              const updatedPosisiArray = r.posisi?.filter(p => p.id !== posisiId) || [];
              const updatedRecord = { ...r, posisi: updatedPosisiArray };
              if(selectedPendampingan?.id === recordId) setSelectedPendampingan(updatedRecord);
              return updatedRecord;
          }
          return r;
      }));
      showNotification('Posisi pendampingan berhasil dihapus.', 'info');
  };
  
  const handleUpdatePendampinganTeam = (recordId: string, team: TeamMember[]) => {
    setPendampinganRecords(prev => prev.map(r => {
        if (r.id === recordId) {
            const newEntry = { id: Date.now(), timestamp: new Date(), user: 'Admin User', action: 'memperbarui', details: 'susunan anggota tim' };
            const updatedRecord = { ...r, team, auditTrail: [...(r.auditTrail || []), newEntry] };
            if (selectedPendampingan?.id === recordId) setSelectedPendampingan(updatedRecord);
            return updatedRecord;
        }
        return r;
    }));
    showNotification('Tim advokasi berhasil diperbarui.');
  };

  const handleSetPendampinganPic = (recordId: string, picId: string | null) => {
      setPendampinganRecords(prev => prev.map(r => {
          if (r.id === recordId) {
              const picName = r.team?.find(m => m.id === picId)?.nama || 'None';
              const newEntry = { id: Date.now(), timestamp: new Date(), user: 'Admin User', action: 'menetapkan', details: `PIC baru: ${picName}` };
              const updatedRecord = { ...r, picId: picId || undefined, auditTrail: [...(r.auditTrail || []), newEntry] };
              if (selectedPendampingan?.id === recordId) setSelectedPendampingan(updatedRecord);
              return updatedRecord;
          }
          return r;
      }));
      showNotification('PIC berhasil diperbarui.');
  };
  
    const handleSavePerkara = (record: PerkaraRecord) => {
        const index = record.id && !record.id.startsWith('new-') ? perkaraRecords.findIndex(r => r.id === record.id) : -1;
        
        if (index > -1) {
            setPerkaraRecords(prev => prev.map(r => r.id === record.id ? record : r));
            showNotification('Data perkara berhasil diperbarui.');
        } else {
            const isRecording = record.id && permohonanList.some(p => p.id === record.id);
            const newRecord = { ...record, id: isRecording ? record.id : `pk-${generateRandomId()}` };
            setPerkaraRecords(prev => [newRecord, ...prev]);
            
            if (isRecording) {
                showNotification('Permohonan berhasil direkam sebagai Perkara Aktif.');
            } else {
                showNotification('Perkara baru berhasil ditambahkan.');
            }
        }
        handleNavigate('eAdvokasiPenangananPerkara');
    };

    const handleDeletePerkara = (id: string) => {
        setPerkaraRecords(prev => prev.filter(r => r.id !== id));
        showNotification('Data perkara berhasil dihapus.', 'info');
    };
    
    const handleUpdatePerkaraStatus = (id: string, newStatus: StatusPerkara) => {
        setPerkaraRecords(prev => prev.map(r => r.id === id ? { ...r, statusPerkara: newStatus } : r));
        showNotification(`Status perkara berhasil diubah menjadi "${newStatus}".`);
    };
    
    const handleForwardPerkara = (id: string) => {
        const recordToForward = perkaraRecords.find(r => r.id === id);
        if (recordToForward) {
            const isAlreadyForwarded = putusanRecords.some(pr => pr.id === id);
            if (isAlreadyForwarded) {
                showNotification(`Perkara ${id} sudah ada di Penanganan Putusan.`, 'info');
                return;
            }
            const newPutusanRecord = { ...recordToForward, statusPutusan: StatusPutusan.AKTIF };
            setPutusanRecords(prev => [newPutusanRecord, ...prev]);
            showNotification(`Perkara ${id} berhasil diteruskan ke Penanganan Putusan.`);
        } else {
            showNotification(`Perkara dengan ID ${id} tidak ditemukan.`, 'error');
        }
    };

    const handleUpdatePerkaraTeam = (recordId: string, team: TeamMember[]) => {
        setPerkaraRecords(prev => prev.map(r => {
            if (r.id === recordId) {
                const newEntry = { id: Date.now(), timestamp: new Date(), user: 'Admin User', action: 'memperbarui', details: 'susunan anggota tim' };
                const updatedRecord = { ...r, team, auditTrail: [...(r.auditTrail || []), newEntry] };
                if (selectedPerkara && 'id' in selectedPerkara && selectedPerkara.id === recordId) setSelectedPerkara(updatedRecord);
                return updatedRecord;
            }
            return r;
        }));
        showNotification('Tim advokasi perkara berhasil diperbarui.');
    };

    const handleSetPerkaraPic = (recordId: string, picId: string | null) => {
        setPerkaraRecords(prev => prev.map(r => {
            if (r.id === recordId) {
                const picName = r.team?.find(m => m.id === picId)?.nama || 'None';
                const newEntry = { id: Date.now(), timestamp: new Date(), user: 'Admin User', action: 'menetapkan', details: `PIC baru: ${picName}` };
                const updatedRecord = { ...r, picId: picId || undefined, auditTrail: [...(r.auditTrail || []), newEntry] };
                if (selectedPerkara && 'id' in selectedPerkara && selectedPerkara.id === recordId) setSelectedPerkara(updatedRecord);
                return updatedRecord;
            }
            return r;
        }));
        showNotification('PIC perkara berhasil diperbarui.');
    };

    const handleSavePutusan = (record: PerkaraRecord) => {
        setPutusanRecords(prev => prev.map(r => r.id === record.id ? record : r));
        showNotification('Data putusan berhasil diperbarui.');
        handleNavigate('eAdvokasiPenangananPutusan');
    };

    const handleDeletePutusan = (id: string) => {
        setPutusanRecords(prev => prev.filter(r => r.id !== id));
        showNotification('Data putusan berhasil dihapus.', 'info');
    };

    const handleSetPutusanSelesai = (id: string) => {
        setPutusanRecords(prev => prev.map(r => r.id === id ? { ...r, statusPutusan: StatusPutusan.SELESAI } : r));
        showNotification('Status putusan berhasil diubah menjadi "Selesai".');
    };

  const renderMainContent = () => {
    switch (currentView) {
      case 'beranda': return <BerandaPage content={berandaContent} />;
      case 'list':
      case 'detail':
      case 'create':
      case 'edit':
        return (
          <div className="flex h-full">
            <DaftarPermohonan permohonanList={permohonanList} selectedId={selectedPermohonan?.id} onSelect={handleSelectPermohonan} onCreateNew={() => handleNavigate('create')} onEdit={(p) => { setSelectedPermohonan(p); handleNavigate('edit'); }} onDelete={handleDelete} onSend={handleSend} currentView={currentView} viewMode="user"/>
            {currentView === 'detail' && selectedPermohonan && <DetailPermohonan permohonan={selectedPermohonan} onAddReply={handleAddReply} onUpdateReply={handleUpdateReply} onDeleteReply={handleDeleteReply} currentUserRole="Pegawai" />}
            {currentView === 'create' && <BuatPermohonan onSaveDraft={handleSaveDraft} onCancel={() => handleNavigate('list')} onNavigateToNadine={() => handleNavigate('pilihTemplate')} />}
            {currentView === 'edit' && selectedPermohonan && <BuatPermohonan initialData={selectedPermohonan} onUpdateDraft={handleUpdateDraft} onCancel={() => handleNavigate('list')} onNavigateToNadine={() => handleNavigate('pilihTemplate')} />}
          </div>
        );
      case 'pilihTemplate': return <PilihTemplateNaskah onBack={() => handleNavigate('beranda')} onNext={() => handleNavigate('formNaskah')} />;
      case 'formNaskah': return <FormNaskahDinas onBack={() => handleNavigate('pilihTemplate')} onNext={() => showNotification("Fitur ini belum diimplementasikan", "info")} />;
      case 'faq': return <FaqPage faqData={faqData} />;
      case 'eAdvokasiInbox': return <EAdvokasiInbox permohonanList={permohonanList.filter(p => p.status === StatusPermohonan.TERKIRIM || p.status === StatusPermohonan.BARU)} onProses={handleProses} onTarikData={handleTarikDataNadine} />;
      case 'eAdvokasiPengelolaan': return <PengelolaanPermohonan permohonanList={permohonanList.filter(p => p.status === StatusPermohonan.DIPROSES || p.status === StatusPermohonan.SELESAI)} selectedPermohonan={selectedPermohonan} onSelectPermohonan={setSelectedPermohonan} onAddReply={handleAddReply} onUpdateReply={handleUpdateReply} onDeleteReply={handleDeleteReply} onUpdateStatus={handleUpdateStatus} onNavigate={handleNavigate} />;
      case 'eAdvokasiProses': return currentPermohonanToProses ? (<ProsesPermohonan permohonan={currentPermohonanToProses} onBack={() => handleNavigate('eAdvokasiInbox')} onAccept={handleAcceptPermohonan} onAddReply={handleAddReply} onUpdateReply={handleUpdateReply} onDeleteReply={handleDeleteReply}/>) : <div className="p-8">Permohonan tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiInbox')} className="text-blue-600 underline">Inbox</button>.</div>;
      case 'eAdvokasiInfo': return <PengelolaanInformasi content={berandaContent} onSave={handleSaveBerandaContent} />;
      case 'eAdvokasiFaq': return <PengelolaanFaq faqData={faqData} onSave={handleSaveFaq} />;
      case 'eAdvokasiPendampingan':
        const pendampinganBaruList = permohonanList.filter(p => p.status === StatusPermohonan.DIPROSES && p.jenis === JenisPermohonan.PENDAMPINGAN && !pendampinganRecords.some(r => r.id === p.id));
        return <Pendampingan pendampinganBaruList={pendampinganBaruList} daftarPendampingan={pendampinganRecords} onUpdateStatus={(id, status) => handleUpdateStatus(id, status)} onSave={handleSavePendampingan} onDelete={handleDeletePendampingan} onView={(record) => { setSelectedPendampingan(record); handleNavigate('eAdvokasiPendampinganDetail'); }} onNavigate={handleNavigate} onManagePosisi={(record) => { setSelectedPendampingan(record); handleNavigate('eAdvokasiPendampinganPosisi'); }} />;
      case 'eAdvokasiPendampinganDetail': return selectedPendampingan ? <DetailPendampingan record={selectedPendampingan} onBack={() => handleNavigate('eAdvokasiPendampingan')} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="text-blue-600 underline">Daftar Pendampingan</button>.</div>;
      case 'eAdvokasiPendampinganTim': return selectedPendampingan ? (<div className="h-full flex flex-col bg-gray-50"><header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start"><button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1"><ArrowLeftIcon className="h-5 w-5" /></button><div className="ml-3"><h2 className="text-lg font-bold text-gray-800">Pengelolaan Tim Advokasi</h2><p className="text-sm text-gray-500 mt-1">{selectedPendampingan.Nomor} - {selectedPendampingan.perihal}</p></div></header><div className="flex-1 overflow-y-auto"><AssignTeam team={selectedPendampingan.team || []} picId={selectedPendampingan.picId || null} onUpdateTeam={(team) => handleUpdatePendampinganTeam(selectedPendampingan.id, team)} onSetPic={(picId) => handleSetPendampinganPic(selectedPendampingan.id, picId)}/></div></div>) : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="text-blue-600 underline">Daftar Pendampingan</button>.</div>;
      case 'eAdvokasiPendampinganPosisi': return selectedPendampingan ? (<PosisiPendampingan record={selectedPendampingan} onBack={() => handleNavigate('eAdvokasiPendampingan')} onAddPosisi={(posisi) => handleAddPosisiUpdate(selectedPendampingan.id, posisi)} onUpdatePosisi={(posisiId, posisi) => handleUpdatePosisiUpdate(selectedPendampingan.id, posisiId, posisi)} onDeletePosisi={(posisiId) => handleDeletePosisiUpdate(selectedPendampingan.id, posisiId)} onNavigate={handleNavigate}/>) : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPendampingan')} className="text-blue-600 underline">Daftar Pendampingan</button>.</div>;
      case 'eAdvokasiPenangananPerkara':
        const perkaraBaruList = permohonanList.filter(p => p.status === StatusPermohonan.DIPROSES && p.jenis === JenisPermohonan.PENANGANAN_PERKARA && !perkaraRecords.some(r => r.id === p.id));
        return <PenangananPerkara perkaraBaruList={perkaraBaruList} daftarPerkara={perkaraRecords} onUpdateStatus={handleUpdatePerkaraStatus} onSave={handleSavePerkara} onDelete={handleDeletePerkara} onView={(record) => { setSelectedPerkara(record); handleNavigate('eAdvokasiPerkaraDetail'); }} onNavigate={handleNavigate} onForward={handleForwardPerkara} />;
      case 'eAdvokasiPerkaraDetail': return selectedPerkara && 'statusPerkara' in selectedPerkara ? <DetailPerkara record={selectedPerkara as PerkaraRecord} onBack={() => handleNavigate('eAdvokasiPenangananPerkara')} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="text-blue-600 underline">Daftar Perkara</button>.</div>;
      case 'eAdvokasiPerkaraEdit': return <EditPerkara initialData={selectedPerkara} onSave={handleSavePerkara} onBack={() => handleNavigate('eAdvokasiPenangananPerkara')} />;
      case 'eAdvokasiPerkaraUpdatePosisi': return selectedPerkara && 'statusPerkara' in selectedPerkara ? <UpdatePosisiPerkara record={selectedPerkara as PerkaraRecord} onSave={handleSavePerkara} onBack={() => handleNavigate('eAdvokasiPenangananPerkara')} onNavigate={handleNavigate} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="text-blue-600 underline">Daftar Perkara</button>.</div>;
      case 'eAdvokasiPerkaraTim': return selectedPerkara && 'statusPerkara' in selectedPerkara ? (<div className="h-full flex flex-col bg-gray-50"><header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start"><button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1"><ArrowLeftIcon className="h-5 w-5" /></button><div className="ml-3"><h2 className="text-lg font-bold text-gray-800">Pengelolaan Tim Advokasi</h2><p className="text-sm text-gray-500 mt-1">{selectedPerkara.abstraksiPerkara?.noPerkara || selectedPerkara.Nomor} - {selectedPerkara.perihal}</p></div></header><div className="flex-1 overflow-y-auto"><AssignTeam team={selectedPerkara.team || []} picId={selectedPerkara.picId || null} onUpdateTeam={(team) => handleUpdatePerkaraTeam((selectedPerkara as PerkaraRecord).id, team)} onSetPic={(picId) => handleSetPerkaraPic((selectedPerkara as PerkaraRecord).id, picId)}/></div></div>) : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPerkara')} className="text-blue-600 underline">Daftar Perkara</button>.</div>;
      case 'eAdvokasiKalender': return <EAdvokasiKalender daftarPerkara={perkaraRecords} onNavigate={handleNavigate} />;
      case 'eAdvokasiAgendaBerikutnya': return <DaftarAgendaBerikutnya daftarPerkara={perkaraRecords} onBack={() => handleNavigate('eAdvokasiKalender')} />;
      case 'eAdvokasiPenangananPutusan': return <PenangananPutusan daftarPutusan={putusanRecords} onView={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanDetail'); }} onEdit={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanEdit'); }} onUpdateTindakLanjut={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanUpdateTindakLanjut'); }} onManageTim={(record) => { setSelectedPutusan(record); handleNavigate('eAdvokasiPutusanTim'); }} onDelete={handleDeletePutusan} onSetSelesai={handleSetPutusanSelesai} />;
      case 'eAdvokasiPutusanDetail': return selectedPutusan ? <DetailPutusan record={selectedPutusan} onBack={() => handleNavigate('eAdvokasiPenangananPutusan')} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="text-blue-600 underline">Penanganan Putusan</button>.</div>;
      case 'eAdvokasiPutusanEdit': return <EditPerkara initialData={selectedPutusan} onSave={handleSavePutusan} onBack={() => handleNavigate('eAdvokasiPenangananPutusan')} />;
      case 'eAdvokasiPutusanUpdateTindakLanjut': return selectedPutusan ? <UpdateTindakLanjut record={selectedPutusan} onSave={handleSavePutusan} onBack={() => handleNavigate('eAdvokasiPenangananPutusan')} /> : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="text-blue-600 underline">Penanganan Putusan</button>.</div>;
      case 'eAdvokasiPutusanTim': return selectedPutusan ? (<div className="h-full flex flex-col bg-gray-50"><header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-start"><button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 mt-1"><ArrowLeftIcon className="h-5 w-5" /></button><div className="ml-3"><h2 className="text-lg font-bold text-gray-800">Pengelolaan Tim Advokasi Putusan</h2><p className="text-sm text-gray-500 mt-1">{selectedPutusan.abstraksiPerkara?.noPerkara || selectedPutusan.Nomor} - {selectedPutusan.perihal}</p></div></header><div className="flex-1 overflow-y-auto"><AssignTeam team={selectedPutusan.team || []} picId={selectedPutusan.picId || null} onUpdateTeam={(team) => { const updatedRecord = { ...selectedPutusan, team }; handleSavePutusan(updatedRecord); }} onSetPic={(picId) => { const updatedRecord = { ...selectedPutusan, picId: picId || undefined }; handleSavePutusan(updatedRecord); }}/></div></div>) : <div className="p-8">Data tidak ditemukan. Kembali ke <button onClick={() => handleNavigate('eAdvokasiPenangananPutusan')} className="text-blue-600 underline">Penanganan Putusan</button>.</div>;
      default: return <div className="p-8">Tampilan <span className="font-semibold">{currentView}</span> belum diimplementasikan.</div>
    }
  };

  const isNadineView = ['pilihTemplate', 'formNaskah'].includes(currentView);

  return (
    <>
      {notification && <Notification {...notification} onDismiss={() => setNotification(null)} />}
      {isNadineView ? (
        <NadineLayout onNavigate={handleNavigate} currentView={currentView}>
          {renderMainContent()}
        </NadineLayout>
      ) : (
        <Layout onNavigate={handleNavigate} currentView={currentView}>
          {renderMainContent()}
        </Layout>
      )}
    </>
  );
};

export default App;
