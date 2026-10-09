import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, MessageCircle, Newspaper, ArrowRight, Eye } from 'lucide-react';

export const DisguisedNotificationBanner: React.FC = () => {
  const { disguisedNotification, dismissNotification, openNotificationTarget } = useApp();
  const [isDecrypted, setIsDecrypted] = useState(false);

  useEffect(() => {
    if (disguisedNotification) {
      setIsDecrypted(false);
      const timer = setTimeout(() => {
        dismissNotification();
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [disguisedNotification]);

  if (!disguisedNotification) return null;

  return (
    <div className="absolute top-2 left-2 right-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="w-full bg-[#18191d]/95 text-white backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/10 transition-all">
        {/* Top Header Line of Notification */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            {/* The Distinct App Logo - Identifies this news alert as a real chat message! */}
            <div className="relative w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f0643b] to-amber-400 flex items-center justify-center text-white shadow-sm ring-1 ring-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              {/* Covert secret indicator dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#18191d] animate-pulse"></span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="font-semibold text-slate-100">{disguisedNotification.source}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 text-[11px]">{disguisedNotification.timestamp}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-white/10 text-[#ff8c5a] rounded border border-white/10">
                News Feed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDecrypted(!isDecrypted)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/10 transition-colors"
              title="Reveal actual message"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={dismissNotification}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/10 transition-colors"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Headline content / Disguise vs Decrypted */}
        {!isDecrypted ? (
          <div
            onClick={() => setIsDecrypted(true)}
            className="cursor-pointer group hover:bg-white/5 p-1 rounded-lg transition-colors"
          >
            <p className="text-xs text-slate-200 line-clamp-2 leading-snug font-normal">
              {disguisedNotification.headline}
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px] text-[#ff8c5a] font-medium">
              <span className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <Newspaper className="w-3 h-3 text-[#f0643b]" />
                <span>Tap to decode encrypted chat</span>
              </span>
              <span className="text-slate-500 text-[10px]">Recognized by Aether badge</span>
            </div>
          </div>
        ) : (
          <div className="p-2 bg-black/40 rounded-xl border border-white/10 my-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-xs text-[#ff8c5a] font-semibold mb-1">
              <MessageCircle className="w-3.5 h-3.5 text-[#f0643b]" />
              <span>Incoming from {disguisedNotification.contactName}</span>
            </div>
            <p className="text-xs text-white bg-white/5 p-2 rounded-lg border border-white/10">
              "{disguisedNotification.realMessage}"
            </p>
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => openNotificationTarget(disguisedNotification)}
                className="px-3 py-1 bg-[#f0643b] hover:bg-[#ff7a45] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
              >
                <span>Open Chat</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
