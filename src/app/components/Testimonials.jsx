"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Alex Rivera",
        role: "Professional Racer",
        text: "The handling is absolutely phenomenal. It feels like an extension of my own body. Truly a masterpiece of engineering.",
        rating: 5
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Automotive Journalist",
        text: "I've driven hundreds of cars, but nothing compares to the raw power and elegance of the Speedster GT. It redefines the category.",
        rating: 5
    },
    {
        id: 3,
        name: "Marcus Thorne",
        role: "Car Collector",
        text: "A stunning addition to my collection. The attention to detail in the interior is unmatched. It's not just a car, it's art.",
        rating: 5
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section id="testimonials" className="py-20 bg-black text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900 to-transparent" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Client <span className="text-red-600">Stories</span></h2>
                    <p className="text-gray-400">Hear from those who have experienced the thrill.</p>
                </motion.div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="overflow-hidden px-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 rounded-2xl text-center backdrop-blur-sm"
                            >
                                <div className="flex justify-center gap-1 mb-6">
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-red-600 fill-red-600" />
                                    ))}
                                </div>
                                <p className="text-xl md:text-2xl text-gray-200 mb-8 italic">"{testimonials[currentIndex].text}"</p>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{testimonials[currentIndex].name}</h4>
                                    <p className="text-red-500 text-sm">{testimonials[currentIndex].role}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={prev}
                        className="absolute top-1/2 -left-2 md:-left-12 -translate-y-1/2 p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute top-1/2 -right-2 md:-right-12 -translate-y-1/2 p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </section>
    );
}
