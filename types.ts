
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
  url?: string;
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
  assignedTo?: string;
  deletedAt?: string;
  team?: TeamMember[];
  picId?: string;
}

export enum StatusPendampingan {
  AKTIF = 'Aktif',
  SELESAI = 'Selesai',
}

export interface PosisiUpdate {
    id: number;
    suratTugas: string;
    tanggalSuratTugas?: string;
    suratPemanggilan: string;
    pemanggil: string[];
    terpanggil: string[];
    agenda: string;
    tanggalAgenda: string;
    durasi: number; // in minutes
    posisiKasus: string;
    rincian: string;
    timestamp: Date;
    lokasi?: string;
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
      jenisPokokPerkara?: string;
      subPokokPerkara?: string;
      subSubPokokPerkara?: string;
      pokokPermasalahan?: string;
      keterangan?: string;
      // New fields for Penyelidikan/Pendampingan redesign
      statusPenyelidikan?: string;
      dasar?: { nomorSuratPerintah: string; tanggalSurat: string };
      pic?: { agency: string; unitSubdit: string };
      focus?: string[];
      locus?: { wilayah: string; spesifik: string };
      tempus?: { dari: string; sampai: string };
      actor?: string;
      dolus?: string;
      modus?: string;
      informasiAwal?: string;
      penyelidik?: string[];
      pihakTerpanggil?: Array<{ id: string; nama: string; jabatan: string; poinPenjelasan: string[] }>;
      pihakPemanggil?: Array<{ id: string; nama: string; jabatan: string }>;
      analisaKasus?: {
          informasiAwal?: string;
          informasiPihakTerpanggil?: Array<{ id: string; pihakId: string; keterangan: string }>;
      };
      administrasiDokumen?: Array<{ id: string; kategori: string; nomorSurat: string; tanggal: string; keterangan: string }>;
  };
  team?: TeamMember[];
  picId?: string;
  auditTrail?: AuditTrailEntry[];
}

export enum StatusPutusan {
  AKTIF = 'Aktif',
  SELESAI = 'Selesai',
}

export interface TuntutanAkhir {
    id: number;
    objek?: string;
    jenisObjekTuntutan?: string;
    jenis: string;
    jumlahNominal: number;
    satuan: string;
    keterangan: string;
}

export interface TindakLanjut {
  id: number;
  tanggal: string;
  jenisTindakLanjut?: string;
  tindakLanjut: string;
  uraian: string;
  file?: FileData;
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
    kelompokPihak?: string;
    urutan?: number;
    jenisIdentitas?: string;
}

export interface Tuntutan {
    id: number;
    objek: string;
    jenis: string;
    jumlahNominal: number;
    satuan: string;
    keterangan: string;
    jenisObjekTuntutan?: string;
}

export interface Majelis {
    id: number;
    jabatan: string;
    identitas: string;
}

export interface AnalisisPerkara {
    isuKrusial?: string;
    analisaHukum?: string;
    potensiDampak?: string;
    risiko?: 'Rendah' | 'Sedang' | 'Tinggi';
    keteranganRisiko?: string;
    analisisSementara?: string;
    kesimpulanSementara?: string;
}

export interface AbstraksiPerkara {
    tahunMasuk?: number;
    noPerkara?: string;
    tanggalPendaftaranGugatan?: string;
    wilayah?: string;
    pengadilan?: string;
    jenisPerkara?: string;
    klasifikasiPerkara?: string;
    subKlasifikasiPerkara?: string;
    subSubKlasifikasiPerkara?: string;
    jenisPokokPerkara?: string;
    subPokokPerkara?: string;
    subSubPokokPerkara?: string;
    rincianPokokPerkara?: string;
    nomorSuratKuasaKhusus?: string;
    tagsPerkara?: string[];
    unitInternal?: string;
}

export interface KehadiranPihak {
    pihakId: string;
    identitas: string;
    label: string; // e.g. PI, TI
    status: 'Hadir' | 'Tidak Hadir';
}

export interface PosisiSidangEntry {
    id: number;
    suratTugas?: string;
    tanggalSuratTugas?: string;
    agendaSidang: string;
    tanggalSidang: string;
    agendaBerikutnya?: string;
    tanggalSidangBerikutnya?: string;
    kehadiranPihak?: KehadiranPihak[];
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
    susunanMajelis?: Majelis[];
    dokumen?: string;
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
  analisisPerkara?: AnalisisPerkara;
  pihakP?: Pihak[];
  pihakT?: Pihak[];
  tuntutan?: Tuntutan[];
  tuntutanAkhir?: TuntutanAkhir[];
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
  'eAdvokasiPendampinganDetail' | 'eAdvokasiPendampinganTim' | 'eAdvokasiPendampinganPosisi' | 'eAdvokasiPendampinganDokumen' |
  'eAdvokasiPerkaraDetail' | 'eAdvokasiPerkaraEdit' | 'eAdvokasiPerkaraUpdatePosisi' | 'eAdvokasiPerkaraTim' | 'eAdvokasiAgendaBerikutnya' | 'eAdvokasiPerkaraDokumen' |
  'eAdvokasiPenangananPutusan' | 'eAdvokasiPutusanDetail' | 'eAdvokasiPutusanEdit' | 'eAdvokasiPutusanUpdateTindakLanjut' | 'eAdvokasiPutusanTim' | 'eAdvokasiPutusanDokumen';
