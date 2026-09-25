import { create } from 'zustand';
import { 
  initialPermohonan, 
  initialBerandaContent, 
  initialFaqData, 
  initialPendampinganRecords, 
  initialPerkaraRecords,
  initialUserAccounts,
  initialTelaahanRecords
} from './initialData';
import { 
  Permohonan, StatusPermohonan, Riwayat, NotificationType, Notification as NotificationProps, 
  JenisPermohonan, View, SuratMasukNadine, BerandaContent, FaqCategory, 
  PendampinganRecord, StatusPendampingan, PosisiUpdate, TeamMember, 
  PerkaraRecord, StatusPerkara, StatusPutusan, UserAccount,
  TelaahanRecord, StatusTelaahan, StatusNaskahTelaahan, DokumenTelaahanItem, NaskahTelaahanInfo
} from './types';

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

interface AdvokasiState {
  permohonanList: Permohonan[];
  selectedPermohonan: Permohonan | null;
  notification: NotificationProps | null;
  currentPermohonanToProses: Permohonan | null;
  berandaContent: BerandaContent;
  faqData: FaqCategory[];
  pendampinganRecords: PendampinganRecord[];
  selectedPendampingan: PendampinganRecord | null;
  perkaraRecords: PerkaraRecord[];
  selectedPerkara: PerkaraRecord | Partial<PerkaraRecord> | null;
  putusanRecords: PerkaraRecord[];
  selectedPutusan: PerkaraRecord | null;
  telaahanRecords: TelaahanRecord[];
  selectedTelaahan: TelaahanRecord | null;
  activeTelaahanForNadine: TelaahanRecord | null;

  // Actions
  setPermohonanList: (list: Permohonan[] | ((prev: Permohonan[]) => Permohonan[])) => void;
  setSelectedPermohonan: (p: Permohonan | null) => void;
  showNotification: (message: string, type?: NotificationType) => void;
  setNotification: (notif: NotificationProps | null) => void;
  setCurrentPermohonanToProses: (p: Permohonan | null | ((prev: Permohonan | null) => Permohonan | null)) => void;
  setBerandaContent: (c: BerandaContent) => void;
  setFaqData: (data: FaqCategory[]) => void;
  setPendampinganRecords: (records: PendampinganRecord[] | ((prev: PendampinganRecord[]) => PendampinganRecord[])) => void;
  setSelectedPendampingan: (r: PendampinganRecord | null | ((prev: PendampinganRecord | null) => PendampinganRecord | null)) => void;
  setPerkaraRecords: (records: PerkaraRecord[] | ((prev: PerkaraRecord[]) => PerkaraRecord[])) => void;
  setSelectedPerkara: (r: PerkaraRecord | Partial<PerkaraRecord> | null | ((prev: PerkaraRecord | Partial<PerkaraRecord> | null) => PerkaraRecord | Partial<PerkaraRecord> | null)) => void;
  setPutusanRecords: (records: PerkaraRecord[] | ((prev: PerkaraRecord[]) => PerkaraRecord[])) => void;
  setSelectedPutusan: (r: PerkaraRecord | null | ((prev: PerkaraRecord | null) => PerkaraRecord | null)) => void;
  setTelaahanRecords: (records: TelaahanRecord[] | ((prev: TelaahanRecord[]) => TelaahanRecord[])) => void;
  setSelectedTelaahan: (r: TelaahanRecord | null | ((prev: TelaahanRecord | null) => TelaahanRecord | null)) => void;
  setActiveTelaahanForNadine: (r: TelaahanRecord | null) => void;

  // Domain Handlers
  handleSelectPermohonan: (permohonan: Permohonan) => void;
  handleSaveDraft: (draft: Omit<Permohonan, 'id' | 'status' | 'tanggal' | 'unit' | 'history' | 'pemohon'>) => void;
  handleUpdateDraft: (updatedDraft: Permohonan) => void;
  handleDelete: (id: string) => void;
  handleSend: (id: string) => void;
  handleAddReply: (permohonanId: string, reply: Riwayat) => void;
  handleUpdateReply: (permohonanId: string, historyId: number, newMessage: string) => void;
  handleDeleteReply: (permohonanId: string, historyId: number) => void;
  handleProses: (permohonan: Permohonan) => void;
  handleAcceptPermohonan: (id: string) => void;
  handleUpdateStatus: (id: string, newStatus: StatusPermohonan | StatusPendampingan) => void;
  handleTarikDataNadine: (suratList: SuratMasukNadine[], jenis: JenisPermohonan) => void;
  handleSaveBerandaContent: (newContent: BerandaContent) => void;
  handleSaveFaq: (newFaqData: FaqCategory[]) => void;
  handleSavePendampingan: (record: PendampinganRecord) => void;
  handleDeletePendampingan: (id: string) => void;
  handleAddPosisiUpdate: (recordId: string, posisi: Omit<PosisiUpdate, 'id' | 'timestamp'>) => void;
  handleUpdatePosisiUpdate: (recordId: string, posisiId: number, updatedPosisiData: Omit<PosisiUpdate, 'id' | 'timestamp'>) => void;
  handleDeletePosisiUpdate: (recordId: string, posisiId: number) => void;
  handleUpdatePendampinganTeam: (recordId: string, team: TeamMember[]) => void;
  handleSetPendampinganPic: (recordId: string, picId: string | null) => void;
  handleSavePerkara: (record: PerkaraRecord) => void;
  handleDeletePerkara: (id: string) => void;
  handleUpdatePerkaraStatus: (id: string, newStatus: StatusPerkara) => void;
  handleForwardPerkara: (id: string) => void;
  handleUpdatePerkaraTeam: (recordId: string, team: TeamMember[]) => void;
  handleSetPerkaraPic: (recordId: string, picId: string | null) => void;
  handleSavePutusan: (record: PerkaraRecord) => void;
  handleDeletePutusan: (id: string) => void;
  handleSetPutusanSelesai: (id: string) => void;
  handleRestorePutusan: (id: string) => void;
  handleSaveTelaahan: (record: TelaahanRecord) => void;
  handleDeleteTelaahan: (id: string) => void;
  handleSetTelaahanStatus: (id: string, status: StatusTelaahan) => void;
  handleUpdateTelaahanTeam: (recordId: string, team: TeamMember[]) => void;
  handleSetTelaahanPic: (recordId: string, picId: string | null) => void;
  handleAddTelaahanDokumen: (recordId: string, dokumen: DokumenTelaahanItem) => void;
  handleDeleteTelaahanDokumen: (recordId: string, dokumenId: string) => void;
  handleSelesaikanNaskahTelaahanNadine: (recordId: string, naskahData: { nomorNaskah: string, perihal: string, penandaTangan: string, tglTte: string, resumeRingkas?: string, analisisHukum?: string, rekomendasi?: string }) => void;
  handleAssignToExisting: (permohonanId: string, targetId: string, targetType: 'pendampingan' | 'perkara' | 'putusan' | 'telaahan') => void;
  handleSetPermohonanPic: (recordId: string, picId: string | null) => void;
  handleUpdatePermohonanTeam: (recordId: string, team: TeamMember[]) => void;
  handleBulkReplaceTeamMember: (oldUserId: string, newUserId: string, newUserName: string, recordIds: { pendampingan: string[], perkara: string[], putusan: string[], telaahan?: string[] }) => void;
  userAccounts: UserAccount[];
  handleSaveUserAccount: (user: UserAccount) => void;
  handleUpdateUserStatus: (id: string, status: 'Aktif' | 'Tidak Aktif') => void;
  handleUpdateUserRoles: (id: string, roles: string[]) => void;
  globalRole: 'Super Admin' | 'Manajer' | 'Operator' | 'Pegawai';
  teamRole: 'PIC' | 'Editor' | 'Viewer';
  userName: string;
  setGlobalRole: (role: 'Super Admin' | 'Manajer' | 'Operator' | 'Pegawai') => void;
  setTeamRole: (role: 'PIC' | 'Editor' | 'Viewer') => void;
  setUserName: (name: string) => void;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  toggleMobileSidebar: () => void;
}

