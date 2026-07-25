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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);
}

export default function ArticleDetailPage() {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();
  const [article,   setArticle]   = useState<ArticleDetail | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [imgError,  setImgError]  = useState(false);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const viewTracked = useRef(false);

  // Set OG meta tags for social sharing
  useMetaTags(
    article
      ? {
          title:       article.title,
          description: stripHtml(article.content),
          imageUrl:    article.thumbnailUrl,
          url:         `${window.location.origin}/news/${article.slug}`,
          type:        'article',
          author:      article.authorName,
          publishedAt: article.publishedAt,
          category:    article.categoryName,
        }
      : {
          title:       'खबर लोड हो रही है…',
          description: 'Prajatantr Ki Gunj — आपका विश्वसनीय समाचार स्रोत',
        }
  );

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    setImgError(false);
    setViewCount(null);
    viewTracked.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // FIX: uses updated route /articles/slug/{slug}
    articlesApi.getBySlug(slug)
      .then(r => {
        const data = r.data.data;
        setArticle(data);
        setViewCount(data.views);
        if (!viewTracked.current) {
          viewTracked.current = true;
          trackView(slug, data.views);
        }
      })
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const trackView = async (articleSlug: string, currentViews: number) => {
    try {
      const sessionKey = `viewed_${articleSlug}`;
      if (sessionStorage.getItem(sessionKey)) return;
      // FIX: uses updated route /articles/slug/{slug}/view
      await articlesApi.trackView(articleSlug);
      sessionStorage.setItem(sessionKey, '1');
      setViewCount(v => (v !== null ? v + 1 : currentViews + 1));
    } catch { /* ignore */ }
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

  const showThumbnail = article?.thumbnailUrl
    && isValidUrl(article.thumbnailUrl) && !imgError;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">

      <AdSlot placement="banner_top" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

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
              <Link to={`/category/${article.categoryName.toLowerCase()}`}>
                <span className="inline-block bg-brand-600 text-white text-xs
                  font-semibold px-2.5 py-1 rounded mb-3">
                  {article.categoryName}
                </span>
              </Link>

              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900
                leading-tight mb-4">
                {article.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500
                mb-5 pb-5 border-b border-gray-100">
                <span className="flex items-center gap-1.5">
                  <User size={14} /> {article.authorName}
                </span>
                {article.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {format(new Date(article.publishedAt), 'dd MMM yyyy, h:mm a')}
                    <span className="text-gray-300">
                      ({formatDistanceToNow(
                        new Date(article.publishedAt), { addSuffix: true })})
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {(viewCount ?? article.views).toLocaleString()} views
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

              {showThumbnail && (
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video bg-gray-100">
                  <img src={article.thumbnailUrl!} alt={article.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)} />
                </div>
              )}

              <AdSlot placement="inline" className="mb-6" />

              <div
                className="prose prose-gray max-w-none prose-headings:font-serif
                  prose-a:text-brand-600 prose-img:rounded-xl
                  prose-blockquote:border-brand-500"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Bottom share */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-gray-50 rounded-2xl p-5 flex flex-col sm:flex-row
                  items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">
                      यह खबर शेयर करें
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Share this article with your friends and family
                    </p>
                  </div>
                  <ShareButton
                    title={article.title}
                    slug={article.slug}
                    thumbnailUrl={article.thumbnailUrl}
                    variant="full"
                  />
                </div>
              </div>
            </>
          ) : null}
        </article>

        <aside className="space-y-5 lg:sticky lg:top-20 self-start">
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </div>
  );
}
