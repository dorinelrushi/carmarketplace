"use client";
import { useState, useEffect, use } from 'react';
import Header from '@/app/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Gauge, Shield, Zap, Phone, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CarDetailPage({ params }) {
    const { slug } = use(params);
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await fetch(`/api/cars?slug=${slug}`);
                const data = await res.json();
                if (data.success) {
                    setCar(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch car:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
                <h1 className="text-4xl font-bold mb-4">Car Not Found</h1>
                <p className="text-gray-400 mb-8">The vehicle you're looking for doesn't exist or has been removed.</p>
                <Link href="/" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold">Back to Home</Link>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="pt-24 pb-20 px-6">
                <div className="container mx-auto">
                    {/* Hero Section with Slider */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* LEFT: Image Slider */}
                        <div className="relative group">
                            <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 relative">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={car.images[currentImageIndex]}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Navigation Arrows */}
                                {car.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md p-3 rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md p-3 rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {car.images.length > 1 && (
                                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                                    {car.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${currentImageIndex === idx ? 'border-red-600 scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Car Details */}
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-red-600/10 text-red-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-red-600/20">{car.type}</span>
                                    <span className="bg-white/5 text-gray-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">{car.listingType === 'sale' ? 'For Sale' : 'For Rent'}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight uppercase tracking-tighter italic">
                                    {car.make} <span className="text-red-600">{car.model}</span>
                                </h1>
                                <p className="text-3xl font-bold text-white mb-6">
                                    {car.listingType === 'sale' ? car.price : `${car.rentalPrice} / Day`}
                                </p>

                                <div className="flex flex-wrap gap-6 text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-red-600" />
                                        <span>{car.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-red-600" />
                                        <span>Year {car.year}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-5 h-5 text-red-600" />
                                        <span>{car.mileage.toLocaleString()} KM</span>
                                    </div>
                                </div>
                            </div>

                            {/* Key Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(car.specs || {}).map(([key, value]) => (
                                    value && (
                                        <div key={key} className="bg-zinc-900 p-4 rounded-2xl border border-white/5 hover:border-red-600/50 transition-all group">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">{key}</p>
                                            <p className="text-white font-bold">{value}</p>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Contact Card */}
                            <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 uppercase italic tracking-tighter">Interested in this vehicle?</h3>
                                        <p className="text-gray-400 text-sm">Contact the owner directly via WhatsApp for inquiries.</p>
                                    </div>
                                    <a
                                        href={`https://wa.me/${car.whatsappNumber?.replace('+', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-600/20 w-full md:w-auto justify-center"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Contact Owner
                                    </a>
                                </div>
                                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </div>

                    {/* DESCRIPTION SECTION */}
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold mb-8 uppercase italic border-l-4 border-red-600 pl-4 tracking-tighter">Description & Heritage</h2>
                        <div className="bg-zinc-900/50 rounded-3xl p-8 border border-white/5 lg:w-2/3">
                            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                                {car.description}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
