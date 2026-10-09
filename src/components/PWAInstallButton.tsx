import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { Smartphone, Download } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'drawer' | 'settings' | 'floating';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstalled } = usePWAInstall();
  const { setIsAPKModalOpen } = useApp();

  if (isInstalled && variant !== 'settings') {
    return null;
  }

  if (variant === 'header') {
    return (
      <button
        onClick={() => setIsAPKModalOpen(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 text-xs font-semibold border border-indigo-200/60 transition active:scale-95 ${className}`}
        title="Install on Mobile / Download APK"
      >
        <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
        <span>Install App</span>
      </button>
    );
  }

  if (variant === 'drawer') {
    return (
      <button
        onClick={() => setIsAPKModalOpen(true)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 border border-indigo-100 text-indigo-900 text-xs font-semibold transition active:scale-98 ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="leading-tight">Install Mobile APK</div>
            <div className="text-[10px] text-indigo-600 font-normal">Add to Android Phone</div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-600 text-white font-bold">
          Get App
        </span>
      </button>
    );
  }

  if (variant === 'settings') {
    return (
      <button
        onClick={() => setIsAPKModalOpen(true)}
        className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 transition active:scale-98 text-left ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">Install Mobile App (.APK)</div>
            <div className="text-xs text-slate-500">
              {isInstalled
                ? 'App is installed on your phone (manage package)'
                : 'Install directly or download mobile package'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
          <Download className="w-4 h-4" />
          <span>{isInstalled ? 'Package' : 'Install'}</span>
        </div>
      </button>
    );
  }

  // Floating variant
  return (
    <button
      onClick={() => setIsAPKModalOpen(true)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 text-xs font-semibold transition active:scale-95 ${className}`}
    >
      <Smartphone className="w-4 h-4" />
      <span>Install APK</span>
    </button>
  );
};
