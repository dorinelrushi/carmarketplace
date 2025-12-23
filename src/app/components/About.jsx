"use client";
import { motion } from 'framer-motion';

export default function About() {
    return (
        <section id="about" className="py-20 bg-zinc-900 text-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                            {/* Placeholder for car image */}
                            <div className="carbg absolute inset-0 flex items-center justify-center text-zinc-600">

                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <h2 className="text-4xl font-bold mb-6 text-red-600">Driven by Passion</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            At Speedster, we don't just build cars; we craft experiences. Our legacy is built on a foundation of speed, innovation, and uncompromising quality. Every curve, every engine note, and every stitch is designed to ignite your senses.
                        </p>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            From the track to the street, our vehicles represent the pinnacle of automotive engineering. Join us in the pursuit of perfection.
                        </p>
                        <button className="text-red-500 font-semibold hover:text-red-400 transition-colors flex items-center gap-2 group">
                            Read Our Story
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
