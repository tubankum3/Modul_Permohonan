import React, { useState } from 'react';
import { 
    BriefcaseIcon, DocumentTextIcon, FlagIcon, ViewGridIcon, 
    FileTextIcon, UserGroupIcon, TagIcon, PlusIcon, PencilIcon, TrashIcon, SearchIcon,
    ChevronDownIcon, ChevronRightIcon, FolderIcon
} from './icons';
import { View } from '../types';
import Breadcrumb from './Breadcrumb';
import ReferensiModal from './eadvo_ReferensiModal';
import ConfirmationModal from './ConfirmationModal';

interface ReferensiProps {
    onNavigate: (view: View) => void;
}

type MenuReferensi = 
    | 'jenis_perkara' 
    | 'pokok_perkara' 
    | 'wilayah' 
    | 'pengadilan' 
    | 'tuntutan' 
    | 'pihak' 
    | 'kementerian' 
    | 'tags';

const menuItems: { id: MenuReferensi; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'jenis_perkara', label: 'Jenis Perkara', icon: <BriefcaseIcon className="w-5 h-5" />, description: 'Kelola Jenis Perkara, Klasifikasi, Sub Klasifikasi' },
    { id: 'pokok_perkara', label: 'Pokok Perkara', icon: <DocumentTextIcon className="w-5 h-5" />, description: 'Kelola Bidang Pokok Perkara, Sub Bidang, Pokok Perkara' },
    { id: 'wilayah', label: 'Wilayah', icon: <FlagIcon className="w-5 h-5" />, description: 'Kelola Provinsi dan Wilayah Lainnya' },
    { id: 'pengadilan', label: 'Pengadilan', icon: <ViewGridIcon className="w-5 h-5" />, description: 'Kelola Pengadilan seluruh Indonesia' },
    { id: 'tuntutan', label: 'Tuntutan', icon: <FileTextIcon className="w-5 h-5" />, description: 'Kelola Objek Tuntutan, Jenis Tuntutan, Satuan, Mata Uang' },
    { id: 'pihak', label: 'Pihak', icon: <UserGroupIcon className="w-5 h-5" />, description: 'Kelola Pihak-Pihak (Pihak P, Pihak T & TT)' },
    { id: 'kementerian', label: 'Kementerian/Lembaga', icon: <ViewGridIcon className="w-5 h-5" />, description: 'Kelola Kementerian/Lembaga' },
    { id: 'tags', label: 'Tags', icon: <TagIcon className="w-5 h-5" />, description: 'Kelola referensi Tag' },
];

