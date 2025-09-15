import React, { useEffect, useState } from 'react';

interface EmojiPopperProps {
    emoji: string | null;
}

const EmojiPopper: React.FC<EmojiPopperProps> = ({ emoji }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentEmoji, setCurrentEmoji] = useState<string | null>(null);

    useEffect(() => {
        if (emoji) {
            setCurrentEmoji(emoji);
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 1400); // Should be slightly less than animation duration
            return () => clearTimeout(timer);
        }
    }, [emoji]);

    if (!isVisible || !currentEmoji) {
        return null;
    }

    const animationStyle = {
        animation: 'emoji-pop 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    };
    
    // Add keyframes to a style tag in the head
    useEffect(() => {
        const styleId = 'emoji-popper-keyframes';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @keyframes emoji-pop {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) translateY(50px);
                    }
                    30% {
                        opacity: 1;
                        transform: scale(1.1) translateY(0);
                    }
                    80% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.5) translateY(-50px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]">
            <div
                style={animationStyle}
                className="text-9xl"
            >
                {currentEmoji}
            </div>
        </div>
    );
};

export default EmojiPopper;
