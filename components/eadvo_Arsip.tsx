// ─────────────────────────────────────────────────────────────
//  Arsip.tsx – Modul Arsiparis (e-Advokasi) – Redesain Final
// ─────────────────────────────────────────────────────────────
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  SearchIcon,
  FileTextIcon,
  XIcon,
  EyeIcon,
  PencilIcon,
  BookOpenIcon,
  RefreshIcon,
  PrintIcon,
} from './icons';
import { useAdvokasiStore } from '../useAdvokasiStore';
import {
  View,
  PerkaraRecord,
  StatusPerkara,
  StatusPermohonan,
  JenisPermohonan,
} from '../types';
import DetailPerkara from './eadvo_DetailPerkara';
import Breadcrumb from './Breadcrumb';
import Pagination from './Pagination';
import { ALL_PERSONNEL } from './AssignTeamModal';

/* ═══════════════════════════ CONSTANTS ═══════════════════════════ */

const LOKASI_OPTIONS = [
  'Daftar Arsip I (Basement Dhanapala)',
  'Daftar Arsip II (Basement Dhanapala)',
  'Daftar Arsip III A dan B',
  'Daftar Arsip IV (Ruang Arsip Ciledug)',
  'Daftar Arsip V (Ruang Arsip Ciledug)',
  'Daftar Arsip Konvensional (Djuanda I Lantai 15)',
] as const;

const KLASIFIKASI_OPTIONS = [
  'HK2.0 - Penanganan Perkara dan Pendampingan',
  'HK2.1 - Penelitian dan Analisis',
  'HK2.2 - Penyusunan Hukum',
  'HK2.3 - Pengawasan dan Pengendalian',
] as const;

const KLASIFIKASI_DEFAULT = KLASIFIKASI_OPTIONS[0];

/* ═══════════════════════════ TYPES ═══════════════════════════ */

interface Peminjaman {
  id: string;
  peminjam: string;
  jabatan?: string;
  tanggalPinjam: string;
  tanggalKembali?: string;
  keterangan: string;
}

interface ArsipData {
  arsipId: string;
  kodeKlasifikasi: string;
  nomorPerkara: string;
  uraianBerkas: string;
  tahunMasuk: number;
  tahunSelesai: number;
  jumlahBerkas: string;
  lokasi: string;
  boksFolder: string;
  keterangan: string;
  tanggalTerarsip?: string;
}

type StatusArsip = 'Menunggu' | 'Terarsip' | 'Dipinjam';

interface ArsipRecord {
  id: string;
  nomorPerkara: string;
  jenisPerkara: string;
  tahunMasuk: number;
  pengadilan?: string;
  wilayah?: string;
  pihakP?: string;
  pihakT?: string;
  pokokPerkara?: string;
  unitBerperkara?: string;
  statusPerkara?: 'Aktif' | 'Selesai';
  arsip?: ArsipData;
  status: StatusArsip;
  peminjaman: Peminjaman[];
}

type FilterTab = 'Semua' | 'Menunggu' | 'Terarsip' | 'Dipinjam';

/* ═══════════════════════════ HELPERS ═══════════════════════════ */

const genArsipId = (seq: number): string => {
  const year = new Date().getFullYear();
  return `ARS-${year}-${String(seq).padStart(6, '0')}`;
};

const addDays = (iso: string, days: number): string => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const today = (): string => new Date().toISOString().split('T')[0];

/* ═══════════════════════════ SEED DATA ═══════════════════════════ */

