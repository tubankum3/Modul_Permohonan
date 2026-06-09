
import React, { useState } from 'react';
import { PendampinganRecord, FileData, PosisiUpdate, Riwayat, View } from '../types';
import { ArrowLeftIcon, EyeIcon, DocumentTextIcon, DownloadIcon, XIcon, PrintIcon } from './icons';
import Breadcrumb from './Breadcrumb';

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
    <tr className="border-b border-gray-100">
        <td className="py-2.5 pr-4 align-top text-sm font-medium text-gray-500 w-1/4">:{label}</td>
        <td className="py-2.5 text-sm text-gray-800">{value}</td>
    </tr>
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
                    <table className="w-full">
                        <tbody>
                            <DetailRow label="Tahun Masuk" value={abstraksi.tahunMasuk} />
                            <DetailRow label="Nomor Tiket / Surat Permohonan" value={abstraksi.nomorTiket} />
                            <DetailRow label="Unit Pemohon" value={abstraksi.unitPemohon} />
                            <DetailRow label="Unit Pemanggil" value={abstraksi.unitPemanggil} />
                            <DetailRow label="Wilayah" value={abstraksi.wilayah} />
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
                        </tbody>
                    </table>
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
    // Categorize files
    const allFiles = record.files || [];
    const permohonanDocs = allFiles.map((f, i) => ({
        id: `f-${i}`,
        nama: f.name,
        nomor: record.Nomor || '-',
        tanggal: record.tanggal || '-',
        type: 'upload'
    }));

    const renderDocumentTable = (title: string, docs: any[]) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8 last:mb-0">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-gray-800">{title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{docs.length} Berkas</span>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f9fafb]">
                        <tr>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">No</th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Dokumen</th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor / Tanggal</th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sumber</th>
                            <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {docs.length > 0 ? docs.map((doc, index) => (
                            <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${
                                            doc.type === 'upload' ? 'bg-orange-50 text-orange-600' : 
                                            doc.type === 'nadine' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                        }`}>
                                            <DocumentTextIcon className="h-5 w-5" />
                                        </div>
                                        <span>{doc.nama}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {doc.nomor && <span className="block font-bold text-gray-700">{doc.nomor}</span>}
                                    {doc.tanggal && <span className="text-[11px] font-medium text-gray-400">{doc.tanggal}</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                        doc.type === 'upload' ? 'bg-orange-100 text-orange-700' : 
                                        doc.type === 'nadine' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {doc.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3 text-gray-400">
                                    <button className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><EyeIcon className="h-5 w-5" /></button>
                                    <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 p-1.5 rounded-full transition-colors"><DownloadIcon className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic text-sm bg-gray-50/30">
                                    Belum ada dokumen yang tersedia di kategori ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-6">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Manajemen Dokumen Pendampingan</h2>
            </div>
            {renderDocumentTable("1. Dokumen Permohonan & Pemanggilan", permohonanDocs)}
            {renderDocumentTable("2. Dokumen Pendampingan & Data Dukung", [])}
            {renderDocumentTable("3. Dokumen Laporan", [])}
        </div>
    );
}

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
                        {[...auditTrail].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((entry) => (
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


interface DetailPendampinganProps {
  record: PendampinganRecord;
  onBack: () => void;
  onNavigate?: (view: View, record?: any) => void;
}

const DetailPendampingan: React.FC<DetailPendampinganProps> = ({ record, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('informasi');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 bg-white h-full flex flex-col print:p-0">
        {onNavigate && <Breadcrumb currentView="eAdvokasiPendampinganDetail" onNavigate={onNavigate} />}
        <header className="flex-shrink-0 mb-6 flex justify-between items-start border-b border-gray-100 pb-4 print:mb-4">
            <div className="flex items-start">
                <button 
                    onClick={onBack} 
                    className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors mr-3 mt-1 print:hidden"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 print:text-xl">Informasi Pendampingan</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {record.Nomor || record.id} - {record.perihal}
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