import React, { useState } from 'react';
import { Permohonan, Riwayat } from '../types';
import DetailPermohonan from './DetailPermohonan';
import AssignTeam from './AssignTeam';
import { ArrowLeftIcon } from './icons';

interface ProsesPermohonanProps {
  permohonan: Permohonan;
  onBack: () => void;
  onAccept: (id: string) => void;
  onAddReply: (permohonanId: string, reply: Riwayat) => void;
  onUpdateReply: (permohonanId: string, historyId: number, newMessage: string) => void;
  onDeleteReply: (permohonanId: string, historyId: number) => void;
}

const ProsesPermohonan: React.FC<ProsesPermohonanProps> = ({
  permohonan,
  onBack,
  onAccept,
  onAddReply,
  onUpdateReply,
  onDeleteReply
}) => {
  const [activeTab, setActiveTab] = useState<'rincian' | 'assign'>('rincian');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Proses Permohonan</h2>
            <p className="text-base font-semibold text-gray-700 mt-1">
                {permohonan?.Nomor || permohonan?.id || 'N/A'}
            </p>
            {permohonan?.perihal && (
                <p className="text-sm text-gray-600 mt-1">{permohonan.perihal}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onAccept(permohonan.id)}
          className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Terima & Proses Permohonan
        </button>
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
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'rincian' ? (
          <DetailPermohonan
            permohonan={permohonan}
            onAddReply={onAddReply}
            onUpdateReply={onUpdateReply}
            onDeleteReply={onDeleteReply}
            currentUserRole="Administrator"
          />
        ) : (
          // FIX: Pass required props to AssignTeam to resolve type error.
          // Using placeholder values as the team assignment logic is not yet fully implemented for this view.
          <AssignTeam 
            team={[]}
            picId={null}
            onUpdateTeam={() => console.warn('Team updates from this view are not implemented.')}
            onSetPic={() => console.warn('PIC updates from this view are not implemented.')}
          />
        )}
      </div>
    </div>
  );
};

export default ProsesPermohonan;