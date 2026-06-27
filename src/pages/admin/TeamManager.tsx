import { useEffect, useRef, useState } from 'react';
import {
  Plus, Pencil, UserX, UserCheck, Trash2,
  Upload, X, User, QrCode, KeyRound, ShieldCheck, ShieldOff
} from 'lucide-react';
import { format } from 'date-fns';
import api, { mediaApi } from '../../services/api';
import type { EmployeeAdmin, CreateEmployeePayload } from '../../types/employee';
import { useAuth } from '../../context/AuthContext';
import QRCodeModal from '../../components/ui/QRCodeModal';

const GOVT_ID_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Voter ID', 'Driving Licence', 'Other'];
const EMPTY_FORM: CreateEmployeePayload & { isActive: boolean } = {
  fullName: '', designation: '', email: '', mobile: '', address: '',
  dateOfBirth: '', validUpto: '', govtIdType: 'Aadhaar', govtIdNumber: '',
  imageUrl: '', displayOrder: 0, isActive: true,
};

// ── Credential display modal (shown once after granting login) ─────────────────
function CredentialsModal({ data, onClose }: {
  data: { employeeId: string; fullName: string; loginEmail: string; tempPassword: string; message: string };
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copyAll = () => {
    navigator.clipboard.writeText(
      `Employee Login Credentials\nEmployee ID: ${data.employeeId}\nEmail: ${data.loginEmail}\nPassword: ${data.tempPassword}\nLogin URL: ${window.location.origin}/employee-login`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className="text-white" />
            <div>
              <h2 className="text-white font-semibold">Login Access Granted</h2>
              <p className="text-green-200 text-xs">Share these credentials with {data.fullName}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-700 font-semibold">
              ⚠️ Save these credentials now — the password will not be shown again.
            </p>
          </div>

          {[
            { label: 'Login URL',    value: `${window.location.origin}/employee-login` },
            { label: 'Employee ID',  value: data.employeeId },
            { label: 'Email',        value: data.loginEmail },
            { label: 'Password',     value: data.tempPassword },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
              <p className="text-sm font-mono font-semibold text-gray-800 break-all">{value}</p>
            </div>
          ))}

          <p className="text-xs text-gray-500 leading-relaxed">{data.message}</p>

          <div className="flex gap-2 pt-1">
            <button onClick={copyAll}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium
                py-2.5 rounded-xl hover:bg-gray-50 transition">
              {copied ? '✓ Copied!' : 'Copy All'}
            </button>
            <button onClick={onClose}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium
                py-2.5 rounded-xl transition">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small reusable field ──────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-brand-500" />
    </div>
  );
}

// ── Employee Form Modal ───────────────────────────────────────────────────────
function EmployeeFormModal({ existing, onClose, onSaved }: {
  existing?: EmployeeAdmin | null; onClose: () => void; onSaved: () => void;
}) {
  const [form,      setForm]      = useState(existing ? { ...EMPTY_FORM, ...existing } : { ...EMPTY_FORM });
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [error,     setError]     = useState('');
  const [imgErr,    setImgErr]    = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadPct(0);
    try {
      const res = await mediaApi.upload(file, pct => setUploadPct(pct));
      set('imageUrl', res.data.url); setImgErr(false);
    } catch { setError('Photo upload failed.'); }
    finally   { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim())    { setError('Full name is required.'); return; }
    if (!form.designation.trim()) { setError('Designation is required.'); return; }
    setError(''); setSaving(true);
    try {
      existing
        ? await api.put(`/employees/${existing.id}`, form)
        : await api.post('/employees', form);
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Save failed.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            {existing ? `Edit — ${existing.fullName}` : 'Add New Team Member'}
          </h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <div className="flex items-center gap-5">
            <div className="shrink-0">
              {form.imageUrl && !imgErr ? (
                <img src={form.imageUrl} alt="Preview" onError={() => setImgErr(true)}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <User size={28} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 text-xs border border-gray-300 px-3 py-1.5 rounded-lg text-gray-600 hover:border-brand-400 hover:text-brand-600 transition">
                <Upload size={13} /> {uploading ? `Uploading ${uploadPct}%…` : 'Upload Photo'}
              </button>
              {form.imageUrl && <button onClick={() => { set('imageUrl', ''); setImgErr(false); }} className="text-xs text-red-400 mt-1 block">Remove</button>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name *"    value={form.fullName}      onChange={v => set('fullName', v)}       placeholder="Rajesh Kumar" />
            <Field label="Designation *"  value={form.designation}   onChange={v => set('designation', v)}    placeholder="Senior Reporter" />
            <Field label="Email"          value={form.email ?? ''}   onChange={v => set('email', v)}          placeholder="emp@email.com" type="email" />
            <Field label="Mobile"         value={form.mobile ?? ''}  onChange={v => set('mobile', v)}         placeholder="+91 XXXXX XXXXX" />
            <Field label="Date of Birth"  value={form.dateOfBirth ?? ''} onChange={v => set('dateOfBirth', v)} type="date" />
            <Field label="Valid Upto"     value={form.validUpto ?? ''}   onChange={v => set('validUpto', v)}   type="date" />
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Govt ID Type</label>
              <select value={form.govtIdType ?? ''} onChange={e => set('govtIdType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                {GOVT_ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Field label="Govt ID Number" value={form.govtIdNumber ?? ''} onChange={v => set('govtIdNumber', v)} placeholder="XXXX XXXX XXXX" />
            <Field label="Display Order"  value={String(form.displayOrder ?? 0)} onChange={v => set('displayOrder', parseInt(v) || 0)} type="number" />
            {existing && (
              <div className="flex items-center gap-3 pt-5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-brand-600 transition" />
                  <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
                </label>
                <span className="text-sm text-gray-700">{form.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
            <textarea rows={2} value={form.address ?? ''} onChange={e => set('address', e.target.value)}
              placeholder="Full address…" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-60">
            {saving ? 'Saving…' : existing ? 'Save Changes' : 'Add to Team'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Team Manager ─────────────────────────────────────────────────────────
export default function TeamManager() {
  const [employees,    setEmployees]    = useState<EmployeeAdmin[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editing,      setEditing]      = useState<EmployeeAdmin | null>(null);
  const [qrFor,        setQrFor]        = useState<EmployeeAdmin | null>(null);
  const [credentials,  setCredentials]  = useState<any | null>(null);
  const [imgErrors,    setImgErrors]    = useState<Set<number>>(new Set());
  const [actionLoading,setActionLoading]= useState<number | null>(null);
  const { user } = useAuth();

  const load = () => {
    setLoading(true);
    api.get<{ success: boolean; data: EmployeeAdmin[] }>('/employees?all=true')
      .then(r => setEmployees(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDeactivate = async (emp: EmployeeAdmin) => {
    if (!confirm(`${emp.isActive ? 'Deactivate' : 'Reactivate'} ${emp.fullName}?`)) return;
    await api.put(`/employees/${emp.id}`, { ...emp, isActive: !emp.isActive });
    load();
  };

  const handleHardDelete = async (emp: EmployeeAdmin) => {
    if (!confirm(`PERMANENTLY delete ${emp.fullName}? This cannot be undone.`)) return;
    await api.delete(`/employees/${emp.id}/hard`);
    load();
  };

  // Grant OR reset login access
  const handleGrantLogin = async (emp: EmployeeAdmin) => {
    const action = emp.hasLoginAccess ? 'reset password' : 'grant login access';
    if (!confirm(`${emp.hasLoginAccess ? 'Reset password' : 'Grant login access'} for ${emp.fullName}?`)) return;

    setActionLoading(emp.id);
    try {
      const res = await api.post<{ success: boolean; data: any }>(
        `/employees/${emp.id}/grant-login`, {}
      );
      setCredentials(res.data.data);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Action failed.');
    } finally { setActionLoading(null); }
  };

  // Revoke login access
  const handleRevokeLogin = async (emp: EmployeeAdmin) => {
    if (!confirm(`Revoke login access for ${emp.fullName}? They will no longer be able to sign in.`)) return;
    setActionLoading(emp.id);
    try {
      await api.delete(`/employees/${emp.id}/revoke-login`);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Revoke failed.');
    } finally { setActionLoading(null); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Team Manager</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Info banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <QrCode size={16} className="text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700">Click <strong>QR</strong> to generate a QR code for printing on ID cards.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700">Click <strong>Login</strong> to grant/reset employee portal access. Click <strong>Revoke</strong> to remove it.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm p-8 text-center">Loading team…</div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
          <User size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No team members yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Photo','Name','Employee ID','Designation','Valid Upto','Login','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className={`border-t border-gray-50 hover:bg-gray-50 transition ${!emp.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      {emp.imageUrl && !imgErrors.has(emp.id) ? (
                        <img src={emp.imageUrl} alt={emp.fullName} onError={() => setImgErrors(s => new Set([...s, emp.id]))}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{emp.fullName}</p>
                      {emp.email && <p className="text-xs text-gray-400">{emp.email}</p>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-brand-600 font-semibold">{emp.employeeId}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{emp.designation}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {emp.validUpto ? (
                        <span className={new Date(emp.validUpto) < new Date() ? 'text-red-500 font-medium' : 'text-green-600'}>
                          {format(new Date(emp.validUpto + 'T00:00:00'), 'dd MMM yyyy')}
                        </span>
                      ) : '—'}
                    </td>
                    {/* Login access column */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${emp.hasLoginAccess ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {emp.hasLoginAccess ? 'Granted' : 'None'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* QR */}
                        <button onClick={() => setQrFor(emp)}
                          className="flex items-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-600
                            border border-brand-200 px-2 py-1 rounded-lg text-xs font-medium transition"
                          title="Generate QR Code">
                          <QrCode size={12} /> QR
                        </button>

                        {/* Grant / Reset login */}
                        <button
                          onClick={() => handleGrantLogin(emp)}
                          disabled={actionLoading === emp.id || !emp.isActive}
                          className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100
                            text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg
                            text-xs font-medium transition disabled:opacity-40"
                          title={emp.hasLoginAccess ? 'Reset Password' : 'Grant Login Access'}>
                          {actionLoading === emp.id ? '…' : <><KeyRound size={12} />
                            {emp.hasLoginAccess ? 'Reset' : 'Login'}</>}
                        </button>

                        {/* Revoke login */}
                        {emp.hasLoginAccess && (
                          <button onClick={() => handleRevokeLogin(emp)}
                            disabled={actionLoading === emp.id}
                            className="flex items-center gap-1 bg-red-50 hover:bg-red-100
                              text-red-600 border border-red-200 px-2 py-1 rounded-lg
                              text-xs font-medium transition disabled:opacity-40"
                            title="Revoke Login Access">
                            <ShieldOff size={12} /> Revoke
                          </button>
                        )}

                        {/* Edit */}
                        <button onClick={() => { setEditing(emp); setShowForm(true); }}
                          className="text-blue-500 hover:text-blue-700 transition p-1" title="Edit">
                          <Pencil size={15} />
                        </button>

                        {/* Activate/Deactivate */}
                        <button onClick={() => handleDeactivate(emp)}
                          className={`transition p-1 ${emp.isActive ? 'text-amber-500 hover:text-amber-700' : 'text-green-500 hover:text-green-700'}`}
                          title={emp.isActive ? 'Deactivate' : 'Reactivate'}>
                          {emp.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>

                        {/* Hard delete */}
                        {user?.role === 'SuperAdmin' && (
                          <button onClick={() => handleHardDelete(emp)}
                            className="text-red-400 hover:text-red-600 transition p-1" title="Delete permanently">
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
        </div>
      )}

      {/* Modals */}
      {(showForm || editing) && (
        <EmployeeFormModal
          existing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}
      {qrFor && <QRCodeModal employeeId={qrFor.employeeId} fullName={qrFor.fullName} onClose={() => setQrFor(null)} />}
      {credentials && <CredentialsModal data={credentials} onClose={() => setCredentials(null)} />}
    </div>
  );
}
