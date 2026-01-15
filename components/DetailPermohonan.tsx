
import React, { useState } from 'react';
import { Permohonan, Riwayat } from '../types';
import { ArrowLeftIcon, PaperClipIcon, PaperAirplaneIcon, TrashIcon, UserCircleIcon, DocumentTextIcon, DownloadIcon } from './icons';

interface DetailPermohonanProps {
  permohonan: Permohonan;
  onBack: () => void;
  onAddReply: (permohonanId: string, reply: Riwayat) => void;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid grid-cols-4 py-3 border-b border-gray-200">
    <dt className="text-sm font-medium text-gray-500 col-span-1">{label}</dt>
    <dd className="text-sm text-gray-900 col-span-3">{value}</dd>
  </div>
);

const DetailPermohonan: React.FC<DetailPermohonanProps> = ({ permohonan, onBack, onAddReply }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachedFiles(Array.from(event.target.files));
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() && attachedFiles.length === 0) return;

    const newReply: Riwayat = {
      id: Date.now(),
      author: 'Pegawai',
      message: replyMessage,
      files: attachedFiles.map(file => ({ name: file.name, size: file.size, type: file.type })),
      timestamp: new Date(),
    };

    onAddReply(permohonan.id, newReply);
    setReplyMessage('');
    setAttachedFiles([]);
  };
  
  const hasHistory = permohonan.history && permohonan.history.length > 0;

  return (
    <div className="p-6 bg-gray-50 h-full flex flex-col">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-4 rounded-full hover:bg-gray-200">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="bg-white border border-blue-200 rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-blue-200 bg-blue-50 rounded-t-lg">
            <h3 className="font-bold text-gray-800 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-600"/>
                Details Pengelolaan Permohonan
            </h3>
        </div>
        <dl className="p-4">
            <DetailRow label="No. Tiket" value={permohonan.id} />
            <DetailRow label="Pemohon" value={permohonan.pemohon} />
            <DetailRow label="Unit" value={permohonan.unit} />
            <DetailRow label="Tanggal" value={permohonan.tanggal} />
            <DetailRow label="Jenis" value={permohonan.jenis} />
            <DetailRow label="Status" value={permohonan.status} />
        </dl>
      </div>

      <div className="bg-white border border-blue-200 rounded-lg shadow-sm mb-6">
        <div className="p-4">
            <h3 className="font-bold text-gray-800 mb-2">{permohonan.perihal}</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{permohonan.uraian}</p>
             {permohonan.files.length > 0 && (
                <div className="mt-4">
                    {permohonan.files.map((file, idx) => (
                        <a key={idx} href="#" className="inline-flex items-center text-sm text-blue-600 hover:underline">
                           <DownloadIcon className="h-4 w-4 mr-1"/>
                           {file.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
      </div>
      
      {hasHistory && (
          <div className="flex-1 overflow-y-auto mb-6 space-y-6">
            {permohonan.history.map((item) => (
              <div key={item.id} className="flex space-x-4">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${item.author === 'Pegawai' ? 'bg-blue-500' : 'bg-green-500'}`}>
                    <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-gray-800">{item.author}</p>
                            <p className="text-xs text-gray-500">{item.timestamp.toLocaleString('id-ID')}</p>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.message}</p>
                        {item.files.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm font-semibold text-gray-600 mb-1">Lampiran:</p>
                                <ul className="text-sm space-y-1">
                                    {item.files.map((file, idx) => (
                                        <li key={idx} className="flex items-center text-blue-600 hover:underline cursor-pointer">
                                            <PaperClipIcon className="h-4 w-4 mr-2" />
                                            {file.name} ({Math.round(file.size / 1024)} KB)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
          <textarea
            className="w-full p-3 resize-none focus:outline-none rounded-t-lg text-sm"
            rows={4}
            placeholder="Ketik tanggapan Anda di sini..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          {attachedFiles.length > 0 && (
            <div className="p-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">File Terlampir:</p>
                <ul className="text-sm space-y-1">
                    {attachedFiles.map((file, idx) => (
                         <li key={idx} className="flex items-center justify-between text-gray-700">
                            <span>{file.name}</span>
                            <button onClick={() => setAttachedFiles(files => files.filter(f => f.name !== file.name))} className="text-red-500 hover:text-red-700">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
          )}
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-b-lg">
            <div>
              <label htmlFor="file-upload" className="cursor-pointer p-2 rounded-full hover:bg-gray-200 inline-block">
                <PaperClipIcon className="h-5 w-5 text-gray-600" />
              </label>
              <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
            </div>
            <button
              onClick={handleSendReply}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 disabled:bg-blue-300 transition text-sm font-semibold"
              disabled={!replyMessage.trim() && attachedFiles.length === 0}
            >
              <span>Kirim Tanggapan</span>
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// FIX: An export assignment cannot have modifiers. The extra 'export' was removed.
export default DetailPermohonan;