import { Link } from 'react-router-dom';
import { Newspaper, Target, Eye, Heart } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">


      <div>
        <div className="text-center mb-12">
          <img src="../public/PRGI_QR.png" alt="Prajatantr Ki Gunj Logo" className="mx-auto w-40 h-40 mb-4" />
        </div>
      </div>

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          About <span className="text-brand-600">प्रजातंत्र की गूंज</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          A trusted voice for the people — delivering honest, accurate, and timely news
          across politics, culture, sports, and beyond.
        </p>
        <div className="w-16 h-1 bg-brand-600 rounded-full mx-auto mt-5" />
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Target,
            title: 'Our Mission',
            desc:  'To deliver unbiased, fact-checked journalism that empowers citizens to make informed decisions about their communities and country.',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            icon: Eye,
            title: 'Our Vision',
            desc:  'A fully informed, engaged citizenry — where every person has access to reliable news regardless of their location or background.',
            color: 'bg-green-50 text-green-600',
          },
          {
            icon: Heart,
            title: 'Our Values',
            desc:  'Integrity, accuracy, transparency, and community. We hold ourselves accountable to the highest standards of ethical journalism.',
            color: 'bg-brand-50 text-brand-600',
          },
        ].map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
              <Icon size={22} />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-brand-100 p-2.5 rounded-xl">
            <Newspaper size={20} className="text-brand-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Our Story</h2>
        </div>
        <div className="prose prose-gray max-w-none text-sm leading-loose text-gray-600 space-y-4">
          <p>
            Prajatantr Ki Gunj was founded with a simple but powerful belief — that quality journalism
            should be accessible to everyone. Starting as a small digital newsroom, we have grown into
            a trusted source for readers across the region.
          </p>
          <p>
            Our team of dedicated journalists, reporters, and editors work tirelessly to bring you
            stories that matter — from grassroots community issues to national policy decisions.
            Every article published on our platform goes through a rigorous fact-checking process.
          </p>
          <p>
            We believe in the power of the press to hold power accountable and to amplify the voices
            that often go unheard. Prajatantr Ki Gunj is more than a news portal — it is a platform
            for the people, by the people.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-brand-600 rounded-2xl p-8 text-white">
        <h3 className="font-serif text-2xl font-bold mb-2">Want to know our team?</h3>
        <p className="text-brand-200 text-sm mb-5">
          Meet the journalists and staff who make Prajatantr Ki Gunj possible every day.
        </p>
        <Link to="/team"
          className="inline-block bg-white text-brand-600 font-semibold px-6 py-2.5
            rounded-xl hover:bg-brand-50 transition text-sm">
          Meet Our Team →
        </Link>
      </div>
    </div>
  );
}
