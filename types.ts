
export enum StatusPermohonan {
  DRAFT = 'Draft',
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

export interface Permohonan {
  id: string;
  pemohon: string;
  jenis: 'Penanganan Perkara' | 'Pendampingan';
  perihal: string;
  uraian: string;
  files: FileData[];
  status: StatusPermohonan;
  tanggal: string;
  unit: string;
  history: Riwayat[];
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
}
