import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#0f1c2e] border-t border-white/10 text-gray-300">
            <div className="container mx-auto px-12 py-14">
                <div className="grid gap-10 md:grid-cols-1 lg:grid-cols-4">

                {/* Brand Section */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-white">
                    Shop <span className="text-red-600">Local</span>
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
                    Discover and shop from trusted local businesses. We bring communities
                    closer by connecting customers with curated products and local sellers.
                    </p>

                    <div className="flex space-x-4 mt-6">
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-red-600 transition">
                        <FaFacebook size={18} />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-red-600 transition">
                        <FaTwitter size={18} />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-red-600 transition">
                        <FaInstagram size={18} />
                    </a>
                    </div>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Explore
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm">
                    <li><Link to="/" className="hover:text-red-500">Home</Link></li>
                    <li><Link to="/shop" className="hover:text-red-500">Shop</Link></li>
                    <li><Link to="/brands" className="hover:text-red-500">Brands</Link></li>
                    <li><Link to="/categories" className="hover:text-red-500">Categories</Link></li>
                    </ul>
                </div>

                {/* Business / Support */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Business
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm">
                    <li><Link to="/vendor_register" className="hover:text-red-500">Sell with us</Link></li>
                    <li><Link to="/contact" className="hover:text-red-500">Contact</Link></li>
                    <li><Link to="/about" className="hover:text-red-500">About</Link></li>
                    <li><Link to="/privacy" className="hover:text-red-500">Privacy Policy</Link></li>
                    </ul>
                </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
                <p>© 2025 Shop Local. All rights reserved.</p>

                <div className="flex space-x-6 mt-4 md:mt-0">
                    <Link to="/terms" className="hover:text-red-500">Terms</Link>
                    <Link to="/privacy" className="hover:text-red-500">Privacy</Link>
                    <Link to="/cookies" className="hover:text-red-500">Cookies</Link>
                </div>
                </div>
            </div>
        </footer>

    )

};

export default Footer;