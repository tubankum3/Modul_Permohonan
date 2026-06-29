import { create } from 'zustand';
import { 
  initialPermohonan, 
  initialBerandaContent, 
  initialFaqData, 
  initialPendampinganRecords, 
  initialPerkaraRecords,
  initialUserAccounts
} from './initialData';
import { 
  Permohonan, StatusPermohonan, Riwayat, NotificationType, Notification as NotificationProps, 
  JenisPermohonan, View, SuratMasukNadine, BerandaContent, FaqCategory, 
  PendampinganRecord, StatusPendampingan, PosisiUpdate, TeamMember, 
  PerkaraRecord, StatusPerkara, StatusPutusan, UserAccount
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
  handleAssignToExisting: (permohonanId: string, targetId: string, targetType: 'pendampingan' | 'perkara' | 'putusan') => void;
  handleSetPermohonanPic: (recordId: string, picId: string | null) => void;
  handleUpdatePermohonanTeam: (recordId: string, team: TeamMember[]) => void;
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
  globalRole: 'Super Admin',
  teamRole: 'PIC',
  userName: 'Sukiyem',
  userAccounts: initialUserAccounts,

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
      const nextRecords = state.permohonanList.map(p => p.id === id ? { ...p, status: StatusPermohonan.DIPROSES } : p);
      const updatedSelected = nextRecords.find(p => p.id === id) || null;
      return {
        permohonanList: nextRecords,
        selectedPermohonan: state.selectedPermohonan?.id === id ? updatedSelected : state.selectedPermohonan,
        currentPermohonanToProses: state.currentPermohonanToProses?.id === id ? updatedSelected : state.currentPermohonanToProses,
        notification: { message: 'Permohonan telah diterima dan dipindahkan ke Pengelolaan Permohonan.', type: 'success' }
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
          const newRecord = { ...record, id: record.id || `pd-${generateRandomId()}`, deletedAt: undefined };
          nextRecords = [newRecord, ...state.pendampinganRecords];
          
          if (isRecording) {
              notificationMsg = 'Permohonan berhasil direkam sebagai Pendampingan Aktif.';
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
          const newRecord = { ...record, id: isRecording ? record.id : `pk-${generateRandomId()}`, deletedAt: undefined };
          
          const auditEntry = {
              id: Date.now(),
              timestamp: new Date(),
              user: 'Administrator',
              action: isRecording ? 'merekam' : 'membuat',
              details: isRecording ? `Perkara direkam dari permohonan #${record.Nomor || record.id}` : 'Perkara baru dibuat manual'
          };
          const recordWithAudit = { ...newRecord, auditTrail: [auditEntry] };
          
          nextRecords = [recordWithAudit, ...state.perkaraRecords];
          
          if (isRecording) {
              nextPermohonanList = state.permohonanList.map(p => p.id === record.id ? { 
                  ...p, 
                  history: [...(p.history || []), {
                      id: Date.now(),
                      author: 'Administrator',
                      message: `Permohonan telah direkam sebagai Perkara Litigasi dengan No. Perkara: ${record.abstraksiPerkara?.noPerkara || record.Nomor || record.id}`,
                      files: [],
                      timestamp: new Date()
                  }]
              } : p);
              notificationMsg = 'Permohonan berhasil direkam sebagai Perkara Aktif.';
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
    set((state) => ({
      putusanRecords: state.putusanRecords.map(r => r.id === record.id ? record : r),
      notification: { message: 'Data putusan berhasil diperbarui.', type: 'success' }
    }));
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

  handleAssignToExisting: (permohonanId, targetId, targetType) => {
    const permohonan = get().permohonanList.find(p => p.id === permohonanId);
    if (!permohonan) return;

    const updateFiles = (existingFiles: any[] = []) => {
        return [...existingFiles, ...(permohonan.files || [])];
    };

    const auditTrailEntry = {
        id: Date.now(),
        timestamp: new Date(),
        user: 'Admin User',
        action: 'menambahkan',
        details: `Dokumen dari Permohonan #${permohonan.Nomor || permohonan.id}`
    };

    set((state) => {
      let nextPendampingan = [...state.pendampinganRecords];
      let nextPerkara = [...state.perkaraRecords];
      let nextPutusan = [...state.putusanRecords];

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
      }

      const updatedPermohonanList = state.permohonanList.map(p => p.id === permohonanId ? { ...p, status: StatusPermohonan.DIPROSES, assignedTo: targetId } : p);
      const updatedSelected = updatedPermohonanList.find(p => p.id === permohonanId) || null;

      return {
        pendampinganRecords: nextPendampingan,
        perkaraRecords: nextPerkara,
        putusanRecords: nextPutusan,
        permohonanList: updatedPermohonanList,
        selectedPermohonan: state.selectedPermohonan?.id === permohonanId ? updatedSelected : state.selectedPermohonan,
        currentPermohonanToProses: state.currentPermohonanToProses?.id === permohonanId ? updatedSelected : state.currentPermohonanToProses,
        notification: { message: `Permohonan berhasil di-assign ke ${targetType} existing dan dipindahkan ke Pengelolaan Permohonan.`, type: 'success' }
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

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        permohonanList: nextRecords,
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

      const updatedSelected = nextRecords.find(r => r.id === recordId) || null;

      return {
        permohonanList: nextRecords,
        selectedPermohonan: state.selectedPermohonan?.id === recordId ? updatedSelected : state.selectedPermohonan,
        currentPermohonanToProses: state.currentPermohonanToProses?.id === recordId ? updatedSelected : state.currentPermohonanToProses,
        notification: { message: 'Tim advokasi permohonan berhasil diperbarui.', type: 'success' }
      };
    });
  }
}));
