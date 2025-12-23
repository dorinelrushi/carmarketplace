"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Gauge, Zap, Trophy, Loader2, MessageCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const categories = ["All", "Sports", "SUV", "Electric", "Sedan", "Truck"];

export default function Models() {
    const { user, isSignedIn } = useUser();
    const [filter, setFilter] = useState("All");
    const [selectedCar, setSelectedCar] = useState(null);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

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

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await fetch('/api/cars', { cache: 'no-store' });
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    // Transform API data to match component structure
                    const apiCars = data.data.map(car => ({
                        id: car._id,
                        name: car.title,
                        category: car.type,
                        price: car.price,
                        specs: car.specs ? `${car.specs.acceleration || ''} | ${car.specs.horsepower || ''}` : '',
                        details: {
                            engine: car.specs?.engine || 'N/A',
                            transmission: car.specs?.transmission || 'N/A',
                            topSpeed: car.specs?.topSpeed || 'N/A',
                            description: car.description
                        },
                        image: car.imageUrl,
                        whatsappNumber: car.whatsappNumber,
                        make: car.make,
                        model: car.model,
                        year: car.year,
                        mileage: car.mileage,
                        status: car.status || 'active',
                        listingType: car.listingType || 'sale',
                        rentalPrice: car.rentalPrice,
                        location: car.location
                    }));
                    setCars(apiCars);
                }
            } catch (error) {
                console.error("Failed to fetch cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);



    const handleContactSeller = (car, rentalDates = null) => {
        if (!car.whatsappNumber) return;

        let message = `Hi, I am interested in your ${car.name} listed on Speedster.`;

        if (car.listingType === 'rent' && rentalDates) {
            message = `Hi, I would like to rent your ${car.name} listed on Speedster from ${rentalDates.start} to ${rentalDates.end}. Location: ${car.location}.`;
        } else if (car.listingType === 'rent') {
            message = `Hi, I am interested in renting your ${car.name} listed on Speedster.`;
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

    const filteredCars = filter === "All"
        ? cars
        : cars.filter(car => car.category === filter);



    return (
        <section id="models" className="py-20 bg-zinc-950 text-white min-h-screen relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold mb-2"
                        >
                            Our <span className="text-red-600">Models</span>
                        </motion.h2>
                        <p className="text-gray-400">Choose your perfect ride.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap gap-2"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                                    : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {loading ? (
                        <div className="col-span-full flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                        </div>
                    ) : filteredCars.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 text-lg mb-2">No cars available yet</p>
                            <p className="text-gray-500 text-sm">Sellers can post cars from their dashboard</p>
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {filteredCars.map((car) => (
                                <motion.div
                                    layout
                                    key={car.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-900/50 transition-colors"
                                >
                                    {/* Image Placeholder */}
                                    <div className="h-48 w-full relative overflow-hidden">
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-4 flex gap-2">
                                            <span className="bg-black/50 backdrop-blur-md text-xs px-3 py-1 rounded-full border border-white/10">
                                                {car.category}
                                            </span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border border-white/10 ${car.status === 'sold' ? 'bg-red-900/80 text-red-200' : car.status === 'reserved' ? 'bg-yellow-900/80 text-yellow-200' : 'bg-green-900/80 text-green-200'}`}>
                                                {car.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold">{car.name}</h3>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider">{car.listingType === 'rent' ? 'Rent/Day' : 'Price'}</span>
                                                <span className="text-red-500 font-bold text-lg">{car.listingType === 'rent' ? car.rentalPrice : formatPrice(car.price)}</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-zinc-800 pt-4 mb-6">
                                            <p className="text-sm text-gray-400 font-mono">{car.specs}</p>
                                        </div>

                                        <button
                                            onClick={() => setSelectedCar(car)}
                                            className="w-full py-3 rounded-lg bg-white/5 text-white hover:bg-red-600 hover:text-white transition-all font-medium flex items-center justify-center gap-2 group-hover:shadow-lg"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </motion.div>
            </div>

            {/* Modal */}
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
                            className="relative bg-zinc-900 w-full max-w-3xl rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl"
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
                                        src={selectedCar.image}
                                        alt={selectedCar.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 md:bg-gradient-to-r md:from-transparent md:to-zinc-900" />
                                    <div className="absolute bottom-6 left-6">
                                        <h3 className="text-3xl font-bold text-white mb-1">{selectedCar.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-lg">{selectedCar.listingType === 'rent' ? 'Daily Rate:' : 'Price:'}</span>
                                            <span className="text-red-500 font-bold text-2xl">{selectedCar.listingType === 'rent' ? selectedCar.rentalPrice : formatPrice(selectedCar.price)}</span>
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

                                    <div className="mb-6">
                                        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Performance Specs</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-200">
                                                <Gauge className="w-5 h-5 text-red-600" />
                                                <span>{selectedCar.details.topSpeed} Top Speed</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-200">
                                                <Zap className="w-5 h-5 text-red-600" />
                                                <span>{selectedCar.details.engine}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-200">
                                                <Trophy className="w-5 h-5 text-red-600" />
                                                <span>{selectedCar.details.transmission}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Description</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {selectedCar.details.description}
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
                                                        <input type="date" name="startDate" required className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:border-red-600 outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                                        <input type="date" name="endDate" required className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:border-red-600 outline-none" />
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
        </section>
    );
}
