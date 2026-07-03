import { useEffect, useRef, useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Upload, Eye,
  MousePointerClick, ToggleLeft, ToggleRight,
  Image as ImageIcon, ExternalLink, BarChart2
} from 'lucide-react';
import { format } from 'date-fns';
import api, { mediaApi } from '../../services/api';
import type { AdAdmin, CreateAdPayload } from '../../types/ads';

const PLACEMENTS = [
  { value: 'banner_top',    label: 'Banner Top',    desc: 'Full-width banner at top of homepage' },
  { value: 'sidebar',       label: 'Sidebar',       desc: 'Right sidebar on homepage & articles' },
  { value: 'inline',        label: 'Inline Feed',   desc: 'Between articles in news feed' },
  { value: 'banner_bottom', label: 'Banner Bottom', desc: 'Full-width banner below all articles' },
];

const EMPTY: CreateAdPayload = {
  title: '', adImageUrl: '', clickUrl: '', advertiserName: '',
  placement: 'sidebar', width: undefined, height: undefined,
  startDate: '', endDate: '', isActive: true, displayOrder: 0, notes: '',
};

// ── Ad Form Modal ─────────────────────────────────────────────────────────────
function AdFormModal({ existing, onClose, onSaved }: {
  existing?: AdAdmin | null;
  onClose:  () => void;
  onSaved:  () => void;
}) {
  const [form,      setForm]      = useState<CreateAdPayload>(
    existing ? {
      title:          existing.title,
      adImageUrl:     existing.adImageUrl,
      clickUrl:       existing.clickUrl ?? '',
      advertiserName: existing.advertiserName ?? '',
      placement:      existing.placement,
      width:          existing.width ?? undefined,
      height:         existing.height ?? undefined,
      startDate:      existing.startDate ?? '',
      endDate:        existing.endDate ?? '',
      isActive:       existing.isActive,
      displayOrder:   existing.displayOrder,
      notes:          existing.notes ?? '',
    } : { ...EMPTY }
  );
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [error,     setError]     = useState('');
  const [imgErr,    setImgErr]    = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof CreateAdPayload, v: any) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadPct(0); setError('');
    try {
      const res = await mediaApi.upload(file, pct => setUploadPct(pct));
      set('adImageUrl', res.data.url);
      setImgErr(false);
    } catch { setError('Image upload failed.'); }
    finally   { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title.trim())      { setError('Title is required.'); return; }
    if (!form.adImageUrl.trim()) { setError('Ad image is required. Please upload an image.'); return; }
    setError(''); setSaving(true);
    try {
      existing
        ? await api.put(`/ads/${existing.id}`, form)
        : await api.post('/ads', form);
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Save failed.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl
        max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <ImageIcon size={18} className="text-brand-500" />
            {existing ? 'Edit Advertisement' : 'New Advertisement'}
          </h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl
              text-red-700 text-sm">{error}</div>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Ad Image * (विज्ञापन की फोटो)
            </label>
            {form.adImageUrl && !imgErr ? (
              <div className="relative mb-3">
                <img src={form.adImageUrl} alt="Ad preview"
                  onError={() => setImgErr(true)}
                  className="w-full max-h-48 object-contain rounded-xl border border-gray-200 bg-gray-50" />
                <button onClick={() => { set('adImageUrl', ''); setImgErr(false); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-lg p-1
                    hover:bg-red-600 transition">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center
                  cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition">
                <Upload size={28} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 font-medium">
                  {uploading ? `Uploading ${uploadPct}%…` : 'Click to upload ad image'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, WebP · Recommended: 728×90 (banner), 300×250 (sidebar)
                </p>
                {uploading && (
                  <div className="mt-3 w-full max-w-xs mx-auto bg-gray-200 rounded-full h-1.5">
                    <div className="bg-brand-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${uploadPct}%` }} />
                  </div>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={handleUpload} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Internal title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Internal Title * (सिर्फ एडमिन के लिए — वेबसाइट पर नहीं दिखेगा)
              </label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Sharma Jewellers - June 2026"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            {/* Advertiser */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Advertiser Name (विज्ञापनदाता)
              </label>
              <input value={form.advertiserName ?? ''} onChange={e => set('advertiserName', e.target.value)}
                placeholder="e.g. Sharma Jewellers"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            {/* Click URL */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Click URL (क्लिक करने पर कहाँ जाएं — optional)
              </label>
              <input value={form.clickUrl ?? ''} onChange={e => set('clickUrl', e.target.value)}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            {/* Placement */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Placement * (विज्ञापन कहाँ दिखाएं)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PLACEMENTS.map(p => (
                  <button key={p.value} type="button"
                    onClick={() => set('placement', p.value)}
                    className={`text-left p-3 rounded-xl border-2 transition
                      ${form.placement === p.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'}`}>
                    <p className={`text-sm font-semibold
                      ${form.placement === p.value ? 'text-brand-700' : 'text-gray-700'}`}>
                      {p.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Date (शुरू होने की तारीख — खाली छोड़ें = अभी से)
              </label>
              <input type="date" value={form.startDate ?? ''}
                onChange={e => set('startDate', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Date (खत्म होने की तारीख — खाली छोड़ें = हमेशा)
              </label>
              <input type="date" value={form.endDate ?? ''}
                onChange={e => set('endDate', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            {/* Display order */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Display Order (क्रम — 0 = पहले)
              </label>
              <input type="number" value={form.displayOrder}
                onChange={e => set('displayOrder', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3 pt-5">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer"
                  checked={form.isActive}
                  onChange={e => set('isActive', e.target.checked)} />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer
                  peer-checked:bg-brand-600 transition" />
                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full
                  transition peer-checked:translate-x-5" />
              </label>
              <span className="text-sm text-gray-700">
                {form.isActive ? 'Active (वेबसाइट पर दिख रहा है)' : 'Inactive (छुपा हुआ है)'}
              </span>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Internal Notes (आंतरिक नोट्स — optional)
              </label>
              <textarea rows={2} value={form.notes ?? ''}
                onChange={e => set('notes', e.target.value)}
                placeholder="e.g. Paid ₹5000 for 30 days. Contact: 9876543210"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || uploading}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm
              font-medium rounded-xl transition disabled:opacity-60">
            {saving ? 'Saving…' : existing ? 'Save Changes' : 'Add Advertisement'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Ad Manager Page ───────────────────────────────────────────────────────────
export default function AdManager() {
  const [ads,      setAds]      = useState<AdAdmin[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<AdAdmin | null>(null);
  const [imgErrs,  setImgErrs]  = useState<Set<number>>(new Set());

  const load = () => {
    setLoading(true);
    api.get<{ success: boolean; data: AdAdmin[] }>('/ads/admin')
      .then(r => setAds(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (ad: AdAdmin) => {
    await api.put(`/ads/${ad.id}`, { ...ad, isActive: !ad.isActive });
    load();
  };

  const handleDelete = async (ad: AdAdmin) => {
    if (!confirm(`Delete "${ad.title}"? This will also remove the image.`)) return;
    await api.delete(`/ads/${ad.id}`);
    load();
  };

  // Group ads by placement for display
  const grouped = PLACEMENTS.map(p => ({
    ...p,
    ads: ads.filter(a => a.placement === p.value),
  }));

  const totalImpressions = ads.reduce((s, a) => s + a.impressions, 0);
  const totalClicks      = ads.reduce((s, a) => s + a.clicks, 0);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Advertisement Manager</h2>
          <p className="text-sm text-gray-500 mt-0.5">विज्ञापन प्रबंधन</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700
            text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> New Ad
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Ads',    value: ads.length,             icon: ImageIcon,          color: 'bg-blue-50 text-blue-600' },
          { label: 'Impressions',  value: totalImpressions.toLocaleString(), icon: Eye,      color: 'bg-purple-50 text-purple-600' },
          { label: 'Clicks',       value: totalClicks.toLocaleString(),      icon: MousePointerClick, color: 'bg-green-50 text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border
            border-gray-100 p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placement tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
        <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
          <BarChart2 size={14} /> Recommended Image Sizes
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Banner Top/Bottom', size: '728×90 px (Leaderboard)' },
            { name: 'Sidebar',           size: '300×250 px (Rectangle)' },
            { name: 'Inline Feed',       size: '300×250 px or 468×60 px' },
            { name: 'Mobile',            size: '320×50 px (Mobile Banner)' },
          ].map(s => (
            <div key={s.name} className="bg-white rounded-xl px-3 py-2">
              <p className="text-xs font-semibold text-gray-700">{s.name}</p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{s.size}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ads grouped by placement */}
      {loading ? (
        <div className="text-gray-400 text-sm p-8 text-center">Loading ads…</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.value} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100
                flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm">{group.label}</h3>
                  <p className="text-xs text-gray-400">{group.desc}</p>
                </div>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
                  {group.ads.length} ad{group.ads.length !== 1 ? 's' : ''}
                </span>
              </div>

              {group.ads.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-400 text-xs">
                  No ads in this placement. Click "+ New Ad" to add one.
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {group.ads.map(ad => (
                    <div key={ad.id} className={`flex items-center gap-4 px-5 py-4
                      ${!ad.isActive ? 'opacity-50' : ''}`}>

                      {/* Ad image preview */}
                      <div className="w-20 h-14 rounded-lg overflow-hidden border
                        border-gray-200 bg-gray-100 shrink-0">
                        {ad.adImageUrl && !imgErrs.has(ad.id) ? (
                          <img src={ad.adImageUrl} alt={ad.title}
                            onError={() => setImgErrs(s => new Set([...s, ad.id]))}
                            className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={18} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{ad.title}</p>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          {ad.advertiserName && (
                            <span className="text-xs text-gray-500">{ad.advertiserName}</span>
                          )}
                          {ad.clickUrl && (
                            <a href={ad.clickUrl} target="_blank" rel="noreferrer"
                              className="text-xs text-brand-500 flex items-center gap-0.5 hover:underline">
                              <ExternalLink size={10} /> URL
                            </a>
                          )}
                          {(ad.startDate || ad.endDate) && (
                            <span className="text-xs text-gray-400">
                              {ad.startDate
                                ? format(new Date(ad.startDate + 'T00:00:00'), 'dd MMM')
                                : '∞'} →
                              {ad.endDate
                                ? format(new Date(ad.endDate + 'T00:00:00'), 'dd MMM yyyy')
                                : ' ∞'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center gap-4 shrink-0">
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-700">
                            {ad.impressions.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">views</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-700">
                            {ad.clicks.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">clicks</p>
                        </div>
                        {ad.impressions > 0 && (
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-600">
                              {((ad.clicks / ad.impressions) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-400">CTR</p>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0
                        ${ad.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'}`}>
                        {ad.isActive ? 'Live' : 'Off'}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => toggleActive(ad)}
                          className={`transition ${ad.isActive
                            ? 'text-green-500 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-600'}`}
                          title={ad.isActive ? 'Deactivate' : 'Activate'}>
                          {ad.isActive
                            ? <ToggleRight size={20} />
                            : <ToggleLeft size={20} />}
                        </button>
                        <button onClick={() => { setEditing(ad); setShowForm(true); }}
                          className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(ad)}
                          className="text-red-400 hover:text-red-600 transition" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <AdFormModal
          existing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}
