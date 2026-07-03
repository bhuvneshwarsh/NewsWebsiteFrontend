import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

export default function TermsConditions() {
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
        <span className="text-gray-800 font-medium">Terms & Conditions</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl
        px-8 py-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-3">
          <FileText size={28} className="text-gray-300" />
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Terms & Conditions</h1>
        </div>
        <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        <p className="text-gray-300 text-sm mt-2 leading-relaxed">
          Please read these Terms and Conditions carefully before using the
          {' '}{siteName} website at {siteUrl}.
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8
        text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using {siteName} ({siteUrl}), you accept and agree to be
            bound by these Terms and Conditions. If you do not agree to these terms,
            please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            2. Use of the Website
          </h2>
          <p className="mb-3">
            You agree to use this website only for lawful purposes and in a manner
            that does not infringe the rights of others. You must not:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the website in any way that violates applicable local, national, or international laws</li>
            <li>Transmit any unsolicited or unauthorised advertising or promotional material</li>
            <li>Attempt to gain unauthorised access to any part of the website</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use of the website</li>
            <li>Use the website to transmit any harmful, offensive, or defamatory content</li>
            <li>Copy, reproduce, or republish our content without written permission</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            3. Intellectual Property
          </h2>
          <p className="mb-3">
            All content published on {siteName} — including but not limited to articles,
            photographs, graphics, logos, and videos — is the property of {siteName}
            or its content suppliers and is protected by applicable copyright laws.
          </p>
          <p>
            You may share links to our articles. However, you may not copy, reproduce,
            republish, upload, post, or distribute our content without our express
            written permission. Unauthorised use of our content may violate copyright,
            trademark, and other laws.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            4. News Content & Editorial Policy
          </h2>
          <p className="mb-3">
            {siteName} is an independent news publication. We strive to provide
            accurate, fair, and balanced reporting. However:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              News articles represent the views and reporting of our journalists and
              do not necessarily represent the views of any advertiser or sponsor.
            </li>
            <li>
              While we make every effort to ensure the accuracy of our reporting,
              we cannot guarantee that all information is complete or current.
            </li>
            <li>
              Opinions expressed in opinion pieces are those of the individual authors
              and do not reflect the editorial position of {siteName}.
            </li>
            <li>
              We reserve the right to edit, delete, or refuse to publish any content
              at our sole discretion.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            5. Third-Party Links
          </h2>
          <p>
            Our website may contain links to third-party websites. These links are
            provided for your convenience only. We have no control over the content
            of those websites and accept no responsibility for them or for any loss
            or damage that may arise from your use of them.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            6. Advertising
          </h2>
          <p className="mb-3">
            {siteName} displays advertisements to support our free news service.
            Advertisements are clearly marked as "विज्ञापन" (Advertisement) and are
            separate from our editorial content.
          </p>
          <p>
            We use Google AdSense to display third-party advertisements. The display
            of advertisements does not imply endorsement of the advertised products
            or services by {siteName}.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            7. User-Submitted Content
          </h2>
          <p className="mb-3">
            If you submit content to us (such as letters, comments, or news tips),
            you grant us a non-exclusive, royalty-free, perpetual licence to use,
            reproduce, modify, and publish that content.
          </p>
          <p>
            You represent that you own or have the necessary rights to the content
            you submit, and that the content does not infringe the rights of any
            third party.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            8. Disclaimer of Warranties
          </h2>
          <p className="mb-3">
            This website is provided on an "as is" and "as available" basis without
            any warranties of any kind, either express or implied, including but not
            limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Warranties of merchantability or fitness for a particular purpose</li>
            <li>Warranties that the website will be uninterrupted or error-free</li>
            <li>Warranties regarding the accuracy or completeness of the content</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            9. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, {siteName} shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of, or inability to use, this website or its content.
            This includes damages for loss of profits, data, goodwill, or other
            intangible losses.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            10. Privacy
          </h2>
          <p>
            Your use of this website is also governed by our
            <Link to="/privacy-policy"
              className="text-brand-600 hover:underline mx-1">
              Privacy Policy
            </Link>
            which is incorporated into these Terms and Conditions by reference.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            11. Governing Law
          </h2>
          <p>
            These Terms and Conditions are governed by and construed in accordance
            with the laws of India. Any disputes arising under or in connection with
            these terms shall be subject to the exclusive jurisdiction of the courts
            of India.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            12. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time.
            Changes will be effective immediately upon posting to the website.
            Your continued use of the website after any changes constitutes your
            acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">
            13. Contact Us
          </h2>
          <p className="mb-3">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1">
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
