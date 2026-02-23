import React, { useState } from 'react';
import { PerkaraRecord, TindakLanjut } from '../types';
import { ArrowLeftIcon, PlusIcon, TrashIcon, XIcon } from './icons';

interface UpdateTindakLanjutProps {
  record: PerkaraRecord;
  onSave: (record: PerkaraRecord) => void;
  onBack: () => void;
}

const UpdateTindakLanjut: React.FC<UpdateTindakLanjutProps> = ({ record, onSave, onBack }) => {
  const [tindakLanjutList, setTindakLanjutList] = useState<TindakLanjut[]>(record.tindakLanjut || []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTindakLanjut, setNewTindakLanjut] = useState<Partial<TindakLanjut>>({
    tanggal: '',
    jenisTindakLanjut: '',
    tindakLanjut: '',
    uraian: '',
    file: undefined
  });

  const handleCreateNaskahDinas = () => {
    // Mock redirection to Nadine
    alert('Redirecting to Nadine for Naskah Dinas creation...');
    setShowDropdown(false);
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setShowDropdown(false);
    setNewTindakLanjut({
        tanggal: new Date().toISOString().split('T')[0],
        jenisTindakLanjut: '',
        tindakLanjut: '',
        uraian: '',
        file: undefined
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTindakLanjut(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setNewTindakLanjut(prev => ({
              ...prev,
              file: {
                  name: file.name,
                  url: URL.createObjectURL(file), // Mock URL
                  type: file.type,
                  size: file.size
              }
          }));
      }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTindakLanjut.tanggal && newTindakLanjut.tindakLanjut) {
        const newItem: TindakLanjut = {
            id: Date.now(),
            tanggal: newTindakLanjut.tanggal!,
            jenisTindakLanjut: newTindakLanjut.jenisTindakLanjut,
            tindakLanjut: newTindakLanjut.tindakLanjut!,
            uraian: newTindakLanjut.uraian || '',
            file: newTindakLanjut.file
        };
        setTindakLanjutList([...tindakLanjutList, newItem]);
        setShowForm(false);
    } else {
        alert('Mohon lengkapi Tanggal dan Tindak Lanjut.');
    }
  };

  const handleRemove = (id: number) => {
    setTindakLanjutList(tindakLanjutList.filter(item => item.id !== id));
  };

  const handleSaveAll = () => {
    onSave({ ...record, tindakLanjut: tindakLanjutList });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-4">
          <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Update Tindak Lanjut</h1>
            <p className="text-sm text-gray-500 mt-1">{record.Nomor} - {record.perihal}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Daftar Tindak Lanjut</h2>
            <div className="relative">
                <button 
                    onClick={() => setShowDropdown(!showDropdown)} 
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Tindak Lanjut
                </button>
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <button 
                            onClick={handleCreateNaskahDinas} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Buat Naskah Dinas
                        </button>
                        <button 
                            onClick={handleOpenForm} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Buat Tindak Lanjut
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindak Lanjut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uraian</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tindakLanjutList.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggal}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jenisTindakLanjut || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tindakLanjut}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{item.uraian}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                {item.file ? <a href={item.file.url} target="_blank" rel="noreferrer" className="hover:underline">{item.file.name}</a> : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-900">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {tindakLanjutList.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                Belum ada tindak lanjut.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <div className="flex justify-end">
          <button onClick={handleSaveAll} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold shadow-sm">
              Simpan Semua Perubahan
          </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-900">Tambah Tindak Lanjut</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-500">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmitForm} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                        <input 
                            type="date" 
                            name="tanggal" 
                            value={newTindakLanjut.tanggal} 
                            onChange={handleFormChange} 
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Tindak Lanjut</label>
                        <select 
                            name="jenisTindakLanjut" 
                            value={newTindakLanjut.jenisTindakLanjut} 
                            onChange={handleFormChange} 
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border bg-white"
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="Koordinasi">Koordinasi</option>
                            <option value="Aanmaning">Teguran (Aanmaning)</option>
                            <option value="Sita Eksekusi">Sita Eksekusi</option>
                            <option value="Penganggaran">Penganggaran</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tindak Lanjut</label>
                        <input 
                            type="text" 
                            name="tindakLanjut" 
                            value={newTindakLanjut.tindakLanjut} 
                            onChange={handleFormChange} 
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                            placeholder="Ringkasan tindak lanjut"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Uraian</label>
                        <textarea 
                            name="uraian" 
                            value={newTindakLanjut.uraian} 
                            onChange={handleFormChange} 
                            rows={3} 
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                            placeholder="Detail uraian..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {newTindakLanjut.file && <p className="mt-1 text-xs text-green-600">File terpilih: {newTindakLanjut.file.name}</p>}
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTindakLanjut;
