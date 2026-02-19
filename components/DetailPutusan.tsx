import React, { useState } from 'react';
import { PerkaraRecord } from '../types';
import { ArrowLeftIcon, EyeIcon } from './icons';

interface DetailPutusanProps {
  record: PerkaraRecord;
  onBack: () => void;
}

const DetailPutusan: React.FC<DetailPutusanProps> = ({ record, onBack }) => {
  const [activeTab, setActiveTab] = useState('Informasi Umum');

  const tabs = ['Informasi Umum', 'Putusan', 'Tindak Lanjut', 'Dokumen', 'Riwayat'];

  const renderInformasiUmum = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Abstraksi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-semibold">Tahun Masuk:</span> {record.abstraksiPerkara?.tahunMasuk}</div>
          <div><span className="font-semibold">No Perkara:</span> {record.abstraksiPerkara?.noPerkara || record.Nomor}</div>
          <div><span className="font-semibold">Wilayah:</span> {record.abstraksiPerkara?.wilayah}</div>
          <div><span className="font-semibold">Jenis Perkara:</span> {record.abstraksiPerkara?.jenisPerkara?.join(', ')}</div>
          <div><span className="font-semibold">Pengadilan:</span> {record.abstraksiPerkara?.pengadilan?.join(', ')}</div>
          <div><span className="font-semibold">Jenis Pokok Perkara:</span> {record.abstraksiPerkara?.jenisPokokPerkara?.join(', ')}</div>
          <div className="md:col-span-2"><span className="font-semibold">Rincian Pokok Perkara:</span> {record.abstraksiPerkara?.rincianPokokPerkara}</div>
          <div className="md:col-span-2"><span className="font-semibold">Tags Perkara:</span> {record.abstraksiPerkara?.tagsPerkara?.join(', ')}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Pihak P</h3>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">No</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Pihak P</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Identitas</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Keterangan</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Unit Berperkara</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {record.pihakP?.map((p, i) => (
              <tr key={i}>
                <td className="px-4 py-2">{p.noUrut}</td>
                <td className="px-4 py-2">{p.pihak}</td>
                <td className="px-4 py-2">{p.identitas}</td>
                <td className="px-4 py-2">{p.keterangan}</td>
                <td className="px-4 py-2">{p.unitBerperkara}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Pihak T</h3>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">No</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Pihak T</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Identitas</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Keterangan</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Unit Berperkara</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {record.pihakT?.map((p, i) => (
              <tr key={i}>
                <td className="px-4 py-2">{p.noUrut}</td>
                <td className="px-4 py-2">{p.pihak}</td>
                <td className="px-4 py-2">{p.identitas}</td>
                <td className="px-4 py-2">{p.keterangan}</td>
                <td className="px-4 py-2">{p.unitBerperkara}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">PIC</h3>
         <div className="text-sm">
            <p><span className="font-semibold">PIC ID:</span> {record.picId || '-'}</p>
         </div>
      </div>
    </div>
  );

  const renderPutusan = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Status BHT</h3>
        <div className="text-sm">
          <p><span className="font-semibold">Status:</span> {record.statusBHT?.status}</p>
          <p><span className="font-semibold">Keterangan Dampak:</span> {record.statusBHT?.keteranganDampak}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Putusan Perkara</h3>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">No</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Nomor</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Tanggal</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Amar</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-center font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {record.putusan?.map((p, i) => (
              <tr key={i}>
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{p.nomor}</td>
                <td className="px-4 py-2">{p.tanggal}</td>
                <td className="px-4 py-2">{p.amar}</td>
                <td className="px-4 py-2">{p.status}</td>
                <td className="px-4 py-2 text-center"><EyeIcon className="h-5 w-5 inline text-gray-500" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Tuntutan Akhir</h3>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">No</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Objek</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Jenis</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Jumlah/Nominal</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Satuan</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {record.tuntutan?.map((t, i) => (
              <tr key={i}>
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{t.objek}</td>
                <td className="px-4 py-2">{t.jenis}</td>
                <td className="px-4 py-2">{t.jumlahNominal}</td>
                <td className="px-4 py-2">{t.satuan}</td>
                <td className="px-4 py-2">{t.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTindakLanjut = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Tindak Lanjut Penanganan Putusan</h3>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-500">No</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Tanggal</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Tindak Lanjut</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Uraian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {record.tindakLanjut?.map((t, i) => (
            <tr key={i}>
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{t.tanggal}</td>
              <td className="px-4 py-2">{t.tindakLanjut}</td>
              <td className="px-4 py-2">{t.uraian}</td>
            </tr>
          ))}
          {(!record.tindakLanjut || record.tindakLanjut.length === 0) && (
            <tr><td colSpan={4} className="text-center py-4 text-gray-500">Belum ada tindak lanjut.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-4">
          <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Informasi Penanganan Putusan</h1>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'Informasi Umum' && renderInformasiUmum()}
        {activeTab === 'Putusan' && renderPutusan()}
        {activeTab === 'Tindak Lanjut' && renderTindakLanjut()}
        {activeTab === 'Dokumen' && <div className="p-4 bg-white rounded shadow text-gray-500">Fitur Dokumen belum tersedia.</div>}
        {activeTab === 'Riwayat' && <div className="p-4 bg-white rounded shadow text-gray-500">Fitur Riwayat belum tersedia.</div>}
      </div>
    </div>
  );
};

export default DetailPutusan;
