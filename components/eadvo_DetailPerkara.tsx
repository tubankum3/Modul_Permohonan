
import React, { useState } from 'react';
import { PerkaraRecord, Pihak, Tuntutan, Majelis, PosisiSidang, PosisiSidangEntry, Putusan, DokumenLitigasi, TeamMember, AuditTrailEntry, View } from '../types';
import { EyeIcon, DocumentTextIcon, PrintIcon, ArrowLeftIcon } from './icons';
import Breadcrumb from './Breadcrumb';

interface DetailPerkaraProps {
  record: PerkaraRecord;
  onBack: () => void;
  onNavigate: (view: View, record?: PerkaraRecord) => void;
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
                    {data.map((p, i) => <tr key={p.id} className="hover:bg-gray-50">
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

const TuntutanTable: React.FC<{ data: Tuntutan[] }> = ({ data }) => (
    <DetailSection title="Tuntutan">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr>
                    {['No', 'Objek', 'Jenis', 'Jumlah/Nominal', 'Satuan', 'Keterangan'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((t, i) => <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2.5">{i + 1}</td>
                        <td className="px-3 py-2.5 font-medium">{t.objek}</td>
                        <td className="px-3 py-2.5">{t.jenis}</td>
                        <td className="px-3 py-2.5 font-mono text-blue-700">{t.jumlahNominal.toLocaleString('id-ID')}</td>
                        <td className="px-3 py-2.5">{t.satuan}</td>
                        <td className="px-3 py-2.5 text-gray-600">{t.keterangan || '-'}</td>
                    </tr>)}
                    {data.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-gray-500 italic">Tidak ada data tuntutan.</td></tr>}
                </tbody>
            </table>
        </div>
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
        <div className="space-y-4">
            <DetailSection title="Informasi Umum">
                <DetailRow label="Tahun Masuk" value={a?.tahunMasuk} />
                <DetailRow label="Nomor Perkara" value={a?.noPerkara} />
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
                
                {a?.klasifikasiPerkara && <DetailRow label="Klasifikasi Perkara" value={a.klasifikasiPerkara} />}
                {a?.subKlasifikasiPerkara && <DetailRow label="Sub Klasifikasi Perkara" value={a.subKlasifikasiPerkara} />}
                {a?.subSubKlasifikasiPerkara && <DetailRow label="Sub-Sub Klasifikasi Perkara" value={a.subSubKlasifikasiPerkara} />}
                
                <DetailRow label="Jenis Pokok Perkara" value={a?.jenisPokokPerkara} />
                
                {a?.subPokokPerkara && <DetailRow label="Sub Pokok Perkara" value={a.subPokokPerkara} />}
                {a?.subSubPokokPerkara && <DetailRow label="Sub-Sub Pokok Perkara" value={a.subSubPokokPerkara} />}
                
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
                
                <DetailRow label="Status Perkara" value={
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                        record.statusPerkara === 'Aktif' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                        {record.statusPerkara}
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

const PosisiSidangTingkatTable: React.FC<{ title: string, data: PosisiSidangEntry[], onNavigate: (view: View, record?: PerkaraRecord) => void, record: PerkaraRecord }> = ({ title, data, onNavigate, record }) => (
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
                    <td className="px-3 py-2">
                        {p.kehadiranPihak && p.kehadiranPihak.length > 0 
                            ? p.kehadiranPihak.filter(k => k.status === 'Hadir').length > 0
                                ? p.kehadiranPihak.filter(k => k.status === 'Hadir').map(k => k.label).join(', ')
                                : 'Tidak ada yang hadir'
                            : '-'
                        }
                    </td>
                    <td className="px-3 py-2 text-center">
                        <div className="flex justify-center space-x-1">
                            <button className="p-1 hover:bg-gray-100 rounded-full"><EyeIcon className="h-5 w-5"/></button>
                            <button type="button" onClick={() => onNavigate('formNaskah')} className="text-blue-500 p-1 hover:bg-gray-100 rounded-full" title="Generate Laporan (LAP) - Nadine"><DocumentTextIcon className="h-5 w-5"/></button>
                        </div>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </DetailSection>
);

const PosisiSidangTab: React.FC<{ record: PerkaraRecord, onNavigate: (view: View, record?: PerkaraRecord) => void }> = ({ record, onNavigate }) => (
    <div>
        <PosisiSidangTingkatTable title="Posisi Sidang Tk. Pertama" data={record.posisiSidang?.tkPertama || []} onNavigate={onNavigate} record={record} />
        <PosisiSidangTingkatTable title="Posisi Sidang Tk. Banding" data={record.posisiSidang?.tkBanding || []} onNavigate={onNavigate} record={record} />
        <PosisiSidangTingkatTable title="Posisi Sidang Tk. Kasasi" data={record.posisiSidang?.tkKasasi || []} onNavigate={onNavigate} record={record} />
        <PosisiSidangTingkatTable title="Posisi Sidang Tk. Peninjauan Kembali" data={record.posisiSidang?.tkPK || []} onNavigate={onNavigate} record={record} />
    </div>
);

const PutusanTab: React.FC<{ record: PerkaraRecord, onNavigate: (view: View, record?: PerkaraRecord) => void }> = ({ record, onNavigate }) => {
    const [expandedPutusan, setExpandedPutusan] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            <DetailSection title="Kumpulan Putusan">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-3 py-3 text-left font-semibold text-gray-700">No</th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-700">Posisi</th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-700">Nomor & Tanggal</th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-3 py-3 text-center font-semibold text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {(record.putusan || []).map((p, index) => (
                                <React.Fragment key={p.id}>
                                    <tr className={`hover:bg-gray-50 transition-colors ${expandedPutusan === p.id ? 'bg-blue-50' : ''}`}>
                                        <td className="px-3 py-4">{index + 1}</td>
                                        <td className="px-3 py-4">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold uppercase">{p.posisi || 'Pertama'}</span>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="font-semibold text-blue-700">{p.nomor}</div>
                                            <div className="text-xs text-gray-500">{p.tanggal}</div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                p.status === 'Menang' ? 'bg-green-100 text-green-700' : 
                                                p.status === 'Kalah' ? 'bg-red-100 text-red-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button 
                                                    onClick={() => setExpandedPutusan(expandedPutusan === p.id ? null : p.id)}
                                                    className={`p-1.5 rounded-full transition-colors ${expandedPutusan === p.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                                                    title={expandedPutusan === p.id ? "Sembunyikan Detail" : "Lihat Detail"}
                                                >
                                                    <EyeIcon className="h-5 w-5"/>
                                                </button>
                                                <button type="button" onClick={() => onNavigate('formNaskah')} className="text-blue-500 p-1.5 hover:bg-gray-200 rounded-full" title="Generate Laporan (LAP) - Nadine"><DocumentTextIcon className="h-5 w-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedPutusan === p.id && (
                                        <tr className="bg-white border-x border-blue-200">
                                            <td colSpan={5} className="p-0">
                                                <div className="p-6 bg-white border-b-2 border-blue-100 shadow-inner">
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {/* Pertimbangan Hakim */}
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Pertimbangan Hakim</h4>
                                                            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                                                                {p.pertimbanganHakim || 'Tidak ada data pertimbangan.'}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Amar Putusan */}
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Amar Putusan</h4>
                                                            <div className="p-4 bg-blue-50/50 rounded-lg text-sm text-gray-900 leading-relaxed font-medium whitespace-pre-wrap">
                                                                {p.amar || 'Tidak ada data amar.'}
                                                            </div>
                                                        </div>

                                                        {/* Keterangan */}
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Keterangan Tambahan</h4>
                                                            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-800 italic whitespace-pre-wrap">
                                                                {p.keterangan || 'Tidak ada keterangan.'}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Majelis & Panitera</h4>
                                                                <div className="space-y-1">
                                                                    {p.susunanMajelis?.map(m => (
                                                                        <div key={m.id} className="flex justify-between text-xs p-2 bg-white border border-gray-100 rounded">
                                                                            <span className="text-gray-500">{m.jabatan}:</span>
                                                                            <span className="font-semibold">{m.identitas}</span>
                                                                        </div>
                                                                    ))}
                                                                    {(!p.susunanMajelis || p.susunanMajelis.length === 0) && <p className="text-xs text-gray-400 italic">Belum ada majelis.</p>}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dokumen Putusan</h4>
                                                                {p.dokumen ? (
                                                                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded">
                                                                        <div className="flex items-center space-x-2">
                                                                            <DocumentTextIcon className="h-5 w-5 text-red-600" />
                                                                            <span className="text-sm font-medium text-red-900">{p.dokumen}</span>
                                                                        </div>
                                                                        <button className="text-xs font-bold text-red-700 hover:underline">Download</button>
                                                                    </div>
                                                                ) : <p className="text-xs text-gray-400 italic">Tidak ada berkas diunggah.</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {(!record.putusan || record.putusan.length === 0) && (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Belum ada data putusan tersedia.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </DetailSection>

            <DetailSection title="Status BHT (Berkekuatan Hukum Tetap)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailRow label="Status BHT" value={
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${record.statusBHT?.status === 'Inkracht' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {record.statusBHT?.status || 'Belum Inkracht'}
                        </span>
                    } />
                    <div className="md:col-span-2 mt-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Keterangan Dampak Putusan</h4>
                        <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                            {record.statusBHT?.keteranganDampak || 'Belum ada data dampak putusan.'}
                        </div>
                    </div>
                </div>
            </DetailSection>
        </div>
    );
};

const DokumenLitigasiTab: React.FC<{ record: PerkaraRecord }> = ({ record }) => {
    const { files, dokumenLitigasi, posisiSidang, putusan } = record;

    const DokumenPermohonanTable = () => (
        <DetailSection title="1. Dokumen Permohonan">
            {files && files.length > 0 ? (
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-600">No</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-600">Nama File</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-600">Ukuran</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-600">Tipe</th>
                            <th className="px-3 py-2 text-center font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {files.map((file, index) => (
                            <tr key={index}>
                                <td className="px-3 py-2">{index + 1}</td>
                                <td className="px-3 py-2">
                                    <div className="flex items-center space-x-2">
                                        <DocumentTextIcon className="h-4 w-4 text-blue-500" />
                                        <span>{file.name}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-2">{(file.size / 1024).toFixed(2)} KB</td>
                                <td className="px-3 py-2 uppercase text-xs">{file.type.split('/')[1] || 'FILE'}</td>
                                <td className="px-3 py-2 text-center">
                                    <button className="text-blue-600 hover:text-blue-900"><EyeIcon className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500 py-4">Tidak ada dokumen permohonan.</p>
            )}
        </DetailSection>
    );

    const DokumenLitigasiTable = () => (
        <DetailSection title="2. Dokumen Litigasi (SKU, Dokumen Litigasi)">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr>
                    {['No', 'No Naskah/Tiket/ID', 'Jenis', 'Deskripsi', 'Tanggal', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                    {(dokumenLitigasi || []).map((d, i) => <tr key={d.id}>
                        <td className="px-3 py-2">{i+1}</td>
                        <td className="px-3 py-2 font-medium">{d.noNaskah}</td>
                        <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${d.jenis === 'SKU' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {d.jenis}
                            </span>
                        </td>
                        <td className="px-3 py-2 truncate max-w-xs">{d.deskripsi}</td>
                        <td className="px-3 py-2">{d.timestamp.split(' ')[0]}</td>
                        <td className="px-3 py-2 text-center"><button className="p-1 hover:bg-gray-100 rounded-full"><EyeIcon className="h-5 w-5"/></button></td>
                    </tr>)}
                    {(!dokumenLitigasi || dokumenLitigasi.length === 0) && (
                        <tr><td colSpan={6} className="text-center py-4 text-gray-500">Belum ada dokumen litigasi.</td></tr>
                    )}
                </tbody>
            </table>
        </DetailSection>
    );

    const DokumenLaporanTable = () => {
        const laporanDocs = [
            ...(posisiSidang?.tkPertama || []),
            ...(posisiSidang?.tkBanding || []),
            ...(posisiSidang?.tkKasasi || []),
            ...(posisiSidang?.tkPK || [])
        ].map(s => ({ id: `ls-${s.id}`, name: `Laporan Sidang - ${s.agendaSidang}`, date: s.tanggalSidang }))
        .concat((putusan || []).map(p => ({ id: `lp-${p.id}`, name: `Laporan Putusan - ${p.nomor}`, date: p.tanggal })));

        return (
            <DetailSection title="3. Dokumen Laporan (Generate Laporan)">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {['No', 'Nama Laporan', 'Tanggal', 'Sumber', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {laporanDocs.map((d, i) => (
                            <tr key={d.id}>
                                <td className="px-3 py-2">{i + 1}</td>
                                <td className="px-3 py-2 font-medium">{d.name}</td>
                                <td className="px-3 py-2">{d.date}</td>
                                <td className="px-3 py-2 text-gray-400 italic text-xs">Nadine (Auto-generated)</td>
                                <td className="px-3 py-2 text-center"><button className="p-1 hover:bg-gray-100 rounded-full"><EyeIcon className="h-5 w-5"/></button></td>
                            </tr>
                        ))}
                        {laporanDocs.length === 0 && (
                             <tr><td colSpan={5} className="text-center py-4 text-gray-500">Belum ada dokumen laporan yang di-generate.</td></tr>
                        )}
                    </tbody>
                </table>
            </DetailSection>
        );
    }

    const DokumenPutusanTable = () => {
        const pDocs = (putusan || []).filter(p => (p as any).dokumen);
        return (
            <DetailSection title="4. Dokumen Putusan">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50"><tr>
                        {['No', 'Nomor Putusan', 'Nama Berkas', 'Tanggal', 'Aksi'].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {pDocs.map((p, i) => (
                            <tr key={p.id}>
                                <td className="px-3 py-2">{i+1}</td>
                                <td className="px-3 py-2 font-medium">{p.nomor}</td>
                                <td className="px-3 py-2 flex items-center space-x-2">
                                    <DocumentTextIcon className="h-4 w-4 text-red-500" />
                                    <span>{(p as any).dokumen}</span>
                                </td>
                                <td className="px-3 py-2">{p.tanggal}</td>
                                <td className="px-3 py-2 text-center"><button className="p-1 hover:bg-gray-100 rounded-full"><EyeIcon className="h-5 w-5"/></button></td>
                            </tr>
                        ))}
                        {pDocs.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-4 text-gray-500">Belum ada dokumen putusan yang diunggah.</td></tr>
                        )}
                    </tbody>
                </table>
            </DetailSection>
        );
    }

    return (
        <div className="space-y-2">
            <DokumenPermohonanTable />
            <DokumenLitigasiTable />
            <DokumenLaporanTable />
            <DokumenPutusanTable />
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

const DetailPerkara: React.FC<DetailPerkaraProps> = ({ record, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('informasi');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 bg-white h-full flex flex-col print:p-0">
        <Breadcrumb currentView="eAdvokasiPerkaraDetail" onNavigate={onNavigate} />
        <header className="flex-shrink-0 mb-6 flex justify-between items-start border-b border-gray-100 pb-4 print:mb-4">
            <div className="flex items-start">
                <button 
                    onClick={onBack} 
                    className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors mr-3 mt-1 print:hidden"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 print:text-xl">Informasi Perkara</h1>
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
                <TabButton name="posisi" label="Posisi Sidang" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="putusan" label="Putusan" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="dokumen" label="Dokumen" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="riwayat" label="Riwayat" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
        </div>
        
        <main className="flex-1 overflow-y-auto pr-4">
            {activeTab === 'informasi' && <InformasiUmumTab record={record} />}
            {activeTab === 'posisi' && <PosisiSidangTab record={record} onNavigate={onNavigate} />}
            {activeTab === 'putusan' && <PutusanTab record={record} onNavigate={onNavigate} />}
            {activeTab === 'dokumen' && <DokumenLitigasiTab record={record} />}
            {activeTab === 'riwayat' && <RiwayatTab record={record} />}
        </main>
    </div>
  );
};

export default DetailPerkara;
