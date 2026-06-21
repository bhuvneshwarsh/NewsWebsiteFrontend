import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../../hooks/useArticles';
import ArticleCard from '../../components/ui/ArticleCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import AdBanner from '../../components/ui/AdBanner';
import { ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = (slug ?? '').charAt(0).toUpperCase() + (slug ?? '').slice(1);

  const { articles, loading, error, hasMore, loadMore } = useArticles({ category: slug });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <Link to="/" className="hover:text-brand-600 transition">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-800 font-medium">{categoryName}</span>
      </nav>

      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          {categoryName}
        </h1>
        <span className="text-xs text-gray-400">{articles.length} articles</span>
      </div>

      {/* Top ad */}
      <AdBanner slotId="1122334455" format="horizontal"
        className="w-full mb-6" style={{ minHeight: 90 }} />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {loading && articles.length === 0
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : articles.map(a => <ArticleCard key={a.id} article={a} />)
          }

          {hasMore && !loading && (
            <button onClick={loadMore}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-600
              hover:border-brand-400 hover:text-brand-600 transition font-medium">
              Load more
            </button>
          )}

          {!loading && articles.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="font-medium">No articles in {categoryName} yet.</p>
            </div>
          )}
        </div>

        <aside>
          <AdBanner slotId="5544332211" format="vertical"
            style={{ minHeight: 600, width: '100%' }} />
        </aside>
      </div>
    </div>
  );
}