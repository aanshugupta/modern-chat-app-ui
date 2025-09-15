// Fix: Add `useMemo` to React imports to fix 'Cannot find name 'useMemo'' error.
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chat, User, Message, PollData } from '../../types';
import MessageItem from './MessageItem';
import Button from '../common/Button';
// Fix: Add UsersIcon to imports
import { SendIcon, SmileIcon, MoreVerticalIcon, UserPlusIcon, LogoutIcon, VideoIcon, ChevronLeftIcon, PhoneIcon, EditIcon, PinIcon, XIcon, CodeIcon, MicrophoneIcon, UsersIcon, PaperclipIcon } from '../icons/Icons';
import AddMembersModal from './AddMembersModal';
import EmojiPicker from '../common/EmojiPicker';
import CreatePollModal from './CreatePollModal';
import AttachmentMenu from './AttachmentMenu';
import GifPicker from '../common/GifPicker';

interface ChatWindowProps {
  chat: Chat;
  currentUser: User;
  allUsers: User[];
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  onDeleteMessage: (chatId: string, messageId: string) => void;
  onViewProfile: (user: User) => void;
  onAddParticipants: (chatId: string, newUserIds: string[]) => void;
  onStartVideoCall: (chatId: string) => void;
  onStartAudioCall: (chatId: string) => void;
  onBlockUser: () => void;
  isAiChatView?: boolean;
  onBack?: () => void;
  typingUsers?: User[];
  onForwardRequest: (message: Message) => void;
  onPinMessage: (messageId: string) => void;
  onEmojiPop: (emoji: string) => void;
  onShowGroupInfo: () => void;
  onLeaveConversation: () => void;
  onVote: (messageId: string, optionId: string) => void;
}

