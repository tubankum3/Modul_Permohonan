import React, { useState } from 'react';
import { PerkaraRecord, Pihak, Tuntutan, Putusan, TuntutanAkhir, View } from '../types';
import { ArrowLeftIcon, EyeIcon, DocumentTextIcon, PrintIcon } from './icons';
import Breadcrumb from './Breadcrumb';

interface DetailPutusanProps {
  record: PerkaraRecord;
  onBack: () => void;
  onNavigate?: (view: View, record?: any) => void;
}

type DetailTab = 'informasi' | 'putusan' | 'tindak_lanjut' | 'dokumen' | 'riwayat';

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

const DetailSection: React.FC<{ title: string, children: React.ReactNode, action?: React.ReactNode }> = ({ title, children, action }) => (
    <div className="border border-gray-300 rounded-md mb-6">
        <div className="px-4 py-2 bg-gray-100 font-semibold text-gray-700 border-b border-gray-300 rounded-t-md flex justify-between items-center">
            <h3>{title}</h3>
            {action && <div className="flex items-center space-x-2">{action}</div>}
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const DetailRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex border-b border-gray-100 last:border-0 py-2.5">
        <span className="text-sm font-medium text-gray-500 w-64 flex-shrink-0">{label}</span>
        <span className="text-sm text-gray-800 font-medium">{value || '-'}</span>
    </div>
);

