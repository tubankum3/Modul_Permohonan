
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

export enum StatusPendampingan {
  AKTIF = 'Aktif',
  SELESAI = 'Selesai',
}

export interface PosisiUpdate {
    id: number;
    suratTugas: string;
    tanggalSuratTugas?: string;
    agenda: string;
    tanggalAgenda?: string;
    pemanggilDanSurat: { pemanggil: string; surat: string };
    lokasi: string;
    durasi: number; // in minutes
    rincian: string;
    timestamp: Date;
}

export interface TeamMember {
    id: string;
    nama: string;
    nip: string;
    unit: string;
    role: string; // Job title
    teamRole: 'Editor' | 'Viewer';
}

export interface AuditTrailEntry {
  id: number;
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export interface PendampinganRecord extends Permohonan {
  statusPendampingan: StatusPendampingan;
  posisi?: PosisiUpdate[];
  abstraksi?: {
      tahunMasuk?: number;
      nomorTiket?: string;
      unitPemanggil?: string;
      unitPemohon?: string;
      pihakDipanggil?: string;
      wilayah?: string;
      pokokPermasalahan?: string;
      keterangan?: string;
  };
  team?: TeamMember[];
  picId?: string;
  auditTrail?: AuditTrailEntry[];
}

export enum StatusPutusan {
  AKTIF = 'Aktif',
  SELESAI = 'Selesai',
}

export interface TindakLanjut {
  id: number;
  tanggal: string;
  tindakLanjut: string;
  uraian: string;
}

export enum StatusPerkara {
  AKTIF = 'Aktif',
  SELESAI = 'Selesai',
}

export interface Pihak {
    id: string; 
    noUrut: string;
    pihak: string;
    identitas: string;
    keterangan?: string;
    unitBerperkara?: 'Ya' | 'Tidak';
}

export interface Tuntutan {
    id: number;
    objek: string;
    jenis: string;
    jumlahNominal: string;
    satuan: string;
    keterangan: string;
}

export interface Majelis {
    id: number;
    jabatan: string;
    identitas: string;
}

export interface AbstraksiPerkara {
    tahunMasuk?: number;
    noPerkara?: string;
    tanggalPendaftaranGugatan?: string;
    wilayah?: string;
    pengadilan?: string[];
    jenisPerkara?: string[];
    klasifikasiPerkara?: string;
    subKlasifikasiPerkara?: string;
    subSubKlasifikasiPerkara?: string;
    jenisPokokPerkara?: string[];
    subPokokPerkara?: string;
    subSubPokokPerkara?: string;
    rincianPokokPerkara?: string;
    nomorSuratKuasaKhusus?: string;
    tagsPerkara?: string[];
}

export interface PosisiSidangEntry {
    id: number;
    suratTugas?: string;
    tanggalSuratTugas?: string;
    agendaSidang: string;
    tanggalSidang: string;
    agendaBerikutnya?: string;
    tanggalSidangBerikutnya?: string;
    kehadiran?: 'Hadir' | 'Tidak Hadir' | 'Diwakilkan';
    keterangan?: string;
}

export interface PosisiSidang {
    tkPertama: PosisiSidangEntry[];
    tkBanding: PosisiSidangEntry[];
    tkKasasi: PosisiSidangEntry[];
    tkPK: PosisiSidangEntry[];
}

export interface Putusan {
    id: number;
    nomor: string;
    tanggal: string;
    amar: string;
    status: 'Menang' | 'Kalah' | 'Damai' | string;
    pertimbanganHakim?: string;
    keterangan?: string;
    posisi?: 'Pertama' | 'Banding' | 'Kasasi' | 'PK';
}

export interface DokumenLitigasi {
    id: number;
    noNaskah: string;
    jenis: string;
    deskripsi: string;
    timestamp: string;
}

export interface PerkaraRecord extends Permohonan {
  statusPerkara: StatusPerkara;
  statusPutusan?: StatusPutusan;
  tindakLanjut?: TindakLanjut[];
  abstraksiPerkara?: AbstraksiPerkara;
  pihakP?: Pihak[];
  pihakT?: Pihak[];
  tuntutan?: Tuntutan[];
  susunanMajelis?: Majelis[];
  posisiSidang?: PosisiSidang;
  putusan?: Putusan[];
  statusBHT?: {
      status: 'Inkracht' | string;
      keteranganDampak: string;
  };
  dokumenLitigasi?: DokumenLitigasi[];
  team?: TeamMember[];
  picId?: string;
  auditTrail?: AuditTrailEntry[];
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
  'eAdvokasiUser' | 'eAdvokasiArsip' | 'eAdvokasiRecycleBin' | 'eAdvokasiReferensi' | 'eAdvokasiTim' | 'eAdvokasiInfo' | 'eAdvokasiFaq' |
  'eAdvokasiPendampinganDetail' | 'eAdvokasiPendampinganTim' | 'eAdvokasiPendampinganPosisi' |
  'eAdvokasiPerkaraDetail' | 'eAdvokasiPerkaraEdit' | 'eAdvokasiPerkaraUpdatePosisi' | 'eAdvokasiPerkaraTim' | 'eAdvokasiAgendaBerikutnya' |
  'eAdvokasiPenangananPutusan' | 'eAdvokasiPutusanDetail' | 'eAdvokasiPutusanEdit' | 'eAdvokasiPutusanUpdateTindakLanjut' | 'eAdvokasiPutusanTim';
