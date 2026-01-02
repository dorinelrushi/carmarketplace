"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, MapPin, Gauge } from 'lucide-react';
import Header from '../../components/Header';
import Link from 'next/link';

export default function BuyerDashboard() {
    const { user } = useUser();
    const router = useRouter();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await fetch('/api/cars', { cache: 'no-store' });
                const data = await res.json();
                if (data.success) {
                    setCars(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch cars:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        if (/[^0-9.,\s]/.test(price)) return price;
        const num = parseFloat(price.replace(/,/g, ''));
        if (isNaN(num)) return price;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="pt-28 pb-20 px-6">
                <div className="container mx-auto">
                    <div className="mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4"
                        >
                            The <span className="text-red-600">Marketplace</span>
                        </motion.h1>
                        <p className="text-gray-500 font-medium">Welcome back, {user?.firstName}. Discover automotive excellence.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {cars.map((car) => (
                                <motion.div
                                    key={car._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="group relative bg-zinc-900/50 rounded-[32px] overflow-hidden border border-white/5 hover:border-red-600/30 transition-all duration-500"
                                >
                                    <div className="h-60 relative overflow-hidden">
                                        <img
                                            src={car.images?.[0] || car.imageUrl}
                                            alt={car.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                                        <div className="absolute top-6 right-6 flex gap-2">
                                            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                                                {car.type}
                                            </span>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md ${car.listingType === 'rent' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                                                {car.listingType === 'rent' ? 'Rent' : 'Sale'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-black italic uppercase tracking-tighter line-clamp-1 mb-1 group-hover:text-red-600 transition-colors uppercase">{car.title}</h3>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <MapPin className="w-3 h-3 text-red-600" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{car.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Gauge className="w-3 h-3 text-red-600" />
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Specs</span>
                                                </div>
                                                <p className="text-xs font-bold text-white uppercase">{car.year} • {car.mileage.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">{car.listingType === 'rent' ? 'Daily Rate' : 'Price'}</p>
                                                <p className="text-sm font-black text-red-500">
                                                    {car.listingType === 'rent' ? car.rentalPrice : formatPrice(car.price)}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/car/${car.slug}`}
                                            className="w-full py-4 rounded-2xl bg-white text-black hover:bg-red-600 hover:text-white transition-all font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 group/btn"
                                        >
                                            View Asset
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
