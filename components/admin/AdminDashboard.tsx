

import React, { useState } from 'react';
import { User } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { SearchIcon, PlusIcon } from '../icons/Icons';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onAddUser: (user: User) => void;
  onViewProfile: (user: User) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, users, onAddUser, onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

  const handleSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (user: User) => {
    onViewProfile(user);
    onClose();
  };

  const openAddUserModal = () => setAddUserModalOpen(true);
  const closeAddUserModal = () => setAddUserModalOpen(false);

  const handleAddUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
        role: 'user',
        status: 'offline',
    };
    onAddUser(newUser);
    closeAddUserModal();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Admin Dashboard">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Manage Users</h4>
            <Button onClick={openAddUserModal} variant="secondary">
                <PlusIcon className="w-4 h-4" /> Add User
            </Button>
          </div>
          <Input 
            id="search-users" 
            placeholder="Search users..." 
            icon={<SearchIcon className="w-5 h-5 text-slate-400" />}
            onChange={handleSearchFilter}
          />
          <div className="max-h-96 overflow-y-auto border-t border-slate-200 dark:border-slate-700">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                <div className="flex items-center overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="ml-3 truncate">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleViewProfile(user)} className="flex-shrink-0 ml-2">
                    View
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={isAddUserModalOpen} onClose={closeAddUserModal} title="Add New User">
        <form onSubmit={handleAddUserSubmit} className="space-y-4">
            <Input name="name" label="Full Name" required />
            <Input name="email" type="email" label="Email Address" required />
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={closeAddUserModal}>Cancel</Button>
                <Button type="submit">Add User</Button>
            </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminDashboard;