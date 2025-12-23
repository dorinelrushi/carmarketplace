"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Gauge, Zap, Trophy, MessageCircle, Phone, X } from 'lucide-react';
import Header from '../../components/Header';

export default function BuyerDashboard() {
    const { user } = useUser();
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);

    // Check user role and redirect if not buyer
    useEffect(() => {
        const checkRole = async () => {
            if (!user?.id) return;

            try {
                const res = await fetch('/api/user');
                const data = await res.json();
                if (data.success) {
                    const role = data.data.role;
                    setUserRole(role);

                    // Allow both buyers and sellers to view the marketplace
                    // if (role && role !== 'buyer') {
                    //     router.push('/dashboard/seller');
                    // }
                }
            } catch (error) {
                console.error('Failed to fetch user role:', error);
            }
        };

        checkRole();
    }, [user, router]);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await fetch('/api/cars', { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                const uniqueCars = Array.from(
                    new Map(data.data.map(car => [car._id, car])).values()
                );
                setCars(uniqueCars);
            }
        } catch (error) {
            console.error('Failed to fetch cars:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContactSeller = (car, rentalDates = null) => {
        if (!car.whatsappNumber) return;

        let message = `Hi, I am interested in your ${car.title} listed on Speedster.`;

        if (car.listingType === 'rent' && rentalDates) {
            message = `Hi, I would like to rent your ${car.title} listed on Speedster from ${rentalDates.start} to ${rentalDates.end}. Location: ${car.location}.`;
        } else if (car.listingType === 'rent') {
            message = `Hi, I am interested in renting your ${car.title} listed on Speedster.`;
        }

        const url = `https://wa.me/${car.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        // If it already contains non-numeric characters (except . and ,), assume it's pre-formatted
        if (/[^0-9.,\s]/.test(price)) return price;

        // Otherwise format as currency
        const num = parseFloat(price.replace(/,/g, ''));
        if (isNaN(num)) return price;

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-zinc-950 text-white pt-24 px-6">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Car <span className="text-red-600">Marketplace</span></h1>
                            <p className="text-gray-400">Welcome, {user?.firstName}. Find your dream car.</p>
                        </div>
                    </div>

                    {/* Available Cars */}
                    <h2 className="text-2xl font-bold mb-6">Available Cars</h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cars.map((car) => (
                                <motion.div
                                    key={car._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-900/50 transition-all group"
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        <img
                                            src={car.imageUrl}
                                            alt={car.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                                {car.type}
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border border-white/10 ${car.listingType === 'rent'
                                                ? 'bg-blue-900/80 text-blue-200'
                                                : 'bg-purple-900/80 text-purple-200'
                                                }`}>
                                                {car.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border border-white/10 ${car.status === 'sold'
                                                ? 'bg-red-900/80 text-red-200'
                                                : car.status === 'reserved'
                                                    ? 'bg-yellow-900/80 text-yellow-200'
                                                    : 'bg-green-900/80 text-green-200'
                                                }`}>
                                                {car.status || 'active'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold truncate">{car.title}</h3>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider">
                                                    {car.listingType === 'rent' ? 'Per Day' : 'Price'}
                                                </span>
                                                <span className="text-red-500 font-bold">
                                                    {car.listingType === 'rent' ? car.rentalPrice : formatPrice(car.price)}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{car.description}</p>

                                        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
                                            <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                                                <span className="block text-gray-600 mb-0.5">Make/Model</span>
                                                <span className="font-bold text-gray-300">{car.make} {car.model}</span>
                                            </div>
                                            <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                                                <span className="block text-gray-600 mb-0.5">Year/Mileage</span>
                                                <span className="font-bold text-gray-300">{car.year} • {car.mileage}mi</span>
                                            </div>
                                        </div>

                                        {car.specs && (
                                            <div className="grid grid-cols-3 gap-2 mb-6 text-xs text-gray-500">
                                                <div className="flex flex-col items-center bg-zinc-950 p-2 rounded">
                                                    <Gauge className="w-4 h-4 mb-1 text-red-600" />
                                                    <span>{car.specs.topSpeed || 'N/A'}</span>
                                                </div>
                                                <div className="flex flex-col items-center bg-zinc-950 p-2 rounded">
                                                    <Zap className="w-4 h-4 mb-1 text-red-600" />
                                                    <span>{car.specs.horsepower || 'N/A'}</span>
                                                </div>
                                                <div className="flex flex-col items-center bg-zinc-950 p-2 rounded">
                                                    <Trophy className="w-4 h-4 mb-1 text-red-600" />
                                                    <span>{car.specs.acceleration || 'N/A'}</span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setSelectedCar(car)}
                                            className="w-full bg-white/5 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal for Car Details */}
                <AnimatePresence>
                    {selectedCar && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedCar(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-zinc-900 w-full max-w-3xl rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <button
                                    onClick={() => setSelectedCar(null)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="h-64 md:h-auto relative">
                                        <img
                                            src={selectedCar.imageUrl}
                                            alt={selectedCar.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 md:bg-gradient-to-r md:from-transparent md:to-zinc-900" />
                                        <div className="absolute bottom-6 left-6">
                                            <h3 className="text-3xl font-bold text-white mb-1">{selectedCar.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-lg">
                                                    {selectedCar.listingType === 'rent' ? 'Daily Rate:' : 'Price:'}
                                                </span>
                                                <span className="text-red-500 font-bold text-2xl">
                                                    {selectedCar.listingType === 'rent' ? selectedCar.rentalPrice : formatPrice(selectedCar.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="mb-6">
                                            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Vehicle Details</h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                                                    <span className="block text-gray-500 text-xs mb-1">Make</span>
                                                    <span className="font-bold">{selectedCar.make || 'N/A'}</span>
                                                </div>
                                                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                                                    <span className="block text-gray-500 text-xs mb-1">Model</span>
                                                    <span className="font-bold">{selectedCar.model || 'N/A'}</span>
                                                </div>
                                                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                                                    <span className="block text-gray-500 text-xs mb-1">Year</span>
                                                    <span className="font-bold">{selectedCar.year || 'N/A'}</span>
                                                </div>
                                                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                                                    <span className="block text-gray-500 text-xs mb-1">Mileage</span>
                                                    <span className="font-bold">{selectedCar.mileage ? `${selectedCar.mileage.toLocaleString()} mi` : 'N/A'}</span>
                                                </div>
                                                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 col-span-2">
                                                    <span className="block text-gray-500 text-xs mb-1">Location</span>
                                                    <span className="font-bold">{selectedCar.location || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedCar.specs && (
                                            <div className="mb-6">
                                                <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Performance Specs</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-gray-200">
                                                        <Gauge className="w-5 h-5 text-red-600" />
                                                        <span>{selectedCar.specs.topSpeed || 'N/A'} Top Speed</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-200">
                                                        <Zap className="w-5 h-5 text-red-600" />
                                                        <span>{selectedCar.specs.engine || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-200">
                                                        <Trophy className="w-5 h-5 text-red-600" />
                                                        <span>{selectedCar.specs.transmission || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Description</h4>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {selectedCar.description}
                                            </p>
                                        </div>

                                        {/* Show WhatsApp Button */}
                                        {selectedCar.whatsappNumber ? (
                                            <button
                                                onClick={() => handleContactSeller(selectedCar)}
                                                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                <span>Contact Seller via WhatsApp</span>
                                            </button>
                                        ) : (
                                            <div className="w-full bg-zinc-800 text-gray-400 font-medium py-4 rounded-xl text-center">
                                                No contact number available
                                            </div>
                                        )}

                                        {/* Rental Calendar */}
                                        {selectedCar.listingType === 'rent' && selectedCar.whatsappNumber && (
                                            <div className="mt-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                                <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Select Rental Dates</h4>
                                                <form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const formData = new FormData(e.target);
                                                    handleContactSeller(selectedCar, {
                                                        start: formData.get('startDate'),
                                                        end: formData.get('endDate')
                                                    });
                                                }} className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                                            <input
                                                                type="date"
                                                                name="startDate"
                                                                required
                                                                min={new Date().toISOString().split('T')[0]}
                                                                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:border-red-600 outline-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                                            <input
                                                                type="date"
                                                                name="endDate"
                                                                required
                                                                min={new Date().toISOString().split('T')[0]}
                                                                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:border-red-600 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
                                                        Request Booking via WhatsApp
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
