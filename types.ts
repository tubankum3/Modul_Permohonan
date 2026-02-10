export enum StatusPermohonan {
  DRAFT = 'Draft',
  BARU = 'Baru',
  TERKIRIM = 'Kirim Permohonan',
  DIPROSES = 'Diproses',
  SELESAI = 'Selesai',
}

export enum JenisPermohonan {
  PENANGANAN_PERKARA = 'Penanganan Perkara',
  PENDAMPINGAN = 'Pendampingan',
}

export interface FileData {
  name: string;
  size: number;
  type: string;
}

export interface Riwayat {
  id: number;
  author: 'Pegawai' | 'Administrator';
  message: string;
  files: FileData[];
  timestamp: Date;
}

export interface Disposisi {
  id: number;
  pengirim: string;
  tujuan: string[];
  catatan: string;
  petunjukDisposisi: string[];
  tanggalKirim: string;
}

export interface Permohonan {
  id: string;
  Nomor?: string;
  pemohon: string;
  jenis: JenisPermohonan;
  perihal: string;
  uraian: string;
  files: FileData[];
  status: StatusPermohonan;
  tanggal: string;
  unit: string;
  history: Riwayat[];
  sumber?: 'Nadine' | 'Internal';
  disposisi?: Disposisi[];
}

export interface SuratMasukNadine {
  naskahId: string;
  nomorSurat: string;
  perihal: string;
  unitPengirim: string;
  tanggal: string;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  category: string;
  questions: FaqItem[];
}

export interface BerandaFlowStep {
    step: number;
    title: string;
    description: string;
}

export interface BerandaContent {
    pageTitle: string;
    flowTitle: string;
    flowSteps: BerandaFlowStep[];
    eAdvokasiTitle: string;
    eAdvokasiParagraph1: string;
    eAdvokasiParagraph2: string;
}


export type View = 
  'beranda' | 'list' | 'detail' | 'create' | 'edit' | 
  'pilihTemplate' | 'formNaskah' | 'faq' | 
  'eAdvokasiInbox' | 'eAdvokasiPengelolaan' | 'eAdvokasiProses' |
  'eAdvokasiBeranda' | 'eAdvokasiPendampingan' | 'eAdvokasiPenangananPerkara' | 'eAdvokasiPenangananPutusan' |
  'eAdvokasiKalender' | 'eAdvokasiMonitoring' | 'eAdvokasiLaporan' |
  'eAdvokasiUser' | 'eAdvokasiArsip' | 'eAdvokasiRecycleBin' | 'eAdvokasiReferensi' | 'eAdvokasiTim' | 'eAdvokasiInfo' | 'eAdvokasiFaq';