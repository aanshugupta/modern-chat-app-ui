import React from 'react';
import { PollIcon, GifIcon, PaperclipIcon } from '../icons/Icons';

interface AttachmentMenuProps {
    onPollClick: () => void;
    onGifClick: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ onPollClick, onGifClick, onFileChange }) => {
    return (
        <div className="absolute bottom-full mb-2 bg-white dark:bg-slate-700 rounded-lg shadow-lg p-2 border border-slate-200 dark:border-slate-600 flex flex-col gap-1">
            <button onClick={onPollClick} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors w-full text-left">
                <PollIcon className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Poll</span>
            </button>
            <button onClick={onGifClick} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors w-full text-left">
                <GifIcon className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">GIF</span>
            </button>
            <label htmlFor="file-upload" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors w-full text-left cursor-pointer">
                <PaperclipIcon className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">File</span>
                <input id="file-upload" type="file" className="hidden" onChange={onFileChange} />
            </label>
        </div>
    );
};

export default AttachmentMenu;