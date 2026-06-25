import { useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, QrCode, Copy, CheckCheck, X } from 'lucide-react';

interface QRModalProps {
  employeeId: string;
  fullName:   string;
  onClose:    () => void;
}

export default function QRCodeModal({ employeeId, fullName, onClose }: QRModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef   = useRef(true);          // tracks if component is still mounted
  const scriptRef    = useRef<HTMLScriptElement | null>(null);
  const qrRef        = useRef<any>(null);     // holds the QRCode instance

  const [ready,   setReady]   = useState(false);
  const [copied,  setCopied]  = useState(false);
  const [error,   setError]   = useState('');

  const profileUrl = `${window.location.origin}/team/${employeeId}`;

  // ── Generate QR once library is loaded ──────────────────────────────────────
  const generateQR = () => {
    if (!mountedRef.current) return;
    if (!containerRef.current) return;

    try {
      // Clear any previous QR
      containerRef.current.innerHTML = '';

      // @ts-ignore — QRCode loaded from CDN
      qrRef.current = new window.QRCode(containerRef.current, {
        text:         profileUrl,
        width:        220,
        height:       220,
        colorDark:    '#1a1a2e',
        colorLight:   '#ffffff',
        correctLevel: (window as any).QRCode.CorrectLevel.H,
      });

      if (mountedRef.current) setReady(true);
    } catch (e) {
      if (mountedRef.current) setError('QR generation failed. Please try again.');
    }
  };

  // ── Load QRCode library from CDN ─────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    // If already loaded (e.g. modal reopened), just generate
    if (typeof (window as any).QRCode !== 'undefined') {
  generateQR();
  return;
}


    const script = document.createElement('script');
    script.src   = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async = true;
    scriptRef.current = script;

    script.onload = () => {
      if (mountedRef.current) generateQR();
    };
    script.onerror = () => {
      if (mountedRef.current)
        setError('Failed to load QR library. Check your internet connection.');
    };

    document.head.appendChild(script);

    // ── Cleanup — safe removal ─────────────────────────────────────────────────
    return () => {
      mountedRef.current = false;

      // Clear the QR container safely using the ref (not getElementById)
      if (containerRef.current) {
        try { containerRef.current.innerHTML = ''; } catch { /* ignore */ }
      }

      // Remove the script tag only if it is still a child of document.head
      const s = scriptRef.current;
      if (s && s.parentNode === document.head) {
        try { document.head.removeChild(s); } catch { /* ignore */ }
      }
      scriptRef.current = null;
    };
  }, []); // run once on mount

  // ── Download QR as branded PNG ───────────────────────────────────────────────
  const downloadQR = () => {
    if (!containerRef.current) return;

    const canvas = containerRef.current.querySelector('canvas') as HTMLCanvasElement | null;
    const img    = containerRef.current.querySelector('img')    as HTMLImageElement   | null;

    const drawAndDownload = (sourceCanvas: HTMLCanvasElement | null, imgSrc?: string) => {
      const out = document.createElement('canvas');
      out.width  = 320;
      out.height = 400;
      const ctx  = out.getContext('2d')!;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 320, 400);

      // Red header strip
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, 320, 52);

      // Org name
      ctx.fillStyle = '#ffffff';
      ctx.font      = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Prajatantr Ki Gunj', 160, 24);
      ctx.font      = '11px Arial';
      ctx.fillStyle = '#fecaca';
      ctx.fillText('Official Press ID', 160, 42);

      const drawQR = (qrCanvas: HTMLCanvasElement) => {
        ctx.drawImage(qrCanvas, 50, 66, 220, 220);

        // Employee name
        ctx.fillStyle = '#111827';
        ctx.font      = 'bold 14px Arial';
        ctx.textAlign = 'center';
        const name    = fullName.length > 28 ? fullName.slice(0, 25) + '…' : fullName;
        ctx.fillText(name, 160, 318);

        // Employee ID
        ctx.fillStyle = '#dc2626';
        ctx.font      = 'bold 11px monospace';
        ctx.fillText(employeeId, 160, 340);

        // Instruction
        ctx.fillStyle = '#6b7280';
        ctx.font      = '10px Arial';
        ctx.fillText('Scan to verify identity', 160, 362);

        // Border
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth   = 1.5;
        ctx.strokeRect(1, 1, 318, 398);

        // Download
        const link      = document.createElement('a');
        link.download   = `QR-${employeeId}-${fullName.replace(/\s+/g, '_')}.png`;
        link.href       = out.toDataURL('image/png');
        link.click();
      };

      if (sourceCanvas) {
        drawQR(sourceCanvas);
      } else if (imgSrc) {
        // QRCode lib sometimes renders an <img> instead of <canvas> in some browsers
        const tempImg    = new Image();
        tempImg.crossOrigin = 'anonymous';
        tempImg.onload   = () => {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width  = tempImg.width;
          tempCanvas.height = tempImg.height;
          tempCanvas.getContext('2d')!.drawImage(tempImg, 0, 0);
          drawQR(tempCanvas);
        };
        tempImg.src = imgSrc;
      }
    };

    if (canvas) {
      drawAndDownload(canvas);
    } else if (img?.src) {
      drawAndDownload(null, img.src);
    } else {
      setError('QR not ready yet. Wait a moment and try again.');
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-5 py-4
          flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode size={20} className="text-white" />
            <div>
              <h2 className="text-white font-semibold text-sm leading-tight">{fullName}</h2>
              <p className="text-brand-200 text-xs">{employeeId}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm mb-3">{error}</p>
              <button onClick={() => { setError(''); setReady(false); generateQR(); }}
                className="text-xs text-brand-600 hover:underline">Try again</button>
            </div>
          ) : (
            <>
              {/* QR container — using ref, NOT getElementById */}
              <div className="flex justify-center mb-4">
                <div className="p-3 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  {/* Loading placeholder shown until QR renders */}
                  {!ready && (
                    <div className="flex flex-col items-center justify-center text-gray-400"
                      style={{ width: 220, height: 220 }}>
                      <QrCode size={40} className="mb-2 animate-pulse" />
                      <p className="text-xs">Generating QR…</p>
                    </div>
                  )}
                  {/* The actual QR renders into this div via the ref */}
                  <div
                    ref={containerRef}
                    style={{ display: ready ? 'block' : 'none' }}
                  />
                </div>
              </div>

              {/* Profile URL row */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 mb-4
                flex items-center gap-2">
                <p className="text-xs text-gray-500 font-mono flex-1 truncate">{profileUrl}</p>
                <button onClick={copyUrl} title="Copy URL"
                  className={`shrink-0 p-1 rounded transition
                    ${copied ? 'text-green-600' : 'text-gray-400 hover:text-brand-600'}`}>
                  {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                </button>
                <a href={profileUrl} target="_blank" rel="noreferrer" title="Open in browser"
                  className="shrink-0 p-1 rounded text-gray-400 hover:text-brand-600 transition">
                  <ExternalLink size={15} />
                </a>
              </div>

              {/* Info tip */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-4">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>For ID cards:</strong> Download the QR and print it on the employee's
                  physical ID card. Scanning opens their verified digital profile instantly.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button onClick={onClose}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium
                    py-2.5 rounded-xl hover:bg-gray-50 transition">
                  Close
                </button>
                <button onClick={downloadQR} disabled={!ready}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-600
                    hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium
                    py-2.5 rounded-xl transition">
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