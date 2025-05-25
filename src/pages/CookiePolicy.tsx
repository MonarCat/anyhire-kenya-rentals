
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
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and store some information about your preferences or past actions.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>AnyHire Kenya uses cookies for several purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly</li>
              <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website</li>
              <li><strong>Functional Cookies:</strong> These enable enhanced functionality and personalization</li>
              <li><strong>Targeting Cookies:</strong> These may be used to deliver relevant advertisements</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            
            <h3>Essential Cookies</h3>
            <p>These cookies are strictly necessary to provide you with services available through our website:</p>
            <ul>
              <li>Authentication cookies to keep you logged in</li>
              <li>Security cookies to protect against fraud</li>
              <li>Session cookies to maintain your preferences during your visit</li>
            </ul>

            <h3>Analytics Cookies</h3>
            <p>We use analytics cookies to:</p>
            <ul>
              <li>Understand how visitors use our website</li>
              <li>Improve our website performance and user experience</li>
              <li>Generate statistical reports on website activity</li>
            </ul>

            <h3>Functional Cookies</h3>
            <p>These cookies enhance the functionality of our website:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Provide enhanced features like chat support</li>
              <li>Personalize content based on your interests</li>
            </ul>

            <h2>4. Third-Party Cookies</h2>
            <p>We may also use third-party cookies from:</p>
            <ul>
              <li>Google Analytics for website analytics</li>
              <li>Payment processors for secure transactions</li>
              <li>Social media platforms for sharing functionality</li>
              <li>Customer support tools for live chat</li>
            </ul>

            <h2>5. Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            
            <h3>Browser Settings</h3>
            <p>Most web browsers allow you to:</p>
            <ul>
              <li>View and delete cookies</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from particular sites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close the browser</li>
            </ul>

            <h3>Opting Out</h3>
            <p>You can opt out of certain cookies:</p>
            <ul>
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
              <li>Advertising cookies: Visit the Network Advertising Initiative website</li>
            </ul>

            <h2>6. Cookie Consent</h2>
            <p>
              By continuing to use our website, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by adjusting your browser settings.
            </p>

            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at privacy@anyhire.co.ke.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicy;
