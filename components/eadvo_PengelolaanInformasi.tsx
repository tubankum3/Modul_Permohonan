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

  const handleQuickLinkChange = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...(formData.quickLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, quickLinks: newLinks }));
  };

  const handleAddQuickLink = () => {
    setFormData(prev => ({
      ...prev,
      quickLinks: [...(prev.quickLinks || []), { title: '', url: '' }]
    }));
  };

  const handleRemoveQuickLink = (index: number) => {
    const newLinks = [...(formData.quickLinks || [])];
    newLinks.splice(index, 1);
    setFormData(prev => ({ ...prev, quickLinks: newLinks }));
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Tautan Cepat (Quick Links)</h2>
            <button
                onClick={handleAddQuickLink}
                className="flex items-center space-x-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
            >
                <PlusIcon className="w-4 h-4" />
                <span>Tambah Tautan</span>
            </button>
          </div>
          <div className="space-y-4">
            {(formData.quickLinks || []).map((link, index) => (
                <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleQuickLinkChange(index, 'title', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Judul Tautan (misal: Portal Satu Kemenkeu)"
                        />
                        <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleQuickLinkChange(index, 'url', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="URL (misal: https://satu.kemenkeu.go.id)"
                        />
                    </div>
                    <button
                        onClick={() => handleRemoveQuickLink(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition flex-shrink-0"
                        title="Hapus Tautan"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
            {(!formData.quickLinks || formData.quickLinks.length === 0) && (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg text-sm">
                    Belum ada tautan cepat. Klik tombol di atas untuk menambahkan.
                </div>
            )}
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