const EAdvokasiReferensi: React.FC<ReferensiProps> = ({ onNavigate }) => {
    const [activeMenu, setActiveMenu] = useState<MenuReferensi>('jenis_perkara');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'addSub'>('add');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    const handleOpenModal = (mode: 'add' | 'edit' | 'addSub', item: any = null) => {
        setModalMode(mode);
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (item: any) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        // Mock delete functionality
        console.log('Menghapus item:', itemToDelete);
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const renderHeader = () => {
        const currentMenu = menuItems.find(m => m.id === activeMenu);
        return (
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{currentMenu?.label}</h2>
                    <p className="text-sm text-gray-500">{currentMenu?.description}</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('add')}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Tambah Data</span>
                </button>
            </div>
        );
    };

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderTreeRow = (item: any, level: number = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedRows[item.id];
        
        return (
            <React.Fragment key={item.id}>
                <tr className="hover:bg-gray-50/50 transition border-b border-gray-100">
                    <td className="p-4 text-sm text-gray-700 w-12 text-center">
                        {hasChildren && (
                            <button onClick={() => toggleRow(item.id)} className="text-gray-500 hover:text-gray-700">
                                {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                            </button>
                        )}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900" style={{ paddingLeft: `${level * 2 + 1}rem` }}>
                        <div className="flex items-center space-x-2">
                            {hasChildren ? <FolderIcon className="w-4 h-4 text-blue-500" /> : <DocumentTextIcon className="w-4 h-4 text-gray-400" />}
                            <span>{item.name}</span>
                        </div>
                    </td>
                    <td className="p-4 text-xs text-gray-500">{item.type}</td>
                    {activeMenu === 'tuntutan' && (
                        <td className="p-4 text-sm text-gray-700">
                            {item.format === 'mata_uang' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Mata Uang ({item.unit})</span>}
                            {item.format === 'satuan' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Satuan ({item.unit})</span>}
                        </td>
                    )}
                    <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktif
                        </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenModal('addSub', item)} className="text-blue-600 hover:text-blue-800 p-1 rounded transition" title="Tambah Sub">
                            <PlusIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenModal('edit', item)} className="text-blue-600 hover:text-blue-800 p-1 rounded transition" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(item)} className="text-red-600 hover:text-red-800 p-1 rounded transition" title="Hapus">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </td>
                </tr>
                {isExpanded && hasChildren && item.children.map((child: any) => renderTreeRow(child, level + 1))}
            </React.Fragment>
        );
    };

    const renderTablePlaceholder = () => {
        const isHierarchical = activeMenu === 'jenis_perkara' || activeMenu === 'pokok_perkara' || activeMenu === 'tuntutan';
        
        // Mock data for hierarchical view
        const mockJenisPerkara = [
            { id: '1', name: 'Perdata', type: 'Jenis Perkara', children: [
                { id: '11', name: 'Gugatan', type: 'Klasifikasi Perkara', children: [
                    { id: '111', name: 'Wanprestasi', type: 'Sub Klasifikasi' },
                    { id: '112', name: 'Perbuatan Melawan Hukum', type: 'Sub Klasifikasi' }
                ]},
                { id: '12', name: 'Bantahan', type: 'Klasifikasi Perkara' }
            ]},
            { id: '2', name: 'Tata Usaha Negara (TUN)', type: 'Jenis Perkara', children: [
                { id: '21', name: 'Sengketa Kepegawaian', type: 'Klasifikasi Perkara' }
            ]}
        ];

        const mockPokokPerkara = [
            { id: '1', name: 'Kepabeanan', type: 'Bidang Pokok Perkara', children: [
                { id: '11', name: 'Penetapan Tarif', type: 'Sub Bidang Pokok Perkara', children: [
                    { id: '111', name: 'Sengketa Nilai Pabean', type: 'Pokok Perkara' }
                ]}
            ]}
        ];

        const mockTuntutan = [
            { id: '1', name: 'Tuntutan Materil', type: 'Objek Tuntutan', children: [
                { id: '11', name: 'Ganti Rugi', type: 'Jenis Tuntutan', format: 'mata_uang', unit: 'IDR' },
                { id: '12', name: 'Tanah', type: 'Jenis Tuntutan', format: 'satuan', unit: 'm2' },
                { id: '13', name: 'Kendaraan', type: 'Jenis Tuntutan', format: 'satuan', unit: 'unit' },
                { id: '14', name: 'Kompensasi Asing', type: 'Jenis Tuntutan', format: 'mata_uang', unit: 'USD' }
            ]},
            { id: '2', name: 'Tuntutan Imateril', type: 'Objek Tuntutan', children: [
                { id: '21', name: 'Pemulihan Nama Baik', type: 'Jenis Tuntutan' }
            ]}
        ];

        const getMockData = () => {
            if (activeMenu === 'jenis_perkara') return mockJenisPerkara;
            if (activeMenu === 'pokok_perkara') return mockPokokPerkara;
            if (activeMenu === 'tuntutan') return mockTuntutan;
            return [];
        };

        if (isHierarchical) {
            return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="relative w-64">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Cari referensi..." 
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold border-b border-gray-200 w-12"></th>
                                    <th className="p-4 font-semibold border-b border-gray-200">Nama Referensi</th>
                                    <th className="p-4 font-semibold border-b border-gray-200">Level/Tipe</th>
                                    {activeMenu === 'tuntutan' && <th className="p-4 font-semibold border-b border-gray-200">Default Format Nilai</th>}
                                    <th className="p-4 font-semibold border-b border-gray-200">Status</th>
                                    <th className="p-4 font-semibold border-b border-gray-200 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getMockData().map((item: any) => renderTreeRow(item))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="relative w-64">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Cari referensi..." 
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold border-b border-gray-200">No</th>
                                <th className="p-4 font-semibold border-b border-gray-200">Kode</th>
                                <th className="p-4 font-semibold border-b border-gray-200">Keterangan / Nama Referensi</th>
                                <th className="p-4 font-semibold border-b border-gray-200">Status</th>
                                <th className="p-4 font-semibold border-b border-gray-200 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4 text-sm text-gray-700">{item}</td>
                                    <td className="p-4 text-sm font-medium text-gray-900">REF-{item.toString().padStart(3, '0')}</td>
                                    <td className="p-4 text-sm text-gray-700">Contoh Data Referensi {item}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Aktif
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition" title="Edit">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-800 p-1 rounded transition" title="Hapus">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-sm text-gray-500">
                    <span>Menampilkan 1 hingga 5 dari 24 data</span>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50">Sebelumnya</button>
                        <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
                        <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50">Selanjutnya</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full bg-gray-50 overflow-hidden">
            {/* Local Sidebar for Referensi */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Manajemen Referensi</h2>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 text-left text-sm ${
                                activeMenu === item.id
                                ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <div className={`${activeMenu === item.id ? 'text-blue-700' : 'text-gray-400'}`}>
                                {item.icon}
                            </div>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6">
                    <Breadcrumb 
                        currentView="eAdvokasiReferensi" 
                        onNavigate={(view) => {
                            if (view === 'eAdvokasiReferensi') {
                                // Reset to default tab if user clicks "Manajemen Referensi" in breadcrumb
                                setActiveMenu('jenis_perkara');
                            } else {
                                onNavigate(view);
                            }
                        }} 
                        extraLabel={activeMenu !== 'jenis_perkara' ? menuItems.find(m => m.id === activeMenu)?.label : undefined} 
                    />
                    
                    {renderHeader()}
                    
                    {/* Additional Tabs for complex references */}
                    {activeMenu === 'wilayah' && (
                        <div className="flex space-x-1 border-b border-gray-200 mb-6">
                            {['Provinsi', 'Wilayah Lainnya'].map((tab, idx) => (
                                <button key={tab} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${idx === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeMenu === 'pihak' && (
                        <div className="flex space-x-1 border-b border-gray-200 mb-6">
                            {['Pihak Penggugat (P)', 'Pihak Tergugat (T & TT)'].map((tab, idx) => (
                                <button key={tab} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${idx === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    )}

                    {renderTablePlaceholder()}
                </div>
            </main>
            
            <ReferensiModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activeMenu={activeMenu}
                mode={modalMode}
                item={selectedItem}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Data Referensi"
                message={`Apakah Anda yakin ingin menghapus data referensi ${itemToDelete?.name || ''}? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
            />
        </div>
    );
};

export default EAdvokasiReferensi;
