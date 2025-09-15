import React, { useState, useMemo } from 'react';
import { Message, User, PollData, Attachment } from '../../types';
// Fix: Corrected icon import. Removed non-existent 'FileIcon' and unused 'CircleDotIcon', and added 'PaperclipIcon' for file attachments.
import { ReplyIcon, CheckIcon, CheckCheckIcon, TrashIcon, ForwardIcon, PinIcon, SmilePlusIcon, PaperclipIcon } from '../icons/Icons';
import EmojiPicker from '../common/EmojiPicker';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  sender?: User;
  currentUser: User;
  onDelete: () => void;
  onViewProfile: (user: User) => void;
  isBlocked?: boolean;
  chatParticipants: User[];
  onForwardRequest: (message: Message) => void;
  onPinMessage: (messageId: string) => void;
  onVote: (optionId: string) => void;
}

const PollDisplay: React.FC<{ poll: PollData; onVote: (optionId: string) => void; currentUser: User }> = ({ poll, onVote, currentUser }) => {
    const totalVotes = useMemo(() => poll.options.reduce((sum, opt) => sum + opt.votes.length, 0), [poll]);
    const userVote = useMemo(() => poll.options.find(opt => opt.votes.includes(currentUser.id))?.id, [poll, currentUser.id]);
    
    return (
        <div className="mt-2 space-y-2">
            <p className="font-semibold">{poll.question}</p>
            {poll.options.map(option => {
                const voteCount = option.votes.length;
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                const isSelected = userVote === option.id;
                
                return (
                    <div key={option.id} className="relative cursor-pointer" onClick={() => onVote(option.id)}>
                        <div className={`p-2 border rounded-lg transition-all ${isSelected ? 'border-indigo-500 bg-indigo-500/20' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
                            <div className="absolute top-0 left-0 h-full bg-indigo-500/10 rounded-lg" style={{ width: `${percentage}%` }}></div>
                            <div className="relative flex justify-between items-center z-10">
                                <span className="font-medium text-sm">{option.text}</span>
                                <div className="flex items-center gap-2">
                                    {isSelected && <CheckIcon className="w-4 h-4 text-indigo-500" />}
                                    <span className="text-xs font-semibold">{voteCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
             <p className="text-xs text-slate-500 dark:text-slate-400">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
        </div>
    )
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const AttachmentDisplay: React.FC<{ attachment: Attachment }> = ({ attachment }) => {
    switch (attachment.type) {
        case 'image':
        case 'gif':
            return <img src={attachment.url} alt={attachment.name || 'attachment'} className="mt-2 rounded-lg max-w-xs max-h-64 object-cover" />;
        case 'file':
            return (
                <a href={attachment.url} download={attachment.name} className="mt-2 flex items-center gap-3 bg-slate-200 dark:bg-slate-600/50 p-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    {/* Fix: Replaced CircleDotIcon with the more appropriate PaperclipIcon for file attachments. */}
                    <PaperclipIcon className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold truncate">{attachment.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{attachment.size ? formatBytes(attachment.size) : ''}</p>
                    </div>
                </a>
            );
        default:
            return null;
    }
}

const highlightCode = (code: string) => {
    let highlighted = code;
    highlighted = highlighted.replace(/\b(const|let|var|function|return|if|else|for|while|import|from)\b/g, '<span class="text-indigo-400">$1</span>');
    highlighted = highlighted.replace(/('.*?'|".*?"|`.*?`)/g, '<span class="text-green-400">$1</span>');
    highlighted = highlighted.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500 italic">$1</span>');
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');
    highlighted = highlighted.replace(/(\w+)\s*\(/g, '<span class="text-yellow-400">$1</span>(');
    return <pre className="bg-slate-800/50 p-3 rounded-lg text-sm font-mono overflow-x-auto"><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser, sender, currentUser, onDelete, onViewProfile, isBlocked, chatParticipants, onForwardRequest, onPinMessage, onVote }) => {

  const renderTextMessageWithMentions = (text: string) => {
    const mentionRegex = /@([\w\s]+)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(mentionRegex)) {
        const userName = match[1];
        if (chatParticipants.some(p => p.name === userName)) {
            if (match.index! > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(<strong key={match.index} className="text-indigo-500 bg-indigo-500/20 px-1 rounded font-semibold">@{userName}</strong>);
            lastIndex = match.index! + match[0].length;
        }
    }
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    return <>{parts}</>;
  };
  
  const renderMessageBody = () => {
      if(message.isDeleted) {
        return <p className="italic text-slate-400 dark:text-slate-500">This message was deleted</p>
      }

      if (message.poll) {
          return <PollDisplay poll={message.poll} onVote={onVote} currentUser={currentUser} />
      }

      if (message.attachment) {
          return <AttachmentDisplay attachment={message.attachment} />
      }
      
      const codeBlockRegex = /```(js|javascript|bash|html|css)?\n([\s\S]*?)```/;
      const codeMatch = message.text.match(codeBlockRegex);

      return (
        <>
            {message.isForwarded && (
                <div className="flex items-center gap-1 text-xs opacity-80 mb-1">
                    <ForwardIcon className="w-3 h-3" />
                    <span>Forwarded message</span>
                </div>
            )}
            {codeMatch ? (
                highlightCode(codeMatch[2])
            ) : (
                renderTextMessageWithMentions(message.text)
            )}
        </>
      );
  };

  const renderStatusIcon = () => {
    if (!isCurrentUser) return null;
    if (message.isRead) {
        return <CheckCheckIcon className="w-5 h-5 text-blue-500" />;
    }
    return <CheckIcon className="w-5 h-5 text-slate-400" />;
  };
  
  if (message.senderId === 'system') {
      return (
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2 italic my-2">
              {message.text}
          </div>
      );
  }

  return (
    <div className={`group relative flex items-start gap-3 animate-fade-in ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      <button onClick={() => sender && onViewProfile(sender)} className="flex-shrink-0">
        <img src={sender?.avatar} alt={sender?.name} className="w-10 h-10 rounded-full" />
      </button>
      
      <div className={`flex flex-col max-w-lg ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className={`p-3 rounded-2xl relative shadow-md ${isCurrentUser ? 'bg-gradient-sent text-white' : 'bg-white dark:bg-slate-700'}`}>
          {!isCurrentUser && sender && !message.isDeleted && <p className="font-semibold text-sm mb-1 text-indigo-500 dark:text-indigo-400">{sender.name}</p>}
          {renderMessageBody()}
        </div>
        <div className={`flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isCurrentUser && renderStatusIcon()}
        </div>
      </div>
      
      {!isBlocked && !message.isDeleted && (
        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isCurrentUser ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'}`}>
            <button onClick={() => onPinMessage(message.id)} className="p-1.5 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 shadow-md">
                <PinIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
            <button onClick={() => onForwardRequest(message)} className="p-1.5 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 shadow-md">
                <ForwardIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
            {isCurrentUser && (
                <button onClick={onDelete} className="p-1.5 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 shadow-md">
                    <TrashIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
                </button>
            )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;