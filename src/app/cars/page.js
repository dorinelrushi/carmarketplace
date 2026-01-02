"use client";
import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Gauge, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

const CAR_TYPES = ['Sports', 'SUV', 'Electric', 'Sedan', 'Truck', 'Luxury'];
const LISTING_TYPES = [
    { label: 'All', value: '' },
    { label: 'For Sale', value: 'sale' },
    { label: 'For Rent', value: 'rent' }
];

export default function AllCarsPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        listingType: '',
        year: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (filters.type) params.append('type', filters.type);
                if (filters.listingType) params.append('listingType', filters.listingType);
                if (filters.year) params.append('year', filters.year);

                const res = await fetch(`/api/cars?${params.toString()}`);
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

        const debounce = setTimeout(fetchCars, 500);
        return () => clearTimeout(debounce);
    }, [search, filters]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
                                The <span className="text-red-600">Showroom</span>
                            </h1>
                            <p className="text-gray-400 max-w-xl text-lg">
                                Discover our curated collection of high-performance vehicles, from electric innovators to track-ready monsters.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl px-6 py-2">
                                <span className="text-red-600 font-bold text-2xl">{cars.length}</span>
                                <span className="text-gray-500 ml-2 uppercase text-xs font-bold tracking-widest">Vehicles Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="sticky top-24 z-30 mb-12">
                        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 p-4 rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by make, model, or keywords..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600 transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-4 w-full lg:w-auto">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all w-full lg:w-auto justify-center ${showFilters ? 'bg-red-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'}`}
                                >
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </button>
                                {Object.values(filters).some(v => v !== '') && (
                                    <button
                                        onClick={() => setFilters({ type: '', listingType: '', year: '' })}
                                        className="p-4 bg-zinc-800 hover:bg-zinc-700 text-gray-400 rounded-2xl transition-all"
                                        title="Clear Filters"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Expandable Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-4 bg-zinc-900/90 backdrop-blur-xl border border-white/5 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8 shadow-2xl"
                                >
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Vehicle Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {CAR_TYPES.map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setFilters(prev => ({ ...prev, type: prev.type === type ? '' : type }))}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filters.type === type ? 'bg-red-600 border-red-600 text-white' : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Offer Type</label>
                                        <div className="flex gap-2">
                                            {LISTING_TYPES.map(type => (
                                                <button
                                                    key={type.value}
                                                    onClick={() => setFilters(prev => ({ ...prev, listingType: type.value }))}
                                                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${filters.listingType === type.value ? 'bg-red-600 border-red-600 text-white' : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30'}`}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Production Year</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 2024"
                                            value={filters.year}
                                            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-600"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Cars Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-zinc-900 aspect-[4/5] rounded-3xl animate-pulse border border-white/5"></div>
                            ))}
                        </div>
                    ) : cars.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cars.map((car) => (
                                <Link href={`/car/${car.slug}`} key={car._id} className="group">
                                    <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-red-600/30 transition-all duration-500 relative h-full flex flex-col">
                                        {/* Status Badge */}
                                        <div className="absolute top-6 left-6 z-10 flex gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md ${car.status === 'sold' ? 'bg-black/60 text-zinc-500 border-white/10' :
                                                    car.status === 'reserved' ? 'bg-amber-600/80 text-white border-amber-500' :
                                                        'bg-red-600/80 text-white border-red-500'
                                                }`}>
                                                {car.status}
                                            </span>
                                            <span className="bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                                                {car.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                                            </span>
                                        </div>

                                        {/* Image Container */}
                                        <div className="aspect-[16/11] overflow-hidden relative">
                                            <img
                                                src={car.images[0]}
                                                alt={car.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-1">{car.make}</p>
                                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-red-500 transition-colors">
                                                        {car.model}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-white">
                                                        {car.listingType === 'sale' ? car.price : `${car.rentalPrice}`}
                                                    </p>
                                                    {car.listingType === 'rent' && <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Per Day</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm font-bold">{car.year}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Gauge className="w-4 h-4" />
                                                    <span className="text-sm font-bold">{car.mileage?.toLocaleString()} KM</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 col-span-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-sm font-bold truncate">{car.location}</span>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-xs text-gray-400">Listed by <span className="text-white font-bold">{car.sellerName}</span></span>
                                                <div className="bg-red-600/10 p-2 rounded-xl group-hover:bg-red-600 transition-all">
                                                    <ArrowRight className="w-4 h-4 text-red-600 group-hover:text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 bg-zinc-900/50 rounded-[4rem] border border-dashed border-white/10">
                            <Search className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold mb-2">No cars matched your criteria</h2>
                            <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
                            <button
                                onClick={() => { setSearch(''); setFilters({ type: '', listingType: '', year: '' }); }}
                                className="mt-8 text-red-600 font-bold uppercase tracking-widest text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
