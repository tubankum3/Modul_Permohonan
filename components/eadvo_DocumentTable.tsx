import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  TagIcon, 
  EyeIcon, 
  DownloadIcon, 
  TrashIcon, 
  XIcon, 
  CheckIcon, 
  PrinterIcon 
} from './icons';

export interface DocumentItemRow {
  id?: string | number;
  nama?: string;
  name?: string;
  nomor?: string;
  noDokumen?: string;
  noNaskah?: string;
  tanggal?: string;
  tanggalDokumen?: string;
  timestamp?: string;
  date?: string;
  perihal?: string;
  deskripsi?: string;
  description?: string;
  uraian?: string;
  tindakLanjut?: string;
  size?: number | string;
  ukuran?: string | number;
  jenis?: string;
  type?: string;
  tags?: string[];
  kategori?: string;
  source?: string;
  status?: string;
  file?: any;
  url?: string;
}

interface DocumentTableProps {
  title?: string;
  subtitle?: string;
  countBadge?: number;
  headerAction?: React.ReactNode;
  items: DocumentItemRow[];
  onDelete?: (item: DocumentItemRow, index: number) => void;
  onPreview?: (item: DocumentItemRow) => void;
  onDownload?: (item: DocumentItemRow) => void;
  emptyMessage?: string;
  categoryContext?: 'permohonan' | 'litigasi' | 'pendampingan' | 'laporan' | 'putusan' | 'tindak_lanjut' | 'telaahan' | 'umum';
  className?: string;
}

export const getSmartTags = (
  item: DocumentItemRow, 
  categoryContext?: string
): string[] => {
  if (item.tags && item.tags.length > 0) {
    return item.tags;
  }

  const generatedTags: string[] = [];
  const textCorpus = `${item.nama || ''} ${item.name || ''} ${item.perihal || ''} ${item.jenis || ''} ${item.type || ''} ${item.source || ''} ${item.status || ''} ${categoryContext || ''}`.toLowerCase();

  // Source-based tag
  if (item.source?.toLowerCase().includes('nadine') || textCorpus.includes('nadine')) {
    generatedTags.push('Nadine');
  } else if (item.url || textCorpus.includes('upload') || item.size) {
    generatedTags.push('Upload');
  }

  // Type / Context-based tag
  if (textCorpus.includes('sku') || textCorpus.includes('surat kuasa')) {
    generatedTags.push('SKU', 'Litigasi');
  } else if (textCorpus.includes('permohonan')) {
    generatedTags.push('Permohonan');
  } else if (textCorpus.includes('pendampingan')) {
    generatedTags.push('Pendampingan', 'Legal Advice');
  } else if (textCorpus.includes('putusan')) {
    generatedTags.push('Putusan');
    if (item.status) {
      generatedTags.push(item.status);
    } else {
      generatedTags.push('Salinan');
    }
  } else if (textCorpus.includes('laporan') || textCorpus.includes('sidang')) {
    generatedTags.push('Laporan', 'Sidang');
  } else if (textCorpus.includes('telaahan') || textCorpus.includes('kajian')) {
    generatedTags.push('Telaahan', 'Kajian Hukum');
  } else if (textCorpus.includes('tindak lanjut')) {
    generatedTags.push('Tindak Lanjut');
  } else if (textCorpus.includes('jawab jinawab') || textCorpus.includes('eksepsi') || textCorpus.includes('replik') || textCorpus.includes('duplik')) {
    generatedTags.push('Jawab Jinawab', 'Litigasi');
  }

  // Fallback defaults
  if (generatedTags.length === 0) {
    if (categoryContext === 'litigasi') generatedTags.push('Litigasi', 'Resmi');
    else if (categoryContext === 'pendampingan') generatedTags.push('Pendampingan', 'Resmi');
    else if (categoryContext === 'permohonan') generatedTags.push('Permohonan', 'Internal');
    else if (categoryContext === 'putusan') generatedTags.push('Putusan', 'Final');
    else if (categoryContext === 'telaahan') generatedTags.push('Telaahan', 'Analisis');
    else generatedTags.push('Dokumen', 'Resmi');
  }

  // Deduplicate and limit to 3 tags max
  return Array.from(new Set(generatedTags)).slice(0, 3);
};