const SEED: ArsipRecord[] = [
  {
    id: '1',
    nomorPerkara: '276/Pdt.G/2017/PN.Jkt.Pst',
    jenisPerkara: 'Perdata',
    tahunMasuk: 2017,
    pengadilan: 'PN Jakarta Pusat',
    wilayah: 'DKI Jakarta',
    pihakP: 'PT ABC',
    pihakT: 'Kementerian Keuangan',
    pokokPerkara: 'Perbuatan Melawan Hukum',
    unitBerperkara: 'Direktorat Jenderal Pajak',
    statusPerkara: 'Selesai',
    status: 'Menunggu',
    peminjaman: [],
  },
  {
    id: '2',
    nomorPerkara: '46/Pdt.G/2017/PN.Skh',
    jenisPerkara: 'Perdata',
    tahunMasuk: 2017,
    pengadilan: 'PN Sukoharjo',
    wilayah: 'Jawa Tengah',
    pihakP: 'Budi Utomo',
    pihakT: 'KPP Pratama Sukoharjo',
    pokokPerkara: 'Perbuatan Melawan Hukum',
    unitBerperkara: 'Direktorat Jenderal Pajak',
    statusPerkara: 'Selesai',
    status: 'Menunggu',
    peminjaman: [],
  },
  {
    id: '3',
    nomorPerkara: '491/Pdt.G/2017/PN.Smg',
    jenisPerkara: 'Perdata',
    tahunMasuk: 2017,
    pengadilan: 'PN Semarang',
    wilayah: 'Jawa Tengah',
    pihakP: 'Siti Aminah',
    pihakT: 'Kanwil DJP Jawa Tengah I',
    pokokPerkara: 'Perbuatan Melawan Hukum',
    unitBerperkara: 'Direktorat Jenderal Pajak',
    statusPerkara: 'Selesai',
    status: 'Menunggu',
    peminjaman: [],
  },
  {
    id: '4',
    nomorPerkara: '371/PDT.G/2017/PN.BDG',
    jenisPerkara: 'Perbuatan Melawan Hukum',
    tahunMasuk: 2017,
    pengadilan: 'PN Bandung',
    wilayah: 'Jawa Barat',
    pihakP: 'Wawan Hermawan',
    pihakT: 'KPTIK BMN Bandung',
    pokokPerkara: 'Perbuatan Melawan Hukum',
    unitBerperkara: 'Direktorat Jenderal Pajak',
    statusPerkara: 'Selesai',
    status: 'Menunggu',
    peminjaman: [],
  },
  {
    id: '5',
    nomorPerkara: '123/Pdt.G/2023/PN.Jkt.Sel',
    jenisPerkara: 'Perdata',
    tahunMasuk: 2023,
    pengadilan: 'PN Jakarta Selatan',
    wilayah: 'DKI Jakarta',
    pihakP: 'PT Sinar Makmur',
    pihakT: 'Kementerian Keuangan',
    pokokPerkara: 'Perbuatan Melawan Hukum',
    unitBerperkara: 'Direktorat Jenderal Pajak',
    statusPerkara: 'Selesai',
    status: 'Menunggu',
    peminjaman: [],
  },
  {
    id: '6',
    nomorPerkara: '45/TUN/2023/PTUN.Jkt',
    jenisPerkara: 'Tata Usaha Negara',
    tahunMasuk: 2023,
    pengadilan: 'PTUN Jakarta',
    wilayah: 'DKI Jakarta',
    pihakP: 'Bambang S',
    pihakT: 'Kementerian Keuangan',
    pokokPerkara: 'Perbuatan Melawan Hukum',
    unitBerperkara: 'Direktorat Jenderal Pajak',
    statusPerkara: 'Selesai',
    status: 'Menunggu',
    peminjaman: [],
  },
  {
    id: '7',
    nomorPerkara: '16/Pdt.G/2017/PN.Tlg',
    jenisPerkara: 'Perdata',
    tahunMasuk: 2017,
    pengadilan: 'PN Tulungagung',
    wilayah: 'Jawa Timur',
    pihakP: 'Andi Rianto',
    pihakT: 'KPP Pratama Tulungagung',
    pokokPerkara: 'Perbuatan Melawan Hukum',
    unitBerperkara: 'Direktorat Jenderal Pajak',
    statusPerkara: 'Selesai',
    status: 'Terarsip',
    peminjaman: [],
    arsip: {
      arsipId: 'ARS-2025-000001',
      kodeKlasifikasi: KLASIFIKASI_DEFAULT,
      nomorPerkara: '16/Pdt.G/2017/PN.Tlg',
      uraianBerkas: 'Putusan, BAH, Bukti Surat',
      tahunMasuk: 2017,
      tahunSelesai: 2018,
      jumlahBerkas: '3',
      lokasi: LOKASI_OPTIONS[0],
      boksFolder: 'B02-F04',
      keterangan: '',
      tanggalTerarsip: '2025-05-10',
    },
  },
  {
    id: '8',
    nomorPerkara: '16/PDT.G/2014/PN.GS',
    jenisPerkara: 'Perdata',
    tahunMasuk: 2014,
    pengadilan: 'PN Gresik',
    wilayah: 'Jawa Timur',
    pihakP: 'Sri Wahyuni',
    pihakT: 'KPP Pratama Gresik',
    pokokPerkara: 'Perbuatan Melawan Hukum',
    unitBerperkara: 'Direktorat Jenderal Pajak',
    statusPerkara: 'Selesai',
    status: 'Dipinjam',
    peminjaman: [
      {
        id: 'p1',
        peminjam: 'Andi Wijaya',
        jabatan: 'Advokat',
        tanggalPinjam: '2025-06-01',
        keterangan: 'Referensi perkara baru',
      },
    ],
    arsip: {
      arsipId: 'ARS-2025-000002',
      kodeKlasifikasi: KLASIFIKASI_DEFAULT,
      nomorPerkara: '16/PDT.G/2014/PN.GS',
      uraianBerkas: 'Putusan, Bukti, Surat Kuasa',
      tahunMasuk: 2014,
      tahunSelesai: 2015,
      jumlahBerkas: '2',
      lokasi: LOKASI_OPTIONS[3],
      boksFolder: 'B01-F12',
      keterangan: 'Sudah divalidasi',
      tanggalTerarsip: '2025-05-15',
    },
  },
];

/* ═══════════════════════════ SUB-COMPONENTS ═══════════════════════════ */

/* ── Reusable Form Row ── */
const FieldRow: React.FC<{
  label: string;
  required?: boolean;
  align?: 'center' | 'start';
  children: React.ReactNode;
}> = ({ label, required, align = 'center', children }) => (
  <div
    className={`grid grid-cols-[180px_1fr] gap-4 ${
      align === 'start' ? 'items-start' : 'items-center'
    }`}
  >
    <label className="text-sm font-bold text-gray-600 text-right">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div>{children}</div>
  </div>
);

/* ── Reusable Detail Row ── */
const DetailField: React.FC<{
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div className="border-b border-gray-100 pb-2">
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
      {label}
    </div>
    <div className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>
      {value}
    </div>
  </div>
);

/* ── Context Info Bar ── */
const InfoBar: React.FC<{
  record: ArsipRecord;
  onViewInfo?: () => void;
}> = ({ record, onViewInfo }) => (
  <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3.5 flex justify-between items-center text-xs shadow-xs">
    <div className="grid grid-cols-3 gap-x-4 gap-y-2 flex-1">
      <div>
        <span className="text-gray-400 font-semibold uppercase">Nomor Perkara</span>
        <div className="font-bold text-gray-800 font-mono text-xs">{record.nomorPerkara}</div>
      </div>
      <div>
        <span className="text-gray-400 font-semibold uppercase">Jenis</span>
        <div className="font-bold text-gray-800">{record.jenisPerkara}</div>
      </div>
      <div>
        <span className="text-gray-400 font-semibold uppercase">Pengadilan</span>
        <div className="font-bold text-gray-800">{record.pengadilan || '-'}</div>
      </div>
      <div>
        <span className="text-gray-400 font-semibold uppercase">Penggugat</span>
        <div className="font-bold text-gray-800 truncate" title={record.pihakP}>{record.pihakP || '-'}</div>
      </div>
      <div>
        <span className="text-gray-400 font-semibold uppercase">Tergugat</span>
        <div className="font-bold text-gray-800 truncate" title={record.pihakT}>{record.pihakT || '-'}</div>
      </div>
      <div>
        <span className="text-gray-400 font-semibold uppercase">Wilayah</span>
        <div className="font-bold text-gray-800">{record.wilayah || '-'}</div>
      </div>
    </div>
    {onViewInfo && (
      <button
        type="button"
        id="btn-detail-perkara-infobar"
        onClick={onViewInfo}
        className="ml-4 flex items-center justify-center px-3.5 py-2 bg-white border border-blue-400 text-blue-700 rounded-md shadow-xs hover:bg-blue-50 hover:border-blue-500 active:scale-95 font-semibold text-xs whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        title="Buka Rincian Lengkap Perkara"
      >
        <EyeIcon className="w-4 h-4 mr-1.5 text-blue-600 flex-shrink-0" />
        Detail Perkara
      </button>
    )}
  </div>
);

