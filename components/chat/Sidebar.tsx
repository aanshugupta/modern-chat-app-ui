import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Chat, User, Status } from '../../types';
import { AppContext } from '../../App';
import { SunIcon, MoonIcon, CogIcon, LogoutIcon, ChevronLeftIcon, UsersIcon, PlusIcon, PinIcon, MessageSquareIcon, MetaAILogoIcon, BellIcon, TrashIcon, BellOffIcon, LockIcon, BookmarkIcon } from '../icons/Icons';
import Input from '../common/Input';
import { SearchIcon } from '../icons/Icons';
import StatusRing from '../status/StatusRing';
import NotificationsPanel from './NotificationsPanel';

interface SidebarProps {
  chats: Chat[];
  statuses: Status[];
  currentUser: User;
  allUsers: User[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onAddGroupClick: () => void;
  onTogglePinChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onStartDirectChat: (userId: string) => void;
  onViewStatus: (user: User) => void;
  onCreateStatus: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, statuses, currentUser, allUsers, activeChatId, onSelectChat, isCollapsed, onToggleCollapse, onProfileClick, onSettingsClick, onAddGroupClick, onTogglePinChat, onDeleteChat, onStartDirectChat, onViewStatus, onCreateStatus }) => {
  const { toggleDarkMode, darkMode, logout } = useContext(AppContext);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, chatId: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const handleContextMenu = (event: React.MouseEvent, chatId: string) => {
      event.preventDefault();
      setContextMenu({ x: event.clientX, y: event.clientY, chatId });
  };
  
  useEffect(() => {
    const handleClick = () => {
        setContextMenu(null);
        setNotificationsOpen(false);
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  
  const getChatDisplayInfo = (chat: Chat) => {
    if (chat.participants.length === 1 && chat.participants[0] === currentUser.id) {
        return { name: 'Saved Messages', avatar: currentUser.avatar, user: null };
    }
    if (chat.type === 'group') {
      return { name: chat.name, avatar: chat.avatar, user: null };
    }
    const otherUserId = chat.participants.find(p => p !== currentUser.id);
    const otherUser = allUsers.find(u => u.id === otherUserId);
    const name = chat.isPrivate ? `Private Chat - ${otherUser?.name}` : otherUser?.name;
    return { name, avatar: otherUser?.avatar, user: otherUser };
  };
  
  const sortedChats = useMemo(() => 
    [...chats].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || (b.messages[b.messages.length - 1]?.timestamp ?? 0) - (a.messages[a.messages.length - 1]?.timestamp ?? 0)), 
  [chats]);
  
  const filteredChats = useMemo(() => {
    if (!searchTerm) return sortedChats;
    return sortedChats.filter(chat => {
      const { name } = getChatDisplayInfo(chat) || {};
      return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [sortedChats, searchTerm]);

  const usersWithStatus = useMemo(() => {
      const userIds = new Set(statuses.map(s => s.userId));
      return allUsers.filter(u => userIds.has(u.id));
  }, [statuses, allUsers]);

  const unreadMessagesCount = (chat: Chat) => chat.messages.filter(m => !m.isRead && m.senderId !== currentUser.id).length;

  return (
    <aside className={`flex h-full flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 h-16 flex-shrink-0">
        {!isCollapsed && (
            <div className="flex items-center gap-2">
                <MetaAILogoIcon className="w-8 h-8" />
            </div>
        )}
        <div className="flex items-center">
            <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setNotificationsOpen(p => !p); }} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <BellIcon className="w-6 h-6" />
                </button>
                <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
            </div>
            <button onClick={onToggleCollapse} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
              <ChevronLeftIcon className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
        </div>
      </div>

       {/* Search */}
       <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            {!isCollapsed && <Input 
                id="search-chats" 
                placeholder="Search..." 
                icon={<SearchIcon className="w-5 h-5 text-slate-400" />}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Status Section */}
          <div className="p-2 space-y-2 border-b border-slate-200 dark:border-slate-700">
              {!isCollapsed && <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-2">Status</span>}
              <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={onCreateStatus}>
                  <div className="relative">
                      <img src={currentUser.avatar} alt="My Status" className="w-10 h-10 rounded-full" />
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
                        <PlusIcon className="w-4 h-4 text-white bg-blue-500 rounded-full"/>
                      </div>
                  </div>
                  {!isCollapsed && <div className="ml-3"><p className="font-semibold">My Status</p><p className="text-sm text-slate-500 dark:text-slate-400">Add to your status</p></div>}
              </div>
              {usersWithStatus.map(user => (
                  <div key={user.id} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => onViewStatus(user)}>
                      <StatusRing imgUrl={user.avatar} hasUnread={true} />
                      {!isCollapsed && <div className="ml-3"><p className="font-semibold">{user.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">Today, 10:30 AM</p></div>}
                  </div>
              ))}
          </div>

          {/* Chats Section */}
            <nav className="p-2 space-y-1">
              <div className="flex justify-between items-center px-2 mb-2">
                  {!isCollapsed && <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Chats</span>}
                  <button onClick={onAddGroupClick} className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 ${isCollapsed ? 'mx-auto' : ''}`}>
                      <PlusIcon className="w-5 h-5" />
                  </button>
              </div>
              {filteredChats.map(chat => {
                const { name, avatar, user } = getChatDisplayInfo(chat);
                const lastMessage = chat.messages[chat.messages.length - 1];
                const unreadCount = unreadMessagesCount(chat);
                return (
                  <a
                    key={chat.id}
                    href="#"
                    onContextMenu={(e) => handleContextMenu(e, chat.id)}
                    onClick={(e) => { e.preventDefault(); onSelectChat(chat.id); }}
                    className={`flex items-center p-2 rounded-lg transition-colors relative ${activeChatId === chat.id ? 'bg-slate-100 dark:bg-slate-700/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    <div className="relative">
                        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
                        {user && <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${user.status === 'online' ? 'bg-green-500' : 'bg-slate-400'}`}></div>}
                    </div>
                    {!isCollapsed && (
                      <div className="ml-3 overflow-hidden flex-1">
                        <div className="flex items-center">
                            {chat.participants.length === 1 && chat.participants[0] === currentUser.id && <BookmarkIcon className="w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />}
                            {chat.isPrivate && <LockIcon className="w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />}
                            {chat.type === 'group' && <UsersIcon className="w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />}
                            <p className="font-semibold truncate">{name}</p>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{lastMessage?.senderId === 'system' ? lastMessage.text : lastMessage?.isForwarded ? 'Forwarded message: ' : ''}{lastMessage?.text}</p>
                      </div>
                    )}
                    {!isCollapsed && (
                        <div className="flex flex-col items-end text-xs text-slate-400 space-y-1">
                            {lastMessage && <span>{new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                            {unreadCount > 0 && !chat.isMuted && <span className="bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">{unreadCount}</span>}
                            {chat.isMuted && <BellOffIcon className="w-4 h-4 text-slate-400"/>}
                        </div>
                    )}
                    {chat.isPinned && !isCollapsed && <PinIcon filled className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />}
                  </a>
                );
              })}
            </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className={`flex ${isCollapsed ? 'flex-col space-y-2 items-center' : 'justify-between'}`}>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                {darkMode ? <SunIcon className="w-6 h-6"/> : <MoonIcon className="w-6 h-6"/>}
            </button>
            <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                <CogIcon className="w-6 h-6" />
            </button>
            <button onClick={logout} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
              <LogoutIcon className="w-6 h-6 text-red-500" />
            </button>
        </div>
        <div 
          className="flex items-center mt-4 p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
          onClick={onProfileClick}
        >
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
          {!isCollapsed && (
            <div className="ml-3">
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">View Profile</p>
            </div>
          )}
        </div>
      </div>
      
      {contextMenu && (
        <div style={{ top: contextMenu.y, left: contextMenu.x }} className="absolute z-50 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
                <button 
                    onClick={() => onTogglePinChat(contextMenu.chatId)} 
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                   <PinIcon className="w-4 h-4 mr-3"/> {chats.find(c => c.id === contextMenu.chatId)?.isPinned ? 'Unpin Chat' : 'Pin Chat'}
                </button>
                <button 
                    onClick={() => onDeleteChat(contextMenu.chatId)} 
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                   <TrashIcon className="w-4 h-4 mr-3"/> Delete Chat
                </button>
            </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;