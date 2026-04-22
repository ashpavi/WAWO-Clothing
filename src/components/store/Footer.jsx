import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";


const Footer = () => {
  return (
    <footer className="bg-black text-white">
      
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <img
            src={logo}
            alt="Wavo Clothing"
            className="w-14 h-14 object-contain rounded-full bg-white p-1 shadow-sm"
          />

          <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-xs">
            Modern streetwear crafted for comfort, style, and individuality.
          </p>

          {/* SOCIALS */}
          <div className="flex gap-4 mt-4">
            {/* Facebook */}
            <a href="https://www.facebook.com/share/178v1xSPYV/?mibextid=wwXIfr" className="group w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 border border-gray-700 hover:bg-white transition">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/wavoclothing?igsh=bm42a2IwNXVyZ3Ey&utm_source=qr" className="group w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 border border-gray-700 hover:bg-white transition">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2C4.8 2 3 3.8 3 6v12c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 9a3 3 0 100 6 3 3 0 000-6z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/94765358085" className="group w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 border border-gray-700 hover:bg-white transition">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.77 11.77 0 0012.01 0C5.37 0 .02 5.35.02 11.99c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62a11.94 11.94 0 005.81 1.48h.01c6.63 0 11.99-5.35 11.99-11.99 0-3.2-1.25-6.2-3.49-8.39z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a href="https://www.tiktok.com/@wavo_clothing?_r=1&_t=ZS-94xaL9SKIVA" className="group w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 border border-gray-700 hover:bg-white transition">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2h3a5 5 0 005 5v3a8 8 0 01-5-1.8V16a6 6 0 11-6-6h1v3h-1a3 3 0 103 3V2z"/>
              </svg>
            </a>

          </div>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-xs uppercase tracking-widest mb-6 text-gray-400">
            Shop
          </h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/products" className="hover:text-gray-300 transition">Custom T-Shirts</Link></li>
            <li><Link to="/products" className="hover:text-gray-300 transition">Printed T-Shirts</Link></li>
            <li><Link to="/products" className="hover:text-gray-300 transition">Corporate T-Shirts</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-xs uppercase tracking-widest mb-6 text-gray-400">
            Support
          </h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/contactUs" className="hover:text-gray-300 transition">Help Center</Link></li>
            <li><Link to="/contactUs" className="hover:text-gray-300 transition">Shipping & Returns</Link></li>
            <li><Link to="/sizeGuide" className="hover:text-gray-300 transition">Size Guide</Link></li>
            <li><Link to="/contactUs" className="hover:text-gray-300 transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-xs uppercase tracking-widest mb-6 text-gray-400">
            Company
          </h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/aboutUs" className="hover:text-gray-300 transition">About Us</Link></li>
            <li><Link to="/aboutUs" className="hover:text-gray-300 transition">Careers</Link></li>
            <li><Link to="/aboutUs" className="hover:text-gray-300 transition">Sustainability</Link></li>
            <li><Link to="/aboutUs" className="hover:text-gray-300 transition">Terms of Service</Link></li>
          </ul>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-800"></div>

      {/* BOTTOM */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© 2026 WAVO Clothing</p>
        <p>Designed for modern streetwear culture</p>
      </div>
    </footer>
  );
};

export default Footer;