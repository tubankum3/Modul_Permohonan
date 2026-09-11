import React, { useState, useMemo } from 'react';
import { Permohonan, Riwayat, PendampinganRecord, PerkaraRecord, PosisiSidangEntry } from '../types';
import DetailPermohonan from './satkem_DetailPermohonan';
import AssignTeam from './AssignTeam';
import { ArrowLeftIcon, SearchIcon, FileTextIcon, CheckIcon, EyeIcon, ShieldCheckIcon, BriefcaseIcon, DocumentAddIcon } from './icons';
import Breadcrumb from './Breadcrumb';
import DetailPendampingan from './eadvo_DetailPendampingan';
import DetailPerkara from './eadvo_DetailPerkara';
import DetailPutusan from './eadvo_DetailPutusan';

interface ProsesPermohonanProps {
  permohonan: Permohonan;
  pendampinganRecords: PendampinganRecord[];
  perkaraRecords: PerkaraRecord[];
  putusanRecords: PerkaraRecord[];
  onBack: () => void;
  onAccept: (id: string) => void;
  onAssignToExisting: (permohonanId: string, targetId: string, targetType: 'pendampingan' | 'perkara' | 'putusan') => void;
  onAddReply: (permohonanId: string, reply: Riwayat) => void;
  onUpdateReply: (permohonanId: string, historyId: number, newMessage: string) => void;
  onDeleteReply: (permohonanId: string, historyId: number) => void;
  onUpdateTeam: (permohonanId: string, team: any[]) => void;
  onSetPic: (permohonanId: string, picId: string | null) => void;
  onNavigate: (view: any, data?: any) => void;
}

const getPicName = (record: PendampinganRecord | PerkaraRecord): string => {
    if (!record.picId || !record.team || record.team.length === 0) {
        return 'N/A';
    }
    const pic = record.team.find((member) => member.id === record.picId);
    return pic ? pic.nama : 'N/A';
};

const getStatusPosisi = (record: PerkaraRecord): string => {
    if (!record.posisiSidang) return 'Belum ada';
    
    const allEntries: PosisiSidangEntry[] = [
        ...(record.posisiSidang.tkPK || []),
        ...(record.posisiSidang.tkKasasi || []),
        ...(record.posisiSidang.tkBanding || []),
        ...(record.posisiSidang.tkPertama || []),
    ];

    if (allEntries.length === 0) return 'Belum ada sidang';

    const sortedEntries = allEntries.sort((a, b) => {
        try {
            const dateA = new Date(a.tanggalSidang.split('/').reverse().join('-'));
            const dateB = new Date(b.tanggalSidang.split('/').reverse().join('-'));
            return dateB.getTime() - dateA.getTime();
        } catch (e) {
            return 0;
        }
    });

    return sortedEntries[0]?.agendaSidang || 'Tidak ada agenda';
};

