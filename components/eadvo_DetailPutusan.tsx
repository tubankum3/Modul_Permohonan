import React, { useState } from 'react';
import { PerkaraRecord, Pihak, Tuntutan, Putusan, TuntutanAkhir, View } from '../types';
import { ArrowLeftIcon, EyeIcon, DocumentTextIcon, PrintIcon } from './icons';
import Breadcrumb from './Breadcrumb';

interface DetailPutusanProps {
  record: PerkaraRecord;
  onBack: () => void;
  onNavigate?: (view: View, record?: any) => void;
}

type DetailTab = 'informasi' | 'tindak_lanjut' | 'dokumen' | 'riwayat';

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
    <div className="border border-gray-200 rounded-md mb-6">
        <div className="px-4 py-3 bg-slate-50 font-semibold text-slate-700 border-b border-gray-200 rounded-t-md flex justify-between items-center text-base">
            <h3>{title}</h3>
            {action && <div className="flex items-center space-x-2">{action}</div>}
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const DetailRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col md:flex-row border-b border-gray-100 last:border-0 py-2.5 md:py-3">
        <span className="text-sm font-medium text-gray-500 w-full md:w-64 flex-shrink-0 mb-1 md:mb-0 pr-4">{label}</span>
        <span className="text-sm text-gray-800 font-medium">{value || '-'}</span>
    </div>
);

