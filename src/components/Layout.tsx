
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  showChatBot?: boolean;
}

const Layout = ({ 
  children, 
  showNavbar = true, 
  showFooter = true, 
  showChatBot = true 
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      {showChatBot && <ChatBot />}
    </div>
  );
};

export default Layout;
