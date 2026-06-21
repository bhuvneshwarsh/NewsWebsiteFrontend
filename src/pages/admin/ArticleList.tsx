import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articlesApi } from '../../services/api';
import type { ArticleListItem } from '../../types';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ArticleList() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const { user } = useAuth();
  const navigate  = useNavigate();
  const PAGE_SIZE = 15;

  const load = (p = 1) => {
    setLoading(true);
    articlesApi.list({ page: p, size: PAGE_SIZE, all: true })
      .then(r => {
        setArticles(r.data.data.items);
        setTotal(r.data.data.totalCount);
        setPage(p);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await articlesApi.delete(id);
    load(page);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Articles</h2>
        <Link to="/admin/editor"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No articles yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Title', 'Category', 'Author', 'Views', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium text-gray-800 truncate">{a.title}</p>
                    <p className="text-xs text-gray-400 font-mono truncate">{a.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{a.categoryName}</td>
                  <td className="px-4 py-3 text-gray-500">{a.authorName}</td>
                  <td className="px-4 py-3 text-gray-500 flex items-center gap-1">
                    <Eye size={13} className="text-gray-300" /> {a.views}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${a.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                      {a.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/admin/editor/${a.id}`)}
                        className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                        <Pencil size={15} />
                      </button>
                      {user?.role === 'SuperAdmin' && (
                        <button onClick={() => handleDelete(a.id, a.title)}
                          className="text-red-400 hover:text-red-600 transition" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-400">{total} articles total</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => load(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition
                    ${p === page
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
