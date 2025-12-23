"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Tag } from 'lucide-react';
import { SignUpButton, SignInButton } from "@clerk/nextjs";

export default function AuthModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-zinc-900 w-full max-w-2xl rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-8 md:p-12 text-center">
                            <h2 className="text-3xl font-bold mb-4">Welcome to <span className="text-red-600">Speedster</span></h2>
                            <p className="text-gray-400 mb-10">Choose how you want to continue</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Buyer Option */}
                                <SignUpButton
                                    mode="modal"
                                    forceRedirectUrl="/dashboard/buyer"
                                    signInForceRedirectUrl="/dashboard/buyer"
                                >
                                    <button className="group relative p-6 bg-black border border-zinc-800 rounded-2xl hover:border-red-600 transition-all text-left hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                                        <div className="bg-zinc-900 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                            <ShoppingBag className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">I want to Buy</h3>
                                        <p className="text-sm text-gray-400 group-hover:text-gray-300">Browse our exclusive collection of luxury vehicles.</p>
                                    </button>
                                </SignUpButton>

                                {/* Seller Option */}
                                <SignUpButton
                                    mode="modal"
                                    forceRedirectUrl="/dashboard/seller"
                                    signInForceRedirectUrl="/dashboard/seller"
                                >
                                    <button className="group relative p-6 bg-black border border-zinc-800 rounded-2xl hover:border-red-600 transition-all text-left hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                                        <div className="bg-zinc-900 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                            <Tag className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">I want to Sell</h3>
                                        <p className="text-sm text-gray-400 group-hover:text-gray-300">List your vehicle and reach premium buyers.</p>
                                    </button>
                                </SignUpButton>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
