import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { articlesApi } from '../../services/api';
import type { ArticleListItem } from '../../types';
import { Plus, Eye, Pencil, FileText } from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // Fetch all articles (including drafts) — backend already filters by authorId via JWT
    articlesApi.list({ all: true, size: 50 })
      .then(r => setArticles(r.data.data.items))
      .finally(() => setLoading(false));
  }, []);

  const published = articles.filter(a => a.isPublished).length;
  const drafts    = articles.filter(a => !a.isPublished).length;

  return (
    <div className="p-6 max-w-5xl">

      {/* Welcome header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.fullName?.split(' ')[0]}!
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {user?.designation} · {user?.employeeId}
          </p>
        </div>
        <Link to="/employee/editor"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700
            text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
          <Plus size={16} /> New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total Articles', value: articles.length, color: 'text-gray-800', bg: 'bg-gray-50' },
          { label: 'Published',      value: published,        color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Drafts',         value: drafts,           color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Articles table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FileText size={16} /> My Articles
          </h3>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No articles yet.</p>
            <p className="text-xs mt-1">Click "New Article" to write your first story.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Title', 'Category', 'Views', 'Status', 'Date', 'Edit'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-5 py-3 max-w-xs">
                    <p className="font-medium text-gray-800 truncate">{a.title}</p>
                    <p className="text-xs text-gray-400 font-mono truncate">{a.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{a.categoryName}</td>
                  <td className="px-5 py-3 text-gray-500">
                    <span className="flex items-center gap-1"><Eye size={12} /> {a.views}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${a.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'}`}>
                      {a.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3">
                    <Link to={`/employee/editor/${a.id}`}
                      className="text-blue-500 hover:text-blue-700 transition">
                      <Pencil size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
