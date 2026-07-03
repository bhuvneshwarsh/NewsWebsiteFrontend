import { useSearchParams } from 'react-router-dom';
import { useArticles } from '../../hooks/useArticles';
import ArticleCard from '../../components/ui/ArticleCard';
import { SkeletonCard, SkeletonFeatured } from '../../components/ui/Skeleton';
import AdSlot from '../../components/ui/AdSlot';

// Insert an inline ad after every N articles in the feed
const INLINE_AD_EVERY = 5;

export default function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const { articles, loading, error, hasMore, loadMore } = useArticles({ search });

  const featured = articles[0];
  const rest     = articles.slice(1);

  // Split rest into chunks so we can inject inline ads between them
  const chunks: typeof rest[] = [];
  for (let i = 0; i < rest.length; i += INLINE_AD_EVERY) {
    chunks.push(rest.slice(i, i + INLINE_AD_EVERY));
  }

  return (
    <div className="container mx-auto px-4 py-6">

      {/* ── Top Banner Ad ───────────────────────────────────────────────────── */}
      <AdSlot placement="banner_top" className="mb-6" />

      {search && (
        <div className="mb-4 text-sm text-gray-600">
          Search results for <strong>"{search}"</strong>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl
          text-red-600 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: News feed ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Featured hero */}
          {loading && !featured
            ? <SkeletonFeatured />
            : featured
              ? <ArticleCard article={featured} featured />
              : null}

          {/* Articles with inline ads injected between chunks */}
          {loading && articles.length === 0
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : chunks.map((chunk, chunkIdx) => (
                <div key={chunkIdx} className="space-y-3">
                  {chunk.map(a => <ArticleCard key={a.id} article={a} />)}

                  {/* Inline ad after each chunk (except the last if still loading) */}
                  {chunkIdx < chunks.length - 1 && (
                    <AdSlot placement="inline" className="py-2" />
                  )}
                </div>
              ))}

          {/* Load more */}
          {hasMore && !loading && (
            <button onClick={loadMore}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm
                text-gray-600 hover:border-brand-400 hover:text-brand-600 transition font-medium">
              और खबरें लोड करें
            </button>
          )}

          {loading && articles.length > 0 && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && articles.length === 0 && !error && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">कोई खबर नहीं मिली</p>
              <p className="text-sm mt-1">जल्द ही नई खबरें आएंगी।</p>
            </div>
          )}

          {/* Bottom Banner Ad — below all articles */}
          <AdSlot placement="banner_bottom" className="mt-4" />
        </div>

        {/* ── Right: Sidebar ───────────────────────────────────────────────── */}
        <aside className="space-y-5">
          {/* Sidebar ads — manual + Google AdSense can coexist here */}
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </div>
  );
}
