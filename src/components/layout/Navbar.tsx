import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DASHBOARD_PATH, PUBLIC_LINKS, ROLE_HOME_TITLE } from '../../data/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
      isActive
        ? 'text-white font-bold bg-white/10 border-b-2 border-[var(--elimu-amber-500)]'
        : 'text-stone-300 hover:text-[var(--elimu-amber-400)]'
    }`;

  return (
    <header className="sticky top-0 z-40">
      <nav className="h-[68px] bg-[var(--elimu-ink-950)] px-4 sm:px-6 flex items-center justify-between shadow-lg">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-3 shrink-0" onClick={() => setMobileOpen(false)}>
          <div className="w-10 h-10 bg-[var(--elimu-amber-500)] rounded-xl flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-display font-extrabold text-lg tracking-tight leading-tight whitespace-nowrap">
              ElimuSphere <span className="text-[var(--elimu-amber-400)]">Kenya</span>
            </span>
            <span className="text-[10px] text-[var(--elimu-green-500)] font-semibold tracking-wider whitespace-nowrap hidden sm:inline">
              KNEC CBA ALIGNED
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {PUBLIC_LINKS.map((l) => (
            <NavLink key={l.path} to={l.path} className={linkClasses} end={l.path === '/'}>
              {l.label}
            </NavLink>
          ))}
          {user && (
            <NavLink to={DASHBOARD_PATH[user.role]} className={linkClasses}>
              {ROLE_HOME_TITLE[user.role]}
            </NavLink>
          )}
        </div>

        {/* Right side: auth controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              >
                <span className="w-7 h-7 rounded-full bg-[var(--elimu-amber-500)] text-white text-xs font-bold flex items-center justify-center font-display">
                  {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <span className="text-stone-200 text-sm font-semibold max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden animate-slide-down"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="font-bold text-stone-900 text-sm truncate">{user.name}</p>
                    <p className="text-stone-400 text-xs truncate">{user.email}</p>
                  </div>
                  <Link
                    to={DASHBOARD_PATH[user.role]}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-[var(--elimu-amber-50)] hover:text-[var(--elimu-amber-600)] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-stone-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-[var(--elimu-amber-500)] text-white font-bold text-sm rounded-lg hover:bg-[var(--elimu-amber-600)] transition-colors shadow-md cursor-pointer whitespace-nowrap"
              >
                Sign Up Free
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="lg:hidden p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--elimu-ink-950)] border-t border-stone-800 shadow-2xl animate-slide-down flex flex-col p-5 gap-1 text-sm font-semibold">
          {PUBLIC_LINKS.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              end={l.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `p-3 rounded-xl transition cursor-pointer ${
                  isActive ? 'bg-[var(--elimu-amber-500)]/15 text-[var(--elimu-amber-400)] border border-[var(--elimu-amber-500)]/30' : 'text-stone-300 hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink
                to={DASHBOARD_PATH[user.role]}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `p-3 rounded-xl transition cursor-pointer ${
                    isActive ? 'bg-[var(--elimu-amber-500)]/15 text-[var(--elimu-amber-400)] border border-[var(--elimu-amber-500)]/30' : 'text-stone-300 hover:bg-white/5'
                  }`
                }
              >
                {ROLE_HOME_TITLE[user.role]}
              </NavLink>
              <div className="pt-3 mt-2 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-bold">{user.name}</p>
                  <p className="text-stone-400 text-xs">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 mt-2 border-t border-stone-800 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg border border-stone-700 text-stone-200 font-bold text-sm cursor-pointer"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg bg-[var(--elimu-amber-500)] text-white font-bold text-sm cursor-pointer"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
