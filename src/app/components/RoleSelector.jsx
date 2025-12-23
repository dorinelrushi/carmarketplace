"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Store, X } from 'lucide-react';

export default function RoleSelector({ onRoleSelected }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const selectRole = async (role) => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });

            const data = await res.json();

            if (data.success) {
                onRoleSelected(role);
            } else {
                // Show error if role is already set
                setError(data.error || 'Failed to set role');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 rounded-2xl p-8 max-w-2xl w-full border border-zinc-800"
            >
                <h2 className="text-3xl font-bold mb-2 text-center">
                    Welcome to <span className="text-red-600">Speedster</span>
                </h2>
                <p className="text-gray-400 text-center mb-4">
                    Choose your role to get started
                </p>

                {/* Warning about permanent role selection */}
                <div className="bg-yellow-900/20 border border-yellow-600/50 text-yellow-200 p-4 rounded-lg mb-6">
                    <p className="text-sm font-medium text-center">
                        ⚠️ <strong>Important:</strong> Your role selection is permanent and cannot be changed later. Choose carefully!
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-600 text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Buyer Option */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectRole('buyer')}
                        disabled={loading}
                        className="bg-zinc-950 border-2 border-zinc-800 hover:border-red-600 rounded-xl p-8 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <div className="flex items-center justify-center w-16 h-16 bg-red-600/10 rounded-full mb-4 group-hover:bg-red-600/20 transition-colors">
                            <ShoppingCart className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Buyer</h3>
                        <p className="text-gray-400 text-sm">
                            Browse and purchase premium cars from verified sellers
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                            <li>✓ View all available cars</li>
                            <li>✓ Contact sellers directly</li>
                            <li>✓ Negotiate prices via WhatsApp</li>
                            <li>✓ Find your dream car</li>
                        </ul>
                    </motion.button>

                    {/* Seller Option */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectRole('seller')}
                        disabled={loading}
                        className="bg-zinc-950 border-2 border-zinc-800 hover:border-red-600 rounded-xl p-8 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <div className="flex items-center justify-center w-16 h-16 bg-red-600/10 rounded-full mb-4 group-hover:bg-red-600/20 transition-colors">
                            <Store className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Seller</h3>
                        <p className="text-gray-400 text-sm">
                            List your premium cars and manage your inventory
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                            <li>✓ Post car listings</li>
                            <li>✓ Edit & delete your cars</li>
                            <li>✓ Connect with buyers</li>
                            <li>✓ Manage your inventory</li>
                        </ul>
                    </motion.button>
                </div>

                {loading && (
                    <div className="mt-6 text-center text-gray-400">
                        Setting up your account...
                    </div>
                )}
            </motion.div>
        </div>
    );
}
