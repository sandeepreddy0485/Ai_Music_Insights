import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Library, BarChart3, LogOut, User as UserIcon } from 'lucide-react';

export const Sidebar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-64 bg-black flex flex-col h-full gap-2 p-2 shrink-0">
            {/* Top Nav Box */}
            <div className="bg-[#121212] rounded-lg p-6 flex flex-col gap-6">
                <Link to="/search" className="flex items-center gap-3 group mb-2">
                    {/* Recreated Logo SVG with Gradients */}
                    <div className="relative flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8">
                            <defs>
                                <linearGradient id="logo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                            <path fill="url(#logo-grad)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
                            <circle cx="12" cy="12" r="2" fill="url(#logo-grad)" />
                            <path fill="url(#logo-grad)" d="M12.5 7v5.26c-.47-.16-.97-.26-1.5-.26-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V9h3V7h-5.5z" />
                        </svg>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold text-2xl tracking-tight leading-none">
                            <span className="text-white">Music</span><span className="text-transparent bg-gradient-to-r from-purple-500 to-pink-500 inline-block" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Insights</span>
                        </span>
                        <div className="flex items-center gap-1 mt-1 justify-between w-full">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <span className="text-[8px] uppercase tracking-widest text-[#b3b3b3]">Discover. Collect. Listen.</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        </div>
                    </div>
                </Link>
                <Link to="/search" className={`flex items-center gap-4 text-sm font-bold transition-colors ${isActive('/search') ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}>
                    <Search className="w-6 h-6" />
                    <span>Search</span>
                </Link>
            </div>

            {/* Library Box */}
            <div className="bg-[#121212] rounded-lg px-4 flex-1 flex flex-col">
                <div className="py-4 mt-2">
                    <Link to="/library" className={`flex items-center gap-4 text-sm font-bold transition-colors ${isActive('/library') ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}>
                        <Library className="w-6 h-6" />
                        <span>Your Library</span>
                    </Link>
                </div>

                <div className="py-2 flex flex-col gap-4 flex-1">
                    <Link to="/dashboard" className={`flex items-center gap-4 text-sm font-bold transition-colors ${isActive('/dashboard') ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}>
                        <BarChart3 className="w-6 h-6" />
                        <span>Analytics & AI</span>
                    </Link>
                </div>

                {/* User Profile & Logout Bottom */}
                <div className="py-4 pb-6 mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#282828] flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-[#b3b3b3]" />
                            </div>
                            <span className="font-bold text-white text-sm max-w-[100px] truncate">{user?.name}</span>
                        </div>
                        <button onClick={logout} className="text-[#b3b3b3] hover:text-white transition-colors p-2" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
