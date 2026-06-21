import { useRef, useState } from 'react';
import { mediaApi } from '../../services/api';
import { UploadCloud, Copy, CheckCheck } from 'lucide-react';

interface UploadedFile {
  url:      string;
  name:     string;
  uploadedAt: string;
}

export default function MediaManager() {
  const [uploads,   setUploads]   = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState('');
  const [copied,    setCopied]    = useState<string | null>(null);
  const [dragging,  setDragging]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only images are allowed.'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Max file size is 5 MB.'); return;
    }
    setError(''); setUploading(true); setProgress(0);
    try {
      const res = await mediaApi.upload(file, pct => setProgress(pct));
      setUploads(prev => [{
        url: res.data.url,
        name: file.name,
        uploadedAt: new Date().toLocaleTimeString('en-IN')
      }, ...prev]);
    } catch {
      setError('Upload failed. Check your Azure Blob connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (files?.[0]) upload(files[0]);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Media Manager</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition mb-6
          ${dragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400 bg-gray-50'}`}
      >
        <UploadCloud size={36} className="mx-auto mb-3 text-gray-400" />
        <p className="text-sm font-medium text-gray-600">
          {uploading ? `Uploading… ${progress}%` : 'Click or drag an image here'}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · Max 5 MB</p>
        {uploading && (
          <div className="mt-4 w-full max-w-xs mx-auto bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-brand-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Uploaded files */}
      {uploads.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 text-sm font-medium text-gray-700">
            Uploaded this session
          </div>
          <div className="divide-y divide-gray-50">
            {uploads.map((f, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <img src={f.url} alt={f.name}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">{f.url}</p>
                </div>
                <button onClick={() => copyUrl(f.url)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition
                    ${copied === f.url
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {copied === f.url ? <><CheckCheck size={13} /> Copied</> : <><Copy size={13} /> Copy URL</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
