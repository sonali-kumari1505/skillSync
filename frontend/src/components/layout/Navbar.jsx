import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Sun,
  Moon,
  Bell,
  Check,
  User,
  LogOut,
  Shield,
  Layers,
  MessageSquare,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-brand-600 dark:from-white dark:via-slate-200 dark:to-brand-400 bg-clip-text text-transparent">
                SkillSync
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 -mt-1">
                AI Exchange
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Public or Logged In) */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/explore"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/explore'
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  Explore Peers
                </Link>
                <Link
                  to="/recommendations"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    location.pathname === '/recommendations'
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                  <span>AI Matches</span>
                </Link>
                <Link
                  to="/requests"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/requests'
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  Requests
                </Link>
                <Link
                  to="/chat"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/chat')
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Chat</span>
                </Link>
                <Link
                  to="/progress"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    location.pathname === '/progress'
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Roadmaps</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-rose-500 dark:text-rose-400 font-semibold ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-rose-500/10'
                        : 'hover:bg-rose-500/10'
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <a
                  href="#how-it-works"
                  className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  How it Works
                </a>
                <a
                  href="#features"
                  className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#ai-matching"
                  className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                  <span>AI Engine</span>
                </a>
              </>
            )}
          </div>

          {/* Right Controls: Theme Toggle, Notifications, Auth/Profile */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0c0d12]" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" />
                            <span>Mark all read</span>
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) {
                                  setShowNotifications(false);
                                  navigate(n.link);
                                }
                              }}
                              className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition ${
                                !n.isRead
                                  ? 'bg-brand-500/[0.03] dark:bg-brand-500/[0.05]'
                                  : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                  {n.title}
                                </h5>
                                {!n.isRead && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition"
                  >
                    <img
                      src={
                        profile?.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                      }
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium hidden sm:inline text-slate-700 dark:text-slate-300">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {profile?.college || user.role}
                        </span>
                      </div>

                      <div className="py-1 text-xs text-slate-700 dark:text-slate-300">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <User className="h-4 w-4 text-slate-400" />
                          <span>My Student Profile</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <Layers className="h-4 w-4 text-slate-400" />
                          <span>Student Dashboard</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-rose-500 font-semibold"
                          >
                            <Shield className="h-4 w-4" />
                            <span>Admin Management</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" icon={ArrowRight}>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-[#13151c] border-b border-slate-200 dark:border-slate-800 text-sm">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Explore Peers
              </Link>
              <Link
                to="/recommendations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                AI Matches
              </Link>
              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Exchange Requests
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Real-Time Chat
              </Link>
              <Link
                to="/progress"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Learning Roadmaps
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Edit Profile
              </Link>
            </>
          ) : (
            <>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                How it Works
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Features
              </a>
              <a
                href="#ai-matching"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                AI Engine
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
