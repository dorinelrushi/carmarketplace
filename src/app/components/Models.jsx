"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Gauge, Zap, Trophy, Loader2, MessageCircle, ArrowRight } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

const categories = ["All", "Sports", "SUV", "Electric", "Sedan", "Truck", "Luxury"];

export default function Models() {
    const { isSignedIn } = useUser();
    const [filter, setFilter] = useState("All");
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
                console.error("Failed to fetch cars:", error);
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

    const filteredCars = filter === "All"
        ? cars
        : cars.filter(car => car.type === filter);

    return (
        <section id="models" className="py-24 bg-zinc-950 text-white min-h-screen relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-red-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block"
                        >
                            Exclusive Collection
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter"
                        >
                            The <span className="text-red-600">Showroom</span>
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap gap-2 bg-zinc-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-sm"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === cat
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-105'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        <div className="col-span-full flex justify-center items-center h-64">
                            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                        </div>
                    ) : filteredCars.length === 0 ? (
                        <div className="col-span-full text-center py-24 bg-zinc-900/30 rounded-[40px] border border-white/5 border-dashed">
                            <p className="text-gray-500 text-xl font-medium">No vehicles matching your criteria</p>
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {filteredCars.map((car) => (
                                <motion.div
                                    layout
                                    key={car._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="group relative bg-zinc-900/40 rounded-[32px] overflow-hidden border border-white/5 hover:border-red-600/30 transition-all duration-500"
                                >
                                    {/* Image Holder */}
                                    <div className="h-64 w-full relative overflow-hidden">
                                        <img
                                            src={car.images?.[0] || car.imageUrl}
                                            alt={car.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-red-500/20">
                                                {car.type}
                                            </span>
                                            <span className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-white/10 backdrop-blur-md ${car.status === 'sold' ? 'bg-red-900/80 text-red-200' : car.status === 'reserved' ? 'bg-yellow-900/80 text-yellow-200' : 'bg-green-900/80 text-green-200'}`}>
                                                {car.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1 line-clamp-1 group-hover:text-red-500 transition-colors uppercase">{car.title}</h3>
                                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{car.location}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{car.listingType === 'rent' ? 'Daily' : 'Sale'}</p>
                                                <p className="text-white font-black text-2xl tracking-tighter">
                                                    {car.listingType === 'rent' ? car.rentalPrice : formatPrice(car.price)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6 mb-8">
                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Year</p>
                                                <p className="text-white text-sm font-bold">{car.year}</p>
                                            </div>
                                            <div className="text-center border-x border-white/5">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Mileage</p>
                                                <p className="text-white text-sm font-bold">{car.mileage.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">HP</p>
                                                <p className="text-white text-sm font-bold">{car.specs?.horsepower || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/car/${car.slug}`}
                                            className="w-full py-4 rounded-2xl bg-white text-black hover:bg-red-600 hover:text-white transition-all font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 group/btn"
                                        >
                                            Explore Asset
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </section>
    );
}
