import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slotId: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

// Your AdSense publisher ID — replace with your real one after approval
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';

export default function AdBanner({ slotId, format = 'auto', style, className }: AdBannerProps) {
  const adRef  = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push once per mount; AdSense throws if pushed twice
    if (pushed.current) return;
    try {
      // @ts-ignore — adsbygoogle is injected by AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch { /* AdSense not loaded yet — harmless in dev */ }
  }, []);

  // In development, show a placeholder instead of a real ad
  if (typeof window !== 'undefined' && (window as any).__DEV__) {
    return (
      <div
        className={`bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs rounded ${className ?? ''}`}
        style={style}
      >
        AdSense Slot: {slotId}
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className ?? ''}`}
      style={{ display: 'block', ...style }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}