

import React, { useState } from 'react';
// FIX: Import Personnel and ALL_PERSONNEL to resolve type conflicts.
import AssignTeamModal, { ALL_PERSONNEL, Personnel } from './AssignTeamModal';
import { TeamMember } from '../types';
import { UserGroupIcon, TrashIcon, UserCircleIcon, UserAddIcon } from './icons';

interface AssignTeamProps {
    team: TeamMember[];
    picId: string | null;
    onUpdateTeam: (newTeam: TeamMember[]) => void;
    onSetPic: (picId: string | null) => void;
}


const AssignTeam: React.FC<AssignTeamProps> = ({ team, picId, onUpdateTeam, onSetPic }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIX: Map from modal's Personnel type to the app's TeamMember type.
  const handleSaveTeam = (selectedPersonnel: Personnel[]) => {
    // This function now receives the Personnel type from the modal
    const newTeamMembers: TeamMember[] = selectedPersonnel.map(person => {
      const existingMember = team.find(m => m.id === person.id);
      const unit = [person.eselon4, person.eselon3, person.eselon2, person.eselon1].filter(Boolean).join(', ');
      
      return {
        id: person.id,
        nama: person.name,
        nip: existingMember?.nip || 'N/A', // NIP is not available in modal data
        unit: existingMember?.unit || unit, // Prefer existing detailed unit string
        role: person.role,
        teamRole: existingMember ? existingMember.teamRole : 'Viewer',
      };
    });
    
    onUpdateTeam(newTeamMembers);

    // If the current PIC is no longer in the team, reset it
    if (picId && !newTeamMembers.some(m => m.id === picId)) {
        onSetPic(null);
    }
    setIsModalOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    if (id === picId) {
      onSetPic(null);
    }
    onUpdateTeam(team.filter(m => m.id !== id));
  };
  
  const handleToggleRole = (id: string) => {
    const newTeam = team.map(member => {
        if (member.id === id) {
            // If the current PIC is being demoted from editor to viewer, reset the PIC status.
            if (member.id === picId && member.teamRole === 'Editor') {
                onSetPic(null);
            }
            return { ...member, teamRole: member.teamRole === 'Viewer' ? 'Editor' : 'Viewer' as 'Viewer' | 'Editor' };
        }
        return member;
    });
    onUpdateTeam(newTeam);
  };

  // FIX: Create initial personnel list for the modal by mapping from the app's team member list.
  const initialSelectedPersonnel: Personnel[] = team.map(member => {
      const personnelRecord = ALL_PERSONNEL.find(p => p.id === member.id);
      if (personnelRecord) {
          return personnelRecord;
      }
      // Create a fallback Personnel object for team members not in the master list.
      return {
          id: member.id,
          name: member.nama,
          role: member.role,
          eselon1: member.unit, // Use unit as a fallback for eselon1
          eselon2: '',
      };
  });

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
            {team.length > 0 ? (
              <ul className="space-y-3">
                {team.map(member => (
                  <li key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                        <UserCircleIcon className="h-8 w-8 mr-3 text-gray-400"/>
                        <div>
                            {/* FIX: Use 'nama' instead of 'name' */}
                            <p className="font-semibold text-gray-800">{member.nama}</p>
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
                        // FIX: Use 'nama' instead of 'name'
                        aria-label={`Change role for ${member.nama}, current role: ${member.teamRole}`}
                      >
                        {member.teamRole}
                      </button>
                      {member.teamRole === 'Editor' && (
                        picId === member.id ? (
                          <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-500 text-white cursor-default">
                            PIC
                          </span>
                        ) : (
                          <button
                            onClick={() => onSetPic(member.id)}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                            // FIX: Use 'nama' instead of 'name'
                            aria-label={`Set ${member.nama} as PIC`}
                          >
                            Set PIC
                          </button>
                        )
                      )}
                      <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition"
                          // FIX: Use 'nama' instead of 'name'
                          aria-label={`Remove ${member.nama}`}
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
        // FIX: Pass the mapping function
        onSave={handleSaveTeam}
        // FIX: Pass the mapped initial members
        initialSelectedMembers={initialSelectedPersonnel}
      />
    </>
  );
};

export default AssignTeam;