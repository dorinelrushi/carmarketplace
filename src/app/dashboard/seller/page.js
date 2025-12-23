"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Loader2, Edit, Trash2, Phone } from 'lucide-react';
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
        imageUrl: '',
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
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadMethod, setUploadMethod] = useState('url');

    useEffect(() => {
        const checkRole = async () => {
            if (!user?.id) return;

            try {
                const res = await fetch('/api/user');
                const data = await res.json();
                if (data.success) {
                    const role = data.data.role;
                    setUserRole(role);

                    if (role && role !== 'seller') {
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
                const uniqueCars = Array.from(
                    new Map(data.data.map(car => [car._id, car])).values()
                );
                setMyCars(uniqueCars);
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
        } else if (name === 'listingType') {
            // Clear the opposite price field when switching listing type
            setFormData(prev => ({
                ...prev,
                [name]: value,
                price: value === 'rent' ? '' : prev.price,
                rentalPrice: value === 'sale' ? '' : prev.rentalPrice
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let imageUrl = formData.imageUrl;

            if (uploadMethod === 'upload' && imageFile) {
                imageUrl = imagePreview;
            }

            const url = '/api/cars';
            const method = editingCar ? 'PUT' : 'POST';
            const body = editingCar
                ? { ...formData, imageUrl, _id: editingCar._id }
                : { ...formData, imageUrl };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(editingCar ? 'Car updated successfully!' : 'Car listed successfully!');
                setFormData({
                    title: '',
                    description: '',
                    type: 'Sports',
                    price: '',
                    imageUrl: '',
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
                setImageFile(null);
                setImagePreview('');
                setUploadMethod('url');
                setEditingCar(null);
                fetchMyCars();
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (car) => {
        setEditingCar(car);
        setFormData({
            title: car.title || '',
            description: car.description || '',
            type: car.type || 'Sports',
            price: car.price || '',
            imageUrl: car.imageUrl || '',
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
        setUploadMethod('url');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this car?')) return;

        try {
            const res = await fetch(`/api/cars?id=${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                fetchMyCars();
            } else {
                alert('Failed to delete car');
            }
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const carToUpdate = myCars.find(c => c._id === id);
            if (!carToUpdate) return;

            const res = await fetch('/api/cars', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...carToUpdate, status: newStatus }),
            });

            const data = await res.json();
            if (data.success) {
                fetchMyCars();
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
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
                            <p className="text-gray-400">Manage your listings and earnings.</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push('/dashboard/buyer')}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg transition-colors border border-zinc-800"
                            >
                                Browse All Cars
                            </button>
                        </div>
                    </div>



                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Add/Edit Car Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 sticky top-24">
                                <h2 className="text-xl font-bold mb-6">{editingCar ? 'Edit Car' : 'Add New Car'}</h2>

                                {message && (
                                    <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Title - First */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                            placeholder="e.g., 2023 Tesla Model S Plaid"
                                            required
                                        />
                                    </div>

                                    {/* Make & Model */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Make</label>
                                            <input
                                                type="text"
                                                name="make"
                                                value={formData.make || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                                placeholder="e.g., Tesla"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Model</label>
                                            <input
                                                type="text"
                                                name="model"
                                                value={formData.model || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                                placeholder="e.g., Model S"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Year & Mileage */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                                            <input
                                                type="number"
                                                name="year"
                                                value={formData.year || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                                placeholder="2023"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Mileage</label>
                                            <input
                                                type="number"
                                                name="mileage"
                                                value={formData.mileage || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                                placeholder="15000"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Type & Location */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                            >
                                                <option>Sports</option>
                                                <option>Sedan</option>
                                                <option>SUV</option>
                                                <option>Luxury</option>
                                                <option>Electric</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                                placeholder="Miami, FL"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Listing Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Listing Type</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="listingType"
                                                    value="sale"
                                                    checked={formData.listingType === 'sale'}
                                                    onChange={handleChange}
                                                    className="accent-red-600"
                                                />
                                                <span>For Sale</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="listingType"
                                                    value="rent"
                                                    checked={formData.listingType === 'rent'}
                                                    onChange={handleChange}
                                                    className="accent-red-600"
                                                />
                                                <span>For Rent</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Sale Price</label>
                                            <input
                                                type="text"
                                                name="price"
                                                value={formData.price || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder="$75,000"
                                                required={formData.listingType === 'sale'}
                                                disabled={formData.listingType === 'rent'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Rental Price (per day)</label>
                                            <input
                                                type="text"
                                                name="rentalPrice"
                                                value={formData.rentalPrice || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder="$500"
                                                required={formData.listingType === 'rent'}
                                                disabled={formData.listingType === 'sale'}
                                            />
                                        </div>
                                    </div>

                                    {/* WhatsApp Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number</label>
                                        <input
                                            type="text"
                                            name="whatsappNumber"
                                            value={formData.whatsappNumber || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                            placeholder="+1234567890"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors h-32"
                                            placeholder="Describe the car's features, condition, and any special details..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Image</label>

                                        <div className="flex gap-4 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => setUploadMethod('url')}
                                                className={`flex-1 text-xs py-1 rounded ${uploadMethod === 'url' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400'}`}
                                            >
                                                Image URL
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setUploadMethod('upload')}
                                                className={`flex-1 text-xs py-1 rounded ${uploadMethod === 'upload' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400'}`}
                                            >
                                                Upload File
                                            </button>
                                        </div>

                                        {uploadMethod === 'url' ? (
                                            <input
                                                key="url-input"
                                                type="text"
                                                name="imageUrl"
                                                value={formData.imageUrl || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                                placeholder="https://example.com/car.jpg"
                                            />
                                        ) : (
                                            <input
                                                key="file-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageFileChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:border-red-600 outline-none transition-colors"
                                            />
                                        )}

                                        {/* Image Preview */}
                                        {(formData.imageUrl || imagePreview) && (
                                            <div className="mt-2 rounded-lg overflow-hidden h-40 border border-zinc-800">
                                                <img
                                                    src={uploadMethod === 'upload' ? imagePreview : formData.imageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Engine</label>
                                            <input
                                                type="text"
                                                name="specs.engine"
                                                value={formData.specs.engine || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Transmission</label>
                                            <input
                                                type="text"
                                                name="specs.transmission"
                                                value={formData.specs.transmission || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Top Speed</label>
                                            <input
                                                type="text"
                                                name="specs.topSpeed"
                                                value={formData.specs.topSpeed || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Horsepower</label>
                                            <input
                                                type="text"
                                                name="specs.horsepower"
                                                value={formData.specs.horsepower || ''}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : (editingCar ? 'Update Car' : 'List Car')}
                                    </button>

                                    {editingCar && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingCar(null);
                                                setFormData({
                                                    title: '',
                                                    description: '',
                                                    type: 'Sports',
                                                    price: '',
                                                    imageUrl: '',
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
                                                setImagePreview('');
                                                setUploadMethod('url');
                                            }}
                                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-colors"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* My Cars List */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold mb-6">My Listings</h2>
                            {carsLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                                </div>
                            ) : myCars.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {myCars.map((car) => (
                                        <motion.div
                                            key={car._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 group"
                                        >
                                            <div className="h-48 relative overflow-hidden">
                                                <img
                                                    src={car.imageUrl}
                                                    alt={car.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(car)}
                                                        className="bg-black/60 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(car._id)}
                                                        className="bg-black/60 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold truncate flex-1">{car.title}</h3>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${car.status === 'sold' ? 'bg-red-900 text-red-200' : car.status === 'reserved' ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'}`}>
                                                        {car.status || 'active'}
                                                    </span>
                                                </div>
                                                <p className="text-red-500 font-bold text-sm mb-2">{car.price}</p>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <select
                                                        value={car.status || 'active'}
                                                        onChange={(e) => handleStatusChange(car._id, e.target.value)}
                                                        className="bg-zinc-800 text-xs text-white rounded px-2 py-1 border border-zinc-700 outline-none focus:border-red-600"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="reserved">Reserved</option>
                                                        <option value="sold">Sold</option>
                                                    </select>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Phone className="w-3 h-3" />
                                                    {car.whatsappNumber || 'No number'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                                    <p className="text-gray-400">You haven't listed any cars yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}
