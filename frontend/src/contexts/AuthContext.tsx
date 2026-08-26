import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import { currentUser as mockUser } from '@/data/mockData';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error?: string; message?: string }>;
  loginAsGuest: (customName?: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('connect_guest_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync Supabase Auth State
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const authUser = session.user;
          const name =
            authUser.user_metadata?.full_name ||
            authUser.email?.split('@')[0] ||
            'User';
          setUser({
            id: authUser.id,
            name,
            email: authUser.email || '',
            avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
            about: 'Available',
            lastSeen: new Date(),
            isOnline: true,
            status: 'online',
          });
        }
      } catch (err) {
        console.warn('Supabase session note:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const authUser = session.user;
          const name =
            authUser.user_metadata?.full_name ||
            authUser.email?.split('@')[0] ||
            'User';
          setUser({
            id: authUser.id,
            name,
            email: authUser.email || '',
            avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
            about: 'Available',
            lastSeen: new Date(),
            isOnline: true,
            status: 'online',
          });
          localStorage.removeItem('connect_guest_user');
        } else {
          if (!localStorage.getItem('connect_guest_user')) {
            setUser(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        const name =
          data.user.user_metadata?.full_name ||
          data.user.email?.split('@')[0] ||
          'User';
        const loggedUser: User = {
          id: data.user.id,
          name,
          email: data.user.email || email,
          avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
          about: 'Available',
          lastSeen: new Date(),
          isOnline: true,
          status: 'online',
        };
        setUser(loggedUser);
        localStorage.removeItem('connect_guest_user');
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to sign in' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user && !data.session) {
        return {
          message: 'Account created! Please check your email to confirm your signup.',
        };
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to sign up' };
    }
  };

  const loginAsGuest = (customName?: string) => {
    const name = customName || mockUser.name || 'Demo User';
    const guestUser: User = {
      ...mockUser,
      name,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };
    setUser(guestUser);
    localStorage.setItem('connect_guest_user', JSON.stringify(guestUser));
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out note:', e);
    }
    localStorage.removeItem('connect_guest_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        loginAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

