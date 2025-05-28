
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card>
          <CardContent className="prose max-w-none p-8">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using AnyHire Kenya (the "Platform" available at anyhire.co.ke), you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform.
            </p>

            <h2>2. About AnyHire Kenya</h2>
            <p>
              AnyHire Kenya is a peer-to-peer rental marketplace that connects item owners with people who need to rent those items. 
              We facilitate these connections but are not a party to the actual rental agreements between users.
            </p>

            <h2>3. User Accounts and Verification</h2>
            <p>To use our platform, you must:</p>
            <ul>
              <li>Be at least 18 years old or have parental consent</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Verify your identity when required for safety and fraud prevention</li>
              <li>Keep your profile information current and accurate</li>
            </ul>
            <p>You are responsible for all activities that occur under your account.</p>

            <h2>4. Platform Usage</h2>
            <h3>For Item Owners:</h3>
            <ul>
              <li>You must own or have legal authority to rent the items you list</li>
              <li>Provide accurate descriptions, photos, and condition assessments</li>
              <li>Set fair and competitive rental prices</li>
              <li>Maintain items in the condition described</li>
              <li>Be available for item handover and return as agreed</li>
            </ul>

            <h3>For Renters:</h3>
            <ul>
              <li>Use rented items responsibly and as intended</li>
              <li>Return items on time and in the same condition</li>
              <li>Report any issues or damages immediately</li>
              <li>Complete payments through the platform's secure system</li>
              <li>Provide valid identification when required</li>
            </ul>

            <h2>5. Prohibited Activities</h2>
            <p>Users must not:</p>
            <ul>
              <li>List stolen, illegal, or counterfeit items</li>
              <li>Engage in fraudulent transactions or identity theft</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Attempt to bypass platform fees or payment systems</li>
              <li>Create multiple accounts to manipulate the system</li>
              <li>List items that violate Kenyan laws or regulations</li>
              <li>Use the platform for illegal activities</li>
            </ul>

            <h2>6. Payment and Fees</h2>
            <p>
              All payments must be processed through AnyHire Kenya's secure payment system. We charge service fees 
              to maintain and improve the platform. Fee structures are clearly displayed before transaction completion. 
              Refunds are subject to our refund policy and dispute resolution procedures.
            </p>

            <h2>7. Safety and Security</h2>
            <p>
              User safety is our priority. We recommend meeting in public places, verifying identities, and using 
              our platform's communication tools. We provide safety guidelines and support, but users are ultimately 
              responsible for their personal safety during transactions.
            </p>

            <h2>8. Dispute Resolution</h2>
            <p>
              In case of disputes between users, we provide mediation services. Our dispute resolution process includes:
            </p>
            <ul>
              <li>Initial mediation through our support team</li>
              <li>Evidence review and assessment</li>
              <li>Fair resolution recommendations</li>
              <li>Final arbitration if necessary</li>
            </ul>
            <p>Serious disputes may be referred to appropriate Kenyan authorities.</p>

            <h2>9. Liability and Insurance</h2>
            <p>
              AnyHire Kenya acts as an intermediary and is not liable for:
            </p>
            <ul>
              <li>Damage, loss, or theft of rented items</li>
              <li>Injuries or accidents during item usage</li>
              <li>Disputes between users</li>
              <li>Quality or condition of listed items</li>
            </ul>
            <p>
              Users are encouraged to have appropriate insurance coverage. We may offer optional insurance products 
              or partner with insurance providers.
            </p>

            <h2>10. Intellectual Property</h2>
            <p>
              The AnyHire platform, including its design, functionality, and content, is protected by intellectual 
              property laws. Users retain rights to their uploaded content but grant us license to use it for 
              platform operations.
            </p>

            <h2>11. Data Protection and Privacy</h2>
            <p>
              We are committed to protecting user data in compliance with Kenya's Data Protection Act, 2019. 
              Our Privacy Policy details how we collect, use, and protect your information.
            </p>

            <h2>12. Platform Modifications</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our platform with reasonable notice. 
              We may also update these terms as needed, with significant changes communicated to users.
            </p>

            <h2>13. Account Termination</h2>
            <p>
              We may suspend or terminate accounts for violations of these terms, fraudulent activity, or other 
              legitimate reasons. Users may also delete their accounts at any time through platform settings.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These terms are governed by the laws of Kenya, including:
            </p>
            <ul>
              <li>The Law of Contract Act (Cap 23)</li>
              <li>The Consumer Protection Act, 2012</li>
              <li>The Data Protection Act, 2019</li>
              <li>The Penal Code (Cap 63) regarding fraud and theft</li>
            </ul>
            <p>Disputes will be resolved in Kenyan courts with jurisdiction in Nairobi.</p>

            <h2>15. Contact Information</h2>
            <p>
              For questions about these Terms of Service, contact us at:
            </p>
            <ul>
              <li>Email: legal@anyhire.co.ke</li>
              <li>Phone: +254 700 000 000</li>
              <li>Address: AnyHire Limited, Nairobi, Kenya</li>
            </ul>

            <p className="mt-8 text-sm text-gray-600">
              By using AnyHire Kenya, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
