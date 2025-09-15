import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat, User } from '../../types';
// Fix: Changed MicIcon to MicrophoneIcon as it was not an exported member.
import { MicrophoneIcon, MicOffIcon, VideoIcon, VideoOffIcon, PhoneOffIcon } from '../icons/Icons';
import Button from '../common/Button';

interface VideoCallViewProps {
  chat: Chat;
  currentUser: User;
  allUsers: User[];
  onEndCall: () => void;
  callType: 'video' | 'audio';
}

const VideoCallView: React.FC<VideoCallViewProps> = ({ chat, currentUser, allUsers, onEndCall, callType }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(callType === 'audio');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getChatPartner = () => {
    if (chat.type === 'direct') {
      const otherUserId = chat.participants.find(p => p !== currentUser.id);
      return allUsers.find(u => u.id === otherUserId);
    }
    return null;
  };
  const chatPartner = getChatPartner();

  const getMediaStream = useCallback(async () => {
    try {
      setPermissionError(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      // Simulate connection time after getting stream
      setTimeout(() => setIsConnecting(false), 3000);
    } catch (err) {
      console.error("Error accessing media devices.", err);
      setPermissionError(true);
      setIsConnecting(false); // Stop "connecting" if there's an error
    }
  }, []);

  useEffect(() => {
    getMediaStream();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [getMediaStream]);

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    }
  }, [isMuted, localStream]);
  
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !isCameraOff);
    }
  }, [isCameraOff, localStream]);

  if (permissionError) {
    return (
      <div className="fixed inset-0 bg-slate-800 z-50 flex flex-col items-center justify-center text-white text-center p-8">
        <VideoOffIcon className="w-24 h-24 text-red-500 mb-6" />
        <h2 className="text-3xl font-bold">Permissions Required</h2>
        <p className="text-slate-400 mt-2 max-w-md">
          This app needs access to your camera and microphone to start a {callType} call. Please allow access in your browser's settings and try again.
        </p>
        <div className="flex gap-4 mt-8">
          <Button variant="secondary" onClick={onEndCall}>
            Cancel
          </Button>
          <Button onClick={getMediaStream}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-slate-800 z-50 flex flex-col items-center justify-center text-white">
        <img src={chatPartner?.avatar || chat.avatar} alt={chatPartner?.name || chat.name} className="w-32 h-32 rounded-full ring-4 ring-slate-500 mb-6" />
        <h2 className="text-3xl font-bold capitalize">{callType} Calling {chatPartner?.name || chat.name}...</h2>
        <p className="text-slate-400 mt-2">Connecting</p>
        <button onClick={onEndCall} className="mt-12 bg-red-600 p-4 rounded-full hover:bg-red-700 transition-colors">
          <PhoneOffIcon className="w-8 h-8 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Remote video placeholder */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
            <img src={chatPartner?.avatar || chat.avatar} alt={chatPartner?.name || chat.name} className="w-48 h-48 rounded-full opacity-50" />
            <h3 className="text-2xl text-slate-400 mt-4">{chatPartner?.name || chat.name}</h3>
            <p className="text-slate-500">In call</p>
        </div>
      </div>
      
      {/* Local video */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className={`absolute top-4 right-4 w-48 h-36 bg-black rounded-lg object-cover shadow-lg border-2 border-slate-700 transition-opacity ${isCameraOff ? 'opacity-0' : 'opacity-100'}`}
      ></video>
       {isCameraOff && (
        <div className="absolute top-4 right-4 w-48 h-36 bg-slate-800 rounded-lg flex items-center justify-center border-2 border-slate-700">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-full opacity-70" />
        </div>
       )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex justify-center">
        <div className="flex items-center gap-6 bg-slate-800/80 backdrop-blur-sm p-4 rounded-full">
            <button onClick={() => setIsMuted(p => !p)} className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-600' : 'bg-slate-600 hover:bg-slate-500'}`}>
                {isMuted ? <MicOffIcon className="w-6 h-6 text-white" /> : <MicrophoneIcon className="w-6 h-6 text-white" />}
            </button>
            <button onClick={() => setIsCameraOff(p => !p)} className={`p-3 rounded-full transition-colors ${isCameraOff ? 'bg-red-600' : 'bg-slate-600 hover:bg-slate-500'}`}>
                {isCameraOff ? <VideoOffIcon className="w-6 h-6 text-white" /> : <VideoIcon className="w-6 h-6 text-white" />}
            </button>
            <button onClick={onEndCall} className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                <PhoneOffIcon className="w-7 h-7 text-white" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallView;