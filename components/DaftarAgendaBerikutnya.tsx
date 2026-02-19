import React, { useState, useMemo } from 'react';
import { PerkaraRecord, PosisiSidangEntry } from '../types';
import { ArrowLeftIcon, CalendarIcon } from './icons';

interface DaftarAgendaBerikutnyaProps {
  daftarPerkara: PerkaraRecord[];
  onBack: () => void;
}

const getPicName = (record: PerkaraRecord): string => {
    if (!record.picId || !record.team || record.team.length === 0) {
        return 'N/A';
    }
    const pic = record.team.find(member => member.id === record.picId);
    return pic ? pic.nama : 'N/A';
};

const formatEventDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

const DaftarAgendaBerikutnya: React.FC<DaftarAgendaBerikutnyaProps> = ({ daftarPerkara, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextEvents: { date: Date; title: string; type: string; perkara: PerkaraRecord }[] = [];

    daftarPerkara.forEach(perkara => {
      if (perkara.posisiSidang) {
        const sidangEntries: PosisiSidangEntry[] = [
          ...(perkara.posisiSidang.tkPertama || []),
          ...(perkara.posisiSidang.tkBanding || []),
          ...(perkara.posisiSidang.tkKasasi || []),
          ...(perkara.posisiSidang.tkPK || []),
        ];

        sidangEntries.forEach(sidang => {
            if (sidang.agendaBerikutnya && sidang.tanggalSidangBerikutnya) {
                 try {
                    const [day, month, year] = sidang.tanggalSidangBerikutnya.split('/');
                    const date = new Date(`${year}-${month}-${day}`);
                    if (!isNaN(date.getTime()) && date.getTime() >= today.getTime()) {
                        nextEvents.push({ date, title: sidang.agendaBerikutnya, type: 'Sidang Berikutnya', perkara });
                    }
                } catch (e) {
                    console.error("Invalid date format:", sidang.tanggalSidangBerikutnya);
                }
            }
        });
      }
    });

    return nextEvents
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [daftarPerkara]);

  const totalPages = itemsPerPage > 0 ? Math.ceil(upcomingEvents.length / itemsPerPage) : 1;
  const currentEvents = useMemo(() => {
      if (itemsPerPage === 0) return upcomingEvents; // Show all
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return upcomingEvents.slice(startIndex, endIndex);
  }, [upcomingEvents, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = parseInt(e.target.value, 10);
      setItemsPerPage(value);
      setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-4">
          <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Semua Agenda Berikutnya</h1>
          <p className="text-gray-600 mt-1">Daftar lengkap semua agenda sidang yang akan datang.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
        <div className="flex justify-end items-center mb-4">
            <label htmlFor="items-per-page" className="text-sm font-medium text-gray-700 mr-2">Tampilkan:</label>
            <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={0}>Semua</option>
            </select>
        </div>
        <div className="flex-1 overflow-y-auto">
            {currentEvents.length > 0 ? (
                <ul className="space-y-4">
                    {currentEvents.map((event, index) => (
                    <li key={index} className="flex items-start space-x-3 p-4 border-b border-gray-100">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                        <p className="font-semibold text-gray-800">{event.title}</p>
                        <p className="text-sm text-gray-500">{formatEventDate(event.date)}</p>
                        <p className="text-sm text-gray-500">Nomor Perkara: {event.perkara.abstraksiPerkara?.noPerkara || event.perkara.Nomor || event.perkara.id} di {event.perkara.abstraksiPerkara?.pengadilan?.join(', ')}</p>
                        <div className="mt-1 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            PIC: {getPicName(event.perkara)}
                        </div>
                        </div>
                    </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-10">Tidak ada agenda berikutnya.</p>
            )}
        </div>
        {itemsPerPage > 0 && totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        Sebelumnya
                    </button>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DaftarAgendaBerikutnya;
