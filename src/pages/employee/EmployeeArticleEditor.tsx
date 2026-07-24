import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api, { categoriesApi, mediaApi } from '../../services/api';
import type { Category, ArticleDetail } from '../../types';
import {
  Image, Save, Send, ArrowLeft, CheckCircle,
  Clock, XCircle, AlertTriangle
} from 'lucide-react';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

export default function EmployeeArticleEditor() {
  const { id }   = useParams<{ id?: string }>();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [title,          setTitle]          = useState('');
  const [content,        setContent]        = useState('');
  const [categoryId,     setCategoryId]     = useState<number>(0);
  const [thumbnailUrl,   setThumbnailUrl]   = useState('');
  const [categories,     setCategories]     = useState<Category[]>([]);
  const [saving,         setSaving]         = useState(false);
  const [uploading,      setUploading]      = useState(false);
  const [uploadPct,      setUploadPct]      = useState(0);
  const [error,          setError]          = useState('');
  const [success,        setSuccess]        = useState('');
  const [imgErr,         setImgErr]         = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalNote,   setApprovalNote]   = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    categoriesApi.list().then(r => {
      const cats = r.data.data;
      setCategories(cats);
      if (cats.length && !categoryId) setCategoryId(cats[0].id);
    });

    if (isEdit && id) {
      api.get<{ success: boolean; data: ArticleDetail }>(`/articles/${id}/preview`)
        .then(r => {
          const a = r.data.data;
          setTitle(a.title);
          setThumbnailUrl(a.thumbnailUrl ?? '');
          setCategoryId(a.categoryId ?? 0);
          setContent(a.content);
          setApprovalStatus(a.approvalStatus ?? '');
          setApprovalNote(a.approvalNote ?? '');
        })
        .catch(() => {
          // preview endpoint requires admin — fallback to public list
          api.get<{ success: boolean; data: { items: ArticleDetail[] } }>(
            '/articles?all=true&size=100'
          ).then(r => {
            const found = r.data.data.items.find((a: any) => a.id === parseInt(id));
            if (found) {
              setTitle(found.title);
              setThumbnailUrl(found.thumbnailUrl ?? '');
              setCategoryId(found.categoryId ?? 0);
              setApprovalStatus(found.approvalStatus ?? '');
              setApprovalNote(found.approvalNote ?? '');
              api.get<{ success: boolean; data: ArticleDetail }>(
                `/articles/${found.slug}`
              ).then(d => setContent(d.data.data.content)).catch(() => {});
            }
          });
        });
    }
  }, [id]);

  // Is this article locked (approved and live)?
  const isApproved = approvalStatus === 'Approved' || approvalStatus === 'NotRequired';
  const isPending  = approvalStatus === 'Pending';
  const isRejected = approvalStatus === 'Rejected';

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadPct(0);
    try {
      const res = await mediaApi.upload(file, pct => setUploadPct(pct));
      setThumbnailUrl(res.data.url);
      setImgErr(false);
    } catch { setError('Image upload failed.'); }
    finally   { setUploading(false); }
  };

  const save = async () => {
    if (!title.trim())   { setError('Headline is required.');    return; }
    if (!content.trim()) { setError('Content is required.');     return; }
    if (!categoryId)     { setError('Please select a category.'); return; }

    setError(''); setSaving(true);
    try {
      if (isEdit && id) {
        await api.put(`/articles/${id}`, {
          title, content, categoryId, thumbnailUrl,
        });
        setSuccess('Article updated and resubmitted for approval.');
        setApprovalStatus('Pending');
        setApprovalNote('');
      } else {
        await api.post('/articles', {
          title, content, categoryId, thumbnailUrl,
          publish: true,  // employee always "submits" — backend forces Pending
        });
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Save failed. Try again.');
    } finally { setSaving(false); }
  };

  // ── Submitted success screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center
            justify-center mx-auto mb-5">
            <Clock size={32} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            लेख सबमिट हो गया!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            आपका लेख Super Admin की समीक्षा के लिए भेज दिया गया है।
          </p>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            अनुमोदित होने के बाद यह वेबसाइट पर प्रकाशित हो जाएगा।
            आप अपने Dashboard पर स्थिति देख सकते हैं।
          </p>
          <button onClick={() => navigate('/employee/dashboard')}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white
              font-semibold py-3 rounded-xl transition text-sm">
            Dashboard पर जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/employee/dashboard')}
          className="text-gray-400 hover:text-gray-700 transition p-1.5
            rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Edit Article' : 'Write New Article'}
          </h2>
          {isEdit && approvalStatus && (
            <p className="text-xs text-gray-400 mt-0.5">
              Status: <strong>{approvalStatus}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Approval status banners */}
      {isPending && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl
          px-5 py-4 flex items-start gap-3">
          <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              अनुमोदन प्रतीक्षारत
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              यह लेख Super Admin की समीक्षा में है। अनुमोदित होने के बाद
              वेबसाइट पर दिखेगा।
            </p>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl
          px-5 py-4 flex items-start gap-3">
          <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">
              प्रकाशित — इस लेख को संपादित नहीं किया जा सकता
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              यह लेख अनुमोदित और प्रकाशित हो चुका है।
              बदलाव के लिए Super Admin से संपर्क करें।
            </p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl
          px-5 py-4 flex items-start gap-3">
          <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              लेख अस्वीकृत — सुधार करके पुनः सबमिट करें
            </p>
            {approvalNote && (
              <div className="mt-2 bg-red-100 rounded-xl px-3 py-2">
                <p className="text-xs text-red-700">
                  <strong>अस्वीकृति कारण:</strong> {approvalNote}
                </p>
              </div>
            )}
            <p className="text-xs text-red-600 mt-2">
              ऊपर बताए गए सुधार करें और दोबारा सबमिट करें।
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl
          text-red-700 text-sm flex items-center gap-2">
          <AlertTriangle size={15} /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl
          text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={15} /> {success}
        </div>
      )}

      {/* Form — disabled if approved */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-5
        ${isApproved ? 'opacity-60 pointer-events-none' : ''}`}>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Headline (शीर्षक) *
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="खबर का आकर्षक शीर्षक लिखें…"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Article Content *
            </label>
            <div className="rounded-xl border border-gray-300 overflow-hidden">
              <ReactQuill theme="snow" value={content} onChange={setContent}
                modules={QUILL_MODULES} style={{ minHeight: '380px' }} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select value={categoryId}
              onChange={e => setCategoryId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value={0} disabled>Select category…</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            {thumbnailUrl && !imgErr && (
              <img src={thumbnailUrl} alt="cover"
                onError={() => setImgErr(true)}
                className="w-full h-32 object-cover rounded-xl mb-3
                  border border-gray-100" />
            )}
            <input ref={fileRef} type="file" accept="image/*"
              className="hidden" onChange={handleThumbnailUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="w-full flex items-center justify-center gap-2
                border border-dashed border-gray-300 rounded-xl py-3 text-sm
                text-gray-500 hover:border-brand-400 hover:text-brand-600 transition">
              <Image size={15} />
              {uploading ? `Uploading ${uploadPct}%…` : 'Upload Cover Image'}
            </button>
          </div>

          {/* Submit */}
          {!isApproved && (
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              <button onClick={save} disabled={saving}
                className="w-full flex items-center justify-center gap-2
                  bg-brand-600 hover:bg-brand-700 text-white font-medium
                  py-3 rounded-xl text-sm transition disabled:opacity-60">
                <Send size={14} />
                {saving
                  ? 'Submitting…'
                  : isEdit && isRejected
                    ? 'Fix & Resubmit for Approval'
                    : 'Submit for Approval'}
              </button>
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                लेख सबमिट करने के बाद Super Admin की समीक्षा के बाद प्रकाशित होगा।
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>प्रकाशन प्रक्रिया:</strong> आपका लेख सबमिट होने के बाद
              Super Admin समीक्षा करेंगे। अनुमोदित होने पर यह वेबसाइट पर
              तुरंत प्रकाशित हो जाएगा।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
