
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

  const currentDate = new Date();
  const day = format(currentDate, 'dd');
  const month = format(currentDate, 'MMMM');
  const year = format(currentDate, 'yyyy');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="print:block">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b-2 border-blue-600 pb-4">
          <div className="flex items-center space-x-4">
            <Logo size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-blue-600">AnyHire Kenya</h1>
              <p className="text-gray-600">Legal Rental Agreement</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Generated: {format(currentDate, 'dd/MM/yyyy')}</p>
            <p>www.anyhire.co.ke</p>
          </div>
        </div>

        {/* Agreement Content */}
        <div className="space-y-6 text-sm leading-relaxed">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">RENTAL AGREEMENT</h2>
            <p className="mb-6">
              <strong>This Rental Agreement</strong> ("Agreement") is made and entered into on this{" "}
              <span className="underline font-semibold">{day}</span> day of{" "}
              <span className="underline font-semibold">{month}</span>, <span className="underline font-semibold">{year}</span>, by and between:
            </p>
          </div>

          {/* Section 1: Owner Information */}
          <div className="border-2 border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3 text-blue-600">1. OWNER INFORMATION</h3>
            <div className="space-y-2">
              <p>Full Name: <span className="underline font-semibold">{itemDetails.owner.fullName}</span></p>
              <p>Entity Type (Individual/Retailer/Company/Corporation): <span className="underline">Individual</span></p>
              <p>Identification Number (ID/Passport/Company Reg. No.): ___________________________</p>
              <p>Address: ________________________________________________________________</p>
              <p>Phone Number: <span className="underline font-semibold">{itemDetails.owner.phone}</span></p>
              <p>Email Address: <span className="underline font-semibold">{itemDetails.owner.email}</span></p>
            </div>
          </div>

          {/* Section 2: Renter Information */}
          <div className="border-2 border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3 text-blue-600">2. RENTER INFORMATION</h3>
            <div className="space-y-2">
              <p>Full Name: <span className="underline font-semibold">{renterDetails.fullName}</span></p>
              <p>Entity Type (Individual/Retailer/Company/Corporation): <span className="underline">Individual</span></p>
              <p>Identification Number (ID/Passport/Company Reg. No.): <span className="underline font-semibold">{renterDetails.idNumber}</span></p>
              <p>Address: ________________________________________________________________</p>
              <p>Phone Number: <span className="underline font-semibold">{renterDetails.phone}</span></p>
              <p>Email Address: <span className="underline font-semibold">{renterDetails.email}</span></p>
            </div>
          </div>

          {/* Section 3: Item Details */}
          <div className="border-2 border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3 text-blue-600">3. ITEM(S) DETAILS</h3>
            <div className="space-y-2">
              <p>Item Description: <span className="underline font-semibold">{itemDetails.title} - {itemDetails.description}</span></p>
              <p>Model/Make: ________________________________________________________________</p>
              <p>Serial Number(s): ________________________________________________________________</p>
              <div className="mt-3">
                <p className="font-semibold">Condition at Time of Rental (Tick as applicable):</p>
                <div className="mt-2 space-y-1">
                  <p>[ ] Perfect</p>
                  <p>[ ] Good</p>
                  <p>[ ] Fair</p>
                  <p>[ ] Malfunctioning</p>
                  <p>[ ] Other: ________________________________________________________________</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Terms of Agreement */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-600">4. TERMS OF AGREEMENT</h3>
            
            <div>
              <h4 className="font-semibold">4.1. Payment Terms:</h4>
              <p>Payment shall be made via the official platform <a href="https://anyhire.co.ke" className="text-blue-600 underline">https://anyhire.co.ke</a> and must reflect the Renter's full official name. The Owner is under no obligation to release the item until successful payment confirmation is received via the site.</p>
              <div className="mt-2 bg-blue-50 p-3 rounded">
                <p><strong>Rental Amount:</strong> KES {rentalDetails.totalAmount.toLocaleString()} ({itemDetails.pricePeriod})</p>
                <p><strong>Security Deposit:</strong> KES {rentalDetails.securityDeposit.toLocaleString()}</p>
                <p><strong>Total Payment:</strong> KES {(rentalDetails.totalAmount + rentalDetails.securityDeposit).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">4.2. Item Verification and Inspection:</h4>
              <p>The Owner is required to:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Present the item to the Renter for thorough inspection.</li>
                <li>Confirm with the Renter that the item is in perfect working condition.</li>
              </ul>
              <p>The Renter shall:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Only proceed with payment if fully satisfied with the condition of the item.</li>
                <li>Reserve the right to reject or request an alternative item if the presented one is not in proper condition.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">4.3. Identification and Verification:</h4>
              <p>The Owner must:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Demand an original identification document from the Renter.</li>
                <li>Take a clear photo of the Renter alongside the document.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">4.4. Collection and Return:</h4>
              <ul className="list-disc list-inside ml-4">
                <li>Item(s) will only be released after payment is confirmed and this agreement is signed by both parties.</li>
                <li>Both parties must agree on a strict return date and time, recorded as:</li>
              </ul>
              <div className="mt-2 bg-yellow-50 p-3 rounded">
                <p>Return Date: <span className="underline font-semibold">{format(new Date(rentalDetails.endDate), 'dd/MM/yyyy')}</span>   Time: <span className="underline">________________</span></p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">4.5. Legal Standing and Witness:</h4>
              <p>AnyHire Limited, through the platform <a href="https://anyhire.co.ke" className="text-blue-600 underline">https://anyhire.co.ke</a>, acts as a neutral intermediary and the legal witness to this agreement <strong>only</strong> if the payment is made via the platform.</p>
              <p className="mt-2">This agreement shall have a unique tracking number auto-generated upon downloading from the platform, serving as a reference ID for all transactions. Upon being completed and signed by both parties, a scanned copy must be uploaded back to the platform. Once verified and linked to a successful transaction, a digital signature will be generated and affixed to the agreement. This digitally signed version becomes the official and legally valid copy available for both parties to download and retain.</p>
            </div>

            <div>
              <h4 className="font-semibold">4.6. Liability and Fraud Mitigation:</h4>
              <ul className="list-disc list-inside ml-4">
                <li>The Renter shall be held legally liable for any loss, damage, or disappearance of the rented item.</li>
                <li>The Owner shall be liable if it is established that the item was faulty or stolen, causing loss or harm to the Renter.</li>
                <li>In either case, AnyHire Limited will provide both parties' official records for legal action or warrant issuance.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">4.7. Legal Reference:</h4>
              <p>This agreement is governed by the relevant laws of Kenya, including but not limited to:</p>
              <ul className="list-disc list-inside ml-4">
                <li>The Law of Contract Act (Cap 23, Laws of Kenya)</li>
                <li>The Penal Code (Cap 63, with respect to fraud and theft)</li>
                <li>The Consumer Protection Act, 2012</li>
                <li>The Data Protection Act, 2019</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">4.8. Dispute Resolution:</h4>
              <p>All disputes arising from this Agreement shall first be resolved amicably between the parties. If unresolved, the matter shall be referred to arbitration in Nairobi, Kenya under the Arbitration Act (Cap 49).</p>
            </div>

            <div>
              <h4 className="font-semibold">4.9. Agreement Validity:</h4>
              <p>This Agreement becomes legally binding once:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Both parties sign below;</li>
                <li>Payment is successfully made via <a href="https://anyhire.co.ke" className="text-blue-600 underline">https://anyhire.co.ke</a>;</li>
                <li>Verification steps above have been completed.</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Signatures */}
          <div className="border-t-2 border-gray-400 pt-6">
            <h3 className="text-lg font-bold mb-6 text-blue-600">5. SIGNATURES</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="border border-gray-300 p-4 rounded">
                <h4 className="font-bold mb-4">OWNER REPRESENTATIVE</h4>
                <div className="space-y-4">
                  <p>Name: <span className="underline">{itemDetails.owner.fullName}</span></p>
                  <div>
                    <p>Signature: ________________________________</p>
                    <div className="h-12 border-b border-gray-300 mb-2"></div>
                  </div>
                  <p>Date: <span className="underline">{format(currentDate, 'dd/MM/yyyy')}</span></p>
                </div>
              </div>

              <div className="border border-gray-300 p-4 rounded">
                <h4 className="font-bold mb-4">RENTER REPRESENTATIVE</h4>
                <div className="space-y-4">
                  <p>Name: <span className="underline">{renterDetails.fullName}</span></p>
                  <div>
                    <p>Signature: ________________________________</p>
                    <div className="h-12 border-b border-gray-300 mb-2"></div>
                  </div>
                  <p>Date: <span className="underline">{format(currentDate, 'dd/MM/yyyy')}</span></p>
                </div>
              </div>
            </div>

            <div className="border-2 border-blue-200 bg-blue-50 p-4 rounded">
              <h4 className="font-bold mb-4 text-blue-800">ANYHIRE LIMITED WITNESS</h4>
              <p className="text-sm italic mb-3">(Valid only upon confirmed payment via AnyHire)</p>
              <div className="space-y-3">
                <p>Transaction Tracking ID: ________________________________</p>
                <p>Authorized Agent Name: ________________________________</p>
                <div>
                  <p>Signature: ________________________________</p>
                  <div className="h-12 border-b border-gray-400 mb-2"></div>
                </div>
                <p>Date: ________________________________</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-gray-300 pt-4 text-xs text-gray-600 italic">
            <p>This document should be retained by both parties and a copy uploaded or logged in the AnyHire transaction record. A digitally signed version shall be made available to both parties upon validation.</p>
          </div>
        </div>

        {/* Print Button (hidden in print) */}
        <div className="text-center mt-8 print:hidden">
          <button
            onClick={printAgreement}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
          >
            Print Legal Agreement
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalAgreementForm;
