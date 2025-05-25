
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card>
          <CardContent className="prose max-w-none p-8">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you:</p>
            <ul>
              <li>Create an account</li>
              <li>List an item for rent</li>
              <li>Contact other users</li>
              <li>Contact customer support</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>We may share information about you as follows:</p>
            <ul>
              <li>With other users when you list items or make rental requests</li>
              <li>With vendors, consultants, and other service providers</li>
              <li>In response to legal requests or to prevent harm</li>
              <li>In connection with any merger, sale of assets, or acquisition</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it or for other legitimate business purposes.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Delete your account and personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request data portability</li>
              <li>Withdraw consent where applicable</li>
            </ul>

            <h2>7. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar technologies to provide functionality, analyze usage, and improve your experience. You can control cookies through your browser settings.
            </p>

            <h2>8. Third-Party Services</h2>
            <p>
              Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 18. We do not knowingly collect personal information from children under 18.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than Kenya. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may change this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@anyhire.co.ke.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
