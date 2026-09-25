import React, { useState, useMemo, useCallback } from 'react';
import { 
  PerkaraRecord, 
  PendampinganRecord, 
  TelaahanRecord, 
  View, 
  PosisiSidangEntry,
  PosisiUpdate
} from '../types';
import { useAdvokasiStore } from '../useAdvokasiStore';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon, 
  ClockIcon,
  SearchIcon,
  CheckCircleIcon,
  ExclamationIcon,
  ArrowLeftIcon
} from './icons';
import Breadcrumb from './Breadcrumb';

export type CalendarEventCategory = 
  | 'SIDANG' 
  | 'PENDAMPINGAN' 
  | 'PERKARA' 
  | 'PUTUSAN' 
  | 'TELAAHAN' 
  | 'TINDAK_LANJUT';

export interface CalendarEvent {
  id: string;
  category: CalendarEventCategory;
  date: Date;
  time?: string;
  title: string;
  description?: string;
  referenceNumber: string;
  sourceUnit?: string;
  parties?: string;
  urgency?: 'Biasa' | 'Segera' | 'Sangat Segera';
  statusLabel?: string;
  picName: string;
  targetView: View;
  targetRecord?: any;
  actionLabel?: string;
}

interface EAdvokasiKalenderProps {
  daftarPerkara?: PerkaraRecord[];
  daftarPendampingan?: PendampinganRecord[];
  daftarPutusan?: PerkaraRecord[];
  daftarTelaahan?: TelaahanRecord[];
  onNavigate: (view: View, data?: any) => void;
}

type PeriodViewType = 'daily' | 'weekly' | 'monthly';

const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAYS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

// Category configurations: color markers, labels, badges, styling
export const CATEGORY_CONFIG: Record<CalendarEventCategory, {
  label: string;
  shortLabel: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  iconBg: string;
  textColor: string;
  iconSymbol: string;
}> = {
  SIDANG: {
    label: 'Sidang Pengadilan',
    shortLabel: 'Sidang',
    dotColor: 'bg-blue-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    cardBorder: 'border-l-blue-600',
    iconBg: 'bg-blue-100 text-blue-700',
    textColor: 'text-blue-700',
    iconSymbol: '⚖️',
  },
  PENDAMPINGAN: {
    label: 'Deadline Pendampingan',
    shortLabel: 'Pendampingan',
    dotColor: 'bg-purple-600',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    cardBorder: 'border-l-purple-600',
    iconBg: 'bg-purple-100 text-purple-700',
    textColor: 'text-purple-700',
    iconSymbol: '🛡️',
  },
  PERKARA: {
    label: 'Deadline Penanganan Perkara',
    shortLabel: 'Perkara',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    cardBorder: 'border-l-amber-500',
    iconBg: 'bg-amber-100 text-amber-800',
    textColor: 'text-amber-800',
    iconSymbol: '📄',
  },
  PUTUSAN: {
    label: 'Deadline Penanganan Putusan',
    shortLabel: 'Putusan',
    dotColor: 'bg-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    cardBorder: 'border-l-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-700',
    textColor: 'text-emerald-700',
    iconSymbol: '🏛️',
  },
  TELAAHAN: {
    label: 'Telaahan Kasus Hukum',
    shortLabel: 'Telaahan',
    dotColor: 'bg-cyan-600',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200',
    cardBorder: 'border-l-cyan-600',
    iconBg: 'bg-cyan-100 text-cyan-800',
    textColor: 'text-cyan-800',
    iconSymbol: '💡',
  },
  TINDAK_LANJUT: {
    label: 'Tugas Tindak Lanjut',
    shortLabel: 'Tindak Lanjut',
    dotColor: 'bg-rose-500',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    cardBorder: 'border-l-rose-500',
    iconBg: 'bg-rose-100 text-rose-700',
    textColor: 'text-rose-700',
    iconSymbol: '🚩',
  },
};

// Flexible Date parser
function parseFlexibleDate(dateStr?: string | Date | null): Date | null {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  const trimmed = dateStr.trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const parts = trimmed.split(/[-T ]/);
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dt = new Date(y, m, d);
    return isNaN(dt.getTime()) ? null : dt;
  }
  // DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/.test(trimmed)) {
    const delimiter = trimmed.includes('/') ? '/' : '-';
    const parts = trimmed.split(delimiter);
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    const dt = new Date(y, m, d);
    return isNaN(dt.getTime()) ? null : dt;
  }

  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
}

const formatDateId = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
};

const formatFullIndonesianDate = (date: Date) => {
  const daysName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = daysName[date.getDay()];
  const day = date.getDate();
  const month = INDO_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
};

