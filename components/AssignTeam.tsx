

import React, { useState, useEffect, useRef } from 'react';
// FIX: Import Personnel and ALL_PERSONNEL to resolve type conflicts.
import AssignTeamModal, { ALL_PERSONNEL, Personnel } from './AssignTeamModal';
import { TeamMember } from '../types';
import { UserGroupIcon, TrashIcon, UserCircleIcon, UserAddIcon, ChevronDownIcon, CheckIcon } from './icons';

interface AssignTeamProps {
    team: TeamMember[];
    picId: string | null;
    onUpdateTeam: (newTeam: TeamMember[]) => void;
    onSetPic: (picId: string | null) => void;
}

const RoleDropdown = ({ member, onUpdateRole }: { member: TeamMember, onUpdateRole: (id: string, role: TeamMember['teamRole']) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Ensure backwards compatibility where older members might not use PIC in teamRole yet, but have picId match
    const currentRole = member.teamRole || 'Viewer';

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center px-4 py-1.5 text-xs font-bold rounded-full transition space-x-1 border ${
                    currentRole === 'PIC'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                        : currentRole === 'Editor'
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                }`}
            >
                <span>{currentRole}</span>
                <ChevronDownIcon className="h-3 w-3 opacity-70" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg z-20 border border-gray-200 py-1 overflow-hidden">
                    {['Viewer', 'Editor', 'PIC'].map((role) => (
                        <button
                            key={role}
                            onClick={() => {
                                onUpdateRole(member.id, role as TeamMember['teamRole']);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors ${currentRole === role ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-gray-700'}`}
                        >
                            <span>{role}</span>
                            {currentRole === role && <CheckIcon className="h-4 w-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const AssignTeam: React.FC<AssignTeamProps> = ({ team, picId, onUpdateTeam, onSetPic }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalize legacy data (where PIC was managed by picId) into teamRole on initial mount or update if needed, but doing it in the mapping is better.
  const normalizedTeam = team.map(m => {
      if (m.id === picId && m.teamRole !== 'PIC') {
          return { ...m, teamRole: 'PIC' as const };
      }
      return m;
  });

  const handleSaveTeam = (selectedPersonnel: Personnel[]) => {
    const newTeamMembers: TeamMember[] = selectedPersonnel.map(person => {
      const existingMember = normalizedTeam.find(m => m.id === person.id);
      const unit = [person.eselon4, person.eselon3, person.eselon2, person.eselon1].filter(Boolean).join(', ');
      
      return {
        id: person.id,
        nama: person.name,
        nip: existingMember?.nip || 'N/A', 
        unit: existingMember?.unit || unit, 
        role: person.role,
        teamRole: existingMember ? existingMember.teamRole : 'Viewer',
      };
    });
    
    onUpdateTeam(newTeamMembers);

    // If there is ANY PIC in the new team, we might want to update picId for backwards compatibility 
    // with other components that still rely on picId. 
    const pics = newTeamMembers.filter(m => m.teamRole === 'PIC');
    if (pics.length > 0) {
        onSetPic(pics[0].id); // Just set the first one for backwards compat
    } else {
        onSetPic(null);
    }
    
    setIsModalOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    const newTeam = normalizedTeam.filter(m => m.id !== id);
    onUpdateTeam(newTeam);
    
    // Maintain backwards compatibility
    if (id === picId) {
        const remainingPics = newTeam.filter(m => m.teamRole === 'PIC');
        if (remainingPics.length > 0) {
            onSetPic(remainingPics[0].id);
        } else {
            onSetPic(null);
        }
    }
  };
  
  const handleUpdateRole = (id: string, newRole: TeamMember['teamRole']) => {
    const newTeam = normalizedTeam.map(member => {
        if (member.id === id) {
            return { ...member, teamRole: newRole };
        }
        return member;
    });
    
    onUpdateTeam(newTeam);

    // Maintain backwards compatibility for parts of app not fully migrated
    const pics = newTeam.filter(m => m.teamRole === 'PIC');
    if (pics.length > 0) {
        onSetPic(pics[0].id);
    } else {
        onSetPic(null);
    }
  };

  const initialSelectedPersonnel: Personnel[] = normalizedTeam.map(member => {
      const personnelRecord = ALL_PERSONNEL.find(p => p.id === member.id);
      if (personnelRecord) {
          return personnelRecord;
      }
      return {
          id: member.id,
          name: member.nama,
          role: member.role,
          eselon1: member.unit, 
          eselon2: '',
      };
  });

  return (
    <>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Tim Bantuan Hukum</h3>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold text-gray-800 flex items-center">
              <UserGroupIcon className="h-6 w-6 mr-3 text-blue-600"/>
              Daftar Anggota Tim
            </h4>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center space-x-2 text-sm"
            >
              <UserAddIcon className="h-5 w-5" />
              <span>Kelola Anggota Tim</span>
            </button>
          </div>
          <div className="mt-4">
            {normalizedTeam.length > 0 ? (
              <ul className="space-y-3">
                {normalizedTeam.map(member => (
                  <li key={member.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all">
                    <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-4 text-blue-600">
                            <UserCircleIcon className="h-6 w-6"/>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 leading-tight mb-0.5">{member.nama}</p>
                            <p className="text-sm font-medium text-gray-500">{member.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      
                      <RoleDropdown member={member} onUpdateRole={handleUpdateRole} />

                      <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>

                      <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${member.nama}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <UserGroupIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="font-bold text-gray-700 text-lg">Belum ada anggota tim yang ditugaskan</p>
                <p className="text-sm text-gray-500 mt-2">Klik tombol "Kelola Anggota Tim" untuk menambahkan personel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <AssignTeamModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeam}
        initialSelectedMembers={initialSelectedPersonnel}
      />
    </>
  );
};

export default AssignTeam;