import React, { useState } from 'react';
import { PerkaraRecord, TindakLanjut } from '../types';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from './icons';

interface UpdateTindakLanjutProps {
  record: PerkaraRecord;
  onSave: (record: PerkaraRecord) => void;
  onBack: () => void;
}

const UpdateTindakLanjut: React.FC<UpdateTindakLanjutProps> = ({ record, onSave, onBack }) => {
  const [tindakLanjut, setTindakLanjut] = useState<TindakLanjut[]>(record.tindakLanjut || []);

  const handleAdd = () => {
    setTindakLanjut([...tindakLanjut, { id: Date.now(), tanggal: '', tindakLanjut: '', uraian: '' }]);
  };

  const handleRemove = (id: number) => {
    setTindakLanjut(tindakLanjut.filter(item => item.id !== id));
  };

  const handleChange = (id: number, field: keyof Omit<TindakLanjut, 'id'>, value: string) => {
    setTindakLanjut(tindakLanjut.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = () => {
    onSave({ ...record, tindakLanjut });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-4">
          <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Update Tindak Lanjut</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Tindak Lanjut Penanganan Putusan</h2>
            <button onClick={handleAdd} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <PlusIcon className="h-5 w-5 mr-2" />
                Tambah
            </button>
        </div>
        <div className="space-y-4">
            {tindakLanjut.map(item => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 border rounded-md">
                    <input type="date" value={item.tanggal} onChange={e => handleChange(item.id, 'tanggal', e.target.value)} className="md:col-span-1 border-gray-300 rounded-md shadow-sm" />
                    <input type="text" placeholder="Tindak Lanjut" value={item.tindakLanjut} onChange={e => handleChange(item.id, 'tindakLanjut', e.target.value)} className="md:col-span-1 border-gray-300 rounded-md shadow-sm" />
                    <input type="text" placeholder="Uraian" value={item.uraian} onChange={e => handleChange(item.id, 'uraian', e.target.value)} className="md:col-span-1 border-gray-300 rounded-md shadow-sm" />
                    <button onClick={() => handleRemove(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full justify-self-end"><TrashIcon className="h-5 w-5" /></button>
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTindakLanjut;
