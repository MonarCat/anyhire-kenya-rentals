
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
              By accessing and using AnyHire Kenya ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use AnyHire Kenya for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the platform</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Platform, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h2>4. Rental Transactions</h2>
            <p>
              AnyHire Kenya facilitates connections between item owners and renters. We are not a party to rental agreements and do not own, sell, or rent any items listed on the platform.
            </p>

            <h2>5. User Conduct</h2>
            <p>Users agree not to:</p>
            <ul>
              <li>Post false, inaccurate, misleading, or defamatory content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Engage in fraudulent activities</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>

            <h2>6. Payment and Fees</h2>
            <p>
              AnyHire Kenya may charge fees for certain services. All fees are non-refundable unless otherwise stated. Users are responsible for all taxes related to their use of the platform.
            </p>

            <h2>7. Disclaimers</h2>
            <p>
              The materials on AnyHire Kenya are provided on an 'as is' basis. AnyHire Kenya makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>8. Limitations</h2>
            <p>
              In no event shall AnyHire Kenya or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AnyHire Kenya, even if AnyHire Kenya or its authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2>9. Accuracy of Materials</h2>
            <p>
              The materials appearing on AnyHire Kenya could include technical, typographical, or photographic errors. AnyHire Kenya does not warrant that any of the materials on its platform are accurate, complete, or current.
            </p>

            <h2>10. Modifications</h2>
            <p>
              AnyHire Kenya may revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Kenya and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at legal@anyhire.co.ke.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
