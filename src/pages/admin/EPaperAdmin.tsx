import { useEffect, useRef, useState } from 'react';
import { epaperApi } from '../../services/api';
import type { EPaper } from '../../types';
import { Upload, Trash2, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function EPaperAdmin() {
  const [papers,   setPapers]   = useState<EPaper[]>([]);
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [file,     setFile]     = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    epaperApi.list().then(r => setPapers(r.data.data));
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async () => {
    if (!file) { setError('Please select a PDF file.'); return; }
    if (file.type !== 'application/pdf') { setError('Only PDF files allowed.'); return; }
    if (file.size > 50 * 1024 * 1024) { setError('Max file size is 50 MB.'); return; }

    setError(''); setSuccess(''); setLoading(true); setProgress(0);
    try {
      await epaperApi.upload(file, date, pct => setProgress(pct));
      setSuccess(`E-Paper for ${date} uploaded successfully!`);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, d: string) => {
    if (!confirm(`Delete e-paper for ${d}?`)) return;
    await epaperApi.delete(id);
    load();
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">E-Paper Manager</h2>

      {/* Upload form */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Upload New Issue</h3>

        {error   && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
            <input ref={fileRef} type="file" accept="application/pdf"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
        </div>

        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-50 rounded-lg p-3">
            <FileText size={16} className="text-brand-500" />
            <span className="font-medium">{file.name}</span>
            <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
          </div>
        )}

        {loading && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Uploading…</span><span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-brand-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <button onClick={handleUpload} disabled={loading || !file}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60">
          <Upload size={15} />
          {loading ? `Uploading ${progress}%…` : 'Upload E-Paper'}
        </button>
      </div>

      {/* Previous issues */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-700">
          Previous Issues ({papers.length})
        </div>
        {papers.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No e-papers uploaded yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {papers.map(p => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                <FileText size={20} className="text-brand-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(p.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                  </p>
                  <a href={p.pdfUrl} target="_blank" rel="noreferrer"
                    className="text-xs text-brand-600 hover:underline">View PDF ↗</a>
                </div>
                {user?.role === 'SuperAdmin' && (
                  <button onClick={() => handleDelete(p.id, p.date)}
                    className="text-red-400 hover:text-red-600 transition">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
