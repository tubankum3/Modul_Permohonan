import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  TelaahanRecord, StatusTelaahan, StatusNaskahTelaahan, DokumenTelaahanItem, 
  TeamMember, View, JenisPermohonan, StatusPermohonan, SuratMasukNadine 
} from '../types';
import { useAdvokasiStore } from '../useAdvokasiStore';
import Breadcrumb from './Breadcrumb';
import { 
  SearchIcon, EyeIcon, DocumentAddIcon, DocumentTextIcon, 
  UserGroupIcon, CheckCircleIcon, TrashIcon, PrintIcon, 
  DownloadIcon, UploadIcon, XIcon, CheckIcon, PaperClipIcon, 
  ChevronRightIcon, ArrowLeftIcon, PencilIcon, UserAddIcon,
  ExclamationIcon, InformationCircleIcon, ScaleIcon,
  ArrowUpIcon, RotateCcwIcon, UserIcon, CloudArrowDownIcon,
  UserCircleIcon, ChevronDownIcon, PlusIcon
} from './icons';
import TarikDataNadineModal from './eadvo_TarikDataNadineModal';
import AssignTeamModal, { ALL_PERSONNEL, Personnel } from './AssignTeamModal';

interface TelaahanKasusHukumProps {
  onNavigate?: (view: View, record?: any) => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div className="border border-gray-200 rounded-xl mb-6 bg-white overflow-hidden shadow-2xs last:mb-0">
    <div className="px-5 py-3.5 bg-slate-50 font-semibold text-slate-700 border-b border-gray-200 flex justify-between items-center text-sm">
      <h3 className="flex items-center space-x-2 font-bold text-gray-800">{title}</h3>
      {action && <div className="flex items-center space-x-2">{action}</div>}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col md:flex-row border-b border-gray-100 last:border-0 py-3">
    <span className="text-sm font-medium text-gray-500 w-full md:w-56 flex-shrink-0 mb-1 md:mb-0 pr-4">{label}</span>
    <div className="text-sm text-gray-800 font-medium flex-1">{value || '-'}</div>
  </div>
);

