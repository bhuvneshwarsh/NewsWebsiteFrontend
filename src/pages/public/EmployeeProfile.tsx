import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Calendar, BadgeCheck,
  User, Shield, ArrowLeft, Loader
} from 'lucide-react';
import { format, isPast } from 'date-fns';
import api from '../../services/api';
import type { EmployeeAdmin } from '../../types/employee';

// ── Helpers ───────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, highlight = false }: {
  icon: React.ElementType; label: string; value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl
      ${highlight ? 'bg-brand-50 border border-brand-100' : 'bg-gray-50'}`}>
      <Icon size={15} className={`mt-0.5 shrink-0 ${highlight ? 'text-brand-600' : 'text-gray-400'}`} />
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className={`text-sm font-semibold break-all
          ${highlight ? 'text-brand-700' : 'text-gray-800'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EmployeeProfile() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [emp,     setEmp]     = useState<EmployeeAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [imgErr,  setImgErr]  = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    // Use the public detail endpoint
    api.get<{ success: boolean; data: EmployeeAdmin }>(`/employees/${employeeId}`)
      .then(r => setEmp(r.data.data))
      .catch(() => setError('Employee not found or this ID card is no longer valid.'))
      .finally(() => setLoading(false));
  }, [employeeId]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-900
      flex items-center justify-center">
      <div className="text-center text-white">
        <Loader size={36} className="animate-spin mx-auto mb-3 opacity-70" />
        <p className="text-sm opacity-60">Verifying ID…</p>
      </div>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !emp) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900
      flex items-center justify-center p-4">
      <div className="text-center text-white max-w-sm">
        <Shield size={56} className="mx-auto mb-4 opacity-30" />
        <h2 className="font-serif text-2xl font-bold mb-2">ID Not Found</h2>
        <p className="text-gray-300 text-sm mb-6">
          {error || 'This employee ID card does not exist or has been deactivated.'}
        </p>
        <Link to="/team"
          className="inline-flex items-center gap-2 bg-white text-gray-800
            px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition">
          <ArrowLeft size={14} /> View Team
        </Link>
      </div>
    </div>
  );

  // ── Validity check ────────────────────────────────────────────────────────────
  const isExpired  = emp.validUpto ? isPast(new Date(emp.validUpto + 'T23:59:59')) : false;
  const validLabel = emp.validUpto
    ? format(new Date(emp.validUpto + 'T00:00:00'), 'dd MMM yyyy')
    : 'Not specified';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 via-brand-800 to-gray-900
      flex flex-col items-center justify-start py-8 px-4">

      {/* Back to team link */}
      <Link to="/team"
        className="self-start mb-6 flex items-center gap-2 text-white/60
          hover:text-white transition text-sm ml-0 md:ml-8">
        <ArrowLeft size={15} /> Back to Team
      </Link>

      {/* ── ID Card ──────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Card header — branded strip */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-6 pt-6 pb-16 relative">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-6 w-36 h-36 rounded-full bg-white/5" />

          {/* Org name */}
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Prajatantr Ki Gunj</p>
              <p className="text-brand-200 text-xs">Official Press ID</p>
            </div>
          </div>

          {/* Validity badge */}
          <div className={`absolute top-5 right-5 z-10 px-2.5 py-1 rounded-full text-xs font-bold
            ${isExpired
              ? 'bg-red-500 text-white'
              : 'bg-green-400 text-green-900'}`}>
            {isExpired ? 'EXPIRED' : 'VALID'}
          </div>
        </div>

        {/* Avatar — overlapping header */}
        <div className="flex justify-center -mt-12 relative z-10 mb-4">
          <div className="relative">
            {emp.imageUrl && !imgErr ? (
              <img src={emp.imageUrl} alt={emp.fullName}
                onError={() => setImgErr(true)}
                className="w-24 h-24 rounded-full object-cover object-top
                  border-4 border-white shadow-xl" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-brand-100 border-4 border-white
                shadow-xl flex items-center justify-center">
                <User size={36} className="text-brand-400" />
              </div>
            )}
            {/* Verified tick */}
            <div className="absolute bottom-0 right-0 bg-brand-600 rounded-full p-1
              border-2 border-white">
              <BadgeCheck size={14} className="text-white" />
            </div>
          </div>
        </div>

        {/* Name and designation */}
        <div className="text-center px-6 mb-5">
          <h1 className="font-serif text-xl font-bold text-gray-900 leading-tight">
            {emp.fullName}
          </h1>
          <p className="text-brand-600 font-semibold text-sm mt-0.5">{emp.designation}</p>

          {/* Employee ID chip */}
          <div className="inline-flex items-center gap-1.5 mt-2 bg-gray-100 px-3 py-1
            rounded-full border border-gray-200">
            <span className="text-xs text-gray-500 font-medium">ID:</span>
            <span className="text-xs font-bold text-gray-800 font-mono tracking-wide">
              {emp.employeeId}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 pb-6 space-y-2.5">
          {emp.email && (
            <InfoRow icon={Mail} label="Email" value={emp.email} />
          )}
          {emp.mobile && (
            <InfoRow icon={Phone} label="Mobile" value={emp.mobile} />
          )}

          <InfoRow
            icon={Calendar}
            label="Valid Upto"
            value={validLabel}
            highlight={!isExpired}
          />

          {isExpired && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200
              rounded-xl px-4 py-3">
              <Shield size={15} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-700 font-medium">
                This ID card has expired. Contact the admin for renewal.
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200 my-3" />

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Verified by Prajatantr Ki Gunj</span>
            <Link to="/team" className="text-brand-500 hover:text-brand-700 font-medium transition">
              View All →
            </Link>
          </div>
        </div>
      </div>

      {/* Scan info */}
      <p className="text-white/40 text-xs mt-6 text-center max-w-xs">
        This page was accessed via QR scan. The information shown here is official
        and verified by Prajatantr Ki Gunj.
      </p>
    </div>
  );
}
