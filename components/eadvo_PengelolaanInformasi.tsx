import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { BerandaContent, View } from '../types';
import Breadcrumb from './Breadcrumb';
import { PlusIcon, TrashIcon } from './icons';

interface PengelolaanInformasiProps {
  content: BerandaContent;
  onSave: (newContent: BerandaContent) => void;
  onNavigate?: (view: View) => void;
}

const PengelolaanInformasi: React.FC<PengelolaanInformasiProps> = ({ content, onSave, onNavigate }) => {
  const [formData, setFormData] = useState(content);
  const editor = useRef(null);

  const joditConfig = useMemo(() => ({
      readonly: false,
      placeholder: 'Tulis deskripsi di sini...',
      height: 400,
      buttons: [
          'bold', 'italic', 'underline', 'strikethrough', '|',
          'ul', 'ol', '|',
          'outdent', 'indent', '|',
          'font', 'fontsize', 'brush', 'paragraph', '|',
          'table', 'link', 'image', 'video', '|',
          'align', 'undo', 'redo', '|',
          'hr', 'eraser', 'fullsize'
      ]
  }), []);

  useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHtmlChange = (value: string) => {
    setFormData(prev => ({ ...prev, eAdvokasiHtml: value }));
  };

  const handleFlowStepChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFlowSteps = [...formData.flowSteps];
    newFlowSteps[index] = { ...newFlowSteps[index], [name]: value };
    setFormData(prev => ({ ...prev, flowSteps: newFlowSteps }));
  };

  const handleCarouselChange = (index: number, value: string) => {
    const newImages = [...(formData.carouselImages || [])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, carouselImages: newImages }));
  };

  const handleAddCarouselImage = () => {
    setFormData(prev => ({
        ...prev,
        carouselImages: [...(prev.carouselImages || []), '']
    }));
  };

  const handleRemoveCarouselImage = (index: number) => {
    const newImages = [...(formData.carouselImages || [])];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, carouselImages: newImages }));
  };
  
  const handleSaveChanges = () => {
    onSave(formData);
  };



  return (
    <div className="p-8 bg-gray-50 h-full flex flex-col">
      {onNavigate && <Breadcrumb currentView="eAdvokasiInfo" onNavigate={onNavigate} />}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Judul Halaman</h2>
          <p className="text-sm text-gray-500 mb-4">Anda dapat menggunakan <code className="bg-gray-100 px-1 py-0.5 rounded">[User]</code> untuk menampilkan nama pengguna yang sedang login.</p>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Gambar Carousel</h2>
            <button
                onClick={handleAddCarouselImage}
                className="flex items-center space-x-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
            >
                <PlusIcon className="w-4 h-4" />
                <span>Tambah Gambar</span>
            </button>
          </div>
          <div className="space-y-4">
            {(formData.carouselImages || []).map((img, index) => (
                <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={img}
                            onChange={(e) => handleCarouselChange(index, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="URL Gambar (misal: https://images.unsplash.com/...)"
                        />
                    </div>
                    {img && (
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <button
                        onClick={() => handleRemoveCarouselImage(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                        title="Hapus Gambar"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
            {(!formData.carouselImages || formData.carouselImages.length === 0) && (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    Belum ada gambar carousel.
                </div>
            )}
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
              <label className="block text-sm font-medium text-gray-600 mb-2">Konten Deskripsi</label>
              <div className="bg-white rounded-md">
                <JoditEditor
                    ref={editor}
                    value={formData.eAdvokasiHtml || ''}
                    config={joditConfig}
                    onBlur={newContent => handleHtmlChange(newContent)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengelolaanInformasi;
