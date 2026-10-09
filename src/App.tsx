import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';
import { DisguisedNotificationBanner } from './components/DisguisedNotificationBanner';
import { AIChatGambit } from './components/AIChatGambit';
import { ContactsView } from './components/ContactsView';
import { ChatRoom } from './components/ChatRoom';
import { SettingsView } from './components/SettingsView';
import { AccountEditView } from './components/AccountEditView';
import { NotificationsEditView } from './components/NotificationsEditView';
import { FriendInviteModal } from './components/FriendInviteModal';
import { AuthModal } from './components/AuthModal';
import { APKInstallModal } from './components/APKInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';

const AppContent: React.FC = () => {
  const { appMode, currentView } = useApp();

  return (
    <AndroidFrame>
      {/* Covert News Disguise Notification Dropdown */}
      <DisguisedNotificationBanner />

      {/* Main View Switching */}
      {appMode === 'ai' ? (
        /* GAMBIT LANDING SCREEN: Modern AI Chatbot */
        <AIChatGambit />
      ) : (
        /* STEALTH MESSENGER SCREEN (Matching attached image.png) */
        <>
          {currentView === 'contacts' && <ContactsView />}
          {currentView === 'chat' && <ChatRoom />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'account_edit' && <AccountEditView />}
          {currentView === 'notifications_edit' && <NotificationsEditView />}
        </>
      )}

      {/* Modals & Offline Indicator */}
      <FriendInviteModal />
      <AuthModal />
      <APKInstallModal />
      <OfflineIndicator />
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
