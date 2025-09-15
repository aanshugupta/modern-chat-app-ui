import { useState, useCallback, useEffect } from 'react';
import { User, Chat, Message, Status } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const AI_USER_ID = 'meta-ai';

const metaAIAvatarSvg = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="meta-avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2193b0;" />
      <stop offset="100%" style="stop-color:#d43bff;" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="45" stroke="url(#meta-avatar-grad)" stroke-width="10" fill="none" />
</svg>
`;

const metaAIAvatar = `data:image/svg+xml;base64,${btoa(metaAIAvatarSvg)}`;


// Kept for mock login screen functionality
export const initialUsers: User[] = [
  { id: 'user-1', name: 'Aanshu Gupta', avatar: 'https://picsum.photos/seed/alex/100/100', email: 'aanshu@example.com', role: 'admin', about: 'Frontend developer and hiking enthusiast.', notes: ['Remember to check out the new design system.', 'Pick up groceries on the way home.'], music: { artist: 'Tame Impala', song: 'The Less I Know The Better', albumArt: 'https://picsum.photos/seed/tame-impala/100/100' }, likes: 128, status: 'online', lastSeen: Date.now() },
  { id: 'user-2', name: 'Sam Smith', avatar: 'https://picsum.photos/seed/sam/100/100', email: 'sam@example.com', role: 'user', about: 'Loves dogs and long walks on the beach.', notes: [], music: null, likes: 42, status: 'offline', lastSeen: Date.now() - 1000 * 60 * 30 },
  { id: 'user-3', name: 'Jordan Lee', avatar: 'https://picsum.photos/seed/jordan/100/100', email: 'jordan@example.com', role: 'user', about: 'Coffee connoisseur.', notes: ['Schedule team meeting.'], music: { artist: 'Daft Punk', song: 'Around the World', albumArt: 'https://picsum.photos/seed/daft-punk/100/100' }, likes: 73, status: 'online', lastSeen: Date.now() },
  { id: 'user-4', name: 'Taylor Green', avatar: 'https://picsum.photos/seed/taylor/100/100', email: 'taylor@example.com', role: 'user', about: 'Just here for the memes.', notes: [], music: null, likes: 12, status: 'offline', lastSeen: Date.now() - 1000 * 60 * 60 * 2 },
  { id: AI_USER_ID, name: 'Meta AI', avatar: metaAIAvatar, email: 'ai@example.com', role: 'user', about: "My name is Meta AI. Think of me like an assistant who's here to help you learn, plan, and connect. What can I help you with today?", notes: [], music: null, likes: 999, status: 'online', lastSeen: Date.now() },
  { id: 'user-5', name: 'Casey Becker', avatar: 'https://picsum.photos/seed/casey/100/100', email: 'casey@example.com', role: 'user', about: 'Bookworm and aspiring writer.', notes: [], music: null, likes: 25, status: 'online', lastSeen: Date.now() },
  { id: 'user-6', name: 'Morgan Yu', avatar: 'https://picsum.photos/seed/morgan/100/100', email: 'morgan@example.com', role: 'user', about: 'Scientist at TranStar.', notes: [], music: { artist: 'Mick Gordon', song: 'Everything Is Going to Be Okay', albumArt: 'https://picsum.photos/seed/prey/100/100' }, likes: 88, status: 'offline', lastSeen: Date.now() - 1000 * 60 * 60 * 5 },
  { id: 'user-7', name: 'Riley Jones', avatar: 'https://picsum.photos/seed/riley/100/100', email: 'riley@example.com', role: 'user', about: 'Traveling the world.', notes: [], music: null, likes: 150, status: 'online', lastSeen: Date.now() },
  { id: 'user-8', name: 'Pat Garcia', avatar: 'https://picsum.photos/seed/pat/100/100', email: 'pat@example.com', role: 'user', about: 'Musician and producer.', notes: [], music: null, likes: 61, status: 'offline', lastSeen: Date.now() - 1000 * 60 * 60 * 24 },
  { id: 'user-9', name: 'Jessie Chen', avatar: 'https://picsum.photos/seed/jessie/100/100', email: 'jessie@example.com', role: 'user', about: 'Graphic designer.', notes: [], music: null, likes: 49, status: 'online', lastSeen: Date.now() },
  { id: 'user-10', name: 'Chris Williams', avatar: 'https://picsum.photos/seed/chris/100/100', email: 'chris@example.com', role: 'user', about: 'Gamer and streamer.', notes: [], music: null, likes: 201, status: 'online', lastSeen: Date.now() },
  { id: 'user-11', name: 'Dana Scully', avatar: 'https://picsum.photos/seed/scully/100/100', email: 'scully@example.com', role: 'user', about: 'FBI Special Agent.', notes: [], music: null, likes: 112, status: 'offline', lastSeen: Date.now() - 1000 * 60 * 60 * 8 },
];

const initialChats: Chat[] = [
    {
      id: 'chat-saved',
      type: 'direct',
      participants: ['user-1'],
      messages: [
          { id: 'msg-saved-1', senderId: 'system', text: 'This is your personal space. Use it for notes, reminders, or to save messages.', timestamp: Date.now() - 1000 * 60 * 60 * 24, isRead: true },
          { id: 'msg-saved-2', senderId: 'user-1', text: 'Don\'t forget to buy milk!', timestamp: Date.now() - 1000 * 60 * 5, isRead: true },
      ],
      isPinned: true,
    },
    {
      id: 'chat-1',
      type: 'direct',
      participants: ['user-1', 'user-2'],
      messages: [
        { id: 'msg-1', senderId: 'user-2', text: 'Hey Alex! How is it going?', timestamp: Date.now() - 1000 * 60 * 60 * 2, isRead: true },
        { id: 'msg-2', senderId: 'user-1', text: 'Hey Sam! Going great. Almost done with the new feature.', timestamp: Date.now() - 1000 * 60 * 60 * 1, isRead: true },
      ],
      isPinned: true,
    },
    {
      id: 'chat-2',
      type: 'group',
      name: 'Project Team',
      participants: ['user-1', 'user-3', 'user-4'],
      adminIds: ['user-1'],
      description: 'A team for the new project launch. All project related discussions happen here.',
      avatar: 'https://picsum.photos/seed/project/100/100',
      messages: [
        { id: 'msg-3', senderId: 'user-3', text: 'Team, let\'s sync up at 3 PM today. @Aanshu Gupta can you share the link?', timestamp: Date.now() - 1000 * 60 * 30, isRead: true },
        { id: 'msg-4', senderId: 'user-1', text: 'Sounds good, Jordan.', timestamp: Date.now() - 1000 * 60 * 28, isRead: false },
        {
            id: 'msg-poll-1',
            senderId: 'user-1',
            text: '', // Polls might not have text
            timestamp: Date.now() - 1000 * 60 * 15,
            isRead: true,
            poll: {
              question: 'What should be our focus for next sprint?',
              options: [
                { id: 'opt-1', text: 'UI Polish', votes: ['user-3'] },
                { id: 'opt-2', text: 'New Feature X', votes: ['user-4'] },
                { id: 'opt-3', text: 'Bug Fixes', votes: [] },
              ],
            },
        },
        {
            id: 'msg-gif-1',
            senderId: 'user-4',
            text: '',
            timestamp: Date.now() - 1000 * 60 * 10,
            isRead: false,
            attachment: {
              type: 'gif',
              url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3dnd3NlYjA2bW55eWY2ajI4bmF2aGcyNzhpcjNkaDNsNmQ2ZndzciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif',
            },
        },
      ],
    },
    {
      id: 'chat-3',
      type: 'direct',
      participants: ['user-1', 'meta-ai'],
      messages: [
          { id: 'msg-5', senderId: 'user-1', text: 'What is the capital of France?', timestamp: Date.now() - 1000 * 60 * 5, isRead: true },
          { id: 'msg-6', senderId: 'meta-ai', text: 'The capital of France is Paris.', timestamp: Date.now() - 1000 * 60 * 4, isRead: true },
          { id: 'msg-7', senderId: 'meta-ai', text: '```js\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```', timestamp: Date.now() - 1000 * 60 * 3, isRead: true },
      ]
    },
  ];

const initialStatuses: Status[] = [
    { id: 'status-1', userId: 'user-2', type: 'image', content: 'https://picsum.photos/seed/status1/1080/1920', timestamp: Date.now() - 1000 * 60 * 60, viewers: [], reactions: [] },
    { id: 'status-2', userId: 'user-3', type: 'text', content: 'Just deployed the new feature! 🚀', timestamp: Date.now() - 1000 * 60 * 30, viewers: ['user-1'], reactions: [{userId: 'user-1', emoji: '🔥'}] },
]

export const useMockData = (currentUser: User | null) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [chats, setChats] = useState<Chat[]>(initialChats);
    const [statuses, setStatuses] = useState<Status[]>(initialStatuses);

    useEffect(() => {
        // Simulate other users changing their online status
        const interval = setInterval(() => {
            setUsers(prevUsers => prevUsers.map(u => {
                if (u.id === currentUser?.id || u.id === AI_USER_ID) return u; // Don't change current user or AI
                if (Math.random() < 0.2) { // 20% chance to toggle status
                    const newStatus = u.status === 'online' ? 'offline' : 'online';
                    return { ...u, status: newStatus, lastSeen: newStatus === 'offline' ? Date.now() : u.lastSeen };
                }
                return u;
            }));
        }, 15000); // every 15 seconds

        return () => clearInterval(interval);
    }, [currentUser]);

    const addMessage = useCallback((chatId: string, message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
        if (!currentUser && chatId !== 'chat-saved') return;
        
        const senderId = message.senderId === 'system' ? 'system' : currentUser!.id;

        const newMessage: Message = {
            ...message,
            senderId: senderId,
            id: generateId(),
            timestamp: Date.now(),
            isRead: false,
        };
    
        setChats(prev => prev.map(c => 
            c.id === chatId 
            ? { ...c, messages: [...c.messages, newMessage] } 
            : c
        ));
    }, [currentUser]);

    const updateUser = useCallback((updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }, []);

    const addChat = useCallback((chatData: Omit<Chat, 'id'|'messages'>, callback: (newChat: Chat) => void) => {
        const newChat: Chat = {
            ...chatData,
            id: generateId(),
            messages: [],
            ...(chatData.type === 'group' && { adminIds: [currentUser!.id] })
        };
        setChats(prev => [newChat, ...prev]);
        callback(newChat);
    }, [currentUser]);

    const deleteChat = useCallback((chatId: string) => {
        setChats(prev => prev.filter(c => c.id !== chatId));
    }, []);

    const findOrCreateDirectChat = useCallback((otherUserId: string, callback: (chat: Chat) => void) => {
      if (!currentUser) return;
      const existingChat = chats.find(c => 
          c.type === 'direct' && 
          c.participants.length === 2 &&
          c.participants.includes(currentUser.id) && 
          c.participants.includes(otherUserId)
      );
  
      if (existingChat) {
          callback(existingChat);
      } else {
          addChat({
              type: 'direct',
              participants: [currentUser.id, otherUserId],
          }, callback);
      }
    }, [chats, currentUser, addChat]);

    const markMessagesAsRead = useCallback((chatId: string, userId: string) => {
        setChats(prev => prev.map(c => {
            if (c.id !== chatId) return c;
            return {
                ...c,
                messages: c.messages.map(m => {
                    if (m.senderId !== userId && !m.isRead) {
                        return { ...m, isRead: true };
                    }
                    return m;
                })
            };
        }));
    }, []);
    
    const addMembersToGroup = useCallback((chatId: string, newUserIds: string[], addedByUserId: string) => {
        const chat = chats.find(c => c.id === chatId);
        if (!chat || chat.type !== 'group' || !chat.adminIds?.includes(addedByUserId)) {
            alert("Only admins can add members.");
            return;
        }

        const adder = users.find(u => u.id === addedByUserId);
        const addedUsers = users.filter(u => newUserIds.includes(u.id));

        if (!adder || addedUsers.length === 0) return;
        
        const addedUserNames = addedUsers.map(u => u.name).join(', ');
        const messageText = `${adder.name} added ${addedUserNames} to the group.`;
        const systemMessage: Message = {
            id: generateId(), senderId: 'system', text: messageText,
            timestamp: Date.now(), isRead: false
        };

        setChats(prev => prev.map(c => 
            c.id === chatId 
            ? { 
                ...c, 
                participants: [...new Set([...c.participants, ...newUserIds])],
                messages: [...c.messages, systemMessage]
              } 
            : c
        ));
    }, [users, chats]);

    const togglePinChat = useCallback((chatId: string) => {
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c));
    }, []);
    
    const toggleMuteChat = useCallback((chatId: string) => {
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, isMuted: !c.isMuted } : c));
    }, []);
    
    const updateGroupDetails = useCallback((chatId: string, details: { name?: string, description?: string }, byUserId: string) => {
        setChats(prev => prev.map(c => {
            if (c.id !== chatId || c.type !== 'group' || !c.adminIds?.includes(byUserId)) {
                if (c.id === chatId) alert("Only admins can update group details.");
                return c;
            }
            const user = users.find(u => u.id === byUserId);
            const messages: Message[] = [];
            if(details.name && details.name !== c.name) {
                 messages.push({
                    id: generateId(), senderId: 'system', text: `${user?.name} renamed the group to "${details.name}".`,
                    timestamp: Date.now(), isRead: false,
                 });
            }
            if(details.description !== undefined && details.description !== c.description) {
                messages.push({
                    id: generateId(), senderId: 'system', text: `${user?.name} updated the group description.`,
                    timestamp: Date.now(), isRead: false,
                });
            }
            return { ...c, ...details, messages: [...c.messages, ...messages] };
        }));
    }, [users]);
    
    const blockChat = useCallback((chatId: string, currentUserId: string) => {
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return;
    
        let messageText = '';
        if (chat.type === 'direct') {
            const otherUserId = chat.participants.find(p => p !== currentUserId);
            const otherUser = users.find(u => u.id === otherUserId);
            if (!otherUser) return;
            messageText = `You blocked ${otherUser.name}.`;
        } else { // Group chat
            messageText = `You blocked the group "${chat.name}". You can no longer send messages.`;
        }
        
        const systemMessage: Message = {
            id: generateId(), senderId: 'system', text: messageText,
            timestamp: Date.now(), isRead: false,
        };
        setChats(prev => prev.map(c => 
            c.id === chatId 
            ? { ...c, isBlocked: true, messages: [...c.messages, systemMessage] } 
            : c
        ));
    }, [users, chats]);
    
    const likeUserProfile = useCallback((userId: string) => {
        setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, likes: (u.likes || 0) + 1 } : u
        ));
    }, []);

    const deleteMessage = useCallback((chatId: string, messageId: string) => {
        setChats(prev => prev.map(c => {
            if (c.id !== chatId) return c;
            return {
                ...c,
                messages: c.messages.map(m => {
                    if (m.id !== messageId) return m;
                    return { ...m, isDeleted: true, text: 'This message was deleted' };
                })
            };
        }));
    }, []);

    const forwardMessage = useCallback((messageToForward: Message, targetChatIds: string[]) => {
      if (!currentUser) return;
      
      const forwardedMessageContent: Omit<Message, 'id' | 'timestamp' | 'isRead'> = {
          senderId: currentUser.id,
          text: messageToForward.text,
          isForwarded: true,
          attachment: messageToForward.attachment,
          poll: messageToForward.poll,
      };

      targetChatIds.forEach(chatId => {
          addMessage(chatId, forwardedMessageContent);
      });
    }, [currentUser, addMessage]);

    const togglePinMessage = useCallback((chatId: string, messageId: string) => {
      setChats(prev => prev.map(c => {
          if (c.id !== chatId) return c;
          
          const messageText = c.pinnedMessageId === messageId ? 'unpinned a message' : 'pinned a message';
          const user = users.find(u => u.id === currentUser?.id);
          const systemMessage: Message = {
            id: generateId(), senderId: 'system', text: `${user?.name || 'Someone'} ${messageText}.`,
            timestamp: Date.now(), isRead: false,
          };

          return {
              ...c,
              pinnedMessageId: c.pinnedMessageId === messageId ? undefined : messageId,
              messages: [...c.messages, systemMessage]
          };
      }));
    }, [users, currentUser]);
    
    const addStatus = useCallback((status: Omit<Status, 'id' | 'viewers' | 'reactions'>) => {
        const newStatus: Status = {
            ...status,
            id: generateId(),
            viewers: [],
            reactions: [],
        };
        setStatuses(prev => [newStatus, ...prev]);
    }, []);

    const markStatusAsViewed = useCallback((statusId: string, viewerId: string) => {
        setStatuses(prev => prev.map(s => 
            s.id === statusId && !s.viewers.includes(viewerId)
            ? { ...s, viewers: [...s.viewers, viewerId] }
            : s
        ));
    }, []);

    const addReactionToStatus = useCallback((statusId: string, userId: string, emoji: string) => {
        setStatuses(prev => prev.map(s => {
            if (s.id !== statusId) return s;
    
            const existingReactionIndex = s.reactions.findIndex(r => r.userId === userId);
            
            if (existingReactionIndex > -1) {
                const existingReaction = s.reactions[existingReactionIndex];
                // If same emoji, remove reaction (undo)
                if (existingReaction.emoji === emoji) {
                    const newReactions = [...s.reactions];
                    newReactions.splice(existingReactionIndex, 1);
                    return { ...s, reactions: newReactions };
                } else {
                    // If different emoji, update reaction
                    const newReactions = [...s.reactions];
                    newReactions[existingReactionIndex] = { userId, emoji };
                    return { ...s, reactions: newReactions };
                }
            } else {
                // No existing reaction from this user, add new one
                return { ...s, reactions: [...s.reactions, { userId, emoji }] };
            }
        }));
    }, []);
    
    const removeUserFromGroup = useCallback((chatId: string, userIdToRemove: string, removedByUserId: string) => {
        const chat = chats.find(c => c.id === chatId);
        if (!chat || chat.type !== 'group' || !chat.adminIds?.includes(removedByUserId)) {
            alert("Only admins can remove members.");
            return;
        }

        const remover = users.find(u => u.id === removedByUserId);
        const removedUser = users.find(u => u.id === userIdToRemove);
        if(!remover || !removedUser) return;
        
        const messageText = `${remover.name} removed ${removedUser.name} from the group.`;
        const systemMessage: Message = {
            id: generateId(), senderId: 'system', text: messageText,
            timestamp: Date.now(), isRead: false,
        };

        setChats(prev => prev.map(c => 
            c.id === chatId 
            ? { 
                ...c, 
                participants: c.participants.filter(pId => pId !== userIdToRemove),
                adminIds: c.adminIds?.filter(aId => aId !== userIdToRemove),
                messages: [...c.messages, systemMessage]
              } 
            : c
        ));
    }, [users, chats]);

    const handleVote = useCallback((chatId: string, messageId: string, optionId: string, userId: string) => {
      setChats(prev => prev.map(c => {
          if (c.id !== chatId) return c;
          return {
              ...c,
              messages: c.messages.map(m => {
                  if (m.id !== messageId || !m.poll) return m;
                  
                  const newPoll = JSON.parse(JSON.stringify(m.poll)); // Deep copy
                  
                  // User can only vote for one option. Remove previous votes by this user.
                  let alreadyVotedOnThisOption = false;
                  newPoll.options.forEach((opt: any) => {
                      const userVoteIndex = opt.votes.indexOf(userId);
                      if (opt.id === optionId && userVoteIndex !== -1) {
                          alreadyVotedOnThisOption = true;
                      }
                      if (userVoteIndex !== -1) {
                          opt.votes.splice(userVoteIndex, 1);
                      }
                  });

                  // If they didn't already vote on this option, add their vote.
                  if (!alreadyVotedOnThisOption) {
                      const targetOption = newPoll.options.find((opt: any) => opt.id === optionId);
                      if (targetOption) {
                          targetOption.votes.push(userId);
                      }
                  }

                  return { ...m, poll: newPoll };
              })
          };
      }));
    }, []);

    const addUser = (user: User) => setUsers(prev => [...prev, user]);
    const removeUser = (userId: string) => setUsers(prev => prev.filter(u => u.id !== userId));

    return { users, chats, statuses, addMessage, addUser, removeUser, updateUser, generateId, addChat, markMessagesAsRead, addMembersToGroup, togglePinChat, updateGroupDetails, blockChat, likeUserProfile, deleteMessage, findOrCreateDirectChat, forwardMessage, togglePinMessage, deleteChat, addStatus, markStatusAsViewed, toggleMuteChat, removeUserFromGroup, handleVote, addReactionToStatus };
};

const cannedResponses = [
    "That's interesting!",
    "Haha, nice one.",
    "I agree.",
    "Let me think about that.",
    "Okay, sounds good.",
    "Got it, thanks!",
    "👍",
    "Can you explain that a bit more?",
    "I'll get back to you on that."
];

export const useChatSimulation = (
    currentUser: User | null,
    activeChat: Chat | null,
    allUsers: User[],
    addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void,
    markMessagesAsRead: (chatId: string, userId: string) => void,
    setTypingUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
    const lastMessage = activeChat ? activeChat.messages[activeChat.messages.length - 1] : null;

    useEffect(() => {
        if (!currentUser || !activeChat || !lastMessage || activeChat.isMuted) {
            return;
        }

        if (lastMessage.senderId !== currentUser.id || lastMessage.isRead) {
            return;
        }
        
        const otherParticipants = activeChat.participants
            .filter(pId => pId !== currentUser.id && pId !== 'meta-ai');

        const seenTimeout = setTimeout(() => {
            if(lastMessage) markMessagesAsRead(activeChat.id, currentUser.id);
        }, 2000 + Math.random() * 2000);

        let typingTimeout: number;
        const replyTimeout = setTimeout(() => {
            if (Math.random() < 0.7 && !lastMessage.poll && !lastMessage.attachment) {
                const replyingUser = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
                const replyingUserDetails = allUsers.find(u => u.id === replyingUser);

                if (replyingUserDetails) {
                    setTypingUsers(prev => [...prev.filter(u => u.id !== replyingUserDetails.id), replyingUserDetails]);
                    const typingDuration = 2000 + Math.random() * 3000;

                    typingTimeout = window.setTimeout(() => {
                        const responseText = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
                        addMessage(activeChat.id, {
                            senderId: replyingUser,
                            text: responseText,
                        });
                        setTypingUsers(prev => prev.filter(u => u.id !== replyingUserDetails.id));
                    }, typingDuration);
                }
            }
        }, 4000 + Math.random() * 3000);

        return () => {
            clearTimeout(seenTimeout);
            clearTimeout(replyTimeout);
            clearTimeout(typingTimeout);
            setTypingUsers([]);
        };
    }, [lastMessage?.id, activeChat?.isMuted]);
};