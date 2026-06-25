import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactUs() {
  const [form,      setForm]      = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  // NOTE: Replace this with a real email API (e.g. EmailJS, Azure Communication Services)
  // For now it shows a success message after 1 second simulation
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate sending
    setSubmitted(true);
    setLoading(false);
  };

  const contactInfo = [
    { icon: Mail,    label: 'Email',    value: 'prajatantrakigunj@gmail.com',  href: 'mailto:prajatantrakigunj@gmail.com' },
    { icon: Phone,   label: 'Phone',   value: '+91 97544 22061 \n & 0751 - 4901010',                href: 'tel:+919754422061' },
    { icon: MapPin,  label: 'Address', value: '70, Balaji Puram, Aditya Puram Phase-2, Murar, Gwalior, India',        href: null },
    { icon: Clock,   label: 'Hours',   value: 'Mon–Sat, 9 AM – 6 PM IST',      href: null },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Contact <span className="text-brand-600">Us</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Have a news tip, feedback, or inquiry? We'd love to hear from you.
        </p>
        <div className="w-16 h-1 bg-brand-600 rounded-full mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contact details */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg mb-4">Get in Touch</h2>
          {contactInfo.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 bg-white rounded-xl p-4
              shadow-sm border border-gray-100">
              <div className="bg-brand-50 p-2.5 rounded-lg shrink-0">
                <Icon size={16} className="text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                {href ? (
                  <a href={href} className="text-sm text-gray-700 hover:text-brand-600 transition">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-700">{value}</p>
                )}
              </div>
            </div>
          ))}

          {/* News tip box */}
          <div className="bg-brand-600 rounded-xl p-4 text-white mt-6">
            <h3 className="font-semibold text-sm mb-1">Have a News Tip?</h3>
            <p className="text-brand-200 text-xs leading-relaxed">
              Send us your story tips, press releases, or breaking news leads.
              Your identity will be kept confidential if requested.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <CheckCircle size={48} className="text-green-500 mb-4" />
              <h3 className="font-semibold text-gray-800 text-lg mb-2">Message Sent!</h3>
              <p className="text-gray-500 text-sm">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-5 text-brand-600 hover:underline text-sm font-medium">
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-gray-800 text-lg mb-5">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Your Name *</label>
                    <input required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Full name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                    <input required type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
                  <input required value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="What is this regarding?"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Message *</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Write your message here…"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white
                    font-medium px-6 py-2.5 rounded-xl transition disabled:opacity-60 text-sm">
                  <Send size={15} />
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
