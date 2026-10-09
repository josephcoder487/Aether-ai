import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Contact,
  UserProfile,
  MessageAttachment,
  NewsNotification,
  NewsCategory,
  AIChatMessage,
} from '../types';
import { INITIAL_CONTACTS, INITIAL_USER } from '../data/defaultData';
import { generateDisguisedNotification } from '../utils/camouflage';

interface AppContextType {
  // Navigation / Gambit Mode
  appMode: 'ai' | 'messenger';
  setAppMode: (mode: 'ai' | 'messenger') => void;
  currentView: 'contacts' | 'chat' | 'settings' | 'account_edit' | 'notifications_edit';
  setCurrentView: (view: 'contacts' | 'chat' | 'settings' | 'account_edit' | 'notifications_edit') => void;
  activeContact: Contact | null;
  setActiveContactId: (id: string | null) => void;

  // Frame Display Mode
  frameMode: 'phone' | 'fullscreen';
  setFrameMode: (mode: 'phone' | 'fullscreen') => void;

  // User Profile & Auth
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  loginWithGoogle: (email?: string, name?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Contacts & Messaging
  contacts: Contact[];
  sendMessage: (contactId: string, text: string, attachment?: MessageAttachment) => void;
  simulateIncomingMessage: (contactId?: string, customText?: string, customAttachment?: MessageAttachment) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Camouflage Notifications
  disguisedNotification: NewsNotification | null;
  dismissNotification: () => void;
  openNotificationTarget: (notif: NewsNotification) => void;
  camouflageEnabled: boolean;
  setCamouflageEnabled: (enabled: boolean) => void;
  newsCategory: NewsCategory;
  setNewsCategory: (cat: NewsCategory) => void;

  // Friend Request System
  inviteLink: string;
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (open: boolean) => void;
  pendingInviteData: { name: string; username: string; id: string } | null;
  acceptInvite: () => void;
  declineInvite: () => void;
  simulateFriendJoin: (name?: string) => void;

  // AI Chat Gambit
  aiMessages: AIChatMessage[];
  sendAIMessage: (prompt: string) => void;
  clearAIChat: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;

  // APK & Mobile Install
  isAPKModalOpen: boolean;
  setIsAPKModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [appMode, setAppMode] = useState<'ai' | 'messenger'>('ai');
  const [currentView, setCurrentView] = useState<'contacts' | 'chat' | 'settings' | 'account_edit' | 'notifications_edit'>('contacts');
  const [activeContactId, setActiveContactId] = useState<string | null>('c_amber');
  const [frameMode, setFrameMode] = useState<'phone' | 'fullscreen'>('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAPKModalOpen, setIsAPKModalOpen] = useState(false);

  // User & Auth
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Contacts & Messages
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);

  // Notifications
  const [disguisedNotification, setDisguisedNotification] = useState<NewsNotification | null>(null);
  const [camouflageEnabled, setCamouflageEnabled] = useState<boolean>(true);
  const [newsCategory, setNewsCategory] = useState<NewsCategory>('tech');

  // Invites
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [pendingInviteData, setPendingInviteData] = useState<{ name: string; username: string; id: string } | null>(null);

  // AI Chat Messages for the Gambit landing screen
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([
    {
      id: 'ai_1',
      role: 'assistant',
      content: 'Hello! I am Aether AI. How can I assist you with your research, engineering, or writing tasks today?',
      timestamp: 'Just now',
    },
  ]);

  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?invite=${user.username || 'josephn'}`
    : `https://aether-chat.internal/?invite=${user.username || 'josephn'}`;

  // Check URL params for friend invite on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const inviteCode = params.get('invite');
      if (inviteCode) {
        setPendingInviteData({
          name: inviteCode.charAt(0).toUpperCase() + inviteCode.slice(1).replace(/[^a-zA-Z]/g, ''),
          username: inviteCode.toLowerCase(),
          id: `c_${inviteCode.toLowerCase()}`,
        });
      }
    }
  }, []);

  const activeContact = contacts.find((c) => c.id === activeContactId) || null;

  // User Profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      // Keep avatar initial in sync if it's letter type
      if (updates.name && (!updates.avatar || prev.avatarType === 'letter')) {
        updated.avatar = updates.name.trim().charAt(0).toUpperCase() || 'U';
      }
      return updated;
    });
  };

  const loginWithGoogle = (email = 'joseph.noah487@gmail.com', name = 'Joseph Noah') => {
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    setUser({
      id: `usr_${Date.now()}`,
      name,
      username,
      email,
      avatar: name.charAt(0).toUpperCase(),
      avatarType: 'letter',
      avatarBg: 'bg-gradient-to-tr from-indigo-500 to-purple-600',
      bio: 'Product Designer & Frontend Engineer',
      isLoggedIn: true,
    });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser({
      id: '',
      name: 'Guest User',
      username: 'guest',
      email: '',
      avatar: 'G',
      avatarType: 'letter',
      avatarBg: 'bg-gradient-to-tr from-slate-400 to-slate-600',
      bio: '',
      isLoggedIn: false,
    });
    setAppMode('ai');
    setCurrentView('contacts');
    setIsAuthModalOpen(true);
  };

  // Messaging
  const sendMessage = (contactId: string, text: string, attachment?: MessageAttachment) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      senderId: 'me',
      text,
      timestamp: timeStr,
      createdAt: Date.now(),
      attachment,
      status: 'sent' as const,
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  // Simulate incoming message and disguised notification
  const simulateIncomingMessage = (
    contactId = 'c_amber',
    customText?: string,
    customAttachment?: MessageAttachment
  ) => {
    const targetContact = contacts.find((c) => c.id === contactId) || contacts[0];
    if (!targetContact) return;

    const defaultReplies = [
      'Thanks for sending that over! Reviewing it now.',
      'Looks really impressive, great craft on the micro-interactions!',
      'Are you available for a quick sync tomorrow at 10 AM?',
      'Let me share this with our executive team right away.',
    ];
    const text = customText !== undefined ? customText : defaultReplies[Math.floor(Math.random() * defaultReplies.length)];

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;

    const newIncoming = {
      id: `m_${Date.now()}_in`,
      senderId: targetContact.id,
      text,
      timestamp: timeStr,
      createdAt: Date.now(),
      attachment: customAttachment,
      status: 'delivered' as const,
    };

    setContacts((prev) =>
      prev.map((c) => (c.id === targetContact.id ? { ...c, messages: [...c.messages, newIncoming] } : c))
    );

    // Trigger disguised notification
    if (camouflageEnabled) {
      const notif = generateDisguisedNotification(
        targetContact.id,
        targetContact.name,
        text || (customAttachment ? `Sent a ${customAttachment.type}` : 'Sent a file'),
        newsCategory
      );
      setDisguisedNotification(notif);
    }
  };

  const dismissNotification = () => {
    setDisguisedNotification(null);
  };

  const openNotificationTarget = (notif: NewsNotification) => {
    setActiveContactId(notif.contactId);
    setAppMode('messenger');
    setCurrentView('chat');
    dismissNotification();
  };

  // Friend Request Handling
  const acceptInvite = () => {
    if (!pendingInviteData) return;
    const existing = contacts.find((c) => c.id === pendingInviteData.id);
    if (!existing) {
      const newContact: Contact = {
        id: pendingInviteData.id,
        name: pendingInviteData.name,
        username: pendingInviteData.username,
        avatar: pendingInviteData.name.charAt(0).toUpperCase(),
        avatarType: 'letter',
        avatarBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600',
        verified: true,
        online: true,
        lastSeen: 'Online',
        bio: 'Connected via invite link',
        messages: [
          {
            id: `m_inv_${Date.now()}`,
            senderId: pendingInviteData.id,
            text: `Hey ${user.name}! Thanks for connecting through the invite link.`,
            timestamp: 'Just now',
            createdAt: Date.now(),
            status: 'read',
          },
        ],
      };
      setContacts((prev) => [newContact, ...prev]);
      setActiveContactId(newContact.id);
      setCurrentView('chat');
      setAppMode('messenger');
    }
    setPendingInviteData(null);
  };

  const declineInvite = () => {
    setPendingInviteData(null);
  };

  const simulateFriendJoin = (friendName = 'Elena Rostova') => {
    const friendId = `c_${Date.now()}`;
    const newFriend: Contact = {
      id: friendId,
      name: friendName,
      username: friendName.toLowerCase().replace(/\s+/g, '_'),
      avatar: friendName.charAt(0),
      avatarType: 'letter',
      avatarBg: 'bg-gradient-to-tr from-fuchsia-500 to-pink-600',
      verified: true,
      online: true,
      lastSeen: 'Online',
      bio: 'Senior UX Researcher & Motion Designer',
      messages: [
        {
          id: `m_${Date.now()}`,
          senderId: friendId,
          text: `Hi ${user.name}! I just accepted your invite link. Great to connect!`,
          timestamp: 'Just now',
          createdAt: Date.now(),
          status: 'read',
        },
      ],
    };

    setContacts((prev) => [newFriend, ...prev]);
    setIsInviteModalOpen(false);

    // Trigger disguised news notification to demonstrate camouflage!
    if (camouflageEnabled) {
      const notif = generateDisguisedNotification(
        friendId,
        friendName,
        `Hi ${user.name}! I just accepted your invite link. Great to connect!`,
        newsCategory
      );
      setDisguisedNotification(notif);
    }
  };

  // AI Chatbot logic for Gambit Landing Page
  const sendAIMessage = (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsg: AIChatMessage = {
      id: `ai_u_${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: 'Just now',
    };

    setAiMessages((prev) => [...prev, userMsg]);

    // Generate responsive AI response
    setTimeout(() => {
      let responseText = '';
      const lower = prompt.toLowerCase();
      if (lower.includes('quantum')) {
        responseText =
          'Quantum computing harnesses superposition and entanglement of qubits. Unlike classical bits that are strictly 0 or 1, qubits exist in probabilistic linear combinations, allowing simultaneous computation across exponentially large state vectors.';
      } else if (lower.includes('react') || lower.includes('code') || lower.includes('useeffect')) {
        responseText =
          'When debugging memory leaks in React useEffect, ensure your effect returns a cleanup callback (e.g. `return () => controller.abort()` or `clearInterval(timer)`). Also verify dependency arrays avoid recreating object references on every render.';
      } else if (lower.includes('email') || lower.includes('pitch')) {
        responseText =
          'Subject: Partnership Exploration: Accelerated Design Systems\n\nHi Alex,\n\nI admired your team\'s recent product launch. We specialize in zero-latency mobile touch interfaces and would love to share a short 3-slide deck tailored to your roadmap.\n\nBest,\nTeam Aether';
      } else {
        responseText = `I have analyzed your query: "${prompt}". Based on available heuristics and contextual synthesis, here is a structured breakdown with optimal recommendations for your architecture.`;
      }

      const botMsg: AIChatMessage = {
        id: `ai_b_${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: 'Just now',
      };
      setAiMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  const clearAIChat = () => {
    setAiMessages([
      {
        id: `ai_init_${Date.now()}`,
        role: 'assistant',
        content: 'New session started. How can I assist you today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        appMode,
        setAppMode,
        currentView,
        setCurrentView,
        activeContact,
        setActiveContactId,
        frameMode,
        setFrameMode,
        user,
        updateUserProfile,
        loginWithGoogle,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        contacts,
        sendMessage,
        simulateIncomingMessage,
        searchQuery,
        setSearchQuery,
        disguisedNotification,
        dismissNotification,
        openNotificationTarget,
        camouflageEnabled,
        setCamouflageEnabled,
        newsCategory,
        setNewsCategory,
        inviteLink,
        isInviteModalOpen,
        setIsInviteModalOpen,
        pendingInviteData,
        acceptInvite,
        declineInvite,
        simulateFriendJoin,
        aiMessages,
        sendAIMessage,
        clearAIChat,
        isDrawerOpen,
        setIsDrawerOpen,
        isAPKModalOpen,
        setIsAPKModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
