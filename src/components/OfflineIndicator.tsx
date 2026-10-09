import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 text-xs font-medium shadow-xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <WifiOff className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-400" />
      <span>Offline Mode — Encrypted local messages cached</span>
    </div>
  );
};
