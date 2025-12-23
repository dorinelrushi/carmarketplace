export default function Footer() {
    return (
        <footer className="bg-black text-white border-t border-zinc-900 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold text-red-600 tracking-tighter mb-4">
                            SPEED<span className="text-white">STER</span>
                        </h2>
                        <p className="text-gray-400 max-w-sm">
                            Redefining the future of automotive excellence. Join us on the road to perfection.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#home" className="hover:text-red-500 transition-colors">Home</a></li>
                            <li><a href="#models" className="hover:text-red-500 transition-colors">Models</a></li>
                            <li><a href="#about" className="hover:text-red-500 transition-colors">About Us</a></li>
                            <li><a href="#contact" className="hover:text-red-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Legal</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Speedster. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
