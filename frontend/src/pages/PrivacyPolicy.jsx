import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card shadow-lg">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-neon-blue" />
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Information We Collect</h2>
            <p>
              When you use the Smart Waste Mapping Platform, we collect information you provide directly to us, such as when you create or modify your account, report waste, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
            </p>
            <p className="mt-2">
              <strong>Location Data:</strong> To provide accurate mapping features, we collect precise or approximate location data from your mobile device or computer if you enable us to do so.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, maintain, and improve our services (such as waste tracking and routing).</li>
              <li>Perform internal operations, including troubleshooting software bugs.</li>
              <li>Send you communications, including updates on your waste reports and eco-points.</li>
              <li>Personalize and improve the Services, including providing features or content that match your profile.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Sharing of Information</h2>
            <p>
              We may share the information we collect about you with municipal partners and local authorities solely for the purpose of efficient waste management and urban cleaning operations. We do not sell your personal data to advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
