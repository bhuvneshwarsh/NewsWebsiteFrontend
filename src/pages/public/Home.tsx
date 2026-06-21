import { useSearchParams } from 'react-router-dom';
import { useArticles } from '../../hooks/useArticles';
import ArticleCard from '../../components/ui/ArticleCard';
import { SkeletonCard, SkeletonFeatured } from '../../components/ui/Skeleton';
import AdBanner from '../../components/ui/AdBanner';

export default function Home() {
  const [searchParams] = useSearchParams();
  const search   = searchParams.get('q') ?? '';
  const { articles, loading, error, hasMore, loadMore } = useArticles({ search });

  const featured  = articles[0];
  const rest      = articles.slice(1);

  return (
    <div className="container mx-auto px-4 py-6">

      {/* Top leaderboard ad */}
      <AdBanner slotId="1234567890" format="horizontal"
        className="w-full mb-6" style={{ minHeight: 90 }} />

      {search && (
        <div className="mb-4 text-sm text-gray-600">
          Showing results for <strong>"{search}"</strong>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: feed */}
        <div className="lg:col-span-2 space-y-4">

          {/* Featured hero */}
          {loading && !featured ? (
            <SkeletonFeatured />
          ) : featured ? (
            <ArticleCard article={featured} featured />
          ) : null}

          {/* Article list */}
          <div className="space-y-3">
            {loading && articles.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : rest.map(a => <ArticleCard key={a.id} article={a} />)
            }
          </div>

          {/* Load more */}
          {hasMore && !loading && (
            <button onClick={loadMore}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-600
              hover:border-brand-400 hover:text-brand-600 transition font-medium">
              Load more articles
            </button>
          )}
          {loading && articles.length > 0 && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && articles.length === 0 && !error && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No articles found</p>
              <p className="text-sm mt-1">Check back soon for the latest news.</p>
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <aside className="space-y-5">
          {/* Sidebar ad — tall rectangle */}
          <AdBanner slotId="0987654321" format="vertical"
            style={{ minHeight: 600, width: '100%' }} />
        </aside>
      </div>
    </div>
  );
}