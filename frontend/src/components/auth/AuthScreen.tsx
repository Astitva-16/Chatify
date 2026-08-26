import { useState } from 'react';
import {
  MessageSquare,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { signIn, signUp, loginAsGuest } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    if (!isLogin && !fullName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }

    setLoading(true);

    if (isLogin) {
      const res = await signIn(email, password);
      setLoading(false);
      if (res.error) {
        setErrorMsg(res.error);
      }
    } else {
      const res = await signUp(email, password, fullName);
      setLoading(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.message) {
        setSuccessMsg(res.message);
      }
    }
  };

  const handleDemoLogin = () => {
    loginAsGuest(isLogin ? 'Astitva Sharma' : fullName || 'Demo User');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] chat-wallpaper transition-colors duration-200 select-none">
      {/* Top Bar with Brand & Theme Toggle */}
      <header className="w-full max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
            <MessageSquare size={22} className="text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Connect
            </span>
            <span className="ml-2.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
              REAL-TIME
            </span>
          </div>
        </div>

        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
          title="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <>
              <Sun size={17} /> Light Mode
            </>
          ) : (
            <>
              <Moon size={17} /> Dark Mode
            </>
          )}
        </button>
      </header>

      {/* Main Container with generous padding */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[460px] bg-[var(--modal-bg)] border border-[var(--border)] rounded-3xl shadow-2xl p-9 md:p-10 backdrop-blur-sm transition-all animate-scale-in">
          {/* Header Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2 font-normal leading-relaxed">
              {isLogin
                ? 'Sign in to access your real-time chats & calls'
                : 'Join Connect to message friends & groups securely'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1.5 bg-[var(--bg-input)] rounded-2xl mb-7">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isLogin
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-[var(--danger-light)] border border-[var(--danger)]/30 text-[var(--danger)] text-xs font-medium leading-relaxed animate-fade-in">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-[var(--accent-light)] border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-medium leading-relaxed animate-fade-in">
              {successMsg}
            </div>
          )}

          {/* Form with generous gaps */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon
                    size={17}
                    className="absolute left-4 text-[var(--text-secondary)]"
                  />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Astitva Sharma"
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[var(--bg-input)] text-[var(--text-primary)] text-sm border border-transparent focus:border-[var(--accent)] outline-none placeholder:text-[var(--text-placeholder)] transition-colors shadow-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail
                  size={17}
                  className="absolute left-4 text-[var(--text-secondary)]"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[var(--bg-input)] text-[var(--text-primary)] text-sm border border-transparent focus:border-[var(--accent)] outline-none placeholder:text-[var(--text-placeholder)] transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={17}
                  className="absolute left-4 text-[var(--text-secondary)]"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-12 rounded-2xl bg-[var(--bg-input)] text-[var(--text-primary)] text-sm border border-transparent focus:border-[var(--accent)] outline-none placeholder:text-[var(--text-placeholder)] transition-colors shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-[var(--accent)]/25 disabled:opacity-50 mt-3"
            >
              {loading ? (
                <span>Connecting...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Connect' : 'Create Account'}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative flex items-center justify-center my-7">
            <div className="border-t border-[var(--border)] w-full" />
            <span className="bg-[var(--modal-bg)] px-4 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider shrink-0">
              Instant Access
            </span>
            <div className="border-t border-[var(--border)] w-full" />
          </div>

          {/* Guest / Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full h-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition-colors shadow-sm"
          >
            <Sparkles size={17} className="text-[var(--accent)]" />
            <span>Continue as Guest / Demo Mode</span>
          </button>

          {/* Security & Feature Note */}
          <div className="mt-7 pt-6 border-t border-[var(--border)] flex items-center justify-center gap-5 text-[11.5px] text-[var(--text-secondary)] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[var(--accent)]" /> End-to-end encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap size={15} className="text-[var(--accent)]" /> Realtime sync
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-[var(--text-secondary)] font-medium">
        Connect Real-Time Messenger • Built with Supabase, React & Tailwind CSS
      </footer>
    </div>
  );
}

