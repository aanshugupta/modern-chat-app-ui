import React, { useState } from 'react';
import { User, Status } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { CameraIcon } from '../icons/Icons';

interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreateStatus: (status: Omit<Status, 'id' | 'viewers' | 'reactions'>) => void;
}

const CreateStatusModal: React.FC<CreateStatusModalProps> = ({ isOpen, onClose, currentUser, onCreateStatus }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!text.trim() && !image) {
        alert("Please add some text or an image for your status.");
        return;
    }
    
    const statusData: Omit<Status, 'id' | 'viewers' | 'reactions'> = {
        userId: currentUser.id,
        timestamp: Date.now(),
        type: image ? 'image' : 'text',
        content: image || text,
    };

    onCreateStatus(statusData);
    resetAndClose();
  };

  const resetAndClose = () => {
      setText('');
      setImage(null);
      onClose();
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setImage(reader.result as string);
              setText(''); // Clear text when image is selected
          };
          reader.readAsDataURL(file);
      }
  }

  const footer = (
    <>
      <Button variant="secondary" onClick={resetAndClose}>Cancel</Button>
      <Button onClick={handleSubmit}>Post Status</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Create Status" footer={footer}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt="You" className="w-12 h-12 rounded-full"/>
            <div>
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-sm text-slate-500">Share a photo or some text.</p>
            </div>
        </div>
        {image ? (
            <div className="relative">
                <img src={image} alt="Status preview" className="w-full h-auto max-h-60 object-contain rounded-lg bg-slate-100 dark:bg-slate-700"/>
                <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full">&times;</button>
            </div>
        ) : (
            <textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
        )}
        
        <label htmlFor="status-image-upload" className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <CameraIcon className="w-6 h-6 text-slate-500" />
            <span className="font-semibold text-slate-600 dark:text-slate-300">{image ? 'Change Photo' : 'Upload Photo'}</span>
            <input id="status-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>
    </Modal>
  );
};

export default CreateStatusModal;