import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  User,
  MessageCircle,
  Database,
  Briefcase,
  Lock,
  HelpCircle,
  Info,
  Edit2,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    setCurrentView,
    logout,
    setAppMode,
  } = useApp();

  const menuItems = [
    {
      id: 'account',
      label: 'Account',
      action: () => setCurrentView('account_edit'),
    },
    {
      id: 'chat',
      label: 'Chat',
      action: () => {},
    },
    {
      id: 'notifications',
      label: 'Notifications',
      subtitle: 'News Camouflage settings',
      action: () => setCurrentView('notifications_edit'),
    },
    {
      id: 'storage',
      label: 'Storage and Data',
      action: () => {},
    },
    {
      id: 'business',
      label: 'Business',
      action: () => {},
    },
    {
      id: 'privacy',
      label: 'Privacy',
      action: () => {},
    },
    {
      id: 'security',
      label: 'Security',
      action: () => {},
    },
    {
      id: 'help',
      label: 'Help',
      action: () => {},
    },
    {
      id: 'about',
      label: 'About',
      action: () => {},
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafbfc] relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="pt-4 pb-3 px-6 bg-white shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('contacts')}
            className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors"
            title="Back to Chats"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settings</h1>
        </div>
      </div>

      {/* Main Settings Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar flex flex-col justify-between">
        <div className="space-y-4">
          {/* User Profile Card */}
          <div
            onClick={() => setCurrentView('account_edit')}
            className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 flex items-center justify-between cursor-pointer hover:border-orange-200 transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {user.avatarType === 'image' && user.avatar.length > 5 ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${user.avatarBg || 'bg-[#f0643b]'}`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#f0643b] text-white flex items-center justify-center shadow-xs">
                  <Edit2 className="w-2.5 h-2.5" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#f0643b] transition-colors">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium">@{user.username}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                  {user.email || 'Connected with Google'}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#f0643b] group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Android APK Installation & Package Card */}
          <PWAInstallButton variant="settings" />

          {/* Settings List */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden divide-y divide-slate-100">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                    {item.label}
                  </span>
                  {item.subtitle && (
                    <p className="text-[10px] text-[#f0643b] mt-0.5">{item.subtitle}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Log Out Button */}
        <div className="pt-6 pb-2">
          <button
            onClick={logout}
            className="w-full h-12 rounded-2xl bg-[#f0643b] hover:bg-[#ff7a45] active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-md shadow-[#f0643b]/25 flex items-center justify-center"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
