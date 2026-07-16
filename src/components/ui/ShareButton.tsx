import { useState } from 'react';
import {
  Share2, Check, Copy, MessageCircle, Twitter, Link2, X
} from 'lucide-react';

// Get the backend API base URL (same as axios setup in api.ts)
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || '/api';
// Get the frontend base URL (for article links)
const FRONTEND_URL = window.location.origin;

interface ShareButtonProps {
  title:       string;
  slug:        string;
  thumbnailUrl?: string | null;
  variant?:    'icon' | 'button' | 'full';  // icon = small icon only, button = icon+text, full = all options
}

export default function ShareButton({
  title, slug, thumbnailUrl, variant = 'button'
}: ShareButtonProps) {
  const [open,   setOpen]   = useState(false);
  const [copied, setCopied] = useState(false);

  // ── For social sharing, use OG endpoint that includes meta tags & image ────
  // Social media crawlers fetch this URL, get full HTML with OG tags
  // Real browsers get auto-redirected to the article page
  const articleUrl = `${FRONTEND_URL}/news/${slug}`;
  // Use backend API URL for OG endpoint so crawlers can access the meta tags
  const ogUrl      = `${API_BASE_URL}/og?slug=${encodeURIComponent(slug)}`;

  // ── Native share (mobile) ─────────────────────────────────────────────────
  const handleNativeShare = async () => {
    if (typeof navigator.share === 'function' && variant !== 'full') {
      try {
        // Share the OG endpoint so crawlers get proper meta tags
        await navigator.share({ title, url: ogUrl, text: title });
      } catch { /* user cancelled */ }
      return;
    }
    // Desktop fallback: open custom share panel
    setOpen(true);
  };

  // ── Copy link (user gets article URL, not OG endpoint) ───────────────────
  const handleCopy = async () => {
    await navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 2000);
  };

  // ── Share destinations ────────────────────────────────────────────────────
  const shareLinks = [
    {
      label:   'WhatsApp',
      icon:    MessageCircle,
      color:   'bg-green-500 hover:bg-green-600',
      href:    `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n' + ogUrl)}`,
    },
    {
      label:   'Twitter / X',
      icon:    Twitter,
      color:   'bg-sky-500 hover:bg-sky-600',
      href:    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(ogUrl)}`,
    },
    {
      label:   'Telegram',
      icon:    Share2,
      color:   'bg-blue-500 hover:bg-blue-600',
      href:    `https://t.me/share/url?url=${encodeURIComponent(ogUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      label:   'Facebook',
      icon:    Share2,
      color:   'bg-blue-700 hover:bg-blue-800',
      href:    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogUrl)}`,
    },
  ];

  // ── Trigger button ────────────────────────────────────────────────────────
  const TriggerBtn = () => (
    <button
      onClick={handleNativeShare}
      className={`flex items-center gap-1.5 transition rounded-lg font-medium text-xs
        ${variant === 'icon'
          ? 'p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50'
          : 'px-3 py-1.5 text-gray-600 hover:text-brand-600 bg-gray-100 hover:bg-brand-50 border border-gray-200 hover:border-brand-300'}`}
      title="Share this article">
      <Share2 size={variant === 'icon' ? 15 : 14} />
      {variant !== 'icon' && <span>Share</span>}
    </button>
  );

  // ── If mobile native share available, just show trigger ───────────────────
  if (typeof navigator.share === 'function' && variant !== 'full') {
    return <TriggerBtn />;
  }

  return (
    <div className="relative inline-block">
      <TriggerBtn />

      {/* ── Share panel (desktop / full variant) ───────────────────────── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute z-50 right-0 top-full mt-2 w-64
            bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3
              border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Share Article
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition">
                <X size={15} />
              </button>
            </div>

            {/* Article preview inside panel */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              {thumbnailUrl && (
                <img src={thumbnailUrl} alt={title}
                  className="w-12 h-10 rounded-lg object-cover shrink-0 border border-gray-100" />
              )}
              <p className="text-xs text-gray-600 leading-snug line-clamp-2 font-medium">
                {title}
              </p>
            </div>

            {/* Share buttons */}
            <div className="p-3 grid grid-cols-2 gap-2">
              {shareLinks.map(({ label, icon: Icon, color, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={`${color} text-white text-xs font-medium px-3 py-2
                    rounded-xl flex items-center gap-1.5 transition justify-center`}>
                  <Icon size={13} />
                  {label}
                </a>
              ))}
            </div>

            {/* Copy link */}
            <div className="px-3 pb-3">
              <button
                onClick={handleCopy}
                className={`w-full flex items-center gap-2 text-xs font-medium px-3 py-2.5
                  rounded-xl border transition
                  ${copied
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'}`}>
                {copied
                  ? <><Check size={13} /> Link Copied!</>
                  : <><Link2 size={13} /> Copy Link</>}
                <span className="ml-auto text-gray-400 font-mono truncate max-w-[100px] text-[10px]">
                  {articleUrl.replace('https://', '')}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}