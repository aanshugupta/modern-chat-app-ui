import React from 'react';
import { User } from '../../types';
import Modal from '../common/Modal';
import { HeartIcon } from '../icons/Icons';
import Button from '../common/Button';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
  onLikeProfile: (userId: string) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onLikeProfile }) => {
  if (!user) return null;

  const handleLike = () => {
      onLikeProfile(user.id);
  }

  return (
    <Modal isOpen={!!user} onClose={onClose} title="User Profile">
      <div className="flex flex-col items-center pb-6">
        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-300 dark:ring-indigo-700" />
        <div className="text-center mt-4">
            <h3 className="text-2xl font-bold">{user.name}</h3>
            <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
         <div className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full capitalize mt-2">
            {user.role}
        </div>
        <div className="flex items-center gap-4 mt-4">
            <div className="text-center">
                <p className="font-bold text-xl">{user.likes || 0}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Likes</p>
            </div>
            <Button variant="ghost" className="!px-3 !py-2" onClick={handleLike}>
                <HeartIcon className="w-6 h-6 text-red-500" />
                <span className="ml-2">Like</span>
            </Button>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        {user.about && (
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">About</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">{user.about}</p>
            </div>
        )}

        {user.music && (
             <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Listening to</h4>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
                    <img src={user.music.albumArt} alt="Album art" className="w-12 h-12 rounded-md" />
                    <div>
                        <p className="font-semibold">{user.music.song}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.music.artist}</p>
                    </div>
                </div>
            </div>
        )}

        {user.notes && user.notes.length > 0 && (
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes</h4>
                <ul className="space-y-1 list-disc list-inside text-sm text-slate-600 dark:text-slate-400">
                    {user.notes.map((note, index) => <li key={index}>{note}</li>)}
                </ul>
            </div>
        )}
      </div>
    </Modal>
  );
};

export default UserProfileModal;