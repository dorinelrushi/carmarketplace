"use client";
import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, MessageSquare, Eye, Car } from 'lucide-react';
import Link from 'next/link';

export default function OwnersPage() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const res = await fetch('/api/owners', { cache: 'no-store' });
                const data = await res.json();
                if (data.success) {
                    setOwners(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch owners:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOwners();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-4 py-1.5 rounded-full text-red-500 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Trophy className="w-4 h-4" />
                            Elite Marketplace Leaders
                        </motion.div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-6">
                            Top <span className="text-red-600">Sellers</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Meet the most influential automotive enthusiasts and commercial dealers in our ecosystem, ranked by engagement and inventory.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-zinc-900 h-80 rounded-[3rem] animate-pulse border border-white/5"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {owners.map((owner, index) => (
                                <motion.div
                                    key={owner._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-zinc-900 rounded-[3rem] p-10 border border-white/5 hover:border-red-600/50 transition-all group relative overflow-hidden"
                                >
                                    {/* Rank Badge */}
                                    <div className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-2xl text-gray-700 group-hover:text-red-600 transition-colors">
                                        #{index + 1}
                                    </div>

                                    {/* Profile */}
                                    <div className="mb-8">
                                        <div className="w-20 h-20 rounded-[2rem] overflow-hidden mb-6 shadow-2xl shadow-red-600/20">
                                            {owner.profileImage && owner.profileImage.length > 5 ? (
                                                <img
                                                    src={owner.profileImage}
                                                    alt={owner.sellerName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-full h-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-3xl font-black text-white ${owner.profileImage && owner.profileImage.length > 5 ? 'hidden' : 'flex'}`}
                                            >
                                                {owner.sellerName?.charAt(0) || 'S'}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-1 truncate">{owner.sellerName}</h3>
                                        <p className="text-gray-500 text-sm font-medium">Joined {new Date(owner.joined).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Car className="w-4 h-4 text-red-600" />
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Inventory</span>
                                            </div>
                                            <p className="text-xl font-bold">{owner.totalCars}</p>
                                        </div>
                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Eye className="w-4 h-4 text-red-600" />
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Views</span>
                                            </div>
                                            <p className="text-xl font-bold">{owner.totalViews?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 col-span-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="w-4 h-4 text-green-500" />
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Direct Inquiries</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-xl font-bold">{owner.totalClicks?.toLocaleString() || 0}</p>
                                                <span className="text-green-500 text-[10px] font-bold">via WhatsApp</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Gallery */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">Featured Listings</p>
                                        <div className="flex gap-2">
                                            {owner.cars.slice(0, 3).map((car, i) => (
                                                <div key={i} className="w-full aspect-square rounded-xl overflow-hidden border border-white/10">
                                                    <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                </div>
                                            ))}
                                            {owner.totalCars > 3 && (
                                                <Link href="/cars" className="w-full aspect-square bg-zinc-800 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white hover:bg-zinc-700 transition-all">
                                                    +{owner.totalCars - 3}
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-all"></div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Footer CTA */}
                    <div className="mt-32 bg-zinc-900 rounded-[4rem] p-16 text-center border border-white/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">Become a <span className="text-red-600">Premium Seller</span></h2>
                            <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">
                                Join our elite network of dealers and start showcasing your automotive collection to thousands of enthusiasts worldwide.
                            </p>
                            <Link href="/dashboard/seller" className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-wider hover:bg-red-700 hover:scale-105 transition-all shadow-xl shadow-red-600/30">
                                Register as Seller
                            </Link>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                            <span className="text-[20rem] font-black uppercase italic">SPEEDSTER</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
