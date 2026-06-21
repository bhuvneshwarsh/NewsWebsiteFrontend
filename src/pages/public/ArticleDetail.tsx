import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articlesApi } from '../../services/api';
import type { ArticleDetail } from '../../types';
import { SkeletonText } from '../../components/ui/Skeleton';
import AdBanner from '../../components/ui/AdBanner';
import { Clock, Eye, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function ArticleDetailPage() {
  const { slug }   = useParams<{ slug: string }>();
  const navigate   = useNavigate();
  const [article,  setArticle]  = useState<ArticleDetail | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true); setError('');
    articlesApi.getBySlug(slug)
      .then(r => setArticle(r.data.data))
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (error) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 mb-4">{error}</p>
      <button onClick={() => navigate(-1)}
        className="text-brand-600 hover:underline text-sm flex items-center gap-1 mx-auto">
        <ArrowLeft size={14} /> Go back
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Top banner ad */}
      <AdBanner slotId="2233445566" format="horizontal"
        className="w-full mb-6" style={{ minHeight: 90 }} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Article */}
        <article className="lg:col-span-2">

          {/* Breadcrumb */}
          {!loading && article && (
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
              <Link to="/" className="hover:text-brand-600">Home</Link>
              <ChevronRight size={12} />
              <Link to={`/category/${article.categoryName.toLowerCase()}`}
                className="hover:text-brand-600">{article.categoryName}</Link>
              <ChevronRight size={12} />
              <span className="text-gray-700 truncate max-w-xs">{article.title}</span>
            </nav>
          )}

          {loading ? (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />
              <SkeletonText lines={12} />
            </div>
          ) : article ? (
            <>
              {/* Category badge */}
              <Link to={`/category/${article.categoryName.toLowerCase()}`}>
                <span className="inline-block bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded mb-3">
                  {article.categoryName}
                </span>
              </Link>

              {/* Title */}
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {article.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-100">
                <span className="flex items-center gap-1.5">
                  <User size={14} /> {article.authorName}
                </span>
                {article.publishedAt && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {format(new Date(article.publishedAt), 'dd MMM yyyy, h:mm a')}
                    </span>
                    <span className="text-gray-300">
                      ({formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })})
                    </span>
                  </>
                )}
                <span className="flex items-center gap-1.5">
                  <Eye size={14} /> {article.views.toLocaleString()} views
                </span>
              </div>

              {/* Thumbnail */}
              {article.thumbnailUrl && (
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video bg-gray-100">
                  <img src={article.thumbnailUrl} alt={article.title}
                    className="w-full h-full object-cover" />
                </div>
              )}

              {/* In-content ad (after first image) */}
              <AdBanner slotId="6677889900" format="rectangle"
                className="mb-6" style={{ minHeight: 250 }} />

              {/* Article body (HTML from Quill) */}
              <div
                className="prose prose-gray max-w-none prose-headings:font-serif
                  prose-a:text-brand-600 prose-img:rounded-xl prose-blockquote:border-brand-500"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </>
          ) : null}
        </article>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 self-start">
          <AdBanner slotId="1029384756" format="vertical"
            style={{ minHeight: 600, width: '100%' }} />
        </aside>
      </div>
    </div>
  );
}