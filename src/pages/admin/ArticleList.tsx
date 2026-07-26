import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articlesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Pencil, Trash2, Eye, Plus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function ArticleList() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [hasMore,  setHasMore]  = useState(true);
  const [error,    setError]    = useState('');
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const PAGE_SIZE  = 20;

  const load = async (pageNum: number, reset: boolean) => {
    setLoading(true); setError('');
    try {
      // FIX: use adminList() which correctly passes all=true
      const r = await articlesApi.adminList({ page: pageNum, size: PAGE_SIZE });
      const items = r.data.data?.items ?? [];
      setArticles(prev => reset ? items : [...prev, ...items]);
      setHasMore(items.length === PAGE_SIZE);
    } catch {
      setError('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, true); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await articlesApi.delete(id);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Delete failed. Please try again.');
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next, false);
  };

  const statusBadge = (article: any) => {
    if (article.approvalStatus === 'Pending')
      return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs
        font-medium rounded-full border border-amber-200">Pending</span>;
    if (article.approvalStatus === 'Rejected')
      return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs
        font-medium rounded-full border border-red-200">Rejected</span>;
    if (article.isPublished)
      return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs
        font-medium rounded-full border border-green-200">Published</span>;
    return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs
      font-medium rounded-full border border-gray-200">Draft</span>;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Articles</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => load(1, true)}
            className="flex items-center gap-2 text-sm border border-gray-200
              text-gray-600 hover:border-brand-400 hover:text-brand-600
              px-3 py-2 rounded-xl transition">
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/admin/editor"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700
              text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            <Plus size={16} /> New Article
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl
          text-red-700 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading && articles.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            Loading articles…
          </div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            No articles yet.{' '}
            <Link to="/admin/editor"
              className="text-brand-600 hover:underline">
              Write the first one.
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    {['Title', 'Category', 'Author', 'Status', 'Views', 'Date', 'Actions']
                      .map(h => (
                        <th key={h} className="px-4 py-3 text-left whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => (
                    <tr key={a.id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-gray-800 truncate">{a.title}</p>
                        <p className="text-xs text-gray-400 font-mono truncate">
                          {a.slug}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {a.categoryName}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {a.authorName}
                      </td>
                      <td className="px-4 py-3">{statusBadge(a)}</td>
                      <td className="px-4 py-3 text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {a.views}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {format(new Date(a.createdAt), 'dd MMM yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/editor/${a.id}`)}
                            className="text-blue-500 hover:text-blue-700 transition"
                            title="Edit">
                            <Pencil size={15} />
                          </button>
                          {user?.role === 'SuperAdmin' && (
                            <button
                              onClick={() => handleDelete(a.id, a.title)}
                              className="text-red-400 hover:text-red-600 transition"
                              title="Delete">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMore && !loading && (
              <div className="p-4 border-t border-gray-100 text-center">
                <button onClick={loadMore}
                  className="text-sm text-brand-600 hover:underline font-medium">
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}