export const formatFileSize = (size: number | string | undefined): string => {
  if (size === undefined || size === null || size === '') return '150.0 KB';
  if (typeof size === 'string') {
    if (size.toLowerCase().includes('kb') || size.toLowerCase().includes('mb')) return size;
    const parsed = parseFloat(size);
    if (!isNaN(parsed)) return `${(parsed / 1024).toFixed(1)} KB`;
    return size;
  }
  if (typeof size === 'number') {
    if (size === 0) return '0 KB';
    if (size > 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return '150.0 KB';
};

export const DocumentTable: React.FC<DocumentTableProps> = ({
  title,
  subtitle,
  countBadge,
  headerAction,
  items,
  onDelete,
  onPreview,
  onDownload,
  emptyMessage = 'Belum ada dokumen yang tersedia.',
  categoryContext = 'umum',
  className = ''
}) => {
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentItemRow | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleOpenPreview = (item: DocumentItemRow) => {
    if (onPreview) {
      onPreview(item);
    } else {
      setSelectedPreviewDoc(item);
    }
  };

  const handleTriggerDownload = (item: DocumentItemRow) => {
    const docName = item.nama || item.name || item.perihal || 'Dokumen';
    setDownloadToast(`Mengunduh berkas "${docName}"...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3000);

    if (onDownload) {
      onDownload(item);
    }
  };

  const getDocColorTheme = (item: DocumentItemRow) => {
    const textCorpus = `${item.nama || ''} ${item.name || ''} ${item.jenis || ''} ${item.type || ''}`.toLowerCase();
    if (textCorpus.includes('putusan')) return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' };
    if (textCorpus.includes('sku') || textCorpus.includes('litigasi')) return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
    if (textCorpus.includes('laporan') || textCorpus.includes('sidang')) return { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' };
    if (textCorpus.includes('telaahan')) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
  };

  const getTagBadgeStyle = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('nadine')) return 'bg-sky-50 text-sky-700 border-sky-200/80';
    if (t.includes('sku') || t.includes('litigasi')) return 'bg-purple-50 text-purple-700 border-purple-200/80';
    if (t.includes('putusan') || t.includes('menang') || t.includes('inkracht')) return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    if (t.includes('kalah')) return 'bg-rose-50 text-rose-700 border-rose-200/80';
    if (t.includes('telaahan') || t.includes('kajian')) return 'bg-amber-50 text-amber-800 border-amber-200/80';
    if (t.includes('laporan') || t.includes('sidang')) return 'bg-teal-50 text-teal-700 border-teal-200/80';
    if (t.includes('permohonan')) return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
    return 'bg-slate-50 text-slate-700 border-slate-200/80';
  };

  const getEffectiveDocName = (item: DocumentItemRow) => {
    if (item.nama) return item.nama;
    if (item.name) return item.name;
    if (item.file && item.file.name) return item.file.name;
    if (item.perihal) return item.perihal;
    return 'Dokumen Terlampir';
  };

  const getEffectiveDocNo = (item: DocumentItemRow) => {
    if (item.nomor) return item.nomor;
    if (item.noDokumen) return item.noDokumen;
    if (item.noNaskah) return item.noNaskah;
    if (item.file && item.file.nomor) return item.file.nomor;
    return '-';
  };

  const getEffectiveDocDate = (item: DocumentItemRow) => {
    if (item.tanggal) return item.tanggal;
    if (item.tanggalDokumen) return item.tanggalDokumen;
    if (item.date) return item.date;
    if (item.timestamp) return item.timestamp.split(' ')[0];
    if (item.file && item.file.tanggal) return item.file.tanggal;
    return '-';
  };

  const getEffectiveDocDesc = (item: DocumentItemRow) => {
    if (item.deskripsi) return item.deskripsi;
    if (item.description) return item.description;
    if (item.uraian) return item.uraian;
    if (item.perihal && (item.nama || item.name)) return item.perihal;
    if (item.tindakLanjut) return item.tindakLanjut;
    if (item.file && (item.file.deskripsi || item.file.description)) return item.file.deskripsi || item.file.description;
    return 'Tidak ada deskripsi tambahan.';
  };

  const getEffectiveDocType = (item: DocumentItemRow) => {
    if (item.jenis) return item.jenis;
    if (item.type && !item.type.includes('/') && !item.type.includes('application')) return item.type;
    if (item.kategori) return item.kategori;
    if (item.file && item.file.jenis) return item.file.jenis;
    return 'Dokumen';
  };

  return (
    <div className={`bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-6 ${className}`}>
      {/* Toast Alert for Download */}
      {downloadToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckIcon className="w-4 h-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Card Header */}
      {title && (
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center space-x-3">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
            <span className="bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {countBadge !== undefined ? countBadge : items.length} Berkas
            </span>
            {subtitle && (
              <span className="text-xs text-slate-500 hidden md:inline border-l border-slate-300 pl-3">
                {subtitle}
              </span>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2">
              {headerAction}
            </div>
          )}
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {/* 1. No */}
              <th scope="col" className="px-4 py-3 text-center text-[11px] font-bold text-slate-600 uppercase tracking-wider w-12">
                No
              </th>
              {/* 2. No. & Tanggal Dokumen */}
              <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider min-w-[190px] w-56">
                No. & Tanggal Dokumen
              </th>
              {/* 3. Perihal/Deskripsi */}
              <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider min-w-[280px]">
                Perihal/Deskripsi
              </th>
              {/* 4. Ukuran / Jenis */}
              <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider min-w-[150px] w-44">
                Ukuran / Jenis
              </th>
              {/* 5. Tags */}
              <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider min-w-[160px] w-48">
                Tags
              </th>
              {/* 6. Aksi */}
              <th scope="col" className="px-4 py-3 text-center text-[11px] font-bold text-slate-600 uppercase tracking-wider w-28">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {items.length > 0 ? (
              items.map((item, index) => {
                const docName = getEffectiveDocName(item);
                const docNo = getEffectiveDocNo(item);
                const docDate = getEffectiveDocDate(item);
                const docDesc = getEffectiveDocDesc(item);
                const docType = getEffectiveDocType(item);
                const docSize = formatFileSize(item.size || item.ukuran);
                const docTags = getSmartTags(item, categoryContext);
                const theme = getDocColorTheme(item);

                return (
                  <tr 
                    key={item.id || index} 
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* 1. No */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap text-xs font-semibold text-slate-500">
                      {index + 1}
                    </td>

                    {/* 2. No. & Tanggal Dokumen */}
                    <td className="px-5 py-3.5 text-xs text-slate-700">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block break-words" title={docNo}>
                          {docNo}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{docDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Perihal/Deskripsi */}
                    <td className="px-5 py-3.5 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 ${theme.bg} ${theme.text} border ${theme.border}`}>
                          <DocumentTextIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => handleOpenPreview(item)}
                            className="font-bold text-slate-900 hover:text-blue-700 text-xs text-left transition-colors line-clamp-2 block"
                            title={docName}
                          >
                            {docName}
                          </button>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-normal leading-relaxed">
                            {docDesc}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 4. Ukuran / Jenis */}
                    <td className="px-4 py-3.5 text-xs">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-200 max-w-full truncate" title={docType}>
                          {docType}
                        </span>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {docSize}
                        </div>
                      </div>
                    </td>

                    {/* 5. Tags */}
                    <td className="px-4 py-3.5 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {docTags.map((tag, tagIdx) => (
                          <span 
                            key={tagIdx}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getTagBadgeStyle(tag)}`}
                          >
                            <TagIcon className="w-2.5 h-2.5 opacity-60 shrink-0" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 6. Aksi */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap text-xs">
                      <div className="flex items-center justify-center space-x-1">
                        {/* Lihat */}
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(item)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Pratinjau Dokumen"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {/* Unduh */}
                        <button
                          type="button"
                          onClick={() => handleTriggerDownload(item)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Unduh Berkas Dokumen"
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </button>
                        {/* Hapus (optional) */}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item, index)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Dokumen"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 bg-slate-50/40">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                    <DocumentTextIcon className="w-8 h-8 text-slate-300 stroke-1" />
                    <p className="text-xs font-medium text-slate-500 italic">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Embedded Document Preview Modal */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3 min-w-0 pr-4">
                <div className="p-2 bg-blue-600/30 text-blue-400 rounded-lg shrink-0">
                  <DocumentTextIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold truncate">
                    {getEffectiveDocName(selectedPreviewDoc)}
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate">
                    No: {getEffectiveDocNo(selectedPreviewDoc)} • Tanggal: {getEffectiveDocDate(selectedPreviewDoc)}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedPreviewDoc(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">
              {/* Metadata Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Nomor</span>
                    <span className="font-semibold text-slate-800">{getEffectiveDocNo(selectedPreviewDoc)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tanggal</span>
                    <span className="font-semibold text-slate-800">{getEffectiveDocDate(selectedPreviewDoc)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Jenis / Ukuran</span>
                    <span className="font-semibold text-slate-800">
                      {getEffectiveDocType(selectedPreviewDoc)} ({formatFileSize(selectedPreviewDoc.size || selectedPreviewDoc.ukuran)})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tags</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {getSmartTags(selectedPreviewDoc, categoryContext).map((tag, i) => (
                        <span key={i} className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getTagBadgeStyle(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Perihal / Deskripsi</span>
                  <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    {getEffectiveDocDesc(selectedPreviewDoc)}
                  </p>
                </div>
              </div>

              {/* Mock PDF Document Preview Canvas */}
              <div className="bg-white rounded-xl border border-slate-300 shadow-xs p-8 max-w-2xl mx-auto space-y-6">
                <div className="border-b-2 border-slate-900 pb-4 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</p>
                  <p className="text-xs font-extrabold text-slate-900 tracking-wide">BIRO ADVOKASI - SEKRETARIAT JENDERAL</p>
                  <p className="text-[10px] text-slate-500">SISTEM INFORMASI E-ADVOKASI</p>
                </div>

                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <div className="flex justify-between text-[11px] text-slate-600 border-b border-dashed border-slate-200 pb-2">
                    <span>No. Naskah: <strong className="text-slate-900">{getEffectiveDocNo(selectedPreviewDoc)}</strong></span>
                    <span>Tanggal: <strong className="text-slate-900">{getEffectiveDocDate(selectedPreviewDoc)}</strong></span>
                  </div>

                  <p className="font-bold text-sm text-slate-900 pt-2 text-center uppercase tracking-wide">
                    {getEffectiveDocName(selectedPreviewDoc)}
                  </p>

                  <p className="text-justify text-slate-600">
                    Dokumen ini merupakan arsip resmi penanganan advokasi hukum dalam lingkungan Kementerian Keuangan Republik Indonesia. Dokumen telah diverifikasi dan tersimpan dalam pangkalan data e-Advokasi untuk kepentingan penanganan perkara, pendampingan hukum, penanganan putusan, atau telaahan kasus hukum.
                  </p>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                    <p className="font-semibold text-slate-800">Catatan Ringkasan:</p>
                    <p className="text-slate-600 mt-1 italic">{getEffectiveDocDesc(selectedPreviewDoc)}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-400">
                  <span>ID Berkas: {selectedPreviewDoc.id || 'DOC-REG-2026'}</span>
                  <div className="text-right">
                    <span className="block font-bold text-slate-700">Terverifikasi Digital</span>
                    <span>Biro Advokasi Kemenkeu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setSelectedPreviewDoc(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition"
              >
                Tutup
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleTriggerDownload(selectedPreviewDoc);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Unduh Dokumen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
