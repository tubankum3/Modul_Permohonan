import React, { useState, useEffect } from 'react';
import { BerandaContent } from '../types';

interface PengelolaanInformasiProps {
  content: BerandaContent;
  onSave: (newContent: BerandaContent) => void;
}

const PengelolaanInformasi: React.FC<PengelolaanInformasiProps> = ({ content, onSave }) => {
  const [formData, setFormData] = useState(content);

  useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFlowStepChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFlowSteps = [...formData.flowSteps];
    newFlowSteps[index] = { ...newFlowSteps[index], [name]: value };
    setFormData(prev => ({ ...prev, flowSteps: newFlowSteps }));
  };
  
  const handleSaveChanges = () => {
    onSave(formData);
  };

  return (
    <div className="p-8 bg-gray-50 h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pengelolaan Informasi Beranda</h1>
          <p className="text-gray-600 mt-1">Ubah konten yang ditampilkan di halaman Beranda front office.</p>
        </div>
        <button
          onClick={handleSaveChanges}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </div>
       <div className="border-b-4 border-blue-600 w-16 mb-6"></div>
      
      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Judul Halaman</h2>
          <input
            type="text"
            name="pageTitle"
            value={formData.pageTitle}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Alur Permohonan</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Judul Bagian Alur</label>
            <input
              type="text"
              name="flowTitle"
              value={formData.flowTitle}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-4">
            {formData.flowSteps.map((step, index) => (
              <div key={step.step} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <p className="font-bold text-gray-600 mb-2">Langkah {step.step}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Judul Langkah</label>
                        <input
                        type="text"
                        name="title"
                        value={step.title}
                        onChange={(e) => handleFlowStepChange(index, e)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
                        <textarea
                        name="description"
                        value={step.description}
                        onChange={(e) => handleFlowStepChange(index, e)}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tentang E-Advokasi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Judul Bagian</label>
              <input
                type="text"
                name="eAdvokasiTitle"
                value={formData.eAdvokasiTitle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Paragraf 1</label>
              <textarea
                name="eAdvokasiParagraph1"
                value={formData.eAdvokasiParagraph1}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Paragraf 2</label>
              <textarea
                name="eAdvokasiParagraph2"
                value={formData.eAdvokasiParagraph2}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengelolaanInformasi;
