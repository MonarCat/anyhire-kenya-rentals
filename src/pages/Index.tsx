
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Shield, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FeaturedItems from '@/components/FeaturedItems';
import CategoryGrid from '@/components/CategoryGrid';

const Index = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Safe & Secure",
      description: "Verified users and secure transactions"
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Flexible Rentals",
      description: "Hourly, daily, or custom rental periods"
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Local Community",
      description: "Connect with people in your area"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Rent Anything, <span className="text-yellow-300">Anytime</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Kenya's premier rental marketplace. From tools to electronics, 
            from party equipment to vehicles - find what you need or earn from what you own.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link to="/search">
                <Search className="w-5 h-5 mr-2" />
                Browse Items
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link to="/list-item">
                <Plus className="w-5 h-5 mr-2" />
                List an Item
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AnyHire?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Items</h2>
          <FeaturedItems />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Renting?</h2>
          <p className="text-xl mb-8">Join thousands of Kenyans already using AnyHire</p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <Link to="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
