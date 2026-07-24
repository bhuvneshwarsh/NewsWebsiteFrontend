import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, Eye, Heart, Newspaper,
  Twitter, Facebook, Linkedin,
  Mail, Phone, Award, BookOpen,
  ChevronDown, ChevronUp, User, Star
} from 'lucide-react';
import type { EditorProfile } from '../../types/editor';
import api from '../../services/api';

// ── Editor Profile Card ───────────────────────────────────────────────────────
function EditorCard({ editor }: { editor: EditorProfile }) {
  const [expanded, setExpanded] = useState(false);
  const [imgErr,   setImgErr]   = useState(false);

  const awards = editor.awards
    ? editor.awards.split('\n').map(a => a.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

      {/* Top gradient banner */}
      <div className="h-28 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800
        relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      {/* Photo — overlaps banner */}
      <div className="flex justify-center -mt-14 mb-4 relative z-10">
        <div className="relative">
          {editor.imageUrl && !imgErr ? (
            <img src={editor.imageUrl} alt={editor.fullName}
              onError={() => setImgErr(true)}
              className="w-28 h-28 rounded-full object-cover object-top
                border-4 border-white shadow-xl" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-brand-100 border-4
              border-white shadow-xl flex items-center justify-center">
              <User size={44} className="text-brand-400" />
            </div>
          )}
          {/* Verified badge */}
          <div className="absolute bottom-1 right-1 bg-brand-600 rounded-full
            p-1.5 border-2 border-white shadow">
            <Star size={12} className="text-white fill-white" />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Name + title */}
        <div className="text-center mb-5">
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            {editor.fullName}
          </h2>
          <p className="text-brand-600 font-semibold text-sm mt-1">
            {editor.title}
          </p>
          {editor.experience && (
            <span className="inline-block mt-2 bg-brand-50 text-brand-700
              text-xs font-semibold px-3 py-1 rounded-full border border-brand-100">
              {editor.experience}
            </span>
          )}
        </div>

        {/* Short bio */}
        <p className="text-gray-600 text-sm leading-relaxed text-center mb-5
          italic border-l-4 border-brand-400 pl-4 bg-brand-50/50 py-3 rounded-r-xl">
          "{editor.shortBio}"
        </p>

        {/* Quick info chips */}
        <div className="flex flex-wrap gap-2 mb-5 justify-center">
          {editor.education && (
            <div className="flex items-center gap-1.5 text-xs bg-gray-50
              border border-gray-200 px-3 py-1.5 rounded-full text-gray-600">
              <BookOpen size={11} className="text-brand-500" />
              {editor.education}
            </div>
          )}
        </div>

        {/* Awards */}
        {awards.length > 0 && (
          <div className="mb-5 bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3
              flex items-center gap-1.5">
              <Award size={13} /> पुरस्कार एवं उपलब्धियां
            </p>
            <ul className="space-y-1.5">
              {awards.map((award, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
                  <span className="text-amber-500 mt-0.5 shrink-0">🏆</span>
                  {award}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Full bio — expandable */}
        <div>
          <div className={`text-gray-700 text-sm leading-relaxed
            ${expanded ? '' : 'line-clamp-4'}`}>
            {editor.fullBio.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="mb-3">{para}</p>
            ))}
          </div>

          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-3 flex items-center gap-1.5 text-brand-600
              hover:text-brand-800 text-sm font-semibold transition">
            {expanded
              ? <><ChevronUp size={16} /> कम पढ़ें</>
              : <><ChevronDown size={16} /> पूरा जीवन परिचय पढ़ें</>}
          </button>
        </div>

        {/* Contact + social */}
        {(editor.email || editor.phone || editor.twitterUrl
          || editor.facebookUrl || editor.linkedInUrl) && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              {editor.email && (
                <a href={`mailto:${editor.email}`}
                  className="flex items-center gap-1.5 text-xs text-gray-500
                    hover:text-brand-600 transition bg-gray-50 px-3 py-1.5
                    rounded-full border border-gray-200">
                  <Mail size={12} /> {editor.email}
                </a>
              )}
              {editor.phone && (
                <a href={`tel:${editor.phone}`}
                  className="flex items-center gap-1.5 text-xs text-gray-500
                    hover:text-brand-600 transition bg-gray-50 px-3 py-1.5
                    rounded-full border border-gray-200">
                  <Phone size={12} /> {editor.phone}
                </a>
              )}
              <div className="flex items-center gap-2 ml-auto">
                {editor.twitterUrl && (
                  <a href={editor.twitterUrl} target="_blank" rel="noreferrer"
                    className="w-8 h-8 bg-sky-50 hover:bg-sky-100 border
                      border-sky-200 rounded-full flex items-center
                      justify-center text-sky-500 transition">
                    <Twitter size={14} />
                  </a>
                )}
                {editor.facebookUrl && (
                  <a href={editor.facebookUrl} target="_blank" rel="noreferrer"
                    className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border
                      border-blue-200 rounded-full flex items-center
                      justify-center text-blue-600 transition">
                    <Facebook size={14} />
                  </a>
                )}
                {editor.linkedInUrl && (
                  <a href={editor.linkedInUrl} target="_blank" rel="noreferrer"
                    className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border
                      border-blue-200 rounded-full flex items-center
                      justify-center text-blue-700 transition">
                    <Linkedin size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main About Us Page ────────────────────────────────────────────────────────
export default function AboutUs() {
  const [editors,        setEditors]        = useState<EditorProfile[]>([]);
  const [loadingEditors, setLoadingEditors] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: EditorProfile[] }>('/editors')
      .then(r => setEditors(r.data.data))
      .catch(() => setEditors([]))
      .finally(() => setLoadingEditors(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          About <span className="text-brand-600">Prajatantr Ki Gunj</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          A trusted voice for the people — delivering honest, accurate, and timely
          news across politics, culture, sports, and beyond.
        </p>
        <div className="w-16 h-1 bg-brand-600 rounded-full mx-auto mt-5" />
      </div>

      {/* Mission / Vision / Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {[
          {
            icon:  Target,
            title: 'Our Mission',
            desc:  'To deliver unbiased, fact-checked journalism that empowers citizens to make informed decisions about their communities and country.',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            icon:  Eye,
            title: 'Our Vision',
            desc:  'A fully informed, engaged citizenry — where every person has access to reliable news regardless of their location or background.',
            color: 'bg-green-50 text-green-600',
          },
          {
            icon:  Heart,
            title: 'Our Values',
            desc:  'Integrity, accuracy, transparency, and community. We hold ourselves accountable to the highest standards of ethical journalism.',
            color: 'bg-brand-50 text-brand-600',
          },
        ].map(({ icon: Icon, title, desc, color }) => (
          <div key={title}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
              <Icon size={22} />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── EDITOR / SAMPADAK SECTION ─────────────────────────────────────── */}
      {(loadingEditors || editors.length > 0) && (
        <div className="mb-14">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-center shrink-0">
              <span className="inline-block bg-brand-600 text-white text-xs
                font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-2">
                संपादक परिचय
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
                हमारे संपादक / Our Editor
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                The journalist behind Prajatantr Ki Gunj
              </p>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Loading skeleton */}
          {loadingEditors ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg
              border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-28 bg-gray-200" />
              <div className="flex justify-center -mt-14 mb-4">
                <div className="w-28 h-28 rounded-full bg-gray-300 border-4 border-white" />
              </div>
              <div className="px-6 pb-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-full mt-4" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          ) : (
            <div className={`
              ${editors.length === 1
                ? 'max-w-2xl mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8'}
            `}>
              {editors.map(editor => (
                <EditorCard key={editor.id} editor={editor} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Our Story */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-brand-100 p-2.5 rounded-xl">
            <Newspaper size={20} className="text-brand-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Our Story</h2>
        </div>
        <div className="text-sm leading-loose text-gray-600 space-y-4">
          <p>
            Prajatantr Ki Gunj was founded with a simple but powerful belief —
            that quality journalism should be accessible to everyone. Starting as a
            small digital newsroom, we have grown into a trusted source for readers
            across the region.
          </p>
          <p>
            Our team of dedicated journalists, reporters, and editors work tirelessly
            to bring you stories that matter — from grassroots community issues to
            national policy decisions. Every article published on our platform goes
            through a rigorous fact-checking process.
          </p>
          <p>
            We believe in the power of the press to hold power accountable and to
            amplify the voices that often go unheard. Prajatantr Ki Gunj is more
            than a news portal — it is a platform for the people, by the people.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-brand-600 rounded-2xl p-8 text-white">
        <h3 className="font-serif text-2xl font-bold mb-2">Want to meet our team?</h3>
        <p className="text-brand-200 text-sm mb-5">
          Meet all the journalists and staff who make Prajatantr Ki Gunj possible.
        </p>
        <Link to="/team"
          className="inline-block bg-white text-brand-600 font-semibold
            px-6 py-2.5 rounded-xl hover:bg-brand-50 transition text-sm">
          Meet Our Team →
        </Link>
      </div>
    </div>
  );
}
