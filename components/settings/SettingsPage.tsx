import React, { useContext, useState } from 'react';
import { User } from '../../types';
import { AppContext } from '../../App';
import { MessageSquareIcon, BellIcon, CogIcon, LockIcon, HelpCircleIcon, ArrowLeftIcon, SunIcon, MoonIcon, BookmarkIcon, PaletteIcon } from '../icons/Icons';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onProfileClick: () => void;
  onAdminClick: () => void;
  onHelpClick: () => void;
  onSavedMessagesClick: () => void;
}

// A simple styled toggle switch
const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <label className="flex items-center justify-between w-full cursor-pointer">
        <span className="text-slate-700 dark:text-slate-300">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
        </div>
    </label>
);

const SettingsListItem: React.FC<{ icon: React.ReactNode; label: string; sublabel?: string; onClick?: () => void, children?: React.ReactNode }> = ({ icon, label, sublabel, onClick, children }) => (
  <button onClick={onClick} className="flex items-center w-full p-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg">
    <div className="text-slate-500 dark:text-slate-400">{icon}</div>
    <div className="ml-4 flex-1">
        <p className="font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        {sublabel && <p className="text-sm text-slate-500 dark:text-slate-400">{sublabel}</p>}
    </div>
    {children}
  </button>
);


const SettingsPage: React.FC<SettingsPageProps> = ({ isOpen, onClose, user, onProfileClick, onAdminClick, onHelpClick, onSavedMessagesClick }) => {
  const { darkMode, toggleDarkMode } = useContext(AppContext);
  const [showPreviews, setShowPreviews] = useState(true);
  const [inAppSounds, setInAppSounds] = useState(false);
  const [groupNotifications, setGroupNotifications] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-100 dark:bg-slate-900 z-40 flex flex-col animate-fade-in">
      <header className="flex items-center p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex-shrink-0">
         <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 mr-4">
           <ArrowLeftIcon className="w-6 h-6" />
         </button>
         <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Profile Section */}
        <div 
            className="flex items-center p-4 rounded-lg cursor-pointer bg-white dark:bg-slate-800 shadow-sm"
            onClick={onProfileClick}
        >
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
          <div className="ml-4">
            <p className="font-bold text-xl">{user.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.about || 'View and edit your profile'}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-2 space-y-1">
            <SettingsListItem icon={<BookmarkIcon className="w-6 h-6"/>} label="Saved Messages" sublabel="Your personal cloud storage" onClick={onSavedMessagesClick} />
        </div>

        {/* Settings List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-2 space-y-1">
           <h3 className="font-bold px-3 pt-2 text-indigo-600 dark:text-indigo-400">CHATS</h3>
           <SettingsListItem icon={<PaletteIcon className="w-6 h-6"/>} label="Theme">
               <div className="flex items-center gap-2">
                   <button onClick={toggleDarkMode} className={`p-2 rounded-full ${!darkMode ? 'bg-indigo-100 dark:bg-indigo-800 ring-2 ring-indigo-500' : ''}`}><SunIcon className="w-5 h-5"/></button>
                   <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? 'bg-indigo-100 dark:bg-indigo-800 ring-2 ring-indigo-500' : ''}`}><MoonIcon className="w-5 h-5"/></button>
               </div>
           </SettingsListItem>
           <SettingsListItem icon={<MessageSquareIcon className="w-6 h-6"/>} label="Chat Settings" onClick={() => alert('Chat settings coming soon!')}/>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-2 space-y-1">
            <h3 className="font-bold px-3 pt-2 text-indigo-600 dark:text-indigo-400">NOTIFICATIONS</h3>
            <div className="p-3">
                <ToggleSwitch label="Show Previews" enabled={showPreviews} onChange={setShowPreviews} />
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                <ToggleSwitch label="In-App Sounds" enabled={inAppSounds} onChange={setInAppSounds} />
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                <ToggleSwitch label="Group Notifications" enabled={groupNotifications} onChange={setGroupNotifications} />
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-2 space-y-1">
           <SettingsListItem icon={<LockIcon className="w-6 h-6"/>} label="Account and Privacy" onClick={onProfileClick} />
           {user.role === 'admin' && (
             <SettingsListItem icon={<CogIcon className="w-6 h-6"/>} label="Admin Dashboard" onClick={onAdminClick}/>
           )}
           <SettingsListItem icon={<HelpCircleIcon className="w-6 h-6"/>} label="Help & Support" onClick={onHelpClick}/>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="p-6 text-center text-slate-500 dark:text-slate-400">
        <p className="font-mono text-sm">from</p>
        <p className="font-bold text-lg tracking-widest text-slate-700 dark:text-slate-300">META</p>
      </footer>
    </div>
  );
};

export default SettingsPage;