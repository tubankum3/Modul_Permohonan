import React, { useState } from 'react';
import AssignTeamModal, { TeamMember } from './AssignTeamModal';
// FIX: Import `UserAddIcon` to resolve the "Cannot find name" error.
import { UserGroupIcon, TrashIcon, UserCircleIcon, UserAddIcon } from './icons';

interface AssignedTeamMember extends TeamMember {
  teamRole: 'Viewer' | 'Editor';
}

const AssignTeam: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedMembers, setAssignedMembers] = useState<AssignedTeamMember[]>([]);

  const handleSaveTeam = (selectedMembers: TeamMember[]) => {
    const newMembersWithRoles = selectedMembers.map(member => {
      const existingMember = assignedMembers.find(m => m.id === member.id);
      return {
        ...member,
        teamRole: existingMember ? existingMember.teamRole : 'Viewer',
      };
    });
    setAssignedMembers(newMembersWithRoles);
    setIsModalOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    setAssignedMembers(members => members.filter(m => m.id !== id));
  };
  
  const handleToggleRole = (id: string) => {
    setAssignedMembers(members =>
      members.map(member =>
        member.id === id
          ? { ...member, teamRole: member.teamRole === 'Viewer' ? 'Editor' : 'Viewer' }
          : member
      )
    );
  };

  return (
    <>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Tim Bantuan Hukum</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-700 flex items-center">
              <UserGroupIcon className="h-6 w-6 mr-3 text-gray-500"/>
              Daftar Anggota Tim
            </h4>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm flex items-center space-x-2"
            >
              <UserAddIcon className="h-5 w-5" />
              <span>Pilih Anggota Tim</span>
            </button>
          </div>
          <div className="mt-4">
            {assignedMembers.length > 0 ? (
              <ul className="space-y-3">
                {assignedMembers.map(member => (
                  <li key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                        <UserCircleIcon className="h-8 w-8 mr-3 text-gray-400"/>
                        <div>
                            <p className="font-semibold text-gray-800">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleRole(member.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                          member.teamRole === 'Editor'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                        aria-label={`Change role for ${member.name}, current role: ${member.teamRole}`}
                      >
                        {member.teamRole}
                      </button>
                      <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition"
                          aria-label={`Remove ${member.name}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <UserGroupIcon className="h-16 w-16 mx-auto text-gray-300" />
                <p className="mt-4 font-semibold">Belum ada anggota tim yang ditugaskan.</p>
                <p className="text-sm">Klik tombol "Pilih Anggota Tim" untuk memulai.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <AssignTeamModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeam}
        initialSelectedMembers={assignedMembers}
      />
    </>
  );
};

export default AssignTeam;