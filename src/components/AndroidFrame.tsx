import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  Battery,
  Maximize2,
  Minimize2,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  Share2,
  Smartphone,
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const {
    frameMode,
    setFrameMode,
    appMode,
    setAppMode,
    currentView,
    simulateIncomingMessage,
    activeContact,
    setIsInviteModalOpen,
    setIsAPKModalOpen,
  } = useApp();

  const [currentTime, setCurrentTime] = useState('08:00');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Determine status bar background & text color based on screen
  const isDarkBar = appMode === 'messenger' && currentView === 'chat';

  return (
    <div className="min-h-screen bg-[#ff8153] bg-gradient-to-br from-[#ff8c5a] via-[#f0643b] to-[#e44d26] text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-[#f0643b]/40">
      {/* Top Controller Bar */}
      <header className="w-full max-w-5xl mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 bg-black/40 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-3 shadow-2xl">
        {/* Brand & Stealth Mode Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f0643b] via-[#ff7a45] to-amber-300 flex items-center justify-center text-white shadow-lg shadow-[#f0643b]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base tracking-tight">
                Chats & Stealth Messenger
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                {appMode === 'ai' ? 'AI Chatbot Gambit' : 'Chats Active'}
              </span>
            </div>
            <p className="text-xs text-white/80 hidden sm:block">
              {appMode === 'ai'
                ? 'Landing disguise active · Tap 3-line menu → Messenger to enter'
                : 'Messenger active · Encrypted chats & secret media decoy'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Quick Toggle Between AI & Messenger */}
          <button
            onClick={() => setAppMode(appMode === 'ai' ? 'messenger' : 'ai')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-md ${
              appMode === 'ai'
                ? 'bg-white text-slate-900 hover:bg-slate-100'
                : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'
            }`}
            title="Toggle between AI Decoy and Messenger"
          >
            {appMode === 'ai' ? (
              <>
                <MessageSquare className="w-3.5 h-3.5 text-[#f0643b]" />
                <span>Switch to Chats</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Stealth AI Decoy</span>
              </>
            )}
          </button>

          {/* Test News Disguise Notification */}
          <button
            onClick={() => simulateIncomingMessage(activeContact?.id || 'c_kathryn')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/20 transition-all flex items-center gap-1.5 shadow-sm"
            title="Triggers an incoming message disguised as a random news alert"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Simulate</span> News Alert
          </button>

          {/* Invite Friend Link */}
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/20 transition-all flex items-center gap-1.5 shadow-sm"
            title="Share friend invite link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Invite Link</span>
          </button>

          {/* Install APK / Mobile App */}
          <button
            onClick={() => setIsAPKModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/30 active:scale-95"
            title="Download APK / Install on Android"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install APK</span>
          </button>

          {/* Frame Mode Toggle */}
          <button
            onClick={() => setFrameMode(frameMode === 'phone' ? 'fullscreen' : 'phone')}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/20 transition-all shadow-sm"
            title={frameMode === 'phone' ? 'Expand to Fullscreen' : 'Switch to Android Phone Frame'}
          >
            {frameMode === 'phone' ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Canvas / Device Shell */}
      <main
        className={`w-full transition-all duration-300 flex justify-center items-start ${
          frameMode === 'phone'
            ? 'max-w-[420px]'
            : 'max-w-4xl'
        }`}
      >
        <div
          className={`w-full relative overflow-hidden transition-all duration-300 ${
            frameMode === 'phone'
              ? 'rounded-[50px] border-[10px] border-[#18191d] shadow-[0_30px_90px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.15)] bg-white min-h-[790px] max-h-[890px] flex flex-col ring-1 ring-black/40'
              : 'rounded-3xl border border-white/20 shadow-2xl bg-white min-h-[820px] flex flex-col'
          }`}
        >
          {/* Android Status Bar matching the image */}
          <div
            className={`w-full px-7 pt-2.5 pb-1 flex items-center justify-between text-xs font-semibold z-40 select-none shrink-0 transition-colors duration-200 ${
              isDarkBar
                ? 'bg-[#18191d] text-white'
                : 'bg-white text-slate-900'
            }`}
          >
            {/* Clock: exactly 08:00 matching image.png */}
            <span className="font-bold tracking-tight text-[13px]">{currentTime}</span>

            {/* Android Punch-hole Camera */}
            {frameMode === 'phone' && (
              <div className="w-4 h-4 rounded-full bg-black/80 border border-white/10 shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
              </div>
            )}

            {/* Signal & Battery Icons matching image.png */}
            <div className="flex items-center gap-1.5">
              {/* Cellular Signal bars icon */}
              <div className="flex items-end gap-0.5 h-3">
                <div className={`w-0.5 h-1.5 rounded-full ${isDarkBar ? 'bg-white' : 'bg-slate-900'}`}></div>
                <div className={`w-0.5 h-2 rounded-full ${isDarkBar ? 'bg-white' : 'bg-slate-900'}`}></div>
                <div className={`w-0.5 h-2.5 rounded-full ${isDarkBar ? 'bg-white' : 'bg-slate-900'}`}></div>
                <div className={`w-0.5 h-3 rounded-full ${isDarkBar ? 'bg-white' : 'bg-slate-900'}`}></div>
              </div>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Inner App Container */}
          <div className="flex-1 w-full relative flex flex-col overflow-hidden bg-white">
            {children}
          </div>

          {/* Android Bottom Navigation Gesture Bar (when in phone frame) */}
          {frameMode === 'phone' && (
            <div
              className={`w-full h-5 flex items-center justify-center select-none shrink-0 transition-colors ${
                isDarkBar ? 'bg-[#18191d]' : 'bg-white'
              }`}
            >
              <div
                className={`w-28 h-1 rounded-full ${
                  isDarkBar ? 'bg-slate-600' : 'bg-slate-300'
                }`}
              ></div>
            </div>
          )}
        </div>
      </main>

      {/* Discreet Footer Note */}
      <footer className="mt-4 text-xs text-white/80 text-center max-w-md">
        <span>Aether Messenger · Coral UI Edition · Secret Media Decoy</span>
      </footer>
    </div>
  );
};
