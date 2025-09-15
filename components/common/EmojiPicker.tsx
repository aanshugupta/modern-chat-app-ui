import React from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJIS = ['😀', '😂', '❤️', '👍', '🤔', '🎉', '🙏', '🤯', '😭', '🔥', '😊', '😎'];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-700 rounded-lg shadow-lg p-2 border border-slate-200 dark:border-slate-600">
      <div className="grid grid-cols-4 gap-2">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="text-2xl p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
