
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from './Logo';

interface RentalAgreementFormProps {
  itemDetails: {
    title: string;
    description: string;
    price: number;
    pricePeriod: string;
    owner: {
      fullName: string;
      phone: string;
      email: string;
    };
  };
  renterDetails: {
    fullName: string;
    phone: string;
    email: string;
    idNumber: string;
  };
  rentalDetails: {
    startDate: string;
    endDate: string;
    totalAmount: number;
    securityDeposit: number;
  };
}

const RentalAgreementForm: React.FC<RentalAgreementFormProps> = ({
  itemDetails,
  renterDetails,
  rentalDetails
}) => {
  const printAgreement = () => {
    window.print();
  };

  const serviceCharge = Math.round(rentalDetails.totalAmount * 0.05);
  const ownerReceives = rentalDetails.totalAmount - serviceCharge;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="print:block">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b-2 border-blue-600 pb-4">
          <div className="flex items-center space-x-4">
            <Logo size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-blue-600">AnyHire Kenya</h1>
              <p className="text-gray-600">Rental Agreement</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Agreement Date: {format(new Date(), 'dd/MM/yyyy')}</p>
            <p>www.anyhire.co.ke</p>
          </div>
        </div>

        {/* Agreement Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-center">RENTAL AGREEMENT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">OWNER (Lessor)</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {itemDetails.owner.fullName}</p>
                  <p><strong>Phone:</strong> {itemDetails.owner.phone}</p>
                  <p><strong>Email:</strong> {itemDetails.owner.email}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">RENTER (Lessee)</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {renterDetails.fullName}</p>
                  <p><strong>Phone:</strong> {renterDetails.phone}</p>
                  <p><strong>Email:</strong> {renterDetails.email}</p>
                  <p><strong>ID Number:</strong> {renterDetails.idNumber}</p>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-600">RENTAL ITEM</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Item:</strong> {itemDetails.title}</p>
                <p><strong>Description:</strong> {itemDetails.description}</p>
                <p><strong>Rental Rate:</strong> KES {itemDetails.price.toLocaleString()} {itemDetails.pricePeriod}</p>
              </div>
            </div>

            {/* Rental Terms */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-600">RENTAL TERMS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Start Date:</strong> {format(new Date(rentalDetails.startDate), 'dd/MM/yyyy')}</p>
                  <p><strong>End Date:</strong> {format(new Date(rentalDetails.endDate), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p><strong>Total Amount:</strong> KES {rentalDetails.totalAmount.toLocaleString()}</p>
                  <p><strong>Security Deposit:</strong> KES {rentalDetails.securityDeposit.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-600">PAYMENT BREAKDOWN</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rental Amount:</span>
                    <span>KES {rentalDetails.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>AnyHire Service Charge (5%):</span>
                    <span>- KES {serviceCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Owner Receives:</span>
                    <span>KES {ownerReceives.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-600">TERMS AND CONDITIONS</h3>
              <div className="text-sm space-y-2">
                <p>1. The renter agrees to use the item responsibly and return it in the same condition as received.</p>
                <p>2. Any damage beyond normal wear and tear will be deducted from the security deposit.</p>
                <p>3. Late return fees may apply as per AnyHire's standard rates.</p>
                <p>4. Payment is processed through AnyHire platform with 5% service charge.</p>
                <p>5. Both parties agree to AnyHire's Terms of Service and Privacy Policy.</p>
                <p>6. Any disputes will be resolved through AnyHire's dispute resolution process.</p>
                <p>7. This agreement is governed by the laws of Kenya.</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <div className="border-t-2 border-gray-300 pt-4">
                  <p className="text-center font-semibold">OWNER SIGNATURE</p>
                  <div className="h-16 mb-2"></div>
                  <p className="text-center text-sm">Date: ___________</p>
                </div>
              </div>
              <div>
                <div className="border-t-2 border-gray-300 pt-4">
                  <p className="text-center font-semibold">RENTER SIGNATURE</p>
                  <div className="h-16 mb-2"></div>
                  <p className="text-center text-sm">Date: ___________</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <p>This agreement is facilitated by AnyHire Kenya - Kenya's Premier Rental Marketplace</p>
          <p>For support, contact us at support@anyhire.co.ke or +254 700 000 000</p>
        </div>

        {/* Print Button (hidden in print) */}
        <div className="text-center mt-6 print:hidden">
          <button
            onClick={printAgreement}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Print Agreement
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalAgreementForm;
