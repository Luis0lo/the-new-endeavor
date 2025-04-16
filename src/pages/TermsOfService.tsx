
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { SEO } from '@/components/SEO';

const TermsOfService = () => {
  return (
    <MainLayout>
      <SEO 
        title="Terms of Service - 2day garden"
        description="Read the terms and conditions governing the use of 2day garden's services and website."
        canonicalUrl={`${window.location.origin}/terms-of-service`}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
          <p>Last updated: April 16, 2025</p>
          
          <h2>Introduction</h2>
          <p>
            Welcome to 2day garden ("Company", "we", "our", "us"). These Terms of Service govern your use of our 
            website and services. By accessing or using our website, you agree to be bound by these Terms. If you 
            disagree with any part of the terms, you may not access the service.
          </p>
          
          <h2>Definitions</h2>
          <ul>
            <li><strong>"Service"</strong> refers to the 2day garden website, applications, and any other related services provided by the Company.</li>
            <li><strong>"User"</strong> refers to the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.</li>
            <li><strong>"Content"</strong> refers to text, images, audio, video, software, data compilations, and any other materials that appear on our Service.</li>
          </ul>
          
          <h2>Account Registration</h2>
          <p>
            When you create an account with us, you guarantee that the information you provide is accurate, complete, 
            and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate 
            termination of your account on the Service.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account and password, including but not 
            limited to the restriction of access to your computer and/or account. You agree to accept responsibility 
            for any and all activities or actions that occur under your account and/or password.
          </p>
          
          <h2>Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive 
            property of 2day garden and its licensors. The Service is protected by copyright, trademark, and other 
            laws of both the United Kingdom and foreign countries. Our trademarks and trade dress may not be used 
            in connection with any product or service without the prior written consent of 2day garden.
          </p>
          
          <h2>User Content</h2>
          <p>
            Our Service allows you to post, link, store, share, and otherwise make available certain information, 
            text, graphics, videos, or other material ("User Content"). You are responsible for the User Content 
            that you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting User Content on or through the Service, you grant us the right to use, modify, publicly 
            perform, publicly display, reproduce, and distribute such content on and through the Service. You 
            retain any and all of your rights to any User Content you submit, post, or display on or through the 
            Service and you are responsible for protecting those rights.
          </p>
          
          <h2>Acceptable Use</h2>
          <p>
            You agree not to use the Service:
          </p>
          <ul>
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
            <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm the Company or users of the Service or expose them to liability.</li>
          </ul>
          
          <h2>Limitation of Liability</h2>
          <p>
            In no event shall 2day garden, nor its directors, employees, partners, agents, suppliers, or affiliates, 
            be liable for any indirect, incidental, special, consequential or punitive damages, including without 
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your 
            access to or use of or inability to access or use the Service; (ii) any conduct or content of any third 
            party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or 
            alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) 
            or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </p>
          
          <h2>Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" 
            basis. The Service is provided without warranties of any kind, whether express or implied, including, 
            but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement 
            or course of performance.
          </p>
          
          <h2>Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United Kingdom, without 
            regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms 
            will not be considered a waiver of those rights.
          </p>
          
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material we will 
            provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material 
            change will be determined at our sole discretion.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us:
            <br />
            Email: legal@2daygarden.com
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfService;
