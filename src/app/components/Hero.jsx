"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
    return (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-car.png"
                    alt="Sports Car"
                    fill
                    className="object-cover object-center opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 to-transparent mix-blend-overlay" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 inline-block"
                >
                    <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase">
                        New Arrival
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl"
                >
                    UNLEASH <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                        THE BEAST
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light drop-shadow-lg"
                >
                    Precision engineering meets raw power. The ultimate driving experience awaits.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-6 justify-center"
                >
                    <button className="bg-gradient-to-r from-red-600 to-red-800 text-white px-10 py-4 rounded-full text-lg font-bold hover:from-red-700 hover:to-red-900 transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-1">
                        Explore Models
                    </button>
                    <button className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all transform hover:-translate-y-1">
                        Watch Video
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
