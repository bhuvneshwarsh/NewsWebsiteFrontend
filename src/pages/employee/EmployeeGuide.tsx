import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LogIn, KeyRound, FileText, CheckCircle,
  ChevronDown, ChevronUp, ExternalLink,
  Shield, PenSquare, Image, Send, Eye
} from 'lucide-react';

// ── Step data in Hindi ────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id:    'login',
    icon:  LogIn,
    color: 'from-blue-600 to-blue-800',
    badge: 'bg-blue-100 text-blue-700',
    title: 'पहली बार लॉगिन कैसे करें',
    subtitle: 'First Time Login',
    steps: [
      {
        num:   1,
        title: 'वेबसाइट खोलें',
        desc:  'अपने मोबाइल या कंप्यूटर में ब्राउज़र खोलें और नीचे दिया गया लिंक टाइप करें।',
        tip:   'आप Chrome, Firefox या Safari किसी भी ब्राउज़र का उपयोग कर सकते हैं।',
        link:  { label: 'Employee Login पेज खोलें', to: '/employee-login' },
        highlight: null,
      },
      {
        num:   2,
        title: 'Employee ID दर्ज करें',
        desc:  'लॉगिन पेज पर "Employee ID" वाले बॉक्स में अपनी ID डालें। यह ID आपको एडमिन ने दी होगी।',
        tip:   'Employee ID हमेशा EMP से शुरू होती है। जैसे: EMP-2026-00001',
        link:  null,
        highlight: 'EMP-2026-00001 (यह एक उदाहरण है — अपनी असली ID डालें)',
      },
      {
        num:   3,
        title: 'अस्थायी पासवर्ड डालें',
        desc:  'पासवर्ड वाले बॉक्स में एडमिन द्वारा दिया गया अस्थायी पासवर्ड डालें।',
        tip:   'अस्थायी पासवर्ड का फॉर्मेट होता है: Pkg@YEAR#NNNNN — जैसे Pkg@2026#00001',
        link:  null,
        highlight: 'Pkg@2026#00001 (यह एक उदाहरण है — अपना असली पासवर्ड डालें)',
      },
      {
        num:   4,
        title: '"Sign In" बटन दबाएं',
        desc:  'Employee ID और पासवर्ड डालने के बाद "Sign In" बटन पर क्लिक करें।',
        tip:   'अगर गलत ID या पासवर्ड डाला तो error आएगा। ध्यान से दोबारा चेक करें।',
        link:  null,
        highlight: null,
      },
    ],
  },
  {
    id:    'password',
    icon:  KeyRound,
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-700',
    title: 'पासवर्ड कैसे बदलें',
    subtitle: 'Change Password (First Login)',
    steps: [
      {
        num:   1,
        title: 'पासवर्ड बदलने का पेज अपने आप खुलेगा',
        desc:  'पहली बार लॉगिन करने पर आप सीधे "पासवर्ड बदलें" पेज पर पहुंच जाएंगे। यह जरूरी है — बिना पासवर्ड बदले आगे नहीं जा सकते।',
        tip:   'यह सुरक्षा के लिए है ताकि सिर्फ आप ही अपना अकाउंट इस्तेमाल कर सकें।',
        link:  null,
        highlight: null,
      },
      {
        num:   2,
        title: 'अस्थायी पासवर्ड डालें',
        desc:  '"Temporary Password" वाले बॉक्स में वही पासवर्ड डालें जो एडमिन ने दिया था।',
        tip:   'उदाहरण: Pkg@2026#00001 — यह आपका पुराना (अस्थायी) पासवर्ड है।',
        link:  null,
        highlight: null,
      },
      {
        num:   3,
        title: 'नया पासवर्ड सोचें और डालें',
        desc:  '"New Password" बॉक्स में अपना नया पासवर्ड डालें। नया पासवर्ड मजबूत होना चाहिए।',
        tip:   null,
        link:  null,
        highlight: 'मजबूत पासवर्ड के नियम:\n• कम से कम 8 अक्षर हों\n• एक बड़ा अक्षर (A-Z) हो\n• एक नंबर (0-9) हो\n• एक विशेष चिह्न हो जैसे @, #, !, $',
      },
      {
        num:   4,
        title: 'नया पासवर्ड दोबारा डालें',
        desc:  '"Confirm New Password" बॉक्स में वही नया पासवर्ड दोबारा डालें। दोनों बॉक्स में पासवर्ड एक जैसा होना चाहिए।',
        tip:   'अगर दोनों पासवर्ड मैच होंगे तो हरे रंग का ✓ निशान दिखेगा।',
        link:  null,
        highlight: null,
      },
      {
        num:   5,
        title: '"Set Password & Continue" दबाएं',
        desc:  'बटन दबाने के बाद पासवर्ड बदल जाएगा और आप अपने Dashboard पर पहुंच जाएंगे।',
        tip:   'अपना नया पासवर्ड किसी सुरक्षित जगह लिख कर रखें। इसे किसी के साथ साझा न करें।',
        link:  null,
        highlight: null,
      },
    ],
  },
  {
    id:    'article',
    icon:  PenSquare,
    color: 'from-brand-600 to-brand-800',
    badge: 'bg-brand-100 text-brand-700',
    title: 'खबर (Article) कैसे लिखें और प्रकाशित करें',
    subtitle: 'Write & Publish Article',
    steps: [
      {
        num:   1,
        title: 'Dashboard खुलने के बाद "Write Article" पर क्लिक करें',
        desc:  'लॉगिन के बाद आपका Dashboard खुलेगा। बाईं तरफ मेनू में "Write Article" बटन पर क्लिक करें।',
        tip:   'आप ऊपर दाईं तरफ "+ New Article" बटन से भी नया लेख शुरू कर सकते हैं।',
        link:  null,
        highlight: null,
      },
      {
        num:   2,
        title: 'खबर की Headline (शीर्षक) लिखें',
        desc:  '"Headline" वाले बॉक्स में खबर का शीर्षक लिखें। शीर्षक स्पष्ट और आकर्षक होना चाहिए।',
        tip:   'अच्छा शीर्षक पाठक को खबर पढ़ने के लिए प्रेरित करता है।',
        link:  null,
        highlight: 'उदाहरण: "भोपाल में भारी बारिश, कई इलाकों में जलभराव"',
      },
      {
        num:   3,
        title: 'खबर की Category चुनें',
        desc:  'दाईं तरफ "Category" dropdown में से उचित श्रेणी चुनें जैसे Politics, Sports, Business आदि।',
        tip:   'सही Category चुनना जरूरी है ताकि पाठक सही सेक्शन में खबर ढूंढ सकें।',
        link:  null,
        highlight: null,
      },
      {
        num:   4,
        title: 'खबर का Content (विवरण) लिखें',
        desc:  '"Article Content" बॉक्स में खबर का पूरा विवरण लिखें। आप Text को Bold, Italic, Underline भी कर सकते हैं।',
        tip:   'खबर को पैराग्राफ में लिखें। पहले पैराग्राफ में सबसे जरूरी जानकारी दें।',
        link:  null,
        highlight: null,
      },
      {
        num:   5,
        title: 'Cover Image (फोटो) अपलोड करें',
        desc:  '"Upload Cover Image" बटन पर क्लिक करें और अपने मोबाइल या कंप्यूटर से खबर से संबंधित फोटो चुनें।',
        tip:   'फोटो JPEG या PNG फॉर्मेट में होनी चाहिए। साइज़ 5MB से कम रखें।',
        link:  null,
        highlight: null,
      },
      {
        num:   6,
        title: 'Draft सेव करें या सीधे Publish करें',
        desc:  'दो विकल्प हैं: (1) "Save as Draft" — खबर सेव होगी पर दिखेगी नहीं। (2) "Publish Article" — खबर तुरंत वेबसाइट पर दिख जाएगी।',
        tip:   'अगर खबर अभी पूरी नहीं हुई है तो Draft में सेव करें। बाद में Edit करके Publish कर सकते हैं।',
        link:  null,
        highlight: 'Publish करने के बाद खबर तुरंत वेबसाइट के Homepage पर दिखने लगती है।',
      },
    ],
  },
  {
    id:    'tips',
    icon:  Shield,
    color: 'from-green-600 to-emerald-700',
    badge: 'bg-green-100 text-green-700',
    title: 'जरूरी बातें और सावधानियां',
    subtitle: 'Important Tips',
    steps: [
      {
        num:   1,
        title: 'पासवर्ड किसी को न बताएं',
        desc:  'अपना पासवर्ड किसी भी व्यक्ति के साथ साझा न करें — चाहे वो एडमिन ही क्यों न हो। एडमिन को कभी आपके पासवर्ड की जरूरत नहीं पड़ती।',
        tip:   null,
        link:  null,
        highlight: null,
      },
      {
        num:   2,
        title: 'काम पूरा होने के बाद Logout करें',
        desc:  'हर बार काम खत्म करने के बाद बाईं तरफ नीचे "Sign out" पर क्लिक करके लॉगआउट जरूर करें।',
        tip:   'खासकर अगर कोई साझा कंप्यूटर उपयोग कर रहे हैं तो Logout करना बेहद जरूरी है।',
        link:  null,
        highlight: null,
      },
      {
        num:   3,
        title: 'Session 12 घंटे में खत्म हो जाता है',
        desc:  'लॉगिन के 12 घंटे बाद आपका Session अपने आप खत्म हो जाएगा। आपको दोबारा लॉगिन करना होगा।',
        tip:   'यह आपके अकाउंट की सुरक्षा के लिए है।',
        link:  null,
        highlight: null,
      },
      {
        num:   4,
        title: 'पासवर्ड भूल गए तो एडमिन से संपर्क करें',
        desc:  'अगर पासवर्ड भूल जाएं तो अपने SuperAdmin से संपर्क करें। वे आपका पासवर्ड Reset कर देंगे और नया अस्थायी पासवर्ड देंगे।',
        tip:   'पासवर्ड Reset होने के बाद आपको फिर से नया पासवर्ड सेट करना होगा।',
        link:  null,
        highlight: null,
      },
      {
        num:   5,
        title: 'सिर्फ अपनी खबरें देख और Edit कर सकते हैं',
        desc:  'आप केवल अपने द्वारा लिखी गई खबरें देख और संपादित कर सकते हैं। दूसरे कर्मचारियों की खबरें नहीं।',
        tip:   'Delete करने का अधिकार आपके पास नहीं है। इसके लिए SuperAdmin से संपर्क करें।',
        link:  null,
        highlight: null,
      },
    ],
  },
];

