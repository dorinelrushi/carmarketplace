"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Camera, User, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        profileImage: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoaded || !user) return;
            try {
                const res = await fetch('/api/user');
                const data = await res.json();
                if (data.success) {
                    setFormData({
                        firstName: data.data.firstName || '',
                        lastName: data.data.lastName || '',
                        profileImage: data.data.profileImage || ''
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [isLoaded, user]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Profile updated successfully!');
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('Error: Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-2xl">
                    <Link href="/dashboard/seller" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>

                    <div className="bg-zinc-900 rounded-[3rem] border border-white/5 p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Seller <span className="text-red-600">Profile</span></h1>
                            <p className="text-gray-400 mb-12">Update your public information shown to potential buyers.</p>

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-2xl mb-8 text-sm font-bold ${message.includes('Error') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                                >
                                    {message}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Profile Photo */}
                                <div className="flex flex-col items-center">
                                    <div className="relative group">
                                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-zinc-800 shadow-2xl relative">
                                            {formData.profileImage ? (
                                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                    <User className="w-20 h-20 text-zinc-600" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute bottom-2 right-2 bg-red-600 p-3 rounded-2xl cursor-pointer hover:bg-red-700 hover:scale-110 transition-all shadow-xl group-hover:rotate-6">
                                            <Camera className="w-5 h-5 text-white" />
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    </div>
                                    <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Profile Photo</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium"
                                            placeholder="Your first name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium"
                                            placeholder="Your last name"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={saving}
                                    type="submit"
                                    className="w-full bg-red-600 text-white font-black uppercase italic py-5 rounded-2xl hover:bg-red-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 shadow-xl shadow-red-600/20"
                                >
                                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                    Save Changes
                                </button>
                            </form>
                        </div>

                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
