
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { SEO } from '@/components/SEO';

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <SEO 
        title="Privacy Policy - 2day garden"
        description="Learn about how 2day garden collects, uses, and protects your personal data in compliance with UK/EU regulations."
        canonicalUrl={`${window.location.origin}/privacy-policy`}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
          <p>Last updated: April 16, 2025</p>
          
          <h2>Introduction</h2>
          <p>
            Welcome to 2day garden ("we", "our", "us"). We respect your privacy and are committed to 
            protecting your personal data. This privacy policy explains how we collect, use, disclose, 
            and safeguard your information when you visit our website and use our services.
          </p>
          
          <h2>Data Controller</h2>
          <p>
            2day garden is the data controller and responsible for your personal data. If you have 
            questions about this privacy policy or our privacy practices, please contact us at:
            <br />
            Email: privacy@2daygarden.com
          </p>
          
          <h2>The Data We Collect</h2>
          <p>
            We may collect several different types of information for various purposes:
          </p>
          <ul>
            <li>
              <strong>Personal Data:</strong> Name, email address, phone number, address, and other 
              contact or identifying information you voluntarily provide when creating an account or 
              contacting us.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our website and services, 
              including IP address, browser type, pages visited, time and date of visits, time spent 
              on pages, and other diagnostic data.
            </li>
            <li>
              <strong>Garden Data:</strong> Information about your garden, plants, and gardening 
              activities that you enter into our application.
            </li>
          </ul>
          
          <h2>How We Collect Your Data</h2>
          <p>
            We collect your data through various methods:
          </p>
          <ul>
            <li>
              <strong>Direct interactions:</strong> When you create an account, fill in forms, 
              correspond with us, or use our services.
            </li>
            <li>
              <strong>Automated technologies:</strong> As you navigate through our website, 
              we may automatically collect technical data about your equipment, browsing actions, 
              and patterns. We collect this data using cookies and similar technologies.
            </li>
          </ul>
          
          <h2>How We Use Your Data</h2>
          <p>
            We use your personal data for the following purposes:
          </p>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To notify you about changes to our services</li>
            <li>To allow you to participate in interactive features of our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our services</li>
            <li>To monitor the usage of our services</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To provide you with news, special offers, and general information about other goods, services, and events</li>
          </ul>
          
          <h2>Legal Basis for Processing</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests</li>
            <li>Where we need to comply with a legal obligation</li>
            <li>Where you have provided consent</li>
          </ul>
          
          <h2>Data Retention</h2>
          <p>
            We will only retain your personal data for as long as reasonably necessary to fulfill the purposes 
            we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting 
            or reporting requirements. We may retain your personal data for a longer period in the event of a 
            complaint or if we reasonably believe there is a prospect of litigation.
          </p>
          
          <h2>Data Sharing</h2>
          <p>
            We may share your personal data with the following categories of recipients:
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> We may share your data with third party service providers who perform services on our behalf, such as hosting, analytics, customer service, etc.
            </li>
            <li>
              <strong>Business Partners:</strong> We may share your information with our business partners to offer you certain products, services, or promotions.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information where required to do so by law or subpoena.
            </li>
          </ul>
          
          <h2>International Transfers</h2>
          <p>
            We may transfer your personal data to countries outside the UK/EEA. Whenever we transfer your personal 
            data out of the UK/EEA, we ensure a similar degree of protection is afforded to it by ensuring appropriate 
            safeguards are implemented.
          </p>
          
          <h2>Your Data Protection Rights</h2>
          <p>
            Under data protection laws, you have rights including:
          </p>
          <ul>
            <li><strong>Right to access</strong> your personal data</li>
            <li><strong>Right to rectification</strong> of your personal data</li>
            <li><strong>Right to erasure</strong> of your personal data</li>
            <li><strong>Right to restrict processing</strong> of your personal data</li>
            <li><strong>Right to data portability</strong> - to receive a copy of your personal data</li>
            <li><strong>Right to object</strong> to processing of your personal data</li>
            <li><strong>Right to withdraw consent</strong> at any time</li>
          </ul>
          <p>
            If you wish to exercise any of these rights, please contact us at privacy@2daygarden.com.
          </p>
          
          <h2>Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain 
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being 
            sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            For more information about the cookies we use, please see our <a href="/cookie-policy" className="text-primary">Cookie Policy</a>.
          </p>
          
          <h2>Children's Privacy</h2>
          <p>
            Our service does not address anyone under the age of 16. We do not knowingly collect personally identifiable 
            information from anyone under the age of 16. If you are a parent or guardian and you are aware that your 
            child has provided us with personal data, please contact us.
          </p>
          
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
            <br />
            Email: privacy@2daygarden.com
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
