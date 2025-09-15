import React from 'react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
    { id: 1, user: 'Sam Smith', avatar: 'https://picsum.photos/seed/sam/100/100', action: 'reacted with 👍 to your message:', message: '"Going great. Almost..."', time: '2 hours ago' },
    { id: 2, user: 'Jordan Lee', avatar: 'https://picsum.photos/seed/jordan/100/100', action: 'mentioned you in', message: '#Project Team', time: 'Yesterday' },
    { id: 3, user: 'Taylor Green', avatar: 'https://picsum.photos/seed/taylor/100/100', action: 'sent a message in', message: '#Project Team', time: '3 days ago' },
];

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 border border-slate-200 dark:border-slate-700">
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-lg">Notifications</h3>
      </div>
      <div className="py-1 max-h-96 overflow-y-auto">
        {notifications.map(n => (
            <div key={n.id} className="flex items-start p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer">
                <img src={n.avatar} alt={n.user} className="w-9 h-9 rounded-full mr-3 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-sm">
                        <strong className="font-semibold">{n.user}</strong> {n.action} <span className="font-medium text-indigo-600 dark:text-indigo-400">{n.message}</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.time}</p>
                </div>
            </div>
        ))}
        {notifications.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-4">No new notifications.</p>
        )}
      </div>
       <div className="p-2 border-t border-slate-200 dark:border-slate-700 text-center">
        <button className="text-sm font-semibold text-indigo-600 hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
