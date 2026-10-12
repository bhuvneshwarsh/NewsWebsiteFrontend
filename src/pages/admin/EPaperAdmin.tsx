import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import {
  Trash2, ExternalLink, FileText, RefreshCw, Plus, X, Calendar
} from 'lucide-react';
import { epaperApi } from '../../services/api';
import { parseApiTimestamp } from '../../utils/date';

interface EPaper {
  id:           number;
  date:         string;
  pdfUrl:       string;
  thumbnailUrl?: string | null;
  uploadedAt:   string;
}

export default function EPaperAdmin() {
  const [epapers,  setEpapers]  = useState<EPaper[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error,    setError]    = useState('');

  // Form fields
  const [date,      setDate]      = useState('');
  const [pdfFile,   setPdfFile]   = useState<File | null>(null);
  const [saving,    setSaving]    = useState(false);

  // PDF upload progress
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfPct,       setPdfPct]       = useState(0);

  const pdfRef   = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    setError('');
    epaperApi.list()
      .then(r => setEpapers(r.data.data ?? []))
      .catch(() => setError('Failed to load e-papers.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    setPdfFile(file);
    setError('');
  };

  const handleSubmit = async () => {
    if (!date)         { setError('Date is required.');     return; }
    if (!pdfFile)      { setError('Please select a PDF file first.'); return; }

    setError(''); setSaving(true);
    setPdfUploading(true);
    try {
      await epaperApi.upload(pdfFile, date, setPdfPct);
      setShowForm(false);
      resetForm();
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Save failed. Please try again.');
    } finally {
      setSaving(false);
      setPdfUploading(false);
    }
  };

  const handleDelete = async (id: number, date: string) => {
    if (!confirm(`Delete the e-paper for ${date}? This cannot be undone.`)) return;
    try {
      await epaperApi.delete(id);
      setEpapers(prev => prev.filter(e => e.id !== id));
    } catch {
      alert('Delete failed. Please try again.');
    }
  };

  const resetForm = () => {
    setDate('');
    setPdfFile(null);
    setError('');
    setPdfPct(0);
    if (pdfRef.current) pdfRef.current.value = '';
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">E-Paper Manager</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Upload and manage digital newspaper editions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load}
            className="flex items-center gap-2 text-sm border border-gray-200
              text-gray-600 hover:border-brand-400 hover:text-brand-600
              px-3 py-2 rounded-xl transition">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700
              text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            <Plus size={16} /> Add Edition
          </button>
        </div>
      </div>

      {error && !showForm && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl
          text-red-700 text-sm">{error}</div>
      )}

      {/* ── Upload Form Modal ──────────────────────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4
            bg-black/60 backdrop-blur-sm"
          onClick={() => setShowForm(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4
              border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Add New Edition</h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl
                  text-red-700 text-sm">{error}</div>
              )}

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Edition Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  PDF File *{' '}
                  {pdfFile && (
                    <span className="text-green-600 font-semibold">✓ Selected</span>
                  )}
                </label>
                <input
                  ref={pdfRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handlePdfSelect}
                />
                <button
                  onClick={() => pdfRef.current?.click()}
                  disabled={pdfUploading}
                  className={`w-full flex items-center justify-center gap-2
                    border-2 border-dashed rounded-xl py-4 text-sm transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${pdfFile
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-500 hover:border-brand-400 hover:text-brand-600'
                    }`}>
                  <FileText size={16} />
                  {pdfUploading
                    ? `Uploading ${pdfPct}%…`
                    : pdfFile
                      ? `${pdfFile.name} — Click to Replace`
                      : 'Select a PDF file'}
                </button>
                {pdfUploading && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${pdfPct}%` }}
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t
              border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || pdfUploading}
                className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white
                  text-sm font-medium rounded-xl transition disabled:opacity-60">
                {saving ? 'Saving…' : 'Add Edition'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── E-Papers List ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center
          text-gray-400 text-sm">
          Loading editions…
        </div>
      ) : epapers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
          p-14 text-center text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">No editions uploaded yet.</p>
          <p className="text-xs mt-1">
            Click "Add Edition" to upload your first e-paper.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Edition', 'Date', 'Uploaded', 'Actions'].map(h => (
                    <th key={h}
                      className="px-5 py-3 text-left whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {epapers.map(ep => (
                  <tr key={ep.id}
                    className="border-t border-gray-50 hover:bg-gray-50 transition">

                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800 max-w-xs truncate">
                        E-Paper Edition
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {format(new Date(ep.date + 'T00:00:00'), 'dd MMM yyyy')}
                      </span>
                    </td>

                    {/* Uploaded */}
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {format(parseApiTimestamp(ep.uploadedAt), 'dd MMM yyyy, h:mm a')}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={ep.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs
                            bg-blue-50 hover:bg-blue-100 text-blue-600
                            border border-blue-200 px-2.5 py-1.5 rounded-lg
                            transition font-medium">
                          <ExternalLink size={12} /> View PDF
                        </a>
                        <button
                          onClick={() => handleDelete(ep.id, ep.date)}
                          className="text-red-400 hover:text-red-600 transition p-1"
                          title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}