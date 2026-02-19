
import React, { useState } from 'react';
import { PerkaraRecord, Pihak, Tuntutan, Majelis, PosisiSidang, PosisiSidangEntry, Putusan, DokumenLitigasi, TeamMember, AuditTrailEntry } from '../types';
import { EyeIcon } from './icons';

interface DetailPerkaraProps {
  record: PerkaraRecord;
  onBack: () => void;
}

type DetailTab = 'informasi' | 'posisi' | 'putusan' | 'dokumen' | 'riwayat';

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

const DetailSection: React.FC<{ title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="border border-gray-300 rounded-md mb-6">
        <h3 className="px-4 py-2 bg-gray-100 font-semibold text-gray-700 border-b border-gray-300 rounded-t-md">{title}</h3>
        <div className="p-4">{children}</div>
    </div>
);

const DetailRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex py-1.5">
        <span className="text-sm font-medium text-gray-500 w-48 flex-shrink-0">:{label}</span>
        <span className="text-sm text-gray-800">{value}</span>
    </div>
);

const PihakTable: React.FC<{ title: string, data: Pihak[] }> = ({ title, data }) => (
    <DetailSection title={title}>
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>
                {['No', 'Pihak', 'Identitas', 'Keterangan', 'Unit Berperkara'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((p, i) => <tr key={p.id}>
                    <td className="px-3 py-2">{p.id}</td>
                    <td className="px-3 py-2">{p.pihak}</td>
                    <td className="px-3 py-2 font-semibold">{p.identitas}</td>
                    <td className="px-3 py-2">{p.keterangan}</td>
                    <td className="px-3 py-2">{p.unitBerperkara}</td>
                </tr>)}
            </tbody>
        </table>
    </DetailSection>
);

const TuntutanTable: React.FC<{ data: Tuntutan[] }> = ({ data }) => (
    <DetailSection title="Tuntutan">
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>
                {['No', 'Objek', 'Jenis', 'Jumlah/Nominal', 'Satuan/Matuan', 'Keterangan'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
                {data.map(t => <tr key={t.id}>
                    <td className="px-3 py-2">{t.id}</td>
                    <td className="px-3 py-2">{t.objek}</td>
                    <td className="px-3 py-2">{t.jenis}</td>
                    <td className="px-3 py-2">{t.jumlahNominal}</td>
                    <td className="px-3 py-2">{t.satuan}</td>
                    <td className="px-3 py-2">{t.keterangan}</td>
                </tr>)}
            </tbody>
        </table>
    </DetailSection>
);

const MajelisTable: React.FC<{ data: Majelis[] }> = ({ data }) => (
    <DetailSection title="Susunan Majelis">
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>
                {['No', 'Jabatan', 'Identitas'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
                {data.map(m => <tr key={m.id}>
                    <td className="px-3 py-2">{m.id}</td>
                    <td className="px-3 py-2">{m.jabatan}</td>
                    <td className="px-3 py-2">{m.identitas}</td>
                </tr>)}
            </tbody>
        </table>
    </DetailSection>
);

const InformasiUmumTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => {
    const a = record.abstraksiPerkara;
    return (
        <div>
            <DetailSection title="Abstraksi">
                <DetailRow label="Tahun Masuk" value={a?.tahunMasuk} />
                <DetailRow label="No Perkara" value={a?.noPerkara} />
                <DetailRow label="Tanggal Gugatan" value={a?.tanggalPendaftaranGugatan} />
                <DetailRow label="Wilayah" value={a?.wilayah} />
                <DetailRow label="Jenis Perkara" value={a?.jenisPerkara?.join(', ')} />
                <DetailRow label="Pengadilan" value={a?.pengadilan?.join(', ')} />
                <DetailRow label="Jenis Pokok Perkara" value={a?.jenisPokokPerkara?.join(', ')} />
                <DetailRow label="Rincian Pokok Perkara" value={a?.rincianPokokPerkara} />
                <DetailRow label="Nomor Surat Kuasa" value={a?.nomorSuratKuasaKhusus} />
                 <DetailRow label="Tags Perkara" value={
                    a?.tagsPerkara && a.tagsPerkara.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {a.tagsPerkara.map((tag, index) => (
                                <span key={index} className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : 'Tidak ada tag'
                } />
            </DetailSection>
            <PihakTable title="Pihak P" data={record.pihakP || []} />
            <PihakTable title="Pihak T" data={record.pihakT || []} />
            <TuntutanTable data={record.tuntutan || []} />
            <MajelisTable data={record.susunanMajelis || []} />
        </div>
    );
};

const PosisiSidangTingkatTable: React.FC<{ title: string, data: PosisiSidangEntry[] }> = ({ title, data }) => (
     <DetailSection title={title}>
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>
                {['No', 'Surat Tugas', 'Agenda Sidang', 'Agenda Berikutnya', 'Kehadiran', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((p, i) => <tr key={p.id}>
                    <td className="px-3 py-2">{i+1}</td>
                    <td className="px-3 py-2">{p.suratTugas}<br/>{p.tanggalSuratTugas}</td>
                    <td className="px-3 py-2">{p.agendaSidang}<br/>{p.tanggalSidang}</td>
                    <td className="px-3 py-2">{p.agendaBerikutnya}<br/>{p.tanggalSidangBerikutnya}</td>
                    <td className="px-3 py-2">{p.kehadiran}</td>
                    <td className="px-3 py-2"><button className="p-1 hover:bg-gray-100 rounded-full"><EyeIcon className="h-5 w-5"/></button></td>
                </tr>)}
            </tbody>
        </table>
    </DetailSection>
);

const PosisiSidangTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => (
    <div>
        <PosisiSidangTingkatTable title="Posisi Sidang Tk. Pertama" data={record.posisiSidang?.tkPertama || []} />
        <PosisiSidangTingkatTable title="Posisi Sidang Tk. Banding" data={record.posisiSidang?.tkBanding || []} />
        <PosisiSidangTingkatTable title="Posisi Sidang Tk. Kasasi" data={record.posisiSidang?.tkKasasi || []} />
        <PosisiSidangTingkatTable title="Posisi Sidang Tk. Peninjauan Kembali" data={record.posisiSidang?.tkPK || []} />
    </div>
);

const PutusanTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => (
    <div>
        <DetailSection title="Putusan Perkara">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr>
                    {['No', 'Nomor', 'Tanggal', 'Amar', 'Status', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                    {(record.putusan || []).map(p => <tr key={p.id}>
                        <td className="px-3 py-2">{p.id}</td>
                        <td className="px-3 py-2">{p.nomor}</td>
                        <td className="px-3 py-2">{p.tanggal}</td>
                        <td className="px-3 py-2">{p.amar}</td>
                        <td className="px-3 py-2">{p.status}</td>
                        <td className="px-3 py-2"><button className="p-1 hover:bg-gray-100 rounded-full"><EyeIcon className="h-5 w-5"/></button></td>
                    </tr>)}
                </tbody>
            </table>
        </DetailSection>
        <DetailSection title="Status BHT">
            <DetailRow label="Status" value={record.statusBHT?.status} />
            <DetailRow label="Keterangan Dampak" value={record.statusBHT?.keteranganDampak} />
        </DetailSection>
    </div>
);

const DokumenLitigasiTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => (
    <DetailSection title="Dokumen">
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>
                {['No', 'No Naskah/Tiket/ID', 'Jenis Dokumen', 'Deskripsi Dokumen', 'Timestamp', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
                {(record.dokumenLitigasi || []).map(d => <tr key={d.id}>
                    <td className="px-3 py-2">{d.id}</td>
                    <td className="px-3 py-2">{d.noNaskah}</td>
                    <td className="px-3 py-2">{d.jenis}</td>
                    <td className="px-3 py-2">{d.deskripsi}</td>
                    <td className="px-3 py-2">{d.timestamp}</td>
                    <td className="px-3 py-2"><button className="p-1 hover:bg-gray-100 rounded-full"><EyeIcon className="h-5 w-5"/></button></td>
                </tr>)}
            </tbody>
        </table>
    </DetailSection>
);

const RiwayatTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => {
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
                    <p>Tim belum dibentuk untuk perkara ini.</p>
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
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatAuditTimestamp(new Date(entry.timestamp))}</td>
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

const DetailPerkara: React.FC<DetailPerkaraProps> = ({ record, onBack }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('informasi');

  return (
    <div className="p-8 bg-white h-full flex flex-col">
        <header className="flex-shrink-0 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Informasi Perkara</h1>
            <button onClick={onBack} className="text-sm text-blue-600 hover:underline mt-2">
                &larr; Kembali ke Daftar Perkara
            </button>
        </header>

        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex" aria-label="Tabs">
                <TabButton name="informasi" label="Informasi Umum" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="posisi" label="Posisi Sidang" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="putusan" label="Putusan" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="dokumen" label="Dokumen Litigasi" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="riwayat" label="Riwayat" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
        </div>
        
        <main className="flex-1 overflow-y-auto pr-4">
            {activeTab === 'informasi' && <InformasiUmumTab record={record} />}
            {activeTab === 'posisi' && <PosisiSidangTab record={record} />}
            {activeTab === 'putusan' && <PutusanTab record={record} />}
            {activeTab === 'dokumen' && <DokumenLitigasiTab record={record} />}
            {activeTab === 'riwayat' && <RiwayatTab record={record} />}
        </main>
    </div>
  );
};

export default DetailPerkara;
