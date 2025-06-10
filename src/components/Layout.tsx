
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
      {/* Single Header/Navbar */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Single Footer */}
      <Footer />
      
      {/* Mobile Navigation - Only for mobile */}
      <MobileNavigation />
      
      {/* Chat Bot */}
      <ChatBot />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;
