import React, { useState } from 'react';
import { User, Chat } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  allUsers: User[];
  onAddMembers: (newUserIds: string[]) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ isOpen, onClose, chat, allUsers, onAddMembers }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const availableUsers = allUsers.filter(u => !chat.participants.includes(u.id));

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    if (selectedUsers.length > 0) {
      onAddMembers(selectedUsers);
      setSelectedUsers([]);
      onClose();
    } else {
        alert("Please select at least one member to add.")
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={handleSubmit}>Add Members</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add to ${chat.name}`} footer={footer}>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Select Members</h4>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 border-t border-b border-slate-200 dark:border-slate-700 py-2">
            {availableUsers.length > 0 ? availableUsers.map(user => (
              <label key={user.id} htmlFor={`add-user-${user.id}`} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                <input
                  id={`add-user-${user.id}`}
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleToggleUser(user.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ml-3" />
                <span className="ml-3 font-medium">{user.name}</span>
              </label>
            )) : (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">No other users to add.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddMembersModal;
