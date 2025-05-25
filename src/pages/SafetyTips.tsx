
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SafetyTips = () => {
  const tips = [
    {
      icon: <Eye className="w-6 h-6 text-blue-600" />,
      title: "Meet in Person",
      description: "Always inspect items in person before renting. Meet in public places for exchanges."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Verify Identity",
      description: "Check the renter's/owner's ID and contact information. Use verified profiles when possible."
    },
    {
      icon: <Lock className="w-6 h-6 text-blue-600" />,
      title: "Secure Payments",
      description: "Use AnyHire's secure payment system. Never send money through unofficial channels."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      title: "Document Everything",
      description: "Take photos of the item's condition before and after rental. Keep all communications."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
      title: "Trust Your Instincts",
      description: "If something feels off, don't proceed. Report suspicious behavior to our support team."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Safety Tips</h1>
          <p className="text-gray-600">Stay safe while using AnyHire. Follow these guidelines for secure transactions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tips.map((tip, index) => (
            <Card key={index}>
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

        <Card>
          <CardHeader>
            <CardTitle>Detailed Safety Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">For Renters</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Always test items before taking them</li>
                <li>• Understand the rental terms and return conditions</li>
                <li>• Take photos of any existing damage</li>
                <li>• Return items on time and in the same condition</li>
                <li>• Communicate any issues immediately</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">For Owners</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Verify renter's identity and contact information</li>
                <li>• Set clear rental terms and conditions</li>
                <li>• Take detailed photos before handing over items</li>
                <li>• Consider requiring a security deposit</li>
                <li>• Keep maintenance records for your items</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Red Flags to Watch For</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Requests to pay outside the platform</li>
                <li>• Pressure to make quick decisions</li>
                <li>• Reluctance to meet in person or video call</li>
                <li>• Prices that seem too good to be true</li>
                <li>• Poor communication or vague responses</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyTips;
