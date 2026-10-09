import React from 'react';
import { useApp } from '../context/AppContext';
import { NewsCategory } from '../types';
import {
  ChevronLeft,
  Shield,
  Bell,
  Sparkles,
  Cpu,
  TrendingUp,
  Globe,
  Trophy,
  Check,
  Play,
} from 'lucide-react';

export const NotificationsEditView: React.FC = () => {
  const {
    setCurrentView,
    camouflageEnabled,
    setCamouflageEnabled,
    newsCategory,
    setNewsCategory,
    simulateIncomingMessage,
    activeContact,
  } = useApp();

  const categories: { id: NewsCategory; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'tech',
      label: 'Technology & Hardware',
      desc: 'Semiconductors, cloud infrastructure, quantum computing',
      icon: <Cpu className="w-4 h-4 text-[#f0643b]" />,
    },
    {
      id: 'finance',
      label: 'Financial Markets',
      desc: 'Stock indices, central banks, trade reports',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'world',
      label: 'World News & Science',
      desc: 'Transit projects, ocean treaties, space science',
      icon: <Globe className="w-4 h-4 text-sky-500" />,
    },
    {
      id: 'sports',
      label: 'Sports & Athletics',
      desc: 'Championship highlights, tournament recaps',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafbfc] relative overflow-hidden font-sans">
      {/* Header */}
      <div className="pt-4 pb-3 px-6 bg-white shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('settings')}
            className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notifications</h1>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 no-scrollbar">
        {/* Stealth Gambit Explainer Card */}
        <div className="bg-[#18191d] text-white rounded-3xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#ff8c5a] ring-1 ring-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Covert News Notifications</h3>
              <p className="text-[11px] text-slate-400">Decoy notification gambit</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When another user sends you a message, your phone displays a realistic breaking news headline instead of revealing private text. You can identify them by the discreet <strong>Aether logo badge</strong>.
          </p>
        </div>

        {/* Master Toggle */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-[#f0643b]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Camouflage Mode</h4>
              <p className="text-[11px] text-slate-400">Mask all incoming chats as news</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={camouflageEnabled}
              onChange={(e) => setCamouflageEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f0643b]"></div>
          </label>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-900">Disguise Theme Category</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setNewsCategory(cat.id)}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  newsCategory === cat.id
                    ? 'border-[#f0643b] bg-orange-50/50 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{cat.label}</p>
                    <p className="text-[10px] text-slate-500">{cat.desc}</p>
                  </div>
                </div>

                {newsCategory === cat.id && (
                  <div className="w-5 h-5 rounded-full bg-[#f0643b] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Test Notification Button */}
        <div className="pt-2">
          <button
            onClick={() => simulateIncomingMessage(activeContact?.id || 'c_kathryn')}
            className="w-full h-12 rounded-2xl bg-[#f0643b] hover:bg-[#ff7a45] text-white font-semibold text-xs shadow-md shadow-[#f0643b]/25 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Test Disguised Notification Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
