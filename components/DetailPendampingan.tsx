
import React, { useState } from 'react';
import { PendampinganRecord, FileData, PosisiUpdate, Riwayat } from '../types';
import { ArrowLeftIcon, EyeIcon, DocumentTextIcon, DownloadIcon } from './icons';

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

    return (
        <div className="border border-gray-300 rounded-md">
            <h3 className="px-4 py-2 bg-gray-100 font-semibold text-gray-700 border-b border-gray-300 rounded-t-md">Abstraksi</h3>
            <table className="w-full m-4">
                <tbody>
                    <DetailRow label="Tahun Masuk" value={abstraksi.tahunMasuk} />
                    <DetailRow label="Nomor Tiket / Nomor Dinas" value={abstraksi.nomorTiket} />
                    <DetailRow label="Unit Pemanggil" value={abstraksi.unitPemanggil} />
                    <DetailRow label="Unit Pemohon" value={abstraksi.unitPemohon} />
                    <DetailRow label="Pihak yang Dipanggil" value={abstraksi.pihakDipanggil} />
                    <DetailRow label="Wilayah" value={abstraksi.wilayah} />
                    <DetailRow label="Pokok Permasalahan" value={abstraksi.pokokPermasalahan} />
                    <DetailRow label="Keterangan" value={abstraksi.keterangan} />
                </tbody>
            </table>
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
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surat Tugas</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agenda</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemanggil dan Surat Pemanggilan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi (Menit)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rincian Pelaksanaan</th>
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
                            <td className="px-4 py-4 text-sm text-gray-800">
                                {p.agenda}
                                <div className="text-xs text-gray-500">{formatDate(p.tanggalAgenda)}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-800">
                                <div><span className="font-bold">Pemanggil:</span> {p.pemanggilDanSurat.pemanggil}</div>
                                <div><span className="font-bold">Surat Pemanggilan:</span> {p.pemanggilDanSurat.surat}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-800">{p.lokasi}</td>
                            <td className="px-4 py-4 text-sm text-gray-800">{p.durasi}</td>
                            <td className="px-4 py-4 text-sm text-gray-800">{p.rincian}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DokumenTab: React.FC<{ files: FileData[] }> = ({ files }) => {
    if (!files || files.length === 0) return <p className="text-center text-gray-500 py-8">Tidak ada dokumen.</p>;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Naskah/Tiket/ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi Dokumen</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file, index) => (
                        <tr key={index}>
                            <td className="px-4 py-4 text-sm">{index + 1}</td>
                            <td className="px-4 py-4 text-sm">DOC-{index+1}</td>
                            <td className="px-4 py-4 text-sm">{file.name}</td>
                            <td className="px-4 py-4 text-sm">{new Date().toLocaleString('id-ID')}</td>
                            <td className="px-4 py-4 text-sm"><button className="p-2 hover:bg-gray-100 rounded-full"><EyeIcon className="h-5 w-5"/></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
}

const DetailPendampingan: React.FC<DetailPendampinganProps> = ({ record, onBack }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('informasi');

  return (
    <div className="p-8 bg-white h-full flex flex-col">
        <header className="flex-shrink-0 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Informasi Pendampingan</h1>
            <button onClick={onBack} className="text-sm text-blue-600 hover:underline mt-2">
                &larr; Kembali ke Daftar Pendampingan
            </button>
        </header>

        <div className="border-b border-gray-200 mb-6">
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
            {activeTab === 'dokumen' && <DokumenTab files={record.files || []} />}
            {activeTab === 'riwayat' && <RiwayatTab record={record} />}
        </main>
    </div>
  );
};

export default DetailPendampingan;