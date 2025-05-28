
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card>
          <CardContent className="prose max-w-none p-8">
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit AnyHire Kenya. They help us 
              provide you with a better, more personalized experience by remembering your preferences and 
              helping us understand how you use our platform.
            </p>

            <h2>2. How AnyHire Kenya Uses Cookies</h2>
            <p>We use cookies for several important purposes:</p>
            <ul>
              <li><strong>Essential Functionality:</strong> To keep you logged in and maintain your session</li>
              <li><strong>Security:</strong> To protect against fraud and unauthorized access</li>
              <li><strong>Performance:</strong> To understand how users interact with our platform</li>
              <li><strong>Personalization:</strong> To remember your preferences and settings</li>
              <li><strong>Communication:</strong> To enable chat and messaging features</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            
            <h3>Essential Cookies (Always Active)</h3>
            <p>These cookies are necessary for our platform to function properly:</p>
            <ul>
              <li><strong>Authentication:</strong> Keep you logged into your account</li>
              <li><strong>Security:</strong> Protect against cross-site request forgery and other attacks</li>
              <li><strong>Load Balancing:</strong> Ensure optimal platform performance</li>
              <li><strong>Form Data:</strong> Remember information you've entered in forms</li>
            </ul>

            <h3>Performance and Analytics Cookies</h3>
            <p>These help us understand platform usage and improve user experience:</p>
            <ul>
              <li>Page views and popular content analysis</li>
              <li>User journey mapping and navigation patterns</li>
              <li>Error tracking and performance monitoring</li>
              <li>Feature usage statistics</li>
            </ul>

            <h3>Functional Cookies</h3>
            <p>These enhance your platform experience:</p>
            <ul>
              <li>Language and region preferences</li>
              <li>Search filters and sorting preferences</li>
              <li>Recent items viewed</li>
              <li>Chat and communication settings</li>
            </ul>

            <h3>Marketing and Advertising Cookies</h3>
            <p>These may be used for relevant advertising (with your consent):</p>
            <ul>
              <li>Interest-based advertising</li>
              <li>Social media integration</li>
              <li>Conversion tracking</li>
              <li>Retargeting campaigns</li>
            </ul>

            <h2>4. Third-Party Cookies</h2>
            <p>We may use cookies from trusted third-party services:</p>
            
            <h3>Payment Processing</h3>
            <ul>
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>PayPal:</strong> For alternative payment options</li>
              <li><strong>M-Pesa:</strong> For mobile money transactions</li>
            </ul>

            <h3>Analytics and Performance</h3>
            <ul>
              <li><strong>Google Analytics:</strong> For understanding user behavior and platform performance</li>
              <li><strong>Hotjar:</strong> For user experience analysis and heatmaps</li>
            </ul>

            <h3>Communication and Support</h3>
            <ul>
              <li><strong>Intercom:</strong> For customer support chat functionality</li>
              <li><strong>Zendesk:</strong> For help desk and support ticket management</li>
            </ul>

            <h3>Social Media and Sharing</h3>
            <ul>
              <li><strong>Facebook:</strong> For social login and sharing features</li>
              <li><strong>Google:</strong> For authentication and maps integration</li>
              <li><strong>WhatsApp:</strong> For communication features</li>
            </ul>

            <h2>5. Managing Your Cookie Preferences</h2>
            
            <h3>Browser Settings</h3>
            <p>You can control cookies through your browser settings:</p>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
            </ul>

            <h3>Platform Cookie Settings</h3>
            <p>
              You can manage your cookie preferences directly on AnyHire Kenya through your account settings. 
              We provide granular controls for different types of cookies while ensuring essential functionality 
              remains intact.
            </p>

            <h3>Opt-Out Options</h3>
            <p>For specific services, you can opt out here:</p>
            <ul>
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
              <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer">Facebook Ad Preferences</a></li>
              <li><strong>Industry Opt-out:</strong> <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
            </ul>

            <h2>6. Mobile Apps and Device Settings</h2>
            <p>
              If you use our mobile app, similar tracking technologies may be used. You can control these 
              through your device settings:
            </p>
            <ul>
              <li><strong>iOS:</strong> Settings → Privacy → Tracking</li>
              <li><strong>Android:</strong> Settings → Privacy → Ads</li>
            </ul>

            <h2>7. Cookie Consent and Withdrawal</h2>
            <p>
              When you first visit AnyHire Kenya, we'll ask for your consent to use non-essential cookies. 
              You can withdraw this consent at any time through your account settings or by contacting us directly.
            </p>

            <h2>8. Data Retention</h2>
            <p>
              Different cookies have different lifespans:
            </p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain for a set period (usually 30 days to 2 years)</li>
              <li><strong>Essential Cookies:</strong> Retained as long as necessary for platform functionality</li>
            </ul>

            <h2>9. Impact of Disabling Cookies</h2>
            <p>
              While you can disable cookies, this may affect your experience on AnyHire Kenya:
            </p>
            <ul>
              <li>You may need to log in more frequently</li>
              <li>Some features may not work properly</li>
              <li>Personalized content may not be available</li>
              <li>We cannot remember your preferences</li>
            </ul>

            <h2>10. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy to reflect changes in technology, legal requirements, or our practices. 
              We'll notify you of significant changes through email or platform notifications.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@anyhire.co.ke</li>
              <li>Phone: +254 700 000 000</li>
              <li>Address: AnyHire Limited, Nairobi, Kenya</li>
            </ul>

            <p className="mt-8 text-sm text-gray-600">
              By continuing to use AnyHire Kenya, you consent to our use of cookies as described in this policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicy;
