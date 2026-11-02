import React, { useState, useRef } from 'react';
import { 
  TelaahanRecord, StatusTelaahan, StatusNaskahTelaahan, DokumenTelaahanItem, 
  TeamMember, View 
} from '../types';
import Breadcrumb from './Breadcrumb';
import DocumentTable from './eadvo_DocumentTable';
import { 
  ArrowLeftIcon, ScaleIcon, DocumentTextIcon, PrintIcon, 
  XIcon, EyeIcon, DownloadIcon, UserGroupIcon, CheckCircleIcon,
  InformationCircleIcon
} from './icons';

export interface DetailTelaahanProps {
  record: TelaahanRecord | any;
  onBack?: () => void;
  onNavigate?: (view: View, record?: any) => void;
  isModal?: boolean;
  onClose?: () => void;
  onOpenModul?: () => void;
}

type DetailTab = 'informasi' | 'dokumen' | 'riwayat';

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

export const DetailTelaahan: React.FC<DetailTelaahanProps> = ({
  record,
  onBack,
  onNavigate,
  isModal = false,
  onClose,
  onOpenModul
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('informasi');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!record) {
    return (
      <div className="p-8 text-center text-gray-500">
        Data telaahan tidak ditemukan.
        {onBack && (
          <div className="mt-4">
            <button onClick={onBack} className="text-blue-600 underline font-semibold">Kembali</button>
          </div>
        )}
      </div>
    );
  }

  // Normalize data access from either full TelaahanRecord or enriched monitoring record
  const nomorSurat = record.Nomor || record.nomor || record.nomorTelaahan || record.id || '-';
  const nomorTelaahan = record.nomorTelaahan || record.nomor || record.Nomor || record.id;
  const tanggalSurat = record.tanggal || '-';
  const namaPengirim = record.pemohon || record.pengirim || '-';
  const unitPengirim = record.unit || record.pengirim || '-';
  const perihal = record.perihal || record.naskahTelaahan?.perihal || '-';
  const tahunMasuk = record.tahunMasuk || (record.tanggal ? record.tanggal.split('/')[2] || record.tanggal.split('-')[0] : '2026');
  
  const statusTelaahan = record.statusTelaahan || (record.statusPosisi === 'Terkirim' ? 'Selesai' : 'Aktif');
  const statusPosisi = record.statusPosisi || (statusTelaahan === 'Selesai' ? 'Terkirim' : 'Konsep Telaahan');
  const statusNaskah = record.naskahTelaahan?.statusNaskah || record.statusNaskah || (statusTelaahan === 'Selesai' ? 'TTE Nadine Selesai' : 'Konsep Telaahan');
  const nomorNaskah = record.naskahTelaahan?.nomorNaskah || record.nomorNaskah || '';
  const tglTte = record.naskahTelaahan?.tglTte || record.tglTte || '';

  const urgensi = record.abstraksiTelaahan?.tingkatUrgensi || record.urgensi || 'Biasa';
  const kategoriHukum = record.abstraksiTelaahan?.kategoriHukum || record.kategoriHukum || 'Hukum Perdata / TUN';

  const pokokPermasalahan = record.abstraksiTelaahan?.pokokPermasalahan || record.pokokPerkara || record.naskahTelaahan?.resumeRingkas || record.uraian || 'Tidak ada uraian spesifik.';
  const faktaHukum = record.abstraksiTelaahan?.faktaHukum || record.faktaHukum || record.naskahTelaahan?.resumeRingkas || '';
  const dasarHukum = record.abstraksiTelaahan?.dasarHukum || record.dasarHukum || record.naskahTelaahan?.dasarHukum || [];
  const analisisKajian = record.abstraksiTelaahan?.analisisKajian || record.abstraksiAnalisis || record.naskahTelaahan?.analisisHukum || record.analisisHukum || '';
  const rekomendasi = record.abstraksiTelaahan?.rekomendasi || record.kesimpulanRekomendasi || record.naskahTelaahan?.kesimpulanRekomendasi || record.naskahTelaahan?.rekomendasi || '';

  // Dokumen permohonan
  const permohonanDocs = [
    ...(record.files || []).map((f: any, idx: number) => ({
      id: `file-${idx}`,
      name: f.name || `Lampiran_${idx + 1}.pdf`,
      kategori: 'Permohonan',
      nomor: nomorSurat,
      tanggal: tanggalSurat,
      sumber: 'Nadine Kemenkeu',
      size: f.size || 245000,
    })),
    ...(record.dokumenTelaahan || []).filter((d: any) => d.kategori === 'Permohonan').map((d: any) => ({
      id: d.id,
      name: d.name,
      kategori: 'Permohonan',
      nomor: nomorSurat,
      tanggal: d.tanggal || tanggalSurat,
      sumber: 'Upload',
      size: d.size || 102400,
    }))
  ];

  // Dokumen telaahan dan data dukung
  const telaahanDanDukungDocs = [
    ...(nomorNaskah ? [{
      id: 'naskah-balasan',
      name: `Naskah Telaahan - ${nomorNaskah}.pdf`,
      kategori: 'Naskah Balasan (Nadine)',
      nomor: nomorNaskah,
      tanggal: tglTte || tanggalSurat,
      sumber: 'Nadine',
      size: 320000,
    }] : []),
    ...(record.dokumenTelaahan || []).filter((d: any) => d.kategori !== 'Permohonan').map((d: any) => ({
      id: d.id,
      name: d.name,
      kategori: d.kategori || 'Data Dukung',
      nomor: d.nomor || '-',
      tanggal: d.tanggal || tanggalSurat,
      sumber: 'Upload',
      size: d.size || 102400,
    }))
  ];

  // Fallback if no documents exist in array
  if (permohonanDocs.length === 0 && telaahanDanDukungDocs.length === 0) {
    permohonanDocs.push({
      id: 'doc-default-permohonan',
      name: `Surat_Permohonan_${nomorSurat.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      kategori: 'Permohonan',
      nomor: nomorSurat,
      tanggal: tanggalSurat,
      sumber: 'Nadine Kemenkeu',
      size: 342000
    });
    telaahanDanDukungDocs.push({
      id: 'doc-default-dukung',
      name: `Data_Dukung_Kronologi_Kasus.pdf`,
      kategori: 'Data Dukung',
      nomor: '-',
      tanggal: tanggalSurat,
      sumber: 'Upload',
      size: 1450000
    });
  }

  // Tim Penelaah
  const teamList = record.team && record.team.length > 0 
    ? record.team 
    : [
        { 
          id: 't-pic', 
          nama: record.pic || 'Hendra Cahyono', 
          nip: '198505122008011003', 
          unit: 'Biro Advokasi, Setjen', 
          role: 'Koordinator Advokasi III', 
          teamRole: 'PIC' 
        },
        { 
          id: 't-editor', 
          nama: 'Arlina Haryuningsih', 
          nip: '198902142012012002', 
          unit: 'Biro Advokasi, Setjen', 
          role: 'Analis Hukum Ahli Muda', 
          teamRole: 'Editor' 
        }
      ];

  const sortedTeam = [...teamList].sort((a: any, b: any) => {
    if (a.id === record.picId || a.teamRole === 'PIC') return -1;
    if (b.id === record.picId || b.teamRole === 'PIC') return 1;
    return (a.nama || '').localeCompare(b.nama || '');
  });

  // Audit trail
  const auditTrailEntries = [
    ...(record.history || []).map((h: any, i: number) => ({
      id: `hist-${i}`,
      time: h.timestamp ? new Date(h.timestamp).toLocaleString('id-ID', { hour12: false }).replace(/\./g, '/') : tanggalSurat,
      user: h.author || 'Administrator',
      action: h.message || 'Pembaruan data telaahan',
      status: 'Tercatat'
    })),
    ...(statusTelaahan === StatusTelaahan.SELESAI || statusTelaahan === 'Selesai' ? [{
      id: 'audit-selesai',
      time: tanggalSurat,
      user: 'PIC / Koordinator Advokasi',
      action: 'Telaahan kasus hukum dinyatakan Selesai dan berkas diarsipkan.',
      status: 'Selesai'
    }] : []),
    ...(tglTte ? [{
      id: 'audit-tte',
      time: tglTte,
      user: 'Kepala Bagian Advokasi',
      action: `Penerbitan TTE Naskah Telaahan Nadine No. ${nomorNaskah || '-'}.`,
      status: 'Terkirim'
    }] : []),
    ...(teamList.length > 0 ? [{
      id: 'audit-tim',
      time: tanggalSurat,
      user: 'Administrator Advokasi',
      action: `Penugasan ${teamList.length} anggota tim penelaah hukum dengan PIC: ${sortedTeam[0]?.nama || 'PIC'}.`,
      status: 'Penugasan Tim'
    }] : []),
    {
      id: 'audit-registrasi',
      time: tanggalSurat,
      user: namaPengirim || 'Nadine Kemenkeu',
      action: `Penerimaan permohonan naskah dinas telaahan kasus hukum No. ${nomorSurat}.`,
      status: 'Surat Masuk'
    }
  ];

  const getUrgensiBadge = (urg: string) => {
    switch (urg) {
      case 'Sangat Segera':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Sangat Segera</span>;
      case 'Segera':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Segera</span>;
      case 'Penting':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Penting</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-0.5 rounded-full font-medium">Biasa</span>;
    }
  };

  const getStatusPosisiBadge = () => {
    if (statusPosisi === 'Terkirim' || statusTelaahan === 'Selesai') {
      return (
        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Terkirim (Selesai)</span>
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <span>Konsep Telaahan</span>
      </span>
    );
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const renderTabContent = () => (
    <div className="space-y-6 animate-fadeIn">
        {/* TAB 1: INFORMASI UMUM */}
        {activeTab === 'informasi' && (
          <div className="space-y-6">
            <DetailSection title="Informasi Umum">
              <DetailRow label="Tahun Masuk" value={tahunMasuk} />
              <DetailRow label="Nomor Surat" value={nomorSurat} />
              <DetailRow label="Tanggal Surat" value={tanggalSurat} />
              <DetailRow label="Nama Pengirim" value={namaPengirim} />
              <DetailRow label="Unit Pengirim" value={unitPengirim} />
              <DetailRow label="Perihal" value={perihal} />
              <DetailRow 
                label="Status Posisi" 
                value={
                  <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                    {getStatusPosisiBadge()}
                    {nomorNaskah && (
                      <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200" title="Nomor Naskah Telaahan">
                        {nomorNaskah}
                      </span>
                    )}
                    {tglTte && (
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                        TTE: {tglTte.split(' ')[0]}
                      </span>
                    )}
                  </div>
                } 
              />
              <DetailRow label="Tingkat Urgensi" value={getUrgensiBadge(urgensi)} />
              <DetailRow 
                label="Kategori Bidang Hukum" 
                value={
                  <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold">
                    {kategoriHukum}
                  </span>
                } 
              />
              {record.nomorPerkara && (
                <DetailRow 
                  label="Perkara Terkait" 
                  value={
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-mono font-bold text-blue-700">{record.nomorPerkara}</span>
                      <span className="text-xs text-gray-500">• {record.jenisPerkara || 'Litigasi'}</span>
                      <span className="text-xs text-gray-500">• {record.tingkatPengadilan || '-'}</span>
                    </div>
                  } 
                />
              )}
            </DetailSection>

            <DetailSection title="Summary Naskah">
              <DetailRow 
                label="Pokok Permasalahan" 
                value={
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                    {pokokPermasalahan}
                  </div>
                } 
              />
              
              {faktaHukum && (
                <DetailRow 
                  label="Fakta Hukum & Kronologi" 
                  value={
                    <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                      {faktaHukum}
                    </div>
                  } 
                />
              )}

              {dasarHukum && (Array.isArray(dasarHukum) ? dasarHukum.length > 0 : !!dasarHukum) && (
                <DetailRow 
                  label="Dasar Peraturan Perundang-undangan" 
                  value={
                    Array.isArray(dasarHukum) ? (
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                        {dasarHukum.map((dh: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">{dh}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                        {dasarHukum}
                      </div>
                    )
                  } 
                />
              )}

              {analisisKajian && (
                <DetailRow 
                  label="Analisis Yuridis & Kajian Hukum" 
                  value={
                    <div className="whitespace-pre-wrap leading-relaxed text-gray-800 bg-blue-50/30 p-3.5 rounded-lg border border-blue-100">
                      {analisisKajian}
                    </div>
                  } 
                />
              )}

              {rekomendasi && (
                <DetailRow 
                  label="Kesimpulan & Rekomendasi Advokasi" 
                  value={
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-medium whitespace-pre-wrap leading-relaxed">
                      {rekomendasi}
                    </div>
                  } 
                />
              )}
            </DetailSection>
          </div>
        )}

        {/* TAB 2: DOKUMEN */}
        {activeTab === 'dokumen' && (
          <div className="space-y-6">
            <DocumentTable
              title="1. Dokumen Permohonan"
              categoryContext="permohonan"
              items={permohonanDocs}
            />

            <DocumentTable
              title="2. Dokumen Telaahan dan Data Dukung"
              categoryContext="telaahan"
              items={telaahanDanDukungDocs}
            />
          </div>
        )}

        {/* TAB 3: RIWAYAT */}
        {activeTab === 'riwayat' && (
          <div className="space-y-6">
            {/* Susunan Anggota Tim */}
            <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-800 text-sm">Susunan Anggota Tim</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {sortedTeam.length} Personel
                  </span>
                </div>
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
                      sortedTeam.map((member: any, index: number) => {
                        const isPic = member.id === record.picId || member.teamRole === 'PIC';
                        return (
                          <tr key={member.id || index} className={isPic ? 'bg-amber-50/50' : 'hover:bg-gray-50'}>
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
                            <td className="px-5 py-3.5 text-gray-600 font-mono">{member.nip || '-'}</td>
                            <td className="px-5 py-3.5 text-gray-600">{member.unit || '-'}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`px-2 py-0.5 inline-flex text-[11px] font-semibold rounded-full ${
                                member.teamRole === 'Editor' 
                                  ? 'bg-green-100 text-green-800' 
                                  : isPic 
                                    ? 'bg-amber-100 text-amber-800'
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
                    {auditTrailEntries.map((entry: any) => (
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
    );

  const renderPrintModal = () => (
    showPrintModal ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PrintIcon className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Pratinjau & Cetak Resume Telaahan Kasus Hukum</h3>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-white">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white" ref={printableRef}>
              {/* Kop Surat */}
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
                  NOMOR: {nomorTelaahan}
                </p>
              </div>

              {/* Tabel Identitas */}
              <div className="space-y-4 text-xs text-gray-800 leading-relaxed">
                <table className="w-full border border-gray-300 mb-4">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="w-1/3 bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Unit Pemohon</td>
                      <td className="p-2 font-medium">{unitPengirim}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Surat Rujukan Pemohon (Nadine)</td>
                      <td className="p-2 font-medium">{nomorSurat} ({tanggalSurat})</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Perihal Permohonan</td>
                      <td className="p-2 font-semibold text-gray-900">{perihal}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Kategori & Urgensi</td>
                      <td className="p-2 font-medium">
                        {kategoriHukum} • Tingkat: {urgensi}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-gray-50 p-2 font-semibold text-gray-700 border-r border-gray-300">Status Penelaahan</td>
                      <td className="p-2 font-bold text-blue-900">{statusTelaahan} (Naskah: {statusNaskah})</td>
                    </tr>
                  </tbody>
                </table>

                {/* Ringkasan Pokok Permasalahan */}
                <div className="border border-gray-300 p-4 rounded bg-slate-50">
                  <h4 className="font-bold text-gray-900 uppercase text-xs mb-1">I. Pokok Permasalahan Hukum</h4>
                  <p className="whitespace-pre-wrap">{pokokPermasalahan}</p>
                </div>

                {/* Fakta Hukum */}
                {faktaHukum && (
                  <div className="border border-gray-300 p-4 rounded bg-white">
                    <h4 className="font-bold text-gray-900 uppercase text-xs mb-1">II. Fakta Hukum & Kronologi</h4>
                    <p className="whitespace-pre-wrap">{faktaHukum}</p>
                  </div>
                )}

                {/* Dasar Hukum */}
                {dasarHukum && (Array.isArray(dasarHukum) ? dasarHukum.length > 0 : !!dasarHukum) && (
                  <div className="border border-gray-300 p-4 rounded bg-white">
                    <h4 className="font-bold text-gray-900 uppercase text-xs mb-1">III. Dasar Peraturan Perundang-undangan</h4>
                    {Array.isArray(dasarHukum) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {dasarHukum.map((dh: string, idx: number) => (
                          <li key={idx}>{dh}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="whitespace-pre-wrap">{dasarHukum}</p>
                    )}
                  </div>
                )}

                {/* Analisis Yuridis */}
                {analisisKajian && (
                  <div className="border border-gray-300 p-4 rounded bg-white">
                    <h4 className="font-bold text-gray-900 uppercase text-xs mb-1">IV. Analisis Yuridis & Pertimbangan Hukum</h4>
                    <p className="whitespace-pre-wrap">{analisisKajian}</p>
                  </div>
                )}

                {/* Rekomendasi */}
                {rekomendasi && (
                  <div className="border border-gray-300 p-4 rounded bg-emerald-50 text-emerald-950">
                    <h4 className="font-bold uppercase text-xs mb-1 text-emerald-900">V. Kesimpulan & Rekomendasi</h4>
                    <p className="whitespace-pre-wrap font-medium">{rekomendasi}</p>
                  </div>
                )}

                {/* Tanda Tangan */}
                <div className="mt-8 pt-4 flex justify-end">
                  <div className="text-center w-64">
                    <p className="text-xs text-gray-700">Jakarta, {tanggalSurat}</p>
                    <p className="text-xs font-bold text-gray-800 mt-1">Koordinator / Penelaah Hukum</p>
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-[10px] text-gray-400 italic">[Ditandatangani Secara Elektronik]</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 underline">{sortedTeam[0]?.nama || 'Penelaah Hukum'}</p>
                    <p className="text-[10px] text-gray-500 font-mono">NIP {sortedTeam[0]?.nip || '198505122008011003'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-100 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0055A5] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
              >
                <PrintIcon className="h-4 w-4" />
                <span>Cetak Resume</span>
              </button>
            </div>
        </div>
      </div>
    ) : null
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-fadeIn">
          {/* Header Modal */}
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2.5 bg-blue-50 text-[#0055A5] rounded-xl border border-blue-100 flex-shrink-0">
                <ScaleIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <h2 className="text-xl font-bold text-gray-900">Detail Telaahan Kasus Hukum</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    {nomorTelaahan}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    statusTelaahan === StatusTelaahan.AKTIF || statusTelaahan === 'Aktif'
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {statusTelaahan}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 max-w-2xl truncate" title={perihal}>
                  {perihal}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition shadow-2xs"
                title="Cetak / Unduh Resume"
              >
                <PrintIcon className="h-4 w-4" />
                <span>Download Resume / Cetak</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  title="Tutup Modal"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-white px-6 flex-shrink-0">
            <nav className="-mb-px flex space-x-8" aria-label="Detail Tabs">
              <button
                onClick={() => setActiveTab('informasi')}
                className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === 'informasi'
                    ? 'border-[#0055A5] text-[#0055A5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Informasi Umum</span>
              </button>
              
              <button
                onClick={() => setActiveTab('dokumen')}
                className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === 'dokumen'
                    ? 'border-[#0055A5] text-[#0055A5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Dokumen</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  activeTab === 'dokumen' ? 'bg-blue-100 text-[#0055A5]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {permohonanDocs.length + telaahanDanDukungDocs.length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('riwayat')}
                className={`py-3.5 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === 'riwayat'
                    ? 'border-[#0055A5] text-[#0055A5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Riwayat</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  activeTab === 'riwayat' ? 'bg-blue-100 text-[#0055A5]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {sortedTeam.length} Tim
                </span>
              </button>
            </nav>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/60">
            {renderTabContent()}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="font-semibold text-gray-700">Status Posisi:</span>
              {getStatusPosisiBadge()}
              {nomorNaskah && (
                <span className="font-mono text-gray-500">
                  ({nomorNaskah})
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition flex items-center space-x-1.5"
              >
                <PrintIcon className="h-4 w-4" />
                <span>Print Resume</span>
              </button>
              
              {onOpenModul && (
                <button
                  onClick={onOpenModul}
                  className="px-4 py-2 bg-[#0055A5] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-2xs"
                >
                  Buka Modul Telaahan
                </button>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
        {renderPrintModal()}
      </div>
    );
  }

  // Full-page standard View (eAdvokasiTelaahanDetail)
  return (
    <div className="p-8 bg-white h-full flex flex-col print:p-0">
      <Breadcrumb currentView="eAdvokasiTelaahanDetail" onNavigate={onNavigate} />
      <header className="flex-shrink-0 mb-6 flex justify-between items-start border-b border-gray-100 pb-4 print:mb-4">
        <div className="flex items-start">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors mr-3 mt-1 print:hidden"
              title="Kembali"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <h1 className="text-2xl font-bold text-gray-800 print:text-xl">Informasi Telaahan Kasus Hukum</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                {nomorTelaahan}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                statusTelaahan === StatusTelaahan.AKTIF || statusTelaahan === 'Aktif'
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {statusTelaahan}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {nomorSurat} - {perihal}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md print:hidden text-sm font-semibold"
            title="Download Resume / Cetak"
          >
            <PrintIcon className="h-5 w-5" />
            <span>Download Resume / Cetak</span>
          </button>
          {onOpenModul && (
            <button
              onClick={onOpenModul}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition print:hidden"
            >
              Buka Modul Telaahan
            </button>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6 print:hidden">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('informasi')}
            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
              activeTab === 'informasi'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Informasi Umum</span>
          </button>
          
          <button
            onClick={() => setActiveTab('dokumen')}
            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
              activeTab === 'dokumen'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Dokumen</span>
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
              activeTab === 'dokumen' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {permohonanDocs.length + telaahanDanDukungDocs.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
              activeTab === 'riwayat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Riwayat</span>
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
              activeTab === 'riwayat' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {sortedTeam.length} Tim
            </span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pr-2 space-y-6">
        {renderTabContent()}
      </main>

      {renderPrintModal()}
    </div>
  );
};

export default DetailTelaahan;
