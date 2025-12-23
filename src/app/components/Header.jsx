"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import AuthModal from './AuthModal';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const { isSignedIn } = useUser();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch user role when signed in
    useEffect(() => {
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
                }
            } catch (error) {
                console.error('Failed to fetch user role:', error);
            }
        };

        fetchUserRole();
    }, [isSignedIn]);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
                    }`}
            >
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-bold">
                            Speed<span className="text-red-600">ster</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/#models" className="hover:text-red-600 transition-colors">
                                Models
                            </Link>
                            <Link href="/#features" className="hover:text-red-600 transition-colors">
                                Features
                            </Link>
                            <Link href="/#about" className="hover:text-red-600 transition-colors">
                                About
                            </Link>

                            <SignedIn>
                                {userRole === 'seller' ? (
                                    <Link
                                        href="/dashboard/seller"
                                        className="hover:text-red-600 transition-colors"
                                    >
                                        Seller Dashboard
                                    </Link>
                                ) : userRole === 'buyer' ? (
                                    <Link
                                        href="/dashboard/buyer"
                                        className="hover:text-red-600 transition-colors"
                                    >
                                        Browse Cars
                                    </Link>
                                ) : null}
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10"
                                        }
                                    }}
                                />
                            </SignedIn>

                            <SignedOut>
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                                >
                                    Sign In / Register
                                </button>
                            </SignedOut>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-white z-50"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4 space-y-4"
                        >
                            <Link
                                href="/#models"
                                className="block hover:text-red-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Models
                            </Link>
                            <Link
                                href="/#features"
                                className="block hover:text-red-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="/#about"
                                className="block hover:text-red-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                About
                            </Link>

                            <SignedIn>
                                {userRole === 'seller' ? (
                                    <Link
                                        href="/dashboard/seller"
                                        className="block hover:text-red-600 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Seller Dashboard
                                    </Link>
                                ) : userRole === 'buyer' ? (
                                    <Link
                                        href="/dashboard/buyer"
                                        className="block hover:text-red-600 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Browse Cars
                                    </Link>
                                ) : null}
                                <div className="pt-2">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-10 h-10"
                                            }
                                        }}
                                    />
                                </div>
                            </SignedIn>

                            <SignedOut>
                                <button
                                    onClick={() => {
                                        setShowAuthModal(true);
                                        setIsOpen(false);
                                    }}
                                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors w-full"
                                >
                                    Sign In / Register
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
