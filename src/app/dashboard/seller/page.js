"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Edit, Trash2, Phone, X, Upload, Image as ImageIcon, User } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

export default function SellerDashboard() {
    const { user } = useUser();
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [carsLoading, setCarsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [myCars, setMyCars] = useState([]);
    const [editingCar, setEditingCar] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Sports',
        price: '',
        whatsappNumber: '',
        make: '',
        model: '',
        year: '',
        mileage: '',
        status: 'active',
        listingType: 'sale',
        rentalPrice: '',
        location: '',
        specs: {
            engine: '',
            transmission: '',
            topSpeed: '',
            acceleration: '',
            horsepower: ''
        }
    });

    const [images, setImages] = useState([]); // Array of strings (URLs or Base64)
    const [currentImageInput, setCurrentImageInput] = useState('');
    const [uploadMethod, setUploadMethod] = useState('url');

    useEffect(() => {
        const checkRole = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch('/api/user');
                const data = await res.json();
                if (data.success) {
                    setUserRole(data.data.role);
                    if (data.data.role && data.data.role !== 'seller') {
                        router.push('/dashboard/buyer');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user role:', error);
            }
        };
        checkRole();
    }, [user, router]);

    useEffect(() => {
        fetchMyCars();
    }, [user]);

    const fetchMyCars = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`/api/cars?sellerId=${user.id}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                setMyCars(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch cars:', error);
        } finally {
            setCarsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('specs.')) {
            const specName = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                specs: { ...prev.specs, [specName]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddImageUrl = () => {
        if (currentImageInput.trim()) {
            setImages(prev => [...prev, currentImageInput.trim()]);
            setCurrentImageInput('');
        }
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) {
            setMessage('Error: Please add at least one image.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const url = '/api/cars';
            const method = editingCar ? 'PUT' : 'POST';
            const body = {
                ...formData,
                images,
                _id: editingCar?._id
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(editingCar ? 'Car updated successfully!' : 'Car listed successfully!');
                resetForm();
                fetchMyCars();
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('Error: Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'Sports',
            price: '',
            whatsappNumber: '',
            make: '',
            model: '',
            year: '',
            mileage: '',
            status: 'active',
            listingType: 'sale',
            rentalPrice: '',
            location: '',
            specs: { engine: '', transmission: '', topSpeed: '', acceleration: '', horsepower: '' }
        });
        setImages([]);
        setEditingCar(null);
    };

    const handleEdit = (car) => {
        setEditingCar(car);
        setFormData({
            title: car.title || '',
            description: car.description || '',
            type: car.type || 'Sports',
            price: car.price || '',
            whatsappNumber: car.whatsappNumber || '',
            make: car.make || '',
            model: car.model || '',
            year: car.year || '',
            mileage: car.mileage || '',
            status: car.status || 'active',
            listingType: car.listingType || 'sale',
            rentalPrice: car.rentalPrice || '',
            location: car.location || '',
            specs: {
                engine: car.specs?.engine || '',
                transmission: car.specs?.transmission || '',
                topSpeed: car.specs?.topSpeed || '',
                acceleration: car.specs?.acceleration || '',
                horsepower: car.specs?.horsepower || ''
            }
        });
        setImages(car.images || (car.imageUrl ? [car.imageUrl] : []));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this car?')) return;
        try {
            const res = await fetch(`/api/cars?id=${id}`, { method: 'DELETE' });
            if ((await res.json()).success) fetchMyCars();
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-zinc-950 text-white pt-24 px-6">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Seller <span className="text-red-600">Dashboard</span></h1>
                            <p className="text-gray-400">Manage your exclusive car listings.</p>
                        </div>
                        <Link
                            href="/dashboard/profile"
                            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold border border-white/10 flex items-center gap-2 transition-all"
                        >
                            <User className="w-5 h-5 text-red-600" />
                            Edit Profile
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                        {/* FORM SECTION */}
                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    {editingCar ? <Edit className="w-5 h-5 text-red-600" /> : <Plus className="w-5 h-5 text-red-600" />}
                                    {editingCar ? 'Update Listing' : 'New Listing'}
                                </h2>

                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('Error') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                                    >
                                        {message}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Listing Title (e.g. 2024 Ferrari SF90)"
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-red-600 transition-all text-sm"
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" name="make" value={formData.make} onChange={handleChange} placeholder="Make" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600" required />
                                            <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600" required />
                                            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} placeholder="Mileage" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600">
                                                <option>Sports</option><option>SUV</option><option>Sedan</option><option>Luxury</option><option>Electric</option>
                                            </select>
                                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600">
                                                <option value="active">Active</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="sold">Sold</option>
                                            </select>
                                        </div>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600" required />
                                    </div>

                                    {/* Photos Section */}
                                    <div className="bg-black/50 p-4 rounded-2xl border border-zinc-800">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3 px-1">Vehicle Photos</label>

                                        <div className="flex gap-2 mb-3">
                                            <button type="button" onClick={() => setUploadMethod('url')} className={`flex-1 py-2 text-xs rounded-lg font-bold transition-all ${uploadMethod === 'url' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>URL</button>
                                            <button type="button" onClick={() => setUploadMethod('upload')} className={`flex-1 py-2 text-xs rounded-lg font-bold transition-all ${uploadMethod === 'upload' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>Upload</button>
                                        </div>

                                        {uploadMethod === 'url' ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={currentImageInput}
                                                    onChange={(e) => setCurrentImageInput(e.target.value)}
                                                    placeholder="Paste image URL here..."
                                                    className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-600"
                                                />
                                                <button type="button" onClick={handleAddImageUrl} className="bg-zinc-800 p-2 rounded-lg hover:bg-zinc-700"><Plus className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl py-6 cursor-pointer hover:border-red-600 transition-all bg-black/40">
                                                <Upload className="w-6 h-6 text-gray-500 mb-2" />
                                                <span className="text-xs text-gray-400 font-medium">Click to upload photos</span>
                                                <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                                            </label>
                                        )}

                                        {/* Image Gallery Preview */}
                                        {images.length > 0 && (
                                            <div className="grid grid-cols-4 gap-2 mt-4">
                                                <AnimatePresence>
                                                    {images.map((img, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                                            className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group"
                                                        >
                                                            <img src={img} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(idx)}
                                                                className="absolute top-1 right-1 bg-black/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pricing & Contact */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 px-1">Listing Category</label>
                                            <div className="flex bg-black p-1 rounded-xl border border-zinc-800">
                                                <button type="button" onClick={() => setFormData({ ...formData, listingType: 'sale' })} className={`flex-1 py-2 text-xs rounded-lg font-bold transition-all ${formData.listingType === 'sale' ? 'bg-zinc-800 text-white' : 'text-gray-500'}`}>For Sale</button>
                                                <button type="button" onClick={() => setFormData({ ...formData, listingType: 'rent' })} className={`flex-1 py-2 text-xs rounded-lg font-bold transition-all ${formData.listingType === 'rent' ? 'bg-zinc-800 text-white' : 'text-gray-500'}`}>For Rent</button>
                                            </div>
                                        </div>
                                        <input type="text" name={formData.listingType === 'sale' ? 'price' : 'rentalPrice'} value={formData.listingType === 'sale' ? formData.price : formData.rentalPrice} onChange={handleChange} placeholder={formData.listingType === 'sale' ? 'Sale Price' : 'Price / Day'} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600" required />
                                        <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="WhatsApp No." className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600" required />
                                    </div>

                                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed vehicle description..." className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600 h-28" required />

                                    <button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingCar ? 'Update Listing' : 'Publish Car')}
                                    </button>

                                    {editingCar && (
                                        <button type="button" onClick={resetForm} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm py-3 rounded-2xl transition-all">Cancel Edit</button>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* LISTINGS SECTION */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold mb-6">Your Collection</h2>
                            {carsLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-red-600 animate-spin" /></div>
                            ) : myCars.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {myCars.map((car) => (
                                        <div key={car._id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 group hover:border-red-600/50 transition-all">
                                            <div className="h-56 relative overflow-hidden">
                                                <img src={car.images?.[0] || car.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button onClick={() => handleEdit(car)} className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-red-600 transition-all shadow-xl"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(car._id)} className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-red-600 transition-all shadow-xl"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                                <div className="absolute bottom-4 left-4 flex gap-2">
                                                    <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">{car.type}</span>
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${car.status === 'sold' ? 'bg-zinc-800 text-zinc-500 border-zinc-700' :
                                                        car.status === 'reserved' ? 'bg-amber-600/80 text-white border-amber-500' :
                                                            'bg-red-600/80 text-white border-red-500'
                                                        }`}>
                                                        {car.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg leading-tight group-hover:text-red-500 transition-colors uppercase">{car.title}</h3>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <p className="text-red-600 font-bold text-xl">{car.price || `${car.rentalPrice}/day`}</p>
                                                    <Link href={`/car/${car.slug}`} className="text-gray-400 hover:text-white transition-colors text-xs font-medium underline underline-offset-4">View Live Page</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-zinc-800 border-dashed">
                                    <ImageIcon className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">Your showroom is currently empty.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
