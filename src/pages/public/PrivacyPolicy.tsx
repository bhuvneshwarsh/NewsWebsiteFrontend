import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = 'July 3, 2026';
  const siteName   = 'Prajatantr Ki Gunj';
  const siteUrl    = 'https://www.prajatantrkigunj.com';
  const email      = 'prajatantrkigunj@gmail.com';

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-600 transition">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-800 font-medium">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl
        px-8 py-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Shield size={28} className="text-brand-200" />
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-brand-200 text-sm">
          Last updated: {lastUpdated}
        </p>
        <p className="text-brand-100 text-sm mt-2 leading-relaxed">
          This Privacy Policy describes how {siteName} collects, uses, and shares
          information when you visit our website at {siteUrl}.
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8
        text-gray-700 text-sm leading-relaxed">

        {/* Section 1 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            1. Information We Collect
          </h2>
          <p className="mb-3">
            When you visit <strong>{siteName}</strong> ({siteUrl}), we may collect
            the following types of information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Log Data:</strong> We automatically collect information your browser
              sends when you visit our site, including your IP address, browser type,
              browser version, the pages you visit, the time and date of your visit,
              and time spent on those pages.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to improve your experience on our
              website. Cookies are small data files stored on your device. You can
              instruct your browser to refuse all cookies or to indicate when a cookie
              is being sent.
            </li>
            <li>
              <strong>Contact Information:</strong> If you contact us through our Contact
              form, we collect your name, email address, and the content of your message.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about how you interact
              with our website, such as which articles you read and how long you spend
              on each page.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            2. How We Use Your Information
          </h2>
          <p className="mb-3">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, operate, and maintain our website</li>
            <li>To improve, personalise, and expand our website</li>
            <li>To understand and analyse how you use our website</li>
            <li>To develop new features, products, services, and functionality</li>
            <li>To communicate with you, including for customer service and support</li>
            <li>To send you updates, news, and other information relating to our website</li>
            <li>To find and prevent fraud and security issues</li>
            <li>To comply with applicable laws and regulations</li>
          </ul>
        </section>

        {/* Section 3 — Google AdSense */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            3. Third-Party Advertising (Google AdSense)
          </h2>
          <p className="mb-3">
            We use Google AdSense to display advertisements on our website.
            Google AdSense uses cookies to serve ads based on a user's prior visits
            to our website or other websites on the internet.
          </p>
          <p className="mb-3">
            Google's use of advertising cookies enables it and its partners to serve
            ads to our users based on their visit to our site and/or other sites on
            the Internet.
          </p>
          <p className="mb-3">
            Users may opt out of personalised advertising by visiting
            <a href="https://www.google.com/settings/ads" target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline ml-1">
              Google Ads Settings
            </a>.
          </p>
          <p>
            For more information on how Google uses data when you use our website,
            please visit:
            <a href="https://policies.google.com/technologies/partner-sites"
              target="_blank" rel="noopener noreferrer"
              className="text-brand-600 hover:underline ml-1">
              How Google uses data from sites that use Google services
            </a>.
          </p>
        </section>

        {/* Section 4 — Cookies */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            4. Cookies Policy
          </h2>
          <p className="mb-3">
            Our website uses cookies to enhance your experience. We use the following types:
          </p>
          <div className="space-y-3">
            {[
              { name: 'Essential Cookies', desc: 'Required for the website to function properly. These cannot be disabled.' },
              { name: 'Analytics Cookies', desc: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.' },
              { name: 'Advertising Cookies', desc: 'Used by Google AdSense to serve relevant advertisements based on your interests.' },
            ].map(c => (
              <div key={c.name} className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                <p className="text-gray-600 text-xs mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3">
            You can control cookies through your browser settings. However, disabling
            certain cookies may affect the functionality of our website.
          </p>
        </section>

        {/* Section 5 — Third parties */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            5. Third-Party Services
          </h2>
          <p className="mb-3">
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of these websites. We encourage
            you to review the privacy policies of any third-party sites you visit.
          </p>
          <p>
            We use the following third-party services that may collect information:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Google AdSense (Advertising)</li>
            <li>Google Analytics (Website Analytics)</li>
            <li>Microsoft Azure (Cloud Hosting)</li>
            <li>Cloudflare (Content Delivery Network)</li>
          </ul>
        </section>

        {/* Section 6 — Data security */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            6. Data Security
          </h2>
          <p>
            We take reasonable precautions to protect your information. However,
            no method of transmission over the Internet or method of electronic
            storage is 100% secure. While we strive to use commercially acceptable
            means to protect your personal information, we cannot guarantee its
            absolute security.
          </p>
        </section>

        {/* Section 7 — Children */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            7. Children's Privacy
          </h2>
          <p>
            Our website is not intended for children under the age of 13.
            We do not knowingly collect personally identifiable information from
            children under 13. If you believe that a child has provided us with
            personal information, please contact us immediately.
          </p>
        </section>

        {/* Section 8 — Your rights */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            8. Your Rights
          </h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to our use of your personal information</li>
            <li>Request restriction of processing your personal information</li>
            <li>Withdraw consent at any time where we rely on consent</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, please contact us at
            <a href={`mailto:${email}`}
              className="text-brand-600 hover:underline ml-1">{email}</a>.
          </p>
        </section>

        {/* Section 9 — Changes */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you
            of any changes by posting the new Privacy Policy on this page and updating
            the "Last updated" date. You are advised to review this Privacy Policy
            periodically for any changes.
          </p>
        </section>

        {/* Section 10 — Contact */}
        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            10. Contact Us
          </h2>
          <p className="mb-3">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 space-y-1">
            <p className="font-semibold text-gray-800">{siteName}</p>
            <p className="text-gray-600">
              Email:
              <a href={`mailto:${email}`}
                className="text-brand-600 hover:underline ml-1">{email}</a>
            </p>
            <p className="text-gray-600">
              Website:
              <a href={siteUrl} className="text-brand-600 hover:underline ml-1">{siteUrl}</a>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
