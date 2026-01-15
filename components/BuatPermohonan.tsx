
import React, { useState } from 'react';
import { JenisPermohonan, Permohonan, FileData } from '../types';
import { ArrowLeftIcon, UploadIcon } from './icons';

interface BuatPermohonanProps {
  onSaveDraft: (permohonan: Omit<Permohonan, 'id' | 'status' | 'tanggal' | 'unit' | 'history' | 'pemohon'>) => void;
  onCancel: () => void;
}

const BuatPermohonan: React.FC<BuatPermohonanProps> = ({ onSaveDraft, onCancel }) => {
  const [step, setStep] = useState(1);
  const [jenisPermohonan, setJenisPermohonan] = useState<JenisPermohonan | ''>('');
  const [perihal, setPerihal] = useState('');
  const [uraian, setUraian] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleNext = () => {
    if (jenisPermohonan === JenisPermohonan.PENANGANAN_PERKARA) {
      alert('Redirecting to Modul Naskah Dinas page...');
      // In a real app, this would be a redirect.
    } else if (jenisPermohonan === JenisPermohonan.PENDAMPINGAN) {
      setStep(2);
    } else {
      alert('Silakan pilih jenis permohonan.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };
  
  const handleSubmit = () => {
    if(!perihal.trim() || !uraian.trim()) {
        alert('Perihal dan Uraian tidak boleh kosong.');
        return;
    }
    const fileData: FileData[] = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    onSaveDraft({
      jenis: 'Pendampingan',
      perihal,
      uraian,
      files: fileData
    });
  };

  if (step === 1) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Buat Permohonan Bantuan Hukum</h2>
            <p className="text-gray-600 text-center mb-8">Pilih jenis permohonan yang Anda butuhkan:</p>
            <div className="space-y-4">
                <div
                    onClick={() => setJenisPermohonan(JenisPermohonan.PENANGANAN_PERKARA)}
                    className={`bg-white p-6 border rounded-lg cursor-pointer transition-all duration-200 ${jenisPermohonan === JenisPermohonan.PENANGANAN_PERKARA ? 'border-blue-500 border-2 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                >
                    <h3 className="font-bold text-lg text-gray-900">Penanganan Perkara</h3>
                    <p className="text-sm text-gray-600 mt-1">Untuk permohonan yang akan diproses melalui Nota Dinas.</p>
                </div>
                <div
                    onClick={() => setJenisPermohonan(JenisPermohonan.PENDAMPINGAN)}
                    className={`bg-white p-6 border rounded-lg cursor-pointer transition-all duration-200 ${jenisPermohonan === JenisPermohonan.PENDAMPINGAN ? 'border-blue-500 border-2 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                >
                    <h3 className="font-bold text-lg text-gray-900">Pendampingan</h3>
                    <p className="text-sm text-gray-600 mt-1">Untuk permohonan pendampingan atau konsultasi hukum.</p>
                </div>
            </div>
            <div className="mt-10 flex justify-center space-x-4">
                <button onClick={onCancel} className="px-8 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition">Batal</button>
                <button onClick={handleNext} className="px-8 py-3 rounded-lg font-semibold bg-[#0055A5] text-white hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={!jenisPermohonan}>Selanjutnya</button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => setStep(1)} className="p-2 mr-4 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600"/>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Buat Permohonan Pendampingan</h2>
      </div>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <label htmlFor="perihal" className="block text-sm font-medium text-gray-700 mb-1">Perihal</label>
          <input
            type="text"
            id="perihal"
            value={perihal}
            onChange={(e) => setPerihal(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Permohonan Pendampingan Pemeriksaan"
          />
        </div>
        <div>
          <label htmlFor="uraian" className="block text-sm font-medium text-gray-700 mb-1">Uraian Singkat Permasalahan</label>
          <textarea
            id="uraian"
            value={uraian}
            onChange={(e) => setUraian(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jelaskan secara singkat permasalahan atau kegiatan yang membutuhkan pendampingan hukum."
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unggah File Pendukung</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Unggah file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">atau tarik dan lepas</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF hingga 10MB</p>
                </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">File yang akan diunggah:</h4>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 flex justify-between items-center">
                      <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                      <button onClick={() => handleRemoveFile(file.name)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Hapus</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
        <div className="flex justify-end space-x-4 pt-4">
            <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition">Batal</button>
            <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Simpan Draft</button>
        </div>
      </div>
    </div>
  );
};

export default BuatPermohonan;
