import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User, Chat, Message, Status } from '../../types';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import ProfilePage from '../profile/ProfilePage';
import AdminDashboard from '../admin/AdminDashboard';
import { useMockData, useChatSimulation } from '../../hooks/useMockData';
import CreateGroupModal from './CreateGroupModal';
import UserProfileModal from '../profile/UserProfileModal';
import VideoCallView from './VideoCallView';
import ForwardMessageModal from './ForwardMessageModal';
import EmojiPopper from './EmojiPopper';
import StatusViewer from '../status/StatusViewer';
import CreateStatusModal from '../status/CreateStatusModal';
import GroupInfoPanel from './GroupInfoPanel';
import SettingsPage from '../settings/SettingsPage';
import MetaAIProfile from '../profile/MetaAIProfile';
import HelpModal from '../settings/HelpModal';


interface ChatLayoutProps {
  user: User;
  allUsers: User[];
  mockData: Omit<ReturnType<typeof useMockData>, 'users'>;
  onUserUpdate: (user: User) => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ user, allUsers, mockData, onUserUpdate }) => {
  const { chats, statuses, addMessage, addUser, removeUser, addChat, markMessagesAsRead, addMembersToGroup, togglePinChat, updateGroupDetails, blockChat, likeUserProfile, deleteMessage, findOrCreateDirectChat, forwardMessage, togglePinMessage, deleteChat: deleteChatFromHook, addStatus, markStatusAsViewed, toggleMuteChat, removeUserFromGroup, handleVote, addReactionToStatus } = mockData;
  const [activeChatId, setActiveChatId] = useState<string | null>(chats.find(c => c.isPinned)?.id || chats[0]?.id || null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isAdminOpen, setAdminOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [isCreateStatusModalOpen, setCreateStatusModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [viewingStatusOfUser, setViewingStatusOfUser] = useState<User | null>(null);
  const [isGroupInfoOpen, setGroupInfoOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{ chat: Chat; startTime: number; type: 'video' | 'audio' } | null>(null);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [poppedEmoji, setPoppedEmoji] = useState<string | null>(null);

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId]);

  useEffect(() => {
    // Close group info panel if active chat changes to a non-group or different chat
    if (activeChat?.type !== 'group') {
      setGroupInfoOpen(false);
    }
  }, [activeChat]);

  useChatSimulation(
    user,
    activeChat,
    allUsers,
    addMessage,
    markMessagesAsRead,
    setTypingUsers
  );
  
  const handleEmojiPop = useCallback((emoji: string) => {
    setPoppedEmoji(emoji);
    setTimeout(() => setPoppedEmoji(null), 1500); // Animation duration
  }, []);

  const isAiChatView = useMemo(() => 
    activeChat?.type === 'direct' && activeChat.participants.includes('meta-ai'),
    [activeChat]
  );

  const handleBackToList = () => {
    setActiveChatId(null);
  };

  const handleSendMessage = (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    if (!activeChatId) return;
    addMessage(activeChatId, message);
  };
  
  const handleUserUpdate = (updatedUser: User) => {
    onUserUpdate(updatedUser);
  };

  const handleCreateChat = (groupName: string, participantIds: string[]) => {
    if (participantIds.length === 1) { // Private Chat
        const newChatData = {
            type: 'direct' as const,
            participants: [user.id, ...participantIds],
            isPrivate: true,
        };
        addChat(newChatData, (newChat) => {
            setActiveChatId(newChat.id);
        });
    } else { // Group Chat
        const newChatData = {
            type: 'group' as const,
            name: groupName,
            participants: [user.id, ...participantIds],
        };
        addChat(newChatData, (newChat) => {
            setActiveChatId(newChat.id);
        });
    }
  };

  const handleAddParticipants = (chatId: string, newUserIds: string[]) => {
    addMembersToGroup(chatId, newUserIds, user.id);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChatFromHook(chatId);
    if (activeChatId === chatId) {
        setActiveChatId(null);
    }
  };
  
  const handleSelectChat = (chatId: string) => {
      setActiveChatId(chatId);
      markMessagesAsRead(chatId, user.id);
      setGroupInfoOpen(false); // Close panel when switching chats
  }

  const handleStartVideoCall = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveCall({ chat, startTime: Date.now(), type: 'video' });
    }
  };

  const handleStartAudioCall = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveCall({ chat, startTime: Date.now(), type: 'audio' });
    }
  };


  const formatDuration = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    const h = hours > 0 ? `${hours}:` : '';
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const s = seconds < 10 ? `0${seconds}` : seconds;

    return `${h}${m}:${s}`;
  };

  const handleEndVideoCall = useCallback(() => {
    if (activeCall) {
        const duration = Date.now() - activeCall.startTime;
        const systemMessage = {
            senderId: 'system',
            text: `${activeCall.type === 'video' ? 'Video' : 'Audio'} call ended. Duration: ${formatDuration(duration)}`,
        };
        addMessage(activeCall.chat.id, systemMessage);
    }
    setActiveCall(null);
  }, [activeCall, addMessage]);

  const handleGroupDetailsUpdate = (details: { name?: string, description?: string }) => {
    if(activeChatId) {
        updateGroupDetails(activeChatId, details, user.id);
    }
  }

  const handleRemoveUserFromGroup = (userId: string) => {
    if (activeChatId) {
      removeUserFromGroup(activeChatId, userId, user.id);
    }
  }
  
  const handleDeleteMessage = (chatId: string, messageId: string) => {
      deleteMessage(chatId, messageId);
  }

  const handleBlockChat = () => {
    if (activeChatId) {
      blockChat(activeChatId, user.id);
    }
  };

  const handleStartDirectChat = (otherUserId: string) => {
    findOrCreateDirectChat(otherUserId, (chat) => {
        handleSelectChat(chat.id);
    });
  };

  const handleForward = (targetChatIds: string[]) => {
      if (forwardingMessage) {
          forwardMessage(forwardingMessage, targetChatIds);
          setForwardingMessage(null);
      }
  };

  const handlePinMessage = (messageId: string) => {
      if (activeChatId) {
          togglePinMessage(activeChatId, messageId);
      }
  };
  
  const handleVoteInChat = (messageId: string, optionId: string) => {
    if (activeChatId) {
      handleVote(activeChatId, messageId, optionId, user.id);
    }
  };

  const handleCreateStatus = (status: Omit<Status, 'id' | 'viewers' | 'reactions'>) => {
      addStatus(status);
  }
  
  const handleViewStatus = (user: User) => {
      setViewingStatusOfUser(user);
  }

  const handleStatusReply = (statusOwnerId: string, replyText: string) => {
    findOrCreateDirectChat(statusOwnerId, (chat) => {
        addMessage(chat.id, {
            senderId: user.id,
            text: replyText,
        });
        // Close viewer and switch to the chat for a seamless experience
        setViewingStatusOfUser(null);
        setActiveChatId(chat.id);
    });
  };

  const handleStatusReaction = (statusId: string, emoji: string) => {
    addReactionToStatus(statusId, user.id, emoji);
  };
  
  const handleSavedMessagesClick = () => {
    const savedMessagesChat = chats.find(c => c.participants.length === 1 && c.participants[0] === user.id);
    if (savedMessagesChat) {
        handleSelectChat(savedMessagesChat.id);
        setSettingsOpen(false); // Close settings after navigating
    } else {
        alert("Could not find your personal chat.");
    }
  };

  const openProfile = () => {
    setSettingsOpen(false);
    setProfileOpen(true);
  };
  const openAdmin = () => {
    setSettingsOpen(false);
    setAdminOpen(true);
  };
  const openHelp = () => {
    setSettingsOpen(false);
    setHelpModalOpen(true);
  }
  const openSettings = () => setSettingsOpen(true);


  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <EmojiPopper emoji={poppedEmoji} />
      <div className={isAiChatView ? 'hidden' : 'flex-shrink-0'}>
        <Sidebar
          chats={chats}
          currentUser={user}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
          onProfileClick={openProfile}
          onSettingsClick={openSettings}
          onAddGroupClick={() => setCreateGroupModalOpen(true)}
          allUsers={allUsers}
          onTogglePinChat={togglePinChat}
          onStartDirectChat={handleStartDirectChat}
          onDeleteChat={handleDeleteChat}
          statuses={statuses}
          onViewStatus={handleViewStatus}
          onCreateStatus={() => setCreateStatusModalOpen(true)}
        />
      </div>
      <main className="flex-1 flex flex-col transition-all duration-300">
        <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col">
            {activeChat ? (
              <ChatWindow
                key={activeChat.id}
                chat={activeChat}
                currentUser={user}
                allUsers={allUsers}
                onSendMessage={handleSendMessage}
                onViewProfile={setViewingProfile}
                onAddParticipants={handleAddParticipants}
                onStartVideoCall={handleStartVideoCall}
                onStartAudioCall={handleStartAudioCall}
                isAiChatView={isAiChatView}
                onBack={handleBackToList}
                onBlockUser={handleBlockChat}
                onDeleteMessage={handleDeleteMessage}
                typingUsers={typingUsers.filter(u => activeChat?.participants.includes(u.id))}
                onForwardRequest={setForwardingMessage}
                onPinMessage={handlePinMessage}
                onEmojiPop={handleEmojiPop}
                onShowGroupInfo={() => setGroupInfoOpen(true)}
                onLeaveConversation={() => activeChatId && handleDeleteChat(activeChatId)}
                onVote={handleVoteInChat}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                Select a chat to start messaging
              </div>
            )}
            </div>
            {activeChat && activeChat.type === 'group' && isGroupInfoOpen && (
                <GroupInfoPanel 
                    chat={activeChat}
                    currentUser={user}
                    allUsers={allUsers}
                    onClose={() => setGroupInfoOpen(false)}
                    onUpdateDetails={handleGroupDetailsUpdate}
                    onMuteToggle={() => toggleMuteChat(activeChat.id)}
                    onBlockChat={() => handleBlockChat()}
                    onAddMembers={handleAddParticipants}
                    onRemoveMember={handleRemoveUserFromGroup}
                />
            )}
        </div>
      </main>

      {activeCall && (
        <VideoCallView
          chat={activeCall.chat}
          currentUser={user}
          allUsers={allUsers}
          onEndCall={handleEndVideoCall}
          callType={activeCall.type}
        />
      )}

      {viewingStatusOfUser && (
        <StatusViewer
            user={viewingStatusOfUser}
            statuses={statuses.filter(s => s.userId === viewingStatusOfUser.id)}
            onClose={() => setViewingStatusOfUser(null)}
            onView={statusId => markStatusAsViewed(statusId, user.id)}
            onReply={handleStatusReply}
            onReact={handleStatusReaction}
            currentUser={user}
        />
      )}
      
      <SettingsPage 
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onProfileClick={openProfile}
        onAdminClick={openAdmin}
        onHelpClick={openHelp}
        onSavedMessagesClick={handleSavedMessagesClick}
      />
      <ProfilePage isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} user={user} onUserUpdate={handleUserUpdate}/>
      {user.role === 'admin' && <AdminDashboard isOpen={isAdminOpen} onClose={() => setAdminOpen(false)} users={allUsers} onAddUser={addUser} onViewProfile={setViewingProfile} />}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
        allUsers={allUsers}
        currentUser={user}
        onCreateGroup={handleCreateChat}
      />
      <CreateStatusModal
        isOpen={isCreateStatusModalOpen}
        onClose={() => setCreateStatusModalOpen(false)}
        currentUser={user}
        onCreateStatus={handleCreateStatus}
      />

      {viewingProfile && viewingProfile.id === 'meta-ai' ? (
        <MetaAIProfile user={viewingProfile} isOpen={!!viewingProfile} onClose={() => setViewingProfile(null)} />
      ) : (
        <UserProfileModal user={viewingProfile} onClose={() => setViewingProfile(null)} onLikeProfile={likeUserProfile}/>
      )}
      
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} />

      <ForwardMessageModal
        isOpen={!!forwardingMessage}
        onClose={() => setForwardingMessage(null)}
        chats={chats}
        currentUser={user}
        allUsers={allUsers}
        onForward={handleForward}
      />
    </div>
  );
};

export default ChatLayout;