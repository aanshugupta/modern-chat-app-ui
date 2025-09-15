import React, { useState, useMemo } from 'react';
import Input from './Input';
import { SearchIcon } from '../icons/Icons';

interface GifPickerProps {
  onGifSelect: (url: string) => void;
}

const MOCK_GIFS = [
    { id: '1', title: 'Funny Cat', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3dnd3NlYjA2bW55eWY2ajI4bmF2aGcyNzhpcjNkaDNsNmQ2ZndzciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif' },
    { id: '2', title: 'Thumbs Up', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDB6a3JzN3I0ZzNqZ3h6ZGNkZ3VzcHhoZHUwd3E2MXVvbnZrdmQxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tknCqiJrBQG6bxC/giphy.gif' },
    { id: '3', title: 'Mind Blown', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajFldGd6dGhrMDI4dGhwMGRpZmc5aG0yZ3A1Z3JkdGZrcmRnbHNtbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xeJpnrWC4XWblEk/giphy.gif' },
    { id: '4', title: 'Excited', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDNzZ2FkaWxpdGdicjVnM2FqNmplenB5NWEzY2puaXFqamZkZ2Q5eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5GoVLqeAOo6PK/giphy.gif' },
    { id: '5', title: 'Nope', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnF5dXE1dWVrb3JpZXRiaGRqZnA2cDR6NnB1Zmp0anR0Z3c4OW10dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7btA82be3a0k3S0w/giphy.gif' },
    { id: '6', title: 'Success Kid', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWZjb2NnMmpvc3ZqMzg3eXhwZmJicmxka2NlY2JpYmY1d2RwbWx1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6UB3VhArA0AxlIo0/giphy.gif' },
]

const GifPicker: React.FC<GifPickerProps> = ({ onGifSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredGifs = useMemo(() => {
        if (!searchTerm) return MOCK_GIFS;
        return MOCK_GIFS.filter(gif => gif.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

  return (
    <div className="absolute bottom-full mb-2 bg-white dark:bg-slate-700 rounded-lg shadow-lg p-2 border border-slate-200 dark:border-slate-600 w-64 h-80 flex flex-col">
      <Input
        placeholder="Search for a GIF"
        icon={<SearchIcon className="w-4 h-4 text-slate-400" />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2 mt-2 overflow-y-auto flex-1">
        {filteredGifs.map(gif => (
          <button
            key={gif.id}
            onClick={() => onGifSelect(gif.url)}
            className="rounded-md hover:ring-2 hover:ring-indigo-500 transition-all overflow-hidden"
          >
            <img src={gif.url} alt={gif.title} className="w-full h-full object-cover"/>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GifPicker;