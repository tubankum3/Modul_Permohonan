import React, { useState, useMemo } from 'react';
import { useAdvokasiStore } from '../useAdvokasiStore';
import { PendampinganRecord, PerkaraRecord, StatusPendampingan, StatusPerkara, StatusPutusan, TelaahanRecord } from '../types';
import { 
  SearchIcon, EyeIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon, 
  ScaleIcon, DocumentTextIcon, ShieldCheckIcon, UserGroupIcon, XIcon, FilterIcon, RefreshIcon, CheckCircleIcon 
} from './icons';
import Breadcrumb from './Breadcrumb';

interface PengelolaanTimProps {
  onNavigate: (view: any, data?: any) => void;
}

interface MasterTeamRecord {
    id: string;
    tipe: 'Pendampingan' | 'Perkara' | 'Putusan' | 'Telaahan';
    namaTim: string;
    tanggalTim: string;
    jenis: string;
    status: string;
    originalRecord: any;
}

const eadvo_PengelolaanTim: React.FC<PengelolaanTimProps> = ({ onNavigate }) => {
  const { pendampinganRecords, perkaraRecords, putusanRecords, telaahanRecords } = useAdvokasiStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPersonName, setFilterPersonName] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [activeTab, setActiveTab] = useState<'DaftarTim' | 'PersonelBebanKerja'>('DaftarTim');

  const masterRecords: MasterTeamRecord[] = useMemo(() => {
    const list: MasterTeamRecord[] = [];
    
    (pendampinganRecords || []).filter(r => !r.deletedAt).forEach((r) => {
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

    (perkaraRecords || []).filter(r => !r.deletedAt).forEach((r) => {
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

    (putusanRecords || []).filter(r => !r.deletedAt).forEach((r) => {
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

    (telaahanRecords || []).filter(r => !r.deletedAt).forEach((r) => {
      list.push({
          id: r.id,
          tipe: 'Telaahan',
          namaTim: r.perihal,
          tanggalTim: r.tanggal,
          jenis: 'Telaahan Kasus Hukum',
          status: r.statusTelaahan || 'Aktif',
          originalRecord: r
      });
    });

    return list;
  }, [pendampinganRecords, perkaraRecords, putusanRecords, telaahanRecords]);

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
              ((member.nama || member.name) || '').toLowerCase().includes(filterPersonName.toLowerCase())
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
      } else if (record.tipe === 'Telaahan') {
          onNavigate('eAdvokasiTelaahanKasusHukum', record.originalRecord);
      }
  };

  interface WorkloadItemRecord {
    tipe: 'Pendampingan' | 'Perkara' | 'Putusan' | 'Telaahan';
    id: string;
    nomor: string;
    namaTim: string;
    pemohon: string;
    tanggal: string;
    status: string;
    role: string;
    isPic: boolean;
    originalRecord: any;
  }

  const personnelWorkload = useMemo(() => {
    const personnelMap = new Map<string, {
      id: string;
      nama: string;
      pendampinganCount: number;
      perkaraCount: number;
      putusanCount: number;
      telaahanCount: number;
      totalActiveCount: number;
      records: WorkloadItemRecord[];
    }>();

    const addWorkload = (
      member: any, 
      recordId: string, 
      nomor: string,
      recordName: string, 
      pemohon: string,
      tanggal: string,
      status: string,
      type: 'pendampinganCount' | 'perkaraCount' | 'putusanCount' | 'telaahanCount', 
      tipeLabel: 'Pendampingan' | 'Perkara' | 'Putusan' | 'Telaahan',
      role: string,
      originalRecord: any
    ) => {
      const memberId = member.id || member.nip;
      const memberNama = member.nama || member.name;
      if (!personnelMap.has(memberId)) {
        personnelMap.set(memberId, {
          id: memberId,
          nama: memberNama,
          pendampinganCount: 0,
          perkaraCount: 0,
          putusanCount: 0,
          telaahanCount: 0,
          totalActiveCount: 0,
          records: []
        });
      }
      const p = personnelMap.get(memberId)!;
      p[type]++;
      p.totalActiveCount++;
      const isPic = role === 'PIC' || member.teamRole === 'PIC' || (originalRecord && originalRecord.picId === memberId);
      p.records.push({ 
        tipe: tipeLabel, 
        id: recordId, 
        nomor: nomor || recordId,
        namaTim: recordName,
        pemohon: pemohon || '-',
        tanggal: tanggal || '-',
        status: status || 'Aktif',
        role: role || (isPic ? 'PIC' : 'Anggota Tim'),
        isPic: isPic,
        originalRecord: originalRecord 
      });
    };

    // Helper to determine if a member is the PIC of a record
    const isMemberPic = (member: any, r: any, explicitRole?: string) => {
      const memberId = member.id || member.nip;
      const memberName = member.nama || member.name;
      const picId = r.picId;
      const picName = (r as any).pic;
      const roleStr = explicitRole || member.teamRole || member.role || '';
      return (
        roleStr === 'PIC' ||
        (picId && picId === memberId) ||
        (picName && memberName && picName.toLowerCase().includes(memberName.toLowerCase()))
      );
    };

    (pendampinganRecords || []).filter(r => !r.deletedAt && (r.statusPendampingan === 'Aktif' || (r.statusPendampingan as any) === undefined || (r.status as any) === 'Aktif')).forEach(r => {
      const nomor = (r as any).nomorTiket || (r as any).nomorNotaDinas || r.Nomor || `TIKET-${r.id}`;
      const teamList = r.team && r.team.length > 0 ? r.team : [];
      teamList.forEach(m => {
        const isPic = isMemberPic(m, r, m.teamRole);
        addWorkload(
          m, 
          r.id, 
          nomor, 
          r.perihal, 
          (r as any).pemohon || r.unit || 'Unit Pemohon', 
          r.tanggal, 
          r.statusPendampingan || 'Aktif', 
          'pendampinganCount', 
          'Pendampingan', 
          isPic ? 'PIC' : (m.teamRole || 'Anggota Tim'),
          r
        );
      });
    });

    (perkaraRecords || []).filter(r => !r.deletedAt && (r.statusPerkara === 'Aktif' || (r.statusPerkara as any) === undefined || (r.status as any) === 'Aktif')).forEach(r => {
      const nomor = (r as any).abstraksiPerkara?.noPerkara || (r as any).nomorPerkara || (r as any).nomorRegistrasi || r.Nomor || `PERKARA-${r.id}`;
      const teamList = r.team && r.team.length > 0 ? r.team : [];
      teamList.forEach(m => {
        const isPic = isMemberPic(m, r, m.teamRole);
        addWorkload(
          m, 
          r.id, 
          nomor, 
          r.perihal, 
          (r as any).pemohon || r.unit || 'Unit Berperkara', 
          r.tanggal, 
          r.statusPerkara || 'Aktif', 
          'perkaraCount', 
          'Perkara', 
          isPic ? 'PIC' : (m.teamRole || 'Kuasa Hukum'),
          r
        );
      });
    });

    (putusanRecords || []).filter(r => !r.deletedAt && (r.statusPutusan === 'Aktif' || (r.statusPutusan as any) === undefined || (r.status as any) === 'Aktif')).forEach(r => {
      const nomor = (r as any).abstraksiPerkara?.noPerkara || (r as any).nomorPutusan || (r as any).nomorPerkara || r.Nomor || `PUTUSAN-${r.id}`;
      const teamList = r.team && r.team.length > 0 ? r.team : [];
      teamList.forEach(m => {
        const isPic = isMemberPic(m, r, m.teamRole);
        addWorkload(
          m, 
          r.id, 
          nomor, 
          r.perihal, 
          (r as any).pemohon || r.unit || 'Unit Terkait', 
          r.tanggal, 
          r.statusPutusan || 'Aktif', 
          'putusanCount', 
          'Putusan', 
          isPic ? 'PIC' : (m.teamRole || 'Tim Putusan'),
          r
        );
      });
    });

    (telaahanRecords || []).filter(r => !r.deletedAt && (r.statusTelaahan === 'Aktif' || (r.statusTelaahan as any) === undefined || (r.status as any) === 'Aktif')).forEach(r => {
      const nomor = (r as any).nomorTelaahan || (r as any).nomorNotaDinas || r.Nomor || `TLH-${r.id}`;
      const teamList = r.team && r.team.length > 0 ? r.team : [];
      teamList.forEach(m => {
        const isPic = isMemberPic(m, r, m.teamRole);
        addWorkload(
          m, 
          r.id, 
          nomor, 
          r.perihal, 
          (r as any).pemohon || r.unit || 'Biro Advokasi, Setjen', 
          r.tanggal, 
          r.statusTelaahan || 'Aktif', 
          'telaahanCount', 
          'Telaahan', 
          isPic ? 'PIC' : (m.teamRole || 'Penelaah'),
          r
        );
      });
    });

    return Array.from(personnelMap.values());
  }, [pendampinganRecords, perkaraRecords, putusanRecords, telaahanRecords]);

  const [selectedPersonToMutasi, setSelectedPersonToMutasi] = useState<any>(null);
  const [mutasiTargetUser, setMutasiTargetUser] = useState<string>('');
  const [mutasiSelectedRecords, setMutasiSelectedRecords] = useState<{pendampingan: string[], perkara: string[], putusan: string[], telaahan: string[]}>({
    pendampingan: [], perkara: [], putusan: [], telaahan: []
  });

  const [selectedWorkloadDetail, setSelectedWorkloadDetail] = useState<{
    personId: string;
    personNama: string;
    activeTipe: 'Semua' | 'Pendampingan' | 'Perkara' | 'Putusan' | 'Telaahan';
  } | null>(null);
  const [detailModalSearch, setDetailModalSearch] = useState('');
  const [detailModalRoleFilter, setDetailModalRoleFilter] = useState<'Semua' | 'PIC' | 'Anggota Tim'>('Semua');

  const handleOpenDetail = (person: any, tipe: 'Semua' | 'Pendampingan' | 'Perkara' | 'Putusan' | 'Telaahan') => {
    setSelectedWorkloadDetail({
      personId: person.id,
      personNama: person.nama,
      activeTipe: tipe
    });
    setDetailModalSearch('');
    setDetailModalRoleFilter('Semua');
  };

  const { userAccounts, handleBulkReplaceTeamMember } = useAdvokasiStore();

  const filteredPersonnel = useMemo(() => {
    return personnelWorkload.filter(p => p.nama.toLowerCase().includes(filterPersonName.toLowerCase()));
  }, [personnelWorkload, filterPersonName]);

  const handleMutasi = (person: any) => {
    setSelectedPersonToMutasi(person);
    setMutasiSelectedRecords({
      pendampingan: person.records.filter((r: any) => r.tipe === 'Pendampingan').map((r: any) => r.id),
      perkara: person.records.filter((r: any) => r.tipe === 'Perkara').map((r: any) => r.id),
      putusan: person.records.filter((r: any) => r.tipe === 'Putusan').map((r: any) => r.id),
      telaahan: person.records.filter((r: any) => r.tipe === 'Telaahan').map((r: any) => r.id)
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

  const toggleMutasiRecord = (tipe: 'pendampingan' | 'perkara' | 'putusan' | 'telaahan', id: string) => {
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
                  <p className="text-sm text-gray-500">Centang perkara, pendampingan, putusan, atau telaahan yang ingin dipindahkan ke PIC baru.</p>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Terpilih: {mutasiSelectedRecords.pendampingan.length + mutasiSelectedRecords.perkara.length + mutasiSelectedRecords.putusan.length + mutasiSelectedRecords.telaahan.length}
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
                      const tipeKey = r.tipe.toLowerCase() as 'pendampingan' | 'perkara' | 'putusan' | 'telaahan';
                      const isChecked = (mutasiSelectedRecords[tipeKey] || []).includes(r.id);
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
                              r.tipe === 'Putusan' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
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
                disabled={!mutasiTargetUser || (mutasiSelectedRecords.pendampingan.length === 0 && mutasiSelectedRecords.perkara.length === 0 && mutasiSelectedRecords.putusan.length === 0 && mutasiSelectedRecords.telaahan.length === 0)}
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
                      <th scope="col" className="py-3.5 px-6 font-semibold">Nama Pegawai</th>
                      <th scope="col" className="py-3.5 px-6 font-semibold">ID / NIP</th>
                      <th scope="col" className="py-3.5 px-6 font-semibold text-center">
                        <div className="flex flex-col items-center">
                          <span>Penugasan (Aktif)</span>
                          <span className="text-[10px] text-gray-400 font-normal mt-0.5">
                            Pendampingan • Perkara • Putusan • Telaahan
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="py-3.5 px-6 font-semibold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPersonnel.length > 0 ? (
                      filteredPersonnel.map(person => (
                        <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50/70 transition">
                          <td className="py-3.5 px-6 font-medium text-gray-800">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {person.nama.charAt(0)}
                              </div>
                              <span className="font-semibold text-gray-900">{person.nama}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-gray-500 font-mono text-xs">{person.id}</td>
                          <td className="py-3.5 px-6 text-center">
                            <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
                              {/* Pendampingan Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(person, 'Pendampingan')}
                                className="group flex flex-col items-center px-2.5 py-1 rounded-xl bg-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 transition-all duration-150 shadow-2xs hover:shadow-md cursor-pointer min-w-[58px]"
                                title={`Klik untuk melihat rincian ${person.pendampinganCount} penugasan Pendampingan aktif ${person.nama}`}
                              >
                                <span className="font-bold text-blue-700 group-hover:text-white text-base leading-tight transition-colors">
                                  {person.pendampinganCount}
                                </span>
                                <span className="text-[9px] font-semibold text-blue-600 group-hover:text-blue-100 uppercase tracking-wider transition-colors">
                                  Pendampingan
                                </span>
                              </button>

                              <div className="w-px bg-gray-200 h-7"></div>

                              {/* Perkara Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(person, 'Perkara')}
                                className="group flex flex-col items-center px-2.5 py-1 rounded-xl bg-white hover:bg-amber-600 border border-amber-200 hover:border-amber-600 transition-all duration-150 shadow-2xs hover:shadow-md cursor-pointer min-w-[58px]"
                                title={`Klik untuk melihat rincian ${person.perkaraCount} penugasan Perkara aktif ${person.nama}`}
                              >
                                <span className="font-bold text-amber-700 group-hover:text-white text-base leading-tight transition-colors">
                                  {person.perkaraCount}
                                </span>
                                <span className="text-[9px] font-semibold text-amber-600 group-hover:text-amber-100 uppercase tracking-wider transition-colors">
                                  Perkara
                                </span>
                              </button>

                              <div className="w-px bg-gray-200 h-7"></div>

                              {/* Putusan Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(person, 'Putusan')}
                                className="group flex flex-col items-center px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 transition-all duration-150 shadow-2xs hover:shadow-md cursor-pointer min-w-[58px]"
                                title={`Klik untuk melihat rincian ${person.putusanCount} penugasan Putusan aktif ${person.nama}`}
                              >
                                <span className="font-bold text-emerald-700 group-hover:text-white text-base leading-tight transition-colors">
                                  {person.putusanCount}
                                </span>
                                <span className="text-[9px] font-semibold text-emerald-600 group-hover:text-emerald-100 uppercase tracking-wider transition-colors">
                                  Putusan
                                </span>
                              </button>

                              <div className="w-px bg-gray-200 h-7"></div>

                              {/* Telaahan Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(person, 'Telaahan')}
                                className="group flex flex-col items-center px-2.5 py-1 rounded-xl bg-white hover:bg-purple-600 border border-purple-200 hover:border-purple-600 transition-all duration-150 shadow-2xs hover:shadow-md cursor-pointer min-w-[58px]"
                                title={`Klik untuk melihat rincian ${person.telaahanCount} penugasan Telaahan aktif ${person.nama}`}
                              >
                                <span className="font-bold text-purple-700 group-hover:text-white text-base leading-tight transition-colors">
                                  {person.telaahanCount}
                                </span>
                                <span className="text-[9px] font-semibold text-purple-600 group-hover:text-purple-100 uppercase tracking-wider transition-colors">
                                  Telaahan
                                </span>
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-center">
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

            {/* Modal Hasil Pencarian & Rincian Penugasan Aktif PIC */}
            {selectedWorkloadDetail && (() => {
              const currentPerson = personnelWorkload.find(p => p.id === selectedWorkloadDetail.personId) || {
                id: selectedWorkloadDetail.personId,
                nama: selectedWorkloadDetail.personNama,
                pendampinganCount: 0,
                perkaraCount: 0,
                putusanCount: 0,
                telaahanCount: 0,
                totalActiveCount: 0,
                records: []
              };

              const totalActive = currentPerson.records.length;

              // Filter by active type
              const typeRecords = selectedWorkloadDetail.activeTipe === 'Semua' 
                ? currentPerson.records 
                : currentPerson.records.filter(r => r.tipe === selectedWorkloadDetail.activeTipe);

              // Filter by search and role
              const displayedRecords = typeRecords.filter(r => {
                const matchQuery = detailModalSearch.trim() === '' || 
                  (r.nomor || '').toLowerCase().includes(detailModalSearch.toLowerCase()) ||
                  (r.namaTim || '').toLowerCase().includes(detailModalSearch.toLowerCase()) ||
                  (r.pemohon || '').toLowerCase().includes(detailModalSearch.toLowerCase()) ||
                  (r.status || '').toLowerCase().includes(detailModalSearch.toLowerCase());
                
                let matchRole = true;
                if (detailModalRoleFilter === 'PIC') {
                  matchRole = r.isPic || r.role === 'PIC';
                } else if (detailModalRoleFilter === 'Anggota Tim') {
                  matchRole = !r.isPic && r.role !== 'PIC';
                }

                return matchQuery && matchRole;
              });

              const getBadgeStyle = (tipe: string) => {
                switch (tipe) {
                  case 'Pendampingan': return 'bg-blue-100 text-blue-800 border-blue-200';
                  case 'Perkara': return 'bg-amber-100 text-amber-800 border-amber-200';
                  case 'Putusan': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  case 'Telaahan': return 'bg-purple-100 text-purple-800 border-purple-200';
                  default: return 'bg-gray-100 text-gray-800 border-gray-200';
                }
              };

              const handleNavigateToCase = (record: any) => {
                setSelectedWorkloadDetail(null);
                if (record.tipe === 'Pendampingan') {
                  onNavigate('eAdvokasiPendampinganDetail', record.originalRecord);
                } else if (record.tipe === 'Perkara') {
                  onNavigate('eAdvokasiPerkaraDetail', record.originalRecord);
                } else if (record.tipe === 'Putusan') {
                  onNavigate('eAdvokasiPutusanDetail', record.originalRecord);
                } else if (record.tipe === 'Telaahan') {
                  onNavigate('eAdvokasiTelaahanKasusHukum', record.originalRecord);
                }
              };

              const handleNavigateToSearchModule = () => {
                setSelectedWorkloadDetail(null);
                if (selectedWorkloadDetail.activeTipe === 'Perkara') {
                  onNavigate('eAdvokasiPencarianPerkara');
                } else if (selectedWorkloadDetail.activeTipe === 'Pendampingan') {
                  onNavigate('eAdvokasiPencarianPendampingan');
                } else if (selectedWorkloadDetail.activeTipe === 'Putusan') {
                  onNavigate('eAdvokasiPencarianPutusan');
                } else if (selectedWorkloadDetail.activeTipe === 'Telaahan') {
                  onNavigate('eAdvokasiTelaahanKasusHukum');
                } else {
                  onNavigate('eAdvokasiPencarianPerkara');
                }
              };

              const handleViewInDaftarTim = () => {
                setSelectedWorkloadDetail(null);
                setActiveTab('DaftarTim');
                setFilterPersonName(currentPerson.nama);
                setFilterStatus('Aktif');
              };

              return (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                    {/* Header Modal */}
                    <div className="px-6 py-4 bg-gradient-to-r from-[#0055A5] via-[#0066B8] to-blue-800 text-white flex items-center justify-between shrink-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-lg border border-white/20">
                          {currentPerson.nama.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-base">Rincian &amp; Hasil Pencarian Penugasan Aktif</h3>
                            <span className="text-[11px] bg-white/20 text-blue-100 px-2 py-0.5 rounded-full font-semibold">
                              {displayedRecords.length} Data
                            </span>
                          </div>
                          <p className="text-xs text-blue-100 mt-0.5">
                            PIC: <strong className="text-white">{currentPerson.nama}</strong> • NIP/ID: <span className="font-mono text-blue-200">{currentPerson.id}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedWorkloadDetail(null)}
                        className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition"
                        title="Tutup dialog"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Sub-Header: Type Selection Tabs */}
                    <div className="bg-slate-50 border-b border-gray-200 px-6 pt-3 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
                      <div className="flex space-x-2">
                        {(['Semua', 'Pendampingan', 'Perkara', 'Putusan', 'Telaahan'] as const).map(tab => {
                          const count = tab === 'Semua' ? totalActive :
                            tab === 'Pendampingan' ? currentPerson.pendampinganCount :
                            tab === 'Perkara' ? currentPerson.perkaraCount :
                            tab === 'Putusan' ? currentPerson.putusanCount :
                            currentPerson.telaahanCount;
                          const isActive = selectedWorkloadDetail.activeTipe === tab;
                          return (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setSelectedWorkloadDetail(prev => prev ? { ...prev, activeTipe: tab } : null)}
                              className={`pb-2.5 px-3 text-xs font-bold transition-all relative whitespace-nowrap flex items-center space-x-1.5 ${
                                isActive 
                                  ? 'text-blue-700' 
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              <span>{tab}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                isActive 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-200 text-gray-700'
                              }`}>
                                {count}
                              </span>
                              {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-md" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="p-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
                      <div className="relative w-full sm:w-80">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={detailModalSearch}
                          onChange={(e) => setDetailModalSearch(e.target.value)}
                          placeholder="Cari nomor perkara, tiket, perihal, satker..."
                          className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50"
                        />
                        {detailModalSearch && (
                          <button
                            type="button"
                            onClick={() => setDetailModalSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <XIcon className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">Filter Peran:</span>
                        <select
                          value={detailModalRoleFilter}
                          onChange={(e: any) => setDetailModalRoleFilter(e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50/50 font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Semua">Semua Peran</option>
                          <option value="PIC">Khusus PIC</option>
                          <option value="Anggota Tim">Anggota Tim / Editor</option>
                        </select>
                      </div>
                    </div>

                    {/* Content Table */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                      {displayedRecords.length > 0 ? (
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs text-gray-700">
                            <thead className="bg-[#F8FAFC] text-gray-600 border-b border-gray-200 font-bold uppercase tracking-wider text-[11px]">
                              <tr>
                                <th scope="col" className="py-3 px-3 text-center w-10">No</th>
                                <th scope="col" className="py-3 px-3 w-32">Modul</th>
                                <th scope="col" className="py-3 px-4 w-44">No. Perkara / Tiket / ND</th>
                                <th scope="col" className="py-3 px-4">Perihal / Pokok Perkara</th>
                                <th scope="col" className="py-3 px-4 w-44">Unit Pemohon</th>
                                <th scope="col" className="py-3 px-3 text-center w-28">Peran</th>
                                <th scope="col" className="py-3 px-3 text-center w-28">Status</th>
                                <th scope="col" className="py-3 px-3 text-center w-28">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {displayedRecords.map((rec, idx) => (
                                <tr key={`${rec.tipe}-${rec.id}-${idx}`} className="hover:bg-blue-50/30 transition-colors">
                                  <td className="py-3 px-3 text-center text-gray-400 font-medium">
                                    {idx + 1}
                                  </td>
                                  <td className="py-3 px-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeStyle(rec.tipe)}`}>
                                      {rec.tipe}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 font-mono font-bold text-gray-900 select-all">
                                    {rec.nomor}
                                  </td>
                                  <td className="py-3 px-4 font-medium text-gray-800 leading-snug">
                                    {rec.namaTim}
                                  </td>
                                  <td className="py-3 px-4 text-gray-600 text-[11px]">
                                    {rec.pemohon}
                                  </td>
                                  <td className="py-3 px-3 text-center whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      rec.isPic || rec.role === 'PIC'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {rec.role || 'PIC'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-center whitespace-nowrap">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      {rec.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-center whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => handleNavigateToCase(rec)}
                                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                                    >
                                      <EyeIcon className="h-3.5 w-3.5 mr-0.5" />
                                      <span>Buka Berkas</span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-12 text-center text-gray-400">
                          <UserGroupIcon className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                          <p className="font-semibold text-sm text-gray-600">Tidak ada penugasan aktif yang sesuai</p>
                          <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian atau pilih tab kategori penanganan lain.</p>
                        </div>
                      )}
                    </div>

                    {/* Footer Modal */}
                    <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Total ditemukan: <strong className="text-gray-800">{displayedRecords.length}</strong> penugasan aktif</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleViewInDaftarTim}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-white hover:border-gray-300 transition"
                        >
                          Lihat di Tab Daftar Tim
                        </button>
                        <button
                          type="button"
                          onClick={handleNavigateToSearchModule}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                        >
                          Buka di Modul Pencarian
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedWorkloadDetail(null)}
                          className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </main>
    </div>
  );
};

export default eadvo_PengelolaanTim;
