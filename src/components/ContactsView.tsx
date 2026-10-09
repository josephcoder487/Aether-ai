import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Search,
  Phone,
  User,
  Plus,
  MessageSquare,
  Settings,
  Sparkles,
  X,
  Share2,
} from 'lucide-react';

export const ContactsView: React.FC = () => {
  const {
    contacts,
    setActiveContactId,
    setCurrentView,
    setAppMode,
    setIsInviteModalOpen,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Personal' | 'Design' | 'Work' | 'Favourites'>('Personal');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = ['All', 'Personal', 'Design', 'Work', 'Favourites'] as const;

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeTab === 'All' ? true : contact.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  const handleSelectContact = (contactId: string) => {
    setActiveContactId(contactId);
    setCurrentView('chat');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden font-sans">
      {/* Top Header matching Left Screen in image.png */}
      <div className="pt-4 pb-3 px-6 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Chats
          </h1>

          <div className="flex items-center gap-1.5">
            {/* Install APK on Mobile */}
            <PWAInstallButton variant="header" />

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors"
              title="Search chats"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Covert AI Stealth Button */}
            <button
              onClick={() => setAppMode('ai')}
              className="w-10 h-10 rounded-full hover:bg-slate-100 text-[#f0643b] flex items-center justify-center transition-colors"
              title="Stealth AI Decoy"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {isSearchOpen && (
          <div className="mt-3 relative animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 text-xs px-4 py-2.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#f0643b]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Segmented Filter Pills Bar matching image.png */}
        <div className="mt-4 flex items-center gap-1.5 p-1 bg-[#f3f4f6] rounded-2xl overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                activeTab === cat
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Chats List Stream matching Left Screen in image.png */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1 no-scrollbar">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-medium">No chats in {activeTab}</p>
            <button
              onClick={() => setActiveTab('All')}
              className="mt-2 text-xs text-[#f0643b] font-semibold hover:underline"
            >
              View All Chats
            </button>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const lastMsg = contact.messages[contact.messages.length - 1];
            const snippet = lastMsg
              ? lastMsg.text || (lastMsg.attachment ? `[${lastMsg.attachment.type}]` : 'Attachment')
              : 'Late night, and passing mention it, flipped her. Best friend who...';

            return (
              <div
                key={contact.id}
                onClick={() => handleSelectContact(contact.id)}
                className="flex items-center justify-between py-3.5 px-2 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer group"
              >
                {/* Left: Avatar with green online dot */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-100 shadow-xs flex items-center justify-center">
                      {contact.avatarType === 'image' ? (
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            target.parentElement!.innerText = contact.name.charAt(0);
                          }}
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center text-white font-bold text-base ${
                            contact.avatarBg || 'bg-gradient-to-tr from-[#f0643b] to-amber-500'
                          }`}
                        >
                          {contact.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Small Green Online Dot on Avatar matching image.png */}
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] ring-2 ring-white"></span>
                    )}
                  </div>

                  {/* Middle: Name and snippet */}
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-normal truncate mt-0.5 max-w-[200px]">
                      {snippet}
                    </p>
                  </div>
                </div>

                {/* Right: Timestamp and coral unread pill badge */}
                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {contact.lastSeen}
                  </span>

                  {contact.unreadCount && contact.unreadCount > 0 ? (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#f0643b] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                      {contact.unreadCount}
                    </span>
                  ) : (
                    <div className="h-5" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dark Obsidian Bottom Navigation Dock matching image.png */}
      <div className="relative shrink-0">
        <div className="bg-[#1c1d21] text-white rounded-t-[32px] px-7 py-3.5 flex items-center justify-between shadow-2xl relative z-10">
          {/* Left Navigation Icons */}
          <div className="flex items-center gap-7">
            <button
              onClick={() => {}}
              className="text-slate-400 hover:text-white transition-colors"
              title="Calls"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => {}}
              className="text-slate-400 hover:text-white transition-colors"
              title="Contacts"
            >
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Elevated Floating Coral Action Button (+) */}
          <div className="relative -top-6 flex items-center justify-center">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="w-13 h-13 rounded-full bg-[#f0643b] hover:bg-[#ff7a45] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-[#f0643b]/40 ring-4 ring-white transition-all"
              title="Start New Chat / Invite Friend"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Right Navigation Icons */}
          <div className="flex items-center gap-7">
            <button
              onClick={() => {}}
              className="text-[#f0643b] relative transition-colors"
              title="Active Chats"
            >
              <MessageSquare className="w-5 h-5 fill-[#f0643b]/20" />
              {/* Subtle active indicator dot */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#f0643b]"></span>
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className="text-slate-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
