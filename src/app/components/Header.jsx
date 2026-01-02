"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LayoutDashboard, PlusCircle } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import AuthModal from './AuthModal';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const { isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch user role with retries
    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 3;

        const fetchUserRole = async () => {
            if (!isSignedIn) {
                setUserRole(null);
                return;
            }

            try {
                const res = await fetch('/api/user');
                const data = await res.json();

                if (data.success && data.data?.role) {
                    setUserRole(data.data.role);
                } else if (!data.data?.role && retryCount < maxRetries) {
                    // Try again in case of race condition during registration
                    retryCount++;
                    setTimeout(fetchUserRole, 2000);
                }
            } catch (error) {
                console.error('Failed to fetch user role:', error);
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchUserRole, 3000);
                }
            }
        };

        if (isSignedIn && isLoaded) {
            fetchUserRole();
        }
    }, [isSignedIn, isLoaded, user]);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${(scrolled || isOpen) ? 'bg-black shadow-lg border-b border-white/10' : 'bg-transparent'
                    }`}
            >
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                            <span className="text-white">Speed</span><span className="text-red-600">ster</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/#models" className="text-gray-300 hover:text-white transition-colors capitalize font-medium">
                                Models
                            </Link>

                            <SignedIn>
                                {/* SELLERS SECTION */}
                                {userRole === 'seller' && (
                                    <>
                                        <Link
                                            href="/dashboard/seller"
                                            className="text-gray-300 hover:text-white transition-colors capitalize font-medium"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard/seller"
                                            className="flex items-center gap-2 text-white bg-red-600 px-5 py-2 rounded-full border border-red-600 hover:bg-red-700 hover:scale-105 transition-all capitalize font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            List a car
                                        </Link>
                                    </>
                                )}

                                {/* BUYERS SECTION */}
                                {userRole === 'buyer' && (
                                    <Link
                                        href="/dashboard/buyer"
                                        className="text-gray-300 hover:text-white transition-colors capitalize font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {/* FALLBACK FOR SYNCING STATE */}
                                {(userRole === null && isLoaded && isSignedIn) && (
                                    <Link
                                        href="/select-role"
                                        className="text-gray-400 hover:text-white transition-colors text-sm italic"
                                    >
                                        Setting up account...
                                    </Link>
                                )}
                            </SignedIn>

                            <Link href="/#features" className="text-gray-300 hover:text-white transition-colors capitalize font-medium">
                                Features
                            </Link>

                            <SignedIn>
                                <div className="pl-4 border-l border-white/10 h-10 flex items-center">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-10 h-10 border-2 border-red-600 hover:scale-110 transition-all"
                                            }
                                        }}
                                    />
                                </div>
                            </SignedIn>

                            <SignedOut>
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="bg-red-600 text-white px-8 py-2.5 rounded-full hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-600/20"
                                >
                                    Sign In
                                </button>
                            </SignedOut>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-white z-50 p-2"
                        >
                            {isOpen ? <X className="w-6 h-6 bg-red-600 rounded-lg p-0.5" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-6 space-y-4 bg-black/95 backdrop-blur-xl -mx-6 px-6"
                        >
                            <Link
                                href="/#models"
                                className="block text-gray-300 hover:text-white transition-colors py-3 border-b border-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                Models
                            </Link>

                            <SignedIn>
                                {userRole === 'seller' && (
                                    <>
                                        <Link
                                            href="/dashboard/seller"
                                            className="block text-gray-300 hover:text-white transition-colors py-3 border-b border-white/10"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard/seller"
                                            className="block text-red-500 font-bold py-3 border-b border-white/10 flex items-center gap-2"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            List a car
                                        </Link>
                                    </>
                                )}

                                {userRole === 'buyer' && (
                                    <Link
                                        href="/dashboard/buyer"
                                        className="block text-gray-300 hover:text-white transition-colors py-3 border-b border-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </SignedIn>

                            <Link
                                href="/#features"
                                className="block text-gray-300 hover:text-white transition-colors py-3 border-b border-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                Features
                            </Link>

                            <SignedIn>
                                <div className="pt-4 flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Account</span>
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </SignedIn>

                            <SignedOut>
                                <button
                                    onClick={() => {
                                        setShowAuthModal(true);
                                        setIsOpen(false);
                                    }}
                                    className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all w-full font-bold mt-4"
                                >
                                    Sign In
                                </button>
                            </SignedOut>
                        </motion.div>
                    )}
                </nav>
            </motion.header>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
}
