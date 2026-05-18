
import React, { useState } from 'react';
import { ArrowLeftIcon, SearchIcon, MenuIcon } from './icons';

interface PilihTemplateNaskahProps {
  onBack: () => void;
  onNext: () => void;
}

const TemplateCard: React.FC<{ title: string; code: string; isSelected: boolean; onSelect: () => void; }> = ({ title, code, isSelected, onSelect }) => {
    return (
        <div onClick={onSelect} className={`border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-blue-500 border-2' : 'border-gray-300'}`}>
            <div className="p-3 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">{title} ({code})</h3>
            </div>
            <div className="p-4 bg-white rounded-b-lg">
                <img src="https://cdn.curvenote.com/019b6a97-2940-7135-8d95-dc40c17f3036/public/word-export-deb4aedc847ab123d90ecebf2e64f132.png" alt={`Template for ${title}`} className="w-full h-auto object-contain" />
            </div>
        </div>
    );
};


const PilihTemplateNaskah: React.FC<PilihTemplateNaskahProps> = ({ onBack, onNext }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('ND');

  const templates = [
      { title: 'Nota Dinas', code: 'ND' },
      { title: 'Pengumuman', code: 'PENG' },
      { title: 'Surat', code: 'S' },
      { title: 'Surat Tugas', code: 'ST' },
      { title: 'Undangan', code: 'UND' },
      { title: 'Surat Perintah', code: 'PRIN' },
      { title: 'Surat Kuasa Khusus', code: 'SKU' },
      { title: 'Surat Edaran', code: 'SE' },
      { title: 'Berita Acara', code: 'BA' },
      { title: 'Laporan', code: 'LAP' },
  ];

  return (
    <div className="h-full flex flex-col">
        <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Kembali</span>
                </button>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Pilih Template Naskah</h2>
            <button onClick={onNext} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700">
                Selanjutnya
            </button>
        </header>

        <div className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-center space-x-4">
            <button className="p-2 border border-gray-300 rounded-md">
                <MenuIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="relative flex-grow">
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Cari Template Naskah" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="relative">
                 <select className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none">
                    <option>Template Umum</option>
                 </select>
            </div>
            <div className="flex items-center space-x-2">
                <span>Alur Normal</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {templates.map(template => (
                    <TemplateCard 
                        key={template.code}
                        title={template.title}
                        code={template.code}
                        isSelected={selectedTemplate === template.code}
                        onSelect={() => setSelectedTemplate(template.code)}
                    />
                ))}
            </div>
        </div>
        <footer className="flex-shrink-0 bg-white p-3 text-right text-sm text-gray-500 border-t border-gray-200">
            Digital Signature Supported By BSSN
        </footer>
    </div>
  );
};

export default PilihTemplateNaskah;
