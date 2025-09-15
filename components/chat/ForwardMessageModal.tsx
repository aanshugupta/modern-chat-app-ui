import React, { useState, useMemo } from 'react';
import { User, Chat } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { SearchIcon } from '../icons/Icons';

interface ForwardMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  currentUser: User;
  allUsers: User[];
  onForward: (targetChatIds: string[]) => void;
}

const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({ isOpen, onClose, chats, currentUser, allUsers, onForward }) => {
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getChatDisplayInfo = (chat: Chat) => {
    if (chat.type === 'group') {
      return { name: chat.name, avatar: chat.avatar };
    }
    const otherUserId = chat.participants.find(p => p !== currentUser.id);
    const otherUser = allUsers.find(u => u.id === otherUserId);
    return { name: otherUser?.name, avatar: otherUser?.avatar };
  };

  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const { name } = getChatDisplayInfo(chat);
      return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [chats, searchTerm, currentUser.id, allUsers]);

  const handleToggleChat = (chatId: string) => {
    setSelectedChats(prev =>
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
  };

  const handleSubmit = () => {
    if (selectedChats.length > 0) {
      onForward(selectedChats);
      // Reset state for next time
      setSelectedChats([]);
      setSearchTerm('');
      onClose();
    } else {
        alert("Please select at least one chat to forward the message to.")
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={handleSubmit} disabled={selectedChats.length === 0}>
        Send ({selectedChats.length})
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forward message to..." footer={footer}>
      <div className="space-y-4">
        <Input
          id="search-forward"
          placeholder="Search for people or groups"
          icon={<SearchIcon className="w-5 h-5 text-slate-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2 border-t border-b border-slate-200 dark:border-slate-700 py-2">
            {filteredChats.map(chat => {
              const { name, avatar } = getChatDisplayInfo(chat);
              return (
              <label key={chat.id} htmlFor={`chat-${chat.id}`} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                <input
                  id={`chat-${chat.id}`}
                  type="checkbox"
                  checked={selectedChats.includes(chat.id)}
                  onChange={() => handleToggleChat(chat.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <img src={avatar} alt={name} className="w-10 h-10 rounded-full ml-3" />
                <span className="ml-3 font-medium">{name}</span>
              </label>
            )})}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ForwardMessageModal;