const PihakTable: React.FC<{ title: string, data: Pihak[] }> = ({ title, data }) => (
    <DetailSection title={title}>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr>
                    {['No', 'Pihak', 'Identitas', 'Keterangan'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((p, i) => <tr key={p.id || i} className="hover:bg-gray-50">
                        <td className="px-3 py-2.5">{i + 1}</td>
                        <td className="px-3 py-2.5 font-medium">{p.pihak}</td>
                        <td className="px-3 py-2.5">{p.identitas}</td>
                        <td className="px-3 py-2.5 text-gray-600">{p.keterangan || '-'}</td>
                    </tr>)}
                    {data.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-500 italic">Tidak ada data.</td></tr>}
                </tbody>
            </table>
        </div>
    </DetailSection>
);

const TuntutanTable: React.FC<{ title?: string, data: (Tuntutan | TuntutanAkhir)[] }> = ({ title = "Tuntutan", data }) => (
    <DetailSection title={title}>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr>
                    {['No', 'Objek', 'Jenis', 'Jumlah/Nominal', 'Satuan', 'Keterangan'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((t, i) => <tr key={t.id || i} className="hover:bg-gray-50">
                        <td className="px-3 py-2.5">{i + 1}</td>
                        <td className="px-3 py-2.5 font-medium">{t.objek}</td>
                        <td className="px-3 py-2.5">{t.jenis}</td>
                        <td className="px-3 py-2.5 font-mono text-blue-700">{typeof t.jumlahNominal === 'number' ? t.jumlahNominal.toLocaleString('id-ID') : t.jumlahNominal}</td>
                        <td className="px-3 py-2.5">{t.satuan}</td>
                        <td className="px-3 py-2.5 text-gray-600">{t.keterangan || '-'}</td>
                    </tr>)}
                    {data.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-gray-500 italic">Tidak ada data tuntutan.</td></tr>}
                </tbody>
            </table>
        </div>
    </DetailSection>
);

const InformasiUmumTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => {
    const a = record.abstraksiPerkara;
    return (
        <div className="space-y-4">
            <DetailSection title="Informasi Umum">
                <DetailRow label="Tahun Masuk" value={a?.tahunMasuk} />
                <DetailRow label="Nomor Perkara" value={a?.noPerkara || record.Nomor} />
                <DetailRow label="Tanggal Pendaftaran Perkara" value={a?.tanggalPendaftaranGugatan} />
                <DetailRow label="Nomor Surat Kuasa Khusus" value={
                    <div className="flex items-center space-x-3">
                        <span className="font-semibold text-blue-700">{a?.nomorSuratKuasaKhusus || '-'}</span>
                        {a?.nomorSuratKuasaKhusus && (
                            <button className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-blue-200 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
                                <DocumentTextIcon className="h-3.5 w-3.5" />
                                <span>Lihat Dokumen</span>
                            </button>
                        )}
                    </div>
                } />
                <DetailRow label="Wilayah" value={a?.wilayah} />
                <DetailRow label="Pengadilan" value={a?.pengadilan} />
                <DetailRow label="Jenis Perkara" value={a?.jenisPerkara} />
                <DetailRow label="Jenis Pokok Perkara" value={a?.jenisPokokPerkara} />
                <DetailRow label="Rincian Pokok Perkara" value={a?.rincianPokokPerkara} />
                <DetailRow label="Unit Principal" value={
                    (() => {
                        const principals = [
                            ...(record.pihakP || []),
                            ...(record.pihakT || [])
                        ].filter(p => p.unitBerperkara === 'Ya');
                        
                        return principals.length > 0 
                            ? principals.map(p => p.identitas).join(', ') 
                            : '-';
                    })()
                } />
                
                <DetailRow label="Tags" value={
                    a?.tagsPerkara && a.tagsPerkara.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {a.tagsPerkara.map((tag, index) => (
                                <span key={index} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-200 bg-blue-50 text-blue-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null
                } />
                
                <DetailRow label="Status Putusan" value={
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                        (record.statusPerkara as string) === 'Selesai' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                        {record.statusPerkara || 'Dalam Proses'}
                    </span>
                } />
            </DetailSection>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <PihakTable title="Pihak Penggugat / Pemohon" data={record.pihakP || []} />
                <PihakTable title="Pihak Tergugat / Termohon" data={record.pihakT || []} />
            </div>
            
            <TuntutanTable data={record.tuntutan || []} />

            <DetailSection title="Analisis">
                <DetailRow label="Isu Krusial" value={record.analisisPerkara?.isuKrusial} />
                <DetailRow label="Analisa Hukum" value={record.analisisPerkara?.analisaHukum} />
                <DetailRow label="Potensi Dampak bagi Kemenkeu" value={record.analisisPerkara?.potensiDampak} />
                <DetailRow label="Risiko" value={
                    record.analisisPerkara?.risiko ? (
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            record.analisisPerkara.risiko === 'Tinggi' ? 'bg-red-100 text-red-700 border border-red-200' :
                            record.analisisPerkara.risiko === 'Sedang' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                            {record.analisisPerkara.risiko}
                        </span>
                    ) : '-'
                } />
                <DetailRow label="Keterangan Risiko" value={record.analisisPerkara?.keteranganRisiko} />
                <DetailRow label="Analisis Sementara" value={record.analisisPerkara?.analisisSementara} />
                <DetailRow label="Kesimpulan Sementara" value={record.analisisPerkara?.kesimpulanSementara} />
            </DetailSection>
        </div>
    );
};

const PutusanTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => {
    return (
        <div className="space-y-4">
            <TuntutanTable title="Table Tuntutan Akhir" data={record.tuntutanAkhir || []} />
            
            <DetailSection title="Table Status BHT">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailRow label="Status BHT" value={
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${record.statusBHT?.status === 'Inkracht' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {record.statusBHT?.status || 'Belum Inkracht'}
                        </span>
                    } />
                    <div className="md:col-span-2 mt-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 border-b pb-1">Keterangan Dampak Putusan</h4>
                        <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[60px]">
                            {record.statusBHT?.keteranganDampak || 'Belum ada data dampak putusan.'}
                        </div>
                    </div>
                </div>
            </DetailSection>

            <DetailSection title="Table Putusan">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50"><tr>
                            {['No', 'Nomor', 'Tanggal', 'Amar', 'Status', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-200">
                            {(record.putusan || []).map((p, i) => (
                                <tr key={p.id || i} className="hover:bg-gray-50">
                                    <td className="px-3 py-2.5">{i + 1}</td>
                                    <td className="px-3 py-2.5 font-semibold text-blue-700">{p.nomor}</td>
                                    <td className="px-3 py-2.5">{p.tanggal}</td>
                                    <td className="px-3 py-2.5 truncate max-w-xs">{p.amar}</td>
                                    <td className="px-3 py-2.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            p.status === 'Menang' ? 'bg-green-100 text-green-700' : 
                                            p.status === 'Kalah' ? 'bg-red-100 text-red-700' : 
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-center">
                                        <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!record.putusan || record.putusan.length === 0) && (
                                <tr><td colSpan={6} className="py-4 text-center text-gray-500 italic">Tidak ada data putusan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </DetailSection>
        </div>
    );
};

const TindakLanjutTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => (
    <DetailSection title="Table Daftar Tindak Lanjut">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr>
                    {['No', 'Tanggal', 'Jenis', 'Tindak Lanjut', 'Uraian', 'File'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                    {(record.tindakLanjut || []).map((t, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-3 py-2.5">{i + 1}</td>
                            <td className="px-3 py-2.5">{t.tanggal}</td>
                            <td className="px-3 py-2.5">{t.jenisTindakLanjut}</td>
                            <td className="px-3 py-2.5 font-medium">{t.tindakLanjut}</td>
                            <td className="px-3 py-2.5 truncate max-w-xs">{t.uraian}</td>
                            <td className="px-3 py-2.5">
                                {t.file ? (
                                    <button className="flex items-center space-x-1 underline text-blue-600">
                                        <DocumentTextIcon className="h-3.5 w-3.5" />
                                        <span>{t.file.name}</span>
                                    </button>
                                ) : '-'}
                            </td>
                        </tr>
                    ))}
                    {(!record.tindakLanjut || record.tindakLanjut.length === 0) && (
                        <tr><td colSpan={6} className="py-4 text-center text-gray-500 italic">Belum ada tindak lanjut.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </DetailSection>
);

const DokumenTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => {
    const { putusan, tindakLanjut, posisiSidang } = record;
    
    const laporanDocs = [
        ...(posisiSidang?.tkPertama || []),
        ...(posisiSidang?.tkBanding || []),
        ...(posisiSidang?.tkKasasi || []),
        ...(posisiSidang?.tkPK || [])
    ].map(s => ({ id: `ls-${s.id}`, name: `Laporan Sidang - ${s.agendaSidang}`, date: s.tanggalSidang }))
    .concat((putusan || []).map(p => ({ id: `lp-${p.id}`, name: `Laporan Putusan - ${p.nomor}`, date: p.tanggal })));

    return (
        <div className="space-y-4">
            <DetailSection title="Table Dokumen Putusan">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50"><tr>
                        {['No', 'No Naskah/ID', 'Jenis', 'Deskripsi', 'Tanggal', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {record.dokumenLitigasi?.filter(d => d.jenis.toLowerCase().includes('putusan')).map((d, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2.5">{i + 1}</td>
                                <td className="px-3 py-2.5 font-medium">{d.noNaskah}</td>
                                <td className="px-3 py-2.5">{d.jenis}</td>
                                <td className="px-3 py-2.5">{d.deskripsi}</td>
                                <td className="px-3 py-2.5">{d.timestamp.split(' ')[0]}</td>
                                <td className="px-3 py-2.5 text-center">
                                    <button className="text-blue-600 hover:text-blue-900"><EyeIcon className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                        {(!record.dokumenLitigasi || record.dokumenLitigasi.filter(d => d.jenis.toLowerCase().includes('putusan')).length === 0) && (
                            <tr><td colSpan={6} className="py-4 text-center text-gray-500 italic">Tidak ada dokumen putusan.</td></tr>
                        )}
                    </tbody>
                </table>
            </DetailSection>

            <DetailSection title="Table Dokumen Tindak Lanjut">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50"><tr>
                        {['No', 'Tanggal', 'Tindak Lanjut', 'Nama File', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {tindakLanjut?.filter(t => t.file).map((t, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2.5">{i + 1}</td>
                                <td className="px-3 py-2.5">{t.tanggal}</td>
                                <td className="px-3 py-2.5">{t.tindakLanjut}</td>
                                <td className="px-3 py-2.5 font-medium">{t.file?.name}</td>
                                <td className="px-3 py-2.5 text-center">
                                    <button className="text-blue-600 hover:text-blue-900"><EyeIcon className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                        {(!tindakLanjut?.some(t => t.file)) && (
                            <tr><td colSpan={5} className="py-4 text-center text-gray-500 italic">Tidak ada dokumen tindak lanjut.</td></tr>
                        )}
                    </tbody>
                </table>
            </DetailSection>

            <DetailSection title="Table Dokumen Laporan">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50"><tr>
                        {['No', 'Nama Laporan', 'Tanggal', 'Sumber', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {laporanDocs.map((d, i) => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2.5">{i + 1}</td>
                                <td className="px-3 py-2.5 font-medium">{d.name}</td>
                                <td className="px-3 py-2.5">{d.date}</td>
                                <td className="px-3 py-2.5 text-gray-400 italic text-[10px]">Nadine (Auto-generated)</td>
                                <td className="px-3 py-2.5 text-center">
                                    <button className="text-blue-600 hover:text-blue-900"><EyeIcon className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                        {laporanDocs.length === 0 && (
                            <tr><td colSpan={5} className="py-4 text-center text-gray-500 italic">Belum ada laporan.</td></tr>
                        )}
                    </tbody>
                </table>
            </DetailSection>
        </div>
    );
};

const RiwayatTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => {
    const { team, picId, auditTrail } = record;

    const formatAuditTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'long',
            timeStyle: 'medium',
        }).format(date);
    }

    const TeamTable = () => (
        <DetailSection title="Susunan Anggota Tim">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {['No', 'Nama', 'NIP', 'Unit', 'Role'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {team?.map((member, index) => (
                        <tr key={member.id} className={member.id === picId ? 'bg-yellow-50' : ''}>
                            <td className="px-3 py-2">{index + 1}</td>
                            <td className="px-3 py-2 font-semibold text-gray-900">
                                {member.nama}
                                {member.id === picId && <span className="ml-2 text-xs font-bold text-yellow-800 bg-yellow-300 px-2 py-0.5 rounded-full">PIC</span>}
                            </td>
                            <td className="px-3 py-2">{member.nip}</td>
                            <td className="px-3 py-2">{member.unit}</td>
                            <td className="px-3 py-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.teamRole === 'Editor' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {member.teamRole}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {(!team || team.length === 0) && (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-500 italic">Tim belum dibentuk.</td></tr>
                    )}
                </tbody>
            </table>
        </DetailSection>
    );
    
    const AuditTrailTable = () => (
        <DetailSection title="Riwayat (Audit Trail)">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">Date & Time</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">Uraian</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {[...(auditTrail || [])].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((entry) => (
                        <tr key={entry.id}>
                            <td className="px-3 py-4 whitespace-nowrap text-gray-500">{formatAuditTimestamp(new Date(entry.timestamp))}</td>
                            <td className="px-3 py-4 text-gray-800">
                                <span className="font-semibold text-blue-700">{entry.user}</span> {entry.action} <span className="font-medium text-gray-600">{entry.details}</span>.
                            </td>
                        </tr>
                    ))}
                    {(!auditTrail || auditTrail.length === 0) && (
                        <tr><td colSpan={2} className="py-8 text-center text-gray-500 italic">Tidak ada riwayat.</td></tr>
                    )}
                </tbody>
            </table>
        </DetailSection>
    );

    return (
        <div className="space-y-4">
            <TeamTable />
            <AuditTrailTable />
        </div>
    );
};

const DetailPutusan: React.FC<DetailPutusanProps> = ({ record, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('informasi');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 bg-white h-full flex flex-col print:p-0">
        {onNavigate && <Breadcrumb currentView="eAdvokasiPutusanDetail" onNavigate={onNavigate} />}
        <header className="flex-shrink-0 mb-6 flex justify-between items-start border-b border-gray-100 pb-4 print:mb-4">
            <div className="flex items-start">
                <button 
                    onClick={onBack} 
                    className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors mr-3 mt-1 print:hidden"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 print:text-xl">Informasi Penanganan Putusan</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {record.abstraksiPerkara?.noPerkara || record.Nomor || record.id} - {record.perihal}
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
                <TabButton name="putusan" label="Putusan" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="tindak_lanjut" label="Tindak Lanjut" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="dokumen" label="Dokumen" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="riwayat" label="Riwayat" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
        </div>
        
        <main className="flex-1 overflow-y-auto pr-4">
            {activeTab === 'informasi' && <InformasiUmumTab record={record} />}
            {activeTab === 'putusan' && <PutusanTab record={record} />}
            {activeTab === 'tindak_lanjut' && <TindakLanjutTab record={record} />}
            {activeTab === 'dokumen' && <DokumenTab record={record} />}
            {activeTab === 'riwayat' && <RiwayatTab record={record} />}
        </main>
    </div>
  );
};

export default DetailPutusan;
