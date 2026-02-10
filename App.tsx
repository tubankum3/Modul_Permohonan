
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

import { Permohonan, StatusPermohonan, Riwayat, NotificationType, Notification as NotificationProps, JenisPermohonan, View, SuratMasukNadine, BerandaContent, FaqCategory } from './types';

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
    status: StatusPermohonan.TERKIRIM,
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
    jenis: JenisPermohonan.PENANGANAN_PERKARA,
    perihal: 'Gugatan Selesai Terkait Sengketa Tanah',
    uraian: 'Kasus sengketa tanah telah selesai dengan putusan pengadilan yang menguntungkan.',
    files: [{ name: 'putusan_final.pdf', size: 300000, type: 'application/pdf' }],
    status: StatusPermohonan.SELESAI,
    tanggal: '01/06/2024',
    unit: 'Direktorat Jenderal Kekayaan Negara',
    history: [
        { id: 1, author: 'Pegawai', message: 'Permohonan bantuan hukum.', files: [], timestamp: new Date('2024-01-10T10:00:00') },
        { id: 2, author: 'Administrator', message: 'Permohonan diterima, tim sedang dibentuk.', files: [], timestamp: new Date('2024-01-11T15:00:00') },
        { id: 3, author: 'Administrator', message: 'Kasus telah selesai. Dokumen putusan terlampir.', files: [{ name: 'putusan_final.pdf', size: 300000, type: 'application/pdf' }], timestamp: new Date('2024-06-01T14:00:00') }
    ],
    sumber: 'Internal',
  },
];

const initialBerandaContent: BerandaContent = {
    pageTitle: 'Modul Permohonan Bantuan Hukum',
    flowTitle: 'ALUR PERMOHONAN BANTUAN HUKUM',
    flowSteps: [
        { step: 1, title: 'Ajukan Permohonan', description: 'Mengajukan permohonan bantuan hukum melalui modul Permohonan Bantuan Hukum aplikasi Satu Kemenkeu.' },
        { step: 2, title: 'Pilih Jenis Bantuan', description: 'Pilih salah satu dari dua jenis permohonan: Penanganan Perkara atau Pendampingan.' },
        { step: 3, title: 'Lengkapi Dokumen', description: 'Sertakan uraian terkait permohonan dan softcopy dokumen pendukung.' },
        { step: 4, title: 'Kelola Konsep', description: 'Gunakan opsi "Edit", "Hapus", atau "Kirim" untuk mengelola konsep permohonan Anda.' },
        { step: 5, title: 'Proses Biro Advokasi', description: 'Biro Advokasi akan menerima dan menindaklanjuti permohonan bantuan hukum tersebut.' },
    ],
    eAdvokasiTitle: 'E-Advokasi',
    eAdvokasiParagraph1: 'Merupakan aplikasi yang dapat diakses oleh unit-unit di lingkungan Kementerian Keuangan sesuai PMK Nomor 233/PMK.01/2022 tentang Bantuan Hukum di Lingkungan Kementerian Keuangan, guna menyampaikan permohonan bantuan hukum dan konsultasi hukum dengan Biro Advokasi.',
    eAdvokasiParagraph2: 'Permohonan Bantuan Hukum dan Konsultasi Hukum dimaksud terkait dengan masalah hukum yang timbul sebagai akibat dari pelaksanaan tugas dan fungsi Kementerian Keuangan baik yang mengarah pada proses pengadilan,sedang dalam proses pengadilan maupun setelah adanya putusan pengadilan.'
};

