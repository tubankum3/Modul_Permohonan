import React, { useState, useMemo } from 'react';
import { useAdvokasiStore } from '../useAdvokasiStore';
import { PendampinganRecord, PerkaraRecord, StatusPendampingan, StatusPerkara, StatusPutusan } from '../types';
import { SearchIcon, EyeIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon } from './icons';
import Breadcrumb from './Breadcrumb';

interface PengelolaanTimProps {
  onNavigate: (view: any, data?: any) => void;
}

interface MasterTeamRecord {
    id: string;
    tipe: 'Pendampingan' | 'Perkara' | 'Putusan';
    namaTim: string;
    tanggalTim: string;
    jenis: string;
    status: string;
    originalRecord: any;
}

const eadvo_PengelolaanTim: React.FC<PengelolaanTimProps> = ({ onNavigate }) => {
  const { pendampinganRecords, perkaraRecords, putusanRecords } = useAdvokasiStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPersonName, setFilterPersonName] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [activeTab, setActiveTab] = useState<'DaftarTim' | 'PersonelBebanKerja'>('DaftarTim');

  const masterRecords: MasterTeamRecord[] = useMemo(() => {
    const list: MasterTeamRecord[] = [];
    
    pendampinganRecords.filter(r => !r.deletedAt).forEach((r) => {
      list.push({
          id: r.id,
          tipe: 'Pendampingan',
          namaTim: r.perihal,
          tanggalTim: r.tanggal,
          jenis: r.jenis,
          status: r.statusPendampingan,
          originalRecord: r
      });
    });

    perkaraRecords.filter(r => !r.deletedAt).forEach((r) => {
      list.push({
          id: r.id,
          tipe: 'Perkara',
          namaTim: r.perihal,
          tanggalTim: r.tanggal,
          jenis: r.jenis,
          status: r.statusPerkara,
          originalRecord: r
      });
    });

    putusanRecords.filter(r => !r.deletedAt).forEach((r) => {
      list.push({
          id: r.id,
          tipe: 'Putusan',
          namaTim: r.perihal,
          tanggalTim: r.tanggal,
          jenis: 'Penanganan Putusan',
          status: r.statusPutusan || 'Aktif',
          originalRecord: r
      });
    });

    return list;
  }, [pendampinganRecords, perkaraRecords, putusanRecords]);

  const uniqueJenis = ['Semua Jenis', ...new Set(masterRecords.map(r => r.jenis))];
  const uniqueStatus = ['Semua Status', ...new Set(masterRecords.map(r => r.status))];

  const filteredRecords = masterRecords.filter(r => {
      const matchSearch = (r.namaTim || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchJenis = filterJenis === 'Semua Jenis' || r.jenis === filterJenis;
      const matchStatus = filterStatus === 'Semua Status' || r.status === filterStatus;
      
      let matchPerson = true;
      if (filterPersonName.trim() !== '') {
          const team = r.originalRecord.team || [];
          matchPerson = team.some((member: any) => 
              (member.name || '').toLowerCase().includes(filterPersonName.toLowerCase())
          );
      }
      
      return matchSearch && matchJenis && matchStatus && matchPerson;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEditTim = (record: MasterTeamRecord) => {
      if (record.tipe === 'Pendampingan') {
          onNavigate('eAdvokasiPendampinganTim', record.originalRecord);
      } else if (record.tipe === 'Perkara') {
          onNavigate('eAdvokasiPerkaraTim', record.originalRecord);
      } else if (record.tipe === 'Putusan') {
          onNavigate('eAdvokasiPutusanTim', record.originalRecord);
      }
  };

  const personnelWorkload = useMemo(() => {
    const personnelMap = new Map<string, {
      id: string;
      nama: string;
      pendampinganCount: number;
      perkaraCount: number;
      putusanCount: number;
      records: { tipe: string; id: string; namaTim: string }[];
    }>();

    const addWorkload = (member: any, recordId: string, recordName: string, type: 'pendampinganCount' | 'perkaraCount' | 'putusanCount', tipeLabel: string) => {
      if (!personnelMap.has(member.id)) {
        personnelMap.set(member.id, {
          id: member.id,
          nama: member.nama || member.name,
          pendampinganCount: 0,
          perkaraCount: 0,
          putusanCount: 0,
          records: []
        });
      }
      const p = personnelMap.get(member.id)!;
      p[type]++;
      p.records.push({ tipe: tipeLabel, id: recordId, namaTim: recordName });
    };

    pendampinganRecords.filter(r => !r.deletedAt && r.statusPendampingan === 'Aktif').forEach(r => {
      (r.team || []).forEach(m => addWorkload(m, r.id, r.perihal, 'pendampinganCount', 'Pendampingan'));
    });
    perkaraRecords.filter(r => !r.deletedAt && r.statusPerkara === 'Aktif').forEach(r => {
      (r.team || []).forEach(m => addWorkload(m, r.id, r.perihal, 'perkaraCount', 'Perkara'));
    });
    putusanRecords.filter(r => !r.deletedAt && (r.statusPutusan === 'Aktif' || r.statusPutusan === undefined)).forEach(r => {
      (r.team || []).forEach(m => addWorkload(m, r.id, r.perihal, 'putusanCount', 'Putusan'));
    });

    return Array.from(personnelMap.values());
  }, [pendampinganRecords, perkaraRecords, putusanRecords]);

  const [selectedPersonToMutasi, setSelectedPersonToMutasi] = useState<any>(null);
  const [mutasiTargetUser, setMutasiTargetUser] = useState<string>('');
  const [mutasiSelectedRecords, setMutasiSelectedRecords] = useState<{pendampingan: string[], perkara: string[], putusan: string[]}>({
    pendampingan: [], perkara: [], putusan: []
  });

  const { userAccounts, handleBulkReplaceTeamMember } = useAdvokasiStore();

  const filteredPersonnel = useMemo(() => {
    return personnelWorkload.filter(p => p.nama.toLowerCase().includes(filterPersonName.toLowerCase()));
  }, [personnelWorkload, filterPersonName]);

  const handleMutasi = (person: any) => {
    setSelectedPersonToMutasi(person);
    setMutasiSelectedRecords({
      pendampingan: person.records.filter((r: any) => r.tipe === 'Pendampingan').map((r: any) => r.id),
      perkara: person.records.filter((r: any) => r.tipe === 'Perkara').map((r: any) => r.id),
      putusan: person.records.filter((r: any) => r.tipe === 'Putusan').map((r: any) => r.id)
    });
    setMutasiTargetUser('');
  };

  const handleExecuteMutasi = () => {
    if (!mutasiTargetUser) {
      alert('Pilih PIC pengganti terlebih dahulu.');
      return;
    }
    const targetUser = userAccounts.find(u => u.id === mutasiTargetUser);
    if (!targetUser) return;
    
    handleBulkReplaceTeamMember(selectedPersonToMutasi.id, targetUser.id, targetUser.nama, mutasiSelectedRecords);
    setSelectedPersonToMutasi(null);
  };

  const toggleMutasiRecord = (tipe: 'pendampingan' | 'perkara' | 'putusan', id: string) => {
    setMutasiSelectedRecords(prev => {
      const isSelected = prev[tipe].includes(id);
      return {
        ...prev,
        [tipe]: isSelected ? prev[tipe].filter(r => r !== id) : [...prev[tipe], id]
      };
    });
  };

  if (selectedPersonToMutasi) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <button onClick={() => setSelectedPersonToMutasi(null)} className="hover:text-gray-900 transition flex items-center">
              <ChevronLeftIcon className="w-4 h-4 mr-1" /> Kembali ke Pengelolaan Tim
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mutasi / Ganti PIC</h2>
            <p className="text-gray-500 mb-8">Memindahkan penugasan dari satu PIC ke PIC lainnya secara sekaligus.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">PIC Asal</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                    {selectedPersonToMutasi.nama.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-lg">{selectedPersonToMutasi.nama}</div>
                    <div className="text-sm text-gray-500">{selectedPersonToMutasi.id}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 relative">
                <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-10 hidden md:block">
                  <div className="bg-white rounded-full p-2 shadow-md border border-gray-100">
                    <ChevronRightIcon className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-4">PIC Tujuan (Pengganti)</h3>
                <select 
                  value={mutasiTargetUser}
                  onChange={(e) => setMutasiTargetUser(e.target.value)}
                  className="w-full rounded-lg border border-blue-200 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Pilih PIC Pengganti --</option>
                  {userAccounts.filter(u => u.status === 'Aktif' && u.id !== selectedPersonToMutasi.id).map(u => (
                    <option key={u.id} value={u.id}>{u.nama} - {(u.roles || []).join(', ')}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Pilih Penugasan yang Akan Dipindahkan</h3>
                  <p className="text-sm text-gray-500">Centang perkara/pendampingan yang ingin dipindahkan ke PIC baru.</p>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Terpilih: {mutasiSelectedRecords.pendampingan.length + mutasiSelectedRecords.perkara.length + mutasiSelectedRecords.putusan.length}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm text-gray-700 bg-white">
                  <thead className="bg-[#F5F8FA] text-gray-600 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="py-3 px-4 font-semibold w-12 text-center">Pilih</th>
                      <th scope="col" className="py-3 px-4 font-semibold">Tipe</th>
                      <th scope="col" className="py-3 px-4 font-semibold">Nama / Perihal Tim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedPersonToMutasi.records.map((r: any, idx: number) => {
                      const tipeKey = r.tipe.toLowerCase() as 'pendampingan' | 'perkara' | 'putusan';
                      const isChecked = mutasiSelectedRecords[tipeKey].includes(r.id);
                      return (
                        <tr key={`${r.tipe}-${r.id}-${idx}`} className="hover:bg-gray-50 transition">
                          <td className="py-3 px-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => toggleMutasiRecord(tipeKey, r.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              r.tipe === 'Pendampingan' ? 'bg-blue-100 text-blue-800' : 
                              r.tipe === 'Perkara' ? 'bg-amber-100 text-amber-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {r.tipe}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800">{r.namaTim}</td>
                        </tr>
                      );
                    })}
                    {selectedPersonToMutasi.records.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          Tidak ada beban kerja aktif.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200 space-x-3">
              <button 
                onClick={() => setSelectedPersonToMutasi(null)}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleExecuteMutasi}
                disabled={!mutasiTargetUser || (mutasiSelectedRecords.pendampingan.length === 0 && mutasiSelectedRecords.perkara.length === 0 && mutasiSelectedRecords.putusan.length === 0)}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proses & Simpan
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <main className="flex-1 overflow-y-auto p-8">
        <Breadcrumb currentView="eAdvokasiTim" onNavigate={onNavigate} />
        <div className="block">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-row items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">Pengelolaan Tim</div>
            </div>

            <div className="mt-4 mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('DaftarTim')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'DaftarTim'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Daftar Tim
                </button>
                <button
                  onClick={() => setActiveTab('PersonelBebanKerja')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'PersonelBebanKerja'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  PIC & Beban Kerja
                </button>
              </nav>
            </div>

            {activeTab === 'DaftarTim' && (
              <>
                <div className="mt-5 flex gap-4">
                  <div style={{ position: 'relative' }}>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex flex-row">
                      <input 
                        placeholder="Search" 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="block w-40 rounded-full border border-gray-300 p-2.5 pl-10 text-sm text-gray-900 focus:border-[#005FAC] focus:outline-none focus:ring-[#005FAC] md:w-80" 
                      />
                    </div>
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex flex-row">
                      <input 
                        placeholder="Cari Personel..." 
                        value={filterPersonName}
                        onChange={(e) => {
                            setFilterPersonName(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="block w-40 rounded-full border border-gray-300 p-2.5 pl-10 text-sm text-gray-900 focus:border-[#005FAC] focus:outline-none focus:ring-[#005FAC] md:w-60" 
                      />
                    </div>
                  </div>
                  
                  <select 
                    value={filterJenis}
                    onChange={(e) => {
                        setFilterJenis(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="block w-40 rounded-full border border-gray-300 p-2.5 px-4 text-sm text-gray-900 focus:border-[#005FAC] focus:outline-none focus:ring-[#005FAC]"
                  >
                    {uniqueJenis.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>

                  <select 
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="block w-40 rounded-full border border-gray-300 p-2.5 px-4 text-sm text-gray-900 focus:border-[#005FAC] focus:outline-none focus:ring-[#005FAC]"
                  >
                    {uniqueStatus.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <table className="mt-5 w-full text-left text-sm text-gray-700 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <thead className="bg-[#F5F8FA] text-gray-600 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="py-3 px-6 font-semibold">Nama Tim</th>
                      <th scope="col" className="py-3 px-6 font-semibold">Tanggal Tim</th>
                      <th scope="col" className="py-3 px-6 font-semibold">Jenis Tim</th>
                      <th scope="col" className="py-3 px-6 font-semibold">Status</th>
                      <th scope="col" className="py-3 px-6 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.length > 0 ? (
                      paginatedRecords.map(record => (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-6 font-medium text-gray-800">{record.namaTim}</td>
                          <td className="py-3 px-6">{record.tanggalTim}</td>
                          <td className="py-3 px-6">{record.jenis}</td>
                          <td className="py-3 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              (record.status || '').toLowerCase() === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="py-3 px-6">
                            <button 
                                onClick={() => handleEditTim(record)}
                                className="text-[#005FAC] hover:text-blue-800 flex items-center font-medium"
                            >
                                <EyeIcon className="w-4 h-4 mr-1" /> Edit Tim
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Data tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-row justify-end mt-4 items-center space-x-4 text-sm text-gray-600">
                        <div>
                            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
              </>
            )}

            {activeTab === 'PersonelBebanKerja' && (
              <>
                <div className="mt-5 flex gap-4">
                  <div style={{ position: 'relative' }}>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex flex-row">
                      <input 
                        placeholder="Cari Personel..." 
                        value={filterPersonName}
                        onChange={(e) => setFilterPersonName(e.target.value)}
                        className="block w-40 rounded-full border border-gray-300 p-2.5 pl-10 text-sm text-gray-900 focus:border-[#005FAC] focus:outline-none focus:ring-[#005FAC] md:w-80" 
                      />
                    </div>
                  </div>
                </div>

                <table className="mt-5 w-full text-left text-sm text-gray-700 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <thead className="bg-[#F5F8FA] text-gray-600 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="py-3 px-6 font-semibold">Nama Pegawai</th>
                      <th scope="col" className="py-3 px-6 font-semibold">ID / NIP</th>
                      <th scope="col" className="py-3 px-6 font-semibold text-center">Penugasan (Aktif)</th>
                      <th scope="col" className="py-3 px-6 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPersonnel.length > 0 ? (
                      filteredPersonnel.map(person => (
                        <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-6 font-medium text-gray-800">{person.nama}</td>
                          <td className="py-3 px-6 text-gray-500">{person.id}</td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex justify-center gap-2">
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-blue-700 text-lg">{person.pendampinganCount}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Pendampingan</span>
                              </div>
                              <div className="w-px bg-gray-200 h-10 mx-2"></div>
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-amber-600 text-lg">{person.perkaraCount}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Perkara</span>
                              </div>
                              <div className="w-px bg-gray-200 h-10 mx-2"></div>
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-green-700 text-lg">{person.putusanCount}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Putusan</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-6">
                            <button 
                                onClick={() => handleMutasi(person)}
                                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-xs transition-colors shadow-sm"
                            >
                              Mutasi/Ganti PIC
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          Data pegawai tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default eadvo_PengelolaanTim;
