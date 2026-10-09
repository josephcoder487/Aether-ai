import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageAttachment } from '../types';
import { SAMPLE_PRESET_ATTACHMENTS } from '../data/defaultData';
import {
  ChevronLeft,
  MoreHorizontal,
  Plus,
  Play,
  Pause,
  X,
  Camera,
  Smile,
  Send,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Video as VideoIcon,
  Mic,
  FileText,
  Download,
  AlertCircle,
  Volume2,
  Lock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface DecoyModalState {
  isOpen: boolean;
  type: 'image' | 'video' | 'audio' | 'document';
  attachment: MessageAttachment;
  messageId: string;
}

export const ChatRoom: React.FC = () => {
  const {
    activeContact,
    setCurrentView,
    sendMessage,
    simulateIncomingMessage,
    setAppMode,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isMusicBannerVisible, setIsMusicBannerVisible] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // The Secret Decoy Modal State
  const [decoyModal, setDecoyModal] = useState<DecoyModalState | null>(null);

  // Unlocked message IDs
  const [unlockedMessageIds, setUnlockedMessageIds] = useState<Set<string>>(new Set());

  // Viewers after secret unlock
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<MessageAttachment | null>(null);
  const [activeAudioModal, setActiveAudioModal] = useState<MessageAttachment | null>(null);
  const [activeDocModal, setActiveDocModal] = useState<MessageAttachment | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Audio player state for voice memos
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<'image' | 'video' | 'audio' | 'document'>('image');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeContact?.messages]);

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center bg-white">
        <div>
          <p className="text-sm text-slate-500 mb-3">No chat selected</p>
          <button
            onClick={() => setCurrentView('contacts')}
            className="px-4 py-2 bg-[#f0643b] text-white rounded-xl text-xs font-semibold"
          >
            Go to Chats
          </button>
        </div>
      </div>
    );
  }

  const handleSendText = () => {
    if (!inputVal.trim()) return;
    sendMessage(activeContact.id, inputVal);
    setInputVal('');

    setTimeout(() => {
      simulateIncomingMessage(activeContact.id);
    }, 3500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const triggerFileInput = (type: 'image' | 'video' | 'audio' | 'document') => {
    setActiveUploadType(type);
    setIsMediaMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        type === 'image'
          ? 'image/*'
          : type === 'video'
          ? 'video/*'
          : type === 'audio'
          ? 'audio/*'
          : '.pdf,.doc,.docx,.zip,.txt';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const fileUrl = URL.createObjectURL(file);

    const attachment: MessageAttachment = {
      type: activeUploadType,
      url: fileUrl,
      name: file.name,
      size: fileSizeStr,
      duration: activeUploadType === 'audio' ? '0:18' : activeUploadType === 'video' ? '0:22' : undefined,
    };

    sendMessage(activeContact.id, '', attachment);
    e.target.value = '';

    setTimeout(() => {
      simulateIncomingMessage(activeContact.id);
    }, 3000);
  };

  const sendPresetMedia = (type: 'image' | 'video' | 'audio' | 'document') => {
    setIsMediaMenuOpen(false);
    if (type === 'document') {
      sendMessage(activeContact.id, '', {
        type: 'document',
        name: 'Design_Proposal_2026.pdf',
        size: '2.5 MB',
        url: '#',
      });
    } else if (type === 'image') {
      const preset = SAMPLE_PRESET_ATTACHMENTS.images[0];
      sendMessage(activeContact.id, '', {
        type: 'image',
        name: preset.name,
        size: preset.size,
        url: preset.url,
      });
    } else if (type === 'video') {
      const preset = SAMPLE_PRESET_ATTACHMENTS.videos[0];
      sendMessage(activeContact.id, '', {
        type: 'video',
        name: preset.name,
        size: preset.size,
        duration: preset.duration,
        url: preset.url,
      });
    } else if (type === 'audio') {
      const preset = SAMPLE_PRESET_ATTACHMENTS.audios[0];
      sendMessage(activeContact.id, '', {
        type: 'audio',
        name: preset.name,
        size: preset.size,
        duration: preset.duration,
        url: preset.url,
      });
    }

    setTimeout(() => {
      simulateIncomingMessage(activeContact.id);
    }, 3500);
  };

  // Start real voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const secs = recordingSeconds || 5;
        const durStr = `0:${secs < 10 ? '0' : ''}${secs}`;

        sendMessage(activeContact.id, '', {
          type: 'audio',
          name: `voice_memo_${Date.now().toString().slice(-4)}.webm`,
          duration: durStr,
          size: '512 KB',
          url: audioUrl,
        });

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsMediaMenuOpen(false);
    } catch (err) {
      setIsRecording(false);
      sendPresetMedia('audio');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(false);
      sendPresetMedia('audio');
    }
  };

  // Tapping Media Div Box triggers the Decoy Notice
  const handleMediaBoxClick = (msgId: string, attachment: MessageAttachment) => {
    if (unlockedMessageIds.has(msgId)) {
      openActualMedia(attachment);
      return;
    }

    setDecoyModal({
      isOpen: true,
      type: attachment.type,
      attachment,
      messageId: msgId,
    });
  };

  // The secret click on the keyword
  const handleSecretWordClick = (modal: DecoyModalState) => {
    setUnlockedMessageIds((prev) => new Set(prev).add(modal.messageId));
    setDecoyModal(null);
    openActualMedia(modal.attachment);
  };

  const openActualMedia = (attachment: MessageAttachment) => {
    if (attachment.type === 'image') {
      setLightboxImage(attachment.url);
    } else if (attachment.type === 'video') {
      setActiveVideoModal(attachment);
    } else if (attachment.type === 'audio') {
      setActiveAudioModal(attachment);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = attachment.url;
        audioPlayerRef.current.play().catch(() => {});
        setPlayingAudioId(attachment.url);
      }
    } else if (attachment.type === 'document') {
      setActiveDocModal(attachment);
    }
  };

  const togglePlayAudio = (msgId: string, url: string) => {
    if (playingAudioId === msgId) {
      audioPlayerRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play().catch(() => {});
        setPlayingAudioId(msgId);
        audioPlayerRef.current.onended = () => {
          setPlayingAudioId(null);
        };
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden font-sans">
      <audio ref={audioPlayerRef} className="hidden" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ---------------- DECOY ERROR MODAL (THE SECRET GAMBIT) ---------------- */}
      {decoyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-3.5 shadow-inner">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Notice
            </h3>

            {/* DECOY TEXT WITH EMBEDDED SECRET KEYWORD */}
            <div className="text-xs text-slate-600 leading-relaxed my-3 px-2">
              {decoyModal.type === 'image' && (
                <p>
                  Oops the{' '}
                  <span
                    onClick={() => handleSecretWordClick(decoyModal)}
                    className="cursor-pointer font-medium text-slate-800 hover:text-[#f0643b] transition-colors select-none"
                    title="Tap to secretly unlock"
                  >
                    photo
                  </span>{' '}
                  is no more available
                </p>
              )}

              {decoyModal.type === 'video' && (
                <p>
                  Oops the{' '}
                  <span
                    onClick={() => handleSecretWordClick(decoyModal)}
                    className="cursor-pointer font-medium text-slate-800 hover:text-[#f0643b] transition-colors select-none"
                    title="Tap to secretly unlock"
                  >
                    video
                  </span>{' '}
                  is no more available
                </p>
              )}

              {decoyModal.type === 'audio' && (
                <p>
                  Oops the{' '}
                  <span
                    onClick={() => handleSecretWordClick(decoyModal)}
                    className="cursor-pointer font-medium text-slate-800 hover:text-[#f0643b] transition-colors select-none"
                    title="Tap to secretly unlock"
                  >
                    audio
                  </span>{' '}
                  is no more available
                </p>
              )}

              {decoyModal.type === 'document' && (
                <p>
                  Oops the{' '}
                  <span
                    onClick={() => handleSecretWordClick(decoyModal)}
                    className="cursor-pointer font-medium text-slate-800 hover:text-[#f0643b] transition-colors select-none"
                    title="Tap to secretly unlock"
                  >
                    document
                  </span>{' '}
                  is no more available
                </p>
              )}
            </div>

            <div className="mt-5">
              <button
                onClick={() => setDecoyModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FULL LIGHTBOX (PHOTO VIEWER) ---------------- */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Enlarged"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------- VIDEO PLAYER MODAL ---------------- */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="p-3 bg-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <VideoIcon className="w-4 h-4 text-[#f0643b]" />
                <span className="text-xs font-semibold truncate max-w-[200px]">
                  {activeVideoModal.name}
                </span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <video
              src={activeVideoModal.url}
              controls
              autoPlay
              className="w-full max-h-[65vh] bg-black object-contain"
            />
          </div>
        </div>
      )}

      {/* ---------------- AUDIO PLAYER MODAL ---------------- */}
      {activeAudioModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#f0643b]" />
                <h4 className="text-xs font-bold text-slate-800 truncate">
                  {activeAudioModal.name}
                </h4>
              </div>
              <button
                onClick={() => {
                  audioPlayerRef.current?.pause();
                  setPlayingAudioId(null);
                  setActiveAudioModal(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-[#f0643b] mb-3 shadow-inner">
                <Mic className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-1 h-8 my-2">
                {[4, 8, 14, 6, 12, 18, 10, 16, 8, 14, 18, 8, 12, 6, 10].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h * 1.5}px` }}
                    className="w-1.5 rounded-full bg-[#f0643b] animate-pulse"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">Playing decrypted voice audio</p>
            </div>

            <button
              onClick={() => {
                audioPlayerRef.current?.pause();
                setPlayingAudioId(null);
                setActiveAudioModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#f0643b] hover:bg-[#ff7a45] text-white text-xs font-semibold shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ---------------- DOCUMENT VIEWER MODAL ---------------- */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 text-[#f0643b] flex items-center justify-center mb-3">
              <FileText className="w-7 h-7" />
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-1 truncate">
              {activeDocModal.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {activeDocModal.size || '2.5 MB'} · Decrypted Document
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveDocModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${activeDocModal.name}`);
                  setActiveDocModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#f0643b] hover:bg-[#ff7a45] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TOP DARK OBSIDIAN HEADER matching image.png ---------------- */}
      <div className="bg-[#18191d] text-white px-4 pt-3 pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={() => setCurrentView('contacts')}
              className="p-1 -ml-1 text-slate-400 hover:text-white transition-colors"
              title="Back to Chats"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Avatar with small green online dot */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 border border-white/10 shadow-xs">
                {activeContact.avatarType === 'image' ? (
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-white font-bold text-sm ${
                      activeContact.avatarBg || 'bg-[#f0643b]'
                    }`}
                  >
                    {activeContact.name.charAt(0)}
                  </div>
                )}
              </div>
              {/* Green online dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] ring-1.5 ring-[#18191d]"></span>
            </div>

            {/* Name and typing indicator */}
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
                {activeContact.name}
              </h2>
              <div className="flex items-center gap-1 text-[11px] text-[#10b981] mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                <span>typing</span>
              </div>
            </div>
          </div>

          {/* Three horizontal dots menu */}
          <div className="relative">
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="p-1.5 text-slate-300 hover:text-white rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isOptionsOpen && (
              <div className="absolute right-0 top-8 w-52 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setIsOptionsOpen(false);
                    simulateIncomingMessage(activeContact.id);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-[#f0643b] flex items-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Simulate News Alert</span>
                </button>
                <button
                  onClick={() => {
                    setIsOptionsOpen(false);
                    setAppMode('ai');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-[#f0643b] flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#f0643b]" />
                  <span>Stealth AI Decoy</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- CORAL MUSIC / AUDIO STRIP matching image.png ---------------- */}
      {isMusicBannerVisible && (
        <div className="bg-[#f0643b] text-white px-4 py-2 flex items-center justify-between shrink-0 shadow-sm transition-all">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="w-5 h-5 rounded-md bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors"
            >
              {isPlayingMusic ? (
                <Pause className="w-3 h-3 fill-white text-white" />
              ) : (
                <Play className="w-3 h-3 fill-white text-white ml-0.5" />
              )}
            </button>
            <p className="text-xs font-medium text-white truncate tracking-tight">
              She wants revenge: Tear you apart
            </p>
          </div>

          <button
            onClick={() => setIsMusicBannerVisible(false)}
            className="p-1 text-white/80 hover:text-white transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ---------------- MESSAGES STREAM matching image.png ---------------- */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar bg-white">
        {/* Today date pill */}
        <div className="flex justify-center my-1">
          <span className="px-3.5 py-1 rounded-full bg-[#f3f4f6] text-[11px] font-medium text-slate-500 shadow-2xs">
            Today
          </span>
        </div>

        {activeContact.messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          const isUnlocked = unlockedMessageIds.has(msg.id);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Text Message Bubble */}
              {msg.text && (
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-3xl text-[13px] leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-[#f0643b] text-white rounded-br-sm'
                      : 'bg-[#f3f4f6] text-slate-800 rounded-bl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                      isMe ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 stroke-[2.5]" />}
                  </div>
                </div>
              )}

              {/* Rich Media / Div Boxes with Secret Decoy */}
              {msg.attachment && (
                <div className="max-w-[85%] mt-1">
                  {/* AUDIO VOICE MESSAGE (CORAL WAVEFORM) matching image.png */}
                  {msg.attachment.type === 'audio' && (
                    <div
                      onClick={() => handleMediaBoxClick(msg.id, msg.attachment!)}
                      className="bg-[#f0643b] text-white rounded-3xl p-3 shadow-md flex items-center gap-3 cursor-pointer min-w-[230px]"
                    >
                      {/* Play Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMediaBoxClick(msg.id, msg.attachment!);
                        }}
                        className="w-10 h-10 rounded-full bg-white text-[#f0643b] flex items-center justify-center shrink-0 shadow-xs"
                      >
                        {playingAudioId === msg.id ? (
                          <Pause className="w-4 h-4 fill-[#f0643b]" />
                        ) : (
                          <Play className="w-4 h-4 fill-[#f0643b] ml-0.5" />
                        )}
                      </button>

                      {/* Waveform graphic */}
                      <div className="flex-1">
                        <div className="flex items-center gap-0.5 h-6">
                          {[3, 6, 12, 8, 14, 18, 11, 16, 9, 14, 18, 10, 14, 7, 11, 6, 10, 4, 8].map(
                            (h, idx) => (
                              <div
                                key={idx}
                                style={{ height: `${h * 1.3}px` }}
                                className={`w-0.5 rounded-full ${
                                  playingAudioId === msg.id ? 'bg-white animate-pulse' : 'bg-white/90'
                                }`}
                              />
                            )
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/90 mt-1">
                          <span>{msg.attachment.duration || '0:32'}</span>
                          <span className="flex items-center gap-0.5">
                            {msg.timestamp}
                            <CheckCheck className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHOTO DIV BOX */}
                  {msg.attachment.type === 'image' && (
                    <div
                      onClick={() => handleMediaBoxClick(msg.id, msg.attachment!)}
                      className={`rounded-3xl p-3.5 shadow-sm border transition-all cursor-pointer flex items-center gap-3 min-w-[210px] ${
                        isMe ? 'bg-[#f0643b] text-white border-transparent' : 'bg-[#f3f4f6] text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold truncate">Photo Box</p>
                          {isUnlocked ? (
                            <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-semibold">
                              Decrypted
                            </span>
                          ) : (
                            <Lock className="w-3 h-3 opacity-60" />
                          )}
                        </div>
                        <p className={`text-[10px] mt-0.5 ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                          {msg.attachment.size || '1.8 MB'} · Tap to view
                        </p>
                      </div>
                    </div>
                  )}

                  {/* VIDEO DIV BOX */}
                  {msg.attachment.type === 'video' && (
                    <div
                      onClick={() => handleMediaBoxClick(msg.id, msg.attachment!)}
                      className={`rounded-3xl p-3.5 shadow-sm border transition-all cursor-pointer flex items-center gap-3 min-w-[210px] ${
                        isMe ? 'bg-[#f0643b] text-white border-transparent' : 'bg-[#f3f4f6] text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <VideoIcon className="w-5 h-5" />
                      </div>
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold truncate">Video Box</p>
                          {isUnlocked ? (
                            <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-semibold">
                              Decrypted
                            </span>
                          ) : (
                            <Lock className="w-3 h-3 opacity-60" />
                          )}
                        </div>
                        <p className={`text-[10px] mt-0.5 ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                          {msg.attachment.duration || '0:15'} · Tap to view
                        </p>
                      </div>
                    </div>
                  )}

                  {/* DOCUMENT DIV BOX */}
                  {msg.attachment.type === 'document' && (
                    <div
                      onClick={() => handleMediaBoxClick(msg.id, msg.attachment!)}
                      className={`rounded-3xl p-3.5 shadow-sm border transition-all cursor-pointer flex items-center gap-3 min-w-[210px] ${
                        isMe ? 'bg-[#f0643b] text-white border-transparent' : 'bg-[#f3f4f6] text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold truncate">
                            {msg.attachment.name || 'Document'}
                          </p>
                          {isUnlocked && (
                            <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-semibold">
                              Decrypted
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] mt-0.5 ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                          {msg.attachment.size || '2.5 MB'} · Tap to open
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Media Attachment Tray */}
      {isMediaMenuOpen && (
        <div className="px-4 pb-2">
          <div className="bg-white rounded-3xl p-3.5 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Share Media</span>
              <button
                onClick={() => setIsMediaMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => triggerFileInput('image')}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-orange-50 text-[#f0643b] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-[#f0643b]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700">Photo Box</span>
              </button>

              <button
                onClick={() => triggerFileInput('video')}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-orange-50 text-[#f0643b] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <VideoIcon className="w-5 h-5 text-[#f0643b]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700">Video Box</span>
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
                  isRecording ? 'bg-rose-50 text-rose-600' : 'hover:bg-orange-50 text-[#f0643b]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-orange-100 text-[#f0643b]'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700">
                  {isRecording ? `${recordingSeconds}s Stop` : 'Audio Note'}
                </span>
              </button>

              <button
                onClick={() => triggerFileInput('document')}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-orange-50 text-[#f0643b] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#f0643b]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700">Document</span>
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-[10px]">Quick Presets:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => sendPresetMedia('audio')}
                  className="px-2 py-0.5 rounded bg-orange-50 text-[#f0643b] hover:bg-orange-100 text-[10px] font-semibold"
                >
                  Voice Note (0:32)
                </button>
                <button
                  onClick={() => sendPresetMedia('image')}
                  className="px-2 py-0.5 rounded bg-orange-50 text-[#f0643b] hover:bg-orange-100 text-[10px] font-semibold"
                >
                  Photo Box
                </button>
                <button
                  onClick={() => sendPresetMedia('document')}
                  className="px-2 py-0.5 rounded bg-orange-50 text-[#f0643b] hover:bg-orange-100 text-[10px] font-semibold"
                >
                  Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- BOTTOM INPUT BAR matching image.png ---------------- */}
      <div className="px-4 py-3 bg-white border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          {/* Coral circular (+) button matching image.png */}
          <button
            type="button"
            onClick={() => setIsMediaMenuOpen(!isMediaMenuOpen)}
            className="w-10 h-10 rounded-full bg-[#f0643b] hover:bg-[#ff7a45] active:scale-95 text-white flex items-center justify-center shadow-md shadow-[#f0643b]/25 shrink-0 transition-transform"
            title="Attach media or files"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Message Input Field */}
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="flex-1 bg-[#f3f4f6] text-slate-900 placeholder-slate-400 text-xs px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-[#f0643b]/30"
          />

          {/* Camera Button */}
          <button
            type="button"
            onClick={() => triggerFileInput('image')}
            className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
            title="Camera"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Smiley / Emoji Button */}
          <button
            type="button"
            onClick={() => setInputVal((prev) => prev + ' 😊')}
            className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Send Button */}
          {inputVal.trim() && (
            <button
              type="button"
              onClick={handleSendText}
              className="w-9 h-9 rounded-full bg-[#f0643b] text-white flex items-center justify-center shadow-sm shrink-0 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
