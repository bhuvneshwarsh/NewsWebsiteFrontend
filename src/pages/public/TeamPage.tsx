import { useEffect, useState } from 'react';
import { X, Mail, Calendar, BadgeCheck, User } from 'lucide-react';
import { format } from 'date-fns';
import type { EmployeeCard, EmployeeDetail } from '../../types/employee';
import api from '../../services/api';

// ── Employee Detail Modal ─────────────────────────────────────────────────────
function EmployeeModal({ emp, onClose }: { emp: EmployeeDetail; onClose: () => void }) {
  const isExpired = emp.validUpto
    ? new Date(emp.validUpto) < new Date()
    : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header strip */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-5 pt-6 pb-14 relative">
          <button onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition">
            <X size={20} />
          </button>
          <p className="text-brand-200 text-xs font-semibold uppercase tracking-widest mb-1">
            Team Member
          </p>
          <h2 className="text-white font-serif text-xl font-bold">{emp.fullName}</h2>
          <p className="text-brand-200 text-sm mt-0.5">{emp.designation}</p>
        </div>

        {/* Avatar — overlaps header */}
        <div className="flex justify-center -mt-10 mb-3 relative z-10">
          {emp.imageUrl ? (
            <img src={emp.imageUrl} alt={emp.fullName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-brand-100 border-4 border-white shadow-lg
              flex items-center justify-center">
              <User size={32} className="text-brand-400" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="px-5 pb-6 space-y-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-500 font-medium">Employee ID</span>
            <span className="text-sm font-bold text-gray-800 font-mono">{emp.employeeId}</span>
          </div>

          {emp.email && (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <Mail size={15} className="text-brand-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-sm text-gray-800">{emp.email}</p>
              </div>
            </div>
          )}

          {emp.validUpto && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl
              ${isExpired ? 'bg-red-50' : 'bg-green-50'}`}>
              <Calendar size={15} className={isExpired ? 'text-red-500' : 'text-green-500'} />
              <div>
                <p className="text-xs text-gray-500 font-medium">Valid Upto</p>
                <p className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-green-700'}`}>
                  {format(new Date(emp.validUpto + 'T00:00:00'), 'dd MMM yyyy')}
                  {isExpired && <span className="ml-2 text-xs text-red-500">(Expired)</span>}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 px-4 py-3 bg-brand-50 rounded-xl">
            <BadgeCheck size={15} className="text-brand-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Designation</p>
              <p className="text-sm text-gray-800 font-medium">{emp.designation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Employee Card ─────────────────────────────────────────────────────────────
function EmployeeCard({ emp, onClick }: { emp: EmployeeCard; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
        overflow-hidden text-left border border-gray-100 hover:border-brand-200 hover:-translate-y-1">

      {/* Photo */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100"
        style={{ paddingTop: '100%' }}>
        {emp.imageUrl && !imgErr ? (
          <img
            src={emp.imageUrl} alt={emp.fullName}
            onError={() => setImgErr(true)}
            className="absolute inset-0 w-full h-full object-cover object-top
              group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User size={48} className="text-brand-300" />
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/10
          transition-colors duration-300 flex items-center justify-center">
          <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100
            transition-opacity bg-brand-600/80 px-3 py-1 rounded-full">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-brand-600
          transition line-clamp-1">
          {emp.fullName}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{emp.designation}</p>
        <p className="text-xs font-mono text-brand-500 mt-1.5 bg-brand-50 px-2 py-0.5 rounded
          inline-block">
          {emp.employeeId}
        </p>
      </div>
    </button>
  );
}

// ── Team Page ─────────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [employees, setEmployees] = useState<EmployeeCard[]>([]);
  const [selected,  setSelected]  = useState<EmployeeDetail | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    api.get<{ success: boolean; data: EmployeeCard[] }>('/employees')
      .then(r => setEmployees(r.data.data))
      .catch(() => setError('Failed to load team members.'))
      .finally(() => setLoading(false));
  }, []);

  const openEmployee = async (emp: EmployeeCard) => {
    try {
      const res = await api.get<{ success: boolean; data: EmployeeDetail }>(
        `/employees/${emp.employeeId}`
      );
      setSelected(res.data.data);
    } catch {
      setSelected({ ...emp, email: null, validUpto: null });
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Page header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Our Team
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          Meet the dedicated journalists, editors, and staff behind Prajatantr Ki Gunj —
          committed to bringing you accurate and timely news.
        </p>
        <div className="w-16 h-1 bg-brand-600 rounded-full mx-auto mt-4" />
      </div>

      {error && (
        <div className="text-center py-10 text-red-500 text-sm">{error}</div>
      )}

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
            <EmployeeCard key={emp.id} emp={emp} onClick={() => openEmployee(emp)} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <EmployeeModal emp={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
