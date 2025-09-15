import React, { useState, useEffect, useCallback } from 'react';
import { Status, User } from '../../types';
import { XIcon, SendIcon, HeartIcon } from '../icons/Icons';
import Button from '../common/Button';


interface StatusViewerProps {
    user: User;
    currentUser: User;
    statuses: Status[];
    onClose: () => void;
    onView: (statusId: string) => void;
    onReply: (userId: string, replyText: string) => void;
    onReact: (statusId: string, emoji: string) => void;
}

const STATUS_DURATION = 5000; // 5 seconds per status

const StatusViewer: React.FC<StatusViewerProps> = ({ user, currentUser, statuses, onClose, onView, onReply, onReact }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [reply, setReply] = useState('');
    const [showHeart, setShowHeart] = useState(false);

    const goToNext = useCallback(() => {
        if (currentIndex < statuses.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose();
        }
    }, [currentIndex, statuses.length, onClose]);

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };
    
    useEffect(() => {
        setCurrentIndex(0);
    }, [user.id]);

    useEffect(() => {
        const currentStatus = statuses[currentIndex];
        if (currentStatus) {
            onView(currentStatus.id);
        }

        setProgress(0);
        const progressInterval = setInterval(() => {
            setProgress(p => p + 100 / (STATUS_DURATION / 100));
        }, 100);

        const timer = setTimeout(goToNext, STATUS_DURATION);
        
        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [currentIndex, statuses, onView, goToNext]);


    const currentStatus = statuses[currentIndex];
    if (!currentStatus) {
        onClose();
        return null;
    }

    const handleNavigationClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = e;
        const { left, width } = currentTarget.getBoundingClientRect();
        if (clientX - left < width / 3) {
            goToPrev();
        } else {
            goToNext();
        }
    }
    
    const handleSendReply = () => {
        if (reply.trim()) {
            onReply(user.id, reply.trim());
            setReply('');
        }
    };

    const handleReact = (emoji: string) => {
        onReact(currentStatus.id, emoji);
    };
    
    const handleDoubleClick = () => {
        handleReact('❤️');
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
    };

    const userReaction = currentStatus.reactions.find(r => r.userId === currentUser.id)?.emoji;
    
    const reactionCounts = currentStatus.reactions.reduce((acc, reaction) => {
        acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative w-full h-full max-w-sm max-h-[90vh] bg-slate-800 rounded-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Progress Bars & Header */}
                <div className="absolute top-0 left-0 right-0 p-3 z-10 bg-gradient-to-b from-black/50 to-transparent">
                    <div className="flex gap-1">
                        {statuses.map((_, index) => (
                            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                                <div 
                                    className="h-full bg-white rounded-full transition-all duration-100 linear"
                                    style={{ width: `${index < currentIndex ? 100 : (index === currentIndex ? progress : 0)}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full"/>
                            <div>
                                <p className="font-semibold text-white">{user.name}</p>
                                <p className="text-xs text-slate-300">
                                    {new Date(currentStatus.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white p-2 bg-black/30 rounded-full">
                            <XIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center pt-20 pb-20 relative" onDoubleClick={handleDoubleClick}>
                    {currentStatus.type === 'image' && (
                        <img src={currentStatus.content} alt="status" className="max-w-full max-h-full object-contain" />
                    )}
                    {currentStatus.type === 'text' && (
                        <div className="p-8 text-white text-3xl font-bold text-center bg-gradient-to-br from-indigo-500 to-purple-600 h-full w-full flex items-center justify-center">
                           <p style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>{currentStatus.content}</p>
                        </div>
                    )}
                    {showHeart && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Fix: Wrapped HeartIcon in a div to apply the style prop without causing a type error. */}
                            <div className="opacity-0 animate-heart-pop" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>
                                <HeartIcon filled className="w-32 h-32 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                 {/* Navigation Overlay */}
                <div 
                    className="absolute inset-0 flex"
                    onClick={handleNavigationClick}
                >
                    <div className="w-1/3 h-full cursor-pointer"></div>
                    <div className="w-2/3 h-full cursor-pointer"></div>
                </div>
                
                {/* Reply Bar */}
                <div 
                    className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/60 to-transparent"
                    onClick={e => e.stopPropagation()}
                >
                    {Object.keys(reactionCounts).length > 0 && (
                        <div className="flex items-center justify-start gap-2 p-2 mb-2 bg-black/30 rounded-full max-w-max backdrop-blur-sm">
                            {Object.entries(reactionCounts).map(([emoji, count]) => (
                                <span key={emoji} className="text-white text-sm flex items-center">{emoji} <span className="ml-1 font-bold">{count}</span></span>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        {['❤️', '😂', '🔥', '👍', '😢'].map(emoji => (
                            <button 
                                key={emoji} 
                                onClick={() => handleReact(emoji)}
                                className={`text-4xl hover:scale-125 transition-transform duration-200 ${userReaction === emoji ? 'scale-125' : ''}`} 
                                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                                {emoji}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            placeholder={`Reply to ${user.name}...`}
                            className="w-full bg-black/40 text-white rounded-full px-4 py-2 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white"
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSendReply()}
                        />
                        <Button onClick={handleSendReply} className="rounded-full !px-3 !py-3" disabled={!reply.trim()}>
                            <SendIcon className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusViewer;