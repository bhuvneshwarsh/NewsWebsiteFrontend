import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const socialLinks = [
    { href: 'https://www.facebook.com/prajatantrkigunj', label: 'Facebook', icon: Facebook, color: 'hover:text-blue-500' },
    { href: 'https://x.com/PGNewsIndia', label: 'Twitter', icon: Twitter, color: 'hover:text-sky-400' },
    { href: 'https://www.instagram.com/prajatantrakigunj', label: 'Instagram', icon: Instagram, color: 'hover:text-pink-500' },
    { href: 'https://www.youtube.com/@PrajatantrKiGunj', label: 'YouTube', icon: Youtube, color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-xl font-bold text-white mb-2">
                प्रजातंत्र <span className="text-brand-500">की गूंज</span>
            </h3>
            <p className="text-sm leading-relaxed">
              आपका विश्वसनीय समाचार स्रोत — ताज़ी खबरें, गहरी रिपोर्ट और ई-पेपर।
            </p>
          </div>

          {/* Sections */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              समाचार
            </h4>
            <ul className="space-y-1.5 text-sm">
              {[
                { label: 'राजनीति',    to: '/category/politics'      },
                { label: 'खेल',         to: '/category/sports'        },
                { label: 'व्यापार',     to: '/category/business'      },
                { label: 'तकनीक',       to: '/category/tech'          },
                { label: 'विश्व',       to: '/category/world'         },
                { label: 'मनोरंजन',    to: '/category/entertainment'  },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/epaper"  className="hover:text-white transition">E-Paper</Link></li>
              <li><Link to="/team"    className="hover:text-white transition">हमारी टीम</Link></li>
              <li><Link to="/about"   className="hover:text-white transition">हमारे बारे में</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">संपर्क करें</Link></li>
              <li>
                <Link to="/employee-login"
                  className="hover:text-white transition">Employee Login</Link>
              </li>
            </ul>
          </div>

          {/* Legal — critical for AdSense */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Legal
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/privacy-policy"
                  className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms"
                  className="hover:text-white transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/contact"
                  className="hover:text-white transition">Advertise With Us</Link>
              </li>
            </ul>

            <div className="mt-5">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Follow Us
              </h4>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ href, label, icon: Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={`group flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-gray-300 transition duration-300 hover:-translate-y-1 hover:scale-110 hover:border-white/40 ${color}`}
                  >
                    <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>

            {/* AdSense disclosure — required */}
            <div className="mt-4 bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                This site uses cookies and may display advertisements
                served by Google AdSense.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-gray-400">
              <Link to="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <span className="text-gray-700">|</span>
              <Link to="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
              <span className="text-gray-700">|</span>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </div>

            <div className="text-gray-500 leading-relaxed">
              <div>{formattedDate}</div>
              <div>
                © {year} Prajatantr Ki Gunj | Developed and Maintained by Bhuvneshwar Sharma
                (Senior Software Engineer - Full Stack Web Developer).
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
