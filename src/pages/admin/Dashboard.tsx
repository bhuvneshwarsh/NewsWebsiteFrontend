import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesApi } from '../../services/api';
import {
  FileText, Eye, TrendingUp, ClipboardCheck,
  Users, Megaphone
} from 'lucide-react';

interface DashStats {
  totalArticles:    number;
  publishedArticles: number;
  totalViews:       number;
  pendingApprovals: number;
}

export default function Dashboard() {
  const [stats,   setStats]   = useState<DashStats>({
    totalArticles:     0,
    publishedArticles: 0,
    totalViews:        0,
    pendingApprovals:  0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // FIX: removed adminApi import — fetch data directly via articlesApi
        const [allRes, pendingRes] = await Promise.allSettled([
          articlesApi.adminList({ page: 1, size: 50 }),
          articlesApi.getPending(),
        ]);

        if (allRes.status === 'fulfilled') {
          const items: any[] = allRes.value.data.data?.items ?? [];
          const published    = items.filter((a: any) => a.isPublished);
          const totalViews   = items.reduce((s: number, a: any) => s + (a.views ?? 0), 0);

          setStats(prev => ({
            ...prev,
            totalArticles:     items.length,
            publishedArticles: published.length,
            totalViews,
          }));

          // Most recent 5 articles
          setRecentArticles(items.slice(0, 5));
        }

        if (pendingRes.status === 'fulfilled') {
          const pending: any[] = pendingRes.value.data.data ?? [];
          setStats(prev => ({ ...prev, pendingApprovals: pending.length }));
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Total Articles',
      value: stats.totalArticles,
      icon:  FileText,
      color: 'bg-blue-50 text-blue-600',
      link:  '/admin/articles',
    },
    {
      label: 'Published',
      value: stats.publishedArticles,
      icon:  TrendingUp,
      color: 'bg-green-50 text-green-600',
      link:  '/admin/articles',
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon:  Eye,
      color: 'bg-purple-50 text-purple-600',
      link:  '/admin/articles',
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon:  ClipboardCheck,
      color: 'bg-amber-50 text-amber-600',
      link:  '/admin/approvals',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Welcome to Prajatantr Ki Gunj Admin Panel
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link}
            className="bg-white rounded-2xl shadow-sm border border-gray-100
              p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Write New Article', icon: FileText,       to: '/admin/editor',    color: 'bg-brand-600 hover:bg-brand-700 text-white' },
          { label: 'Review Approvals',  icon: ClipboardCheck, to: '/admin/approvals', color: 'bg-amber-500 hover:bg-amber-600 text-white'  },
          { label: 'Manage Team',       icon: Users,          to: '/admin/team',      color: 'bg-gray-700 hover:bg-gray-800 text-white'    },
        ].map(({ label, icon: Icon, to, color }) => (
          <Link key={label} to={to}
            className={`${color} rounded-2xl p-4 flex items-center gap-3
              font-medium text-sm transition`}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>

      {/* Recent articles */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FileText size={16} className="text-brand-500" />
            Recent Articles
          </h3>
          <Link to="/admin/articles"
            className="text-xs text-brand-600 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
        ) : recentArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No articles yet.{' '}
            <Link to="/admin/editor" className="text-brand-600 hover:underline">
              Write the first one.
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Title', 'Author', 'Category', 'Views', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentArticles.map(a => (
                <tr key={a.id}
                  className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-5 py-3 max-w-xs">
                    <Link to={`/admin/editor/${a.id}`}
                      className="font-medium text-gray-800 hover:text-brand-600
                        truncate block transition">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{a.authorName}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{a.categoryName}</td>
                  <td className="px-5 py-3 text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {a.views}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {a.approvalStatus === 'Pending' ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700
                        text-xs font-medium rounded-full">Pending</span>
                    ) : a.isPublished ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700
                        text-xs font-medium rounded-full">Published</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600
                        text-xs font-medium rounded-full">Draft</span>
                    )}
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