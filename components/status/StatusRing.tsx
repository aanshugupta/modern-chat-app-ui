import React from 'react';

interface StatusRingProps {
    imgUrl: string;
    hasUnread: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const StatusRing: React.FC<StatusRingProps> = ({ imgUrl, hasUnread, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 p-0.5',
        md: 'w-10 h-10 p-0.5',
        lg: 'w-14 h-14 p-1',
    };
    const ringColor = hasUnread 
        ? 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600' 
        : 'bg-slate-300 dark:bg-slate-600';
    
    return (
        <div className={`rounded-full ${ringColor} ${sizeClasses[size]} flex-shrink-0`}>
            <div className="bg-white dark:bg-slate-800 p-0.5 rounded-full">
                <img src={imgUrl} className="w-full h-full rounded-full object-cover" alt="status" />
            </div>
        </div>
    );
};

export default StatusRing;
