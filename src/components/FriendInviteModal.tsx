import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  UserCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';

export const FriendInviteModal: React.FC = () => {
  const {
    isInviteModalOpen,
    setIsInviteModalOpen,
    inviteLink,
    user,
    simulateFriendJoin,
    pendingInviteData,
    acceptInvite,
    declineInvite,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [customFriendName, setCustomFriendName] = useState('Elena Rostova');

  if (!isInviteModalOpen && !pendingInviteData) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {pendingInviteData ? (
          <div className="p-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#f0643b] to-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-[#f0643b]/25 mb-3">
              {pendingInviteData.name.charAt(0)}
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">
              Friend Request
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              <strong>{pendingInviteData.name}</strong> (@{pendingInviteData.username}) wants to connect via invite link.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={declineInvite}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Decline
              </button>
              <button
                onClick={acceptInvite}
                className="flex-1 py-3 rounded-2xl bg-[#f0643b] hover:bg-[#ff7a45] text-white text-xs font-semibold shadow-md shadow-[#f0643b]/25 transition-colors flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Accept & Chat</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#f0643b]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Share Invite Link</h3>
                  <p className="text-[10px] text-slate-500">Connect securely with friends</p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Your Direct Invite Link
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-[11px] font-mono text-slate-700 truncate outline-none select-all"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-[#f0643b] hover:bg-[#ff7a45] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 shadow-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/60 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#f0643b]" />
                <span>{showQR ? 'Hide QR Code' : 'Display Scannable QR Code'}</span>
              </button>

              {showQR && (
                <div className="mt-3 p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center animate-in zoom-in-95">
                  <div className="w-40 h-40 bg-[#18191d] p-3 rounded-xl flex items-center justify-center">
                    <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="10" y="10" width="25" height="25" rx="3" />
                      <rect x="15" y="15" width="15" height="15" fill="#18191d" />
                      <rect x="18" y="18" width="9" height="9" fill="currentColor" />

                      <rect x="65" y="10" width="25" height="25" rx="3" />
                      <rect x="70" y="15" width="15" height="15" fill="#18191d" />
                      <rect x="73" y="18" width="9" height="9" fill="currentColor" />

                      <rect x="10" y="65" width="25" height="25" rx="3" />
                      <rect x="15" y="70" width="15" height="15" fill="#18191d" />
                      <rect x="18" y="73" width="9" height="9" fill="currentColor" />

                      <rect x="42" y="12" width="6" height="6" />
                      <rect x="52" y="18" width="6" height="6" />
                      <rect x="42" y="28" width="6" height="6" />
                      <rect x="42" y="45" width="16" height="16" rx="2" />
                      <rect x="65" y="45" width="8" height="8" />
                      <rect x="78" y="52" width="10" height="8" />
                      <rect x="45" y="75" width="10" height="15" />
                      <rect x="68" y="70" width="18" height="8" />
                      <rect x="72" y="82" width="12" height="8" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Scan with camera to connect</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-700 mb-2">
                Simulate Friend Connecting via Link:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFriendName}
                  onChange={(e) => setCustomFriendName(e.target.value)}
                  placeholder="Friend name"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                />
                <button
                  onClick={() => simulateFriendJoin(customFriendName)}
                  className="px-3.5 py-2 bg-[#f0643b] hover:bg-[#ff7a45] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
