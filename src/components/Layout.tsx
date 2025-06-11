
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from './ChatBot';
import MobileNavigation from './navigation/MobileNavigation';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* SINGLE NAVBAR - ONLY ONE IN ENTIRE APP */}
      <Navbar />
      
      {/* MAIN CONTENT */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      
      {/* SINGLE FOOTER - ONLY ONE IN ENTIRE APP */}
      <Footer />
      
      {/* MOBILE BOTTOM NAV - MOBILE ONLY */}
      <MobileNavigation />
      
      {/* UTILITIES */}
      <ChatBot />
      <Toaster />
    </div>
  );
};

export default Layout;
