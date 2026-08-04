import React, { useState, useMemo } from 'react';
import { PerkaraRecord, PosisiSidangEntry, View } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon } from './icons';
import Breadcrumb from './Breadcrumb';

interface EAdvokasiKalenderProps {
  daftarPerkara: PerkaraRecord[];
  onNavigate: (view: View, data?: any) => void;
}

type ViewType = 'monthly' | 'weekly' | 'daily';

const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAYS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

const getPicName = (record: PerkaraRecord): string => {
    if (!record.picId || !record.team || record.team.length === 0) {
        return 'N/A';
    }
    const pic = record.team.find(member => member.id === record.picId);
    return pic ? pic.nama : 'N/A';
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
};

const formatIndonesianFullDate = (date: Date) => {
  const daysName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = daysName[date.getDay()];
  const day = date.getDate();
  const month = INDO_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
};

const formatEventDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(date);
};

const EAdvokasiKalender: React.FC<EAdvokasiKalenderProps> = ({ daftarPerkara, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>('monthly');

  // Parse all events (sidang entries) from litigation data
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

  // Upcoming top 5 events based on agendaBerikutnya
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

  // Filter events based on currently selectedDate (active selected day in grid)
  const selectedDayEvents = useMemo(() => {
    return events.filter(event => 
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [events, selectedDate]);

  // Displayed events for filter (Harian, Mingguan, Bulanan) based on selectedDate
  const displayedEvents = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0,0,0,0);
    let end = new Date(start);

    switch(viewType) {
        case 'daily':
            end.setDate(end.getDate() + 1);
            break;
        case 'weekly': {
            const dayOfWeek = start.getDay();
            start.setDate(start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start of week (Monday)
            end = new Date(start);
            end.setDate(end.getDate() + 7);
            break;
        }
        case 'monthly':
            start.setDate(1);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            end.setHours(23,59,59,999);
            break;
    }

    return events.filter(event => event.date >= start && event.date < end)
                 .sort((a, b) => a.date.getTime() - b.date.getTime());

  }, [events, selectedDate, viewType]);

  const headerTitle = useMemo(() => {
    switch(viewType) {
      case 'daily':
        return formatIndonesianFullDate(selectedDate);
      case 'weekly':
        return `Minggu Ini`;
      case 'monthly':
        return `Bulan ${INDO_MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
  }, [viewType, selectedDate]);

  const headerSubtitle = useMemo(() => {
    switch(viewType) {
      case 'daily':
        return `Agenda harian untuk tanggal terpilih`;
      case 'weekly': {
        const start = new Date(selectedDate);
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        const startStr = `${start.getDate()} ${INDO_MONTHS[start.getMonth()]}`;
        const endStr = `${end.getDate()} ${INDO_MONTHS[end.getMonth()]} ${end.getFullYear()}`;
        return `Rentang: ${startStr} - ${endStr}`;
      }
      case 'monthly':
        return `Seluruh agenda pada bulan ${INDO_MONTHS[selectedDate.getMonth()]}`;
    }
  }, [viewType, selectedDate]);

  // Generate days array for the grid calendar (currentMonth)
  const daysArray = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of current month
    const firstDay = new Date(year, month, 1);
    // Day of the week for first day (0 is Sunday, 1 is Monday... 6 is Saturday)
    const startDayOfWeek = firstDay.getDay();
    // Convert to Monday start: 0: Monday, 1: Tuesday, ..., 6: Sunday
    const startOffset = (startDayOfWeek + 6) % 7;

    // Total days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { date: Date | null; isPadding: boolean }[] = [];

    // Add padding days at the start (bg-gray-100)
    for (let i = 0; i < startOffset; i++) {
      days.push({ date: null, isPadding: true });
    }

    // Add actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      days.push({ date: new Date(year, month, day), isPadding: false });
    }

    return days;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelectedDate = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const hasEventsOnDate = (date: Date) => {
    return events.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const getAgendaTitle = () => {
    switch(viewType) {
        case 'daily': return 'Agenda Hari Ini';
        case 'weekly': return 'Agenda Minggu Ini';
        case 'monthly': return 'Agenda Bulan Ini';
        default: return 'Agenda';
    }
  }

  const monthYearLabel = `${INDO_MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const renderEventList = (eventList: typeof events, emptyMessage: string) => (
    eventList.length > 0 ? (
      <ul className="space-y-4">
        {eventList.map((event, index) => (
          <li key={index} className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-all">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-base">{event.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatEventDate(event.date)}</p>
              <p className="text-sm text-gray-600 mt-2">Nomor Perkara: {event.perkara.abstraksiPerkara?.noPerkara || event.perkara.Nomor || event.perkara.id} di {event.perkara.abstraksiPerkara?.pengadilan}</p>
              <div className="mt-2 inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  PIC: {getPicName(event.perkara)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-center py-8 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">{emptyMessage}</p>
    )
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col font-sans">
      <Breadcrumb currentView="eAdvokasiKalender" onNavigate={onNavigate} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kalender Persidangan</h1>
        <p className="text-gray-600 mt-1">Monitoring Agenda Sidang Harian.</p>
        <div className="border-b-4 border-blue-600 w-16 mt-4"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* LEFT COLUMN: Modern Calendar Grid */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col gap-2">
              <div className="w-full mx-auto">
                
                {/* Header navigation */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                  <span className="text-lg lg:text-base xl:text-lg font-bold text-gray-800">
                    {monthYearLabel}
                  </span>
                  <div className="flex flex-row items-center gap-2">
                    <button 
                      onClick={handlePrevMonth}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-600 font-bold transition-all"
                    >
                      ←
                    </button>
                    <button 
                      onClick={handleNextMonth}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-600 font-bold transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAYS.map(day => (
                    <div 
                      key={day} 
                      className="text-center font-bold text-xs lg:text-[11px] xl:text-xs text-gray-500 tracking-wider py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {daysArray.map((dayObj, idx) => {
                    if (dayObj.isPadding) {
                      return (
                        <div 
                          key={`padding-${idx}`}
                          className="flex justify-center items-center h-10 lg:h-9 xl:h-10 2xl:h-10 rounded bg-gray-100"
                        />
                      );
                    }

                    const date = dayObj.date!;
                    const hasEvents = hasEventsOnDate(date);
                    const selected = isSelectedDate(date);
                    const today = isToday(date);

                    let dayClass = "flex justify-center items-center h-10 lg:h-9 xl:h-10 2xl:h-10 rounded cursor-pointer relative transition-all text-sm font-semibold ";
                    
                    if (selected) {
                      dayClass += "bg-blue-600 text-white shadow-sm hover:bg-blue-700";
                    } else if (today) {
                      dayClass += "bg-blue-100 text-blue-800 hover:bg-blue-200";
                    } else if (hasEvents) {
                      dayClass += "bg-red-50 text-red-700 hover:bg-blue-200";
                    } else {
                      dayClass += "text-gray-700 hover:bg-blue-200";
                    }

                    return (
                      <button 
                        key={`day-${date.getDate()}`}
                        onClick={() => {
                          setSelectedDate(date);
                          setCurrentDate(new Date(date)); // sync active month view
                        }}
                        className={dayClass}
                      >
                        <span>{date.getDate()}</span>
                        {hasEvents && (
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : 'bg-blue-500'}`}></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Agenda Berikutnya Box */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Agenda Berikutnya
                </h2>
                <button 
                  onClick={() => onNavigate('eAdvokasiAgendaBerikutnya')} 
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Tampilkan Semua
                </button>
            </div>
            {upcomingEvents.length > 0 ? (
            <ul className="space-y-4">
                {upcomingEvents.map((event, index) => (
                <li key={index} className="flex items-start space-x-3 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                        <ClockIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.date)}</p>
                        <p className="text-xs text-gray-500 mt-1.5"><span className="font-semibold text-gray-600">No. Perkara:</span> {event.perkara.abstraksiPerkara?.noPerkara || event.perkara.Nomor || event.perkara.id} di {event.perkara.abstraksiPerkara?.pengadilan}</p>
                        <div className="mt-2 inline-block bg-gray-200/60 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            PIC: {getPicName(event.perkara)}
                        </div>
                    </div>
                </li>
                ))}
            </ul>
            ) : (
            <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">Tidak ada agenda terdekat.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Date/Period Agenda Details */}
        <div className="lg:w-1/2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-blue-700 font-bold text-lg">{headerTitle}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{headerSubtitle}</p>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                <span className="font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs flex items-center justify-center whitespace-nowrap self-start md:self-auto">
                  {displayedEvents.length} Agenda
                </span>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl self-start md:self-auto">
                    <button 
                      onClick={() => setViewType('daily')} 
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${viewType === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Harian
                    </button>
                    <button 
                      onClick={() => setViewType('weekly')} 
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${viewType === 'weekly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Mingguan
                    </button>
                    <button 
                      onClick={() => setViewType('monthly')} 
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${viewType === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Bulanan
                    </button>
                </div>
              </div>
            </div>
            
            {displayedEvents.length > 0 ? (
              <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                {displayedEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className="flex flex-row p-4 bg-blue-50/70 border border-blue-100 rounded-2xl gap-4 w-full hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <ClockIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex flex-col w-full">
                      <div className="flex flex-row w-full items-start justify-between">
                        <div className="font-bold mb-1.5 text-blue-700 text-lg">09:00 - Selesai</div>
                      </div>
                      <div className="font-bold text-gray-800 break-words text-base leading-relaxed mb-3">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                        <div>
                          <span className="font-semibold text-gray-700">Nomor Perkara:</span> {event.perkara.abstraksiPerkara?.noPerkara || event.perkara.Nomor || event.perkara.id}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Pengadilan:</span> {event.perkara.abstraksiPerkara?.pengadilan || 'N/A'}
                        </div>
                        {(event.perkara.abstraksiPerkara as any)?.namaPihak && (
                          <div>
                            <span className="font-semibold text-gray-700">Para Pihak:</span> {(event.perkara.abstraksiPerkara as any).namaPihak}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 inline-flex items-center text-xs font-semibold text-blue-800 bg-blue-100 px-3 py-1 rounded-full w-max">
                        PIC: {getPicName(event.perkara)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="font-bold text-gray-700 text-lg">
                  Tidak ada agenda untuk {viewType === 'daily' ? 'tanggal ini' : viewType === 'weekly' ? 'minggu ini' : 'bulan ini'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {viewType === 'daily' 
                    ? 'Silakan pilih tanggal lain pada kalender untuk melihat agenda sidang.' 
                    : 'Tidak ditemukan jadwal sidang dalam rentang waktu yang dipilih.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EAdvokasiKalender;