const ProsesPermohonan: React.FC<ProsesPermohonanProps> = ({
  permohonan,
  pendampinganRecords,
  perkaraRecords,
  putusanRecords,
  onBack,
  onAccept,
  onAssignToExisting,
  onAddReply,
  onUpdateReply,
  onDeleteReply,
  onUpdateTeam,
  onSetPic,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'rincian' | 'assign' | 'assignExisting' | 'rekamBaru'>('rincian');
  const [selectedTargetType, setSelectedTargetType] = useState<'pendampingan' | 'perkara' | 'putusan'>('pendampingan');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingRecord, setViewingRecord] = useState<{ record: any; type: 'pendampingan' | 'perkara' | 'putusan' } | null>(null);

  const assignedRecordInfo = useMemo(() => {
    if (!permohonan.assignedTo) return null;
    const pd = pendampinganRecords.find(r => r.id === permohonan.assignedTo);
    if (pd) return { type: 'pendampingan' as const, typeLabel: 'Pendampingan', record: pd, viewDoc: 'eAdvokasiPendampinganDokumen' };
    const pk = perkaraRecords.find(r => r.id === permohonan.assignedTo);
    if (pk) return { type: 'perkara' as const, typeLabel: 'Penanganan Perkara', record: pk, viewDoc: 'eAdvokasiPerkaraDokumen' };
    const pt = putusanRecords.find(r => r.id === permohonan.assignedTo);
    if (pt) return { type: 'putusan' as const, typeLabel: 'Penanganan Putusan', record: pt, viewDoc: 'eAdvokasiPutusanDokumen' };
    return null;
  }, [permohonan.assignedTo, pendampinganRecords, perkaraRecords, putusanRecords]);

  const permohonanFiles = useMemo(() => {
    const docs: any[] = [];
    if (permohonan.files && permohonan.files.length > 0) {
      permohonan.files.forEach((f: any, idx: number) => {
        docs.push({
          id: f.id || `perm-${permohonan.id}-f-${idx}`,
          name: f.name,
          size: f.size || 102400,
          type: f.type || 'application/pdf',
          nomor: f.nomor || permohonan.Nomor || permohonan.id,
          tanggal: f.tanggal || permohonan.tanggal,
          jenis: f.jenis || 'Surat Permohonan / Lampiran',
          deskripsi: f.deskripsi || (f as any).description || `Lampiran berkas: ${permohonan.perihal}`,
          source: f.source || permohonan.sumber || 'Permohonan'
        });
      });
    } else {
      docs.push({
        id: `perm-${permohonan.id}-main`,
        name: `Surat Permohonan - ${permohonan.Nomor || permohonan.id}.pdf`,
        size: 145000,
        type: 'application/pdf',
        nomor: permohonan.Nomor || permohonan.id,
        tanggal: permohonan.tanggal,
        jenis: 'Surat Permohonan',
        deskripsi: permohonan.perihal,
        source: permohonan.sumber || 'Permohonan'
      });
    }

    if (permohonan.history) {
      permohonan.history.forEach((h: any) => {
        if (h.files && h.files.length > 0) {
          h.files.forEach((hf: any, fIdx: number) => {
            docs.push({
              id: hf.id || `perm-hist-${h.id}-${fIdx}`,
              name: hf.name,
              size: hf.size || 85000,
              type: hf.type || 'application/pdf',
              nomor: permohonan.Nomor || permohonan.id,
              tanggal: h.timestamp ? new Date(h.timestamp).toLocaleDateString('id-ID') : permohonan.tanggal,
              jenis: 'Lampiran Balasan Permohonan',
              deskripsi: h.message || `Lampiran diskusi oleh ${h.author}`,
              source: 'Permohonan (Riwayat)'
            });
          });
        }
      });
    }
    return docs;
  }, [permohonan]);

  const handleTopLevelAcceptAndProcess = () => {
    if (selectedTargetId) {
      onAssignToExisting(permohonan.id, selectedTargetId, selectedTargetType);
    } else {
      onAccept(permohonan.id);
    }
  };

  const handleAssign = () => {
    if (selectedTargetId) {
        onAssignToExisting(permohonan.id, selectedTargetId, selectedTargetType);
    }
  };

  const getTargetList = () => {
      let list: (PendampinganRecord | PerkaraRecord)[] = [];
      switch (selectedTargetType) {
          case 'pendampingan': list = pendampinganRecords; break;
          case 'perkara': list = perkaraRecords; break;
          case 'putusan': list = putusanRecords; break;
          default: list = [];
      }

      if (!searchTerm) return list;

      return list.filter(item => 
          (item.Nomor && item.Nomor.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.perihal && item.perihal.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.id && String(item.id).toLowerCase().includes(searchTerm.toLowerCase()))
      );
  };

  const selectedRecord = getTargetList().find(r => r.id === selectedTargetId);

  const renderTableHeader = () => {
      switch (selectedTargetType) {
          case 'pendampingan':
              return (
                  <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Tiket/ND</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Masuk</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Pemanggil</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Pemohon</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pihak yang Dipanggil</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
              );
          case 'perkara':
              return (
                  <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Perkara</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Masuk</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Perkara</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pokok Perkara</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Posisi</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
              );
          case 'putusan':
              return (
                  <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Perkara</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Masuk</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Perkara</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status BHT</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
              );
          default:
              return null;
      }
  };

  const renderTableRow = (record: PendampinganRecord | PerkaraRecord, index: number) => {
      const isSelected = selectedTargetId === record.id;
      const rowClass = `hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`;
      const actionButton = (
          <div className="flex items-center justify-end space-x-2">
              <button
                  type="button"
                  onClick={() => setViewingRecord({ record, type: selectedTargetType })}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-md text-xs font-semibold transition"
              >
                  View
              </button>
              <button
                  type="button"
                  onClick={() => setSelectedTargetId(record.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
              >
                  {isSelected ? 'Terpilih' : 'Pilih'}
              </button>
          </div>
      );

      if (selectedTargetType === 'pendampingan') {
          const r = record as PendampinganRecord;
          return (
              <tr key={r.id} className={rowClass}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.abstraksi?.nomorTiket || r.Nomor || r.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.abstraksi?.tahunMasuk || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={r.abstraksi?.unitPemanggil}>{r.abstraksi?.unitPemanggil || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={r.abstraksi?.unitPemohon || r.unit}>{r.abstraksi?.unitPemohon || r.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={r.abstraksi?.pihakDipanggil}>{r.abstraksi?.pihakDipanggil || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPicName(r)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">{actionButton}</td>
              </tr>
          );
      } else if (selectedTargetType === 'perkara') {
          const r = record as PerkaraRecord;
          return (
              <tr key={r.id} className={rowClass}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.abstraksiPerkara?.noPerkara || r.Nomor || r.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.abstraksiPerkara?.tahunMasuk || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={r.abstraksiPerkara?.jenisPerkara}>{r.abstraksiPerkara?.jenisPerkara || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={r.abstraksiPerkara?.jenisPokokPerkara}>{r.abstraksiPerkara?.jenisPokokPerkara || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusPosisi(r)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPicName(r)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">{actionButton}</td>
              </tr>
          );
      } else { // putusan
          const r = record as PerkaraRecord;
          return (
              <tr key={r.id} className={rowClass}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.abstraksiPerkara?.noPerkara || r.Nomor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.abstraksiPerkara?.tahunMasuk}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.abstraksiPerkara?.jenisPerkara}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.statusBHT?.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">{actionButton}</td>
              </tr>
          );
      }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200">
        <div className="mb-3">
          <Breadcrumb currentView="eAdvokasiProses" onNavigate={onNavigate} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {permohonan?.status === 'Diproses' || permohonan?.status === 'Selesai' ? 'Rincian Permohonan' : 'Proses Permohonan'}
              </h2>
              <p className="text-base font-semibold text-gray-700 mt-1">
                  {permohonan?.Nomor || permohonan?.id || 'N/A'}
              </p>
              {permohonan?.perihal && (
                  <p className="text-sm text-gray-600 mt-1">{permohonan.perihal}</p>
              )}
            </div>
          </div>
          {permohonan?.status !== 'Diproses' && permohonan?.status !== 'Selesai' && (
            <button
              onClick={handleTopLevelAcceptAndProcess}
              className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Terima & Proses Permohonan
            </button>
          )}
        </div>
      </header>
      
      <div className="border-b border-gray-200 bg-white">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('rincian')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rincian'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rincian Permohonan
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assign'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assign Team
          </button>
          <button
            onClick={() => setActiveTab('assignExisting')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assignExisting'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assign to Existing
          </button>
          <button
            onClick={() => setActiveTab('rekamBaru')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-1.5 ${
              activeTab === 'rekamBaru'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DocumentAddIcon className="h-4 w-4" />
            <span>Rekam Data Baru</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'rincian' && (
          <DetailPermohonan
            permohonan={permohonan}
            onAddReply={onAddReply}
            onUpdateReply={onUpdateReply}
            onDeleteReply={onDeleteReply}
            currentUserRole="Administrator"
          />
        )}
        {activeTab === 'assign' && (
          <AssignTeam 
            team={permohonan.team || []}
            picId={permohonan.picId || null}
            onUpdateTeam={(team) => onUpdateTeam(permohonan.id, team)}
            onSetPic={(picId) => onSetPic(permohonan.id, picId)}
          />
        )}
        {activeTab === 'assignExisting' && (
            <div className="p-6 bg-white m-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Assign Permohonan ke Data Existing</h3>
                <p className="text-sm text-gray-500 mb-6">Pilih jenis data dan cari data yang sesuai untuk menghubungkan permohonan ini beserta seluruh dokumen/lampirannya.</p>

                {/* Banner Status Jika Sudah Terhubung */}
                {assignedRecordInfo && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-emerald-100 rounded-full text-emerald-700 mt-0.5">
                                <CheckIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-emerald-900">
                                    Permohonan ini telah terhubung ke {assignedRecordInfo.typeLabel}
                                </h4>
                                <p className="text-xs text-emerald-700 mt-0.5">
                                    Nomor: <span className="font-semibold">{assignedRecordInfo.record.Nomor || assignedRecordInfo.record.id}</span> — {permohonanFiles.length} dokumen/lampiran telah tersambung di Dokumen Permohonan.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate(assignedRecordInfo.viewDoc, assignedRecordInfo.record)}
                            className="inline-flex items-center px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors whitespace-nowrap"
                        >
                            <FileTextIcon className="h-4 w-4 mr-1.5" />
                            Buka Dokumen Permohonan
                        </button>
                    </div>
                )}

                {/* Rangkuman Dokumen & Lampiran Permohonan */}
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <FileTextIcon className="h-5 w-5 text-blue-600" />
                            <h4 className="text-sm font-semibold text-gray-800">
                                Berkas Dokumen & Lampiran Permohonan ({permohonanFiles.length})
                            </h4>
                        </div>
                        <span className="text-xs text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full font-medium">
                            Otomatis terhubung ke Dokumen Permohonan target
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {permohonanFiles.map((f, fIdx) => (
                            <div key={f.id || fIdx} className="p-2.5 bg-white border border-gray-200 rounded-md flex items-center justify-between space-x-2 text-xs">
                                <div className="truncate flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate" title={f.name}>{f.name}</p>
                                    <p className="text-gray-500 text-[11px] truncate">{f.jenis || 'Dokumen'} • {f.source || 'Permohonan'}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">{Math.round((f.size || 102400) / 1024)} KB</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis Data Target</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="radio" className="form-radio text-blue-600" name="targetType" value="pendampingan" checked={selectedTargetType === 'pendampingan'} onChange={() => { setSelectedTargetType('pendampingan'); setSelectedTargetId(''); setSearchTerm(''); }} />
                            <span className="ml-2 font-medium text-gray-800">Pendampingan</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="radio" className="form-radio text-blue-600" name="targetType" value="perkara" checked={selectedTargetType === 'perkara'} onChange={() => { setSelectedTargetType('perkara'); setSelectedTargetId(''); setSearchTerm(''); }} />
                            <span className="ml-2 font-medium text-gray-800">Penanganan Perkara</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="radio" className="form-radio text-blue-600" name="targetType" value="putusan" checked={selectedTargetType === 'putusan'} onChange={() => { setSelectedTargetType('putusan'); setSelectedTargetId(''); setSearchTerm(''); }} />
                            <span className="ml-2 font-medium text-gray-800">Penanganan Putusan</span>
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cari Data Target</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Cari berdasarkan Nomor, Perihal, atau ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-6 border border-gray-200 rounded-md overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                {renderTableHeader()}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getTargetList().length > 0 ? (
                                    getTargetList().map((record, index) => renderTableRow(record, index))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                                            Tidak ada data yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-750">
                        {selectedTargetId ? (
                            <div className="flex flex-wrap items-center gap-2">
                                <span>
                                    Data terpilih: <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{selectedRecord?.Nomor || selectedRecord?.id}</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTargetId('')}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white border border-transparent rounded-md text-xs font-semibold shadow-sm transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        ) : (
                            <span className="text-gray-500">Pilih salah satu baris data di atas untuk menghubungkan dokumen permohonan ke data tersebut.</span>
                        )}
                    </div>
                    {selectedTargetId && (
                        <button
                            type="button"
                            onClick={handleAssign}
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                        >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Hubungkan Dokumen ke Data Ini
                        </button>
                    )}
                </div>
            </div>
        )}
        {activeTab === 'rekamBaru' && (
            <div className="p-6 bg-white m-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Rekam Data Baru dari Permohonan</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Pilih modul tujuan di bawah ini. Semua informasi permohonan beserta seluruh berkas dokumen & lampiran ({permohonanFiles.length} berkas) akan otomatis masuk ke Dokumen Permohonan data baru tersebut.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kartu 1: Pendampingan Baru */}
                    <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-700">
                                    <ShieldCheckIcon className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    Pendampingan
                                </span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900 mb-2">Rekam Pendampingan Baru</h4>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Catat permohonan ini sebagai berkas Pendampingan Hukum baru. Seluruh berkas surat dan lampiran diskusi akan terhubung ke <strong>Dokumen Permohonan</strong> pada data Pendampingan.
                            </p>
                            <div className="text-xs text-gray-500 bg-white/80 p-2.5 rounded-lg border border-blue-100 mb-4">
                                <p className="font-semibold text-gray-700 mb-1">Dokumen yang terhubung ({permohonanFiles.length}):</p>
                                <p className="truncate text-gray-600">{permohonanFiles.map(f => f.name).join(', ')}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate('eAdvokasiPendampingan', permohonan)}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                        >
                            <DocumentAddIcon className="h-4 w-4 mr-2" />
                            Rekam Pendampingan
                        </button>
                    </div>

                    {/* Kartu 2: Penanganan Perkara Baru */}
                    <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700">
                                    <BriefcaseIcon className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                    Penanganan Perkara
                                </span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900 mb-2">Rekam Perkara Baru</h4>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Catat permohonan ini sebagai perkara Litigasi baru. Seluruh berkas surat dan lampiran diskusi otomatis masuk ke folder <strong>Dokumen Permohonan</strong> perkara.
                            </p>
                            <div className="text-xs text-gray-500 bg-white/80 p-2.5 rounded-lg border border-indigo-100 mb-4">
                                <p className="font-semibold text-gray-700 mb-1">Dokumen yang terhubung ({permohonanFiles.length}):</p>
                                <p className="truncate text-gray-600">{permohonanFiles.map(f => f.name).join(', ')}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate('eAdvokasiPerkaraEdit', permohonan)}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                        >
                            <DocumentAddIcon className="h-4 w-4 mr-2" />
                            Rekam Penanganan Perkara
                        </button>
                    </div>

                    {/* Kartu 3: Penanganan Putusan Baru */}
                    <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-700">
                                    <FileTextIcon className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                                    Penanganan Putusan
                                </span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900 mb-2">Rekam Putusan Baru</h4>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Catat permohonan ini sebagai Penanganan Putusan baru. Seluruh dokumen dan lampiran permohonan akan terintegrasi langsung ke <strong>Dokumen Permohonan</strong> putusan.
                            </p>
                            <div className="text-xs text-gray-500 bg-white/80 p-2.5 rounded-lg border border-emerald-100 mb-4">
                                <p className="font-semibold text-gray-700 mb-1">Dokumen yang terhubung ({permohonanFiles.length}):</p>
                                <p className="truncate text-gray-600">{permohonanFiles.map(f => f.name).join(', ')}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate('eAdvokasiPutusanEdit', permohonan)}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                        >
                            <DocumentAddIcon className="h-4 w-4 mr-2" />
                            Rekam Penanganan Putusan
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Pratinjau Detail Record Dialog / Modal Overlay */}
      {viewingRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden relative border border-gray-100 flex flex-col">
                  <header className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0 z-10 flex-shrink-0">
                      <div>
                          <h4 className="text-lg font-bold text-gray-850">
                              Pratinjau Detail {viewingRecord.type === 'pendampingan' ? 'Pendampingan' : viewingRecord.type === 'perkara' ? 'Penanganan Perkara' : 'Penanganan Putusan'}
                          </h4>
                          <p className="text-xs text-gray-500">Nomor: {viewingRecord.record?.Nomor || viewingRecord.record?.id || 'N/A'}</p>
                      </div>
                      <button 
                          onClick={() => setViewingRecord(null)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 font-semibold rounded-lg text-sm border border-gray-300 shadow-sm transition"
                      >
                          Tutup Pratinjau
                      </button>
                  </header>
                  <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                      {viewingRecord.type === 'pendampingan' && (
                          <DetailPendampingan record={viewingRecord.record} onBack={() => setViewingRecord(null)} />
                      )}
                      {viewingRecord.type === 'perkara' && (
                          <DetailPerkara 
                              record={viewingRecord.record} 
                              onBack={() => setViewingRecord(null)} 
                              onNavigate={(view, r) => {
                                  setViewingRecord(null);
                                  onNavigate(view, r);
                              }} 
                          />
                      )}
                      {viewingRecord.type === 'putusan' && (
                          <DetailPutusan record={viewingRecord.record} onBack={() => setViewingRecord(null)} />
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProsesPermohonan;