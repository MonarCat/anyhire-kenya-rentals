
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
            <p>At AnyHire Kenya, we collect information you provide directly to us when you:</p>
            <ul>
              <li>Create an account on our platform</li>
              <li>List an item for rent</li>
              <li>Browse and search for rental items</li>
              <li>Communicate with other users through our platform</li>
              <li>Contact our customer support team</li>
              <li>Participate in surveys, promotions, or feedback sessions</li>
              <li>Upload profile pictures or item images</li>
            </ul>

            <h2>2. Types of Information Collected</h2>
            <p><strong>Personal Information:</strong></p>
            <ul>
              <li>Full name and contact details (email, phone number)</li>
              <li>Location information for item listings and user profiles</li>
              <li>Identification documents for verification purposes</li>
              <li>Payment information processed through secure payment gateways</li>
              <li>Profile information including bio, website, and preferences</li>
            </ul>
            
            <p><strong>Technical Information:</strong></p>
            <ul>
              <li>Device information, IP address, and browser type</li>
              <li>Usage patterns and platform interaction data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Facilitate secure rental transactions between users</li>
              <li>Verify user identities and prevent fraudulent activities</li>
              <li>Provide customer support and resolve disputes</li>
              <li>Improve our platform functionality and user experience</li>
              <li>Send important notifications about your account and transactions</li>
              <li>Comply with legal requirements and enforce our terms of service</li>
              <li>Generate insights for platform optimization (anonymized data only)</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>
            <p>We may share information about you in the following circumstances:</p>
            <ul>
              <li><strong>Between Users:</strong> Basic profile information is visible to facilitate rentals</li>
              <li><strong>Service Providers:</strong> With trusted partners who help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by Kenyan law or to prevent harm</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>Dispute Resolution:</strong> With relevant parties when resolving rental disputes</li>
            </ul>
            <p>We never sell your personal information to third parties for marketing purposes.</p>

            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul>
              <li>Encrypted data transmission and storage</li>
              <li>Secure payment processing through certified providers</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Incident response procedures for potential breaches</li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our services and comply with legal obligations. 
              Account information is retained until account deletion, while transaction records may be kept longer for 
              legal and regulatory compliance.
            </p>

            <h2>7. Your Rights Under Kenyan Law</h2>
            <p>In accordance with the Data Protection Act, 2019, you have the right to:</p>
            <ul>
              <li>Access and review your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and associated data</li>
              <li>Object to certain processing of your data</li>
              <li>Request data portability</li>
              <li>Lodge complaints with the Office of the Data Protection Commissioner</li>
            </ul>

            <h2>8. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
              and maintain security. You can control cookie settings through your browser, though some 
              features may not function properly if disabled.
            </p>

            <h2>9. Third-Party Services</h2>
            <p>
              Our platform integrates with third-party services for payments, mapping, and communications. 
              These services have their own privacy policies, and we encourage you to review them.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be processed in servers located outside Kenya. We ensure appropriate 
              safeguards are in place to protect your data during international transfers.
            </p>

            <h2>11. Updates to This Policy</h2>
            <p>
              We may update this privacy policy to reflect changes in our practices or legal requirements. 
              We will notify you of significant changes through email or platform notifications.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or your personal data, contact us at:
            </p>
            <ul>
              <li>Email: privacy@anyhire.co.ke</li>
              <li>Phone: +254 700 000 000</li>
              <li>Address: AnyHire Limited, Nairobi, Kenya</li>
            </ul>
            <p>
              For data protection complaints, you may also contact the Office of the Data Protection Commissioner of Kenya.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
