
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold">AnyHire</span>
            </div>
            <p className="text-gray-400 mb-4">
              Kenya's premier rental marketplace. Rent anything, anytime.
            </p>
            <div className="text-sm text-gray-400">
              <p>📧 info@anyhire.co.ke</p>
              <p>📞 +254 700 000 000</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/search" className="hover:text-white">Browse Items</Link></li>
              <li><Link to="/list-item" className="hover:text-white">List an Item</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/search?category=Electronics" className="hover:text-white">Electronics</Link></li>
              <li><Link to="/search?category=Vehicles" className="hover:text-white">Vehicles</Link></li>
              <li><Link to="/search?category=Tools" className="hover:text-white">Tools & Equipment</Link></li>
              <li><Link to="/search?category=Events" className="hover:text-white">Events & Party</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AnyHire Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
