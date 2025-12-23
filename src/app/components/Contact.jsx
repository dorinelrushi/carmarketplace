"use client";
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-20 bg-zinc-900 text-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Get in <span className="text-red-600">Touch</span></h2>
                    <p className="text-gray-400">Ready to start your journey? Contact us today.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-red-600/10 p-3 rounded-lg text-red-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Visit Our Showroom</h3>
                                <p className="text-gray-400">123 Speedster Avenue<br />Automotive District, CA 90210</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-red-600/10 p-3 rounded-lg text-red-600">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                                <p className="text-gray-400">+1 (555) 123-4567<br />Mon-Fri, 9am - 6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-red-600/10 p-3 rounded-lg text-red-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                                <p className="text-gray-400">sales@speedster.com<br />support@speedster.com</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.form
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 bg-black p-8 rounded-2xl border border-zinc-800"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <input type="email" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                            <textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="How can we help you?"></textarea>
                        </div>
                        <button className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                            Send Message
                            <Send className="w-4 h-4" />
                        </button>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
