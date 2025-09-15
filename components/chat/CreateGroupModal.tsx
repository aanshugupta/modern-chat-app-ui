import React, { useState } from 'react';
import { User } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  allUsers: User[];
  currentUser: User;
  onCreateGroup: (groupName: string, participantIds: string[]) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, allUsers, currentUser, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const availableUsers = allUsers.filter(u => u.id !== currentUser.id && u.id !== 'meta-ai');

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };
  
  const resetAndClose = () => {
    setGroupName('');
    setSelectedUsers([]);
    onClose();
  };

  const handleSubmit = () => {
    const isPrivateChat = selectedUsers.length === 1;
    const isGroupChat = selectedUsers.length >= 2;

    if (isPrivateChat) {
        onCreateGroup('', selectedUsers);
        resetAndClose();
    } else if (isGroupChat) {
        if (groupName.trim()) {
            onCreateGroup(groupName.trim(), selectedUsers);
            resetAndClose();
        } else {
            alert("Please provide a group name.");
        }
    } else {
        alert("Please select at least one person to start a chat.");
    }
  };
  
  const isPrivateChat = selectedUsers.length === 1;
  const isGroupChat = selectedUsers.length >= 2;
  const modalTitle = isGroupChat ? "Create New Group" : isPrivateChat ? "Start a Private Chat" : "Start a New Chat";
  const buttonText = isPrivateChat ? "Start Chat" : "Create Group";

  const footer = (
    <>
      <Button variant="secondary" onClick={resetAndClose}>Cancel</Button>
      <Button onClick={handleSubmit} disabled={selectedUsers.length === 0}>{buttonText}</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title={modalTitle} footer={footer}>
      <div className="space-y-4">
        {isGroupChat && (
            <Input
              label="Group Name"
              id="group-name"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
        )}
        <div>
          <h4 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Select Members</h4>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 border-t border-b border-slate-200 dark:border-slate-700 py-2">
            {availableUsers.map(user => (
              <label key={user.id} htmlFor={`user-${user.id}`} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                <input
                  id={`user-${user.id}`}
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleToggleUser(user.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ml-3" />
                <span className="ml-3 font-medium">{user.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;