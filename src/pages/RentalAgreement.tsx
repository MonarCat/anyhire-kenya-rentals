
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RentalAgreementForm from '@/components/RentalAgreementForm';
import { useAuth } from '@/contexts/AuthContext';

const RentalAgreement = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [showAgreement, setShowAgreement] = useState(false);
  const [formData, setFormData] = useState({
    itemTitle: '',
    itemDescription: '',
    itemPrice: '',
    pricePeriod: 'day',
    ownerName: profile?.full_name || '',
    ownerPhone: profile?.phone || '',
    ownerEmail: user?.email || '',
    renterName: '',
    renterPhone: '',
    renterEmail: '',
    renterIdNumber: '',
    startDate: '',
    endDate: '',
    totalAmount: '',
    securityDeposit: ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access rental agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAgreement(true);
  };

  if (showAgreement) {
    const agreementData = {
      itemDetails: {
        title: formData.itemTitle,
        description: formData.itemDescription,
        price: parseInt(formData.itemPrice),
        pricePeriod: formData.pricePeriod,
        owner: {
          fullName: formData.ownerName,
          phone: formData.ownerPhone,
          email: formData.ownerEmail
        }
      },
      renterDetails: {
        fullName: formData.renterName,
        phone: formData.renterPhone,
        email: formData.renterEmail,
        idNumber: formData.renterIdNumber
      },
      rentalDetails: {
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalAmount: parseInt(formData.totalAmount),
        securityDeposit: parseInt(formData.securityDeposit)
      }
    };

    return <RentalAgreementForm {...agreementData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Generate Rental Agreement</CardTitle>
            <CardDescription>
              Create a professional rental agreement for your item listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateAgreement} className="space-y-6">
              {/* Item Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Item Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="itemTitle">Item Title *</Label>
                    <Input
                      id="itemTitle"
                      name="itemTitle"
                      value={formData.itemTitle}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Professional Camera"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemDescription">Item Description *</Label>
                    <Input
                      id="itemDescription"
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of the item"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemPrice">Price (KES) *</Label>
                      <Input
                        id="itemPrice"
                        name="itemPrice"
                        type="number"
                        value={formData.itemPrice}
                        onChange={handleInputChange}
                        required
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pricePeriod">Period *</Label>
                      <select
                        id="pricePeriod"
                        name="pricePeriod"
                        value={formData.pricePeriod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="hour">Per Hour</option>
                        <option value="day">Per Day</option>
                        <option value="week">Per Week</option>
                        <option value="month">Per Month</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Details (Pre-filled) */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Owner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Full Name *</Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerPhone">Phone *</Label>
                    <Input
                      id="ownerPhone"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="ownerEmail">Email *</Label>
                    <Input
                      id="ownerEmail"
                      name="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={handleInputChange}
                      required
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Renter Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Renter Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="renterName">Full Name *</Label>
                    <Input
                      id="renterName"
                      name="renterName"
                      value={formData.renterName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="renterPhone">Phone *</Label>
                    <Input
                      id="renterPhone"
                      name="renterPhone"
                      value={formData.renterPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="renterEmail">Email *</Label>
                    <Input
                      id="renterEmail"
                      name="renterEmail"
                      type="email"
                      value={formData.renterEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="renterIdNumber">ID Number *</Label>
                    <Input
                      id="renterIdNumber"
                      name="renterIdNumber"
                      value={formData.renterIdNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="National ID or Passport Number"
                    />
                  </div>
                </div>
              </div>

              {/* Rental Terms */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Rental Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalAmount">Total Amount (KES) *</Label>
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      type="number"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      required
                      placeholder="Total rental amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="securityDeposit">Security Deposit (KES) *</Label>
                    <Input
                      id="securityDeposit"
                      name="securityDeposit"
                      type="number"
                      value={formData.securityDeposit}
                      onChange={handleInputChange}
                      required
                      placeholder="Security deposit amount"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Generate Rental Agreement
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentalAgreement;
