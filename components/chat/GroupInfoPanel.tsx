import React, { useState, useMemo } from 'react';
import { Chat, User } from '../../types';
// Fix: Remove UserXIcon and ShieldIcon from imports as they are defined locally.
// Fix: Correct typo from LogOutIcon to LogoutIcon.
import { XIcon, EditIcon, BellOffIcon, BellIcon, UserPlusIcon, TrashIcon, LogoutIcon } from '../icons/Icons';
import Button from '../common/Button';
import AddMembersModal from './AddMembersModal';

interface GroupInfoPanelProps {
  chat: Chat;
  currentUser: User;
  allUsers: User[];
  onClose: () => void;
  onUpdateDetails: (details: { name?: string; description?: string }) => void;
  onMuteToggle: () => void;
  onBlockChat: () => void;
  onAddMembers: (chatId: string, userIds: string[]) => void;
  onRemoveMember: (userId: string) => void;
}

const GroupInfoPanel: React.FC<GroupInfoPanelProps> = ({
  chat, currentUser, allUsers, onClose, onUpdateDetails, onMuteToggle, onBlockChat, onAddMembers, onRemoveMember
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [groupName, setGroupName] = useState(chat.name || '');
  const [groupDesc, setGroupDesc] = useState(chat.description || '');
  const [isAddMembersModalOpen, setAddMembersModalOpen] = useState(false);

  const participants = useMemo(() => allUsers.filter(u => chat.participants.includes(u.id)), [allUsers, chat.participants]);
  const isCurrentUserAdmin = useMemo(() => chat.adminIds?.includes(currentUser.id), [chat.adminIds, currentUser.id]);

  const handleNameSave = () => {
    onUpdateDetails({ name: groupName });
    setIsEditingName(false);
  };
  
  const handleDescSave = () => {
    onUpdateDetails({ description: groupDesc });
    setIsEditingDesc(false);
  };

  const handleAddMembersSubmit = (newUserIds: string[]) => {
    onAddMembers(chat.id, newUserIds);
  }

  return (
    <>
      <aside className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col flex-shrink-0">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 h-16">
          <h2 className="font-semibold text-lg">Group Info</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <img src={chat.avatar} alt={chat.name} className="w-24 h-24 rounded-full" />
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full px-2 py-1 border border-slate-300 rounded-md dark:bg-slate-700" />
                <Button size="sm" onClick={handleNameSave}>Save</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-center">{chat.name}</h3>
                {isCurrentUserAdmin && <button onClick={() => setIsEditingName(true)}><EditIcon className="w-4 h-4" /></button>}
              </div>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400">{chat.participants.length} members</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Description</h4>
            {isEditingDesc ? (
                <>
                <textarea value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} rows={3} className="w-full text-sm px-2 py-1 border border-slate-300 rounded-md dark:bg-slate-700" />
                <Button size="sm" onClick={handleDescSave} className="w-full">Save Description</Button>
                </>
            ) : (
                <div className="flex items-start justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        {chat.description || "No description provided."}
                    </p>
                    {isCurrentUserAdmin && <button onClick={() => setIsEditingDesc(true)}><EditIcon className="w-4 h-4" /></button>}
                </div>
            )}
          </div>

          <div className="space-y-2">
            <Button variant="ghost" className="w-full !justify-start" onClick={onMuteToggle}>
              {chat.isMuted ? <BellIcon className="w-5 h-5 mr-3"/> : <BellOffIcon className="w-5 h-5 mr-3"/>}
              {chat.isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">{participants.length} Participants</h4>
            {isCurrentUserAdmin && (
              <Button variant="ghost" className="w-full !justify-start" onClick={() => setAddMembersModalOpen(true)}>
                <UserPlusIcon className="w-5 h-5 mr-3 text-indigo-500"/> Add participants
              </Button>
            )}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
              {participants.map(p => (
                <div key={p.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <div className="flex items-center">
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-3">
                      <p className="font-semibold">{p.name} {p.id === currentUser.id && '(You)'}</p>
                      {chat.adminIds?.includes(p.id) && <span className="text-xs text-indigo-500 font-bold flex items-center gap-1"><ShieldIcon className="w-3 h-3"/> Admin</span>}
                    </div>
                  </div>
                  {isCurrentUserAdmin && p.id !== currentUser.id && (
                    <button onClick={() => onRemoveMember(p.id)} className="p-1 rounded-full opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                      <UserXIcon className="w-5 h-5"/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
            <Button variant="ghost" className="w-full !justify-start text-red-500 dark:text-red-400" onClick={onBlockChat}>
              <XIcon className="w-5 h-5 mr-3"/> Block Group
            </Button>
             <Button variant="ghost" className="w-full !justify-start text-red-500 dark:text-red-400" onClick={() => alert("Leaving group...")}>
              {/* Fix: Use LogoutIcon instead of LogOutIcon */}
              <LogoutIcon className="w-5 h-5 mr-3"/> Leave Group
            </Button>
          </div>

        </div>
      </aside>
      <AddMembersModal 
        isOpen={isAddMembersModalOpen}
        onClose={() => setAddMembersModalOpen(false)}
        chat={chat}
        allUsers={allUsers}
        onAddMembers={handleAddMembersSubmit}
      />
    </>
  );
};

// A dummy icon component as it might not be in the main Icons file.
const UserXIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
);
// A dummy icon component as it might not be in the main Icons file.
const ShieldIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

export default GroupInfoPanel;