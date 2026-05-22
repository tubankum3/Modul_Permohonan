import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PerkaraRecord, PosisiSidangEntry, View } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon } from './icons';
import Breadcrumb from './Breadcrumb';

interface EAdvokasiKalenderProps {
  daftarPerkara: PerkaraRecord[];
  onNavigate: (view: View, data?: any) => void;
}

type CalendarValue = Date | [Date, Date] | null;
type ViewType = 'monthly' | 'weekly' | 'daily';

const getPicName = (record: PerkaraRecord): string => {
    if (!record.picId || !record.team || record.team.length === 0) {
        return 'N/A';
    }
    const pic = record.team.find(member => member.id === record.picId);
    return pic ? pic.nama : 'N/A';
};

const EAdvokasiKalender: React.FC<EAdvokasiKalenderProps> = ({ daftarPerkara, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>('monthly');

  const events = useMemo(() => {
    const allEvents: { date: Date; title: string; type: string; perkara: PerkaraRecord }[] = [];
    daftarPerkara.forEach(perkara => {
      if (perkara.posisiSidang) {
        const sidangEntries: PosisiSidangEntry[] = [
          ...(perkara.posisiSidang.tkPertama || []),
          ...(perkara.posisiSidang.tkBanding || []),
          ...(perkara.posisiSidang.tkKasasi || []),
          ...(perkara.posisiSidang.tkPK || []),
        ];

        sidangEntries.forEach(sidang => {
          try {
            const [day, month, year] = sidang.tanggalSidang.split('/');
            const date = new Date(`${year}-${month}-${day}`);
            if (!isNaN(date.getTime())) {
                allEvents.push({ date, title: sidang.agendaSidang, type: 'Sidang', perkara });
            }
          } catch (e) {
            console.error("Invalid date format:", sidang.tanggalSidang);
          }
        });
      }
    });
    return allEvents;
  }, [daftarPerkara]);

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
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [daftarPerkara]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    return events.filter(event => 
      event.date.getFullYear() === today.getFullYear() &&
      event.date.getMonth() === today.getMonth() &&
      event.date.getDate() === today.getDate()
    );
  }, [events]);

  const displayedEvents = useMemo(() => {
    const start = new Date(currentDate);
    start.setHours(0,0,0,0);
    let end = new Date(start);

    switch(viewType) {
        case 'daily':
            end.setDate(end.getDate() + 1);
            break;
        case 'weekly':
            const dayOfWeek = start.getDay();
            start.setDate(start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start of week (Monday)
            end = new Date(start);
            end.setDate(end.getDate() + 7);
            break;
        case 'monthly':
            start.setDate(1);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            end.setHours(23,59,59,999);
            break;
    }

    return events.filter(event => event.date >= start && event.date < end)
                 .sort((a, b) => a.date.getTime() - b.date.getTime());

  }, [events, currentDate, viewType]);

  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      setCurrentDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setCurrentDate(value[0]);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  };
  
  const formatEventDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  }

  const getAgendaTitle = () => {
    switch(viewType) {
        case 'daily': return 'Agenda Hari Ini';
        case 'weekly': return 'Agenda Minggu Ini';
        case 'monthly': return 'Agenda Bulan Ini';
        default: return 'Agenda';
    }
  }

  const renderEventList = (eventList: typeof events, emptyMessage: string) => (
    eventList.length > 0 ? (
      <ul className="space-y-4">
        {eventList.map((event, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{event.title}</p>
              <p className="text-sm text-gray-500">{formatEventDate(event.date)}</p>
              <p className="text-sm text-gray-500">Nomor Perkara: {event.perkara.abstraksiPerkara?.noPerkara || event.perkara.Nomor || event.perkara.id} di {event.perkara.abstraksiPerkara?.pengadilan}</p>
              <div className="mt-1 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  PIC: {getPicName(event.perkara)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">{emptyMessage}</p>
    )
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col">
      <Breadcrumb currentView="eAdvokasiKalender" onNavigate={onNavigate} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kalender Persidangan</h1>
        <p className="text-gray-600 mt-1">Monitoring Agenda Sidang Harian.</p>
        <div className="border-b-4 border-blue-600 w-16 mt-4"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        <div className="lg:w-1/2 flex flex-col gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Calendar
                    onChange={handleDateChange}
                    value={currentDate}
                    className="w-full border-none"
                    tileClassName={({ date, view }) => view === 'month' && events.some(e => e.date.toDateString() === date.toDateString()) ? "have-events" : ""}
                    tileContent={({ date, view }) => 
                    view === 'month' && events.some(e => e.date.toDateString() === date.toDateString()) ? 
                    <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto mt-1"></div> : null
                    }
                    next2Label={null}
                    prev2Label={null}
                    nextLabel={<ChevronRightIcon className="h-6 w-6 text-gray-600" />}
                    prevLabel={<ChevronLeftIcon className="h-6 w-6 text-gray-600" />}
                />
            </div>
        </div>

        <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Agenda Berikutnya</h2>
                    <button onClick={() => onNavigate('eAdvokasiAgendaBerikutnya')} className="text-sm text-blue-600 hover:underline">Tampilkan Semua</button>
                </div>
                {upcomingEvents.length > 0 ? (
                <ul className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                    <li key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                            <ClockIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">{event.title}</p>
                            <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                            <p className="text-sm text-gray-500">Nomor Perkara: {event.perkara.abstraksiPerkara?.noPerkara || event.perkara.Nomor || event.perkara.id} di {event.perkara.abstraksiPerkara?.pengadilan}</p>
                            <div className="mt-1 inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                PIC: {getPicName(event.perkara)}
                            </div>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-gray-500">Tidak ada agenda terdekat.</p>
                )}
            </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{getAgendaTitle()}</h2>
            <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                <button onClick={() => setViewType('daily')} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewType === 'daily' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}>Harian</button>
                <button onClick={() => setViewType('weekly')} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewType === 'weekly' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}>Mingguan</button>
                <button onClick={() => setViewType('monthly')} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewType === 'monthly' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}>Bulanan</button>
            </div>
        </div>
        <div className="overflow-y-auto" style={{maxHeight: '40vh'}}>
            {renderEventList(displayedEvents, `Tidak ada agenda untuk ${viewType === 'daily' ? 'hari ini' : viewType === 'weekly' ? 'minggu ini' : 'bulan ini'}.`)}
        </div>
      </div>

      <style>{`
        .react-calendar {
          border: none;
        }
        .react-calendar__navigation button {
            font-size: 1.25rem;
            font-weight: bold;
        }
        .react-calendar__month-view__weekdays__weekday {
            text-align: center;
            font-weight: 600;
            color: #6b7280;
            text-decoration: none;
        }
        .react-calendar__tile {
            border-radius: 0.5rem;
            padding: 0.75rem 0.5rem;
        }
        .react-calendar__tile--now {
            background: #eff6ff;
            color: #2563eb;
        }
        .react-calendar__tile--active {
            background: #3b82f6 !important;
            color: white !important;
        }
        .have-events {
            position: relative;
        }
      `}</style>
    </div>
  );
};

export default EAdvokasiKalender;