export const useAdvokasiStore = create<AdvokasiState>((set, get) => ({
  permohonanList: initialPermohonan,
  selectedPermohonan: null,
  notification: null,
  currentPermohonanToProses: null,
  berandaContent: initialBerandaContent,
  faqData: initialFaqData,
  pendampinganRecords: initialPendampinganRecords,
  selectedPendampingan: null,
  perkaraRecords: initialPerkaraRecords,
  selectedPerkara: null,
  putusanRecords: [],
  selectedPutusan: null,
  telaahanRecords: initialTelaahanRecords,
  selectedTelaahan: null,
  activeTelaahanForNadine: null,
  globalRole: 'Super Admin',
  teamRole: 'PIC',
  userName: 'Sukiyem',
  userAccounts: initialUserAccounts,
  isMobileSidebarOpen: false,

  setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

  setPermohonanList: (list) => set((state) => ({ 
    permohonanList: typeof list === 'function' ? list(state.permohonanList) : list 
  })),
  setSelectedPermohonan: (p) => set({ selectedPermohonan: p }),
  showNotification: (message, type = 'success') => set({ notification: { message, type } }),
  setNotification: (notif) => set({ notification: notif }),
  setCurrentPermohonanToProses: (p) => set((state) => ({
    currentPermohonanToProses: typeof p === 'function' ? p(state.currentPermohonanToProses) : p
  })),
  setBerandaContent: (c) => set({ berandaContent: c }),
  setFaqData: (data) => set({ faqData: data }),
  setPendampinganRecords: (records) => set((state) => ({
    pendampinganRecords: typeof records === 'function' ? records(state.pendampinganRecords) : records
  })),
  setSelectedPendampingan: (r) => set((state) => ({
    selectedPendampingan: typeof r === 'function' ? r(state.selectedPendampingan) : r
  })),
  setPerkaraRecords: (records) => set((state) => ({
    perkaraRecords: typeof records === 'function' ? records(state.perkaraRecords) : records
  })),
  setSelectedPerkara: (r) => set((state) => ({
    selectedPerkara: typeof r === 'function' ? r(state.selectedPerkara) : r
  })),
  setPutusanRecords: (records) => set((state) => ({
    putusanRecords: typeof records === 'function' ? records(state.putusanRecords) : records
  })),
  setSelectedPutusan: (r) => set((state) => ({
    selectedPutusan: typeof r === 'function' ? r(state.selectedPutusan) : r
  })),
  setTelaahanRecords: (records) => set((state) => ({
    telaahanRecords: typeof records === 'function' ? records(state.telaahanRecords) : records
  })),
  setSelectedTelaahan: (r) => set((state) => ({
    selectedTelaahan: typeof r === 'function' ? r(state.selectedTelaahan) : r
  })),
  setActiveTelaahanForNadine: (r) => set({ activeTelaahanForNadine: r }),

  setGlobalRole: (role) => set({ globalRole: role }),
  setTeamRole: (role) => set({ teamRole: role }),
  setUserName: (name) => set({ userName: name }),

  handleSaveUserAccount: (user) => {
    set((state) => {
      const exists = state.userAccounts.some(u => u.id === user.id);
      let updatedUsers;
      if (exists) {
        updatedUsers = state.userAccounts.map(u => u.id === user.id ? user : u);
      } else {
        updatedUsers = [user, ...state.userAccounts];
      }
      return { 
        userAccounts: updatedUsers,
        notification: { message: exists ? 'Pengguna berhasil diperbarui.' : 'Pengguna berhasil ditambahkan.', type: 'success' }
      };
    });
  },

  handleUpdateUserStatus: (id, status) => {
    set((state) => ({
      userAccounts: state.userAccounts.map(u => u.id === id ? { ...u, status } : u),
      notification: { message: `Status pengguna berhasil diubah menjadi ${status}.`, type: 'success' }
    }));
  },

  handleUpdateUserRoles: (id, roles) => {
    set((state) => ({
      userAccounts: state.userAccounts.map(u => u.id === id ? { ...u, roles } : u),
      notification: { message: 'Role pengguna berhasil diperbarui.', type: 'success' }
    }));
  },

  // Concrete handlers
  handleSelectPermohonan: (permohonan) => {
    set({ selectedPermohonan: permohonan });
  },

  handleSaveDraft: (draft) => {
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
    set((state) => ({
      permohonanList: [newDraft, ...state.permohonanList],
      notification: { message: 'Draft permohonan berhasil disimpan.', type: 'success' }
    }));
  },

  handleUpdateDraft: (updatedDraft) => {
    set((state) => ({
      permohonanList: state.permohonanList.map(p => p.id === updatedDraft.id ? updatedDraft : p),
      notification: { message: 'Draft permohonan berhasil diperbarui.', type: 'success' },
      selectedPermohonan: updatedDraft
    }));
  },

  handleDelete: (id) => {
    set((state) => {
      const filtered = state.permohonanList.filter(p => p.id !== id);
      const isSelected = state.selectedPermohonan?.id === id;
      return {
        permohonanList: filtered,
        notification: { message: 'Draft berhasil dihapus.', type: 'info' },
        selectedPermohonan: isSelected ? null : state.selectedPermohonan
      };
    });
  },

  handleSend: (id) => {
    set((state) => ({
      permohonanList: state.permohonanList.map(p => 
        p.id === id 
          ? { ...p, status: StatusPermohonan.TERKIRIM, Nomor: p.Nomor || generateTiketNomor() } 
          : p
      ),
      notification: { message: 'Permohonan berhasil dikirim.', type: 'success' },
      selectedPermohonan: null
    }));
  },

  handleAddReply: (permohonanId, reply) => {
    const updateList = (list: Permohonan[]) => list.map(p => 
      p.id === permohonanId 
        ? { ...p, history: [...p.history, reply] } 
        : p
    );

    set((state) => {
      const nextPermohonanList = updateList(state.permohonanList);
      const nextPendampinganRecords = updateList(state.pendampinganRecords) as PendampinganRecord[];
      const nextSelectedPermohonan = state.selectedPermohonan?.id === permohonanId 
        ? (state.selectedPermohonan ? { ...state.selectedPermohonan, history: [...state.selectedPermohonan.history, reply] } : null)
        : state.selectedPermohonan;
      const nextCurrentPermohonanToProses = state.currentPermohonanToProses?.id === permohonanId
        ? (state.currentPermohonanToProses ? { ...state.currentPermohonanToProses, history: [...state.currentPermohonanToProses.history, reply] } : null)
        : state.currentPermohonanToProses;

      return {
        permohonanList: nextPermohonanList,
        pendampinganRecords: nextPendampinganRecords,
        selectedPermohonan: nextSelectedPermohonan,
        currentPermohonanToProses: nextCurrentPermohonanToProses
      };
    });
  },

  handleUpdateReply: (permohonanId, historyId, newMessage) => {
    const updateHistory = (history: Riwayat[]) => history.map(h => h.id === historyId ? { ...h, message: newMessage } : h);
    const updateList = (list: Permohonan[]) => list.map(p => 
      p.id === permohonanId 
        ? { ...p, history: updateHistory(p.history) } 
        : p
    );

    set((state) => {
      const nextPermohonanList = updateList(state.permohonanList);
      const nextPendampinganRecords = updateList(state.pendampinganRecords) as PendampinganRecord[];
      const nextSelectedPermohonan = state.selectedPermohonan?.id === permohonanId
        ? (state.selectedPermohonan ? { ...state.selectedPermohonan, history: updateHistory(state.selectedPermohonan.history) } : null)
        : state.selectedPermohonan;
      const nextCurrentPermohonanToProses = state.currentPermohonanToProses?.id === permohonanId
        ? (state.currentPermohonanToProses ? { ...state.currentPermohonanToProses, history: updateHistory(state.currentPermohonanToProses.history) } : null)
        : state.currentPermohonanToProses;

      return {
        permohonanList: nextPermohonanList,
        pendampinganRecords: nextPendampinganRecords,
        selectedPermohonan: nextSelectedPermohonan,
        currentPermohonanToProses: nextCurrentPermohonanToProses
      };
    });
  },

  handleDeleteReply: (permohonanId, historyId) => {
    const updateHistory = (history: Riwayat[]) => history.filter(h => h.id !== historyId);
    const updateList = (list: Permohonan[]) => list.map(p => 
      p.id === permohonanId 
        ? { ...p, history: updateHistory(p.history) } 
        : p
    );

    set((state) => {
      const nextPermohonanList = updateList(state.permohonanList);
      const nextPendampinganRecords = updateList(state.pendampinganRecords) as PendampinganRecord[];
      const nextSelectedPermohonan = state.selectedPermohonan?.id === permohonanId
        ? (state.selectedPermohonan ? { ...state.selectedPermohonan, history: updateHistory(state.selectedPermohonan.history) } : null)
        : state.selectedPermohonan;
      const nextCurrentPermohonanToProses = state.currentPermohonanToProses?.id === permohonanId
        ? (state.currentPermohonanToProses ? { ...state.currentPermohonanToProses, history: updateHistory(state.currentPermohonanToProses.history) } : null)
        : state.currentPermohonanToProses;

      return {
        permohonanList: nextPermohonanList,
        pendampinganRecords: nextPendampinganRecords,
        selectedPermohonan: nextSelectedPermohonan,
        currentPermohonanToProses: nextCurrentPermohonanToProses
      };
    });
  },

  handleProses: (permohonan) => {
    set({ currentPermohonanToProses: permohonan });
  },

  handleAcceptPermohonan: (id) => {
    set((state) => {
      const permohonan = state.permohonanList.find(p => p.id === id);
      const nextRecords = state.permohonanList.map(p => p.id === id ? { ...p, status: StatusPermohonan.DIPROSES } : p);
      const updatedSelected = nextRecords.find(p => p.id === id) || null;

      let nextTelaahanRecords = [...state.telaahanRecords];
      if (permohonan && permohonan.jenis === JenisPermohonan.TELAAHAN_KASUS_HUKUM) {
        const existingIdx = nextTelaahanRecords.findIndex(t => t.id === permohonan.id || (permohonan.Nomor && t.Nomor === permohonan.Nomor));
        if (existingIdx > -1) {
          nextTelaahanRecords = nextTelaahanRecords.map((t, idx) => 
            idx === existingIdx ? { ...t, statusTelaahan: StatusTelaahan.AKTIF, status: StatusPermohonan.DIPROSES, team: permohonan.team || t.team, picId: permohonan.picId || t.picId } : t
          );
        } else {
          const docs: DokumenTelaahanItem[] = [];
          if (permohonan.files && permohonan.files.length > 0) {
            permohonan.files.forEach((f: any, idx: number) => {
              docs.push({
                id: f.id || `dt-${permohonan.id}-${idx}`,
                name: f.name,
                size: f.size || 150000,
                type: f.type || 'application/pdf',
                kategori: 'Permohonan',
                tanggal: permohonan.tanggal,
                deskripsi: permohonan.perihal
              });
            });
          } else {
            docs.push({
              id: `dt-${permohonan.id}-main`,
              name: `Surat_Permohonan_${permohonan.Nomor ? permohonan.Nomor.replace(/[\/\\]/g, '_') : permohonan.id}.pdf`,
              size: 210000,
              type: 'application/pdf',
              kategori: 'Permohonan',
              tanggal: permohonan.tanggal,
              deskripsi: permohonan.perihal
            });
          }

          const newTelaahan: TelaahanRecord = {
            ...permohonan,
            id: permohonan.id,
            nomorTelaahan: `TLH-${Math.floor(10 + Math.random() * 90)}/SJ.4/${new Date().getFullYear()}`,
            status: StatusPermohonan.DIPROSES,
            statusTelaahan: StatusTelaahan.AKTIF,
            dokumenTelaahan: docs,
            naskahTelaahan: {
              statusNaskah: StatusNaskahTelaahan.BELUM_DIBUAT,
              perihal: `Telaahan Hukum atas ${permohonan.perihal}`
            },
            abstraksiTelaahan: {
              pokokPermasalahan: permohonan.uraian || permohonan.perihal,
              faktaHukum: `Surat permohonan telaahan diterima dari ${permohonan.pemohon || permohonan.unit} tanggal ${permohonan.tanggal}.`,
              dasarHukum: ['PMK No. 118/PMK.01/2021 tentang Organisasi dan Tata Kerja Kementerian Keuangan'],
              analisisKajian: 'Sedang dalam proses telaahan hukum oleh tim Biro Advokasi.',
              rekomendasi: 'Penyusunan naskah telaahan hukum komprehensif.',
              tingkatUrgensi: 'Biasa',
              kategoriHukum: 'Umum'
            },
            team: permohonan.team || [],
            picId: permohonan.picId || null
          };
          nextTelaahanRecords = [newTelaahan, ...nextTelaahanRecords];
        }
      }

      return {
        permohonanList: nextRecords,
        telaahanRecords: nextTelaahanRecords,
        selectedPermohonan: state.selectedPermohonan?.id === id ? updatedSelected : state.selectedPermohonan,
        currentPermohonanToProses: state.currentPermohonanToProses?.id === id ? updatedSelected : state.currentPermohonanToProses,
        notification: { 
          message: permohonan?.jenis === JenisPermohonan.TELAAHAN_KASUS_HUKUM 
            ? 'Permohonan telah diterima dan masuk ke modul Telaahan Kasus Hukum (tab Aktif).' 
            : 'Permohonan telah diterima dan dipindahkan ke Pengelolaan Permohonan.', 
          type: 'success' 
        }
      };
    });
  },

  handleUpdateStatus: (id, newStatus) => {
    set((state) => {
      const nextRecords = state.permohonanList.map(p => p.id === id ? { ...p, status: newStatus as StatusPermohonan } : p);
      const updatedSelected = nextRecords.find(p => p.id === id) || null;
      return {
        permohonanList: nextRecords,
        pendampinganRecords: state.pendampinganRecords.map(p => p.id === id ? { ...p, statusPendampingan: newStatus as StatusPendampingan } : p),
        selectedPermohonan: state.selectedPermohonan?.id === id ? updatedSelected : state.selectedPermohonan,
        currentPermohonanToProses: state.currentPermohonanToProses?.id === id ? updatedSelected : state.currentPermohonanToProses,
        notification: { message: 'Status berhasil diperbarui.', type: 'info' }
      };
    });
  },

  handleTarikDataNadine: (suratList, jenis) => {
    const newPermohonans: Permohonan[] = suratList.map(surat => ({
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
    }));
    set((state) => ({
      permohonanList: [...newPermohonans, ...state.permohonanList],
      notification: { message: `${suratList.length} data dari Nadine berhasil ditarik.`, type: 'success' }
    }));
  },

  handleSaveBerandaContent: (newContent) => {
    set({
      berandaContent: newContent,
      notification: { message: 'Informasi beranda berhasil diperbarui.', type: 'success' }
    });
  },

  handleSaveFaq: (newFaqData) => {
    set({
      faqData: newFaqData,
      notification: { message: 'FAQ berhasil diperbarui.', type: 'success' }
    });
  },

  handleSavePendampingan: (record) => {
    set((state) => {
      const index = record.id ? state.pendampinganRecords.findIndex(r => r.id === record.id) : -1;
      let nextRecords = [...state.pendampinganRecords];
      let notificationMsg = '';

      if (index > -1) {
          nextRecords = state.pendampinganRecords.map(r => r.id === record.id ? record : r);
          notificationMsg = 'Data pendampingan berhasil diperbarui.';
      } else {
          const isRecording = record.id && state.permohonanList.some(p => p.id === record.id);
          const permohonan = isRecording ? state.permohonanList.find(p => p.id === record.id) : null;
          
          let recordFiles = [...(record.files || [])];
          if (permohonan) {
            const permDocs: any[] = [];
            if (permohonan.files && permohonan.files.length > 0) {
              permohonan.files.forEach((f: any, idx: number) => {
                permDocs.push({
                  id: f.id || `perm-${permohonan.id}-f-${idx}`,
                  name: f.name,
                  size: f.size || 102400,
                  type: f.type || 'application/pdf',
                  nomor: f.nomor || permohonan.Nomor || permohonan.id,
                  tanggal: f.tanggal || permohonan.tanggal,
                  jenis: f.jenis || 'Surat Permohonan',
                  deskripsi: f.deskripsi || (f as any).description || permohonan.perihal,
                  source: f.source || permohonan.sumber || 'Permohonan'
                });
              });
            } else {
              permDocs.push({
                id: `perm-${permohonan.id}-main`,
                name: `Surat Permohonan - ${permohonan.Nomor || permohonan.id}.pdf`,
                size: 145000,
                type: 'application/pdf',
                nomor: permohonan.Nomor || permohonan.id,
                tanggal: permohonan.tanggal,
                jenis: 'Surat Permohonan',
                deskripsi: permohonan.perihal,
                source: permohonan.sumber || 'Permohonan'
              });
            }
            if (permohonan.history) {
              permohonan.history.forEach((h: any) => {
                (h.files || []).forEach((hf: any, fIdx: number) => {
                  permDocs.push({
                    id: hf.id || `perm-hist-${h.id}-${fIdx}`,
                    name: hf.name,
                    size: hf.size || 85000,
                    type: hf.type || 'application/pdf',
                    nomor: permohonan.Nomor || permohonan.id,
                    tanggal: h.timestamp ? new Date(h.timestamp).toLocaleDateString('id-ID') : permohonan.tanggal,
                    jenis: 'Lampiran Balasan Permohonan',
                    deskripsi: h.message || `Lampiran diskusi oleh ${h.author}`,
                    source: 'Permohonan (Riwayat)'
                  });
                });
              });
            }
            const existingNames = new Set(recordFiles.map(f => f.name));
            permDocs.forEach(d => {
              if (!existingNames.has(d.name)) {
                recordFiles.push(d);
              }
            });
          }

          const newRecord = { 
            ...record, 
            id: record.id || `pd-${generateRandomId()}`, 
            files: recordFiles,
            deletedAt: undefined 
          };
          nextRecords = [newRecord, ...state.pendampinganRecords];
          
          if (isRecording) {
              notificationMsg = 'Permohonan berhasil direkam sebagai Pendampingan Aktif. Dokumen permohonan telah terhubung.';
          } else {
              notificationMsg = 'Pendampingan baru berhasil ditambahkan.';
          }
      }

      return {
        pendampinganRecords: nextRecords,
        notification: { message: notificationMsg, type: 'success' }
      };
    });
  },

  handleDeletePendampingan: (id) => {
    const today = new Date().toLocaleString('en-GB');
    set((state) => ({
      pendampinganRecords: state.pendampinganRecords.map(r => r.id === id ? { ...r, deletedAt: today } : r),
      notification: { message: 'Data pendampingan dipindahkan ke Recycle Bin.', type: 'info' }
    }));
  },

  handleAddPosisiUpdate: (recordId, posisi) => {
    set((state) => {
      const nextRecords = state.pendampinganRecords.map(r => {
        if (r.id === recordId) {
            const newPosisi: PosisiUpdate = { ...posisi, id: (r.posisi?.length || 0) + 1, timestamp: new Date() };
            const updatedRecord = { ...r, posisi: [...(r.posisi || []), newPosisi] };
            return updatedRecord;
        }
        return r;
      });

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        pendampinganRecords: nextRecords,
        selectedPendampingan: state.selectedPendampingan?.id === recordId ? updatedSelected : state.selectedPendampingan,
        notification: { message: 'Posisi pendampingan berhasil ditambahkan.', type: 'success' }
      };
    });
  },

  handleUpdatePosisiUpdate: (recordId, posisiId, updatedPosisiData) => {
    set((state) => {
      const nextRecords = state.pendampinganRecords.map(r => {
        if (r.id === recordId) {
            const updatedPosisiArray = r.posisi?.map(p => p.id === posisiId ? { ...p, ...updatedPosisiData } : p) || [];
            const updatedRecord = { ...r, posisi: updatedPosisiArray };
            return updatedRecord;
        }
        return r;
      });

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        pendampinganRecords: nextRecords,
        selectedPendampingan: state.selectedPendampingan?.id === recordId ? updatedSelected : state.selectedPendampingan,
        notification: { message: 'Posisi pendampingan berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleDeletePosisiUpdate: (recordId, posisiId) => {
    set((state) => {
      const nextRecords = state.pendampinganRecords.map(r => {
        if (r.id === recordId) {
            const updatedPosisiArray = r.posisi?.filter(p => p.id !== posisiId) || [];
             const updatedRecord = { ...r, posisi: updatedPosisiArray };
            return updatedRecord;
        }
        return r;
      });

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        pendampinganRecords: nextRecords,
        selectedPendampingan: state.selectedPendampingan?.id === recordId ? updatedSelected : state.selectedPendampingan,
        notification: { message: 'Posisi pendampingan berhasil dihapus.', type: 'info' }
      };
    });
  },

  handleUpdatePendampinganTeam: (recordId, team) => {
    set((state) => {
      const nextRecords = state.pendampinganRecords.map(r => {
        if (r.id === recordId) {
            const newEntry = { id: Date.now(), timestamp: new Date(), user: 'Admin User', action: 'memperbarui', details: 'susunan anggota tim' };
            const updatedRecord = { ...r, team, auditTrail: [...(r.auditTrail || []), newEntry] };
            return updatedRecord;
        }
        return r;
      });

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        pendampinganRecords: nextRecords,
        selectedPendampingan: state.selectedPendampingan?.id === recordId ? updatedSelected : state.selectedPendampingan,
        notification: { message: 'Tim advokasi berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleSetPendampinganPic: (recordId, picId) => {
    set((state) => {
      const nextRecords = state.pendampinganRecords.map(r => {
        if (r.id === recordId) {
            const picName = r.team?.find(m => m.id === picId)?.nama || 'None';
            const newEntry = { id: Date.now(), timestamp: new Date(), user: 'Admin User', action: 'menetapkan', details: `PIC baru: ${picName}` };
            const updatedRecord = { ...r, picId: picId || undefined, auditTrail: [...(r.auditTrail || []), newEntry] };
            return updatedRecord;
        }
        return r;
      });

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        pendampinganRecords: nextRecords,
        selectedPendampingan: state.selectedPendampingan?.id === recordId ? updatedSelected : state.selectedPendampingan,
        notification: { message: 'PIC berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleSavePerkara: (record) => {
    set((state) => {
      const index = record.id && !record.id.startsWith('new-') ? state.perkaraRecords.findIndex(r => r.id === record.id) : -1;
      let nextRecords = [...state.perkaraRecords];
      let nextPermohonanList = [...state.permohonanList];
      let notificationMsg = '';

      if (index > -1) {
          nextRecords = state.perkaraRecords.map(r => r.id === record.id ? record : r);
          notificationMsg = 'Data perkara berhasil diperbarui.';
      } else {
          const isRecording = record.id && state.permohonanList.some(p => p.id === record.id);
          const permohonan = isRecording ? state.permohonanList.find(p => p.id === record.id) : null;

          let recordFiles = [...(record.files || [])];
          if (permohonan) {
            const permDocs: any[] = [];
            if (permohonan.files && permohonan.files.length > 0) {
              permohonan.files.forEach((f: any, idx: number) => {
                permDocs.push({
                  id: f.id || `perm-${permohonan.id}-f-${idx}`,
                  name: f.name,
                  size: f.size || 102400,
                  type: f.type || 'application/pdf',
                  nomor: f.nomor || permohonan.Nomor || permohonan.id,
                  tanggal: f.tanggal || permohonan.tanggal,
                  jenis: f.jenis || 'Surat Permohonan',
                  deskripsi: f.deskripsi || (f as any).description || permohonan.perihal,
                  source: f.source || permohonan.sumber || 'Permohonan'
                });
              });
            } else {
              permDocs.push({
                id: `perm-${permohonan.id}-main`,
                name: `Surat Permohonan - ${permohonan.Nomor || permohonan.id}.pdf`,
                size: 145000,
                type: 'application/pdf',
                nomor: permohonan.Nomor || permohonan.id,
                tanggal: permohonan.tanggal,
                jenis: 'Surat Permohonan',
                deskripsi: permohonan.perihal,
                source: permohonan.sumber || 'Permohonan'
              });
            }
            if (permohonan.history) {
              permohonan.history.forEach((h: any) => {
                (h.files || []).forEach((hf: any, fIdx: number) => {
                  permDocs.push({
                    id: hf.id || `perm-hist-${h.id}-${fIdx}`,
                    name: hf.name,
                    size: hf.size || 85000,
                    type: hf.type || 'application/pdf',
                    nomor: permohonan.Nomor || permohonan.id,
                    tanggal: h.timestamp ? new Date(h.timestamp).toLocaleDateString('id-ID') : permohonan.tanggal,
                    jenis: 'Lampiran Balasan Permohonan',
                    deskripsi: h.message || `Lampiran diskusi oleh ${h.author}`,
                    source: 'Permohonan (Riwayat)'
                  });
                });
              });
            }
            const existingNames = new Set(recordFiles.map(f => f.name));
            permDocs.forEach(d => {
              if (!existingNames.has(d.name)) {
                recordFiles.push(d);
              }
            });
          }

          const newRecord = { 
            ...record, 
            id: isRecording ? record.id : `pk-${generateRandomId()}`, 
            files: recordFiles,
            deletedAt: undefined 
          };
          
          const auditEntry = {
              id: Date.now(),
              timestamp: new Date(),
              user: 'Administrator',
              action: isRecording ? 'merekam' : 'membuat',
              details: isRecording ? `Perkara direkam dari permohonan #${record.Nomor || record.id}. Dokumen permohonan terhubung.` : 'Perkara baru dibuat manual'
          };
          const recordWithAudit = { ...newRecord, auditTrail: [auditEntry] };
          
          nextRecords = [recordWithAudit, ...state.perkaraRecords];
          
          if (isRecording) {
              nextPermohonanList = state.permohonanList.map(p => p.id === record.id ? { 
                  ...p, 
                  status: StatusPermohonan.DIPROSES,
                  assignedTo: record.id,
                  history: [...(p.history || []), {
                      id: Date.now(),
                      author: 'Administrator',
                      message: `Permohonan telah direkam sebagai Perkara Litigasi dengan No. Perkara: ${record.abstraksiPerkara?.noPerkara || record.Nomor || record.id}. Seluruh berkas/dokumen telah terhubung ke Dokumen Permohonan.`,
                      files: [],
                      timestamp: new Date()
                  }]
              } : p);
              notificationMsg = 'Permohonan berhasil direkam sebagai Perkara Aktif. Dokumen permohonan telah terhubung.';
          } else {
              notificationMsg = 'Perkara baru berhasil ditambahkan.';
          }
      }

      return {
        perkaraRecords: nextRecords,
        permohonanList: nextPermohonanList,
        notification: { message: notificationMsg, type: 'success' }
      };
    });
  },

  handleDeletePerkara: (id) => {
    const today = new Date().toLocaleString('en-GB');
    set((state) => ({
      perkaraRecords: state.perkaraRecords.map(r => r.id === id ? { ...r, deletedAt: today } : r),
      notification: { message: 'Data perkara dipindahkan ke Recycle Bin.', type: 'info' }
    }));
  },

  handleUpdatePerkaraStatus: (id, newStatus) => {
    set((state) => ({
      perkaraRecords: state.perkaraRecords.map(r => r.id === id ? { ...r, statusPerkara: newStatus } : r),
      notification: { message: `Status perkara berhasil diubah menjadi "${newStatus}".`, type: 'success' }
    }));
  },

  handleForwardPerkara: (id) => {
    set((state) => {
      const recordToForward = state.perkaraRecords.find(r => r.id === id);
      if (recordToForward) {
          const isAlreadyForwarded = state.putusanRecords.some(pr => pr.id === id);
          if (isAlreadyForwarded) {
              return {
                notification: { message: `Perkara ${id} sudah ada di Penanganan Putusan.`, type: 'info' }
              };
          }
          const newPutusanRecord = { ...recordToForward, statusPutusan: StatusPutusan.AKTIF };
          return {
            putusanRecords: [newPutusanRecord, ...state.putusanRecords],
            notification: { message: `Perkara ${id} berhasil diteruskan ke Penanganan Putusan.`, type: 'success' }
          };
      } else {
          return {
            notification: { message: `Perkara dengan ID ${id} tidak ditemukan.`, type: 'error' }
          };
      }
    });
  },

  handleUpdatePerkaraTeam: (recordId, team) => {
    set((state) => {
      const nextRecords = state.perkaraRecords.map(r => {
          if (r.id === recordId) {
              const newEntry = { id: Date.now(), timestamp: new Date(), user: 'Admin User', action: 'memperbarui', details: 'susunan anggota tim' };
              const updatedRecord = { ...r, team, auditTrail: [...(r.auditTrail || []), newEntry] };
              return updatedRecord;
          }
          return r;
      });

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        perkaraRecords: nextRecords,
        selectedPerkara: state.selectedPerkara && 'id' in state.selectedPerkara && state.selectedPerkara.id === recordId ? updatedSelected : state.selectedPerkara,
        notification: { message: 'Tim advokasi perkara berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleSetPerkaraPic: (recordId, picId) => {
    set((state) => {
      const nextRecords = state.perkaraRecords.map(r => {
          if (r.id === recordId) {
              const picName = r.team?.find(m => m.id === picId)?.nama || 'None';
              const newEntry = { id: Date.now(), timestamp: new Date(), user: 'Admin User', action: 'menetapkan', details: `PIC baru: ${picName}` };
              const updatedRecord = { ...r, picId: picId || undefined, auditTrail: [...(r.auditTrail || []), newEntry] };
              return updatedRecord;
          }
          return r;
      });

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        perkaraRecords: nextRecords,
        selectedPerkara: state.selectedPerkara && 'id' in state.selectedPerkara && state.selectedPerkara.id === recordId ? updatedSelected : state.selectedPerkara,
        notification: { message: 'PIC perkara berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleSavePutusan: (record) => {
    set((state) => {
      const index = record.id && !record.id.startsWith('new-') ? state.putusanRecords.findIndex(r => r.id === record.id) : -1;
      let nextRecords = [...state.putusanRecords];
      let nextPermohonanList = [...state.permohonanList];
      let notificationMsg = '';

      if (index > -1) {
        nextRecords = state.putusanRecords.map(r => r.id === record.id ? record : r);
        notificationMsg = 'Data putusan berhasil diperbarui.';
      } else {
        const isRecording = record.id && state.permohonanList.some(p => p.id === record.id);
        const permohonan = isRecording ? state.permohonanList.find(p => p.id === record.id) : null;

        let recordFiles = [...(record.files || [])];
        if (permohonan) {
          const permDocs: any[] = [];
          if (permohonan.files && permohonan.files.length > 0) {
            permohonan.files.forEach((f: any, idx: number) => {
              permDocs.push({
                id: f.id || `perm-${permohonan.id}-f-${idx}`,
                name: f.name,
                size: f.size || 102400,
                type: f.type || 'application/pdf',
                nomor: f.nomor || permohonan.Nomor || permohonan.id,
                tanggal: f.tanggal || permohonan.tanggal,
                jenis: f.jenis || 'Surat Permohonan',
                deskripsi: f.deskripsi || (f as any).description || permohonan.perihal,
                source: f.source || permohonan.sumber || 'Permohonan'
              });
            });
          } else {
            permDocs.push({
              id: `perm-${permohonan.id}-main`,
              name: `Surat Permohonan - ${permohonan.Nomor || permohonan.id}.pdf`,
              size: 145000,
              type: 'application/pdf',
              nomor: permohonan.Nomor || permohonan.id,
              tanggal: permohonan.tanggal,
              jenis: 'Surat Permohonan',
              deskripsi: permohonan.perihal,
              source: permohonan.sumber || 'Permohonan'
            });
          }
          if (permohonan.history) {
            permohonan.history.forEach((h: any) => {
              (h.files || []).forEach((hf: any, fIdx: number) => {
                permDocs.push({
                  id: hf.id || `perm-hist-${h.id}-${fIdx}`,
                  name: hf.name,
                  size: hf.size || 85000,
                  type: hf.type || 'application/pdf',
                  nomor: permohonan.Nomor || permohonan.id,
                  tanggal: h.timestamp ? new Date(h.timestamp).toLocaleDateString('id-ID') : permohonan.tanggal,
                  jenis: 'Lampiran Balasan Permohonan',
                  deskripsi: h.message || `Lampiran diskusi oleh ${h.author}`,
                  source: 'Permohonan (Riwayat)'
                });
              });
            });
          }
          const existingNames = new Set(recordFiles.map(f => f.name));
          permDocs.forEach(d => {
            if (!existingNames.has(d.name)) {
              recordFiles.push(d);
            }
          });
        }

        const newRecord = {
          ...record,
          id: isRecording ? record.id : `pt-${generateRandomId()}`,
          files: recordFiles,
          deletedAt: undefined
        };
        nextRecords = [newRecord, ...state.putusanRecords];

        if (isRecording) {
          nextPermohonanList = state.permohonanList.map(p => p.id === record.id ? {
            ...p,
            status: StatusPermohonan.DIPROSES,
            assignedTo: record.id,
            history: [...(p.history || []), {
              id: Date.now(),
              author: 'Administrator',
              message: `Permohonan telah direkam sebagai Penanganan Putusan. Seluruh berkas/lampiran telah terhubung ke Dokumen Permohonan.`,
              files: [],
              timestamp: new Date()
            }]
          } : p);
          notificationMsg = 'Permohonan berhasil direkam sebagai Penanganan Putusan. Dokumen permohonan telah terhubung.';
        } else {
          notificationMsg = 'Data putusan baru berhasil ditambahkan.';
        }
      }

      return {
        putusanRecords: nextRecords,
        permohonanList: nextPermohonanList,
        notification: { message: notificationMsg, type: 'success' }
      };
    });
  },

  handleDeletePutusan: (id) => {
    const today = new Date().toLocaleString('en-GB');
    set((state) => ({
      putusanRecords: state.putusanRecords.map(r => r.id === id ? { ...r, deletedAt: today } : r),
      notification: { message: 'Data putusan dipindahkan ke Recycle Bin.', type: 'info' }
    }));
  },

  handleSetPutusanSelesai: (id) => {
    set((state) => ({
      putusanRecords: state.putusanRecords.map(r => r.id === id ? { ...r, statusPutusan: StatusPutusan.SELESAI } : r),
      notification: { message: 'Status putusan berhasil diubah menjadi "Selesai".', type: 'success' }
    }));
  },

  handleRestorePutusan: (id) => {
    set((state) => ({
      putusanRecords: state.putusanRecords.map(r => r.id === id ? { ...r, statusPutusan: StatusPutusan.AKTIF } : r),
      notification: { message: 'Status putusan berhasil diubah menjadi "Aktif".', type: 'success' }
    }));
  },

  handleSaveTelaahan: (record) => {
    set((state) => {
      const index = record.id ? state.telaahanRecords.findIndex(r => r.id === record.id) : -1;
      let nextRecords = [...state.telaahanRecords];
      let notificationMsg = '';
      if (index > -1) {
        nextRecords = state.telaahanRecords.map(r => r.id === record.id ? record : r);
        notificationMsg = 'Data telaahan kasus hukum berhasil diperbarui.';
      } else {
        const newRecord: TelaahanRecord = {
          ...record,
          id: record.id || `TLH-${Date.now()}`,
          nomorTelaahan: record.nomorTelaahan || `TLH-${Math.floor(10 + Math.random() * 90)}/SJ.4/${new Date().getFullYear()}`,
          statusTelaahan: record.statusTelaahan || StatusTelaahan.AKTIF,
          status: StatusPermohonan.DIPROSES,
          dokumenTelaahan: record.dokumenTelaahan || [],
          naskahTelaahan: record.naskahTelaahan || { statusNaskah: StatusNaskahTelaahan.BELUM_DIBUAT }
        };
        nextRecords = [newRecord, ...state.telaahanRecords];
        notificationMsg = 'Data telaahan kasus hukum baru berhasil ditambahkan.';
      }
      return {
        telaahanRecords: nextRecords,
        selectedTelaahan: state.selectedTelaahan?.id === record.id ? record : state.selectedTelaahan,
        notification: { message: notificationMsg, type: 'success' }
      };
    });
  },

  handleDeleteTelaahan: (id) => {
    set((state) => ({
      telaahanRecords: state.telaahanRecords.filter(r => r.id !== id),
      selectedTelaahan: state.selectedTelaahan?.id === id ? null : state.selectedTelaahan,
      notification: { message: 'Data telaahan kasus hukum berhasil dihapus.', type: 'info' }
    }));
  },

  handleSetTelaahanStatus: (id, status) => {
    set((state) => {
      const nextRecords = state.telaahanRecords.map(r => r.id === id ? { 
        ...r, 
        statusTelaahan: status, 
        status: status === StatusTelaahan.SELESAI ? StatusPermohonan.SELESAI : StatusPermohonan.DIPROSES 
      } : r);
      const nextPermohonan = state.permohonanList.map(p => p.id === id ? {
        ...p,
        status: status === StatusTelaahan.SELESAI ? StatusPermohonan.SELESAI : StatusPermohonan.DIPROSES
      } : p);
      const updatedSelected = nextRecords.find(r => r.id === id) || null;
      return {
        telaahanRecords: nextRecords,
        permohonanList: nextPermohonan,
        selectedTelaahan: state.selectedTelaahan?.id === id ? updatedSelected : state.selectedTelaahan,
        notification: { message: `Status telaahan berhasil diubah menjadi "${status}".`, type: 'success' }
      };
    });
  },

  handleUpdateTelaahanTeam: (recordId, team) => {
    set((state) => {
      const nextRecords = state.telaahanRecords.map(r => r.id === recordId ? { ...r, team } : r);
      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;
      return {
        telaahanRecords: nextRecords,
        selectedTelaahan: state.selectedTelaahan?.id === recordId ? updatedSelected : state.selectedTelaahan,
        notification: { message: 'Tim telaahan kasus hukum berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleSetTelaahanPic: (recordId, picId) => {
    set((state) => {
      const nextRecords = state.telaahanRecords.map(r => r.id === recordId ? { ...r, picId: picId || undefined } : r);
      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;
      return {
        telaahanRecords: nextRecords,
        selectedTelaahan: state.selectedTelaahan?.id === recordId ? updatedSelected : state.selectedTelaahan,
        notification: { message: 'PIC telaahan kasus hukum berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleAddTelaahanDokumen: (recordId, dokumen) => {
    set((state) => {
      const nextRecords = state.telaahanRecords.map(r => {
        if (r.id === recordId) {
          const currentDocs = r.dokumenTelaahan || [];
          return {
            ...r,
            dokumenTelaahan: [dokumen, ...currentDocs]
          };
        }
        return r;
      });
      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;
      return {
        telaahanRecords: nextRecords,
        selectedTelaahan: state.selectedTelaahan?.id === recordId ? updatedSelected : state.selectedTelaahan,
        notification: { message: `Dokumen "${dokumen.name}" berhasil ditambahkan.`, type: 'success' }
      };
    });
  },

  handleDeleteTelaahanDokumen: (recordId, dokumenId) => {
    set((state) => {
      const nextRecords = state.telaahanRecords.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            dokumenTelaahan: (r.dokumenTelaahan || []).filter(d => d.id !== dokumenId)
          };
        }
        return r;
      });
      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;
      return {
        telaahanRecords: nextRecords,
        selectedTelaahan: state.selectedTelaahan?.id === recordId ? updatedSelected : state.selectedTelaahan,
        notification: { message: 'Dokumen telaahan berhasil dihapus.', type: 'info' }
      };
    });
  },

  handleSelesaikanNaskahTelaahanNadine: (recordId, naskahData) => {
    const nowStr = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const cleanNo = naskahData.nomorNaskah.replace(/[\/\\]/g, '_');
    const signedDoc: DokumenTelaahanItem = {
      id: `dt-tte-${Date.now()}`,
      name: `${cleanNo}_Naskah_Telaahan_Hukum_TTE.pdf`,
      size: 1150000,
      type: 'application/pdf',
      kategori: 'Naskah Telaahan',
      tanggal: new Date().toLocaleDateString('id-ID'),
      nomor: naskahData.nomorNaskah,
      deskripsi: `Naskah Telaahan Hukum yang telah di-TTE oleh ${naskahData.penandaTangan} dan dikirim via Nadine.`
    };

    set((state) => {
      const nextTelaahan = state.telaahanRecords.map(r => {
        if (r.id === recordId) {
          const updatedNaskah: NaskahTelaahanInfo = {
            naskahId: `NADINE-TLH-${Math.floor(1000 + Math.random() * 9000)}`,
            nomorNaskah: naskahData.nomorNaskah,
            statusNaskah: StatusNaskahTelaahan.DIKIRIM,
            penandaTangan: naskahData.penandaTangan,
            tglTte: naskahData.tglTte,
            tglKirim: nowStr,
            perihal: naskahData.perihal,
            resumeRingkas: naskahData.resumeRingkas,
            analisisHukum: naskahData.analisisHukum,
            rekomendasi: naskahData.rekomendasi
          };
          return {
            ...r,
            statusTelaahan: StatusTelaahan.SELESAI,
            status: StatusPermohonan.SELESAI,
            naskahTelaahan: updatedNaskah,
            dokumenTelaahan: [signedDoc, ...(r.dokumenTelaahan || [])]
          };
        }
        return r;
      });

      const nextPermohonan = state.permohonanList.map(p => {
        if (p.id === recordId) {
          return {
            ...p,
            status: StatusPermohonan.SELESAI,
            history: [...(p.history || []), {
              id: Date.now(),
              author: 'Administrator' as const,
              message: `Naskah Telaahan Hukum No. ${naskahData.nomorNaskah} telah selesai di-TTE secara elektronik dan dikirim melalui aplikasi Nadine. Telaahan hukum resmi dinyatakan Selesai.`,
              files: [{ name: signedDoc.name, size: signedDoc.size, type: signedDoc.type }],
              timestamp: new Date()
            }]
          };
        }
        return p;
      });

      const updatedSelected = nextTelaahan.find(r => r.id === recordId) || null;

      return {
        telaahanRecords: nextTelaahan,
        permohonanList: nextPermohonan,
        selectedTelaahan: state.selectedTelaahan?.id === recordId ? updatedSelected : state.selectedTelaahan,
        activeTelaahanForNadine: null,
        notification: {
          message: `Naskah telaahan No. ${naskahData.nomorNaskah} telah di-TTE dan dikirim via Nadine. Telaahan aktif berpindah ke tab "Selesai".`,
          type: 'success'
        }
      };
    });
  },

  handleAssignToExisting: (permohonanId, targetId, targetType) => {
    const permohonan = get().permohonanList.find(p => p.id === permohonanId);
    if (!permohonan) return;

    // Collect all documents & attachments from this permohonan
    const permohonanFiles: any[] = [];
    if (permohonan.files && permohonan.files.length > 0) {
      permohonan.files.forEach((f: any, idx: number) => {
        permohonanFiles.push({
          id: f.id || `perm-${permohonan.id}-f-${idx}`,
          name: f.name,
          size: f.size || 102400,
          type: f.type || 'application/pdf',
          nomor: f.nomor || permohonan.Nomor || permohonan.id,
          tanggal: f.tanggal || permohonan.tanggal,
          jenis: f.jenis || 'Surat Permohonan / Lampiran',
          deskripsi: f.deskripsi || (f as any).description || `Lampiran dari Permohonan #${permohonan.Nomor || permohonan.id}: ${permohonan.perihal}`,
          source: f.source || permohonan.sumber || 'Permohonan'
        });
      });
    } else {
      permohonanFiles.push({
        id: `perm-${permohonan.id}-main`,
        name: `Surat Permohonan - ${permohonan.Nomor || permohonan.id}.pdf`,
        size: 145000,
        type: 'application/pdf',
        nomor: permohonan.Nomor || permohonan.id,
        tanggal: permohonan.tanggal,
        jenis: 'Surat Permohonan',
        deskripsi: permohonan.perihal,
        source: permohonan.sumber || 'Permohonan'
      });
    }

    if (permohonan.history && permohonan.history.length > 0) {
      permohonan.history.forEach((h: any) => {
        if (h.files && h.files.length > 0) {
          h.files.forEach((hf: any, fIdx: number) => {
            permohonanFiles.push({
              id: hf.id || `perm-hist-${h.id}-${fIdx}`,
              name: hf.name,
              size: hf.size || 85000,
              type: hf.type || 'application/pdf',
              nomor: hf.nomor || permohonan.Nomor || permohonan.id,
              tanggal: h.timestamp ? new Date(h.timestamp).toLocaleDateString('id-ID') : permohonan.tanggal,
              jenis: 'Lampiran Balasan Permohonan',
              deskripsi: h.message || `Lampiran riwayat oleh ${h.author}`,
              source: 'Permohonan (Riwayat)'
            });
          });
        }
      });
    }

    const updateFiles = (existingFiles: any[] = []) => {
      const existingNames = new Set(existingFiles.map(f => f.name));
      const newFiles = permohonanFiles.filter(f => !existingNames.has(f.name));
      return [...existingFiles, ...newFiles];
    };

    const auditTrailEntry = {
        id: Date.now(),
        timestamp: new Date(),
        user: 'Administrator',
        action: 'menghubungkan',
        details: `Dokumen & lampiran dari Permohonan #${permohonan.Nomor || permohonan.id} (${permohonanFiles.length} berkas) berhasil dihubungkan ke Dokumen Permohonan.`
    };

    set((state) => {
      let nextPendampingan = [...state.pendampinganRecords];
      let nextPerkara = [...state.perkaraRecords];
      let nextPutusan = [...state.putusanRecords];
      let nextTelaahan = [...state.telaahanRecords];

      if (targetType === 'pendampingan') {
          nextPendampingan = state.pendampinganRecords.map(r => {
              if (r.id === targetId) {
                  return {
                      ...r,
                      files: updateFiles(r.files),
                      auditTrail: [...(r.auditTrail || []), auditTrailEntry]
                  };
              }
              return r;
          });
      } else if (targetType === 'perkara') {
          nextPerkara = state.perkaraRecords.map(r => {
              if (r.id === targetId) {
                  return {
                      ...r,
                      files: updateFiles(r.files),
                      auditTrail: [...(r.auditTrail || []), auditTrailEntry]
                  };
              }
              return r;
          });
      } else if (targetType === 'putusan') {
          nextPutusan = state.putusanRecords.map(r => {
              if (r.id === targetId) {
                  return {
                      ...r,
                      files: updateFiles(r.files),
                      auditTrail: [...(r.auditTrail || []), auditTrailEntry]
                  };
              }
              return r;
          });
      } else if (targetType === 'telaahan') {
          nextTelaahan = state.telaahanRecords.map(r => {
              if (r.id === targetId) {
                  const existingDocs = r.dokumenTelaahan || [];
                  const existingNames = new Set(existingDocs.map(d => d.name));
                  const newDocs: DokumenTelaahanItem[] = permohonanFiles
                    .filter(f => !existingNames.has(f.name))
                    .map(f => ({
                      id: f.id,
                      name: f.name,
                      size: f.size,
                      type: f.type,
                      kategori: 'Data Dukung' as const,
                      tanggal: f.tanggal,
                      nomor: f.nomor,
                      deskripsi: f.deskripsi
                    }));
                  return {
                      ...r,
                      dokumenTelaahan: [...existingDocs, ...newDocs]
                  };
              }
              return r;
          });
      }

      const typeLabel = targetType === 'pendampingan' ? 'Pendampingan' : targetType === 'perkara' ? 'Penanganan Perkara' : targetType === 'putusan' ? 'Penanganan Putusan' : 'Telaahan Kasus Hukum';

      const updatedPermohonanList = state.permohonanList.map(p => p.id === permohonanId ? { 
        ...p, 
        status: StatusPermohonan.DIPROSES, 
        assignedTo: targetId,
        history: [...(p.history || []), {
          id: Date.now(),
          author: 'Administrator' as const,
          message: `Permohonan dan ${permohonanFiles.length} dokumen/lampiran berhasil dihubungkan ke data ${typeLabel} #${targetId}.`,
          files: [],
          timestamp: new Date()
        }]
      } : p);
      const updatedSelected = updatedPermohonanList.find(p => p.id === permohonanId) || null;

      return {
        pendampinganRecords: nextPendampingan,
        perkaraRecords: nextPerkara,
        putusanRecords: nextPutusan,
        telaahanRecords: nextTelaahan,
        permohonanList: updatedPermohonanList,
        selectedPermohonan: state.selectedPermohonan?.id === permohonanId ? updatedSelected : state.selectedPermohonan,
        currentPermohonanToProses: state.currentPermohonanToProses?.id === permohonanId ? updatedSelected : state.currentPermohonanToProses,
        notification: { 
          message: `Permohonan berhasil dihubungkan ke data ${typeLabel} existing. ${permohonanFiles.length} dokumen/lampiran telah masuk.`, 
          type: 'success' 
        }
      };
    });
  },

  handleSetPermohonanPic: (recordId, picId) => {
    set((state) => {
      const nextRecords = state.permohonanList.map(r => {
          if (r.id === recordId) {
              const picName = r.team?.find(m => m.id === picId)?.nama || 'None';
              const updatedRecord: Permohonan = { 
                  ...r, 
                  picId: picId || undefined, 
                  history: [...(r.history || []), { 
                      id: Date.now(), 
                      author: 'Administrator', 
                      message: `Menetapkan PIC baru: ${picName}`, 
                      files: [], 
                      timestamp: new Date() 
                  }] 
              };
              return updatedRecord;
          }
          return r;
      });

      const nextTelaahan = state.telaahanRecords.map(t => 
        t.id === recordId ? { ...t, picId: picId || undefined } : t
      );

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        permohonanList: nextRecords,
        telaahanRecords: nextTelaahan,
        selectedPermohonan: state.selectedPermohonan?.id === recordId ? updatedSelected : state.selectedPermohonan,
        currentPermohonanToProses: state.currentPermohonanToProses?.id === recordId ? updatedSelected : state.currentPermohonanToProses,
        notification: { message: 'PIC permohonan berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleUpdatePermohonanTeam: (recordId, team) => {
    set((state) => {
      const nextRecords = state.permohonanList.map(r => {
          if (r.id === recordId) {
              const updatedRecord = { ...r, team };
              return updatedRecord;
          }
          return r;
      });

      const nextTelaahan = state.telaahanRecords.map(t => 
        t.id === recordId ? { ...t, team } : t
      );

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        permohonanList: nextRecords,
        telaahanRecords: nextTelaahan,
        selectedPermohonan: state.selectedPermohonan?.id === recordId ? updatedSelected : state.selectedPermohonan,
        currentPermohonanToProses: state.currentPermohonanToProses?.id === recordId ? updatedSelected : state.currentPermohonanToProses,
        notification: { message: 'Tim advokasi permohonan berhasil diperbarui.', type: 'success' }
      };
    });
  },

  handleBulkReplaceTeamMember: (oldUserId, newUserId, newUserName, recordIds) => {
    set((state) => {
      const replaceMember = (team: TeamMember[] | undefined): TeamMember[] | undefined => {
        if (!team) return team;
        return team.map(m => m.id === oldUserId ? { ...m, id: newUserId, nama: newUserName } : m);
      };

      const auditEntry = (recordName: string) => ({
        id: Date.now(),
        timestamp: new Date(),
        user: state.userName,
        action: 'memperbarui',
        details: `Mengganti anggota tim dari ID ${oldUserId} ke ${newUserName} (ID: ${newUserId}) secara bulk pada ${recordName}`
      });

      const nextPendampingan = state.pendampinganRecords.map(r => {
        if (recordIds.pendampingan.includes(r.id)) {
          return { 
            ...r, 
            team: replaceMember(r.team),
            picId: r.picId === oldUserId ? newUserId : r.picId,
            auditTrail: [...(r.auditTrail || []), auditEntry('Pendampingan')]
          };
        }
        return r;
      });

      const nextPerkara = state.perkaraRecords.map(r => {
        if (recordIds.perkara.includes(r.id)) {
          return {
            ...r,
            team: replaceMember(r.team),
            picId: r.picId === oldUserId ? newUserId : r.picId,
            auditTrail: [...(r.auditTrail || []), auditEntry('Perkara')]
          };
        }
        return r;
      });

      const nextPutusan = state.putusanRecords.map(r => {
        if (recordIds.putusan.includes(r.id)) {
          return {
            ...r,
            team: replaceMember(r.team),
            picId: r.picId === oldUserId ? newUserId : r.picId,
            auditTrail: [...(r.auditTrail || []), auditEntry('Putusan')]
          };
        }
        return r;
      });

      const telaahanIds = recordIds.telaahan || [];
      const nextTelaahan = state.telaahanRecords.map(r => {
        if (telaahanIds.includes(r.id)) {
          return {
            ...r,
            team: replaceMember(r.team),
            picId: r.picId === oldUserId ? newUserId : r.picId
          };
        }
        return r;
      });

      return {
        pendampinganRecords: nextPendampingan,
        perkaraRecords: nextPerkara,
        putusanRecords: nextPutusan,
        telaahanRecords: nextTelaahan,
        notification: { message: `Anggota tim berhasil diganti secara massal.`, type: 'success' }
      };
    });
  }
}));
