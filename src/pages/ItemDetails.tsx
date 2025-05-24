
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Shield, User, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - in real app, fetch based on id
  const item = {
    id: '1',
    title: 'Professional Camera - Canon EOS R5',
    description: 'High-end professional mirrorless camera perfect for photography and videography. Includes 24-105mm lens, extra batteries, memory cards, and carrying case. Ideal for weddings, events, and professional shoots.',
    price: 500,
    period: 'day',
    minRental: '4 hours',
    location: 'Westlands, Nairobi',
    category: 'Electronics',
    condition: 'Excellent',
    rating: 4.9,
    reviews: 127,
    isPromoted: true,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518486863524-d3e01b1a8adb?w=800&h=600&fit=crop'
    ],
    owner: {
      id: 'owner1',
      name: 'John Kamau',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      rating: 4.8,
      reviewCount: 89,
      responseTime: '2 hours',
      memberSince: '2022'
    },
    features: [
      '45MP Full Frame Sensor',
      '8K Video Recording',
      'Dual Memory Card Slots',
      'Weather Sealed Body',
      'In-Body Stabilization'
    ],
    included: [
      'Canon EOS R5 Camera Body',
      'RF 24-105mm f/4L IS USM Lens',
      '2x Extra Batteries',
      '64GB Memory Card',
      'Battery Charger',
      'Camera Strap',
      'Protective Case'
    ]
  };

  const handleRentNow = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to rent this item.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rental request sent!",
      description: "The owner will contact you shortly to confirm details.",
    });
  };

  const handleContactOwner = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to contact the owner.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent!",
      description: "Your message has been sent to the owner.",
    });
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <Link to="/" className="text-green-600 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={item.images[selectedImage]} 
                    alt={item.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {item.isPromoted && (
                    <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {item.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                          selectedImage === index ? 'border-green-500' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Item Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{item.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {item.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">What's Included</h4>
                    <ul className="space-y-2">
                      {item.included.map((inclusion, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm">{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl text-green-600">
                      KES {item.price.toLocaleString()}
                    </CardTitle>
                    <CardDescription>per {item.period}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-2xl">⭐</span>
                      <span className="font-semibold ml-1">{item.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">({item.reviews} reviews)</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Condition:</span>
                    <span>{item.condition}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Min. rental:</span>
                    <span>{item.minRental}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleRentNow}
                    disabled={!item.available}
                  >
                    {item.available ? 'Rent Now' : 'Not Available'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContactOwner}
                  >
                    Contact Owner
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>5% service fee applies</p>
                </div>
              </CardContent>
            </Card>

            {/* Owner Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Item Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={item.owner.avatar} alt={item.owner.name} />
                    <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{item.owner.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>⭐ {item.owner.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{item.owner.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response time:</span>
                    <span>{item.owner.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span>{item.owner.memberSince}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Meet in a public place for pickup</li>
                  <li>• Inspect the item before payment</li>
                  <li>• Keep all communication on platform</li>
                  <li>• Report any suspicious activity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
