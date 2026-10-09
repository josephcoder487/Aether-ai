import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  Camera,
  Check,
  Upload,
  User,
  AtSign,
  FileText,
} from 'lucide-react';

const GRADIENT_PRESETS = [
  'bg-gradient-to-tr from-[#f0643b] to-[#ff8c5a]',
  'bg-gradient-to-tr from-amber-500 to-rose-500',
  'bg-gradient-to-tr from-indigo-500 to-purple-600',
  'bg-gradient-to-tr from-emerald-500 to-teal-600',
  'bg-gradient-to-tr from-slate-700 to-slate-900',
];

export const AccountEditView: React.FC = () => {
  const { user, updateUserProfile, setCurrentView } = useApp();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const [avatarType, setAvatarType] = useState<'image' | 'letter'>(user.avatarType);
  const [avatarBg, setAvatarBg] = useState(user.avatarBg || 'bg-gradient-to-tr from-[#f0643b] to-[#ff8c5a]');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      setAvatarType('image');
    }
  };

  const handleSave = () => {
    updateUserProfile({
      name: name.trim() || 'User',
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user',
      bio,
      avatar: avatarType === 'letter' ? (name.trim().charAt(0).toUpperCase() || 'U') : avatar,
      avatarType,
      avatarBg,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setCurrentView('settings');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafbfc] relative overflow-hidden font-sans">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="pt-4 pb-3 px-6 bg-white shrink-0 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('settings')}
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Profile</h1>
          </div>

          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-[#f0643b] hover:bg-[#ff7a45] text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>

      {/* Body Form */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 no-scrollbar">
        {/* Avatar Customizer */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-orange-50">
              {avatarType === 'image' && avatar.length > 5 ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${avatarBg}`}>
                  {name.trim().charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#f0643b] text-white flex items-center justify-center shadow-md hover:bg-[#ff7a45] transition-colors"
              title="Upload photo from device"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Default avatar uses your name's first letter
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setAvatarType('letter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                avatarType === 'letter'
                  ? 'bg-[#f0643b] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Letter Initial
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                avatarType === 'image'
                  ? 'bg-[#f0643b] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>Upload Photo</span>
            </button>
          </div>

          {avatarType === 'letter' && (
            <div className="mt-4 pt-4 border-t border-slate-100 w-full">
              <p className="text-[11px] font-semibold text-slate-500 mb-2 text-center">
                Initial Gradient Color
              </p>
              <div className="flex justify-center gap-2">
                {GRADIENT_PRESETS.map((grad, i) => (
                  <button
                    key={i}
                    onClick={() => setAvatarBg(grad)}
                    className={`w-7 h-7 rounded-full ${grad} transition-transform ${
                      avatarBg === grad ? 'scale-125 ring-2 ring-[#f0643b] ring-offset-2' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Fields */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Display Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#f0643b] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5 text-slate-400" />
              <span>Username</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 text-xs font-mono">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#f0643b] focus:bg-white font-mono transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Your unique link handle: ?invite={username}
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Bio / Status</span>
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell friends what you are working on..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#f0643b] focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full h-12 rounded-2xl bg-[#f0643b] hover:bg-[#ff7a45] text-white font-semibold text-xs shadow-md shadow-[#f0643b]/25 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};
