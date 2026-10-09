import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Shield, CheckCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, user } = useApp();
  const [customEmail, setCustomEmail] = useState('joseph.noah487@gmail.com');
  const [customName, setCustomName] = useState('Joseph Noah');
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = (email = 'joseph.noah487@gmail.com', name = 'Joseph Noah') => {
    loginWithGoogle(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f0643b] to-amber-400 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Aether Account</h3>
              <p className="text-[10px] text-slate-500">Google Authentication</p>
            </div>
          </div>
          {user.isLoggedIn && (
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="py-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>

          <h2 className="text-base font-bold text-slate-900 mb-1">
            Sign in with Google
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Log in with your Google Account to access encrypted communications and configure your profile.
          </p>

          {!isCustomMode ? (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleSignIn('joseph.noah487@gmail.com', 'Joseph Noah')}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs flex items-center justify-center gap-3 transition-all hover:border-slate-300 active:scale-[0.99]"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <span>Continue as Joseph Noah</span>
              </button>

              <button
                onClick={() => setIsCustomMode(true)}
                className="text-xs text-[#f0643b] hover:text-[#ff7a45] font-semibold"
              >
                Sign in with a different Google account
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-left">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Google Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setIsCustomMode(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => handleSignIn(customEmail, customName)}
                  className="flex-1 py-2 rounded-xl bg-[#f0643b] hover:bg-[#ff7a45] text-white text-xs font-semibold shadow-xs"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2 text-left">
          <Shield className="w-4 h-4 text-[#f0643b] shrink-0" />
          <p className="text-[10px] text-slate-500 leading-tight">
            Encrypted session. Profile picture defaults to your initial letter and can be customized anytime in settings.
          </p>
        </div>
      </div>
    </div>
  );
};
