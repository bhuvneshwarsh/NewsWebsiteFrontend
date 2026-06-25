import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import type { EmployeeCard } from '../../types/employee';
import api from '../../services/api';

// ── Employee Card ─────────────────────────────────────────────────────────────
function EmployeeCardItem({ emp }: { emp: EmployeeCard }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    // Each card is now a Link to the unique profile page
    <Link
      to={`/team/${emp.employeeId}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all
        duration-300 overflow-hidden border border-gray-100 hover:border-brand-200
        hover:-translate-y-1 block">

      {/* Square photo */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100"
        style={{ paddingTop: '100%' }}>
        {emp.imageUrl && !imgErr ? (
          <img src={emp.imageUrl} alt={emp.fullName}
            onError={() => setImgErr(true)}
            className="absolute inset-0 w-full h-full object-cover object-top
              group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User size={48} className="text-brand-300" />
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/15
          transition-colors duration-300 flex items-end justify-center pb-3">
          <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100
            transition-opacity bg-brand-700/80 px-3 py-1 rounded-full backdrop-blur-sm">
            View ID Card →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight
          group-hover:text-brand-600 transition line-clamp-1">
          {emp.fullName}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{emp.designation}</p>
        <p className="text-xs font-mono text-brand-500 mt-1.5 bg-brand-50
          px-2 py-0.5 rounded inline-block">
          {emp.employeeId}
        </p>
      </div>
    </Link>
  );
}

// ── Team Page ─────────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [employees, setEmployees] = useState<EmployeeCard[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    api.get<{ success: boolean; data: EmployeeCard[] }>('/employees')
      .then(r => setEmployees(r.data.data))
      .catch(() => setError('Failed to load team members.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Our Team
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          Meet the dedicated journalists, editors, and staff behind Prajatantr Ki Gunj.
          Click any card to view their verified ID profile.
        </p>
        <div className="w-16 h-1 bg-brand-600 rounded-full mx-auto mt-4" />
      </div>

      {error && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="bg-gray-200" style={{ paddingTop: '100%' }} />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <User size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No team members added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {employees.map(emp => (
            <EmployeeCardItem key={emp.id} emp={emp} />
          ))}
        </div>
      )}
    </div>
  );
}
