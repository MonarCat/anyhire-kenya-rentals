
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Users, Phone, Camera, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SafetyTips = () => {
  const quickTips = [
    {
      icon: <Eye className="w-6 h-6 text-blue-600" />,
      title: "Meet in Person",
      description: "Always inspect items in person before renting. Meet in safe, public places like shopping centers or cafes."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Verify Identity",
      description: "Check the renter's/owner's ID and contact information. Use verified profiles and ratings when available."
    },
    {
      icon: <Lock className="w-6 h-6 text-blue-600" />,
      title: "Secure Payments",
      description: "Only use AnyHire's secure payment system. Never send money through unofficial channels or cash upfront."
    },
    {
      icon: <Camera className="w-6 h-6 text-blue-600" />,
      title: "Document Everything",
      description: "Take photos of the item's condition before and after rental. Keep all communications within the platform."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Trust Your Instincts",
      description: "If something feels off, don't proceed. Report suspicious behavior to our support team immediately."
    },
    {
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      title: "Safe Meeting Places",
      description: "Choose busy, well-lit public locations. Consider meeting at police stations for high-value items."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Safety Guidelines</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay safe while using AnyHire Kenya. Follow these guidelines for secure and successful rental transactions.
          </p>
        </div>

        {/* Quick Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickTips.map((tip, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {tip.icon}
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                For Renters
              </CardTitle>
              <CardDescription>Essential tips for safe item rental</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Before Renting</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Review the owner's profile, ratings, and previous reviews</li>
                  <li>• Ask detailed questions about the item's condition and functionality</li>
                  <li>• Confirm pickup/return locations and times in advance</li>
                  <li>• Understand the rental terms, cancellation policy, and damage liability</li>
                  <li>• Check if insurance or deposits are required</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2">During Pickup</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Bring valid government-issued ID for verification</li>
                  <li>• Thoroughly test the item before accepting it</li>
                  <li>• Take photos/videos of any existing damage or wear</li>
                  <li>• Get a demonstration of how to use the item properly</li>
                  <li>• Confirm return date, time, and condition expectations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">During Rental Period</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Use the item responsibly and as intended</li>
                  <li>• Follow all usage instructions and safety guidelines</li>
                  <li>• Contact the owner immediately if issues arise</li>
                  <li>• Keep the item secure and protected from damage</li>
                  <li>• Document any problems with photos and messages</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                For Owners
              </CardTitle>
              <CardDescription>Best practices for safe item lending</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Before Listing</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Take high-quality photos from multiple angles</li>
                  <li>• Write detailed, honest descriptions of condition and functionality</li>
                  <li>• Set fair rental rates based on item value and market rates</li>
                  <li>• Consider insurance options for high-value items</li>
                  <li>• Create clear rental terms and conditions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2">Screening Renters</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Check renter profiles, ratings, and reviews</li>
                  <li>• Verify government-issued identification</li>
                  <li>• Ask about intended use and experience with similar items</li>
                  <li>• Consider requiring references for expensive items</li>
                  <li>• Trust your instincts about potential renters</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">During Handover</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Meet in safe, public locations during daylight hours</li>
                  <li>• Demonstrate proper use and safety features</li>
                  <li>• Document the item's condition with photos/videos</li>
                  <li>• Provide clear usage instructions and emergency contacts</li>
                  <li>• Confirm return arrangements and condition expectations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Red Flags and Emergency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Red Flags to Watch For
              </CardTitle>
              <CardDescription>Warning signs of potential fraud or problems</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Requests to pay outside the AnyHire platform</li>
                <li>• Pressure to make quick decisions without inspection</li>
                <li>• Reluctance to meet in person or provide ID verification</li>
                <li>• Prices significantly below market value</li>
                <li>• Poor communication or vague responses to questions</li>
                <li>• Newly created profiles with no reviews or history</li>
                <li>• Requests for personal banking or financial information</li>
                <li>• Insistence on cash-only transactions</li>
                <li>• Items that seem too good to be true</li>
                <li>• Aggressive or threatening behavior</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Phone className="w-6 h-6 text-green-600" />
                Emergency Contacts & Reporting
              </CardTitle>
              <CardDescription>What to do if something goes wrong</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">AnyHire Support</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Email: support@anyhire.co.ke</li>
                  <li>• Phone: +254 700 000 000 (24/7)</li>
                  <li>• WhatsApp: +254 700 000 000</li>
                  <li>• In-app chat support</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Emergency Services</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Police: 999 or 112</li>
                  <li>• DCI (Criminal Investigations): 0800 722 203</li>
                  <li>• Fraud Reporting: 0800 100 777</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">What to Report</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Suspected fraud or scams</li>
                  <li>• Threatening or aggressive behavior</li>
                  <li>• Identity theft or fake profiles</li>
                  <li>• Stolen or damaged items</li>
                  <li>• Payment disputes</li>
                  <li>• Safety concerns or incidents</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Safety Message */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Remember: Your Safety Comes First</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              While AnyHire Kenya provides a secure platform for rentals, your personal safety is ultimately your responsibility. 
              Always trust your instincts, meet in public places, and don't hesitate to cancel a transaction if you feel uncomfortable. 
              Our support team is available 24/7 to help with any concerns or questions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyTips;
