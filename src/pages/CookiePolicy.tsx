
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { SEO } from '@/components/SEO';

const CookiePolicy = () => {
  return (
    <MainLayout>
      <SEO 
        title="Cookie Policy - 2day garden"
        description="Learn about how 2day garden uses cookies and how we protect your privacy."
        canonicalUrl={`${window.location.origin}/cookie-policy`}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
          <p>Last updated: April 16, 2025</p>
          
          <h2>What are cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to 
            the website owners. Cookies enhance your browsing experience by allowing websites to 
            remember your preferences and settings.
          </p>
          
          <h2>How we use cookies</h2>
          <p>
            At 2day garden, we use cookies for a variety of purposes to improve your experience 
            on our website. We categorize our cookies as follows:
          </p>
          
          <h3>Necessary cookies</h3>
          <p>
            These cookies are essential for the website to function properly. They enable basic 
            functions like page navigation and access to secure areas of the website. The website 
            cannot function properly without these cookies, and they are enabled by default and 
            cannot be disabled.
          </p>
          
          <h3>Analytics cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously. They help us improve the way our website works 
            by ensuring that users can easily find what they are looking for.
          </p>
          
          <h3>Marketing cookies</h3>
          <p>
            These cookies are used to track visitors across websites. The intention is to display 
            ads that are relevant and engaging for the individual user and thereby more valuable 
            for publishers and third-party advertisers.
          </p>
          
          <h3>Preference cookies</h3>
          <p>
            These cookies allow the website to remember choices you make (such as your user name, 
            language, or the region you are in) and provide enhanced, more personal features. They 
            may also be used to provide services you have asked for.
          </p>
          
          <h2>Managing your cookie preferences</h2>
          <p>
            You can manage your cookie preferences at any time by clicking on the 'Cookie Settings' 
            button at the bottom left of our website. You can choose to enable or disable different 
            types of cookies.
          </p>
          
          <p>
            Most web browsers also allow you to manage your cookie preferences. You can set your 
            browser to refuse cookies or delete certain cookies. Generally, you should also be able 
            to manage similar technologies in the same way that you manage cookies – using your 
            browsers preferences.
          </p>
          
          <p>
            Please note that if you choose to block cookies, you may not be able to use all the 
            features of our website.
          </p>
          
          <h2>Changes to our cookie policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by 
            posting the new Cookie Policy on this page and updating the "Last updated" date.
          </p>
          
          <h2>Contact us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us at:
            <br />
            Email: privacy@2daygarden.com
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiePolicy;