// ── Accordion section ─────────────────────────────────────────────────────────
function GuideSection({ section, defaultOpen = false }: {
  section: typeof SECTIONS[0];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = section.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition">
        <div className={`bg-gradient-to-br ${section.color} p-3 rounded-xl shrink-0`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 text-base leading-tight">{section.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{section.subtitle}</p>
        </div>
        <div className={`shrink-0 p-1.5 rounded-lg transition
          ${open ? 'bg-gray-100 text-gray-600' : 'text-gray-400'}`}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Steps */}
      {open && (
        <div className="px-5 pb-6 space-y-5 border-t border-gray-100 pt-5">
          {section.steps.map((step, idx) => (
            <div key={step.num} className="flex gap-4">
              {/* Step number + connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${section.color}
                  flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs font-bold">{step.num}</span>
                </div>
                {idx < section.steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 mt-2 min-h-[20px]" />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0 pb-2">
                <h3 className="font-semibold text-gray-800 text-sm mb-1 leading-snug">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>

                {/* Highlight box */}
                {step.highlight && (
                  <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl
                    px-3 py-2.5">
                    {step.highlight.split('\n').map((line, i) => (
                      <p key={i} className={`text-xs font-mono text-gray-700 leading-relaxed
                        ${i === 0 && step.highlight!.includes('\n') ? 'font-semibold mb-1' : ''}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                {/* Tip */}
                {step.tip && (
                  <div className="mt-2 flex items-start gap-2 bg-blue-50 border
                    border-blue-100 rounded-xl px-3 py-2">
                    <span className="text-blue-500 shrink-0 text-xs mt-0.5">💡</span>
                    <p className="text-xs text-blue-700 leading-relaxed">{step.tip}</p>
                  </div>
                )}

                {/* Link */}
                {step.link && (
                  <Link to={step.link.to}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium
                      text-brand-600 hover:text-brand-800 bg-brand-50 border border-brand-200
                      px-3 py-1.5 rounded-lg transition">
                    <ExternalLink size={12} />
                    {step.link.label}
                  </Link>
                )}
              </div>
            </div>
          ))}

          {/* Section done indicator */}
          <div className="flex items-center gap-2 pt-2">
            <CheckCircle size={15} className="text-green-500 shrink-0" />
            <p className="text-xs text-green-600 font-medium">
              {section.id === 'login' && 'लॉगिन हो जाने के बाद आप पासवर्ड बदलने के पेज पर जाएंगे।'}
              {section.id === 'password' && 'पासवर्ड बदलने के बाद आप Dashboard पर पहुंच जाएंगे।'}
              {section.id === 'article' && 'Publish होने के बाद खबर वेबसाइट पर दिखने लगेगी।'}
              {section.id === 'tips' && 'इन बातों का पालन करके आप अपना अकाउंट सुरक्षित रख सकते हैं।'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Quick reference card ──────────────────────────────────────────────────────
function QuickRef() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
        <Eye size={16} className="text-brand-400" />
        त्वरित संदर्भ (Quick Reference)
      </h3>
      <div className="space-y-3">
        {[
          { label: 'Employee Login पेज',    value: '/employee-login',      icon: LogIn    },
          { label: 'Employee ID फॉर्मेट',   value: 'EMP-YYYY-NNNNN',       icon: Shield   },
          { label: 'अस्थायी पासवर्ड फॉर्मेट', value: 'Pkg@YYYY#NNNNN',      icon: KeyRound },
          { label: 'नई खबर लिखें',          value: '/employee/editor',      icon: PenSquare},
          { label: 'Session अवधि',          value: '12 घंटे',              icon: CheckCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
            <Icon size={14} className="text-brand-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-xs font-mono font-semibold text-white truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Guide Page ───────────────────────────────────────────────────────────
export default function EmployeeGuide() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20
            px-3 py-1.5 rounded-full text-xs font-medium mb-4">
            <FileText size={13} />
            कर्मचारी सहायता गाइड
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">
            Prajatantr Ki Gunj
          </h1>
          <h2 className="text-lg font-semibold text-brand-200 mb-3">
            Employee Portal — उपयोग गाइड
          </h2>
          <p className="text-brand-200 text-sm leading-relaxed max-w-lg mx-auto">
            नीचे दिए गए चरणों का पालन करके आप पहली बार लॉगिन करना, पासवर्ड बदलना
            और खबर प्रकाशित करना आसानी से सीख सकते हैं।
          </p>

          {/* CTA */}
          <Link to="/employee-login"
            className="inline-flex items-center gap-2 mt-5 bg-white text-brand-700
              font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition text-sm">
            <LogIn size={15} />
            Employee Login पेज पर जाएं
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        {/* Progress indicator */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            पूरी प्रक्रिया — 3 आसान चरण
          </p>
          <div className="flex items-center gap-0">
            {[
              { num: 1, label: 'लॉगिन करें',       color: 'bg-blue-500'   },
              { num: 2, label: 'पासवर्ड बदलें',     color: 'bg-amber-500'  },
              { num: 3, label: 'खबर प्रकाशित करें', color: 'bg-brand-600'  },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 ${s.color} rounded-full flex items-center
                    justify-center text-white font-bold text-xs`}>
                    {s.num}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center leading-tight">
                    {s.label}
                  </p>
                </div>
                {i < 2 && (
                  <div className="w-8 h-0.5 bg-gray-200 -mt-4 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Guide sections — accordion */}
        {SECTIONS.map((section, i) => (
          <GuideSection key={section.id} section={section} defaultOpen={i === 0} />
        ))}

        {/* Quick reference */}
        <QuickRef />

        {/* Footer help */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            कोई समस्या आ रही है?
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            अगर लॉगिन में कोई परेशानी हो, पासवर्ड न चले, या खबर प्रकाशित न हो —
            तो तुरंत अपने <strong>SuperAdmin</strong> से संपर्क करें।
            वे आपकी मदद करेंगे।
          </p>
          <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
            <Link to="/employee-login"
              className="text-xs text-brand-600 hover:underline font-medium
                flex items-center gap-1">
              <LogIn size={12} /> Employee Login
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/"
              className="text-xs text-gray-500 hover:underline flex items-center gap-1">
              <ExternalLink size={12} /> मुख्य वेबसाइट
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
