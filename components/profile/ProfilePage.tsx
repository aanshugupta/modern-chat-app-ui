import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { CameraIcon } from '../icons/Icons';

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isOpen, onClose, user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [about, setAbout] = useState(user.about || '');
  const [notes, setNotes] = useState(user.notes?.join('\n') || '');
  const [musicArtist, setMusicArtist] = useState(user.music?.artist || '');
  const [musicSong, setMusicSong] = useState(user.music?.song || '');
  
  const resetState = () => {
    setName(user.name);
    setEmail(user.email);
    setAbout(user.about || '');
    setNotes(user.notes?.join('\n') || '');
    setMusicArtist(user.music?.artist || '');
    setMusicSong(user.music?.song || '');
    setAvatarPreview(null);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isOpen) {
        resetState();
    }
  }, [isOpen, user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMusic = musicArtist && musicSong 
      ? { artist: musicArtist, song: musicSong, albumArt: `https://picsum.photos/seed/${musicSong}/100/100` } 
      : null;

    onUserUpdate({
        ...user,
        name,
        email,
        about,
        notes: notes.split('\n').filter(n => n.trim() !== ''),
        music: updatedMusic,
        avatar: avatarPreview || user.avatar,
    });
    setIsEditing(false);
    setAvatarPreview(null);
    onClose();
  };
  
  const handleCancel = () => {
      resetState();
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const footerContent = isEditing ? (
    <>
      <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleSaveProfile} type="submit" form="profile-form">Save Profile</Button>
    </>
  ) : (
    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile" footer={footerContent}>
      <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img src={avatarPreview || user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover" />
            {isEditing && (
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-full cursor-pointer text-white hover:bg-indigo-700">
                <CameraIcon className="w-5 h-5"/>
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            )}
          </div>
        </div>
        <div className="w-full space-y-4">
          <Input label="Full Name" id="profile-name" value={name} onChange={e => setName(e.target.value)} readOnly={!isEditing} />
          <Input label="Email Address" id="profile-email" type="email" value={email} onChange={e => setEmail(e.target.value)} readOnly={!isEditing} />
          <div>
            <label htmlFor="profile-about" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">About Me</label>
            <textarea id="profile-about" value={about} onChange={e => setAbout(e.target.value)} readOnly={!isEditing} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
          </div>
           <div>
            <label htmlFor="profile-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes (one per line)</label>
            <textarea id="profile-notes" value={notes} onChange={e => setNotes(e.target.value)} readOnly={!isEditing} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 !mb-2">Music Status</h4>
          <fieldset disabled={!isEditing} className="space-y-2">
            <legend className="sr-only">Listening to...</legend>
            <Input label="Artist" id="music-artist" placeholder="e.g., Tame Impala" value={musicArtist} onChange={e => setMusicArtist(e.target.value)} />
            <Input label="Song" id="music-song" placeholder="e.g., The Less I Know The Better" value={musicSong} onChange={e => setMusicSong(e.target.value)} />
          </fieldset>
        </div>
        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700 !mt-8">
            <p className="font-mono text-sm text-slate-500 dark:text-slate-400">from</p>
            <p className="font-bold text-lg tracking-widest text-slate-700 dark:text-slate-300">META</p>
        </div>
      </form>
    </Modal>
  );
};

export default ProfilePage;