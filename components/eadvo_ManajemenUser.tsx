import React, { useState } from 'react';
import { useAdvokasiStore } from '../useAdvokasiStore';
import { UserAccount } from '../types';
import { SearchIcon, PlusIcon, XIcon } from './icons';
import AssignTeamModal, { Personnel, ALL_PERSONNEL } from './AssignTeamModal';

interface ManajemenUserProps {
  onNavigate: (view: any) => void;
}

const eadvo_ManajemenUser: React.FC<ManajemenUserProps> = ({ onNavigate }) => {
  const { userAccounts, handleUpdateUserStatus, handleUpdateUserRoles, handleSaveUserAccount, showNotification } = useAdvokasiStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for editing roles/status
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState<'Aktif' | 'Tidak Aktif'>('Aktif');

  const filteredUsers = userAccounts.filter(user => 
    user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nip.includes(searchTerm) ||
    user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openEditModal = (user: UserAccount) => {
    setSelectedUser(user);
    setEditRoles([...user.roles]);
    setEditStatus(user.status);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  const handleRoleToggle = (role: string) => {
    if (editRoles.includes(role)) {
      setEditRoles(editRoles.filter(r => r !== role));
    } else {
      setEditRoles([...editRoles, role]);
    }
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      if (editRoles.length === 0) {
        showNotification('Minimal satu role harus dipilih.', 'error');
        return;
      }
      handleUpdateUserRoles(selectedUser.id, editRoles);
      handleUpdateUserStatus(selectedUser.id, editStatus);
      closeEditModal();
    }
  };

  const handleAddPersonnelAsUsers = (personnel: Personnel[]) => {
    let addedCount = 0;
    personnel.forEach(p => {
      // Check if user already exists
      if (!userAccounts.some(u => u.nama === p.name)) { // Assuming unique name or better use NIP if available, personnel lacks NIP, we generate random or mock NIP
        const newUser: UserAccount = {
          id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          nama: p.name,
          nip: `19${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}0${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}20${Math.floor(Math.random() * 20)}01100${Math.floor(Math.random() * 9)}`, // Mock NIP
          unit: p.eselon2,
          roles: ['Pegawai'],
          status: 'Aktif'
        };
        handleSaveUserAccount(newUser);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      showNotification(`${addedCount} pengguna baru berhasil ditambahkan.`, 'success');
    } else if (personnel.length > 0) {
      showNotification('Pengguna yang dipilih sudah terdaftar.', 'info');
    }
    setIsAddModalOpen(false);
  };

  const availableRoles = ['Super Admin', 'Manajer', 'Operator', 'Pegawai'];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-white p-6 shadow-sm flex items-center justify-between z-10 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar pengguna, peran (roles), dan status akses</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Tambah Pengguna
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIP, atau role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 font-semibold text-gray-600 border-b border-gray-200">Nama Lengkap</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 border-b border-gray-200">NIP</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 border-b border-gray-200">Unit Kerja</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 border-b border-gray-200">Roles</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 border-b border-gray-200">Status</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 border-b border-gray-200 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-gray-800 font-medium">{user.nama}</td>
                      <td className="py-3 px-4 text-gray-600">{user.nip}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm max-w-xs truncate" title={user.unit}>{user.unit}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(role => (
                            <span key={role} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      Tidak ada pengguna yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Role/Status Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Edit Pengguna</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 transition">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                <p className="text-gray-800 font-semibold">{selectedUser.nama}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Status Akun</p>
                <select 
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value as 'Aktif' | 'Tidak Aktif')}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Peran (Role)</p>
                <div className="space-y-2 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {availableRoles.map(role => (
                    <label key={role} className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded transition">
                      <input 
                        type="checkbox"
                        checked={editRoles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-gray-700 text-sm">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User (AssignTeamModal reused for searching personnel) */}
      <AssignTeamModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPersonnelAsUsers}
        initialSelectedMembers={[]}
      />
    </div>
  );
};

export default eadvo_ManajemenUser;