export const EAdvokasiKalender: React.FC<EAdvokasiKalenderProps> = ({ 
  daftarPerkara: propsPerkara, 
  daftarPendampingan: propsPendampingan,
  daftarPutusan: propsPutusan,
  daftarTelaahan: propsTelaahan,
  onNavigate 
}) => {
  // Store integration
  const store = useAdvokasiStore();
  const perkaraList = propsPerkara || store.perkaraRecords || [];
  const pendampinganList = propsPendampingan || store.pendampinganRecords || [];
  const putusanList = propsPutusan || store.putusanRecords || [];
  const telaahanList = propsTelaahan || store.telaahanRecords || [];

  // State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [periodView, setPeriodView] = useState<PeriodViewType>('daily');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | CalendarEventCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom user-created tasks in this session
  const [customTasks, setCustomTasks] = useState<CalendarEvent[]>([]);

  // Modals
  const [isQuickSummaryModalOpen, setIsQuickSummaryModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  
  // Form state for adding custom task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<CalendarEventCategory>('TINDAK_LANJUT');
  const [newTaskDate, setNewTaskDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newTaskRef, setNewTaskRef] = useState('');
  const [newTaskPic, setNewTaskPic] = useState('Tim Advokasi');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskUrgency, setNewTaskUrgency] = useState<'Biasa' | 'Segera' | 'Sangat Segera'>('Segera');

  // Helper to extract PIC name safely
  const extractPicName = useCallback((record: any): string => {
    if (!record) return 'Belum Ditetapkan';
    if (record.team && record.picId) {
      const pic = record.team.find((m: any) => m.id === record.picId);
      if (pic) return pic.nama;
    }
    if (record.abstraksi?.pic?.agency) return record.abstraksi.pic.agency;
    if (record.pemohon) return record.pemohon;
    return 'Tim Advokasi';
  }, []);

  // Aggregate all events across modules
  const allEvents = useMemo(() => {
    const list: CalendarEvent[] = [];

    // 1. COURT HEARINGS (Sidang Pengadilan) from perkaraRecords
    perkaraList.forEach(perkara => {
      if (perkara.posisiSidang) {
        const sidangEntries: PosisiSidangEntry[] = [
          ...(perkara.posisiSidang.tkPertama || []),
          ...(perkara.posisiSidang.tkBanding || []),
          ...(perkara.posisiSidang.tkKasasi || []),
          ...(perkara.posisiSidang.tkPK || []),
        ];

        sidangEntries.forEach(sidang => {
          // Tanggal Sidang
          if (sidang.tanggalSidang) {
            const dt = parseFlexibleDate(sidang.tanggalSidang);
            if (dt) {
              list.push({
                id: `sidang-${perkara.id}-${sidang.id}-${dt.getTime()}`,
                category: 'SIDANG',
                date: dt,
                time: '09:00 WIB',
                title: `Sidang: ${sidang.agendaSidang}`,
                description: sidang.keterangan || `Sidang perkara di ${perkara.abstraksiPerkara?.pengadilan || 'Pengadilan'}`,
                referenceNumber: perkara.abstraksiPerkara?.noPerkara || perkara.Nomor || perkara.id,
                sourceUnit: perkara.abstraksiPerkara?.pengadilan || perkara.unit,
                parties: (perkara.abstraksiPerkara as any)?.namaPihak || (perkara.pihakP && perkara.pihakT ? `${perkara.pihakP[0]?.identitas || 'Penggugat'} vs ${perkara.pihakT[0]?.identitas || 'Tergugat'}` : undefined),
                urgency: 'Segera',
                statusLabel: 'Sidang Pengadilan',
                picName: extractPicName(perkara),
                targetView: 'eAdvokasiPerkaraDetail',
                targetRecord: perkara,
                actionLabel: 'Buka Detail Perkara'
              });
            }
          }

          // Tanggal Sidang Berikutnya (Lanjutan)
          if (sidang.tanggalSidangBerikutnya && sidang.agendaBerikutnya) {
            const nextDt = parseFlexibleDate(sidang.tanggalSidangBerikutnya);
            if (nextDt) {
              list.push({
                id: `sidang-next-${perkara.id}-${sidang.id}-${nextDt.getTime()}`,
                category: 'SIDANG',
                date: nextDt,
                time: '09:30 WIB',
                title: `Sidang Lanjutan: ${sidang.agendaBerikutnya}`,
                description: `Jadwal sidang lanjutan untuk perkara di ${perkara.abstraksiPerkara?.pengadilan || 'Pengadilan'}`,
                referenceNumber: perkara.abstraksiPerkara?.noPerkara || perkara.Nomor || perkara.id,
                sourceUnit: perkara.abstraksiPerkara?.pengadilan || perkara.unit,
                parties: (perkara.abstraksiPerkara as any)?.namaPihak,
                urgency: 'Sangat Segera',
                statusLabel: 'Sidang Lanjutan',
                picName: extractPicName(perkara),
                targetView: 'eAdvokasiPerkaraDetail',
                targetRecord: perkara,
                actionLabel: 'Buka Detail Perkara'
              });
            }
          }
        });
      }

      // 2. DEADLINE PERKARA (Procedural Deadlines) from perkaraRecords
      if (perkara.tindakLanjut && perkara.tindakLanjut.length > 0) {
        perkara.tindakLanjut.forEach(tl => {
          const dt = parseFlexibleDate(tl.tanggal);
          if (dt) {
            const isDeadlinePerkara = tl.tindakLanjut.toLowerCase().includes('deadline') ||
                                     tl.tindakLanjut.toLowerCase().includes('batas') ||
                                     tl.tindakLanjut.toLowerCase().includes('duplik') ||
                                     tl.tindakLanjut.toLowerCase().includes('jawaban') ||
                                     tl.tindakLanjut.toLowerCase().includes('bukti');
            
            const category: CalendarEventCategory = isDeadlinePerkara ? 'PERKARA' : 'TINDAK_LANJUT';
            
            list.push({
              id: `tl-perkara-${perkara.id}-${tl.id}-${dt.getTime()}`,
              category,
              date: dt,
              time: '16:00 WIB',
              title: tl.tindakLanjut,
              description: tl.uraian,
              referenceNumber: perkara.abstraksiPerkara?.noPerkara || perkara.Nomor || perkara.id,
              sourceUnit: perkara.unit,
              urgency: 'Segera',
              statusLabel: category === 'PERKARA' ? 'Deadline Litigasi' : 'Tindak Lanjut Perkara',
              picName: extractPicName(perkara),
              targetView: 'eAdvokasiPerkaraDetail',
              targetRecord: perkara,
              actionLabel: 'Buka Dokumen Perkara'
            });
          }
        });
      }
    });

    // 3. PENDAMPINGAN (Deadlines & Agenda) from pendampinganRecords
    pendampinganList.forEach(pendampingan => {
      if (pendampingan.posisi && pendampingan.posisi.length > 0) {
        pendampingan.posisi.forEach((posisi: PosisiUpdate) => {
          if (posisi.tanggalAgenda) {
            const dt = parseFlexibleDate(posisi.tanggalAgenda);
            if (dt) {
              list.push({
                id: `pendampingan-posisi-${pendampingan.id}-${posisi.id}-${dt.getTime()}`,
                category: 'PENDAMPINGAN',
                date: dt,
                time: '10:00 WIB',
                title: `Pendampingan: ${posisi.agenda}`,
                description: posisi.rincian || `Agenda pemanggilan di ${posisi.lokasi || posisi.pemanggil?.[0] || 'Instansi Terkait'}`,
                referenceNumber: posisi.suratPemanggilan || pendampingan.Nomor || pendampingan.id,
                sourceUnit: posisi.pemanggil?.join(', ') || pendampingan.unit,
                parties: posisi.terpanggil?.join(', ') || pendampingan.pemohon,
                urgency: 'Sangat Segera',
                statusLabel: `Posisi: ${posisi.posisiKasus || 'Penyelidikan'}`,
                picName: extractPicName(pendampingan),
                targetView: 'eAdvokasiPendampinganDetail',
                targetRecord: pendampingan,
                actionLabel: 'Buka Detail Pendampingan'
              });
            }
          }
        });
      }
    });

    // 4. PUTUSAN (Deadlines & Upaya Hukum) from putusanList
    putusanList.forEach(putusan => {
      if (putusan.putusan && putusan.putusan.length > 0) {
        putusan.putusan.forEach(p => {
          if (p.tanggal) {
            const dtPutusan = parseFlexibleDate(p.tanggal);
            if (dtPutusan) {
              // 14 days legal remedy deadline (Tenggang Waktu Upaya Hukum)
              const dtTenggang = new Date(dtPutusan);
              dtTenggang.setDate(dtTenggang.getDate() + 14);

              list.push({
                id: `putusan-remedy-${putusan.id}-${p.id}-${dtTenggang.getTime()}`,
                category: 'PUTUSAN',
                date: dtTenggang,
                time: '23:59 WIB',
                title: `Batas Waktu Upaya Hukum: ${p.nomor || putusan.Nomor}`,
                description: `Tenggang waktu 14 hari kalender pengajuan upaya hukum Banding/Kasasi atas putusan dengan amar: "${p.amar}".`,
                referenceNumber: p.nomor || putusan.Nomor,
                sourceUnit: putusan.abstraksiPerkara?.pengadilan || putusan.unit,
                urgency: 'Sangat Segera',
                statusLabel: `Amar: ${p.status || 'Kalah'} (${p.posisi || 'Tingkat Pertama'})`,
                picName: extractPicName(putusan),
                targetView: 'eAdvokasiPutusanDetail',
                targetRecord: putusan,
                actionLabel: 'Buka Penanganan Putusan'
              });
            }
          }
        });
      }

      // Tindak lanjut eksekusi putusan
      if (putusan.tindakLanjut && putusan.tindakLanjut.length > 0) {
        putusan.tindakLanjut.forEach(tl => {
          const dt = parseFlexibleDate(tl.tanggal);
          if (dt) {
            list.push({
              id: `tl-putusan-${putusan.id}-${tl.id}-${dt.getTime()}`,
              category: 'PUTUSAN',
              date: dt,
              time: '14:00 WIB',
              title: `Tindak Lanjut Putusan: ${tl.tindakLanjut}`,
              description: tl.uraian,
              referenceNumber: putusan.Nomor || putusan.id,
              sourceUnit: putusan.unit,
              urgency: 'Segera',
              statusLabel: 'Pelaksanaan Putusan',
              picName: extractPicName(putusan),
              targetView: 'eAdvokasiPutusanDetail',
              targetRecord: putusan,
              actionLabel: 'Buka Detail Putusan'
            });
          }
        });
      }
    });

    // 5. TELAAHAN KASUS HUKUM (SLA Deadlines & Target Nadine)
    telaahanList.forEach(telaahan => {
      // SLA deadline calculation
      if (telaahan.tanggal) {
        const dtSurat = parseFlexibleDate(telaahan.tanggal);
        if (dtSurat) {
          const urgensi = telaahan.abstraksiTelaahan?.tingkatUrgensi || 'Biasa';
          const daysToAdd = urgensi === 'Sangat Segera' ? 3 : urgensi === 'Segera' ? 7 : 14;
          const dtSla = new Date(dtSurat);
          dtSla.setDate(dtSla.getDate() + daysToAdd);

          list.push({
            id: `sla-telaahan-${telaahan.id}-${dtSla.getTime()}`,
            category: 'TELAAHAN',
            date: dtSla,
            time: '17:00 WIB',
            title: `Batas Waktu SLA Telaahan: ${telaahan.perihal}`,
            description: `Target penyelesaian kajian hukum dan naskah telaahan (SLA ${urgensi}: ${daysToAdd} hari kerja) permohonan dari ${telaahan.pemohon}.`,
            referenceNumber: telaahan.nomorTelaahan || telaahan.Nomor || telaahan.id,
            sourceUnit: telaahan.unit || telaahan.pemohon,
            urgency: urgensi,
            statusLabel: `Urgensi ${urgensi}`,
            picName: extractPicName(telaahan),
            targetView: 'eAdvokasiTelaahanKasusHukum',
            targetRecord: telaahan,
            actionLabel: 'Buka Telaahan Kasus'
          });
        }
      }

      // Target tanggal naskah telaahan di Nadine
      if (telaahan.naskahTelaahan?.tanggalNaskah) {
        const dtNaskah = parseFlexibleDate(telaahan.naskahTelaahan.tanggalNaskah);
        if (dtNaskah) {
          list.push({
            id: `naskah-telaahan-${telaahan.id}-${dtNaskah.getTime()}`,
            category: 'TELAAHAN',
            date: dtNaskah,
            time: '11:00 WIB',
            title: `Target TTE & Pengiriman Nadine: ${telaahan.naskahTelaahan.perihal || telaahan.perihal}`,
            description: `Penyelesaian draf naskah dinas dan penandatanganan elektronik oleh ${telaahan.naskahTelaahan.penandaTangan || 'Pimpinan Biro Advokasi'}.`,
            referenceNumber: telaahan.naskahTelaahan.nomorNaskah || telaahan.nomorTelaahan || telaahan.Nomor || telaahan.id,
            sourceUnit: telaahan.unit,
            urgency: 'Segera',
            statusLabel: `Nadine: ${telaahan.naskahTelaahan.statusNaskah}`,
            picName: extractPicName(telaahan),
            targetView: 'eAdvokasiTelaahanKasusHukum',
            targetRecord: telaahan,
            actionLabel: 'Buka Modul Telaahan'
          });
        }
      }
    });

    // 6. Custom User Tasks
    list.push(...customTasks);

    return list;
  }, [perkaraList, pendampinganList, putusanList, telaahanList, customTasks, extractPicName]);

  // Filter events by category and search query
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      if (categoryFilter !== 'ALL' && event.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(q);
        const matchRef = event.referenceNumber.toLowerCase().includes(q);
        const matchUnit = event.sourceUnit?.toLowerCase().includes(q);
        const matchParties = event.parties?.toLowerCase().includes(q);
        const matchPic = event.picName.toLowerCase().includes(q);
        if (!matchTitle && !matchRef && !matchUnit && !matchParties && !matchPic) {
          return false;
        }
      }
      return true;
    });
  }, [allEvents, categoryFilter, searchQuery]);

  // Events on the currently selectedDate
  const selectedDateEvents = useMemo(() => {
    return filteredEvents.filter(event => isSameDay(event.date, selectedDate))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredEvents, selectedDate]);

  // Events for the chosen period (daily, weekly, monthly)
  const periodDisplayedEvents = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    let end = new Date(start);

    switch(periodView) {
      case 'daily':
        end.setDate(end.getDate() + 1);
        break;
      case 'weekly': {
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
        end = new Date(start);
        end.setDate(end.getDate() + 7);
        break;
      }
      case 'monthly':
        start.setDate(1);
        end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return filteredEvents.filter(event => event.date >= start && event.date < end)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredEvents, selectedDate, periodView]);

  // Top upcoming 5 events from today onward
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allEvents
      .filter(event => event.date.getTime() >= today.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6);
  }, [allEvents]);

  // Calendar Grid construction for currentDate (Month/Year)
  const daysArray = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay(); // 0: Sun, 1: Mon
    const startOffset = (startDayOfWeek + 6) % 7; // Convert to Mon start

    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { date: Date | null; isPadding: boolean }[] = [];

    // Leading padding days
    for (let i = 0; i < startOffset; i++) {
      days.push({ date: null, isPadding: true });
    }

    // Month days
    for (let day = 1; day <= totalDays; day++) {
      days.push({ date: new Date(year, month, day), isPadding: false });
    }

    return days;
  }, [currentDate]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleJumpToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  // Helper for countdown tag
  const getCountdownLabel = (eventDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(eventDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: 'Hari Ini', className: 'bg-rose-100 text-rose-800 font-bold border border-rose-300 animate-pulse' };
    }
    if (diffDays === 1) {
      return { text: 'Besok (H-1)', className: 'bg-amber-100 text-amber-800 font-bold border border-amber-300' };
    }
    if (diffDays > 1) {
      return { text: `${diffDays} hari lagi`, className: 'bg-blue-50 text-blue-700 border border-blue-200' };
    }
    if (diffDays === -1) {
      return { text: 'Kemarin', className: 'bg-gray-100 text-gray-700 border border-gray-200' };
    }
    return { text: `Terlewat ${Math.abs(diffDays)} hari`, className: 'bg-gray-100 text-gray-500 border border-gray-200' };
  };

  // Handler to add custom task
  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const dt = parseFlexibleDate(newTaskDate) || new Date();
    const newTask: CalendarEvent = {
      id: `custom-task-${Date.now()}`,
      category: newTaskCategory,
      date: dt,
      time: '10:00 WIB',
      title: newTaskTitle.trim(),
      description: newTaskNotes.trim() || 'Tugas tindak lanjut advokasi yang dijadwalkan secara manual.',
      referenceNumber: newTaskRef.trim() || 'TL-MANUAL',
      sourceUnit: 'Biro Advokasi',
      urgency: newTaskUrgency,
      statusLabel: 'Tugas Terjadwal',
      picName: newTaskPic.trim() || 'Tim Advokasi',
      targetView: 'eAdvokasiKalender',
      actionLabel: 'Lihat Kalender'
    };

    setCustomTasks(prev => [newTask, ...prev]);
    setIsAddTaskModalOpen(false);
    setSelectedDate(dt);
    setCurrentDate(new Date(dt.getFullYear(), dt.getMonth(), 1));

    // Reset form
    setNewTaskTitle('');
    setNewTaskNotes('');
    setNewTaskRef('');
    store.showNotification('Tugas tindak lanjut berhasil ditambahkan ke kalender.', 'success');
  };

  // Safe navigation wrapper
  const handleGoToDetail = (event: CalendarEvent) => {
    if (event.targetRecord && event.targetView) {
      if (event.targetView === 'eAdvokasiPerkaraDetail') {
        store.setSelectedPerkara(event.targetRecord);
      } else if (event.targetView === 'eAdvokasiPendampinganDetail') {
        store.setSelectedPendampingan(event.targetRecord);
      } else if (event.targetView === 'eAdvokasiPutusanDetail') {
        store.setSelectedPutusan(event.targetRecord);
      } else if (event.targetView === 'eAdvokasiTelaahanKasusHukum') {
        store.setSelectedTelaahan(event.targetRecord);
      }
      onNavigate(event.targetView, event.targetRecord);
    } else {
      onNavigate(event.targetView);
    }
  };

  const monthYearLabel = `${INDO_MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex flex-col font-sans">
      <Breadcrumb currentView="eAdvokasiKalender" onNavigate={onNavigate} />

      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <CalendarIcon className="w-7 h-7" />
            </span>
            Kalender Advokasi & Jadwal Sidang
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Monitoring terpadu sidang pengadilan, batas waktu pendampingan, penanganan perkara, putusan, telaahan hukum, dan tindak lanjut.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleJumpToday}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm transition-all flex items-center gap-1.5"
          >
            <ClockIcon className="w-4 h-4 text-blue-600" />
            Hari Ini
          </button>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>+</span> Tambah Tugas / Pengingat
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER BAR & SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-thin">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === 'ALL'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semua ({allEvents.length})
            </button>

            {(Object.keys(CATEGORY_CONFIG) as CalendarEventCategory[]).map(catKey => {
              const cfg = CATEGORY_CONFIG[catKey];
              const count = allEvents.filter(e => e.category === catKey).length;
              const isActive = categoryFilter === catKey;

              return (
                <button
                  key={catKey}
                  onClick={() => setCategoryFilter(catKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? `${cfg.badgeBg} ${cfg.badgeText} border ${cfg.badgeBorder} ring-2 ring-offset-1 ring-blue-500 font-bold`
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dotColor}`}></span>
                  <span>{cfg.shortLabel}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/80' : 'bg-gray-200 text-gray-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64 shrink-0">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari agenda, nomor, pihak..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* LEFT COLUMN: INTERACTIVE CALENDAR GRID & LEGEND */}
        <div className="lg:w-7/12 flex flex-col gap-6">
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200">
            {/* Calendar Month Header Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {monthYearLabel}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {filteredEvents.filter(e => e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear()).length} Agenda Bulan Ini
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-all"
                  title="Bulan Sebelumnya"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-all"
                  title="Bulan Berikutnya"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {WEEKDAYS.map((day, idx) => (
                <div 
                  key={day} 
                  className={`text-center font-bold text-xs tracking-wider py-1.5 rounded-lg ${
                    idx >= 5 ? 'text-rose-500 bg-rose-50/40' : 'text-gray-500 bg-gray-50'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid with Color-Coded Markers */}
            <div className="grid grid-cols-7 gap-1.5">
              {daysArray.map((dayObj, idx) => {
                if (dayObj.isPadding) {
                  return (
                    <div 
                      key={`pad-${idx}`}
                      className="min-h-[72px] rounded-xl bg-gray-50/50 border border-transparent"
                    />
                  );
                }

                const date = dayObj.date!;
                const today = isSameDay(date, new Date());
                const isSelected = isSameDay(date, selectedDate);
                
                // Events on this specific cell
                const dayEvents = filteredEvents.filter(e => isSameDay(e.date, date));
                const distinctCategories = Array.from(new Set(dayEvents.map(e => e.category)));

                return (
                  <button
                    key={`day-${date.getTime()}`}
                    type="button"
                    onClick={() => {
                      setSelectedDate(date);
                    }}
                    className={`min-h-[74px] p-1.5 rounded-xl text-left flex flex-col justify-between transition-all relative group cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500 shadow-md'
                        : today
                        ? 'bg-amber-50/50 border-amber-300 hover:bg-amber-100/50'
                        : dayEvents.length > 0
                        ? 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm'
                        : 'bg-white border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    {/* Top Row: Date Number & Today Tag */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : today
                          ? 'bg-amber-500 text-white'
                          : 'text-gray-800'
                      }`}>
                        {date.getDate()}
                      </span>

                      {today && !isSelected && (
                        <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-1 py-0.2 rounded">
                          Hari ini
                        </span>
                      )}

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-semibold text-gray-500">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Bottom: Color-Coded Markers / Dots */}
                    <div className="mt-1 flex flex-col gap-1 w-full">
                      {distinctCategories.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {distinctCategories.slice(0, 4).map(catKey => {
                            const cfg = CATEGORY_CONFIG[catKey];
                            return (
                              <span 
                                key={catKey}
                                title={`${cfg.label} (${dayEvents.filter(e => e.category === catKey).length})`}
                                className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor} ring-1 ring-white shadow-xs`}
                              />
                            );
                          })}
                          {distinctCategories.length > 4 && (
                            <span className="text-[9px] font-bold text-gray-600">
                              +{distinctCategories.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Small preview tag for single dominant event */}
                      {dayEvents.length === 1 && (
                        <span className={`text-[9px] font-medium truncate px-1 py-0.2 rounded leading-tight block ${
                          CATEGORY_CONFIG[dayEvents[0].category].badgeBg
                        } ${CATEGORY_CONFIG[dayEvents[0].category].badgeText}`}>
                          {dayEvents[0].title.replace(/^[^:]+:\s*/, '')}
                        </span>
                      )}

                      {dayEvents.length > 1 && (
                        <span className="text-[9px] font-medium text-gray-500 truncate block">
                          {dayEvents.length} Agenda
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* COLOR LEGEND BAR */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Keterangan Penanda Warna:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(CATEGORY_CONFIG) as CalendarEventCategory[]).map(catKey => {
                  const cfg = CATEGORY_CONFIG[catKey];
                  return (
                    <div 
                      key={catKey}
                      onClick={() => setCategoryFilter(catKey)}
                      className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <span className={`w-3 h-3 rounded-full shrink-0 ${cfg.dotColor}`}></span>
                      <span className="truncate">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* UPCOMING TOP EVENTS ACCORDION / BOX */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-blue-600" />
                Agenda & Deadline Terdekat (Mendatang)
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                {upcomingEvents.length} Jadwal
              </span>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const cfg = CATEGORY_CONFIG[event.category];
                  const countdown = getCountdownLabel(event.date);

                  return (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedDate(event.date);
                        setCurrentDate(new Date(event.date.getFullYear(), event.date.getMonth(), 1));
                      }}
                      className={`p-3.5 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer bg-gray-50/60 hover:bg-white border-l-4 ${cfg.cardBorder}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText} border ${cfg.badgeBorder}`}>
                              {cfg.shortLabel}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${countdown.className}`}>
                              {countdown.text}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{event.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDateId(event.date)} • {event.referenceNumber}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-medium text-blue-600 hover:underline">
                            Pilih Tanggal →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic text-center py-6">
                Tidak ada agenda mendatang yang tercatat saat ini.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK SUMMARY OF EVENTS FOR SELECTED DATE */}
        <div className="lg:w-5/12 flex flex-col gap-4">
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            
            {/* Quick Summary Header with Date */}
            <div className="pb-4 border-b border-gray-100 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Ringkasan Cepat
                  </span>
                  {isSameDay(selectedDate, new Date()) && (
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Hari Ini
                    </span>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mt-0.5">
                  {formatFullIndonesianDate(selectedDate)}
                </h3>
              </div>

              {/* View Switcher: Daily, Weekly, Monthly */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setPeriodView('daily')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    periodView === 'daily'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => setPeriodView('weekly')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    periodView === 'weekly'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Minggu
                </button>
                <button
                  onClick={() => setPeriodView('monthly')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    periodView === 'monthly'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Bulan
                </button>
              </div>
            </div>

            {/* Event Counter & Category Breakdown on selected period */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-700">
                {periodView === 'daily' ? 'Agenda Tanggal Terpilih:' : periodView === 'weekly' ? 'Agenda Minggu Terpilih:' : 'Agenda Bulan Terpilih:'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {periodDisplayedEvents.length} Agenda Ditemukan
              </span>
            </div>

            {/* List of Event Cards for Quick Summary */}
            {periodDisplayedEvents.length > 0 ? (
              <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[650px] pr-1">
                {periodDisplayedEvents.map((event) => {
                  const cfg = CATEGORY_CONFIG[event.category];
                  const countdown = getCountdownLabel(event.date);

                  return (
                    <div
                      key={event.id}
                      className={`p-4 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col gap-2.5 border-l-4 ${cfg.cardBorder}`}
                    >
                      {/* Top Badges & Countdown */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText} border ${cfg.badgeBorder} flex items-center gap-1`}>
                            <span>{cfg.iconSymbol}</span>
                            <span>{cfg.label}</span>
                          </span>
                          {event.statusLabel && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {event.statusLabel}
                            </span>
                          )}
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${countdown.className}`}>
                          {countdown.text}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h4 className="text-base font-bold text-gray-900 leading-snug">
                        {event.title}
                      </h4>

                      {/* Reference, Parties, & Unit */}
                      <div className="text-xs text-gray-600 space-y-1 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 font-medium">Nomor Berkas:</span>
                          <span className="font-bold text-gray-800 font-mono">{event.referenceNumber}</span>
                        </div>
                        {event.sourceUnit && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 font-medium">Satker / Pengadilan:</span>
                            <span className="font-semibold text-gray-800 text-right truncate max-w-[200px]" title={event.sourceUnit}>
                              {event.sourceUnit}
                            </span>
                          </div>
                        )}
                        {event.parties && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 font-medium">Pihak:</span>
                            <span className="font-semibold text-gray-800 text-right truncate max-w-[200px]" title={event.parties}>
                              {event.parties}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 font-medium">Waktu / Target:</span>
                          <span className="font-semibold text-gray-800">{formatDateId(event.date)} {event.time ? `• ${event.time}` : ''}</span>
                        </div>
                      </div>

                      {/* Description */}
                      {event.description && (
                        <p className="text-xs text-gray-600 italic bg-white p-1 line-clamp-2">
                          "{event.description}"
                        </p>
                      )}

                      {/* Footer: PIC & Action Button */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 truncate">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                            {event.picName.charAt(0)}
                          </span>
                          <span className="truncate max-w-[120px] font-medium" title={event.picName}>
                            PIC: {event.picName}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleGoToDetail(event)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xs flex items-center gap-1 shrink-0"
                        >
                          <span>{event.actionLabel || 'Lihat Detail'}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center flex-1">
                <CalendarIcon className="w-12 h-12 text-gray-300 mb-3" />
                <h4 className="text-sm font-bold text-gray-700">
                  Tidak Ada Agenda pada Tanggal Ini
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1">
                  Pilih tanggal lain yang memiliki penanda warna pada kalender, atau tambahkan tugas tindak lanjut baru.
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setNewTaskDate(selectedDate.toISOString().split('T')[0]);
                      setIsAddTaskModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xs"
                  >
                    + Buat Tugas di Tanggal Ini
                  </button>
                  <button
                    onClick={handleJumpToday}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Kembali ke Hari Ini
                  </button>
                </div>
              </div>
            )}

            {/* Quick Summary Modal Trigger */}
            {periodDisplayedEvents.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium">
                  {periodDisplayedEvents.length} berkas perlu atensi
                </span>
                <button
                  type="button"
                  onClick={() => setIsQuickSummaryModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                >
                  <span>Buka Modal Ringkasan Cepat</span>
                  <span>↗</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK SUMMARY POPUP MODAL */}
      {isQuickSummaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">
                  Ringkasan Agenda Harian
                </span>
                <h3 className="text-xl font-extrabold text-gray-900">
                  {formatFullIndonesianDate(selectedDate)}
                </h3>
              </div>
              <button
                onClick={() => setIsQuickSummaryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-4 overflow-y-auto flex-1 space-y-3 pr-1">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event, idx) => {
                  const cfg = CATEGORY_CONFIG[event.category];
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border border-gray-200 bg-gray-50/60 border-l-4 ${cfg.cardBorder}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText} border ${cfg.badgeBorder}`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-700">
                          {event.referenceNumber}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
                        <span className="text-gray-500 font-medium">PIC: {event.picName}</span>
                        <button
                          onClick={() => {
                            setIsQuickSummaryModalOpen(false);
                            handleGoToDetail(event);
                          }}
                          className="font-bold text-blue-600 hover:underline"
                        >
                          Buka Berkas →
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 italic">
                  Tidak ada agenda untuk tanggal ini.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cetak Agenda Hari Ini
              </button>
              <button
                onClick={() => setIsQuickSummaryModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOM TASK / REMINDER MODAL */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Tambah Tugas / Pengingat Kalender
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Jadwalkan agenda atau batas waktu tindak lanjut baru pada kalender.
                </p>
              </div>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kategori Agenda / Deadline *
                </label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as CalendarEventCategory)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SIDANG">🔵 Sidang Pengadilan</option>
                  <option value="PENDAMPINGAN">🟣 Deadline Pendampingan</option>
                  <option value="PERKARA">🟠 Deadline Penanganan Perkara</option>
                  <option value="PUTUSAN">🟢 Deadline Penanganan Putusan</option>
                  <option value="TELAAHAN">💠 Telaahan Kasus Hukum</option>
                  <option value="TINDAK_LANJUT">🔴 Tugas Tindak Lanjut</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Judul Agenda / Nama Tugas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sidang Lanjutan Pemeriksaan Saksi Ahli..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Target / Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tingkat Urgensi
                  </label>
                  <select
                    value={newTaskUrgency}
                    onChange={(e) => setNewTaskUrgency(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Segera">Segera</option>
                    <option value="Sangat Segera">Sangat Segera</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nomor Rujukan / Perkara
                  </label>
                  <input
                    type="text"
                    placeholder="No. Perkara / Putusan / Surat"
                    value={newTaskRef}
                    onChange={(e) => setNewTaskRef(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PIC / Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    placeholder="Nama PIC"
                    value={newTaskPic}
                    onChange={(e) => setNewTaskPic(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Catatan / Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Rincian instruksi atau data dukung yang harus dipersiapkan..."
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                >
                  Simpan ke Kalender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EAdvokasiKalender;