const initialFaqData: FaqCategory[] = [
  {
    id: 'cat1',
    category: 'Definisi',
    questions: [
      { id: 'q1', question: 'Apa itu Biro Advokasi?', answer: 'Biro Advokasi adalah unit yang bertanggung jawab untuk memberikan bantuan, pertimbangan, dan perlindungan hukum kepada Kementerian Keuangan.' },
      { id: 'q2', question: 'Apa itu E-Advokasi?', answer: 'E-Advokasi adalah sistem aplikasi berbasis web yang digunakan untuk mengelola permohonan bantuan hukum secara elektronik di lingkungan Kementerian Keuangan.' },
      { id: 'q3', question: 'Apa yang dimaksud dengan Penanganan Perkara?', answer: 'Penanganan Perkara adalah bantuan hukum yang diberikan kepada:\n\n1. Unit atau Pegawai yang menghadapi permohonan pra peradilan sebagai termohon;\n2. Unit, Menteri/Mantan Menteri, Wamen/Mantan Wamen, Pejabat, Pegawai, Pensiunan dan/atau Mantan Pegawai yang mendapatkan Masalah Hukum bidang hukum perdata, niaga atau agama terkait dengan tugas kedinasan di Kementerian yang telah terdaftar dan diproses melalui badan peradilan baik sebagai penggugat/pelawan/pembantah maupun tergugat/terlawan/terbantah;\n3. Menteri, pimpinan Unit atau Pejabat yang menghadapi gugatan tata usaha negara sebagai tergugat;\n4. Menteri, pimpinan Unit atau Pejabat sebagai penggugat dalam kedudukannya sebagai badan hukum perdata;\n5. Menteri, pimpinan Unit atau Pejabat sebagai pemohon intervensi;\n6. Unit yang menghadapi permohonan uji materiil undang-undang di Mahkamah Konstitusi dan permohonan uji materiil perundang-undangan di bawah undang-undang di Mahkamah Agung yang terkait bidang tugas Kementerian;\n7. Unit yang menghadapi sengketa perpajakan;\n8. Serta penanganan perkara lain yang terdapat pada lembaga peradilan yang diatur dalam peraturan perundang-undangan.' },
      { id: 'q4', question: 'Apa yang dimaksud dengan Telaahan Kasus Hukum?', answer: 'Telaahan Kasus Hukum adalah analisis mendalam terhadap suatu kasus hukum untuk memberikan pandangan dan rekomendasi hukum yang komprehensif.' },
      { id: 'q5', question: 'Apa yang dimaksud dengan Pendampingan?', answer: 'Pendampingan adalah layanan bantuan hukum yang diberikan dalam bentuk konsultasi, mediasi, atau kehadiran fisik dalam proses hukum non-litigasi.' }
    ]
  },
  {
    id: 'cat2',
    category: 'Dasar Hukum',
    questions: [
        { id: 'q6', question: 'Apa dasar hukum layanan bantuan hukum ini?', answer: 'Dasar hukum utama adalah Peraturan Menteri Keuangan Nomor 123/PMK.01/2023 tentang Bantuan Hukum di Lingkungan Kementerian Keuangan.' }
    ]
  },
  {
    id: 'cat3',
    category: 'Standar Layanan',
    questions: [
        { id: 'q7', question: 'Berapa lama proses permohonan diproses?', answer: 'Standar waktu layanan adalah 3 hari kerja sejak permohonan diterima secara lengkap untuk review awal, dan akan diinformasikan lebih lanjut untuk proses penanganan.' }
    ]
  },
  {
    id: 'cat4',
    category: 'Pengelolaan Akun',
     questions: [
        { id: 'q8', question: 'Bagaimana cara mengubah kata sandi?', answer: 'Anda dapat mengubah kata sandi melalui menu "Profil" > "Ubah Kata Sandi" dan mengikuti instruksi yang diberikan.' }
    ]
  },
  {
    id: 'cat5',
    category: 'Troubleshooting',
     questions: [
        { id: 'q9', question: 'Saya tidak bisa mengunggah dokumen, apa yang harus dilakukan?', answer: 'Pastikan format file adalah PDF, DOCX, atau JPG dan ukurannya tidak melebihi 5MB. Jika masalah berlanjut, hubungi helpdesk IT.' }
    ]
  }
];

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-8 h-full">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <div className="border-b-4 border-blue-600 w-16 my-4"></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">This is a placeholder page. The content for the <span className="font-semibold">{title}</span> module is under development.</p>
        </div>
    </div>
);

