
import React, { useState } from 'react';
import { PendampinganRecord, FileData, PosisiUpdate, Riwayat, View } from '../types';
import { ArrowLeftIcon, EyeIcon, DocumentTextIcon, DownloadIcon, XIcon, PrintIcon, UserGroupIcon } from './icons';
import Breadcrumb from './Breadcrumb';
import DocumentTable from './eadvo_DocumentTable';

type DetailTab = 'informasi' | 'posisi' | 'dokumen' | 'riwayat';

const TabButton: React.FC<{ name: DetailTab, label: string, activeTab: DetailTab, setActiveTab: (tab: DetailTab) => void }> = ({ name, label, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`whitespace-nowrap py-3 px-1 mr-8 border-b-2 font-semibold text-sm ${
            activeTab === name
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
    >
        {label}
    </button>
);

const DetailRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col md:flex-row border-b border-gray-100 last:border-0 py-2.5 md:py-3">
        <span className="text-sm font-medium text-gray-500 w-full md:w-1/4 flex-shrink-0 mb-1 md:mb-0 pr-4">{label}</span>
        <span className="text-sm text-gray-800">{value || '-'}</span>
    </div>
);


const InformasiUmumTab: React.FC<{ record: PendampinganRecord }> = ({ record }) => {
    const { abstraksi } = record;
    if (!abstraksi) return <p className="text-center text-gray-500 py-8">Data abstraksi tidak tersedia.</p>;

    const PihakTable = ({ title, data }: { title: string, data: any[] }) => (
        <div className="border border-gray-300 rounded-md mb-6">
            <h3 className="px-4 py-2 bg-gray-100 font-semibold text-gray-700 border-b border-gray-300 rounded-t-md">{title}</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">No</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Nama Pihak</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Jabatan / Keterangan</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data && data.length > 0 ? data.map((p, i) => (
                            <tr key={p.id}>
                                <td className="px-4 py-2.5">{i + 1}</td>
                                <td className="px-4 py-2.5 font-medium">{p.nama}</td>
                                <td className="px-4 py-2.5">{p.jabatan}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-500 italic">Tidak ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="border border-gray-300 rounded-md">
                <h3 className="px-4 py-2 bg-gray-100 font-semibold text-gray-700 border-b border-gray-300 rounded-t-md">Informasi Umum</h3>
                <div className="p-4">
                    
                            <DetailRow label="Tahun Masuk" value={abstraksi.tahunMasuk} />
                            <DetailRow label="Nomor Tiket / Surat Permohonan" value={abstraksi.nomorTiket} />
                            <DetailRow label="Unit Pemohon" value={abstraksi.unitPemohon} />
                            <DetailRow label="Unit Pemanggil" value={abstraksi.unitPemanggil} />
                            <DetailRow label="Wilayah" value={abstraksi.wilayah} />
                            <DetailRow label="Jenis Pokok Perkara" value={abstraksi.jenisPokokPerkara} />
                            <DetailRow label="Sub Pokok Perkara" value={abstraksi.subPokokPerkara} />
                            <DetailRow label="Sub-Sub Pokok Perkara" value={abstraksi.subSubPokokPerkara} />
                            <DetailRow label="Rincian Pokok Permasalahan" value={<div className="whitespace-pre-wrap">{abstraksi.pokokPermasalahan}</div>} />
                            <DetailRow label="Tags" value={abstraksi.tags && abstraksi.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5 mt-0.5">
                                    {abstraksi.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ) : '-'} />
                        
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PihakTable title="Pihak Terpanggil" data={abstraksi.pihakTerpanggil || []} />
                <PihakTable title="Pihak Pemanggil" data={abstraksi.pihakPemanggil || []} />
            </div>

            <div className="border border-gray-300 rounded-md">
                <h3 className="px-4 py-2 bg-gray-100 font-semibold text-gray-700 border-b border-gray-300 rounded-t-md">Informasi Pihak Terpanggil</h3>
                <div className="p-4 space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider text-orange-600 flex items-center">
                            <span className="w-1 h-3 bg-orange-600 mr-2 rounded-full"></span>
                            Informasi Awal
                        </h4>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[100px] border border-gray-100 shadow-sm">
                            {abstraksi.analisaKasus?.informasiAwal || '-'}
                        </div>
                    </div>
                    
                    {abstraksi.analisaKasus?.informasiPihakTerpanggil && abstraksi.analisaKasus.informasiPihakTerpanggil.length > 0 && (
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider text-orange-600 flex items-center border-t border-gray-100 pt-6">
                                <span className="w-1 h-3 bg-orange-600 mr-2 rounded-full"></span>
                                Keterangan Pihak Terpanggil
                            </h4>
                            {abstraksi.analisaKasus.informasiPihakTerpanggil.map((info: any, idx: number) => {
                                const pihak = abstraksi.pihakTerpanggil?.find(p => p.id === info.pihakId);
                                return (
                                    <div key={info.id || idx} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                                                Informasi dari {pihak?.nama || 'Pihak Terpanggil'} {pihak?.jabatan ? `(${pihak.jabatan})` : ''}
                                            </span>
                                        </div>
                                        <div className="p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                            {info.keterangan || '-'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PosisiPendampinganTab: React.FC<{ posisi: PosisiUpdate[] }> = ({ posisi }) => {
    if (!posisi || posisi.length === 0) return <p className="text-center text-gray-500 py-8">Belum ada pembaruan posisi.</p>;
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString('id-ID', {day: 'numeric', month:'long', year:'numeric'});
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 uppercase tracking-wider text-[10px] text-gray-500">
                    <tr>
                        <th className="px-4 py-3 text-left font-bold">No</th>
                        <th className="px-4 py-3 text-left font-bold">Surat Tugas</th>
                        <th className="px-4 py-3 text-left font-bold">Agenda & Waktu</th>
                        <th className="px-4 py-3 text-left font-bold">Pihak & Surat Pemanggilan</th>
                        <th className="px-4 py-3 text-left font-bold">Posisi Kasus</th>
                        <th className="px-4 py-3 text-left font-bold">Rincian Pelaksanaan</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {posisi.map((p, index) => (
                        <tr key={p.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-4 py-4 text-sm text-gray-800">
                                {p.suratTugas}
                                <div className="text-xs text-gray-500">{formatDate(p.tanggalSuratTugas)}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                                {p.agenda}
                                <div className="text-xs text-gray-500 mt-1">{formatDate(p.tanggalAgenda)}</div>
                                <div className="text-[10px] text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">{p.durasi} Menit</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-800">
                                <div className="mb-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Pemanggil</span> 
                                    {Array.isArray(p.pemanggil) ? p.pemanggil.filter(Boolean).join(', ') : p.pemanggil}
                                </div>
                                <div className="mb-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Terpanggil</span> 
                                    {Array.isArray(p.terpanggil) ? p.terpanggil.filter(Boolean).join(', ') : p.terpanggil}
                                </div>
                                <div><span className="text-[10px] uppercase font-bold text-gray-400 block">Surat Pemanggilan</span> {p.suratPemanggilan}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-800 font-semibold">{p.posisiKasus}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                                <div className="line-clamp-2">{p.rincian}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DokumenTab: React.FC<{ record: PendampinganRecord }> = ({ record }) => {
    const allFiles = record.files || [];
    const permohonanDocs = allFiles.map((f, i) => ({
        id: `f-${i}`,
        nama: f.name,
        nomor: record.Nomor || '-',
        tanggal: record.tanggal || '-',
        deskripsi: f.deskripsi || 'Dokumen berkas permohonan & pemanggilan pendampingan',
        size: f.size,
        jenis: f.type ? (f.type.split('/')[1] || 'PDF') : 'PDF',
        tags: f.tags || ['Permohonan', 'Pendampingan']
    }));

    return (
        <div className="max-w-6xl mx-auto py-6 space-y-6">
            <div className="mb-2 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Manajemen Dokumen Pendampingan</h2>
            </div>
            <DocumentTable
                title="1. Dokumen Permohonan & Pemanggilan"
                categoryContext="permohonan"
                items={permohonanDocs}
                emptyMessage="Belum ada dokumen permohonan & pemanggilan."
            />
            <DocumentTable
                title="2. Dokumen Pendampingan & Data Dukung"
                categoryContext="litigasi"
                items={[]}
                emptyMessage="Belum ada dokumen pendampingan & data dukung."
            />
            <DocumentTable
                title="3. Dokumen Laporan"
                categoryContext="laporan"
                items={[]}
                emptyMessage="Belum ada dokumen laporan."
            />
        </div>
    );
};

const RiwayatTab: React.FC<{ record: PendampinganRecord }> = ({ record }) => {
    const { team, picId, auditTrail } = record;

    const formatAuditTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'long',
            timeStyle: 'medium',
        }).format(date);
    }

    const TeamTable = () => {
        if (!team || team.length === 0) {
            return (
                <div className="text-center py-10 text-gray-500 border border-gray-200 rounded-lg">
                    <p>Tim belum dibentuk untuk pendampingan ini.</p>
                </div>
            );
        }
        
        const sortedTeam = [...team].sort((a, b) => {
            if (a.id === picId) return -1;
            if (b.id === picId) return 1;
            return a.nama.localeCompare(b.nama);
        });

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <h3 className="px-4 py-3 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                    Susunan Anggota Tim
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">No</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedTeam.map((member, index) => (
                            <tr key={member.id} className={member.id === picId ? 'bg-yellow-50' : ''}>
                                <td className="px-4 py-4 text-sm">{index + 1}</td>
                                <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                    {member.nama}
                                    {member.id === picId && <span className="ml-2 text-xs font-bold text-yellow-800 bg-yellow-300 px-2 py-0.5 rounded-full">PIC</span>}
                                </td>
                                <td className="px-4 py-4 text-sm">{member.nip}</td>
                                <td className="px-4 py-4 text-sm">{member.unit}</td>
                                <td className="px-4 py-4 text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.teamRole === 'Editor' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {member.teamRole}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    const AuditTrailTable = () => {
         if (!auditTrail || auditTrail.length === 0) {
            return (
                <div className="text-center py-10 text-gray-500 border border-gray-200 rounded-lg">
                    <p>Tidak ada riwayat aktivitas.</p>
                </div>
            );
        }
        
        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <h3 className="px-4 py-3 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                    Riwayat (Audit Trail)
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uraian</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[...(auditTrail || [])].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((entry) => (
                            <tr key={entry.id}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatAuditTimestamp(entry.timestamp)}</td>
                                <td className="px-4 py-4 text-sm text-gray-800">
                                    <span className="font-semibold">{entry.user}</span> {entry.action} <span className="font-medium text-gray-600">{entry.details}</span>.
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <TeamTable />
            <AuditTrailTable />
        </div>
    );
};


export interface DetailPendampinganProps {
  record: PendampinganRecord | any;
  onBack?: () => void;
  onNavigate?: (view: View, record?: any) => void;
  isModal?: boolean;
  onClose?: () => void;
  onOpenModul?: () => void;
}

export const DetailPendampingan: React.FC<DetailPendampinganProps> = ({ 
  record, 
  onBack, 
  onNavigate,
  isModal = false,
  onClose,
  onOpenModul
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('informasi');

  const handlePrint = () => {
    window.print();
  };

  if (!record) {
    return (
      <div className="p-8 text-center text-gray-500">
        Data pendampingan tidak ditemukan.
        {onClose && (
          <div className="mt-4">
            <button onClick={onClose} className="text-blue-600 underline font-semibold">Tutup</button>
          </div>
        )}
        {onBack && (
          <div className="mt-4">
            <button onClick={onBack} className="text-blue-600 underline font-semibold">Kembali</button>
          </div>
        )}
      </div>
    );
  }

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 flex-shrink-0">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    Detail Pendampingan
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    {record.abstraksi?.nomorTiket || record.Nomor || record.id}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    record.statusPendampingan === 'Aktif' || record.status === 'Aktif'
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {record.statusPendampingan || record.status || 'Aktif'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 max-w-2xl truncate" title={record.perihal}>
                  {record.perihal}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition shadow-2xs"
                title="Download Resume / Cetak"
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

          {/* Modal Tab Navigation */}
          <div className="border-b border-gray-200 bg-white px-6 flex-shrink-0">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <TabButton name="informasi" label="Informasi Umum" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton name="posisi" label="Posisi Pendampingan" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton name="dokumen" label="Dokumen" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton name="riwayat" label="Riwayat" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/60 custom-scrollbar">
            {activeTab === 'informasi' && <InformasiUmumTab record={record} />}
            {activeTab === 'posisi' && <PosisiPendampinganTab posisi={record.posisi || []} />}
            {activeTab === 'dokumen' && <DokumenTab record={record} />}
            {activeTab === 'riwayat' && <RiwayatTab record={record} />}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="font-semibold text-gray-700">Unit Pemohon:</span>
              <span className="font-medium text-gray-800">{record.abstraksi?.unitPemohon || record.unit || '-'}</span>
              {record.abstraksi?.unitPemanggil && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="font-semibold text-gray-700">Pemanggil:</span>
                  <span className="font-medium text-indigo-700">{record.abstraksi?.unitPemanggil}</span>
                </>
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
                  Buka di Modul Pendampingan &rarr;
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
      </div>
    );
  }

  return (
    <div className="p-8 bg-white h-full flex flex-col print:p-0">
        {onNavigate && <Breadcrumb currentView="eAdvokasiPendampinganDetail" onNavigate={onNavigate} />}
        <header className="flex-shrink-0 mb-6 flex justify-between items-start border-b border-gray-100 pb-4 print:mb-4">
            <div className="flex items-start">
                {onBack && (
                  <button 
                      onClick={onBack} 
                      className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors mr-3 mt-1 print:hidden"
                  >
                      <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 print:text-xl">Informasi Pendampingan</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {record.abstraksi?.nomorTiket || record.Nomor || record.id} - {record.perihal}
                    </p>
                </div>
            </div>
            <button 
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md print:hidden"
            >
                <PrintIcon className="h-5 w-5" />
                <span className="font-bold text-sm">Download Resume / Cetak</span>
            </button>
        </header>

        <div className="border-b border-gray-200 mb-6 print:hidden">
            <nav className="-mb-px flex" aria-label="Tabs">
                <TabButton name="informasi" label="Informasi Umum" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="posisi" label="Posisi Pendampingan" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="dokumen" label="Dokumen" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="riwayat" label="Riwayat" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
        </div>
        
        <main className="flex-1 overflow-y-auto pr-4">
            {activeTab === 'informasi' && <InformasiUmumTab record={record} />}
            {activeTab === 'posisi' && <PosisiPendampinganTab posisi={record.posisi || []} />}
            {activeTab === 'dokumen' && <DokumenTab record={record} />}
            {activeTab === 'riwayat' && <RiwayatTab record={record} />}
        </main>
    </div>
  );
};

export default DetailPendampingan;