import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  CheckCircle, XCircle, Eye, Clock,
  User, FileText, AlertTriangle, RefreshCw, X
} from 'lucide-react';
import api from '../../services/api';
import type { ArticleListItem, ArticleDetail } from '../../types';

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ article, onClose, onApprove, onReject }: {
  article:   ArticleListItem;
  onClose:   () => void;
  onApprove: (id: number) => void;
  onReject:  (id: number, note: string) => void;
}) {
  const [detail,     setDetail]     = useState<ArticleDetail | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [rejectMode, setRejectMode] = useState(false);
  const [note,       setNote]       = useState('');
  const [working,    setWorking]    = useState(false);

  useEffect(() => {
    api.get<{ success: boolean; data: ArticleDetail }>(`/articles/${article.id}/preview`)
      .then(r => setDetail(r.data.data))
      .finally(() => setLoading(false));
  }, [article.id]);

  const handleApprove = async () => {
    setWorking(true);
    await onApprove(article.id);
    setWorking(false);
    onClose();
  };

  const handleReject = async () => {
    if (!note.trim()) return;
    setWorking(true);
    await onReject(article.id, note.trim());
    setWorking(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl
        max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
          border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-brand-600" />
            <div>
              <h2 className="font-semibold text-gray-800 text-sm line-clamp-1">
                {article.title}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                By {article.authorName} · {format(new Date(article.createdAt), 'dd MMM yyyy, h:mm a')}
              </p>
            </div>
          </div>
          <button onClick={onClose}>
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded"
                  style={{ width: `${100 - i * 5}%` }} />
              ))}
            </div>
          ) : detail ? (
            <>
              {/* Thumbnail */}
              {detail.thumbnailUrl && (
                <img src={detail.thumbnailUrl} alt={detail.title}
                  className="w-full h-48 object-cover rounded-xl mb-5 border border-gray-100" />
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-3 mb-5">
                <span className="bg-brand-100 text-brand-700 text-xs font-semibold
                  px-2.5 py-1 rounded-full">
                  {detail.categoryName}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full
                  flex items-center gap-1">
                  <User size={10} /> {detail.authorName}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full
                  flex items-center gap-1">
                  <Clock size={10} />
                  {format(new Date(detail.createdAt), 'dd MMM yyyy')}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-xl font-bold text-gray-900 mb-4">
                {detail.title}
              </h1>

              {/* Article body */}
              <div className="prose prose-sm prose-gray max-w-none
                border-t border-gray-100 pt-4"
                dangerouslySetInnerHTML={{ __html: detail.content }} />
            </>
          ) : (
            <p className="text-gray-400 text-sm">Failed to load article preview.</p>
          )}
        </div>

        {/* Action footer */}
        <div className="shrink-0 border-t border-gray-100 p-5 bg-gray-50">
          {rejectMode ? (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Rejection Reason <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-400 ml-1">
                  (this will be shown to the employee)
                </span>
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. कृपया इस खबर में तथ्यों की जाँच करें और स्रोत का उल्लेख करें..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
              <div className="flex gap-3">
                <button onClick={() => setRejectMode(false)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm
                    py-2.5 rounded-xl hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!note.trim() || working}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm
                    font-semibold py-2.5 rounded-xl transition disabled:opacity-50
                    flex items-center justify-center gap-2">
                  <XCircle size={16} />
                  {working ? 'Rejecting…' : 'Reject Article'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setRejectMode(true)}
                className="flex-1 flex items-center justify-center gap-2
                  border-2 border-red-200 text-red-600 hover:bg-red-50
                  font-semibold text-sm py-2.5 rounded-xl transition">
                <XCircle size={16} /> Reject
              </button>
              <button onClick={handleApprove} disabled={working}
                className="flex-1 flex items-center justify-center gap-2
                  bg-green-600 hover:bg-green-700 text-white font-semibold
                  text-sm py-2.5 rounded-xl transition disabled:opacity-50">
                <CheckCircle size={16} />
                {working ? 'Approving…' : 'Approve & Publish'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Approvals Page ───────────────────────────────────────────────────────
export default function ArticleApprovals() {
  const [articles,  setArticles]  = useState<ArticleListItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [previewing,setPreviewing]= useState<ArticleListItem | null>(null);
  const [imgErrs,   setImgErrs]   = useState<Set<number>>(new Set());

  const load = () => {
    setLoading(true);
    api.get<{ success: boolean; data: ArticleListItem[] }>('/articles/pending')
      .then(r => setArticles(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    await api.post(`/articles/${id}/approve`);
    load();
  };

  const handleReject = async (id: number, note: string) => {
    await api.post(`/articles/${id}/reject`, { note });
    load();
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Article Approvals</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and approve articles submitted by employees before they go live
          </p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 text-sm border border-gray-200
            text-gray-600 hover:border-brand-400 hover:text-brand-600
            px-4 py-2 rounded-xl transition font-medium">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6
        flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Approval Queue</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Articles submitted by employees are held here for your review.
            Click <strong>Preview</strong> to read the full article before deciding.
            Approved articles are immediately published on the website.
            Rejected articles are returned to the employee with your reason.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending Review', value: articles.length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Approved Today', value: '—', color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
          { label: 'Rejected Today', value: '—', color: 'text-red-600',   bg: 'bg-red-50 border-red-100'   },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Articles list */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400 text-sm">
          Loading pending articles…
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
          p-14 text-center text-gray-400">
          <CheckCircle size={48} className="mx-auto mb-3 opacity-20 text-green-500" />
          <p className="font-semibold text-gray-600">All caught up!</p>
          <p className="text-xs mt-1">No articles pending approval right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map(article => (
            <div key={article.id}
              className="bg-white rounded-2xl shadow-sm border border-amber-100
                hover:border-amber-200 transition overflow-hidden">
              <div className="flex items-start gap-4 p-5">

                {/* Thumbnail */}
                <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {article.thumbnailUrl && !imgErrs.has(article.id) ? (
                    <img src={article.thumbnailUrl} alt={article.title}
                      onError={() => setImgErrs(s => new Set([...s, article.id]))}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText size={20} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug
                      line-clamp-2">
                      {article.title}
                    </h3>
                    <span className="shrink-0 px-2 py-1 bg-amber-100 text-amber-700
                      text-xs font-semibold rounded-full border border-amber-200">
                      Pending
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={11} /> {article.authorName}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {article.categoryName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {format(new Date(article.createdAt), 'dd MMM yyyy, h:mm a')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewing(article)}
                    className="flex items-center gap-1.5 text-xs bg-blue-50
                      hover:bg-blue-100 text-blue-600 border border-blue-200
                      px-3 py-2 rounded-xl transition font-medium">
                    <Eye size={13} /> Preview & Review
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (confirm(`Approve "${article.title}"?`)) {
                          await handleApprove(article.id);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1
                        text-xs bg-green-50 hover:bg-green-100 text-green-700
                        border border-green-200 px-2 py-1.5 rounded-lg transition">
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button
                      onClick={() => setPreviewing(article)}
                      className="flex-1 flex items-center justify-center gap-1
                        text-xs bg-red-50 hover:bg-red-100 text-red-600
                        border border-red-200 px-2 py-1.5 rounded-lg transition">
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {previewing && (
        <PreviewModal
          article={previewing}
          onClose={() => setPreviewing(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
