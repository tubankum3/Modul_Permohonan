import React, { useState } from 'react';
import { Permohonan, Riwayat, PendampinganRecord, PerkaraRecord, PosisiSidangEntry } from '../types';
import DetailPermohonan from './satkem_DetailPermohonan';
import AssignTeam from './AssignTeam';
import { ArrowLeftIcon, SearchIcon } from './icons';
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
  const [activeTab, setActiveTab] = useState<'rincian' | 'assign' | 'assignExisting'>('rincian');
  const [selectedTargetType, setSelectedTargetType] = useState<'pendampingan' | 'perkara' | 'putusan'>('pendampingan');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingRecord, setViewingRecord] = useState<{ record: any; type: 'pendampingan' | 'perkara' | 'putusan' } | null>(null);

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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Permohonan ke Data Existing</h3>
                <p className="text-sm text-gray-500 mb-6">Pilih jenis data dan cari data yang sesuai untuk menghubungkan permohonan ini.</p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Data</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="radio" className="form-radio text-blue-600" name="targetType" value="pendampingan" checked={selectedTargetType === 'pendampingan'} onChange={() => { setSelectedTargetType('pendampingan'); setSelectedTargetId(''); setSearchTerm(''); }} />
                            <span className="ml-2">Pendampingan</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="radio" className="form-radio text-blue-600" name="targetType" value="perkara" checked={selectedTargetType === 'perkara'} onChange={() => { setSelectedTargetType('perkara'); setSelectedTargetId(''); setSearchTerm(''); }} />
                            <span className="ml-2">Penanganan Perkara</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="radio" className="form-radio text-blue-600" name="targetType" value="putusan" checked={selectedTargetType === 'putusan'} onChange={() => { setSelectedTargetType('putusan'); setSelectedTargetId(''); setSearchTerm(''); }} />
                            <span className="ml-2">Penanganan Putusan</span>
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cari Data</label>
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

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-750">
                        {selectedTargetId ? (
                            <div className="flex items-center space-x-2">
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
                            <span className="text-gray-500">Belum ada data yang dipilih. Hubungkan permohonan dengan memilih salah satu data di atas lalu tekan tombol "Terima & Proses Permohonan" di pojok kanan atas.</span>
                        )}
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