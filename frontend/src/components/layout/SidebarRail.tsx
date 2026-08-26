import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Users,
  Settings,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useClickOutside } from '@/hooks/useClickOutside';

type NavSection = 'chats' | 'calls' | 'contacts' | 'settings';

const navItems: { id: NavSection; icon: React.ReactNode; label: string }[] = [
  { id: 'chats', icon: <MessageSquare size={22} />, label: 'Chats' },
  { id: 'calls', icon: <Phone size={22} />, label: 'Calls' },
  { id: 'contacts', icon: <Users size={22} />, label: 'Contacts' },
  { id: 'settings', icon: <Settings size={22} />, label: 'Settings' },
];

export function SidebarRail() {
  const [activeSection, setActiveSection] = useState<NavSection>('chats');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  const menuRef = useClickOutside<HTMLDivElement>(() => setIsProfileMenuOpen(false));

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-col items-center h-full w-20 bg-[var(--rail-bg)] border-r border-[var(--border)] py-7 px-3 shrink-0 select-none z-20">
      {/* App Logo */}
      <div className="mb-10">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/25 transition-transform hover:scale-105 cursor-pointer">
          <MessageSquare size={24} className="text-white" />
        </div>
      </div>

      {/* Navigation Items with Generous Gaps */}
      <nav className="flex flex-col items-center gap-4 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            title={item.label}
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer
              transition-all duration-200 relative group
              ${
                activeSection === item.id
                  ? 'bg-[var(--bg-active)] text-[var(--accent)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {item.icon}
            {activeSection === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent)] rounded-r-full" />
            )}
            {/* Tooltip */}
            <span className="absolute left-16 px-3 py-1.5 rounded-lg bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-30">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 mt-auto relative" ref={menuRef}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
        >
          {resolvedTheme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="cursor-pointer rounded-full ring-2 ring-transparent hover:ring-[var(--accent)] transition-all p-0.5"
          title={user?.name || 'Profile'}
        >
          <Avatar
            src={user?.avatar}
            name={user?.name || 'User'}
            size="md"
            isOnline={true}
            showOnlineIndicator
          />
        </button>

        {/* Profile / Logout Menu Dropdown */}
        {isProfileMenuOpen && (
          <div className="absolute bottom-2 left-16 w-60 bg-[var(--modal-bg)] border border-[var(--border)] rounded-2xl shadow-2xl p-3 z-50 animate-scale-in">
            <div className="px-3 py-3 border-b border-[var(--border)] mb-1">
              <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                {user?.name || 'Astitva Sharma'}
              </p>
              <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                {user?.email || 'user@example.com'}
              </p>
            </div>

            <div className="py-1 space-y-1">
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors cursor-pointer"
              >
                <UserIcon size={16} className="text-[var(--text-secondary)]" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger-light)] rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
