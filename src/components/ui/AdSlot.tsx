import { useEffect, useRef, useState } from 'react';
import type { AdPublic } from '../../types/ads';
import { adsApi } from '../../services/adsApi';

interface AdSlotProps {
  placement: 'banner_top' | 'sidebar' | 'inline' | 'banner_bottom';
  className?: string;
}

// ── Single Ad Card ────────────────────────────────────────────────────────────
function AdCard({ ad }: { ad: AdPublic }) {
  const ref        = useRef<HTMLDivElement>(null);
  const tracked    = useRef(false);
  const [err, setErr] = useState(false);

  // Track impression when ad enters viewport
  useEffect(() => {
    if (!ref.current || tracked.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          adsApi.trackImpression(ad.id);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ad.id]);

  const handleClick = () => {
    adsApi.trackClick(ad.id);
    if (ad.clickUrl) {
      window.open(ad.clickUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (err) return null;  // silently hide broken ads

  return (
    <div ref={ref} className="relative group">
      {/* ── "विज्ञापन" badge — always visible, clearly marks this as an ad ── */}
      <div className="absolute top-0 left-0 z-10 bg-gray-700/80 text-white
        text-[10px] font-semibold px-2 py-0.5 rounded-br-lg rounded-tl-lg
        tracking-wider select-none pointer-events-none">
        विज्ञापन
      </div>

      {/* Ad image */}
      <div
        onClick={handleClick}
        className={`block w-full overflow-hidden rounded-xl border-2 border-dashed
          border-gray-200 bg-gray-50
          ${ad.clickUrl ? 'cursor-pointer hover:border-brand-300 hover:shadow-md transition-all duration-200' : 'cursor-default'}`}
      >
        <img
          src={ad.adImageUrl}
          alt="विज्ञापन"
          onError={() => setErr(true)}
          className="w-full h-auto object-contain block"
          loading="lazy"
        />
      </div>

      {/* Bottom label */}
      <p className="text-center text-[10px] text-gray-400 mt-1 tracking-wider select-none">
        — विज्ञापन / Advertisement —
      </p>
    </div>
  );
}

// ── AdSlot — fetches and renders all ads for a placement ─────────────────────
export default function AdSlot({ placement, className = '' }: AdSlotProps) {
  const [ads,     setAds]     = useState<AdPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adsApi.getByPlacement(placement)
      .then(r => setAds(r.data.data))
      .catch(() => setAds([]))
      .finally(() => setLoading(false));
  }, [placement]);

  // Don't render anything if no ads (no blank space left on page)
  if (loading || ads.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
    </div>
  );
}
