import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Menu,
  Plus,
  Send,
  Sparkles,
  Paperclip,
  Mic,
  MessageSquare,
  Bot,
  User,
  History,
  Settings,
  Shield,
  X,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

export const AIChatGambit: React.FC = () => {
  const {
    setAppMode,
    setCurrentView,
    aiMessages,
    sendAIMessage,
    clearAIChat,
    contacts,
    isDrawerOpen,
    setIsDrawerOpen,
    setIsAuthModalOpen,
    user,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendAIMessage(inputVal);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNavigateToMessenger = () => {
    setIsDrawerOpen(false);
    setAppMode('messenger');
    setCurrentView('contacts');
  };

  const promptSuggestions = [
    'Explain quantum encryption protocols',
    'Draft a design sprint proposal',
    'Optimize React mobile touch responsiveness',
    'Summarize recent AI hardware advancements',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9ff] text-slate-800 relative overflow-hidden">
      {/* 3-Line Menu Drawer Overlay */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[82%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Aether Studio</h3>
                  <p className="text-[11px] text-slate-500">v4.5 Core Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Snippet in Drawer */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f0643b] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user.avatarType === 'letter' ? (
                    user.avatar
                  ) : (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="text-[11px] text-[#f0643b] hover:text-[#ff7a45] font-semibold"
              >
                Account
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div>
                <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Workspace
                </p>
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      clearAIChat();
                      setIsDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-orange-50/70 hover:text-[#f0643b] transition-colors"
                  >
                    <Plus className="w-4 h-4 text-[#f0643b]" />
                    <span>New Chat</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
                    <History className="w-4 h-4 text-slate-400" />
                    <span>Prompt Archive</span>
                  </button>
                </div>
              </div>

              {/* CRITICAL GAMBIT LINK: MESSENGER */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between px-3 mb-1.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Communications
                  </p>
                  <span className="text-[10px] font-medium text-[#f0643b] bg-orange-50 px-1.5 py-0.5 rounded">
                    Encrypted
                  </span>
                </div>

                {/* Mobile APK Installer Button */}
                <div className="mb-2.5">
                  <PWAInstallButton variant="drawer" />
                </div>

                {/* The 3-line toggle -> Messenger button! */}
                <button
                  onClick={handleNavigateToMessenger}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#f0643b] to-[#ff7a45] text-white shadow-md shadow-[#f0643b]/25 hover:from-[#e44d26] hover:to-[#f0643b] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">Chats Messenger</p>
                      <p className="text-[10px] text-white/90">
                        {contacts.length} conversations ready
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Camouflage Status Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">
                    Disguise Shield Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Incoming chats will show as Breaking News alerts with the discreet Aether emblem.
                </p>
              </div>
            </div>

            {/* Drawer Bottom */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">Stealth Gambit Mode</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot Header */}
      <div className="h-14 px-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* The 3-Line Menu Toggle Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
            title="Open Menu (Navigate to Messenger)"
          >
            <Menu className="w-5 h-5" />
            {/* Subtle discreet dot hinting at unread chat */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm tracking-tight">Aether AI</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              4.5 Flash
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <PWAInstallButton variant="header" />
          <button
            onClick={clearAIChat}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="New Conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Chat Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Welcome Banner */}
        <div className="text-center py-4 my-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">How can I help you today?</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            General purpose AI assistant. Prompt, analyze, draft, and synthesize information.
          </p>
        </div>

        {/* Suggestion Starter Chips */}
        {aiMessages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
            {promptSuggestions.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputVal(prompt);
                }}
                className="text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition-all text-xs text-slate-700 flex items-center justify-between group shadow-xs"
              >
                <span className="truncate pr-2">{prompt}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Chat Bubbles */}
        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-xs shadow-sm'
                  : 'bg-white text-slate-800 rounded-tl-xs shadow-xs border border-slate-200/80 whitespace-pre-wrap'
              }`}
            >
              {msg.content}
              <div
                className={`text-[9px] mt-1 text-right ${
                  msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Prompt Input Bar */}
      <div className="p-3 bg-white/90 backdrop-blur-md border-t border-slate-200/80 shrink-0">
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-inner">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
            title="Attach reference"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Aether anything..."
            className="flex-1 bg-transparent border-0 outline-none px-2 text-xs text-slate-800 placeholder-slate-400"
          />

          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className={`p-2 rounded-xl transition-all shadow-xs ${
              inputVal.trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
