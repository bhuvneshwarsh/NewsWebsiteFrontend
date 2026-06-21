import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import type { AdminStats } from '../../types';
import { Users, FileText, Eye, Newspaper } from 'lucide-react';

export default function Dashboard() {
  const [stats,   setStats]   = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats()
      .then(r => setStats(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Users',      value: stats.totalUsers,        icon: Users,     color: 'bg-blue-500' },
    { label: 'Total Articles',   value: stats.totalArticles,     icon: FileText,  color: 'bg-green-500' },
    { label: 'Total Views',      value: stats.totalViews,        icon: Eye,       color: 'bg-purple-500' },
    { label: 'E-Papers',         value: stats.totalEPapers,      icon: Newspaper, color: 'bg-orange-500' },
  ] : [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {loading ? (
        <div className="text-gray-400 text-sm">Loading stats…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
                <div className={`${color} text-white rounded-lg p-3`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Recent Articles</h3>
              <Link to="/admin/articles" className="text-xs text-brand-600 hover:underline">
                View all
              </Link>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Title','Category','Author','Views','Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recentArticles.map((a: any) => (
                  <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800 max-w-xs truncate">{a.title}</td>
                    <td className="px-5 py-3 text-gray-500">{a.category}</td>
                    <td className="px-5 py-3 text-gray-500">{a.author}</td>
                    <td className="px-5 py-3 text-gray-500">{a.views}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${a.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {a.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