const App: React.FC = () => {
  const [permohonanList, setPermohonanList] = useState<Permohonan[]>(initialPermohonan);
  const [currentView, setCurrentView] = useState<View>('beranda');
  const [selectedPermohonan, setSelectedPermohonan] = useState<Permohonan | null>(null);
  const [editingPermohonan, setEditingPermohonan] = useState<Permohonan | null>(null);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [modalState, setModalState] = useState<{
      isOpen: boolean;
      targetId: string | null;
      action: 'delete' | 'send' | null;
    }>({ isOpen: false, targetId: null, action: null });
  
  const [berandaContent, setBerandaContent] = useState<BerandaContent>(initialBerandaContent);
  const [faqData, setFaqData] = useState<FaqCategory[]>(initialFaqData);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);
  
  const handleNavigateToProses = (permohonan: Permohonan) => {
    setSelectedPermohonan(permohonan);
    setCurrentView('eAdvokasiProses');
  };

  const handleAcceptPermohonan = (id: string) => {
    let acceptedNomor = '';
    setPermohonanList(prevList =>
      prevList.map(p => {
        if (p.id === id) {
          acceptedNomor = p.Nomor || p.id;
          return { ...p, status: StatusPermohonan.DIPROSES };
        }
        return p;
      })
    );
    showNotification(`Permohonan ${acceptedNomor} telah diterima dan siap diproses.`, 'success');
    handleNavigate('eAdvokasiPengelolaan');
  };
  
  const handleUpdateStatus = (id: string, newStatus: StatusPermohonan) => {
     let updatedNomor = '';
     setPermohonanList(prevList =>
        prevList.map(p => {
          if (p.id === id) {
            updatedNomor = p.Nomor || p.id;
            return { ...p, status: newStatus };
          }
          return p;
        })
      );
      setSelectedPermohonan(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
      showNotification(`Status permohonan ${updatedNomor} berhasil diubah menjadi "${newStatus}".`, 'success');
  };

  const handleTarikDataNadine = (surat: SuratMasukNadine, jenis: JenisPermohonan) => {
    const newPermohonan: Permohonan = {
        id: surat.naskahId, // Use naskahId as the unique ID
        Nomor: surat.nomorSurat,
        pemohon: surat.unitPengirim,
        unit: surat.unitPengirim,
        tanggal: surat.tanggal,
        jenis: jenis,
        perihal: surat.perihal,
        uraian: `Surat masuk dari Nadine. Mohon diproses. Perihal: ${surat.perihal}`,
        files: [],
        status: StatusPermohonan.BARU,
        history: [],
        sumber: 'Nadine',
    };

    setPermohonanList(prevList => [newPermohonan, ...prevList.filter(p => p.id !== newPermohonan.id)]);
    showNotification(`Data dari Nadine dengan ID ${surat.naskahId} berhasil ditarik.`, 'success');
  };


  useEffect(() => {
    // This simulation can be removed if status updates are fully manual for admins
    // For now, it shows that the system can have background updates
    const timer = setTimeout(() => {
        const target = permohonanList.find(p => p.Nomor === 'ND-123/PB.01/2026' && p.status === StatusPermohonan.TERKIRIM);
        if (target) {
            handleUpdateStatus(target.id, StatusPermohonan.DIPROSES);
        }
    }, 7000);

    return () => clearTimeout(timer);
  }, [permohonanList]);


  const handleNavigate = (view: View) => {
    setCurrentView(view);
     if (['list', 'beranda', 'eAdvokasiInbox', 'eAdvokasiPengelolaan'].includes(view) || view.startsWith('eAdvokasi')) {
        setSelectedPermohonan(null);
        setEditingPermohonan(null);
     }
  };

  const handleSelectPermohonan = (permohonan: Permohonan | null) => {
    setSelectedPermohonan(permohonan);
    if (currentView !== 'eAdvokasiPengelolaan' && permohonan) {
        setCurrentView('detail');
    }
  };

  const handleBackToList = () => {
    handleNavigate('list');
  };

  const handleCreateNew = () => {
    setEditingPermohonan(null);
    setCurrentView('create');
  };
  
  const handleEditPermohonan = (permohonan: Permohonan) => {
    setEditingPermohonan(permohonan);
    setCurrentView('edit');
  };
  
  const handleNavigateToNadine = () => {
    setCurrentView('pilihTemplate');
  };
  
  const handleTemplateSelected = () => {
    setCurrentView('formNaskah');
  };

  const handleBackToTemplate = () => {
    setCurrentView('pilihTemplate');
  };

  const handleSaveDraft = (permohonan: Omit<Permohonan, 'id' | 'status' | 'tanggal' | 'unit' | 'history' | 'pemohon'>) => {
    let newId;
    do {
        newId = generateRandomId();
    } while (permohonanList.some(p => p.id === newId));

    const newPermohonan: Permohonan = {
      ...permohonan,
      id: newId,
      pemohon: 'Analis Hukum - Seksi Pembinaan Proses Bisnis dan Hukum II',
      status: StatusPermohonan.DRAFT,
      tanggal: new Date().toLocaleDateString('id-ID'),
      unit: 'Direktorat Sistem Perbendaharaan, Ditjen Perbendaharaan',
      history: [],
      sumber: 'Internal',
    };
    setPermohonanList(prev => [newPermohonan, ...prev]);
    setCurrentView('list');
    showNotification('Draft permohonan berhasil disimpan.', 'success');
  };

  const handleUpdateDraft = (updatedPermohonan: Permohonan) => {
    setPermohonanList(list => list.map(p => p.id === updatedPermohonan.id ? updatedPermohonan : p));
    setCurrentView('list');
    setEditingPermohonan(null);
    showNotification('Draft permohonan berhasil diperbarui.', 'success');
  };
  
  const handleDeletePermohonan = (id: string) => {
    const deletedNomor = permohonanList.find(p => p.id === id)?.id;
    setPermohonanList(prev => prev.filter(p => p.id !== id));
    showNotification(`Draft permohonan ${deletedNomor} berhasil dihapus.`, 'success');
  };
  
  const handleSendPermohonan = (id: string) => {
    let sentNomor = '';
    setPermohonanList(prev => prev.map(p => {
        if (p.id === id) {
            const newNomor = p.status === StatusPermohonan.DRAFT ? generateTiketNomor() : p.Nomor;
            sentNomor = newNomor || p.id;
            return { ...p, status: StatusPermohonan.TERKIRIM, Nomor: newNomor };
        }
        return p;
    }));
    showNotification(`Permohonan ${sentNomor} berhasil dikirim.`, 'success');
  };
  
  const requestDeletePermohonan = (id: string) => {
    setModalState({ isOpen: true, targetId: id, action: 'delete' });
  };

  const requestSendPermohonan = (id: string) => {
    setModalState({ isOpen: true, targetId: id, action: 'send' });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, targetId: null, action: null });
  };

  const handleConfirmAction = () => {
    if (modalState.targetId && modalState.action) {
      if (modalState.action === 'delete') {
        handleDeletePermohonan(modalState.targetId);
      } else if (modalState.action === 'send') {
        handleSendPermohonan(modalState.targetId);
      }
    }
    handleCloseModal();
  };

  const handleAddReply = (permohonanId: string, reply: Riwayat) => {
    const updatedList = permohonanList.map(p => {
      if (p.id === permohonanId) {
        const newHistory = [...p.history, reply];
        let newStatus = p.status;
        
        // If user replies to a 'Terkirim' status, it becomes 'Diproses'
        if (p.status === StatusPermohonan.TERKIRIM && reply.author === 'Pegawai') {
          newStatus = StatusPermohonan.DIPROSES;
          showNotification(`Status permohonan ${p.Nomor || p.id} diupdate menjadi "Diproses".`, 'info');
        }
        
        return { ...p, history: newHistory, status: newStatus };
      }
      return p;
    });
    setPermohonanList(updatedList);
    setSelectedPermohonan(updatedList.find(p => p.id === permohonanId) || null);
    showNotification('Tanggapan berhasil dikirim.', 'success');
  };

  const handleUpdateReply = (permohonanId: string, historyId: number, newMessage: string) => {
    const updatedList = permohonanList.map(p => {
        if (p.id === permohonanId) {
            const newHistory = p.history.map(h => 
                h.id === historyId ? { ...h, message: newMessage } : h
            );
            return { ...p, history: newHistory };
        }
        return p;
    });
    setPermohonanList(updatedList);
    setSelectedPermohonan(updatedList.find(p => p.id === permohonanId) || null);
    showNotification('Tanggapan berhasil diperbarui.', 'success');
  };

  const handleDeleteReply = (permohonanId: string, historyId: number) => {
    const updatedList = permohonanList.map(p => {
        if (p.id === permohonanId) {
            const newHistory = p.history.filter(h => h.id !== historyId);
            return { ...p, history: newHistory };
        }
        return p;
    });
    setPermohonanList(updatedList);
    setSelectedPermohonan(updatedList.find(p => p.id === permohonanId) || null);
    showNotification('Tanggapan berhasil dihapus.', 'success');
  };

  const handleSaveBerandaContent = (newContent: BerandaContent) => {
    setBerandaContent(newContent);
    showNotification('Informasi Beranda berhasil diperbarui.', 'success');
  };

  const handleSaveFaqData = (newFaqData: FaqCategory[]) => {
    setFaqData(newFaqData);
    showNotification('Data FAQ berhasil diperbarui.', 'success');
  };


  const renderContent = () => {
    const listProps = {
        permohonanList: permohonanList,
        onSelect: handleSelectPermohonan,
        onCreateNew: handleCreateNew,
        onEdit: handleEditPermohonan,
        onDelete: requestDeletePermohonan,
        onSend: requestSendPermohonan,
        currentView: currentView,
        viewMode: 'user' as const
    };

    switch (currentView) {
      case 'beranda':
        return <BerandaPage content={berandaContent} />;
      case 'faq':
        return <FaqPage faqData={faqData} />;
      case 'pilihTemplate':
        return <PilihTemplateNaskah onBack={handleBackToList} onNext={handleTemplateSelected} />;
      case 'formNaskah':
        return <FormNaskahDinas onBack={handleBackToTemplate} onNext={() => alert("Form Submitted!")} />;
      case 'create':
        return <BuatPermohonan onSaveDraft={handleSaveDraft} onCancel={handleBackToList} onNavigateToNadine={handleNavigateToNadine}/>;
      case 'edit':
        return <BuatPermohonan onUpdateDraft={handleUpdateDraft} onCancel={handleBackToList} initialData={editingPermohonan} onNavigateToNadine={handleNavigateToNadine}/>;
      case 'detail':
        return selectedPermohonan ? (
            <div className="flex h-full">
                <DaftarPermohonan {...listProps} selectedId={selectedPermohonan.id} />
                <div className="flex-1 overflow-y-auto">
                    <DetailPermohonan 
                        permohonan={selectedPermohonan} 
                        onBack={handleBackToList} 
                        onAddReply={handleAddReply}
                        onUpdateReply={handleUpdateReply}
                        onDeleteReply={handleDeleteReply}
                        currentUserRole='Pegawai'
                    />
                </div>
            </div>
        ) : <DaftarPermohonan {...listProps} />;
      // E-Advokasi Views
      case 'eAdvokasiInbox':
        return <EAdvokasiInbox permohonanList={permohonanList.filter(p => p.status === StatusPermohonan.BARU || p.status === StatusPermohonan.TERKIRIM)} onProses={handleNavigateToProses} onTarikData={handleTarikDataNadine} />;
       case 'eAdvokasiProses':
        return selectedPermohonan ? (
            <ProsesPermohonan
                permohonan={selectedPermohonan}
                onBack={() => handleNavigate('eAdvokasiInbox')}
                onAccept={handleAcceptPermohonan}
                onAddReply={handleAddReply}
                onUpdateReply={handleUpdateReply}
                onDeleteReply={handleDeleteReply}
            />
        ) : (
            <EAdvokasiInbox permohonanList={permohonanList.filter(p => p.status === StatusPermohonan.BARU || p.status === StatusPermohonan.TERKIRIM)} onProses={handleNavigateToProses} onTarikData={handleTarikDataNadine} />
        );
      case 'eAdvokasiPengelolaan':
         return <PengelolaanPermohonan 
            permohonanList={permohonanList.filter(p => p.status === StatusPermohonan.DIPROSES || p.status === StatusPermohonan.SELESAI)}
            selectedPermohonan={selectedPermohonan}
            onSelectPermohonan={handleSelectPermohonan}
            onAddReply={handleAddReply}
            onUpdateReply={handleUpdateReply}
            onDeleteReply={handleDeleteReply}
            onUpdateStatus={handleUpdateStatus}
            onNavigate={handleNavigate}
         />;
      
      // New E-Advokasi Placeholder Views
      case 'eAdvokasiBeranda': return <PlaceholderContent title="Beranda E-Advokasi" />;
      case 'eAdvokasiPendampingan': return <PlaceholderContent title="Pendampingan" />;
      case 'eAdvokasiPenangananPerkara': return <PlaceholderContent title="Penanganan Perkara" />;
      case 'eAdvokasiPenangananPutusan': return <PlaceholderContent title="Penanganan Putusan" />;
      case 'eAdvokasiKalender': return <PlaceholderContent title="Kalender Sidang" />;
      case 'eAdvokasiMonitoring': return <PlaceholderContent title="Monitoring" />;
      case 'eAdvokasiLaporan': return <PlaceholderContent title="Laporan" />;
      case 'eAdvokasiUser': return <PlaceholderContent title="Manajemen User" />;
      case 'eAdvokasiArsip': return <PlaceholderContent title="Arsip" />;
      case 'eAdvokasiRecycleBin': return <PlaceholderContent title="Recycle Bin" />;
      case 'eAdvokasiReferensi': return <PlaceholderContent title="Referensi" />;
      case 'eAdvokasiTim': return <PlaceholderContent title="Pengelolaan Tim" />;
      case 'eAdvokasiInfo': return <PengelolaanInformasi content={berandaContent} onSave={handleSaveBerandaContent} />;
      case 'eAdvokasiFaq': return <PengelolaanFaq faqData={faqData} onSave={handleSaveFaqData} />;
      
      case 'list':
      default:
        return <DaftarPermohonan {...listProps} />;
    }
  };
  
  const MainLayout = ['pilihTemplate', 'formNaskah'].includes(currentView) ? NadineLayout : Layout;
  
  const targetPermohonan = permohonanList.find(p => p.id === modalState.targetId);
  const displayIdentifier = targetPermohonan?.Nomor || targetPermohonan?.id;

  return (
    <>
      {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
      <ConfirmationModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmAction}
          title={modalState.action === 'delete' ? 'Konfirmasi Hapus' : 'Konfirmasi Kirim'}
          message={
            modalState.action === 'delete'
              ? `Apakah Anda yakin ingin menghapus draft permohonan dengan ID: ${displayIdentifier}? Tindakan ini tidak dapat diurungkan.`
              : `Apakah Anda yakin ingin mengirim permohonan dengan ID: ${displayIdentifier}? Setelah dikirim, draft tidak dapat diubah lagi.`
          }
          confirmText={modalState.action === 'delete' ? 'Hapus' : 'Kirim'}
        />
      <MainLayout onNavigate={handleNavigate} currentView={currentView}>
        {renderContent()}
      </MainLayout>
    </>
  );
};

export default App;
