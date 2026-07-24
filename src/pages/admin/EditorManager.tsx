import { useEffect, useRef, useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Upload, User,
  Twitter, Facebook, Linkedin, ChevronDown, ChevronUp
} from 'lucide-react';
import api, { mediaApi } from '../../services/api';
import type { EditorProfile, CreateEditorPayload } from '../../types/editor';

const EMPTY: CreateEditorPayload = {
  fullName: '', title: '', imageUrl: '', shortBio: '', fullBio: '',
  experience: '', education: '', awards: '', email: '', phone: '',
  twitterUrl: '', facebookUrl: '', linkedInUrl: '',
  isActive: true, displayOrder: 0,
};

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder = '', required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-brand-500" />
    </div>
  );
}

// ── Editor Form Modal ─────────────────────────────────────────────────────────
function EditorFormModal({ existing, onClose, onSaved }: {
  existing?: EditorProfile | null;
  onClose:  () => void;
  onSaved:  () => void;
}) {
  const [form,       setForm]       = useState<CreateEditorPayload>(
    existing ? {
      fullName:    existing.fullName,
      title:       existing.title,
      imageUrl:    existing.imageUrl ?? '',
      shortBio:    existing.shortBio,
      fullBio:     existing.fullBio,
      experience:  existing.experience ?? '',
      education:   existing.education ?? '',
      awards:      existing.awards ?? '',
      email:       existing.email ?? '',
      phone:       existing.phone ?? '',
      twitterUrl:  existing.twitterUrl ?? '',
      facebookUrl: existing.facebookUrl ?? '',
      linkedInUrl: existing.linkedInUrl ?? '',
      isActive:    true,
      displayOrder: existing.displayOrder,
    } : { ...EMPTY }
  );
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [error,     setError]     = useState('');
  const [imgErr,    setImgErr]    = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof CreateEditorPayload, v: any) =>
    setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadPct(0); setError('');
    try {
      const res = await mediaApi.upload(file, pct => setUploadPct(pct));
      set('imageUrl', res.data.url);
      setImgErr(false);
    } catch { setError('Photo upload failed.'); }
    finally   { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) { setError('Full name is required.'); return; }
    if (!form.title.trim())    { setError('Title/designation is required.'); return; }
    if (!form.shortBio.trim()) { setError('Short bio is required.'); return; }
    if (!form.fullBio.trim())  { setError('Full bio / life journey is required.'); return; }
    setError(''); setSaving(true);
    try {
      existing
        ? await api.put(`/editors/${existing.id}`, form)
        : await api.post('/editors', form);
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Save failed. Try again.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl
        max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-gray-800 text-lg">
            {existing ? `Edit — ${existing.fullName}` : 'Add Editor / Sampadak'}
          </h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl
              text-red-700 text-sm">{error}</div>
          )}

          {/* Photo upload */}
          <div className="flex items-start gap-5">
            <div className="shrink-0">
              {form.imageUrl && !imgErr ? (
                <img src={form.imageUrl} alt="Preview"
                  onError={() => setImgErr(true)}
                  className="w-24 h-24 rounded-full object-cover object-top
                    border-4 border-brand-100 shadow" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100
                  border-4 border-dashed border-gray-300
                  flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-gray-700">Editor Photo</p>
              <input ref={fileRef} type="file" accept="image/*"
                className="hidden" onChange={handlePhoto} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 text-sm border border-gray-300
                  px-4 py-2 rounded-xl text-gray-600
                  hover:border-brand-400 hover:text-brand-600 transition">
                <Upload size={15} />
                {uploading ? `Uploading ${uploadPct}%…` : 'Upload Photo'}
              </button>
              {form.imageUrl && (
                <button onClick={() => { set('imageUrl', ''); setImgErr(false); }}
                  className="text-xs text-red-400 hover:text-red-600">
                  Remove photo
                </button>
              )}
              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-brand-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${uploadPct}%` }} />
                </div>
              )}
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={form.fullName}
              onChange={v => set('fullName', v)}
              placeholder="e.g. Mahendra Kumar Sharma" required />
            <Field label="Title / Designation" value={form.title}
              onChange={v => set('title', v)}
              placeholder="e.g. मुख्य संपादक / Chief Editor" required />
          </div>

          {/* Short bio */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Short Bio <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-1">(shown on About page card — 1-2 lines)</span>
            </label>
            <textarea rows={2} value={form.shortBio}
              onChange={e => set('shortBio', e.target.value)}
              placeholder="e.g. 25 वर्षों से पत्रकारिता में सक्रिय, राज्य स्तरीय पत्रकार पुरस्कार विजेता..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>

          {/* Full bio */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full Bio / Life Journey <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-1">(detailed story shown on About page)</span>
            </label>
            <textarea rows={8} value={form.fullBio}
              onChange={e => set('fullBio', e.target.value)}
              placeholder={`संपादक का पूरा जीवन परिचय यहाँ लिखें...

उदाहरण:
महेंद्र कुमार शर्मा का जन्म 1970 में मध्यप्रदेश के ग्वालियर जिले में हुआ। उन्होंने अपनी प्रारंभिक शिक्षा...

पत्रकारिता में कदम रखते हुए उन्होंने 1995 में दैनिक जागरण से अपना करियर शुरू किया...`}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y min-h-[160px]" />
          </div>

          {/* Experience + Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Experience" value={form.experience ?? ''}
              onChange={v => set('experience', v)}
              placeholder="e.g. 25+ वर्षों का अनुभव" />
            <Field label="Education" value={form.education ?? ''}
              onChange={v => set('education', v)}
              placeholder="e.g. M.A. (Journalism), Delhi University" />
          </div>

          {/* Awards */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Awards & Achievements
              <span className="text-gray-400 ml-1">(one per line)</span>
            </label>
            <textarea rows={3} value={form.awards ?? ''}
              onChange={e => set('awards', e.target.value)}
              placeholder={`राज्य स्तरीय सर्वश्रेष्ठ पत्रकार पुरस्कार 2018
मध्यप्रदेश मीडिया अवार्ड 2020
Best Investigative Journalist Award 2022`}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>

          {/* Extra fields toggle */}
          <button
            onClick={() => setShowExtra(s => !s)}
            className="flex items-center gap-2 text-sm text-gray-500
              hover:text-brand-600 transition font-medium">
            {showExtra ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showExtra ? 'Hide' : 'Show'} contact & social links
          </button>

          {showExtra && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2
              border-t border-gray-100">
              <Field label="Email" value={form.email ?? ''}
                onChange={v => set('email', v)}
                placeholder="editor@newspaper.com" type="email" />
              <Field label="Phone" value={form.phone ?? ''}
                onChange={v => set('phone', v)}
                placeholder="+91 XXXXX XXXXX" />
              <Field label="Twitter URL" value={form.twitterUrl ?? ''}
                onChange={v => set('twitterUrl', v)}
                placeholder="https://twitter.com/username" />
              <Field label="Facebook URL" value={form.facebookUrl ?? ''}
                onChange={v => set('facebookUrl', v)}
                placeholder="https://facebook.com/username" />
              <Field label="LinkedIn URL" value={form.linkedInUrl ?? ''}
                onChange={v => set('linkedInUrl', v)}
                placeholder="https://linkedin.com/in/username" />
              <Field label="Display Order" value={String(form.displayOrder)}
                onChange={v => set('displayOrder', parseInt(v) || 0)}
                type="number" placeholder="0 = first" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100
          bg-gray-50 sticky bottom-0">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving || uploading}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white
              text-sm font-medium rounded-xl transition disabled:opacity-60">
            {saving ? 'Saving…' : existing ? 'Save Changes' : 'Add Editor'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Editor Manager Page ─────────────────────────────────────────────────
export default function EditorManager() {
  const [editors,  setEditors]  = useState<EditorProfile[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<EditorProfile | null>(null);
  const [imgErrs,  setImgErrs]  = useState<Set<number>>(new Set());

  const load = () => {
    setLoading(true);
    api.get<{ success: boolean; data: EditorProfile[] }>('/editors/all')
      .then(r => setEditors(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (editor: EditorProfile) => {
    if (!confirm(`Delete "${editor.fullName}"? This cannot be undone.`)) return;
    await api.delete(`/editors/${editor.id}`);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Editor / Sampadak Manager
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage editor profiles shown on the About Us page
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700
            text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
          <Plus size={16} /> Add Editor
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>How it works:</strong> Editor profiles you add here will appear
          on the <strong>About Us</strong> page in a dedicated
          "संपादक / Editor" section with photo, bio, life journey, and social links.
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm p-8 text-center">Loading…</div>
      ) : editors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
          p-12 text-center text-gray-400">
          <User size={48} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">No editor profiles yet.</p>
          <p className="text-xs mt-1">
            Click "Add Editor" to add the Sampadak profile.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {editors.map(editor => (
            <div key={editor.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5
                flex items-start gap-5">

              {/* Photo */}
              <div className="shrink-0">
                {editor.imageUrl && !imgErrs.has(editor.id) ? (
                  <img src={editor.imageUrl} alt={editor.fullName}
                    onError={() => setImgErrs(s => new Set([...s, editor.id]))}
                    className="w-20 h-20 rounded-full object-cover object-top
                      border-4 border-brand-100 shadow" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100
                    border-4 border-gray-200 flex items-center justify-center">
                    <User size={28} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {editor.fullName}
                    </h3>
                    <p className="text-brand-600 font-semibold text-sm mt-0.5">
                      {editor.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setEditing(editor); setShowForm(true); }}
                      className="flex items-center gap-1.5 text-xs bg-blue-50
                        hover:bg-blue-100 text-blue-600 border border-blue-200
                        px-3 py-1.5 rounded-lg transition font-medium">
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(editor)}
                      className="flex items-center gap-1.5 text-xs bg-red-50
                        hover:bg-red-100 text-red-600 border border-red-200
                        px-3 py-1.5 rounded-lg transition font-medium">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mt-2 leading-relaxed line-clamp-2">
                  {editor.shortBio}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {editor.experience && (
                    <span className="text-xs bg-gray-100 text-gray-600
                      px-2.5 py-1 rounded-full">
                      📅 {editor.experience}
                    </span>
                  )}
                  {editor.education && (
                    <span className="text-xs bg-gray-100 text-gray-600
                      px-2.5 py-1 rounded-full">
                      🎓 {editor.education}
                    </span>
                  )}
                  {editor.twitterUrl && (
                    <a href={editor.twitterUrl} target="_blank" rel="noreferrer"
                      className="text-sky-500 hover:text-sky-700">
                      <Twitter size={15} />
                    </a>
                  )}
                  {editor.facebookUrl && (
                    <a href={editor.facebookUrl} target="_blank" rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800">
                      <Facebook size={15} />
                    </a>
                  )}
                  {editor.linkedInUrl && (
                    <a href={editor.linkedInUrl} target="_blank" rel="noreferrer"
                      className="text-blue-700 hover:text-blue-900">
                      <Linkedin size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <EditorFormModal
          existing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}
