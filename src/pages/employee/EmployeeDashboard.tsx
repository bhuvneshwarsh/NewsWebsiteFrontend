import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { articlesApi } from '../../services/api';
import type { ArticleListItem } from '../../types';
import {
  Plus, Eye, Pencil, FileText,
  Clock, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    Pending:     { label: 'Pending Approval', cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock size={11} /> },
    Approved:    { label: 'Approved & Live',  cls: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={11} /> },
    Rejected:    { label: 'Rejected',          cls: 'bg-red-100 text-red-700 border-red-200',       icon: <XCircle size={11} /> },
    NotRequired: { label: 'Published',         cls: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={11} /> },
  };
  const s = map[status] ?? map.Pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
      text-xs font-medium border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
}

export default function EmployeeDashboard() {
  const { user }   = useAuth();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // FIX: Use myArticles() which passes ?mine=true
    // This ensures backend filters by authorId from JWT token
    // and does NOT accidentally show public articles
    articlesApi.myArticles()
      .then(r => setArticles(r.data.data?.items ?? r.data.data ?? []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const pending  = articles.filter(a => a.approvalStatus === 'Pending').length;
  const approved = articles.filter(a => a.approvalStatus === 'Approved').length;
  const rejected = articles.filter(a => a.approvalStatus === 'Rejected').length;

  return (
    <div className="p-5 max-w-5xl">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            नमस्ते, {user?.fullName?.split(' ')[0]}!
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

      {/* Approval info */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6
        flex items-start gap-3">
        <AlertTriangle size={17} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">लेख प्रकाशन प्रक्रिया</p>
          <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
            आपके द्वारा लिखा गया हर लेख पहले <strong>Super Admin के अनुमोदन</strong> के
            लिए जाएगा। अनुमोदित होने के बाद ही वेबसाइट पर प्रकाशित होगा।
            अस्वीकृत होने पर कारण आपको दिखाया जाएगा।
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'कुल लेख',           value: articles.length, color: 'text-gray-800',   bg: 'bg-gray-50'  },
          { label: 'अनुमोदन प्रतीक्षा', value: pending,         color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'प्रकाशित',          value: approved,        color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'अस्वीकृत',         value: rejected,        color: 'text-red-700',   bg: 'bg-red-50'   },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Articles table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <FileText size={16} className="text-brand-500" />
          <h3 className="font-semibold text-gray-700">मेरे लेख</h3>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">अभी तक कोई लेख नहीं।</p>
            <p className="text-xs mt-1">New Article पर क्लिक करके पहला लेख लिखें।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['शीर्षक', 'श्रेणी', 'स्थिति', 'दृश्य', 'दिनांक', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-gray-800 truncate">{a.title}</p>
                      {a.approvalStatus === 'Rejected' && a.approvalNote && (
                        <div className="mt-1 flex items-start gap-1.5 bg-red-50
                          border border-red-100 rounded-lg px-2 py-1.5">
                          <XCircle size={11} className="text-red-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-600 leading-snug">
                            <strong>कारण:</strong> {a.approvalNote}
                          </p>
                        </div>
                      )}
                      {a.approvalStatus === 'Pending' && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <Clock size={10} /> Super Admin की समीक्षा का इंतज़ार है…
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {a.categoryName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={a.approvalStatus ?? 'Pending'} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {a.views}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleDateString('hi-IN')}
                    </td>
                    <td className="px-4 py-3">
                      {(a.approvalStatus === 'Rejected' || a.approvalStatus === 'Pending') && (
                        <Link to={`/employee/editor/${a.id}`}
                          className="flex items-center gap-1 text-xs text-blue-500
                            hover:text-blue-700 transition bg-blue-50 border
                            border-blue-200 px-2.5 py-1 rounded-lg">
                          <Pencil size={11} />
                          {a.approvalStatus === 'Rejected' ? 'सुधारें' : 'Edit'}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}