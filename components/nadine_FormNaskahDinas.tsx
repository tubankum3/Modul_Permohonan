
import React from 'react';
import { ArrowLeftIcon, UserAddIcon, CalendarIcon } from './icons';

interface FormNaskahDinasProps {
  onBack: () => void;
  onNext: () => void;
}

const InputField: React.FC<{ label: string, placeholder: string, required?: boolean, icon?: React.ReactNode }> = ({ label, placeholder, required, icon }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <input 
                type="text" 
                placeholder={placeholder}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white" 
            />
            {icon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">{icon}</div>}
        </div>
    </div>
);

const SelectField: React.FC<{ label: string, options: string[], required?: boolean }> = ({ label, options, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white">
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);


const FormNaskahDinas: React.FC<FormNaskahDinasProps> = ({ onBack, onNext }) => {

  return (
    <div className="h-full flex flex-col bg-gray-100">
        <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Kembali</span>
                </button>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Form Naskah Dinas</h2>
            <button onClick={onNext} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700">
                Selanjutnya
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <SelectField label="Pengirim" options={['Kepala Bagian Advokasi III (Pangihutan Siagian)']} required/>
                    <SelectField label="Tipe Tanda Tangan" options={['-', 'Atas nama', 'Untuk beliau']} required/>
                    <SelectField label="Penanda Tangan" options={['Pilih Penanda Tangan', 'Kepala Bagian Advokasi III (Pangihutan Siagian)']} required/>
                    <InputField label="Kepada" placeholder="Tujuan surat" required icon={<UserAddIcon className="h-5 w-5 text-gray-400"/>} />
                    <SelectField label="Sifat Naskah" options={['Biasa', 'Segera']} required />
                    <InputField label="Kategori Naskah Dinas" placeholder="Kategori Naskah Dinas" required />
                    <InputField label="Hal" placeholder="Masukan perihal surat" required />
                    <InputField label="Kode Klasifikasi" placeholder="Kode Klasifikasi" required icon={<CalendarIcon className="h-5 w-5 text-gray-400"/>} />
                    <InputField label="Lampiran" placeholder="Jumlah Lampiran" />
                    <InputField label="Tembusan" placeholder="Tembusan surat" icon={<UserAddIcon className="h-5 w-5 text-gray-400"/>} />

                    <div className="col-span-2 space-y-2 mt-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="kirimEksternal" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="kirimEksternal" className="ml-2 block text-sm text-gray-900">
                                Kirim naskah ke TTE Eksternal
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="produkHukum" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="produkHukum" className="ml-2 block text-sm text-gray-900">
                                Naskah Terkait Produk Hukum
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer className="flex-shrink-0 bg-white p-3 text-right text-sm text-gray-500 border-t border-gray-200">
            Digital Signature Supported By BSSN
        </footer>
    </div>
  );
};

export default FormNaskahDinas;
