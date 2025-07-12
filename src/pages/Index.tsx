import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Shield, Clock, MapPin, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FeaturedItems from '@/components/FeaturedItems';
import CategoryGrid from '@/components/CategoryGrid';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const Index = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-600" />,
      title: "Safe & Secure",
      description: "Verified users and secure transactions",
      color: "from-emerald-50 to-emerald-100"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Flexible Rentals",
      description: "Hourly, daily, or custom rental periods",
      color: "from-blue-50 to-blue-100"
    },
    {
      icon: <MapPin className="w-8 h-8 text-purple-600" />,
      title: "Local Community",
      description: "Connect with people in your area",
      color: "from-purple-50 to-purple-100"
    }
  ];

  return (
    <>
      <PWAInstallPrompt />
      <Seo
        title="AnyHire - Rent Anything in Kenya | Local Rentals & Listings"
        description="Kenya's trusted platform to rent and hire tools, electronics, cars, party gear & more. List your own items, browse by category, and find great deals nearby. Fast, safe, and mobile-friendly—join AnyHire and get started today."
        image="https://anyhire.lovable.app/og-image.png"
        url="https://anyhire.lovable.app/"
      />
      <Layout>
        {/* Hero Section - Mobile-First Design */}
        <section className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white py-12 md:py-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                Rent Anything, <br className="sm:hidden" /><span className="text-yellow-300 animate-pulse">Anytime</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed opacity-90 px-2">
                Kenya's premier rental marketplace. From tools to electronics, 
                from party equipment to vehicles - find what you need or earn from what you own.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
                <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto min-h-[48px] text-base font-semibold">
                  <Link to="/search" className="flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Browse Items
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto min-h-[48px] text-base font-semibold">
                  <Link to="/list-item" className="flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    List an Item
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Mobile Optimized */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Why Choose AnyHire?
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
                Join thousands of satisfied customers who trust AnyHire for their rental needs
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 border-0 bg-white overflow-hidden">
                  <CardContent className="p-6 md:p-8 text-center relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4 md:mb-6">
                        <div className="p-3 md:p-4 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-800">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section - Mobile Focused */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-800">Browse by Category</h2>
              <p className="text-gray-600 text-base md:text-lg px-4">Find exactly what you're looking for</p>
            </div>
            <CategoryGrid />
          </div>
        </section>

        {/* Featured Items - Mobile Optimized */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-800">Featured Items</h2>
              <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                <Star className="w-4 md:w-5 h-4 md:h-5 text-yellow-500 fill-current" />
                <p className="text-gray-600 text-base md:text-lg">Hand-picked quality rentals</p>
                <Star className="w-4 md:w-5 h-4 md:h-5 text-yellow-500 fill-current" />
              </div>
            </div>
            <FeaturedItems />
          </div>
        </section>

        {/* Enhanced CTA Section - Mobile Friendly */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Ready to Start Renting?</h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed px-4">
                Join thousands of Kenyans already using AnyHire to rent and earn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto min-h-[48px] text-base font-semibold">
                  <Link to="/auth" className="flex items-center justify-center">
                    Get Started Today
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <div className="flex items-center gap-2 text-sm opacity-75 mt-2 sm:mt-0">
                  <Shield className="w-4 h-4" />
                  <span>100% Secure & Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Index;
