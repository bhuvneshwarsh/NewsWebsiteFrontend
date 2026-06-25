import { useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, QrCode, Copy, CheckCheck } from 'lucide-react';

interface QRModalProps {
  employeeId: string;
  fullName:   string;
  onClose:    () => void;
}

// ── Pure QR Code generator using qrcode library loaded from CDN ───────────────
// We use a canvas-based approach with no npm dependency needed
export default function QRCodeModal({ employeeId, fullName, onClose }: QRModalProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [ready,    setReady]   = useState(false);
  const [copied,   setCopied]  = useState(false);
  const [error,    setError]   = useState('');

  const profileUrl = `${window.location.origin}/team/${employeeId}`;

  // Load qrcode.js from CDN and draw on canvas
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = () => generateQR();
    script.onerror = () => setError('Failed to load QR library. Check your internet connection.');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const generateQR = () => {
    try {
      const container = document.getElementById('qr-container');
      if (!container) return;
      container.innerHTML = '';

      // @ts-ignore — QRCode is loaded from CDN
      new QRCode(container, {
        text:          profileUrl,
        width:         240,
        height:        240,
        colorDark:     '#1a1a2e',
        colorLight:    '#ffffff',
        correctLevel: (window as any).QRCode.CorrectLevel.H,   // High error correction — good for printed IDs
      });

      setReady(true);
    } catch (e) {
      setError('QR generation failed.');
    }
  };

  // Download QR as PNG
  const downloadQR = () => {
    const container = document.getElementById('qr-container');
    const img = container?.querySelector('img') as HTMLImageElement | null;
    const canvas = container?.querySelector('canvas') as HTMLCanvasElement | null;

    let dataUrl = '';

    if (canvas) {
      // Draw branded card around the QR code
      const out = document.createElement('canvas');
      out.width  = 320;
      out.height = 400;
      const ctx = out.getContext('2d')!;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 320, 400);

      // Top brand strip
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, 320, 50);

      // Org name in strip
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Prajatantr Ki Gunj', 160, 22);
      ctx.font = '11px Arial';
      ctx.fillStyle = '#fecaca';
      ctx.fillText('Official Press ID', 160, 40);

      // QR code
      ctx.drawImage(canvas, 40, 65, 240, 240);

      // Employee name
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 15px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(fullName, 160, 330);

      // Employee ID
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(employeeId, 160, 352);

      // Scan instruction
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.fillText('Scan to verify identity', 160, 378);

      // Border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 318, 398);

      dataUrl = out.toDataURL('image/png');
    } else if (img) {
      dataUrl = img.src;
    }

    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `QR-${employeeId}-${fullName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <QrCode size={20} className="text-white" />
            <div>
              <h2 className="text-white font-semibold text-sm">QR Code — {fullName}</h2>
              <p className="text-brand-200 text-xs">{employeeId}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {error ? (
            <div className="text-center py-8 text-red-500 text-sm">{error}</div>
          ) : (
            <>
              {/* QR canvas */}
              <div className="flex justify-center mb-4">
                <div className="p-3 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <div id="qr-container" className="flex items-center justify-center"
                    style={{ minWidth: 240, minHeight: 240 }}>
                    {!ready && (
                      <div className="flex flex-col items-center text-gray-400">
                        <QrCode size={40} className="mb-2 animate-pulse" />
                        <p className="text-xs">Generating QR…</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile URL */}
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-4 flex items-center gap-2">
                <p className="text-xs text-gray-500 font-mono flex-1 truncate">{profileUrl}</p>
                <button onClick={copyUrl}
                  className={`shrink-0 transition ${copied ? 'text-green-600' : 'text-gray-400 hover:text-brand-600'}`}
                  title="Copy URL">
                  {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                </button>
                <a href={profileUrl} target="_blank" rel="noreferrer"
                  className="shrink-0 text-gray-400 hover:text-brand-600 transition" title="Open page">
                  <ExternalLink size={15} />
                </a>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-4">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>For ID cards:</strong> Download the QR and print it on the employee's
                  physical ID card. Scanning will open their verified digital profile.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={onClose}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium
                    py-2.5 rounded-xl hover:bg-gray-50 transition">
                  Close
                </button>
                <button onClick={downloadQR} disabled={!ready}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-600
                    hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-xl
                    transition disabled:opacity-50">
                  <Download size={15} />
                  Download QR
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
