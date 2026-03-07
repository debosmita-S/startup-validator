import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, History, Zap, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Navbar() {
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const navLinks = [
        { to: '/', label: 'Analyze', icon: Zap },
        { to: '/history', label: 'History', icon: History },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b-4 border-borderDark bg-[#F5F5F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 flex items-center justify-center bg-brandPrimary border-2 border-borderDark shadow-[2px_2px_0_0_#000] group-hover:translate-x-1 transition-transform">
                                <Rocket size={20} className="text-white" strokeWidth={3} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase hidden sm:inline-block">
                                <span className="border-b-4 border-brandPrimary">Startup</span>
                                <span className="text-borderDark ml-1">Validator</span>
                            </span>
                        </Link>

                        {/* Nav links */}
                        <div className="flex items-center gap-3">
                            {navLinks.map(({ to, label, icon: Icon }) => {
                                const isActive = location.pathname === to;
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 font-black uppercase text-sm border-2 border-borderDark transition-all duration-100 ${isActive
                                            ? 'bg-[#10B981] text-borderDark shadow-[2px_2px_0_0_#000]'
                                            : 'bg-white text-borderDark hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#000]'
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={3} />
                                        <span className="hidden sm:inline">{label}</span>
                                    </Link>
                                );
                            })}

                            <div className="w-px h-8 bg-borderDark mx-2"></div>

                            {isAuthenticated ? (
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 font-black uppercase text-sm border-2 border-borderDark bg-[#EF4444] text-white hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all duration-100"
                                >
                                    <LogOut size={18} strokeWidth={3} />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 font-black uppercase text-sm border-2 border-borderDark bg-brandPrimary text-white shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] transition-all duration-100"
                                >
                                    <LogIn size={18} strokeWidth={3} />
                                    <span className="hidden sm:inline">Login</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    );
}