const InformasiUmumTab: React.FC<{ record: PerkaraRecord, onNavigate?: (view: any, record?: any) => void }> = ({ record, onNavigate }) => {
    const [expandedPutusan, setExpandedPutusan] = useState<number | null>(null);
    const a = record.abstraksiPerkara;
    
    // Create combined Pihak data
    const pihakCombined = [
        ...(record.pihakP || []).map(p => ({ ...p, kelompokPihak: 'Penggugat/Pemohon' })),
        ...(record.pihakT || []).map(p => ({ ...p, kelompokPihak: 'Tergugat/Termohon' }))
    ];

    return (
        <div className="space-y-4">
            <DetailSection title="Informasi Umum">
                <DetailRow label="Tahun Masuk" value={a?.tahunMasuk} />
                <DetailRow label="Nomor Perkara" value={a?.noPerkara || record.Nomor} />
                <DetailRow label="Tanggal Pendaftaran Gugatan" value={a?.tanggalPendaftaranGugatan} />
                <DetailRow label="Nomor SKU" value={a?.nomorSuratKuasaKhusus} />
                <DetailRow label="Wilayah" value={a?.wilayah} />
                <DetailRow label="Pengadilan" value={a?.pengadilan} />
                <DetailRow label="Jenis Perkara" value={a?.jenisPerkara} />
                <DetailRow label="Klasifikasi Perkara" value={a?.klasifikasiPerkara} />
                <DetailRow label="Sub Klasifikasi Perkara" value={a?.subKlasifikasiPerkara} />
                <DetailRow label="Sub Sub Klasifikasi Perkara" value={a?.subSubKlasifikasiPerkara} />
                <DetailRow label="Jenis Pokok Perkara" value={a?.jenisPokokPerkara} />
                <DetailRow label="Sub Pokok Perkara" value={a?.subPokokPerkara} />
                <DetailRow label="Sub Sub Pokok Perkara" value={a?.subSubPokokPerkara} />
                <DetailRow label="Rincian Pokok Perkara" value={a?.rincianPokokPerkara} />
                <DetailRow label="Unit Principal" value={
                    (() => {
                        const principals = [
                            ...(record.pihakP || []),
                            ...(record.pihakT || [])
                        ].filter(p => p.unitBerperkara === 'Ya');
                        return principals.length > 0 ? principals.map(p => p.identitas).join(', ') : '-';
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
                        (record.statusPutusan as string) === 'Selesai' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                        {record.statusPutusan || 'Dalam Proses'}
                    </span>
                } />
                <DetailRow label="Keterangan Dampak Putusan" value={record.statusBHT?.keteranganDampak} />
            </DetailSection>

            <DetailSection title="Pihak Penggugat / Pemohon">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50"><tr>
                            {['NO', 'PIHAK', 'IDENTITAS', 'KETERANGAN'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {(record.pihakP || []).map((p, i) => <tr key={p.id || i} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">{p.noUrut || (i + 1)}</td>
                                <td className="px-4 py-3 text-gray-700 font-medium">{p.jenisIdentitas}</td>
                                <td className="px-4 py-3 text-gray-700">{p.identitas}</td>
                                <td className="px-4 py-3 text-gray-500">{p.keterangan || '-'}</td>
                            </tr>)}
                            {(!record.pihakP || record.pihakP.length === 0) && <tr><td colSpan={4} className="py-6 text-center text-gray-400 italic">Tidak ada data pihak.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </DetailSection>

            <DetailSection title="Pihak Tergugat / Termohon">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50"><tr>
                            {['NO', 'PIHAK', 'IDENTITAS', 'KETERANGAN'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {(record.pihakT || []).map((p, i) => <tr key={p.id || i} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">{p.noUrut || (i + 1)}</td>
                                <td className="px-4 py-3 text-gray-700 font-medium">{p.jenisIdentitas}</td>
                                <td className="px-4 py-3 text-gray-700">{p.identitas}</td>
                                <td className="px-4 py-3 text-gray-500">{p.keterangan || '-'}</td>
                            </tr>)}
                            {(!record.pihakT || record.pihakT.length === 0) && <tr><td colSpan={4} className="py-6 text-center text-gray-400 italic">Tidak ada data pihak.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </DetailSection>
            
            <DetailSection title="Tuntutan">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50"><tr>
                            {['NO', 'OBJEK', 'JENIS', 'JUMLAH/NOMINAL', 'SATUAN', 'KETERANGAN'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {(record.tuntutanAkhir || []).map((t, i) => <tr key={t.id || i} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">{i + 1}</td>
                                <td className="px-4 py-3 text-gray-700">{t.jenisObjekTuntutan || t.objek || '-'}</td>
                                <td className="px-4 py-3 text-gray-700">{t.jenis}</td>
                                <td className="px-4 py-3 text-gray-700">{typeof t.jumlahNominal === 'number' ? t.jumlahNominal.toLocaleString('id-ID') : t.jumlahNominal}</td>
                                <td className="px-4 py-3 text-gray-700">{t.satuan}</td>
                                <td className="px-4 py-3 text-gray-500">{t.keterangan || '-'}</td>
                            </tr>)}
                            {(!record.tuntutanAkhir || record.tuntutanAkhir.length === 0) && <tr><td colSpan={6} className="py-6 text-center text-gray-400 italic">Tidak ada data tuntutan.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </DetailSection>

            <DetailSection title="Analisis">
                <DetailRow label="Isu Krusial" value={record.analisisPerkara?.isuKrusial} />
                <DetailRow label="Analisa Hukum" value={record.analisisPerkara?.analisaHukum} />
                <DetailRow label="Potensi Dampak" value={record.analisisPerkara?.potensiDampak} />
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
            
            <DetailSection title="Putusan">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">No</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Posisi</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nomor & Tanggal</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(record.putusan || []).map((p, index) => (
                                <React.Fragment key={p.id}>
                                    <tr className={`hover:bg-gray-50 transition-colors ${expandedPutusan === p.id ? 'bg-blue-50' : ''}`}>
                                        <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold uppercase tracking-wider">{p.posisi || 'Pertama'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-blue-700">{p.nomor}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{p.tanggal}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                                                p.status === 'Menang' ? 'bg-green-100 text-green-700' : 
                                                p.status === 'Kalah' ? 'bg-red-100 text-red-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button 
                                                    onClick={() => setExpandedPutusan(expandedPutusan === p.id ? null : p.id)}
                                                    className={`p-1.5 rounded-full transition-colors ${expandedPutusan === p.id ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                                                    title={expandedPutusan === p.id ? "Sembunyikan Detail" : "Lihat Detail"}
                                                >
                                                    <EyeIcon className="h-5 w-5"/>
                                                </button>
                                                <button type="button" onClick={() => onNavigate && onNavigate('formNaskah')} className="text-blue-500 p-1.5 hover:bg-blue-50 rounded-full" title="Generate Laporan (LAP) - Nadine"><DocumentTextIcon className="h-5 w-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedPutusan === p.id && (
                                        <tr className="bg-slate-50 border-x border-slate-200">
                                            <td colSpan={5} className="p-0">
                                                <div className="p-6 border-b-2 border-slate-200 shadow-inner">
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {/* Pertimbangan Hakim */}
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1.5">Pertimbangan Hakim</h4>
                                                            <div className="p-4 bg-white border border-gray-100 rounded-lg text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                                                                {p.pertimbanganHakim || 'Tidak ada data pertimbangan.'}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Amar Putusan */}
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1.5">Amar Putusan</h4>
                                                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-gray-900 leading-relaxed font-medium whitespace-pre-wrap">
                                                                {p.amar || 'Tidak ada data amar.'}
                                                            </div>
                                                        </div>

                                                        {/* Keterangan */}
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1.5">Keterangan Tambahan</h4>
                                                            <div className="p-4 bg-white border border-gray-100 rounded-lg text-sm text-gray-600 italic whitespace-pre-wrap">
                                                                {p.keterangan || 'Tidak ada keterangan.'}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Majelis & Panitera</h4>
                                                                <div className="space-y-1.5">
                                                                    {p.susunanMajelis?.map(m => (
                                                                        <div key={m.id} className="flex justify-between text-xs p-2.5 bg-white border border-gray-100 rounded-md">
                                                                            <span className="text-gray-500">{m.jabatan}:</span>
                                                                            <span className="font-semibold text-gray-700">{m.identitas}</span>
                                                                        </div>
                                                                    ))}
                                                                    {(!p.susunanMajelis || p.susunanMajelis.length === 0) && <p className="text-xs text-gray-400 italic mt-2">Belum ada majelis.</p>}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Dokumen Putusan</h4>
                                                                {p.dokumen ? (
                                                                    <div className="flex items-center justify-between p-3 bg-white border border-red-100 rounded-md">
                                                                        <div className="flex items-center space-x-3">
                                                                            <DocumentTextIcon className="h-5 w-5 text-red-500" />
                                                                            <span className="text-sm font-medium text-gray-700">{p.dokumen}</span>
                                                                        </div>
                                                                        <button className="text-[10px] font-bold tracking-wider text-blue-600 uppercase hover:text-blue-800">Unduh</button>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-gray-400 italic mt-2">Belum ada dokumen.</p>
                                                                )}
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
                                <tr><td colSpan={5} className="py-6 text-center text-gray-400 italic">Tidak ada data putusan.</td></tr>
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
                <TabButton name="tindak_lanjut" label="Tindak Lanjut" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="dokumen" label="Dokumen" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="riwayat" label="Riwayat" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
        </div>
        
        <main className="flex-1 overflow-y-auto pr-4">
            {activeTab === 'informasi' && <InformasiUmumTab record={record} onNavigate={onNavigate} />}
            {activeTab === 'tindak_lanjut' && <TindakLanjutTab record={record} />}
            {activeTab === 'dokumen' && <DokumenTab record={record} />}
            {activeTab === 'riwayat' && <RiwayatTab record={record} />}
        </main>
    </div>
  );
};

export default DetailPutusan;
