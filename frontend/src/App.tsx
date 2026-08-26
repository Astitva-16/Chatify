import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { MessageSquare } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-xl shadow-[var(--accent)]/30 animate-pulse mb-4">
          <MessageSquare size={30} className="text-white" />
        </div>
        <p className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
          Connect
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Loading your conversations...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <ChatProvider>
      <AppLayout />
    </ChatProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