export const TelaahanKasusHukum: React.FC<TelaahanKasusHukumProps> = ({ onNavigate }) => {
  const {
    telaahanRecords,
    permohonanList,
    userAccounts,
    userName,
    handleSaveTelaahan,
    handleDeleteTelaahan,
    handleSetTelaahanStatus,
    handleUpdateTelaahanTeam,
    handleSetTelaahanPic,
    handleAddTelaahanDokumen,
    handleDeleteTelaahanDokumen,
    handleSelesaikanNaskahTelaahanNadine,
    showNotification
  } = useAdvokasiStore();

  // Active tab state: 'aktif' or 'selesai'
  const [activeTab, setActiveTab] = useState<'aktif' | 'selesai'>('aktif');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgensi, setFilterUrgensi] = useState<string>('all');
  const [filterStatusNaskah, setFilterStatusNaskah] = useState<string>('all');

  // Modal states
  const [detailRecord, setDetailRecord] = useState<TelaahanRecord | null>(null);
  const [detailTab, setDetailTab] = useState<'informasi' | 'dokumen' | 'riwayat'>('informasi');

  const handleOpenDetail = (record: TelaahanRecord) => {
    setDetailTab('informasi');
    setDetailRecord(record);
  };

  const handleRedirectNadineTulisNaskah = (record: TelaahanRecord) => {
    if (onNavigate) {
      showNotification('Mengarahkan ke Aplikasi Nadine untuk menulis Naskah Dinas...', 'info');
      onNavigate('formNaskah', record);
    } else {
      setNaskahModalRecord(record);
    }
  };
  const [naskahModalRecord, setNaskahModalRecord] = useState<TelaahanRecord | null>(null);
  const [dokumenModalRecord, setDokumenModalRecord] = useState<TelaahanRecord | null>(null);
  const [timModalRecord, setTimModalRecord] = useState<TelaahanRecord | null>(null);
  const [selesaiModalRecord, setSelesaiModalRecord] = useState<TelaahanRecord | null>(null);
  const [printModalRecord, setPrintModalRecord] = useState<TelaahanRecord | null>(null);
  const [deleteModalRecord, setDeleteModalRecord] = useState<TelaahanRecord | null>(null);

  // Print ref for resume
  const resumePrintRef = useRef<HTMLDivElement>(null);

  // New unassigned permohonan of type Telaahan Kasus Hukum
  const pendingInboxTelaahan = useMemo(() => {
    return permohonanList.filter(
      p => (p.status === StatusPermohonan.BARU || p.status === StatusPermohonan.TERKIRIM) &&
      p.jenis === JenisPermohonan.TELAAHAN_KASUS_HUKUM &&
      !p.deletedAt
    );
  }, [permohonanList]);

  // Filtered records based on active tab and search
  const records = useMemo(() => {
    return telaahanRecords.filter(r => {
      // deleted check
      if (r.deletedAt) return false;

      // Tab check
      if (activeTab === 'aktif') {
        if (r.statusTelaahan !== StatusTelaahan.AKTIF) return false;
      } else {
        if (r.statusTelaahan !== StatusTelaahan.SELESAI) return false;
      }

      // Search check
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchNo = r.nomorTelaahan?.toLowerCase().includes(q) || r.Nomor?.toLowerCase().includes(q);
        const matchPerihal = r.perihal?.toLowerCase().includes(q);
        const matchPemohon = r.pemohon?.toLowerCase().includes(q) || r.unit?.toLowerCase().includes(q);
        const matchPokok = r.abstraksiTelaahan?.pokokPermasalahan?.toLowerCase().includes(q);
        const matchTeam = r.team?.some(t => t.nama.toLowerCase().includes(q));
        if (!matchNo && !matchPerihal && !matchPemohon && !matchPokok && !matchTeam) return false;
      }

      // Filter Urgensi
      if (filterUrgensi !== 'all') {
        const urgensi = r.abstraksiTelaahan?.tingkatUrgensi || 'Biasa';
        if (urgensi.toLowerCase() !== filterUrgensi.toLowerCase()) return false;
      }

      // Filter Status Naskah / Status Posisi
      if (filterStatusNaskah !== 'all') {
        const isTerkirim = r.statusTelaahan === StatusTelaahan.SELESAI || r.naskahTelaahan?.statusNaskah === StatusNaskahTelaahan.DIKIRIM;
        const statusPosisi = isTerkirim ? 'Terkirim' : 'Konsep Telaahan';
        if (filterStatusNaskah === 'Terkirim' && !isTerkirim) return false;
        if (filterStatusNaskah === 'Konsep Telaahan' && isTerkirim) return false;
        if (filterStatusNaskah !== 'Terkirim' && filterStatusNaskah !== 'Konsep Telaahan') {
          const naskah = r.naskahTelaahan?.statusNaskah || StatusNaskahTelaahan.BELUM_DIBUAT;
          if (naskah !== filterStatusNaskah) return false;
        }
      }

      return true;
    });
  }, [telaahanRecords, activeTab, searchTerm, filterUrgensi, filterStatusNaskah]);

  // Tab counts
  const countAktif = useMemo(() => {
    return telaahanRecords.filter(r => !r.deletedAt && r.statusTelaahan === StatusTelaahan.AKTIF).length;
  }, [telaahanRecords]);

  const countSelesai = useMemo(() => {
    return telaahanRecords.filter(r => !r.deletedAt && r.statusTelaahan === StatusTelaahan.SELESAI).length;
  }, [telaahanRecords]);

  const getPicName = (record: TelaahanRecord) => {
    if (!record.picId || !record.team) return 'Belum Ditetapkan';
    const pic = record.team.find(m => m.id === record.picId);
    return pic ? pic.nama : 'Belum Ditetapkan';
  };

  const getLastUpdate = (record: TelaahanRecord) => {
    if (record.history && record.history.length > 0) {
      const last = record.history[record.history.length - 1];
      if (last.timestamp) {
        return new Date(last.timestamp).toLocaleDateString('id-ID', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).replace(/\./g, '/');
      }
    }
    if (record.naskahTelaahan?.tglTte) {
      return record.naskahTelaahan.tglTte;
    }
    if (record.tanggal) {
      return `${record.tanggal} 09:00:00`;
    }
    return new Date().toLocaleDateString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/\./g, '/');
  };

  const getStatusPosisiSuratBalasan = (record: TelaahanRecord): 'Konsep Telaahan' | 'Terkirim' => {
    if (record.statusTelaahan === StatusTelaahan.SELESAI || record.naskahTelaahan?.statusNaskah === StatusNaskahTelaahan.DIKIRIM) {
      return 'Terkirim';
    }
    return 'Konsep Telaahan';
  };

  const getStatusPosisiBadge = (record: TelaahanRecord) => {
    const statusPosisi = getStatusPosisiSuratBalasan(record);

    if (statusPosisi === 'Terkirim') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
          Terkirim
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full"></span>
        Konsep Telaahan
      </span>
    );
  };

  const getUrgensiBadge = (urgensi?: string) => {
    const val = urgensi || 'Biasa';
    if (val === 'Segera' || val === 'Sangat Segera') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          {val}
        </span>
      );
    }
    if (val === 'Penting') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          {val}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-650 border border-gray-200">
        {val}
      </span>
    );
  };

  // Helper to trigger Resume Print
  const handlePrintResume = () => {
    if (!resumePrintRef.current) return;
    const printContent = resumePrintRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume Telaahan Hukum - ${printModalRecord?.nomorTelaahan || 'Resume'}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { padding: 20px; font-family: sans-serif; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body class="p-8 bg-white text-gray-900">
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div id="eadvo-telaahan-module" className="flex flex-col h-full bg-slate-50">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <Breadcrumb currentView="eAdvokasiTelaahanKasusHukum" onNavigate={onNavigate || (() => {})} />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-[#0055A5] rounded-xl border border-blue-100">
                <ScaleIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Telaahan Kasus Hukum</h1>
                <p className="text-sm text-gray-500">
                  Pengelolaan analisis yuridis, penyusunan naskah telaahan Nadine, pengorganisasian data dukung, dan TTE elektronik.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {pendingInboxTelaahan.length > 0 && onNavigate && (
              <button
                onClick={() => onNavigate('eAdvokasiInbox')}
                className="inline-flex items-center px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
                {pendingInboxTelaahan.length} Permohonan Baru di Inbox
              </button>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterUrgensi('all');
                setFilterStatusNaskah('all');
              }}
              className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Info Notification if new permohonan in inbox */}
        {pendingInboxTelaahan.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <ExclamationIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900">
                  Terdapat {pendingInboxTelaahan.length} Permohonan Telaahan Kasus Hukum Baru
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Surat permohonan dari Nadine menunggu untuk diproses dan ditugaskan ke tim penelaah hukum.
                </p>
              </div>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('eAdvokasiInbox')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline whitespace-nowrap ml-4"
              >
                Buka Inbox Permohonan &rarr;
              </button>
            )}
          </div>
        )}

        {/* Tab Navigation: Aktif & Selesai */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-6 pt-3 flex items-center justify-between">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('aktif')}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition ${
                  activeTab === 'aktif'
                    ? 'border-[#0055A5] text-[#0055A5] font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Aktif</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'aktif' ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-gray-100 text-gray-600'
                }`}>
                  {countAktif}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('selesai')}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition ${
                  activeTab === 'selesai'
                    ? 'border-emerald-600 text-emerald-700 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Selesai</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'selesai' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-gray-100 text-gray-600'
                }`}>
                  {countSelesai}
                </span>
              </button>
            </div>

            <div className="text-xs text-gray-400">
              Total {activeTab === 'aktif' ? countAktif : countSelesai} data telaahan
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nomor, perihal, pemohon..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Urgensi:</label>
                <select
                  value={filterUrgensi}
                  onChange={(e) => setFilterUrgensi(e.target.value)}
                  className="py-1.5 px-2.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Urgensi</option>
                  <option value="Biasa">Biasa</option>
                  <option value="Penting">Penting</option>
                  <option value="Segera">Segera / Sangat Segera</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Status Posisi:</label>
                <select
                  value={filterStatusNaskah}
                  onChange={(e) => setFilterStatusNaskah(e.target.value)}
                  className="py-1.5 px-2.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Status Posisi</option>
                  <option value="Konsep Telaahan">Konsep Telaahan</option>
                  <option value="Terkirim">Terkirim</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/75">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    No
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nomor & Tanggal Naskah Dinas
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pemohon/Pengirim & Unit Pengirim
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Perihal Naskah Dinas
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status Posisi
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    PIC
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <ScaleIcon className="h-10 w-10 text-gray-300" />
                        <p className="text-sm font-medium text-gray-600">
                          {searchTerm || filterUrgensi !== 'all' || filterStatusNaskah !== 'all'
                            ? 'Tidak ada data telaahan yang sesuai dengan filter pencarian.'
                            : activeTab === 'aktif'
                            ? 'Belum ada telaahan kasus hukum aktif.'
                            : 'Belum ada telaahan kasus hukum yang berstatus selesai.'}
                        </p>
                        {activeTab === 'aktif' && pendingInboxTelaahan.length > 0 && onNavigate && (
                          <button
                            onClick={() => onNavigate('eAdvokasiInbox')}
                            className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold"
                          >
                            Proses permohonan baru dari Inbox Permohonan &rarr;
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((record, index) => {
                    const urgensi = record.abstraksiTelaahan?.tingkatUrgensi || 'Biasa';
                    const docCount = record.dokumenTelaahan?.length || 0;
                    const teamCount = record.team?.length || 0;
                    const picName = getPicName(record);

                    return (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* No */}
                        <td className="px-4 py-3 text-xs text-gray-500 text-center font-medium">
                          {index + 1}
                        </td>

                        {/* Nomor & Tanggal Naskah Dinas */}
                        <td className="px-4 py-3 text-xs">
                          <div className="font-semibold text-gray-900">{record.Nomor || record.nomorTelaahan || '-'}</div>
                          <div className="text-gray-500 text-[11px] mt-0.5">{record.tanggal || '-'}</div>
                          <div className="mt-1 flex items-center space-x-1.5 flex-wrap gap-1">
                            {getUrgensiBadge(urgensi)}
                            {record.nomorTelaahan && record.Nomor && record.nomorTelaahan !== record.Nomor && (
                              <span className="text-[10px] text-gray-400 font-mono" title="No Register Telaahan">
                                Reg: {record.nomorTelaahan}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Pemohon/Pengirim & Unit Pengirim */}
                        <td className="px-4 py-3 text-xs max-w-xs">
                          <div className="font-semibold text-gray-900 line-clamp-1" title={record.pemohon}>
                            {record.pemohon || '-'}
                          </div>
                          <div className="text-gray-600 text-[11px] mt-0.5 line-clamp-2" title={record.unit}>
                            {record.unit || 'Unit Kerja Pengirim'}
                          </div>
                        </td>

                        {/* Perihal Naskah Dinas */}
                        <td className="px-4 py-3 text-xs max-w-sm">
                          <div
                            className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2"
                            onClick={() => handleOpenDetail(record)}
                            title={record.perihal || record.naskahTelaahan?.perihal || 'Perihal Naskah Dinas'}
                          >
                            {record.perihal || record.naskahTelaahan?.perihal || '-'}
                          </div>
                          {record.abstraksiTelaahan?.kategoriHukum && (
                            <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                              {record.abstraksiTelaahan.kategoriHukum}
                            </span>
                          )}
                        </td>

                        {/* Status Posisi (Status Surat Balasan: Konsep Telaahan, Terkirim) */}
                        <td className="px-4 py-3 text-xs whitespace-nowrap">
                          {getStatusPosisiBadge(record)}
                          {record.naskahTelaahan?.nomorNaskah && (
                            <div className="text-[10px] text-gray-500 font-mono mt-1" title="Nomor Surat Balasan Nadine">
                              {record.naskahTelaahan.nomorNaskah}
                            </div>
                          )}
                          {record.naskahTelaahan?.tglTte && (
                            <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">
                              TTE: {record.naskahTelaahan.tglTte.split(' ')[0]}
                            </div>
                          )}
                        </td>

                        {/* PIC */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-2 shrink-0 border border-blue-100">
                              <UserIcon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-700 font-medium truncate max-w-[140px]" title={picName}>
                                {picName}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold leading-tight">Last update:</span>
                              <span className="text-[10px] text-gray-400 font-medium truncate leading-tight">
                                {getLastUpdate(record)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-xs whitespace-nowrap w-40">
                          <div className="flex items-center justify-center">
                            {record.statusTelaahan === StatusTelaahan.AKTIF ? (
                              <div className="grid grid-cols-4 grid-rows-2 gap-1 w-fit">
                                {/* View Detail */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenDetail(record)}
                                  className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                  title="View Detail"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>

                                {/* Tombol Update: Tulis Naskah Dinas di Aplikasi Nadine (redirect ke Nadine tulis Naskah) */}
                                <button
                                  type="button"
                                  onClick={() => handleRedirectNadineTulisNaskah(record)}
                                  className="p-1.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                  title="Update (Tulis Naskah Dinas di Aplikasi Nadine)"
                                >
                                  <ArrowUpIcon className="h-4 w-4" />
                                </button>

                                {/* Dokumen Dukung */}
                                <button
                                  type="button"
                                  onClick={() => setDokumenModalRecord(record)}
                                  className="p-1.5 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors relative"
                                  title="Dokumen Dukung"
                                >
                                  <DocumentTextIcon className="h-4 w-4" />
                                  {docCount > 0 && (
                                    <span className="absolute -top-1 -right-1 px-1 bg-amber-500 text-white rounded-full text-[9px] font-bold">
                                      {docCount}
                                    </span>
                                  )}
                                </button>

                                {/* Penugasan Tim */}
                                <button
                                  type="button"
                                  onClick={() => setTimModalRecord(record)}
                                  className="p-1.5 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                                  title="Penugasan Tim"
                                >
                                  <UserIcon className="h-4 w-4" />
                                </button>

                                {/* Set Selesai */}
                                <button
                                  type="button"
                                  onClick={() => setSelesaiModalRecord(record)}
                                  className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                  title="Set Selesai"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>

                                {/* Print/Download Resume */}
                                <button
                                  type="button"
                                  onClick={() => setPrintModalRecord(record)}
                                  className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                  title="Print/Download Resume"
                                >
                                  <PrintIcon className="h-4 w-4" />
                                </button>

                                {/* Hapus Data */}
                                <button
                                  type="button"
                                  onClick={() => setDeleteModalRecord(record)}
                                  className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                  title="Hapus Data"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-4 grid-rows-2 gap-1 w-fit">
                                {/* View Detail */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenDetail(record)}
                                  className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                  title="View Detail"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>

                                {/* Dokumen Dukung */}
                                <button
                                  type="button"
                                  onClick={() => setDokumenModalRecord(record)}
                                  className="p-1.5 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors relative"
                                  title="Dokumen Dukung"
                                >
                                  <DocumentTextIcon className="h-4 w-4" />
                                  {docCount > 0 && (
                                    <span className="absolute -top-1 -right-1 px-1 bg-amber-500 text-white rounded-full text-[9px] font-bold">
                                      {docCount}
                                    </span>
                                  )}
                                </button>

                                {/* Penugasan Tim */}
                                <button
                                  type="button"
                                  onClick={() => setTimModalRecord(record)}
                                  className="p-1.5 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                                  title="Penugasan Tim"
                                >
                                  <UserIcon className="h-4 w-4" />
                                </button>

                                {/* Restore ke Aktif */}
                                <button
                                  type="button"
                                  onClick={() => setSelesaiModalRecord(record)}
                                  className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                  title="Restore ke Aktif"
                                >
                                  <RotateCcwIcon className="h-4 w-4" />
                                </button>

                                {/* Print/Download Resume */}
                                <button
                                  type="button"
                                  onClick={() => setPrintModalRecord(record)}
                                  className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                  title="Print/Download Resume"
                                >
                                  <PrintIcon className="h-4 w-4" />
                                </button>

                                {/* Hapus Data */}
                                <button
                                  type="button"
                                  onClick={() => setDeleteModalRecord(record)}
                                  className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                  title="Hapus Data"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-gray-500 flex items-center justify-between">
            <div>
              Menampilkan <span className="font-semibold">{records.length}</span> dari{' '}
              <span className="font-semibold">{activeTab === 'aktif' ? countAktif : countSelesai}</span> telaahan {activeTab}
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Terkirim (Selesai TTE)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                <span>Proses Telaahan</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 1. MODAL VIEW DETAIL TELAAHAN KASUS HUKUM                */}
      {/* ======================================================== */}
      {detailRecord && (() => {
        const permohonanDocs = [
          ...(detailRecord.files || []).map((f, i) => ({
            id: `file-${i}`,
            name: f.name,
            kategori: 'Permohonan',
            nomor: detailRecord.Nomor || '-',
            tanggal: detailRecord.tanggal || '-',
            sumber: detailRecord.sumber || 'Nadine',
            size: f.size || 102400,
          })),
          ...(detailRecord.dokumenTelaahan || []).filter(d => d.kategori === 'Permohonan').map(d => ({
            id: d.id,
            name: d.name,
            kategori: 'Permohonan',
            nomor: detailRecord.Nomor || '-',
            tanggal: d.tanggal || detailRecord.tanggal || '-',
            sumber: 'Upload',
            size: d.size || 102400,
          }))
        ];

        const telaahanDanDukungDocs = [
          ...(detailRecord.naskahTelaahan?.nomorNaskah ? [{
            id: 'naskah-balasan',
            name: `Naskah Telaahan - ${detailRecord.naskahTelaahan.nomorNaskah}.pdf`,
            kategori: 'Naskah Balasan (Nadine)',
            nomor: detailRecord.naskahTelaahan.nomorNaskah,
            tanggal: detailRecord.naskahTelaahan.tglTte || detailRecord.tanggal || '-',
            sumber: 'Nadine',
            size: 320000,
          }] : []),
          ...(detailRecord.dokumenTelaahan || []).filter(d => d.kategori !== 'Permohonan').map(d => ({
            id: d.id,
            name: d.name,
            kategori: d.kategori || 'Data Dukung',
            nomor: '-',
            tanggal: d.tanggal || '-',
            sumber: 'Upload',
            size: d.size || 102400,
          }))
        ];

        const sortedTeam = [...(detailRecord.team || [])].sort((a, b) => {
          if (a.id === detailRecord.picId) return -1;
          if (b.id === detailRecord.picId) return 1;
          return a.nama.localeCompare(b.nama);
        });

        const auditTrailEntries = [
          ...(detailRecord.history || []).map((h, i) => ({
            id: `hist-${i}`,
            time: h.timestamp ? new Date(h.timestamp).toLocaleString('id-ID', { hour12: false }).replace(/\./g, '/') : detailRecord.tanggal,
            user: h.author || 'Administrator',
            action: h.message || 'Pembaruan data telaahan',
            status: 'Tercatat'
          })),
          ...(detailRecord.statusTelaahan === StatusTelaahan.SELESAI ? [{
            id: 'audit-selesai',
            time: detailRecord.tanggal || 'Hari ini',
            user: 'PIC / Koordinator Advokasi',
            action: 'Telaahan kasus hukum dinyatakan Selesai dan berkas diarsipkan.',
            status: 'Selesai'
          }] : []),
          ...(detailRecord.naskahTelaahan?.tglTte ? [{
            id: 'audit-tte',
            time: detailRecord.naskahTelaahan.tglTte,
            user: 'Kepala Bagian Advokasi',
            action: `Penerbitan TTE Naskah Telaahan Nadine No. ${detailRecord.naskahTelaahan.nomorNaskah || '-'}.`,
            status: 'Terkirim'
          }] : []),
          ...(detailRecord.team && detailRecord.team.length > 0 ? [{
            id: 'audit-tim',
            time: detailRecord.tanggal,
            user: 'Administrator Advokasi',
            action: `Penugasan ${detailRecord.team.length} anggota tim penelaah hukum dengan PIC: ${getPicName(detailRecord)}.`,
            status: 'Penugasan Tim'
          }] : []),
          {
            id: 'audit-registrasi',
            time: detailRecord.tanggal,
            user: detailRecord.pemohon || 'Nadine Kemenkeu',
            action: `Penerimaan permohonan naskah dinas telaahan kasus hukum No. ${detailRecord.Nomor || detailRecord.id}.`,
            status: 'Surat Masuk'
          }
        ];

        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-fadeIn">
              
              {/* Header Modal */}
              <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2.5 bg-blue-50 text-[#0055A5] rounded-xl border border-blue-100 flex-shrink-0">
                    <ScaleIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <h2 className="text-xl font-bold text-gray-900">Detail Telaahan Kasus Hukum</h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {detailRecord.nomorTelaahan || detailRecord.Nomor || detailRecord.id}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        detailRecord.statusTelaahan === StatusTelaahan.AKTIF 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {detailRecord.statusTelaahan}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 max-w-2xl truncate" title={detailRecord.perihal}>
                      {detailRecord.perihal}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      const rec = detailRecord;
                      setDetailRecord(null);
                      setPrintModalRecord(rec);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition"
                    title="Cetak / Unduh Resume"
                  >
                    <PrintIcon className="h-4 w-4" />
                    <span>Download Resume / Cetak</span>
                  </button>
                  <button
                    onClick={() => setDetailRecord(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="Tutup Modal"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 bg-white px-6">
                <nav className="-mb-px flex space-x-8" aria-label="Detail Tabs">
                  <button
                    onClick={() => setDetailTab('informasi')}
                    className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                      detailTab === 'informasi'
                        ? 'border-[#0055A5] text-[#0055A5]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>Informasi Umum</span>
                  </button>
                  
                  <button
                    onClick={() => setDetailTab('dokumen')}
                    className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                      detailTab === 'dokumen'
                        ? 'border-[#0055A5] text-[#0055A5]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>Dokumen</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      detailTab === 'dokumen' ? 'bg-blue-100 text-[#0055A5]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {permohonanDocs.length + telaahanDanDukungDocs.length}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setDetailTab('riwayat')}
                    className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                      detailTab === 'riwayat'
                        ? 'border-[#0055A5] text-[#0055A5]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>Riwayat</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      detailTab === 'riwayat' ? 'bg-blue-100 text-[#0055A5]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {detailRecord.team?.length || 0} Tim
                    </span>
                  </button>
                </nav>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/60">
                
                {/* ======================================================== */}
                {/* TAB 1: INFORMASI UMUM                                    */}
                {/* ======================================================== */}
                {detailTab === 'informasi' && (
                  <div className="space-y-6 animate-fadeIn">
                    <DetailSection title="Informasi Umum">
                      <DetailRow 
                        label="Tahun Masuk" 
                        value={detailRecord.tahunMasuk || (detailRecord.tanggal ? detailRecord.tanggal.split('/')[2] : '2026')} 
                      />
                      <DetailRow 
                        label="Nomor Surat" 
                        value={detailRecord.Nomor || detailRecord.nomorTelaahan || '-'} 
                      />
                      <DetailRow 
                        label="Tanggal Surat" 
                        value={detailRecord.tanggal || '-'} 
                      />
                      <DetailRow 
                        label="Nama Pengirim" 
                        value={detailRecord.pemohon || '-'} 
                      />
                      <DetailRow 
                        label="Unit Pengirim" 
                        value={detailRecord.unit || '-'} 
                      />
                      <DetailRow 
                        label="Perihal" 
                        value={detailRecord.perihal || detailRecord.naskahTelaahan?.perihal || '-'} 
                      />
                      <DetailRow 
                        label="Status Surat Balasan" 
                        value={getStatusPosisiBadge(detailRecord)} 
                      />
                      <DetailRow 
                        label="Tingkat Urgensi" 
                        value={getUrgensiBadge(detailRecord.abstraksiTelaahan?.tingkatUrgensi)} 
                      />
                      <DetailRow 
                        label="Kategori Bidang Hukum" 
                        value={
                          <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold">
                            {detailRecord.abstraksiTelaahan?.kategoriHukum || 'Hukum Perdata / TUN'}
                          </span>
                        } 
                      />
                    </DetailSection>

                    <DetailSection title="Pokok Permasalahan & Analisis Yuridis">
                      <DetailRow 
                        label="Pokok Permasalahan" 
                        value={
                          <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                            {detailRecord.abstraksiTelaahan?.pokokPermasalahan || detailRecord.uraian || 'Tidak ada uraian spesifik.'}
                          </div>
                        } 
                      />
                      
                      {detailRecord.abstraksiTelaahan?.faktaHukum && (
                        <DetailRow 
                          label="Fakta Hukum & Kronologi" 
                          value={
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                              {detailRecord.abstraksiTelaahan.faktaHukum}
                            </div>
                          } 
                        />
                      )}

                      {detailRecord.abstraksiTelaahan?.dasarHukum && detailRecord.abstraksiTelaahan.dasarHukum.length > 0 && (
                        <DetailRow 
                          label="Dasar Peraturan Perundang-undangan" 
                          value={
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                              {detailRecord.abstraksiTelaahan.dasarHukum.map((dh, idx) => (
                                <li key={idx} className="leading-relaxed">{dh}</li>
                              ))}
                            </ul>
                          } 
                        />
                      )}

                      {detailRecord.abstraksiTelaahan?.analisisKajian && (
                        <DetailRow 
                          label="Analisis Yuridis & Kajian Hukum" 
                          value={
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                              {detailRecord.abstraksiTelaahan.analisisKajian}
                            </div>
                          } 
                        />
                      )}

                      {detailRecord.abstraksiTelaahan?.rekomendasi && (
                        <DetailRow 
                          label="Kesimpulan & Rekomendasi Advokasi" 
                          value={
                            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-medium whitespace-pre-wrap leading-relaxed">
                              {detailRecord.abstraksiTelaahan.rekomendasi}
                            </div>
                          } 
                        />
                      )}
                    </DetailSection>
                  </div>
                )}

                {/* ======================================================== */}
                {/* TAB 2: DOKUMEN                                           */}
                {/* ======================================================== */}
                {detailTab === 'dokumen' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Dokumen Permohonan */}
                    <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800 text-sm">1. Dokumen Permohonan</h3>
                          <span className="bg-blue-100 text-[#0055A5] text-xs font-semibold px-2 py-0.5 rounded-full">
                            {permohonanDocs.length} Berkas
                          </span>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                          <thead className="bg-[#f9fafb]">
                            <tr>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider w-12">No</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Nama Dokumen</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Nomor / Tanggal</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Sumber</th>
                              <th className="px-5 py-3 text-center font-bold text-gray-500 uppercase tracking-wider w-28">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {permohonanDocs.length > 0 ? (
                              permohonanDocs.map((doc, idx) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-5 py-3.5 text-gray-500 font-medium">{idx + 1}</td>
                                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                                    <div className="flex items-center space-x-2.5">
                                      <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
                                        <DocumentTextIcon className="h-4 w-4" />
                                      </div>
                                      <span className="truncate max-w-md" title={doc.name}>{doc.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                                    <span className="font-semibold block text-gray-800">{doc.nomor}</span>
                                    <span className="text-[11px] text-gray-400">{doc.tanggal}</span>
                                  </td>
                                  <td className="px-5 py-3.5 whitespace-nowrap">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                                      {doc.sumber}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5 text-center whitespace-nowrap space-x-2">
                                    <button 
                                      onClick={() => showNotification(`Membuka preview ${doc.name}`, 'info')}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" 
                                      title="Lihat Dokumen"
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      onClick={() => showNotification(`Mengunduh ${doc.name}...`, 'info')}
                                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition" 
                                      title="Unduh Dokumen"
                                    >
                                      <DownloadIcon className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-gray-400 italic">
                                  Belum ada dokumen permohonan.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Dokumen Telaahan dan Data Dukung */}
                    <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800 text-sm">2. Dokumen Telaahan dan Data Dukung</h3>
                          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {telaahanDanDukungDocs.length} Berkas
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const rec = detailRecord;
                            setDetailRecord(null);
                            setDokumenModalRecord(rec);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          + Kelola / Unggah Dokumen
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                          <thead className="bg-[#f9fafb]">
                            <tr>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider w-12">No</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Nama Dokumen</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                              <th className="px-5 py-3 text-center font-bold text-gray-500 uppercase tracking-wider w-28">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {telaahanDanDukungDocs.length > 0 ? (
                              telaahanDanDukungDocs.map((doc, idx) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-5 py-3.5 text-gray-500 font-medium">{idx + 1}</td>
                                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                                    <div className="flex items-center space-x-2.5">
                                      <div className="p-1.5 rounded-lg bg-blue-50 text-[#0055A5] border border-blue-100">
                                        <DocumentTextIcon className="h-4 w-4" />
                                      </div>
                                      <span className="truncate max-w-md" title={doc.name}>{doc.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5 whitespace-nowrap">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                                      {doc.kategori}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                                    {doc.tanggal}
                                  </td>
                                  <td className="px-5 py-3.5 text-center whitespace-nowrap space-x-2">
                                    <button 
                                      onClick={() => showNotification(`Membuka preview ${doc.name}`, 'info')}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" 
                                      title="Lihat Dokumen"
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      onClick={() => showNotification(`Mengunduh ${doc.name}...`, 'info')}
                                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition" 
                                      title="Unduh Dokumen"
                                    >
                                      <DownloadIcon className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-gray-400 italic">
                                  Belum ada dokumen telaahan atau data dukung tambahan tersimpan.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* ======================================================== */}
                {/* TAB 3: RIWAYAT                                           */}
                {/* ======================================================== */}
                {detailTab === 'riwayat' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Susunan Anggota Tim */}
                    <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800 text-sm">Susunan Anggota Tim</h3>
                          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {sortedTeam.length} Personel
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const rec = detailRecord;
                            setDetailRecord(null);
                            setTimModalRecord(rec);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          + Atur Tim & PIC
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                          <thead className="bg-[#f9fafb]">
                            <tr>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider w-12">No</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">NIP</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Unit</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Role / Posisi Tim</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {sortedTeam.length > 0 ? (
                              sortedTeam.map((member, index) => {
                                const isPic = member.id === detailRecord.picId;
                                return (
                                  <tr key={member.id} className={isPic ? 'bg-amber-50/50' : 'hover:bg-gray-50'}>
                                    <td className="px-5 py-3.5 text-gray-500 font-medium">{index + 1}</td>
                                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                                      <div className="flex items-center space-x-2">
                                        <span>{member.nama}</span>
                                        {isPic && (
                                          <span className="px-2 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-200 rounded-full border border-amber-300">
                                            PIC
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600 font-mono">{member.nip}</td>
                                    <td className="px-5 py-3.5 text-gray-600">{member.unit}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                      <span className={`px-2 py-0.5 inline-flex text-[11px] font-semibold rounded-full ${
                                        member.teamRole === 'Editor' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {member.teamRole || member.role || 'Anggota Tim'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-gray-400 italic">
                                  Tim belum dibentuk untuk telaahan ini.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Riwayat (Audit Trail) */}
                    <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800 text-sm">Riwayat (Audit Trail)</h3>
                          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {auditTrailEntries.length} Aktivitas
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                          <thead className="bg-[#f9fafb]">
                            <tr>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider w-44">Date & Time</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider w-48">Pengguna / Aktor</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Uraian Aktivitas</th>
                              <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wider w-32">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {auditTrailEntries.map((entry) => (
                              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap font-medium">
                                  {entry.time}
                                </td>
                                <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                                  {entry.user}
                                </td>
                                <td className="px-5 py-3.5 text-gray-700">
                                  {entry.action}
                                </td>
                                <td className="px-5 py-3.5 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                    {entry.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Status Posisi:</span>
                  {getStatusPosisiBadge(detailRecord)}
                  {detailRecord.naskahTelaahan?.nomorNaskah && (
                    <span className="font-mono text-gray-500">
                      ({detailRecord.naskahTelaahan.nomorNaskah})
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {detailRecord.statusTelaahan === StatusTelaahan.AKTIF && (
                    <button
                      onClick={() => {
                        const rec = detailRecord;
                        setDetailRecord(null);
                        handleRedirectNadineTulisNaskah(rec);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center space-x-1.5"
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                      <span>Tulis Naskah Dinas (Aplikasi Nadine)</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const rec = detailRecord;
                      setDetailRecord(null);
                      setPrintModalRecord(rec);
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition flex items-center space-x-1.5"
                  >
                    <PrintIcon className="h-4 w-4" />
                    <span>Print Resume</span>
                  </button>
                  <button
                    onClick={() => setDetailRecord(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. MODAL BUAT NASKAH TELAAHAN (REDIRECT APLIKASI NADINE)  */}
      {/* ======================================================== */}
      {naskahModalRecord && (
        <NadineTelaahanDraftingModal
          record={naskahModalRecord}
          onClose={() => setNaskahModalRecord(null)}
          onSuccess={(signedNaskah) => {
            handleSelesaikanNaskahTelaahanNadine(naskahModalRecord.id, signedNaskah);
            setNaskahModalRecord(null);
            setActiveTab('selesai');
            showNotification('Naskah telaahan berhasil di-TTE dan dikirim via Nadine! Telaahan telah berpindah ke tab Selesai.', 'success');
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 3. MODAL ORGANIZE DOKUMEN (PERMOHONAN & DATA DUKUNG)     */}
      {/* ======================================================== */}
      {dokumenModalRecord && (
        <DokumenOrganizerModal
          record={dokumenModalRecord}
          onClose={() => setDokumenModalRecord(null)}
          onAddDocument={(newDoc) => {
            handleAddTelaahanDokumen(dokumenModalRecord.id, newDoc);
            showNotification(`Dokumen "${newDoc.name}" berhasil ditambahkan ke telaahan.`, 'success');
          }}
          onDeleteDocument={(docId) => {
            handleDeleteTelaahanDokumen(dokumenModalRecord.id, docId);
            showNotification('Dokumen berhasil dihapus dari telaahan.', 'info');
          }}
          onTulisNaskah={() => {
            const rec = dokumenModalRecord;
            setDokumenModalRecord(null);
            handleRedirectNadineTulisNaskah(rec);
          }}
          onShowNotification={showNotification}
        />
      )}

      {/* ======================================================== */}
      {/* 4. MODAL TIM & PIC PENGELOLAAN                           */}
      {/* ======================================================== */}
      {timModalRecord && (
        <TimManagementModal
          record={timModalRecord}
          userAccounts={userAccounts}
          onClose={() => setTimModalRecord(null)}
          onSaveTeam={(updatedTeam, newPicId) => {
            handleUpdateTelaahanTeam(timModalRecord.id, updatedTeam);
            handleSetTelaahanPic(timModalRecord.id, newPicId);
            setTimModalRecord(null);
            showNotification('Tim penelaah hukum dan PIC berhasil diperbarui.', 'success');
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 5. MODAL SET SELESAI / AKTIFKAN KEMBALI                   */}
      {/* ======================================================== */}
      {selesaiModalRecord && (
        <SetSelesaiModal
          record={selesaiModalRecord}
          onClose={() => setSelesaiModalRecord(null)}
          onConfirm={(status) => {
            handleSetTelaahanStatus(selesaiModalRecord.id, status);
            setSelesaiModalRecord(null);
            if (status === StatusTelaahan.SELESAI) {
              setActiveTab('selesai');
            } else {
              setActiveTab('aktif');
            }
            showNotification(
              status === StatusTelaahan.SELESAI 
                ? 'Telaahan berhasil ditandai Selesai.' 
                : 'Telaahan berhasil diaktifkan kembali.', 
              'success'
            );
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 6. MODAL PRINT / DOWNLOAD RESUME TELAAHAN                */}
      {/* ======================================================== */}
      {printModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PrintIcon className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Pratinjau & Cetak Resume Telaahan Kasus Hukum</h3>
              </div>
              <button onClick={() => setPrintModalRecord(null)} className="text-slate-400 hover:text-white">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white" ref={resumePrintRef}>
              {/* Kop Surat Resmi */}
              <div className="text-center border-b-2 border-double border-gray-900 pb-4 mb-6">
                <p className="text-xs tracking-widest uppercase font-semibold text-gray-600">KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</p>
                <p className="text-xs tracking-wider uppercase font-semibold text-gray-700">SEKRETARIAT JENDERAL</p>
                <h2 className="text-base font-bold tracking-wide uppercase text-gray-900 mt-0.5">BIRO ADVOKASI</h2>
                <p className="text-[11px] text-gray-500 mt-1">
                  Gedung Djuanda I Lantai 16, Jl. Dr. Wahidin Raya No. 1, Jakarta Pusat 10710 • Telp: (021) 3449230
                </p>
              </div>

              {/* Title Resume */}
              <div className="text-center mb-6">
                <h3 className="text-sm font-bold uppercase underline tracking-wider text-gray-900">
                  RESUME TELAAHAN KASUS HUKUM
                </h3>
                <p className="text-xs text-gray-600 font-mono mt-1">
                  NOMOR: {printModalRecord.nomorTelaahan || printModalRecord.Nomor}
                </p>
              </div>

              {/* Resume Body */}
              <div className="space-y-4 text-xs text-gray-800 leading-relaxed">
                {/* Tabel Identitas */}
                <table className="w-full border border-gray-300 mb-4">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="w-1/3 bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Unit Pemohon</td>
                      <td className="p-2 font-medium">{printModalRecord.unit || printModalRecord.pemohon}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Surat Rujukan Pemohon (Nadine)</td>
                      <td className="p-2 font-medium">{printModalRecord.Nomor} ({printModalRecord.tanggal})</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Perihal Permohonan</td>
                      <td className="p-2 font-semibold text-gray-900">{printModalRecord.perihal}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Kategori & Urgensi</td>
                      <td className="p-2 font-medium">
                        {printModalRecord.abstraksiTelaahan?.kategoriHukum || 'Hukum Perdata & Kontrak'} • Tingkat: {printModalRecord.abstraksiTelaahan?.tingkatUrgensi || 'Biasa'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Status Penelaahan</td>
                      <td className="p-2 font-bold text-blue-900">{printModalRecord.statusTelaahan} (Naskah: {printModalRecord.naskahTelaahan?.statusNaskah || 'Belum Dibuat'})</td>
                    </tr>
                  </tbody>
                </table>

                {/* Section I */}
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase">I. Duduk Perkara & Kronologis</h4>
                  <p className="pl-4 text-justify whitespace-pre-line text-gray-700">
                    {printModalRecord.abstraksiTelaahan?.pokokPermasalahan || printModalRecord.uraian || '-'}
                  </p>
                  {printModalRecord.abstraksiTelaahan?.faktaHukum && (
                    <p className="pl-4 text-justify whitespace-pre-line text-gray-700 mt-2">
                      <span className="font-semibold">Fakta Hukum:</span> {printModalRecord.abstraksiTelaahan.faktaHukum}
                    </p>
                  )}
                </div>

                {/* Section II */}
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase">II. Dasar Hukum</h4>
                  <ul className="list-decimal list-inside pl-4 space-y-0.5 text-gray-700">
                    {printModalRecord.abstraksiTelaahan?.dasarHukum?.map((dh, idx) => (
                      <li key={idx}>{dh}</li>
                    )) || (
                      <li>Peraturan Perundang-undangan terkait Kementerian Keuangan</li>
                    )}
                  </ul>
                </div>

                {/* Section III */}
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase">III. Analisis Yuridis</h4>
                  <p className="pl-4 text-justify whitespace-pre-line text-gray-700">
                    {printModalRecord.abstraksiTelaahan?.analisisKajian || 
                      'Berdasarkan kajian terhadap peraturan yang berlaku dan bukti-bukti dukung yang dilampirkan pemohon, dapat disimpulkan posisi hukum Kementerian Keuangan telah didukung bukti formal dan prosedural yang berkekuatan hukum.'}
                  </p>
                </div>

                {/* Section IV */}
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase">IV. Kesimpulan & Rekomendasi</h4>
                  <p className="pl-4 text-justify whitespace-pre-line text-gray-800 font-medium">
                    {printModalRecord.abstraksiTelaahan?.rekomendasi || 
                      'Disarankan kepada unit pemohon untuk melaksanakan langkah penanganan administratif dan koordinasi berkesinambungan dengan Biro Advokasi.'}
                  </p>
                </div>

                {/* Info TTE Nadine */}
                {printModalRecord.naskahTelaahan?.statusNaskah === StatusNaskahTelaahan.DIKIRIM && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-emerald-900">
                        Naskah Telaahan Resmi Nadine: {printModalRecord.naskahTelaahan.nomorNaskah}
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        Ditandatangani secara elektronik (TTE) oleh {printModalRecord.naskahTelaahan.penandaTangan} pada {printModalRecord.naskahTelaahan.tglTte}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-emerald-300 text-emerald-800">
                      BSrE Verified
                    </span>
                  </div>
                )}

                {/* Tim Penelaah Signature Section */}
                <div className="mt-8 pt-6 grid grid-cols-2 gap-8 text-center text-xs">
                  <div>
                    <p className="text-gray-500">Penanggung Jawab (PIC)</p>
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-slate-300 font-serif italic text-sm">[Telah Diverifikasi Sistem]</span>
                    </div>
                    <p className="font-bold text-gray-900 underline">{getPicName(printModalRecord)}</p>
                    <p className="text-[10px] text-gray-500">Koordinator Advokasi</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Jakarta, {printModalRecord.tanggal}</p>
                    <p className="text-gray-500">Kepala Bagian Advokasi</p>
                    <div className="h-12 flex items-center justify-center">
                      <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        ✓ TTE Nadine Kemenkeu
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 underline">Aloysius Yanis Dhaniarto</p>
                    <p className="text-[10px] text-gray-500">NIP 197405121999031002</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setPrintModalRecord(null)}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handlePrintResume}
                className="px-5 py-2 bg-[#0055A5] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-2"
              >
                <PrintIcon className="h-4 w-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL DELETE CONFIRMATION                             */}
      {/* ======================================================== */}
      {deleteModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-rose-100 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <TrashIcon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Hapus Telaahan Kasus Hukum?</h3>
              <p className="text-xs text-gray-500 mt-2">
                Anda akan menghapus telaahan <span className="font-semibold text-gray-800">{deleteModalRecord.nomorTelaahan || deleteModalRecord.Nomor}</span>. Data ini akan dipindahkan ke Recycle Bin.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteModalRecord(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDeleteTelaahan(deleteModalRecord.id);
                  setDeleteModalRecord(null);
                  showNotification('Telaahan berhasil dihapus.', 'info');
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: NADINE TELAAHAN DRAFTING & TTE FLOW (Aplikasi Nadine Simulation)
// =========================================================================
interface NadineModalProps {
  record: TelaahanRecord;
  onClose: () => void;
  onSuccess: (signedNaskah: any) => void;
}

const NadineTelaahanDraftingModal: React.FC<NadineModalProps> = ({ record, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Form Drafting, 2: Preview Naskah Dinas, 3: TTE BSrE & Kirim
  const [nomorNaskah, setNomorNaskah] = useState(
    record.naskahTelaahan?.nomorNaskah || `ND-${Math.floor(100 + Math.random() * 900)}/SJ.4/2026`
  );
  const [perihal, setPerihal] = useState(
    record.naskahTelaahan?.perihal || `Telaahan Hukum atas ${record.perihal}`
  );
  const [tujuan, setTujuan] = useState(
    record.naskahTelaahan?.tujuan || record.pemohon || 'Sekretaris Jenderal Kementerian Keuangan'
  );
  const [penandaTangan, setPenandaTangan] = useState(
    record.naskahTelaahan?.penandaTangan || 'Kepala Biro Advokasi (Aloysius Yanis Dhaniarto)'
  );
  const [sifatNaskah, setSifatNaskah] = useState('Biasa');
  const [analisisHukum, setAnalisisHukum] = useState(
    record.abstraksiTelaahan?.analisisKajian || 
    'Berdasarkan kajian yuridis terhadap peraturan perundang-undangan dan dokumen pembuktian yang disampaikan, posisi hukum Kementerian Keuangan telah sesuai dengan koridor hukum yang sah.'
  );
  const [rekomendasi, setRekomendasi] = useState(
    record.abstraksiTelaahan?.rekomendasi ||
    'Disarankan agar unit pemohon melakukan koordinasi lebih lanjut dengan Biro Advokasi dan memprioritaskan penyelesaian administratif.'
  );

  // Passphrase for TTE simulation
  const [passphrase, setPassphrase] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState('');

  const handleExecuteTteAndSend = () => {
    if (!passphrase.trim()) {
      setSignError('Masukkan passphrase Sertifikat Elektronik BSrE untuk melanjutkan penandatanganan.');
      return;
    }
    setSignError('');
    setIsSigning(true);

    setTimeout(() => {
      setIsSigning(false);
      const now = new Date();
      const signedData = {
        naskahId: `NADINE-TLH-${Date.now()}`,
        nomorNaskah: nomorNaskah,
        formatTemplate: 'Nota Dinas Telaahan Kasus Hukum',
        tanggalNaskah: now.toLocaleDateString('id-ID'),
        perihal: perihal,
        tujuan: tujuan,
        penandaTangan: penandaTangan,
        sifatNaskah: sifatNaskah,
        statusNaskah: StatusNaskahTelaahan.DIKIRIM,
        tglTte: `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')} WIB`,
        tglKirim: `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')} WIB`,
        analisisHukum: analisisHukum,
        kesimpulanRekomendasi: rekomendasi,
        resumeRingkas: perihal
      };
      onSuccess(signedData);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300 animate-fadeIn">
        {/* Nadine Top Bar (Simulating Nadine Kemenkeu Header) */}
        <div className="bg-[#002D62] text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#002D62] font-black flex items-center justify-center text-sm shadow">
              N
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wider text-amber-300">NADINE KEMENKEU</div>
              <div className="text-sm font-bold text-white">Penyusunan Naskah Telaahan Kasus Hukum</div>
            </div>
          </div>

          {/* Stepper */}
          <div className="hidden md:flex items-center space-x-2 text-xs">
            <span className={`px-2.5 py-1 rounded-full font-medium ${step === 1 ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-300'}`}>
              1. Konsep Naskah
            </span>
            <span className="text-slate-400">&rarr;</span>
            <span className={`px-2.5 py-1 rounded-full font-medium ${step === 2 ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-300'}`}>
              2. Pratinjau Naskah
            </span>
            <span className="text-slate-400">&rarr;</span>
            <span className={`px-2.5 py-1 rounded-full font-medium ${step === 3 ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-300'}`}>
              3. TTE & Kirim
            </span>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Based on Step */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {step === 1 && (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-sm font-bold text-gray-900">Form Naskah Dinas Elektronik (Nota Dinas Telaahan)</h4>
                <p className="text-xs text-gray-500">Data telah diisi otomatis berdasarkan permohonan advokasi.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Nomor Rujukan Nadine (Masuk)</label>
                  <input
                    type="text"
                    disabled
                    value={record.Nomor || '-'}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-gray-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Rancangan Nomor Naskah Telaahan</label>
                  <input
                    type="text"
                    value={nomorNaskah}
                    onChange={(e) => setNomorNaskah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 font-mono focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-gray-700 mb-1">Perihal Naskah Telaahan</label>
                  <input
                    type="text"
                    value={perihal}
                    onChange={(e) => setPerihal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Tujuan / Kepada Yth.</label>
                  <input
                    type="text"
                    value={tujuan}
                    onChange={(e) => setTujuan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Sifat Naskah</label>
                  <select
                    value={sifatNaskah}
                    onChange={(e) => setSifatNaskah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Segera">Segera</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-gray-700 mb-1">Penanda Tangan Naskah</label>
                  <input
                    type="text"
                    value={penandaTangan}
                    onChange={(e) => setPenandaTangan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-gray-700 mb-1">Substansi Analisis Yuridis</label>
                  <textarea
                    rows={4}
                    value={analisisHukum}
                    onChange={(e) => setAnalisisHukum(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-gray-700 mb-1">Kesimpulan dan Rekomendasi Advokasi</label>
                  <textarea
                    rows={3}
                    value={rekomendasi}
                    onChange={(e) => setRekomendasi(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 text-xs text-gray-800 space-y-4">
              {/* Kop Nota Dinas Kemenkeu */}
              <div className="text-center border-b-2 border-double border-gray-900 pb-3">
                <p className="font-semibold text-gray-600 uppercase tracking-widest text-[11px]">KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</p>
                <p className="font-semibold text-gray-700 uppercase tracking-wider text-[11px]">SEKRETARIAT JENDERAL</p>
                <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm mt-0.5">BIRO ADVOKASI</h3>
              </div>

              <div className="text-center my-4">
                <h4 className="font-bold uppercase tracking-wider text-sm underline">NOTA DINAS</h4>
                <p className="font-mono text-gray-700 mt-1">NOMOR: {nomorNaskah}</p>
              </div>

              <div className="space-y-1 border-b border-gray-200 pb-3">
                <div className="flex"><span className="w-24 font-semibold text-gray-600">Yth.</span><span>: {tujuan}</span></div>
                <div className="flex"><span className="w-24 font-semibold text-gray-600">Dari</span><span>: {penandaTangan}</span></div>
                <div className="flex"><span className="w-24 font-semibold text-gray-600">Sifat</span><span>: {sifatNaskah}</span></div>
                <div className="flex"><span className="w-24 font-semibold text-gray-600">Hal</span><span className="font-bold">: {perihal}</span></div>
                <div className="flex"><span className="w-24 font-semibold text-gray-600">Tanggal</span><span>: {new Date().toLocaleDateString('id-ID')}</span></div>
              </div>

              <div className="space-y-3 pt-2 text-justify leading-relaxed">
                <p>
                  1. Menindaklanjuti surat permohonan Nomor: <span className="font-mono font-semibold">{record.Nomor}</span> mengenai perihal tersebut di atas, bersama ini kami sampaikan telaahan hukum sebagai berikut:
                </p>
                <div className="pl-4 space-y-2">
                  <p className="font-semibold text-gray-900">A. Analisis Kajian Hukum:</p>
                  <p className="whitespace-pre-line text-gray-700">{analisisHukum}</p>
                </div>
                <div className="pl-4 space-y-2">
                  <p className="font-semibold text-gray-900">B. Kesimpulan & Rekomendasi:</p>
                  <p className="whitespace-pre-line text-gray-700 font-medium">{rekomendasi}</p>
                </div>
                <p>
                  2. Demikian telaahan hukum ini kami sampaikan, kiranya dapat dipergunakan sebagai bahan pertimbangan lebih lanjut.
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="text-center w-72">
                  <p className="text-gray-500">Ditandatangani secara elektronik oleh:</p>
                  <div className="my-2 p-3 bg-amber-50 border border-dashed border-amber-300 rounded text-amber-800 text-[11px]">
                    [Menunggu Tanda Tangan Elektronik]
                  </div>
                  <p className="font-bold text-gray-900">{penandaTangan}</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900">Tanda Tangan Elektronik (TTE) BSrE</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Naskah akan dibubuhkan Sertifikat Elektronik Balai Sertifikasi Elektronik (BSrE) BSSN dan langsung dikirimkan kepada unit pemohon melalui aplikasi Nadine.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-gray-500">Nomor Naskah:</span> <span className="font-mono font-semibold text-gray-900">{nomorNaskah}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Penanda Tangan:</span> <span className="font-semibold text-gray-900">{penandaTangan}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Unit Tujuan:</span> <span className="text-gray-700">{tujuan}</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Passphrase Sertifikat Elektronik
                </label>
                <input
                  type="password"
                  placeholder="Masukkan Passphrase TTE..."
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-[10px] text-gray-400 mt-1">Masukkan kata sandi sertifikat elektronik Anda (contoh simulasi: 123456).</p>
                {signError && <p className="text-xs text-rose-600 mt-1">{signError}</p>}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                Setelah berhasil di-TTE dan dikirim, telaahan aktif akan <span className="font-bold">otomatis berpindah ke tab "Selesai"</span> dan salinan PDF tersimpan di Dokumen Telaahan.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                &larr; Kembali
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg"
            >
              Batal
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                Pratinjau Naskah &rarr;
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                Lanjut ke Penandatanganan (TTE) &rarr;
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={isSigning}
                onClick={handleExecuteTteAndSend}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-2"
              >
                {isSigning ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Menandatangani & Mengirim...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>TTE & Kirim Naskah Nadine</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: DOKUMEN ORGANIZER MODAL (Organize Permohonan & Data Dukung)
// =========================================================================
interface DokumenOrganizerModalProps {
  record: TelaahanRecord;
  onClose: () => void;
  onAddDocument: (doc: DokumenTelaahanItem) => void;
  onDeleteDocument: (docId: string) => void;
  onTulisNaskah?: () => void;
  onShowNotification?: (msg: string, type: 'success' | 'info' | 'error') => void;
}

const DokumenOrganizerModal: React.FC<DokumenOrganizerModalProps> = ({
  record,
  onClose,
  onAddDocument,
  onDeleteDocument,
  onTulisNaskah,
  onShowNotification
}) => {
  // Modal & Target states
  const [isNadineOpen, setIsNadineOpen] = useState(false);
  const [nadineTarget, setNadineTarget] = useState<'permohonan' | 'dukung'>('permohonan');
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'permohonan' | 'dukung' | null>(null);
  const [noDokumen, setNoDokumen] = useState('');
  const [tanggalDokumen, setTanggalDokumen] = useState('');
  const [jenisDokumen, setJenisDokumen] = useState('Surat Permohonan');
  const [deskripsiDokumen, setDeskripsiDokumen] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputError, setInputError] = useState('');

  const [previewDoc, setPreviewDoc] = useState<DokumenTelaahanItem | null>(null);

  // Compute documents for Permohonan
  const permohonanDocs: DokumenTelaahanItem[] = useMemo(() => {
    const list: DokumenTelaahanItem[] = [];
    
    // 1. Check custom documents saved with category Permohonan
    const customPermohonan = (record.dokumenTelaahan || []).filter(d => d.kategori === 'Permohonan');
    if (customPermohonan.length > 0) {
      list.push(...customPermohonan);
    }

    // 2. From record.files
    if (record.files && record.files.length > 0) {
      record.files.forEach((f, idx) => {
        // avoid duplicate if already in custom
        if (!list.some(item => item.name === f.name)) {
          list.push({
            id: `file-permohonan-${idx}`,
            name: f.name,
            nomor: record.Nomor || '-',
            tanggal: record.tanggal || '-',
            kategori: 'Permohonan',
            source: 'upload',
            size: f.size || 150000,
            type: 'application/pdf',
            deskripsi: 'Naskah dinas permohonan pemohon'
          });
        }
      });
    }

    // 3. Fallback default if empty
    if (list.length === 0) {
      list.push({
        id: 'default-permohonan-doc',
        name: 'Surat Permohonan.pdf',
        nomor: record.Nomor || '-',
        tanggal: record.tanggal || '-',
        kategori: 'Permohonan',
        source: 'upload',
        size: 185000,
        type: 'application/pdf',
        deskripsi: 'Naskah dinas rujukan pemohon'
      });
    }

    return list;
  }, [record]);

  // Compute documents for Telaahan dan Data Dukung
  const dukungDocs: DokumenTelaahanItem[] = useMemo(() => {
    const list: DokumenTelaahanItem[] = [];

    // 1. If Naskah Telaahan exists in Nadine
    if (record.naskahTelaahan?.nomorNaskah) {
      list.push({
        id: 'naskah-balasan-nadine',
        name: `Naskah Telaahan - ${record.naskahTelaahan.nomorNaskah}.pdf`,
        nomor: record.naskahTelaahan.nomorNaskah,
        tanggal: record.naskahTelaahan.tglTte || record.tanggal || '-',
        kategori: 'Naskah Telaahan',
        source: 'generate',
        size: 320000,
        type: 'application/pdf',
        deskripsi: 'Surat balasan telaahan kasus hukum resmi (Aplikasi Nadine)'
      });
    }

    // 2. All other documents with kategori !== 'Permohonan'
    const customDukung = (record.dokumenTelaahan || []).filter(d => d.kategori !== 'Permohonan');
    list.push(...customDukung);

    return list;
  }, [record]);

  const resetUploadForm = () => {
    setNoDokumen('');
    setTanggalDokumen('');
    setJenisDokumen('Data Dukung');
    setDeskripsiDokumen('');
    setSelectedFile(null);
    setDragActive(false);
    setInputError('');
    setIsUploadOpen(false);
    setUploadCategory(null);
  };

  const handleUploadClick = (category: 'permohonan' | 'dukung') => {
    setUploadCategory(category);
    setIsUploadOpen(true);
    setTanggalDokumen(new Date().toISOString().split('T')[0]);
    setJenisDokumen(category === 'permohonan' ? 'Surat Permohonan' : 'Data Dukung');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setInputError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setInputError('');
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setInputError('Silakan pilih berkas dokumen terlebih dahulu.');
      return;
    }

    const newDoc: DokumenTelaahanItem = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: selectedFile.name,
      size: selectedFile.size || 150000,
      type: selectedFile.type || 'application/pdf',
      nomor: noDokumen || undefined,
      tanggal: tanggalDokumen || new Date().toLocaleDateString('id-ID'),
      kategori: uploadCategory === 'permohonan' ? 'Permohonan' : jenisDokumen,
      deskripsi: deskripsiDokumen || undefined,
      source: 'upload'
    };

    onAddDocument(newDoc);
    resetUploadForm();
  };

  const handleGetFromNadine = (category: 'permohonan' | 'dukung') => {
    setNadineTarget(category);
    setIsNadineOpen(true);
  };

  const handleNadineData = (suratList: SuratMasukNadine[]) => {
    if (!suratList || suratList.length === 0) {
      setIsNadineOpen(false);
      return;
    }

    suratList.forEach((data) => {
      const newDoc: DokumenTelaahanItem = {
        id: `nadine-${data.naskahId || Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: `${data.perihal || 'Dokumen Nadine'}.pdf`,
        nomor: data.nomorSurat,
        tanggal: data.tanggal,
        size: 245000,
        type: 'application/pdf',
        kategori: nadineTarget === 'permohonan' ? 'Permohonan' : 'Data Dukung',
        source: 'nadine',
        deskripsi: `Ditarik dari Nadine • Unit Pengirim: ${data.unitPengirim}`
      };
      onAddDocument(newDoc);
    });

    setIsNadineOpen(false);
    onShowNotification?.(`Berhasil menarik ${suratList.length} berkas dari Nadine.`, 'success');
  };

  const renderTable = (
    title: string, 
    category: 'permohonan' | 'dukung', 
    docs: DokumenTelaahanItem[], 
    showTulisNaskah: boolean = false
  ) => {
    return (
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden mb-6 last:mb-0">
        {/* Table Card Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {docs.length} Berkas
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-1">
            {showTulisNaskah && (
              <button 
                type="button"
                onClick={() => {
                  if (onTulisNaskah) {
                    onTulisNaskah();
                  } else {
                    onShowNotification?.('Mengarahkan ke Aplikasi Nadine untuk menulis naskah...', 'info');
                  }
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-xs"
                title="Tulis Naskah Dinas di Aplikasi Nadine"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span>TULIS NASKAH</span>
              </button>
            )}

            <button 
              type="button"
              onClick={() => handleUploadClick(category)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-xs"
              title="Unggah berkas baru"
            >
              <UploadIcon className="h-4 w-4" />
              <span>UNGGAH</span>
            </button>

            <button 
              type="button"
              onClick={() => handleGetFromNadine(category)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition shadow-xs"
              title="Tarik data naskah dinas dari Aplikasi Nadine"
            >
              <CloudArrowDownIcon className="h-4 w-4" />
              <span>TARIK DATA NADINE</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider w-14">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">
                  Nama Dokumen
                </th>
                <th scope="col" className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">
                  Nomor / Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider w-28">
                  Sumber
                </th>
                <th scope="col" className="px-6 py-3 text-center font-bold text-gray-500 uppercase tracking-wider w-28">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {docs.length > 0 ? (
                docs.map((doc, index) => {
                  const src = (doc.source || (doc.type === 'generate' ? 'generate' : 'upload')).toLowerCase();
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap text-gray-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3.5 text-gray-900">
                        <div className="flex items-start space-x-2.5">
                          <DocumentTextIcon 
                            className={`h-5 w-5 mt-0.5 shrink-0 ${
                              src === 'upload' ? 'text-orange-500' : 
                              src === 'nadine' ? 'text-blue-500' : 'text-green-600'
                            }`} 
                          />
                          <div className="min-w-0">
                            <span className="block font-bold text-gray-900 hover:text-blue-600 cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                              {doc.name}
                            </span>
                            {doc.kategori && (
                              <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 mt-1 mr-2">
                                {doc.kategori}
                              </span>
                            )}
                            {doc.deskripsi && (
                              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                                {doc.deskripsi}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-gray-600">
                        {doc.nomor ? (
                          <span className="block font-semibold text-gray-800">{doc.nomor}</span>
                        ) : (
                          <span className="text-gray-400 font-light italic">-</span>
                        )}
                        {doc.tanggal && (
                          <span className="text-[11px] text-gray-400 block mt-0.5">{doc.tanggal}</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          src === 'upload' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                          src === 'nadine' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                          'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {src}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-center space-x-1.5">
                        <button 
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Lihat Dokumen"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => onShowNotification?.(`Mengunduh berkas ${doc.name}...`, 'info')}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Unduh Dokumen"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Dokumen"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                    Belum ada dokumen yang tersedia pada bagian ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-fadeIn">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2.5 bg-blue-50 text-[#0055A5] rounded-xl border border-blue-100 flex-shrink-0">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-gray-900">Manajemen Dokumen Telaahan</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {record.nomorTelaahan || record.Nomor || record.id}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate max-w-2xl" title={record.perihal}>
                {record.perihal}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Tutup Modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/70">
          
          {/* 1. Dokumen Permohonan */}
          {renderTable('Dokumen Permohonan', 'permohonan', permohonanDocs, false)}

          {/* 2. Dokumen Telaahan dan Data Dukung */}
          {renderTable('Dokumen Telaahan dan Data Dukung', 'dukung', dukungDocs, true)}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Total terorganisasi: <span className="font-semibold text-gray-800">{permohonanDocs.length + dukungDocs.length} dokumen</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition shadow-xs"
          >
            Tutup
          </button>
        </div>

      </div>

      {/* Sub-modal: Tarik Data Nadine */}
      {isNadineOpen && (
        <TarikDataNadineModal 
          isOpen={isNadineOpen}
          onClose={() => setIsNadineOpen(false)}
          onTarikData={(suratList) => handleNadineData(suratList)}
        />
      )}

      {/* Sub-modal: Unggah Berkas Dokumen */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[60] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-5">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <UploadIcon className="h-5 w-5 text-green-600" />
                <span>
                  Unggah Berkas {uploadCategory === 'permohonan' ? 'Permohonan' : 'Telaahan & Data Dukung'}
                </span>
              </h3>
              <button 
                type="button"
                onClick={resetUploadForm}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nomor Dokumen
                </label>
                <input 
                  type="text"
                  value={noDokumen}
                  onChange={(e) => setNoDokumen(e.target.value)}
                  placeholder="Contoh: ND-102/SJ.4/2026 atau No. Dokumen"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tanggal Dokumen
                  </label>
                  <input 
                    type="date"
                    value={tanggalDokumen}
                    onChange={(e) => setTanggalDokumen(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori Dokumen
                  </label>
                  <select 
                    value={jenisDokumen}
                    onChange={(e) => setJenisDokumen(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                  >
                    {uploadCategory === 'permohonan' ? (
                      <>
                        <option value="Surat Permohonan">Surat Permohonan</option>
                        <option value="Lampiran Permohonan">Lampiran Permohonan</option>
                      </>
                    ) : (
                      <>
                        <option value="Data Dukung">Data Dukung</option>
                        <option value="Naskah Telaahan">Naskah Telaahan</option>
                        <option value="Risalah Rapat">Risalah Rapat</option>
                        <option value="Kajian Hukum">Kajian Hukum</option>
                        <option value="Peraturan Terkait">Peraturan Terkait</option>
                        <option value="Lainnya">Lainnya</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Keterangan / Deskripsi
                </label>
                <textarea 
                  rows={2}
                  value={deskripsiDokumen}
                  onChange={(e) => setDeskripsiDokumen(e.target.value)}
                  placeholder="Keterangan singkat relevansi dokumen..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Berkas Dokumen (PDF, DOCX, XLSX, Maks. 25MB)
                </label>
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
                  }`}
                >
                  <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-xs text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Pilih berkas dokumen</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileChange}
                          accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg"
                        />
                      </label>
                      <p className="pl-1">atau tarik dan lepas di sini</p>
                    </div>
                    <p className="text-[10px] text-gray-400">Format PDF, DOC, DOCX hingga 25MB</p>
                  </div>
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                    <span className="font-semibold truncate max-w-xs">{selectedFile.name}</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedFile(null)} 
                      className="text-red-500 hover:text-red-700 font-bold ml-2 text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                )}
                {inputError && (
                  <p className="text-xs text-red-500 mt-1">{inputError}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetUploadForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-semibold shadow-xs"
                >
                  Simpan & Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-modal: Preview Dokumen */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[70] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 max-h-[90vh] flex flex-col border border-gray-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <div className="flex items-center space-x-2 min-w-0">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 shrink-0" />
                <h3 className="text-base font-bold text-gray-900 truncate" title={previewDoc.name}>
                  {previewDoc.name}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-100 rounded-xl p-8 flex flex-col items-center justify-center text-center border border-dashed border-gray-300">
              <DocumentTextIcon className="h-16 w-16 text-blue-400 mb-3" />
              <h4 className="text-sm font-bold text-gray-800">{previewDoc.name}</h4>
              <p className="text-xs text-gray-500 mt-1">
                Kategori: <span className="font-semibold text-gray-700">{previewDoc.kategori}</span> • Sumber: <span className="font-semibold uppercase text-blue-700">{previewDoc.source || 'Upload'}</span>
              </p>
              {previewDoc.nomor && (
                <p className="text-xs text-gray-600 font-mono mt-1">No: {previewDoc.nomor}</p>
              )}
              {previewDoc.deskripsi && (
                <p className="text-xs text-gray-500 mt-2 max-w-md bg-white p-3 rounded-lg border border-gray-200">
                  {previewDoc.deskripsi}
                </p>
              )}
              <div className="mt-5 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    onShowNotification?.(`Mengunduh berkas ${previewDoc.name}...`, 'info');
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>Unduh Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: TIM MANAGEMENT MODAL (Manage Team Members & PIC)
// =========================================================================
interface TimModalProps {
  record: TelaahanRecord;
  userAccounts: any[];
  onClose: () => void;
  onSaveTeam: (team: TeamMember[], picId: string | null) => void;
}

const TeamRoleDropdown: React.FC<{
  member: TeamMember;
  onUpdateRole: (id: string, role: TeamMember['teamRole']) => void;
}> = ({ member, onUpdateRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRole = member.teamRole || 'Viewer';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-3.5 py-1.5 text-xs font-bold rounded-full transition space-x-1.5 border shadow-2xs ${
          currentRole === 'PIC'
            ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
            : currentRole === 'Editor'
              ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
        }`}
      >
        <span>{currentRole}</span>
        <ChevronDownIcon className="h-3 w-3 opacity-70" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg z-30 border border-gray-200 py-1 overflow-hidden animate-fadeIn">
          {(['Viewer', 'Editor', 'PIC'] as const).map((role) => (
            <button
              type="button"
              key={role}
              onClick={() => {
                onUpdateRole(member.id, role);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center justify-between transition-colors ${
                currentRole === role ? 'font-bold text-blue-700 bg-blue-50/60' : 'text-gray-700'
              }`}
            >
              <span>{role}</span>
              {currentRole === role && <CheckIcon className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TimManagementModal: React.FC<TimModalProps> = ({ record, userAccounts, onClose, onSaveTeam }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickAddUser, setQuickAddUser] = useState('');

  // Initial team state normalized
  const [team, setTeam] = useState<TeamMember[]>(() => {
    return (record.team || []).map(m => {
      if (m.id === record.picId && m.teamRole !== 'PIC') {
        return { ...m, teamRole: 'PIC' as const };
      }
      return m;
    });
  });

  const [picId, setPicId] = useState<string | null>(() => {
    const picMember = (record.team || []).find(m => m.teamRole === 'PIC' || m.id === record.picId);
    return picMember ? picMember.id : ((record.team && record.team[0]) ? record.team[0].id : null);
  });

  // Keep picId in sync if roles change
  const handleUpdateRole = (id: string, newRole: TeamMember['teamRole']) => {
    setTeam(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, teamRole: newRole };
      }
      return m;
    }));

    if (newRole === 'PIC') {
      setPicId(id);
    } else if (id === picId) {
      const remainingPic = team.find(m => m.id !== id && m.teamRole === 'PIC');
      setPicId(remainingPic ? remainingPic.id : (team.filter(m => m.id !== id)[0]?.id || null));
    }
  };

  const handleRemoveMember = (id: string) => {
    const newTeam = team.filter(m => m.id !== id);
    setTeam(newTeam);
    if (id === picId) {
      const remainingPic = newTeam.find(m => m.teamRole === 'PIC');
      setPicId(remainingPic ? remainingPic.id : (newTeam[0]?.id || null));
    }
  };

  // Convert TeamMember[] to Personnel[] for AssignTeamModal
  const initialSelectedPersonnel: Personnel[] = useMemo(() => {
    return team.map(member => {
      const pRecord = ALL_PERSONNEL.find(p => p.id === member.id);
      if (pRecord) return pRecord;
      return {
        id: member.id,
        name: member.nama,
        role: member.role || 'Analis Hukum',
        eselon1: member.unit || 'Biro Advokasi, Setjen',
        eselon2: 'Bagian Advokasi Hukum'
      };
    });
  }, [team]);

  // Handle saving from AssignTeamModal
  const handleSaveFromAssignModal = (selectedPersonnel: Personnel[]) => {
    const newTeamMembers: TeamMember[] = selectedPersonnel.map(person => {
      const existing = team.find(m => m.id === person.id);
      const unit = [person.eselon4, person.eselon3, person.eselon2, person.eselon1].filter(Boolean).join(', ');
      return {
        id: person.id,
        nama: person.name,
        nip: existing?.nip || `198${Math.floor(10 + Math.random() * 89)}01012010121001`,
        unit: existing?.unit || unit,
        role: person.role,
        teamRole: existing ? existing.teamRole : 'Viewer',
      };
    });

    setTeam(newTeamMembers);

    const pic = newTeamMembers.find(m => m.teamRole === 'PIC');
    if (pic) {
      setPicId(pic.id);
    } else if (newTeamMembers.length > 0 && !picId) {
      setPicId(newTeamMembers[0].id);
    } else if (newTeamMembers.length === 0) {
      setPicId(null);
    }

    setIsAssignModalOpen(false);
  };

  // Quick Add from userAccounts
  const availableQuickUsers = useMemo(() => {
    const existingIds = new Set(team.map(m => m.id));
    return userAccounts.filter(u => !existingIds.has(u.id));
  }, [team, userAccounts]);

  const handleQuickAdd = () => {
    if (!quickAddUser) return;
    const user = userAccounts.find(u => u.id === quickAddUser);
    if (!user) return;

    const newMember: TeamMember = {
      id: user.id,
      nama: user.nama,
      nip: user.nip || '198501012010121001',
      unit: user.unit || 'Biro Advokasi, Setjen',
      role: user.roles?.[0] || 'Analis Hukum',
      teamRole: team.length === 0 ? 'PIC' : 'Editor'
    };

    const newTeam = [...team, newMember];
    setTeam(newTeam);
    if (newMember.teamRole === 'PIC' || !picId) {
      setPicId(newMember.id);
    }
    setQuickAddUser('');
  };

  // Filtered team
  const filteredTeam = team.filter(m => 
    m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.unit && m.unit.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.teamRole && m.teamRole.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activePic = team.find(m => m.id === picId || m.teamRole === 'PIC');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-fadeIn">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2.5 bg-blue-50 text-[#0055A5] rounded-xl border border-blue-100 flex-shrink-0">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                <h2 className="text-xl font-bold text-gray-900">Pengelolaan Tim Penelaah</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {record.nomorTelaahan || record.Nomor || record.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {team.length} Personel
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate max-w-2xl" title={record.perihal}>
                {record.perihal}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Tutup Modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/70 space-y-5">
          
          {/* Card Tim Bantuan Hukum (matches AssignTeam.tsx) */}
          <div className="bg-white p-6 rounded-xl shadow-2xs border border-gray-200">
            
            {/* Top Bar inside Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <UserGroupIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-800">
                    Daftar Anggota Tim
                  </h4>
                  <p className="text-xs text-gray-500">
                    Atur anggota tim penelaah kasus hukum dan tentukan peran masing-masing personel
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="bg-blue-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-xs flex items-center space-x-2 text-xs"
                >
                  <UserAddIcon className="h-4 w-4" />
                  <span>Kelola Anggota Tim</span>
                </button>
              </div>
            </div>

            {/* Quick Add Row & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="md:col-span-2 relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, peran, atau unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                />
                <SearchIcon className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {availableQuickUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <select
                    value={quickAddUser}
                    onChange={(e) => setQuickAddUser(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">+ Tambah Cepat Pegawai...</option>
                    {availableQuickUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.nama} ({u.roles?.[0] || 'Analis'})</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!quickAddUser}
                    onClick={handleQuickAdd}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 text-white rounded-lg text-xs font-semibold shadow-2xs transition shrink-0"
                  >
                    Tambah
                  </button>
                </div>
              )}
            </div>

            {/* Members List styled exactly like AssignTeam */}
            <div className="mt-4">
              {team.length === 0 ? (
                <div className="text-center py-14 text-gray-500 bg-gray-50/70 rounded-xl border border-dashed border-gray-300">
                  <UserGroupIcon className="h-14 w-14 mx-auto text-gray-300 mb-3" />
                  <p className="font-bold text-gray-700 text-base">Belum ada anggota tim yang ditugaskan</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Klik tombol <span className="font-semibold text-blue-600">"Kelola Anggota Tim"</span> untuk menambahkan personel dari basis data pegawai Kemenkeu.
                  </p>
                </div>
              ) : filteredTeam.length > 0 ? (
                <ul className="space-y-3">
                  {filteredTeam.map((member) => (
                    <li 
                      key={member.id} 
                      className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-xs hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-center min-w-0 pr-3">
                        <div className="bg-blue-100 rounded-full p-2 mr-3 text-blue-600 shrink-0">
                          <UserCircleIcon className="h-6 w-6"/>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                              {member.nama}
                            </p>
                            {member.teamRole === 'PIC' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                PIC UTAMA
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">
                            {member.role || 'Analis Hukum'} • {member.unit || 'Biro Advokasi'}
                          </p>
                          {member.nip && (
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                              NIP: {member.nip}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        {/* Interactive Role Dropdown */}
                        <TeamRoleDropdown member={member} onUpdateRole={handleUpdateRole} />

                        <div className="h-6 w-[1px] bg-gray-200"></div>

                        {/* Remove Member Button */}
                        <button 
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title={`Hapus ${member.nama} dari tim`}
                          aria-label={`Remove ${member.nama}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="font-bold text-gray-700 text-sm">Tidak ada anggota tim yang cocok dengan kata kunci pencarian.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="font-semibold text-gray-700">PIC Aktif:</span>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-bold">
              {activePic ? activePic.nama : 'Belum Ditentukan'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-semibold text-gray-700">{team.length} Anggota Ditugaskan</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveTeam(team, picId);
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              Simpan Perubahan Tim
            </button>
          </div>
        </div>

      </div>

      {/* Embedded AssignTeamModal for selecting personnel */}
      {isAssignModalOpen && (
        <AssignTeamModal 
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onSave={handleSaveFromAssignModal}
          initialSelectedMembers={initialSelectedPersonnel}
        />
      )}

    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: SET SELESAI MODAL
// =========================================================================
interface SetSelesaiModalProps {
  record: TelaahanRecord;
  onClose: () => void;
  onConfirm: (status: StatusTelaahan, catatan?: string) => void;
}

const SetSelesaiModal: React.FC<SetSelesaiModalProps> = ({ record, onClose, onConfirm }) => {
  const isCurrentlyAktif = record.statusTelaahan === StatusTelaahan.AKTIF;
  const [catatan, setCatatan] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircleIcon className="h-6 w-6" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900">
            {isCurrentlyAktif ? 'Tandai Telaahan Selesai?' : 'Aktifkan Kembali Telaahan?'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {isCurrentlyAktif
              ? `Telaahan "${record.nomorTelaahan || record.Nomor}" akan dipindahkan ke tab Selesai.`
              : `Telaahan "${record.nomorTelaahan || record.Nomor}" akan diaktifkan kembali ke tab Aktif.`}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Catatan Penyelesaian (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder="Masukkan ringkasan tindak lanjut atau keterangan penyelesaian..."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(isCurrentlyAktif ? StatusTelaahan.SELESAI : StatusTelaahan.AKTIF, catatan)}
            className={`flex-1 py-2.5 text-white text-xs font-semibold rounded-xl shadow-sm transition ${
              isCurrentlyAktif ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isCurrentlyAktif ? 'Ya, Set Selesai' : 'Ya, Aktifkan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelaahanKasusHukum;