const EMOJI_REGEX = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})$/u;

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, allUsers, onSendMessage, onDeleteMessage, onViewProfile, onAddParticipants, onStartVideoCall, onStartAudioCall, isAiChatView, onBack, onBlockUser, typingUsers = [], onForwardRequest, onPinMessage, onEmojiPop, onShowGroupInfo, onLeaveConversation, onVote }) => {
  const [message, setMessage] = useState('');
  const [isHeaderMenuOpen, setHeaderMenuOpen] = useState(false);
  const [isAddMembersModalOpen, setAddMembersModalOpen] = useState(false);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [isAttachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [isCreatePollModalOpen, setCreatePollModalOpen] = useState(false);
  const [isGifPickerOpen, setGifPickerOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const mentionsRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const gifPickerRef = useRef<HTMLDivElement>(null);
  
  const chatParticipants = useMemo(() => allUsers.filter(u => chat.participants.includes(u.id)), [allUsers, chat.participants]);

  const chatPartner = useMemo(() => {
    if (chat.type === 'direct') {
        const otherUserId = chat.participants.find(p => p !== currentUser.id);
        return allUsers.find(u => u.id === otherUserId);
    }
    return undefined;
  }, [chat, currentUser, allUsers]);

  const { name, avatar } = useMemo(() => {
    if (chat.participants.length === 1 && chat.participants[0] === currentUser.id) {
        return { name: 'Saved Messages', avatar: currentUser.avatar };
    }
    if (chat.type === 'group') {
      return { name: chat.name, avatar: chat.avatar };
    }
    return { name: chatPartner?.name, avatar: chatPartner?.avatar };
  }, [chat, chatPartner, currentUser]);

  const getStatusText = () => {
      if (chat.participants.length === 1 && chat.participants[0] === currentUser.id) {
        return 'Your personal space for notes and links';
      }
      if (chat.type === 'group') return `${chat.participants.length} members`;
      if (chat.isBlocked) return 'Blocked';
      if (chatPartner?.status === 'online') return 'Online';
      if (chatPartner?.lastSeen) {
          const lastSeenDate = new Date(chatPartner.lastSeen);
          const now = new Date();
          const diffHours = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60);
          if (diffHours < 24 && now.getDate() === lastSeenDate.getDate()) {
              return `Last seen today at ${lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          }
          return `Last seen ${lastSeenDate.toLocaleDateString()}`;
      }
      return 'Offline';
  }

  const statusText = getStatusText();
  
  const pinnedMessage = useMemo(() => chat.pinnedMessageId ? chat.messages.find(m => m.id === chat.pinnedMessageId) : null, [chat.pinnedMessageId, chat.messages]);
  
  const filteredMessages = useMemo(() => {
      return chat.messages;
  }, [chat.messages]);

  // Handle emoji pop animation
  useEffect(() => {
      const lastMessage = chat.messages[chat.messages.length-1];
      if (lastMessage && lastMessage.senderId !== currentUser.id && !lastMessage.attachment && !lastMessage.poll && EMOJI_REGEX.test(lastMessage.text.trim())) {
          onEmojiPop(lastMessage.text.trim());
      }
  }, [chat.messages, currentUser.id, onEmojiPop]);

  const getTypingText = () => {
    if (typingUsers.length === 0) return statusText;
    if (typingUsers.length === 1) return `${typingUsers[0].name} is typing...`;
    if (typingUsers.length === 2) return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
    return 'Several people are typing...';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setHeaderMenuOpen(false);
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) setEmojiPickerOpen(false);
      if (mentionsRef.current && !mentionsRef.current.contains(event.target as Node)) setShowMentions(false);
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) setAttachmentMenuOpen(false);
      if (gifPickerRef.current && !gifPickerRef.current.contains(event.target as Node)) setGifPickerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessageAndReset = (messagePayload: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    onSendMessage(messagePayload);
    setMessage('');
    setShowMentions(false);
  };

  const handleSendTextMessage = () => {
    if (message.trim() === "" || chat.isBlocked) return;
    
    handleSendMessageAndReset({ 
        senderId: currentUser.id, 
        text: message, 
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setEmojiPickerOpen(false);
    inputRef.current?.focus();
  };

  const handleHeaderClick = () => {
      if (chat.participants.length === 1 && chat.participants[0] === currentUser.id) {
        return; // No profile to view for saved messages
      }
      if (chat.type === 'direct' && chatPartner) {
          onViewProfile(chatPartner);
      } else if (chat.type === 'group') {
          onShowGroupInfo();
      }
  };

  const handleLeaveConversation = () => {
    if(confirm("Are you sure you want to leave this conversation?")){
        onLeaveConversation();
    }
  };
  
  const handleAddMembers = (newUserIds: string[]) => {
      onAddParticipants(chat.id, newUserIds);
  }

  const handleBlock = () => {
    if(confirm(`Are you sure you want to block ${name}?`)){
        onBlockUser();
    }
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    const lastAt = value.lastIndexOf('@');
    const lastSegment = value.substring(lastAt);
    const hasSpaceAfterAt = lastSegment.includes(' ');

    if (chat.type === 'group' && lastAt !== -1 && !hasSpaceAfterAt) {
        const query = value.substring(lastAt + 1);
        const suggestions = chatParticipants.filter(u => 
            u.id !== currentUser.id &&
            u.name.toLowerCase().includes(query.toLowerCase())
        );
        setMentionSuggestions(suggestions);
        setShowMentions(suggestions.length > 0);
    } else {
        setShowMentions(false);
    }
  };

  const handleMentionSelect = (user: User) => {
      const lastAt = message.lastIndexOf('@');
      const newMessage = message.substring(0, lastAt) + `@${user.name} `;
      setMessage(newMessage);
      setShowMentions(false);
      inputRef.current?.focus();
  };
  
  const handleCreatePoll = (pollData: PollData) => {
    handleSendMessageAndReset({ senderId: currentUser.id, text: '', poll: pollData });
  };
  
  const handleGifSelect = (url: string) => {
    handleSendMessageAndReset({ senderId: currentUser.id, text: '', attachment: { type: 'gif', url } });
    setGifPickerOpen(false);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const url = event.target?.result as string;
              const isImage = file.type.startsWith('image/');
              handleSendMessageAndReset({
                  senderId: currentUser.id,
                  text: '',
                  attachment: {
                      type: isImage ? 'image' : 'file',
                      url,
                      name: file.name,
                      size: file.size,
                  }
              });
          };
          reader.readAsDataURL(file);
      }
      setAttachmentMenuOpen(false);
  };
  
  return (
    <>
      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-16 flex-shrink-0">
          <div className="flex items-center">
            {isAiChatView && onBack && (
              <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 mr-2">
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}
            <div 
              className={`flex items-center ${!isAiChatView && !(chat.participants.length === 1 && chat.participants[0] === currentUser.id) ? 'cursor-pointer' : ''}`}
              onClick={handleHeaderClick}
            >
              <div className="relative">
                <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
                {chatPartner && <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${chatPartner.status === 'online' ? 'bg-green-500' : 'bg-slate-400'}`}></div>}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-lg">{name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {typingUsers.length > 0 ? (
                        <span className="text-indigo-500 dark:text-indigo-400 italic">{getTypingText()}</span>
                    ) : (
                        statusText
                    )}
                </p>
              </div>
            </div>
          </div>
          {!(chat.participants.length === 1 && chat.participants[0] === currentUser.id) && (
          <div className="flex items-center space-x-2">
            <button onClick={() => onStartAudioCall(chat.id)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-shadow hover:shadow-lg hover:shadow-indigo-500/30">
                <PhoneIcon className="w-6 h-6"/>
            </button>
            <button onClick={() => onStartVideoCall(chat.id)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-shadow hover:shadow-lg hover:shadow-indigo-500/30">
                <VideoIcon className="w-6 h-6"/>
            </button>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setHeaderMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-shadow hover:shadow-lg hover:shadow-indigo-500/30">
                  <MoreVerticalIcon className="w-6 h-6"/>
              </button>
              {isHeaderMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                          {chat.type === 'group' && (
                            <button onClick={() => { onShowGroupInfo(); setHeaderMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">
                                <UsersIcon className="w-5 h-5 mr-3"/> Group Info
                            </button>
                          )}
                          <button onClick={() => { setAddMembersModalOpen(true); setHeaderMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">
                              <UserPlusIcon className="w-5 h-5 mr-3"/> Add People
                          </button>
                          {chat.type === 'direct' && !chat.isBlocked && (
                             <button onClick={() => { handleBlock(); setHeaderMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600">
                               <LogoutIcon className="w-5 h-5 mr-3"/> Block User
                          </button>
                          )}
                           <button onClick={() => { handleLeaveConversation(); setHeaderMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600">
                               <LogoutIcon className="w-5 h-5 mr-3"/> Leave Conversation
                          </button>
                      </div>
                  </div>
              )}
            </div>
          </div>
          )}
        </header>
        
        {pinnedMessage && (
            <div className="p-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm flex-shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                    <PinIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <div className="truncate">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Pinned: </span>
                        <span className="text-slate-600 dark:text-slate-300">{pinnedMessage.text}</span>
                    </div>
                </div>
                <button onClick={() => onPinMessage(pinnedMessage.id)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        )}

        <div className="flex-1 p-6 overflow-y-auto no-scrollbar bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/95 dark:via-slate-900 dark:to-purple-900/95">
          <div className="space-y-6">
            {filteredMessages.map(msg => (
              <MessageItem
                key={msg.id}
                message={msg}
                isCurrentUser={msg.senderId === currentUser.id}
                sender={allUsers.find(u => u.id === msg.senderId)}
                onDelete={() => onDeleteMessage(chat.id, msg.id)}
                onViewProfile={onViewProfile}
                isBlocked={chat.isBlocked}
                chatParticipants={chatParticipants}
                onForwardRequest={onForwardRequest}
                onPinMessage={onPinMessage}
                onVote={(optionId) => onVote(msg.id, optionId)}
                currentUser={currentUser}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <footer className="p-4 pt-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 relative">
          {showMentions && (
            <div ref={mentionsRef} className="absolute bottom-full left-0 right-0 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-t-lg shadow-lg">
                <p className="text-xs font-semibold text-slate-500 px-2 pb-1">Mention a user</p>
                <div className="max-h-40 overflow-y-auto">
                    {mentionSuggestions.map(user => (
                        <button key={user.id} onClick={() => handleMentionSelect(user)} className="flex items-center w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full"/>
                            <span className="ml-2 font-semibold">{user.name}</span>
                        </button>
                    ))}
                </div>
            </div>
          )}
          {chat.isBlocked ? (
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 p-2 bg-slate-100 dark:bg-slate-700 rounded-full">
              You can no longer reply to this conversation.
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="relative" ref={attachmentMenuRef}>
                 <Button variant="ghost" className="p-2 rounded-full" onClick={() => setAttachmentMenuOpen(p => !p)}>
                    <PaperclipIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                 </Button>
                 {isAttachmentMenuOpen && <AttachmentMenu 
                    onPollClick={() => { setCreatePollModalOpen(true); setAttachmentMenuOpen(false); }}
                    onGifClick={() => { setGifPickerOpen(true); setAttachmentMenuOpen(false); }}
                    onFileChange={handleFileSelect}
                 />}
                 <div ref={gifPickerRef}>
                    {isGifPickerOpen && <GifPicker onGifSelect={handleGifSelect} />}
                 </div>
              </div>
              <div className="relative" ref={emojiPickerRef}>
                  <Button variant="ghost" className="p-2 rounded-full" onClick={() => setEmojiPickerOpen(prev => !prev)}>
                    <SmileIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                  </Button>
                  {isEmojiPickerOpen && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={handleMessageChange}
                onKeyPress={e => e.key === 'Enter' && handleSendTextMessage()}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />
              <Button 
                    variant="ghost"
                    onClick={handleSendTextMessage} 
                    className="rounded-full !p-3 text-white bg-gradient-button disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg"
                    disabled={!message.trim()}
                >
                    <SendIcon className="w-6 h-6" />
                </Button>
            </div>
          )}
        </footer>
      </div>
      <AddMembersModal
        isOpen={isAddMembersModalOpen}
        onClose={() => setAddMembersModalOpen(false)}
        chat={chat}
        allUsers={allUsers}
        onAddMembers={handleAddMembers}
       />
       <CreatePollModal 
         isOpen={isCreatePollModalOpen}
         onClose={() => setCreatePollModalOpen(false)}
         onCreatePoll={handleCreatePoll}
       />
    </>
  );
};

export default ChatWindow;