/* ── Status Badge ── */
const StatusBadge: React.FC<{ status: StatusArsip }> = ({ status }) => (
  <span
    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
      status === 'Terarsip'
        ? 'bg-green-100 text-green-700'
        : status === 'Dipinjam'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-gray-100 text-gray-500'
    }`}
  >
    {status}
  </span>
);

/* ═══════════════════════════ ARSIP FORM MODAL ═══════════════════════════ */

const ArsipFormModal: React.FC<{
  record: ArsipRecord;
  onViewInfo?: () => void;
  seq: number;
  onClose: () => void;
  onSave: (data: ArsipData) => void;
}> = ({ record, onViewInfo, seq, onClose, onSave }) => {
  const isEdit = !!record.arsip;
  const ex = record.arsip;

  const [form, setForm] = useState({
    arsipId: ex?.arsipId || genArsipId(seq),
    kodeKlasifikasi: ex?.kodeKlasifikasi || KLASIFIKASI_DEFAULT,
    nomorPerkara: record.nomorPerkara,
    uraianBerkas: ex?.uraianBerkas || '',
    tahunMasuk: record.tahunMasuk,
    tahunSelesai: (ex?.tahunSelesai || record.tahunMasuk).toString(),
    jumlahBerkas: ex?.jumlahBerkas || '1',
    lokasi: ex?.lokasi || LOKASI_OPTIONS[0],
    boksFolder: ex?.boksFolder || '',
    keterangan: ex?.keterangan || '',
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      tahunMasuk: form.tahunMasuk,
      tahunSelesai: parseInt(form.tahunSelesai) || 0,
      tanggalTerarsip: ex?.tanggalTerarsip || today(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-300">

        {/* Header */}
        <div className="bg-[#f5f5f5] px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">■</span>
            {isEdit ? 'Edit Arsip' : 'Arsipkan Perkara'}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 overflow-y-auto max-h-[72vh]">

            {/* Context */}
            <InfoBar record={record} onViewInfo={onViewInfo} />

            {/* 1. Arsip ID */}
            <FieldRow label="Arsip ID">
              <input
                readOnly
                value={form.arsipId}
                className="w-full p-2.5 border border-gray-200 rounded bg-gray-50 text-sm text-gray-500 font-mono"
              />
            </FieldRow>

            {/* 2. Kode Klasifikasi */}
            <FieldRow label="Kode Klasifikasi Arsip" required>
              <select
                value={form.kodeKlasifikasi}
                onChange={(e) => set('kodeKlasifikasi', e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {KLASIFIKASI_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </FieldRow>

            {/* 3. Nomor Perkara */}
            <FieldRow label="Nomor Perkara" required>
              <input
                readOnly
                value={form.nomorPerkara}
                className="w-full p-2.5 border border-gray-200 rounded bg-gray-50 text-sm text-gray-600 font-medium"
              />
            </FieldRow>

            {/* 4. Uraian Berkas */}
            <FieldRow label="Uraian Berkas / Informasi" required>
              <input
                required
                type="text"
                placeholder="Contoh: Putusan, BAH, Bukti, Surat Kuasa"
                value={form.uraianBerkas}
                onChange={(e) => set('uraianBerkas', e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </FieldRow>

            {/* 5. Kurun Waktu */}
            <FieldRow label="Kurun Waktu" required>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  type="number"
                  min={1900}
                  max={2100}
                  value={form.tahunMasuk}
                  className="w-24 p-2.5 border border-gray-200 rounded bg-gray-50 text-sm text-gray-500 text-center font-mono"
                  title="Otomatis dari data perkara"
                />
                <span className="text-gray-400 text-sm font-medium whitespace-nowrap">s.d.</span>
                <input
                  required
                  type="number"
                  min={1900}
                  max={2100}
                  value={form.tahunSelesai}
                  onChange={(e) => set('tahunSelesai', e.target.value)}
                  className="w-24 p-2.5 border border-gray-300 rounded text-sm text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tahun"
                />
              </div>
            </FieldRow>

            {/* 6. Jumlah Berkas */}
            <FieldRow label="Jumlah Berkas" required>
              <input
                required
                type="text"
                placeholder="Contoh: 3 / 12 / 1 dus"
                value={form.jumlahBerkas}
                onChange={(e) => set('jumlahBerkas', e.target.value)}
                className="w-32 p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </FieldRow>

            {/* 7. Lokasi */}
            <FieldRow label="Lokasi" required>
              <select
                required
                value={form.lokasi}
                onChange={(e) => set('lokasi', e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {LOKASI_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </FieldRow>

            {/* 8. Boks & Folder */}
            <FieldRow label="Boks dan Folder" required>
              <input
                required
                type="text"
                placeholder="Contoh: B03 - F12"
                value={form.boksFolder}
                onChange={(e) => set('boksFolder', e.target.value)}
                className="w-48 p-2.5 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </FieldRow>

            {/* 9. Keterangan */}
            <FieldRow label="Keterangan / Catatan" align="start">
              <textarea
                rows={3}
                placeholder="Catatan tambahan (opsional)"
                value={form.keterangan}
                onChange={(e) => set('keterangan', e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </FieldRow>
          </div>

          {/* Footer */}
          <div className="bg-[#f5f5f5] px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500 italic">
              Field bertanda <span className="text-red-500 font-bold">*</span> wajib diisi
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 active:scale-95 transition-colors shadow-sm"
              >
                {isEdit ? 'Simpan Perubahan' : 'Arsipkan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════ DETAIL / RIWAYAT MODAL ═══════════════════════════ */

const DetailModal: React.FC<{
  archive: ArsipRecord;
  onClose: () => void;
  onReturn?: () => void;
  onViewInfo?: () => void;
}> = ({ archive, onClose, onReturn, onViewInfo }) => {
  const a = archive.arsip;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-300">

        {/* Header */}
        <div className="bg-[#f5f5f5] px-6 py-3 border-b border-gray-200 flex justify-between items-center print:hidden">
          <span className="font-bold text-gray-800">
            ■ Detail Arsip: {archive.nomorPerkara}
          </span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center hover:bg-blue-700 transition-colors"
            >
              <PrintIcon className="h-4 w-4 mr-1.5" /> Resume
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 border border-gray-300 p-1 rounded bg-white"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-5 print:max-h-none print:overflow-visible">

          {/* Context */}
          <InfoBar record={archive} onViewInfo={onViewInfo} />

          {/* Arsip Data */}
          {a && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <DetailField label="Arsip ID" value={a.arsipId} mono />
              <DetailField label="Kode Klasifikasi" value={a.kodeKlasifikasi} />
              <DetailField label="Nomor Perkara" value={a.nomorPerkara} mono />
              <DetailField label="Uraian Berkas" value={a.uraianBerkas} />
              <DetailField
                label="Kurun Waktu"
                value={`${a.tahunMasuk} – ${a.tahunSelesai}`}
              />
              <DetailField label="Jumlah Berkas" value={a.jumlahBerkas} />
              <DetailField label="Lokasi" value={a.lokasi} />
              <DetailField label="Boks & Folder" value={a.boksFolder} mono />
              <DetailField label="Status" value={<StatusBadge status={archive.status} />} />
              {a.keterangan && (
                <div className="col-span-2">
                  <DetailField label="Keterangan / Catatan" value={a.keterangan} />
                </div>
              )}
            </div>
          )}

          {/* Riwayat Peminjaman */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 border-b border-gray-200 pb-2 mb-3">
              Riwayat Peminjaman
            </h4>
            {archive.peminjaman.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Peminjam', 'Tgl Pinjam', 'Tgl Kembali', 'Keterangan', 'Aksi'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {archive.peminjaman.map((p) => (
                    <tr key={p.id}>
                      <td className="px-3 py-2 font-medium">
                        {p.peminjam}
                        {p.jabatan && (
                          <div className="text-xs text-gray-400">{p.jabatan}</div>
                        )}
                      </td>
                      <td className="px-3 py-2">{p.tanggalPinjam}</td>
                      <td className="px-3 py-2">
                        {p.tanggalKembali ? (
                          p.tanggalKembali
                        ) : (
                          <span className="text-amber-600 font-bold">
                            ⏳ {addDays(p.tanggalPinjam, 14)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">{p.keterangan || '-'}</td>
                      <td className="px-3 py-2">
                        {!p.tanggalKembali && onReturn ? (
                          <button
                            onClick={onReturn}
                            className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded hover:bg-green-200 uppercase"
                          >
                            Kembalikan
                          </button>
                        ) : p.tanggalKembali ? (
                          <span className="text-[10px] text-gray-400 italic">Selesai</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-400 italic py-2">
                Belum ada peminjaman.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f5f5f5] px-6 py-3 border-t border-gray-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white text-sm font-bold rounded hover:bg-gray-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Map ArsipRecord to rich PerkaraRecord for DetailPerkara ── */
const getPerkaraRecordForArsip = (
  arsip: ArsipRecord,
  storeRecords: PerkaraRecord[]
): PerkaraRecord => {
  const existing = storeRecords.find(
    (p) =>
      (p.abstraksiPerkara?.noPerkara &&
        p.abstraksiPerkara.noPerkara.trim().toLowerCase() ===
          arsip.nomorPerkara.trim().toLowerCase()) ||
      (p.Nomor &&
        p.Nomor.trim().toLowerCase() ===
          arsip.nomorPerkara.trim().toLowerCase()) ||
      p.id === arsip.id
  );

  if (existing) {
    return existing;
  }

  const tahun = arsip.tahunMasuk || 2021;
  const tahunSelesai = arsip.arsip?.tahunSelesai || tahun + 1;
  const isPajak = (arsip.unitBerperkara || '').toLowerCase().includes('pajak');
  const isBeaCukai =
    (arsip.unitBerperkara || '').toLowerCase().includes('cukai') ||
    (arsip.unitBerperkara || '').toLowerCase().includes('kepabeanan');
  const unitName = arsip.unitBerperkara || 'Direktorat Jenderal Pajak';

  return {
    id: arsip.id,
    Nomor: arsip.nomorPerkara,
    pemohon: unitName,
    unit: unitName,
    tanggal: `15/03/${tahun}`,
    jenis: JenisPermohonan.PENANGANAN_PERKARA,
    perihal: `${arsip.jenisPerkara} - ${arsip.pokokPerkara || 'Sengketa Hukum'} (${arsip.nomorPerkara})`,
    uraian: `Perkara ${arsip.jenisPerkara} mengenai ${arsip.pokokPerkara || 'Sengketa Hukum'} antara ${arsip.pihakP} sebagai Penggugat melawan ${arsip.pihakT} sebagai Tergugat pada ${arsip.pengadilan}.`,
    files: [
      {
        name: `Relaas_Panggilan_${arsip.nomorPerkara.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`,
        size: 245120,
        type: 'application/pdf',
      },
      {
        name: `Gugatan_${arsip.nomorPerkara.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`,
        size: 512040,
        type: 'application/pdf',
      },
    ],
    status: StatusPermohonan.SELESAI,
    history: [
      {
        id: 1,
        author: 'Administrator',
        message: 'Menyelesaikan Penanganan Perkara dan menyerahkan berkas ke Arsiparis',
        files: [],
        timestamp: new Date(`${tahunSelesai}-12-20T10:00:00Z`),
      },
    ],
    statusPerkara:
      arsip.statusPerkara === 'Aktif'
        ? StatusPerkara.AKTIF
        : StatusPerkara.SELESAI,
    abstraksiPerkara: {
      tahunMasuk: tahun,
      noPerkara: arsip.nomorPerkara,
      tanggalPendaftaranGugatan: `${tahun}-03-15`,
      wilayah: arsip.wilayah || 'DKI Jakarta',
      pengadilan: arsip.pengadilan || 'Pengadilan Negeri',
      jenisPerkara: arsip.jenisPerkara,
      jenisPokokPerkara:
        arsip.pokokPerkara ||
        (isPajak
          ? 'Perpajakan'
          : isBeaCukai
          ? 'Kepabeanan dan Cukai'
          : 'Perbuatan Melawan Hukum'),
      subPokokPerkara: isPajak
        ? 'Sengketa Surat Ketetapan Pajak'
        : 'Sengketa Tindakan Administrasi Pemerintahan',
      subSubPokokPerkara: isPajak
        ? 'Gugatan Pelaksanaan Penagihan Pajak'
        : 'Tuntutan Ganti Kerugian / Pembatalan Keputusan',
      rincianPokokPerkara: `Gugatan ${arsip.pokokPerkara || 'Perbuatan Melawan Hukum'} oleh ${arsip.pihakP} terhadap keputusan atau tindakan ${arsip.pihakT} (${unitName}).`,
      nomorSuratKuasaKhusus: `SKU-${tahun}/ADV/KEMENKEU`,
      tagsPerkara: [
        arsip.jenisPerkara,
        arsip.statusPerkara || 'Selesai',
        arsip.wilayah || 'DKI Jakarta',
        'Berkas Arsip',
      ].filter(Boolean),
    },
    pihakP: [
      {
        id: 'P1',
        noUrut: 'P1',
        pihak: 'Penggugat / Pemohon',
        identitas: arsip.pihakP || 'Penggugat',
        keterangan: 'Pihak Penggugat Utama',
        unitBerperkara: 'Tidak',
      },
    ],
    pihakT: [
      {
        id: 'T1',
        noUrut: 'T1',
        pihak: 'Tergugat / Termohon',
        identitas: arsip.pihakT || 'Kementerian Keuangan RI',
        keterangan: unitName,
        unitBerperkara: 'Ya',
      },
    ],
    tuntutan: [
      {
        id: 1,
        objek: 'Ganti Rugi Materiil',
        jenis: 'Materiil',
        jumlahNominal: 500000000,
        satuan: 'IDR',
        keterangan: 'Tuntutan ganti rugi materiil oleh Penggugat',
      },
      {
        id: 2,
        objek: 'Ganti Rugi Immateriil',
        jenis: 'Immateriil',
        jumlahNominal: 1000000000,
        satuan: 'IDR',
        keterangan: 'Tuntutan ganti rugi immateriil',
      },
    ],
    analisisPerkara: {
      isuKrusial: `Legalitas wewenang dan kepatuhan prosedur administratif dan operasional pada ${unitName}.`,
      analisaHukum: `Tindakan Tergugat telah mengacu secara ketat pada ketentuan perundang-undangan perpajakan/keuangan negara serta mematuhi Asas-Asas Umum Pemerintahan yang Baik (AUPB).`,
      potensiDampak: `Potensi berkurangnya penerimaan keuangan negara atau preseden hukum bagi kasus serupa apabila gugatan dikabulkan.`,
      risiko: 'Sedang',
      keteranganRisiko: 'Risiko dapat dimitigasi dengan pembuktian formil dan dokumen penagihan/penetapan yang sah.',
      analisisSementara: 'Peluang Kemenkeu memenangkan perkara tinggi dengan kelengkapan bukti surat dan dasar hukum yang kokoh.',
      kesimpulanSementara: 'Mengajukan eksepsi dan jawaban gugatan dengan memohon Majelis Hakim menolak seluruh gugatan Penggugat.',
    },
    posisiSidang: {
      tkPertama: [
        {
          id: 1,
          suratTugas: `ST-01/ADV/${tahun}`,
          tanggalSuratTugas: `${tahun}-03-22`,
          agendaSidang: 'Sidang Pertama (Pemeriksaan Legalitas Para Pihak)',
          tanggalSidang: `${tahun}-04-05`,
          agendaBerikutnya: 'Mediasi',
          tanggalSidangBerikutnya: `${tahun}-04-19`,
          kehadiranPihak: [{ pihakId: 'T1', identitas: unitName, label: 'Tergugat', status: 'Hadir' }],
        },
        {
          id: 2,
          suratTugas: `ST-02/ADV/${tahun}`,
          tanggalSuratTugas: `${tahun}-04-15`,
          agendaSidang: 'Proses Mediasi',
          tanggalSidang: `${tahun}-04-19`,
          agendaBerikutnya: 'Pembacaan Gugatan & Jawaban',
          tanggalSidangBerikutnya: `${tahun}-05-10`,
          kehadiranPihak: [{ pihakId: 'T1', identitas: unitName, label: 'Tergugat', status: 'Hadir' }],
        },
        {
          id: 3,
          suratTugas: `ST-03/ADV/${tahun}`,
          tanggalSuratTugas: `${tahun}-05-02`,
          agendaSidang: 'Jawaban dan Eksepsi Tergugat',
          tanggalSidang: `${tahun}-05-10`,
          agendaBerikutnya: 'Replik Penggugat',
          tanggalSidangBerikutnya: `${tahun}-05-24`,
          kehadiranPihak: [{ pihakId: 'T1', identitas: unitName, label: 'Tergugat', status: 'Hadir' }],
        },
        {
          id: 4,
          suratTugas: `ST-04/ADV/${tahun}`,
          tanggalSuratTugas: `${tahun}-06-01`,
          agendaSidang: 'Pembuktian Surat Para Pihak',
          tanggalSidang: `${tahun}-06-15`,
          agendaBerikutnya: 'Kesimpulan dan Putusan Akhir',
          tanggalSidangBerikutnya: `${tahun}-08-20`,
          kehadiranPihak: [{ pihakId: 'T1', identitas: unitName, label: 'Tergugat', status: 'Hadir' }],
        },
      ],
      tkBanding: [],
      tkKasasi: [],
      tkPK: [],
    },
    putusan: [
      {
        id: 1,
        nomor: arsip.nomorPerkara,
        tanggal: `${tahunSelesai}-10-18`,
        amar: 'MENGADILI: 1. Menolak Gugatan Penggugat untuk seluruhnya; 2. Menghukum Penggugat untuk membayar seluruh biaya perkara yang timbul.',
        status: 'Menang',
        pertimbanganHakim: `Menimbang bahwa Tergugat (${arsip.pihakT}) telah menerbitkan keputusan/tindakan administratif sesuai dengan kewenangan, prosedur, dan substansi ketentuan peraturan perundang-undangan yang sah, serta tidak terbukti melakukan Perbuatan Melawan Hukum (PMH). Oleh karena itu dalil gugatan Penggugat tidak beralasan hukum dan harus ditolak.`,
        keterangan: 'Putusan telah Berkekuatan Hukum Tetap (Inkracht). Berkas telah selesai dan dialihkan ke Unit Kearsipan Biro Advokasi.',
        posisi: 'Pertama',
        susunanMajelis: [
          { id: 1, jabatan: 'Ketua Majelis Hakim', identitas: 'Dr. H. Bambang Sutrisno, S.H., M.H.' },
          { id: 2, jabatan: 'Hakim Anggota I', identitas: 'Siti Rahmawati, S.H., M.Hum.' },
          { id: 3, jabatan: 'Hakim Anggota II', identitas: 'Agus Purnomo, S.H., M.H.' },
          { id: 4, jabatan: 'Panitera Pengganti', identitas: 'Deddy Kurniawan, S.H.' },
        ],
        dokumen: `Salinan_Putusan_${arsip.nomorPerkara.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`,
      },
    ],
    dokumenLitigasi: [
      {
        id: 1,
        noNaskah: `SKU-${tahun}/ADV/KEMENKEU`,
        jenis: 'Surat Kuasa Khusus',
        deskripsi: 'Surat Kuasa Khusus Menteri Keuangan kepada Tim Advokat Kemenkeu',
        timestamp: `${tahun}-03-20`,
      },
      {
        id: 2,
        noNaskah: `JAW-${tahun}/ADV/01`,
        jenis: 'Jawaban dan Eksepsi',
        deskripsi: 'Nota Jawaban Tergugat atas Gugatan Perkara Nomor ' + arsip.nomorPerkara,
        timestamp: `${tahun}-05-08`,
      },
      {
        id: 3,
        noNaskah: `PUT-${arsip.nomorPerkara.replace(/[^a-zA-Z0-9]/g, '-')}`,
        jenis: 'Salinan Putusan',
        deskripsi: 'Salinan Resmi Putusan Pengadilan Tingkat Pertama Berkekuatan Hukum Tetap',
        timestamp: `${tahunSelesai}-10-25`,
      },
      {
        id: 4,
        noNaskah: `BA-ARSIP/${tahunSelesai}/${arsip.id}`,
        jenis: 'Berita Acara Penyerahan Berkas',
        deskripsi: 'Berita Acara Pengarsipan Berkas Perkara Inaktif ke Biro Advokasi',
        timestamp: `${tahunSelesai}-12-05`,
      },
    ],
    team: [
      {
        id: 'tm-1',
        nama: 'Dhian Fajar Suryawan',
        nip: '198203152005011002',
        unit: 'Biro Advokasi - Sekretariat Jenderal',
        role: 'Advokat Ahli Madya',
        teamRole: 'PIC',
      },
      {
        id: 'tm-2',
        nama: 'Made Gde Satria Bela',
        nip: '198705122010121001',
        unit: 'Biro Advokasi - Sekretariat Jenderal',
        role: 'Advokat Ahli Pertama',
        teamRole: 'Editor',
      },
      {
        id: 'tm-3',
        nama: 'Arlina Haryuningsih',
        nip: '198908222014022001',
        unit: 'Biro Advokasi - Sekretariat Jenderal',
        role: 'Analis Hukum',
        teamRole: 'Viewer',
      },
    ],
    auditTrail: [
      {
        id: 1,
        timestamp: new Date(`${tahun}-03-15T09:00:00Z`),
        user: 'Dhian Fajar Suryawan',
        action: 'Mendaftarkan perkara baru',
        details: `Perkara nomor ${arsip.nomorPerkara} didaftarkan ke sistem e-Advokasi`,
      },
      {
        id: 2,
        timestamp: new Date(`${tahun}-05-10T11:30:00Z`),
        user: 'Made Gde Satria Bela',
        action: 'Mengunggah dokumen',
        details: 'Mengunggah Jawaban dan Eksepsi Tergugat',
      },
      {
        id: 3,
        timestamp: new Date(`${tahunSelesai}-10-25T14:15:00Z`),
        user: 'Dhian Fajar Suryawan',
        action: 'Memperbarui status putusan',
        details: 'Perkara dinyatakan Menang (Inkracht) dan selesai',
      },
      {
        id: 4,
        timestamp: new Date(`${tahunSelesai}-12-05T10:00:00Z`),
        user: 'Arsiparis Biro Advokasi',
        action: 'Menyimpan berkas arsip',
        details: arsip.arsip
          ? `Disimpan di ${arsip.arsip.lokasi} - ${arsip.arsip.boksFolder}`
          : 'Berkas masuk ke daftar tunggu arsip',
      },
    ],
  };
};

const PerkaraInfoModal: React.FC<{
  record: ArsipRecord;
  onClose: () => void;
  onNavigate: (view: View, record?: PerkaraRecord) => void;
}> = ({ record, onClose, onNavigate }) => {
  const { perkaraRecords } = useAdvokasiStore();
  const perkaraRecord = useMemo(
    () => getPerkaraRecordForArsip(record, perkaraRecords),
    [record, perkaraRecords]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      id="modal-detail-perkara-arsip"
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-2 sm:p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden border border-gray-300 relative">
        <div className="flex-1 h-full overflow-hidden">
          <DetailPerkara
            record={perkaraRecord}
            onBack={onClose}
            onNavigate={(view, r) => {
              onClose();
              onNavigate(view, r);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const BorrowFormModal: React.FC<{
  record: ArsipRecord;
  onClose: () => void;
  onSave: (peminjam: string, tanggalPinjam: string, keterangan: string) => void;
  isPegawai: boolean;
  userName: string;
}> = ({ record, onClose, onSave, isPegawai, userName }) => {
  const [peminjam, setPeminjam] = useState(isPegawai ? userName : '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [tanggalPinjam, setTanggalPinjam] = useState(today());
  const [keterangan, setKeterangan] = useState('');

  const filteredPersonnel = useMemo(() => {
    if (!peminjam) return ALL_PERSONNEL;
    return ALL_PERSONNEL.filter(p => p.name.toLowerCase().includes(peminjam.toLowerCase()));
  }, [peminjam]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#f5f5f5] px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-black text-gray-800">Form Peminjaman</h2>
          <p className="text-sm text-gray-500 font-medium">Arsip Perkara: {record.nomorPerkara}</p>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Peminjam</label>
            {isPegawai ? (
              <input
                type="text"
                value={peminjam}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded font-bold text-gray-800 focus:outline-none"
              />
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={peminjam}
                  onChange={(e) => {
                    setPeminjam(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setShowDropdown(false)}
                  placeholder="Cari dan pilih nama pegawai..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredPersonnel.length > 0 ? (
                      filteredPersonnel.map((person) => (
                        <div
                          key={person.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setPeminjam(person.name);
                            setShowDropdown(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
                        >
                          <div className="font-bold text-gray-800 text-sm">{person.name}</div>
                          <div className="text-xs text-gray-500">{person.eselon2}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500 text-center">Tidak ada pegawai ditemukan</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Pinjam</label>
            <input
              type="date"
              value={tanggalPinjam}
              onChange={(e) => setTanggalPinjam(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Keterangan</label>
            <textarea
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
              placeholder="Masukkan keterangan peminjaman..."
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-[#f5f5f5] px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(peminjam, tanggalPinjam, keterangan)}
            disabled={!peminjam || !tanggalPinjam}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pinjam
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */

interface ArsipProps {
  onNavigate: (view: View, record?: any) => void;
}

const Arsip: React.FC<ArsipProps> = ({ onNavigate }) => {
  const { globalRole, userName } = useAdvokasiStore();
  const isPegawai = globalRole === 'Pegawai';
  const isArsiparis = !isPegawai;

  /* ── Single Source of Truth ── */
  const [arsip, setArsip] = useState<ArsipRecord[]>(SEED);

  /* ── UI State ── */
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('Semua');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  /* ── Modal State ── */
  const [archiveModal, setArchiveModal] = useState<ArsipRecord | null>(null);
  const [detailModal, setDetailModal] = useState<ArsipRecord | null>(null);
  const [infoModal, setInfoModal] = useState<ArsipRecord | null>(null);
  const [borrowModal, setBorrowModal] = useState<ArsipRecord | null>(null);

  /* ── Derived Data ── */
  const filtered = useMemo(() => {
    return arsip.filter((r) => {
      // Pegawai tidak melihat yang belum diarsipkan
      if (isPegawai && r.status === 'Menunggu') return false;

      // Search
      if (
        search &&
        !(
          r.nomorPerkara.toLowerCase().includes(search.toLowerCase()) ||
          r.jenisPerkara.toLowerCase().includes(search.toLowerCase()) ||
          (r.arsip?.kodeKlasifikasi || '').toLowerCase().includes(search.toLowerCase()) ||
          (r.arsip?.arsipId || '').toLowerCase().includes(search.toLowerCase())
        )
      )
        return false;

      // Filter
      switch (filter) {
        case 'Menunggu':
          return r.status === 'Menunggu';
        case 'Terarsip':
          return r.status === 'Terarsip';
        case 'Dipinjam':
          return r.status === 'Dipinjam';
        default:
          return true;
      }
    });
  }, [arsip, search, filter, isPegawai]);

  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(
    () => ({
      total: arsip.length,
      terarsip: arsip.filter((r) => r.status === 'Terarsip').length,
      dipinjam: arsip.filter((r) => r.status === 'Dipinjam').length,
      menunggu: arsip.filter((r) => r.status === 'Menunggu').length,
    }),
    [arsip],
  );

  /* ── Actions ── */

  const handleSaveArsip = useCallback(
    (data: ArsipData) => {
      if (!archiveModal) return;
      setArsip((prev) =>
        prev.map((r) =>
          r.id === archiveModal.id
            ? { ...r, arsip: data, status: 'Terarsip' as StatusArsip }
            : r,
        ),
      );
      setArchiveModal(null);
    },
    [archiveModal],
  );

  const handleQuickBorrow = useCallback(
    (id: string) => {
      const record = arsip.find(r => r.id === id);
      if (record) {
        setBorrowModal(record);
      }
    },
    [arsip]
  );

  const handleSaveBorrow = useCallback((peminjam: string, tanggalPinjam: string, keterangan: string) => {
    if (!borrowModal) return;
    const p: Peminjaman = {
      id: `p-${Date.now()}`,
      peminjam,
      tanggalPinjam,
      keterangan,
    };
    setArsip((prev) =>
      prev.map((r) =>
        r.id === borrowModal.id
          ? {
              ...r,
              status: 'Dipinjam' as StatusArsip,
              peminjaman: [...r.peminjaman, p],
            }
          : r,
      ),
    );
    setBorrowModal(null);
  }, [borrowModal]);

  const handleQuickReturn = useCallback((id: string) => {
    const t = today();
    setArsip((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Terarsip' as StatusArsip,
              peminjaman: r.peminjaman.map((p) =>
                p.tanggalKembali ? p : { ...p, tanggalKembali: t },
              ),
            }
          : r,
      ),
    );
    // Sync detail modal
    setDetailModal((prev) => {
      if (!prev || prev.id !== id) return prev;
      return {
        ...prev,
        status: 'Terarsip' as StatusArsip,
        peminjaman: prev.peminjaman.map((p) =>
          p.tanggalKembali ? p : { ...p, tanggalKembali: t },
        ),
      };
    });
  }, []);

  /* ── Render ── */
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8 space-y-6">
      <Breadcrumb currentView="eAdvokasiArsip" onNavigate={onNavigate} />

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {isPegawai ? 'Peminjaman Arsip' : 'Manajemen Arsip'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isPegawai
            ? 'Cari, pinjam, dan kembalikan arsip perkara.'
            : 'Kelola siklus hidup arsip: arsipkan, pinjamkan, kembalikan.'}
        </p>
        <div className="border-b-4 border-blue-600 w-14 mt-3" />
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(
          [
            ['Total Arsip', stats.total, 'text-blue-600'],
            ['Terarsip', stats.terarsip, 'text-green-600'],
            ['Dipinjam', stats.dipinjam, 'text-amber-500'],
            ['Menunggu', stats.menunggu, 'text-gray-500'],
          ] as [string, number, string][]
        ).map(([label, val, color]) => (
          <div
            key={label}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center"
          >
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {label}
            </div>
            <div className={`text-3xl font-black ${color}`}>{val}</div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari nomor perkara, jenis, kode klasifikasi, atau Arsip ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          <SearchIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['Semua', 'Menunggu', 'Terarsip', 'Dipinjam'] as FilterTab[])
            .filter((t) => !isPegawai || t !== 'Menunggu')
            .map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilter(t);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  filter === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {t}
              </button>
            ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-10">
                No
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Arsip ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Nomor Perkara
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                Kurun Waktu
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageData.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400 italic">
                  Tidak ada data yang cocok.
                </td>
              </tr>
            )}
            {pageData.map((r, i) => (
              <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="px-4 py-3 text-gray-400">
                  {(page - 1) * perPage + i + 1}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {r.arsip?.arsipId || '—'}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {r.nomorPerkara}
                </td>
                <td className="px-4 py-3 text-gray-700">{r.jenisPerkara}</td>
                <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">
                  {r.status === 'Menunggu'
                    ? r.tahunMasuk
                    : `${r.tahunMasuk} - ${r.arsip?.tahunSelesai ?? r.tahunMasuk}`}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">
                  {r.arsip
                    ? `${r.arsip.lokasi.split('(')[0].trim()} · ${r.arsip.boksFolder}`
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={r.status} />
                    {r.status === 'Terarsip' && r.arsip?.tanggalTerarsip && (
                      <span className="text-[10px] text-gray-500 font-medium">
                        {new Date(r.arsip.tanggalTerarsip).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                    {r.status === 'Dipinjam' && r.peminjaman.length > 0 && (
                      <span className="text-[10px] text-gray-500 font-medium" title="Tanggal Dipinjam">
                        {new Date(r.peminjaman[r.peminjaman.length - 1].tanggalPinjam).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {/* Detail */}
                    <button
                      onClick={() => setDetailModal(r)}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      title="Detail"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>

                    {/* Arsiparis: Arsipkan / Edit */}
                    {isArsiparis && (
                      <button
                        onClick={() => setArchiveModal(r)}
                        className={`p-1.5 rounded transition-colors ${
                          r.arsip
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                            : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                        }`}
                        title={r.arsip ? 'Edit Arsip' : 'Arsipkan'}
                      >
                        {r.arsip ? (
                          <PencilIcon className="h-4 w-4" />
                        ) : (
                          <FileTextIcon className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    {/* Pinjam / Kembalikan */}
                    {r.status !== 'Menunggu' && (
                      r.status === 'Dipinjam' ? (
                        <button
                          onClick={() => handleQuickReturn(r.id)}
                          className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                          title="Kembalikan"
                        >
                          <RefreshIcon className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickBorrow(r.id)}
                          className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                          title="Pinjam"
                        >
                          <BookOpenIcon className="h-4 w-4" />
                        </button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 pb-4">
          <Pagination
            totalItems={filtered.length}
            currentPage={page}
            itemsPerPage={perPage}
            onPageChange={setPage}
            onItemsPerPageChange={(v) => {
              setPerPage(v);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* ── Modals ── */}
      {archiveModal && (
        <ArsipFormModal
          record={archiveModal}
          seq={arsip.filter((r) => r.arsip).length + 1}
          onClose={() => setArchiveModal(null)}
          onSave={handleSaveArsip}
          onViewInfo={() => setInfoModal(archiveModal)}
        />
      )}

      {detailModal && (
        <DetailModal
          archive={detailModal}
          onClose={() => setDetailModal(null)}
          onReturn={
            detailModal.status === 'Dipinjam'
              ? () => handleQuickReturn(detailModal.id)
              : undefined
          }
          onViewInfo={() => setInfoModal(detailModal)}
        />
      )}
      {borrowModal && (
        <BorrowFormModal
          record={borrowModal}
          onClose={() => setBorrowModal(null)}
          onSave={handleSaveBorrow}
          isPegawai={isPegawai}
          userName={userName}
        />
      )}

      {infoModal && (
        <PerkaraInfoModal
          record={infoModal}
          onClose={() => setInfoModal(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default Arsip;
