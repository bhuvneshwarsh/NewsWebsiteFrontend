import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ArticleListItem } from '../../types';
import ShareButton from './ShareButton';

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

function SafeImage({ src, alt, className }: {
  src: string | null; alt: string; className: string;
}) {
  const [errored, setErrored] = useState(false);
  const valid = isValidUrl(src) && !errored;

  if (!valid) {
    return (
      <div className={`${className} bg-gradient-to-br from-brand-100 to-brand-200
        flex items-center justify-center`}>
        <span className="text-brand-400 text-xs font-medium opacity-60">No Image</span>
      </div>
    );
  }

  return (
    <img src={src!} alt={alt} className={className}
      onError={() => setErrored(true)} />
  );
}

interface Props {
  article:  ArticleListItem;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: Props) {
  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : '';

  // ── Featured hero card ────────────────────────────────────────────────────
  if (featured) {
    return (
      <div className="relative group block">
        <Link to={`/news/${article.slug}`}>
          <div className="relative overflow-hidden rounded-2xl bg-gray-200 aspect-[16/9]">
            <SafeImage
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105
                transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80
              via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="inline-block bg-brand-600 text-white text-xs
                font-semibold px-2 py-0.5 rounded mb-2">
                {article.categoryName}
              </span>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-white
                leading-snug group-hover:text-brand-200 transition line-clamp-3">
                {article.title}
              </h2>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 text-white/60 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {timeAgo}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {article.views}
                  </span>
                  <span>{article.authorName}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Share button — floating top right on featured card */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100
          transition-opacity duration-200">
          <ShareButton
            title={article.title}
            slug={article.slug}
            thumbnailUrl={article.thumbnailUrl}
            variant="icon"
          />
        </div>
      </div>
    );
  }

  // ── Normal article card ───────────────────────────────────────────────────
  return (
    <div className="group flex gap-3 bg-white rounded-xl shadow-sm
      hover:shadow-md transition p-3 relative">

      {/* Thumbnail */}
      <Link to={`/news/${article.slug}`}
        className="w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
        <SafeImage
          src={article.thumbnailUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105
            transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-brand-600">
          {article.categoryName}
        </span>
        <Link to={`/news/${article.slug}`}>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug mt-0.5
            line-clamp-2 group-hover:text-brand-600 transition">
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <Clock size={10} /> {timeAgo}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={10} /> {article.views}
            </span>
          </div>

          {/* Share button — appears on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <ShareButton
              title={article.title}
              slug={article.slug}
              thumbnailUrl={article.thumbnailUrl}
              variant="icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}