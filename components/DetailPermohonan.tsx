
import React, { useState } from 'react';
import { Permohonan, Riwayat, StatusPermohonan, Disposisi } from '../types';
import { ArrowLeftIcon, PaperClipIcon, PaperAirplaneIcon, TrashIcon, UserCircleIcon, DocumentTextIcon, DownloadIcon, PencilIcon, CheckIcon, XIcon, ArrowDownIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';

type DetailTab = 'rincian' | 'permohonan' | 'dokumen' | 'disposisi';

interface DetailPermohonanProps {
  permohonan: Permohonan;
  onBack?: () => void; // Optional for admin view
  onAddReply: (permohonanId: string, reply: Riwayat) => void;
  onUpdateReply: (permohonanId: string, historyId: number, newMessage: string) => void;
  onDeleteReply: (permohonanId: string, historyId: number) => void;
  currentUserRole: 'Pegawai' | 'Administrator';
  onUpdateStatus?: (permohonanId: string, newStatus: StatusPermohonan) => void;
}

const TabButton: React.FC<{ name: DetailTab, label: string, activeTab: DetailTab, setActiveTab: (tab: DetailTab) => void }> = ({ name, label, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
            activeTab === name
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
    >
        {label}
    </button>
);

const RincianTab: React.FC<{ permohonan: Permohonan }> = ({ permohonan }) => (
    <table className="w-full text-sm">
        <tbody>
            <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4 w-1/4">ID Permohonan</td><td className="text-gray-800 py-2.5">{permohonan.id}</td></tr>
            <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">No Tiket/ND</td><td className="text-gray-800 py-2.5">{permohonan.Nomor || `Draft-${permohonan.id}`}</td></tr>
            <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Tanggal</td><td className="text-gray-800 py-2.5">{permohonan.tanggal}</td></tr>
            <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Pemohon</td><td className="text-gray-800 py-2.5">{permohonan.pemohon}</td></tr>
            <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Unit</td><td className="text-gray-800 py-2.5">{permohonan.unit}</td></tr>
            <tr className="border-b border-gray-100"><td className="font-medium text-gray-500 py-2.5 pr-4">Jenis</td><td className="text-gray-800 py-2.5">{permohonan.jenis}</td></tr>
            <tr><td className="font-medium text-gray-500 py-2.5 pr-4">Status</td><td className="text-gray-800 py-2.5">{permohonan.status}</td></tr>
        </tbody>
    </table>
);

const PermohonanTab: React.FC<{ permohonan: Permohonan }> = ({ permohonan }) => (
    <div>
        <h3 className="font-bold text-gray-800 mb-2 text-lg">{permohonan.perihal}</h3>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{permohonan.uraian}</p>
    </div>
);

const DokumenTab: React.FC<{ permohonan: Permohonan }> = ({ permohonan }) => {
    const initialFiles = permohonan.files.map(f => ({ ...f, author: permohonan.pemohon, timestamp: new Date(permohonan.tanggal.split('/').reverse().join('-')) }));
    const historyFiles = permohonan.history.flatMap(h => h.files.map(f => ({ ...f, author: h.author, timestamp: h.timestamp })));
    const allFiles = [...initialFiles, ...historyFiles];

    if (allFiles.length === 0) {
        return <p className="text-sm text-center text-gray-500 py-8">Tidak ada dokumen yang dilampirkan.</p>;
    }

    return (
        <ul className="space-y-3">
            {allFiles.map((file, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center">
                        <DocumentTextIcon className="h-6 w-6 mr-3 text-gray-400 flex-shrink-0"/>
                        <div>
                            <p className="font-semibold text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500">Diunggah oleh {file.author} pada {file.timestamp.toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                    <a href="#" className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition" aria-label={`Download ${file.name}`}>
                        <DownloadIcon className="h-5 w-5" />
                    </a>
                </li>
            ))}
        </ul>
    );
};

const DisposisiTab: React.FC<{ disposisi: Disposisi[] | undefined }> = ({ disposisi }) => {
    if (!disposisi || disposisi.length === 0) {
        return <p className="text-sm text-center text-gray-500 py-8">Belum ada riwayat disposisi.</p>;
    }
    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {disposisi.map((item, itemIdx) => (
                    <li key={item.id}>
                        <div className="relative pb-8">
                            {itemIdx !== disposisi.length - 1 ? (
                                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                                <div className="relative">
                                    <div className="h-10 w-10 bg-blue-500 rounded-full ring-4 ring-white flex items-center justify-center">
                                        <ArrowDownIcon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1 p-1">
                                    <div className="text-sm text-gray-500 mb-2">
                                        <span className="font-medium text-gray-900">{item.pengirim}</span>
                                        <span className="whitespace-nowrap float-right text-xs">{item.tanggalKirim}</span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-3">
                                        <dl className="grid grid-cols-3 gap-x-4 gap-y-2">
                                            <dt className="col-span-1 font-medium text-gray-500">Tujuan</dt>
                                            <dd className="col-span-2"><ul className="list-disc list-inside">{item.tujuan.map((t, i) => <li key={i}>{t}</li>)}</ul></dd>
                                            
                                            <dt className="col-span-1 font-medium text-gray-500">Catatan</dt>
                                            <dd className="col-span-2">{item.catatan || '-'}</dd>
                                            
                                            <dt className="col-span-1 font-medium text-gray-500">Petunjuk</dt>
                                            <dd className="col-span-2"><ul className="list-disc list-inside">{item.petunjukDisposisi.map((p, i) => <li key={i}>{p}</li>)}</ul></dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const HistoryItem: React.FC<{
    item: Riwayat;
    isEditing: boolean;
    editingText: string;
    onEditingTextChange: (text: string) => void;
    onStartEdit: () => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: () => void;
    currentUserRole: 'Pegawai' | 'Administrator';
}> = ({ item, isEditing, editingText, onEditingTextChange, onStartEdit, onSaveEdit, onCancelEdit, onDelete, currentUserRole }) => {
    const isAuthor = item.author === currentUserRole;
    const alignment = item.author === 'Pegawai' ? 'justify-end' : 'justify-start';
    const bubbleColor = item.author === 'Pegawai' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200';
    const textAlign = item.author === 'Pegawai' ? 'text-right' : 'text-left';

    return (
        <div className={`flex ${alignment} group`}>
            <div className="w-full max-w-2xl">
                <div className={`flex items-end gap-2 ${item.author === 'Pegawai' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`relative rounded-lg px-4 py-3 ${bubbleColor} shadow-sm`}>
                         {!isEditing ? (
                            <>
                                <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                                {item.files.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-white/20">
                                        {item.files.map((file, idx) => (
                                            <a key={idx} href="#" className={`flex items-center text-sm ${item.author === 'Pegawai' ? 'text-blue-100 hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}>
                                                <PaperClipIcon className="h-4 w-4 mr-1" /> {file.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-96">
                                <textarea
                                    value={editingText}
                                    onChange={(e) => onEditingTextChange(e.target.value)}
                                    className="w-full p-2 border border-blue-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    rows={3}
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={onCancelEdit} className="p-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full"><XIcon className="h-4 w-4" /></button>
                                    <button onClick={onSaveEdit} className="p-1.5 text-white bg-green-500 hover:bg-green-600 rounded-full"><CheckIcon className="h-4 w-4" /></button>
                                </div>
                            </div>
                        )}
                        {isAuthor && !isEditing && (
                            <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={onStartEdit} className="p-1.5 text-gray-600 bg-white hover:bg-gray-200 rounded-full shadow-md"><PencilIcon className="h-4 w-4" /></button>
                                <button onClick={onDelete} className="p-1.5 text-red-600 bg-white hover:bg-gray-200 rounded-full shadow-md"><TrashIcon className="h-4 w-4" /></button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`mt-1 px-2 ${textAlign}`}>
                    <span className="text-xs text-gray-500">{item.author}, {item.timestamp.toLocaleString('id-ID')}</span>
                </div>
            </div>
        </div>
    );
};


const DetailPermohonan: React.FC<DetailPermohonanProps> = ({ permohonan, onBack, onAddReply, onUpdateReply, onDeleteReply, currentUserRole, onUpdateStatus }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [editingHistoryId, setEditingHistoryId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; historyId: number | null }>({ isOpen: false, historyId: null });
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('rincian');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachedFiles(Array.from(event.target.files));
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() && attachedFiles.length === 0) return;

    const newReply: Riwayat = {
      id: Date.now(),
      author: currentUserRole,
      message: replyMessage,
      files: attachedFiles.map(file => ({ name: file.name, size: file.size, type: file.type })),
      timestamp: new Date(),
    };

    onAddReply(permohonan.id, newReply);
    setReplyMessage('');
    setAttachedFiles([]);
  };
  
    const handleStartEdit = (item: Riwayat) => {
        setEditingHistoryId(item.id);
        setEditingText(item.message);
    };

    const handleCancelEdit = () => {
        setEditingHistoryId(null);
        setEditingText('');
    };

    const handleSaveEdit = (historyId: number) => {
        onUpdateReply(permohonan.id, historyId, editingText);
        handleCancelEdit();
    };

    const requestDeleteReply = (historyId: number) => {
        setDeleteModalState({ isOpen: true, historyId });
    };

    const handleConfirmDeleteReply = () => {
        if (deleteModalState.historyId !== null) {
            onDeleteReply(permohonan.id, deleteModalState.historyId);
        }
        setDeleteModalState({ isOpen: false, historyId: null });
    };

    const handleCancelDeleteReply = () => {
        setDeleteModalState({ isOpen: false, historyId: null });
    };


  return (
    <div className="p-6 bg-gray-50 h-full flex flex-col">
       <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={handleCancelDeleteReply}
        onConfirm={handleConfirmDeleteReply}
        title="Konfirmasi Hapus Tanggapan"
        message="Apakah Anda yakin ingin menghapus tanggapan ini? Tindakan ini tidak dapat diurungkan."
        confirmText="Hapus"
      />
      {onBack && (
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 mr-4 rounded-full hover:bg-gray-200">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-2 px-4" aria-label="Tabs">
                  <TabButton name="rincian" label="Rincian" activeTab={activeDetailTab} setActiveTab={setActiveDetailTab} />
                  <TabButton name="permohonan" label="Permohonan" activeTab={activeDetailTab} setActiveTab={setActiveDetailTab} />
                  <TabButton name="dokumen" label="Dokumen/Lampiran" activeTab={activeDetailTab} setActiveTab={setActiveDetailTab} />
                  <TabButton name="disposisi" label="Riwayat Disposisi" activeTab={activeDetailTab} setActiveTab={setActiveDetailTab} />
              </nav>
          </div>
          <div className="p-6">
              {activeDetailTab === 'rincian' && <RincianTab permohonan={permohonan} />}
              {activeDetailTab === 'permohonan' && <PermohonanTab permohonan={permohonan} />}
              {activeDetailTab === 'dokumen' && <DokumenTab permohonan={permohonan} />}
              {activeDetailTab === 'disposisi' && <DisposisiTab disposisi={permohonan.disposisi} />}
          </div>
      </div>
      
       <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2">
            {permohonan.history.map((item) => (
                <HistoryItem
                    key={item.id}
                    item={item}
                    isEditing={editingHistoryId === item.id}
                    editingText={editingText}
                    onEditingTextChange={setEditingText}
                    onStartEdit={() => handleStartEdit(item)}
                    onSaveEdit={() => handleSaveEdit(item.id)}
                    onCancelEdit={handleCancelEdit}
                    onDelete={() => requestDeleteReply(item.id)}
                    currentUserRole={currentUserRole}
                />
            ))}
        </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
          <textarea
            className="w-full p-3 resize-none focus:outline-none rounded-t-lg text-sm"
            rows={4}
            placeholder="Ketik tanggapan/jawaban Anda di sini..."
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

export default DetailPermohonan;
