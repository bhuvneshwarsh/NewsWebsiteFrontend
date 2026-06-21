import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">
              Prajatantr <span className="text-brand-500">Ki Gunj</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Your trusted source for breaking news, in-depth stories, and the latest e-paper edition.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Sections</h4>
            <ul className="space-y-1.5 text-sm">
              {['Politics','Sports','Business','Tech','World'].map(s => (
                <li key={s}>
                  <Link to={`/category/${s.toLowerCase()}`}
                    className="hover:text-white transition">{s}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">More</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/epaper" className="hover:text-white transition">E-Paper</Link></li>
              <li><Link to="/admin"  className="hover:text-white transition">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-xs text-center">
          © {year} Prajatantr Ki Gunj | Developed and Maintained by Bhuvneshwar Sharma (Full Stack Web Developer).
        </div>
      </div>
    </footer>
  );
}