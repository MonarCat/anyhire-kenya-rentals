
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Logo size="sm" variant="white" />
              <span className="text-xl font-bold">AnyHire</span>
            </div>
            <p className="text-gray-400 mb-4">
              Kenya's premier rental marketplace. Rent anything, anytime.
            </p>
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex items-center space-x-3">
                <span>📧 info@anyhire.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <span>📞 +254 700 000 000</span>
                <a 
                  href="https://wa.me/254700000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 p-1 rounded-full transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://facebook.com/anyhire.kenya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com/anyhire_ke" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                title="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com/@anyhire.kenya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                title="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
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

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-white">Safety Tips</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AnyHire Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
