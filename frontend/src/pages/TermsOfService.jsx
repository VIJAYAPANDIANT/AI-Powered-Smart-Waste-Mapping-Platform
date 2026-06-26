import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card shadow-lg">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-6">
          <FileText className="h-8 w-8 text-neon-pink" />
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using our Smart Waste Mapping Platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Use of the Platform</h2>
            <p>
              You agree to use the platform only for lawful purposes related to civic environmental improvement. You must not use the platform to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Submit false, misleading, or inappropriate waste reports.</li>
              <li>Harass, abuse, or harm another person or municipal worker.</li>
              <li>Attempt to manipulate the Eco Points reward system.</li>
              <li>Upload malicious code or attempt to compromise platform security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Eco Points and Rewards</h2>
            <p>
              Eco Points are earned through valid participation (e.g., reporting waste, joining cleanups). The platform reserves the right to adjust, revoke, or expire points if fraudulent activity is suspected. Rewards in the marketplace are subject to availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
