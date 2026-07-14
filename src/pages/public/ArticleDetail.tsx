import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articlesApi } from '../../services/api';
import type { ArticleDetail } from '../../types';
import { SkeletonText } from '../../components/ui/Skeleton';
import AdSlot from '../../components/ui/AdSlot';
import ShareButton from '../../components/ui/ShareButton';
import { useMetaTags } from '../../hooks/useMetaTags';
import { Clock, Eye, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

export default function ArticleDetailPage() {
  const { slug }     = useParams<{ slug: string }>();
  const navigate     = useNavigate();
  const [article,    setArticle]    = useState<ArticleDetail | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [imgError,   setImgError]   = useState(false);
  const [viewCount,  setViewCount]  = useState<number | null>(null);
  const viewTracked  = useRef(false);   // prevent double-tracking on StrictMode re-render

  useMetaTags({
    title: article?.title ?? 'Loading article',
    description: article?.content ? article.content.replace(/<[^>]*>/g, '').slice(0, 160) : 'Latest news and updates',
    imageUrl: article?.thumbnailUrl,
    url: typeof window !== 'undefined' ? window.location.href : '',
    type: 'article',
    author: article?.authorName,
    publishedAt: article?.publishedAt,
    category: article?.categoryName,
  });

  useEffect(() => {
    if (!slug) return;

    // Reset state when slug changes (user navigates article → article)
    setLoading(true);
    setError('');
    setImgError(false);
    setViewCount(null);
    viewTracked.current = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    articlesApi.getBySlug(slug)
      .then(r => {
        const data = r.data.data;
        setArticle(data);
        setViewCount(data.views);

        // ── Track view immediately after article loads ─────────────────────
        // Only track once per slug per page load (React StrictMode calls
        // useEffect twice in dev — the ref prevents double counting)
        if (!viewTracked.current) {
          viewTracked.current = true;
          trackView(slug, data.views);
        }
      })
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── View tracking function ─────────────────────────────────────────────────
  const trackView = async (articleSlug: string, currentViews: number) => {
    try {
      // Skip tracking if this article was already viewed in this browser session
      // (prevents refresh-spamming the view count)
      const sessionKey = `viewed_${articleSlug}`;
      if (sessionStorage.getItem(sessionKey)) {
        // Already viewed this session — don't increment again, but still show count
        return;
      }

      // Call the dedicated view-tracking endpoint (POST /api/articles/{slug}/view)
      await articlesApi.trackView(articleSlug);

      // Mark as viewed in this browser session
      sessionStorage.setItem(sessionKey, '1');

      // Optimistically update the displayed view count immediately
      setViewCount(v => (v !== null ? v + 1 : currentViews + 1));
    } catch {
      // Silently ignore — view tracking failure should never break the page
    }
  };

  if (error) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 mb-4">{error}</p>
      <button onClick={() => navigate(-1)}
        className="text-brand-600 hover:underline text-sm
          flex items-center gap-1 mx-auto">
        <ArrowLeft size={14} /> Go back
      </button>
    </div>
  );

  const showThumbnail = article?.thumbnailUrl &&
    isValidUrl(article.thumbnailUrl) && !imgError;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">

      {/* Top banner ad */}
      <AdSlot placement="banner_top" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Article ──────────────────────────────────────────────────────── */}
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
                <span className="inline-block bg-brand-600 text-white text-xs
                  font-semibold px-2.5 py-1 rounded mb-3">
                  {article.categoryName}
                </span>
              </Link>

              {/* Title */}
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900
                leading-tight mb-4">
                {article.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500
                mb-5 pb-5 border-b border-gray-100">
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
                      ({formatDistanceToNow(
                        new Date(article.publishedAt), { addSuffix: true }
                      )})
                    </span>
                  </>
                )}
                {/* Show live-updated view count */}
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {viewCount !== null
                    ? viewCount.toLocaleString()
                    : article.views.toLocaleString()} views
                </span>
                <div className="ml-auto">
                  <ShareButton
                    title={article.title}
                    slug={article.slug}
                    thumbnailUrl={article.thumbnailUrl}
                    variant="button"
                  />
                </div>
              </div>

              {/* Thumbnail */}
              {showThumbnail && (
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video bg-gray-100">
                  <img
                    src={article.thumbnailUrl!}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              )}

              {/* In-content ad */}
              <AdSlot placement="inline" className="mb-6" />

              {/* Article body */}
              <div
                className="prose prose-gray max-w-none prose-headings:font-serif
                  prose-a:text-brand-600 prose-img:rounded-xl
                  prose-blockquote:border-brand-500"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </>
          ) : null}
        </article>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="space-y-5 lg:sticky lg:top-20 self-start">
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </div>
  );
}
