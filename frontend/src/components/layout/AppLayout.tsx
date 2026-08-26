import { SidebarRail } from '@/components/layout/SidebarRail';
import { ChatSidebar } from '@/components/layout/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInfoPanel } from '@/components/panel/ChatInfoPanel';
import { NewChatModal } from '@/components/modals/NewChatModal';
import { ToastContainer } from '@/components/ui/Toast';
import { useChatContext } from '@/contexts/ChatContext';
import { useIsMobile } from '@/hooks/useMediaQuery';

export function AppLayout() {
  const {
    activeConversationId,
    isInfoPanelOpen,
    isNewChatModalOpen,
    isMobileShowingChat,
    toggleNewChatModal,
  } = useChatContext();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)] select-none">
      {/* 1. Navigation Rail — hidden on mobile */}
      {!isMobile && <SidebarRail />}

      {/* 2. Chat Sidebar — hidden on mobile when viewing a chat */}
      {(!isMobile || !isMobileShowingChat) && <ChatSidebar />}

      {/* 3. Main Center Chat & Optional Right Panel */}
      {(!isMobile || isMobileShowingChat) && (
        <div className="flex flex-1 min-w-0 h-full overflow-hidden">
          <ChatWindow />

          {/* 4. Right-side Info Panel — desktop only, cleanly side-by-side */}
          {!isMobile && isInfoPanelOpen && activeConversationId && (
            <ChatInfoPanel />
          )}
        </div>
      )}

      {/* New Chat Modal */}
      {isNewChatModalOpen && (
        <NewChatModal
          isOpen={isNewChatModalOpen}
          onClose={toggleNewChatModal}
        />
      )}

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
