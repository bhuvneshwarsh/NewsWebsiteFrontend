import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { articlesApi, categoriesApi, mediaApi } from '../../services/api';
import type { Category } from '../../types';
import { Image, Save, Send, ArrowLeft, CheckCircle } from 'lucide-react';

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
  const { id }    = useParams<{ id?: string }>();
  const isEdit    = Boolean(id);
  const navigate  = useNavigate();

  const [title,        setTitle]        = useState('');
  const [content,      setContent]      = useState('');
  const [categoryId,   setCategoryId]   = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categories,   setCategories]   = useState<Category[]>([]);
  const [saving,       setSaving]       = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');
  const [imgErr,       setImgErr]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    categoriesApi.list().then(r => {
      const cats = r.data.data;
      setCategories(cats);
      if (cats.length && !categoryId) setCategoryId(cats[0].id);
    });

    if (isEdit && id) {
      articlesApi.list({ all: true, size: 100 }).then(r => {
        const found = r.data.data.items.find((a: any) => a.id === parseInt(id));
        if (found) {
          setTitle(found.title);   
          setThumbnailUrl(found.thumbnailUrl ?? '');
          setCategoryId(found.categoryId ?? 0);
          articlesApi.getBySlug(found.slug).then(d => setContent(d.data.data.content));
        }
      });
    }
  }, [id]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadPct(0);
    try {
      const res = await mediaApi.upload(file, pct => setUploadPct(pct));
      setThumbnailUrl(res.data.url);
      setImgErr(false);
      setSuccess('Thumbnail uploaded!');
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Thumbnail upload failed.');
    } finally { setUploading(false); }
  };

  const save = async (publish: boolean) => {
    if (!title.trim())   { setError('Title is required.');   return; }
    if (!content.trim()) { setError('Content is required.'); return; }
    if (!categoryId)     { setError('Pick a category.');     return; }

    setError(''); setSaving(true);
    try {
      if (isEdit && id) {
        await articlesApi.update(parseInt(id), { title, content, categoryId, thumbnailUrl, publish });
      } else {
        await articlesApi.create({ title, content, categoryId, thumbnailUrl, publish });
      }
      setSuccess(publish ? '✓ Article published successfully!' : '✓ Draft saved!');
      setTimeout(() => navigate('/employee/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Save failed. Try again.');
    } finally { setSaving(false); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/employee/dashboard')}
          className="text-gray-400 hover:text-gray-700 transition p-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit Article' : 'Write New Article'}
        </h2>
      </div>

      {error   && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={15} /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Headline *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Write a compelling headline…"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Article Content *</label>
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
            <label className="block text-xs font-medium text-gray-700 mb-2">Category *</label>
            <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value={0} disabled>Select category…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Cover Image</label>
            {thumbnailUrl && !imgErr && (
              <img src={thumbnailUrl} alt="cover" onError={() => setImgErr(true)}
                className="w-full h-32 object-cover rounded-xl mb-3 border border-gray-100" />
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={handleThumbnailUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="w-full flex items-center justify-center gap-2 border border-dashed
                border-gray-300 rounded-xl py-3 text-sm text-gray-500
                hover:border-brand-400 hover:text-brand-600 transition">
              <Image size={15} />
              {uploading ? `Uploading ${uploadPct}%…` : 'Upload Cover Image'}
            </button>
          </div>

          {/* Save/Publish */}
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
            <button onClick={() => save(false)} disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-gray-100
                hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm
                transition disabled:opacity-60">
              <Save size={14} /> Save as Draft
            </button>
            <button onClick={() => save(true)} disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-brand-600
                hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl text-sm
                transition disabled:opacity-60">
              <Send size={14} /> {saving ? 'Publishing…' : 'Publish Article'}
            </button>
          </div>

          {/* Tip */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Tip:</strong> Published articles are immediately visible on the website.
              Save as draft if you're not done yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
